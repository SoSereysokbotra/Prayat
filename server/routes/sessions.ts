/**
 * Sessions — the endpoints that matter.
 *
 * The server owns the answer key. The browser is never told which option is
 * correct until after it has committed to one, and the ordering rules below
 * are what make the score mean anything.
 */

import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db, getScenario } from '../db'
import { stripStage, toScenarioMeta } from '../lib/strip'
import { dialogueFor } from '../lib/dialogue'
import { levelFor, scoreFor, wonBy } from '../lib/scoring'
import { BAD_REQUEST, CONFLICT, NOT_FOUND, fail } from '../lib/http'
import { MAX_SCORE, type DecisionRecord, type OptionId } from '../../shared/types'

export const sessionsRouter = Router()

const createSchema = z.object({
  scenarioId: z.string().min(1),
  language: z.enum(['kh', 'en']),
})

const decisionSchema = z.object({
  stageId: z.number().int().positive(),
  optionId: z.enum(['a', 'b', 'c', 'd']),
})

interface SessionRow {
  id: string
  scenario_id: string
  language: string
  started_at: number
  finished_at: number | null
  score: number
  won: number | null
}

interface DecisionRow {
  stage_id: number
  option_id: string
  is_correct: number
  decided_at: number
}

const insertSession = db.prepare(`
  INSERT INTO sessions (id, scenario_id, language, started_at)
  VALUES (?, ?, ?, ?)
`)

const selectSession = db.prepare('SELECT * FROM sessions WHERE id = ?')

const selectDecisions = db.prepare(
  'SELECT stage_id, option_id, is_correct, decided_at FROM decisions WHERE session_id = ? ORDER BY stage_id',
)

const insertDecision = db.prepare(`
  INSERT INTO decisions (session_id, stage_id, option_id, is_correct, decided_at)
  VALUES (?, ?, ?, ?, ?)
`)

const finishSession = db.prepare(
  'UPDATE sessions SET finished_at = ?, score = ?, won = ? WHERE id = ?',
)

function toRecords(rows: DecisionRow[]): DecisionRecord[] {
  return rows.map((r) => ({
    stageId: r.stage_id,
    optionId: r.option_id as OptionId,
    isCorrect: r.is_correct === 1,
  }))
}

/* ---- POST /api/sessions -------------------------------------------------- */

sessionsRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    return fail(res, BAD_REQUEST, 'invalid_request', 'scenarioId and language are required')
  }

  const scenario = getScenario(parsed.data.scenarioId)
  if (!scenario) {
    return fail(res, NOT_FOUND, 'scenario_not_found', `no scenario "${parsed.data.scenarioId}"`)
  }

  const id = randomUUID()
  insertSession.run(id, scenario.id, parsed.data.language, Date.now())

  // Stage 1 only, stripped. Later stages are never sent until earned, so a
  // judge reading the network tab sees no spoilers. The wording may be
  // AI-varied (see lib/dialogue); the options and answers never are.
  const first = scenario.stages[0]
  const dialogue = await dialogueFor(scenario, first, parsed.data.language, id)
  return res.status(201).json({
    sessionId: id,
    scenario: toScenarioMeta(scenario),
    stage: stripStage({ ...first, ...dialogue }),
  })
})

/* ---- POST /api/sessions/:id/decisions ------------------------------------ */

sessionsRouter.post('/:id/decisions', async (req, res) => {
  const parsed = decisionSchema.safeParse(req.body)
  if (!parsed.success) {
    return fail(res, BAD_REQUEST, 'invalid_request', 'stageId and optionId are required')
  }

  const session = selectSession.get(req.params.id) as SessionRow | undefined
  if (!session) return fail(res, NOT_FOUND, 'session_not_found', 'unknown session')

  if (session.finished_at !== null) {
    return fail(res, CONFLICT, 'session_finished', 'this session is already finished')
  }

  const scenario = getScenario(session.scenario_id)
  if (!scenario) return fail(res, NOT_FOUND, 'scenario_not_found', 'scenario is gone')

  const existing = selectDecisions.all(session.id) as DecisionRow[]
  const { stageId, optionId } = parsed.data

  // Answering the same stage twice, or skipping ahead, would both make the
  // score meaningless. UNIQUE(session_id, stage_id) is the backstop.
  if (existing.some((d) => d.stage_id === stageId)) {
    return fail(res, CONFLICT, 'stage_already_answered', `stage ${stageId} is already answered`)
  }
  if (stageId !== existing.length + 1) {
    return fail(
      res,
      CONFLICT,
      'stage_out_of_order',
      `expected stage ${existing.length + 1}, received ${stageId}`,
    )
  }

  const stage = scenario.stages.find((s) => s.id === stageId)
  if (!stage) return fail(res, NOT_FOUND, 'stage_not_found', `no stage ${stageId}`)

  const option = stage.options.find((o) => o.id === optionId)
  if (!option) return fail(res, NOT_FOUND, 'option_not_found', `no option "${optionId}"`)

  try {
    insertDecision.run(session.id, stageId, optionId, option.isCorrect ? 1 : 0, Date.now())
  } catch {
    // Lost a race with a simultaneous identical request.
    return fail(res, CONFLICT, 'stage_already_answered', `stage ${stageId} is already answered`)
  }

  const records = toRecords(selectDecisions.all(session.id) as DecisionRow[])
  const next = scenario.stages.find((s) => s.id === stageId + 1) ?? null
  const done = next === null

  if (done) {
    finishSession.run(Date.now(), scoreFor(records), wonBy(records) ? 1 : 0, session.id)
  }

  const nextStage = next
    ? stripStage({ ...next, ...(await dialogueFor(scenario, next, session.language as 'kh' | 'en', session.id)) })
    : null

  return res.json({
    isCorrect: option.isCorrect,
    relativeReply: option.reply,
    nextStage,
    done,
  })
})

/* ---- GET /api/sessions/:id/debrief --------------------------------------- */

sessionsRouter.get('/:id/debrief', (req, res) => {
  const session = selectSession.get(req.params.id) as SessionRow | undefined
  if (!session) return fail(res, NOT_FOUND, 'session_not_found', 'unknown session')

  if (session.finished_at === null) {
    return fail(res, CONFLICT, 'session_unfinished', 'finish the scenario before the debrief')
  }

  const scenario = getScenario(session.scenario_id)
  if (!scenario) return fail(res, NOT_FOUND, 'scenario_not_found', 'scenario is gone')

  const records = toRecords(selectDecisions.all(session.id) as DecisionRow[])

  return res.json({
    sessionId: session.id,
    scenarioId: session.scenario_id,
    decisions: records,
    score: session.score,
    maxScore: MAX_SCORE,
    level: levelFor(session.score),
    won: session.won === 1,
    debrief: scenario.debrief,
  })
})

/* ---- GET /api/sessions/:id ----------------------------------------------- */

/** The endpoint to show a judge who asks whether anything is actually stored. */
sessionsRouter.get('/:id', (req, res) => {
  const session = selectSession.get(req.params.id) as SessionRow | undefined
  if (!session) return fail(res, NOT_FOUND, 'session_not_found', 'unknown session')

  const rows = selectDecisions.all(session.id) as DecisionRow[]

  return res.json({
    sessionId: session.id,
    scenarioId: session.scenario_id,
    language: session.language,
    startedAt: session.started_at,
    finishedAt: session.finished_at,
    score: session.score,
    won: session.won === null ? null : session.won === 1,
    decisions: rows.map((r) => ({
      stageId: r.stage_id,
      optionId: r.option_id,
      isCorrect: r.is_correct === 1,
      decidedAt: r.decided_at,
    })),
  })
})
