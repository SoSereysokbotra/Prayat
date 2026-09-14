/**
 * The Investigation.
 *
 * The browser receives the conversation and the NUMBER of red flags in it, but
 * never which elements they are. Every tap is a round trip: the server decides
 * hit or miss. That costs latency on a hotspot, and it is the only way the
 * claim "the answer key never reaches the browser" survives in this mode.
 *
 * A wrong tap costs time, not the run. Unlimited free taps would let a player
 * tap every element and brute-force a perfect score, which makes the mode
 * meaningless; ending the run on a wrong tap would punish the exploration the
 * mode is trying to teach.
 */

import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db, getInvestigation, listInvestigations } from '../db'
import { stripInvestigation } from '../lib/strip'
import { investigationPoints, levelFor } from '../lib/scoring'
import { BAD_REQUEST, CONFLICT, NOT_FOUND, fail } from '../lib/http'
import { INVESTIGATION_WRONG_TAP_PENALTY_SECONDS } from '../../shared/types'

export const investigationRouter = Router()

const createSchema = z.object({
  investigationId: z.string().min(1).optional(),
  language: z.enum(['kh', 'en']),
})

const tapSchema = z.object({ elementId: z.string().min(1) })

interface SessionRow {
  id: string
  mode: string
  scenario_id: string | null
  started_at: number
  finished_at: number | null
  score: number
}

interface TapRow {
  element_id: string
  hit: number
}

const insertSession = db.prepare(
  `INSERT INTO sessions (id, mode, scenario_id, language, started_at)
   VALUES (?, 'investigation', ?, ?, ?)`,
)
const selectSession = db.prepare('SELECT * FROM sessions WHERE id = ?')
const selectTaps = db.prepare(
  'SELECT element_id, hit FROM investigation_taps WHERE session_id = ? ORDER BY id',
)
const insertTap = db.prepare(
  'INSERT INTO investigation_taps (session_id, element_id, hit, tapped_at) VALUES (?, ?, ?, ?)',
)
const finishSession = db.prepare(
  'UPDATE sessions SET finished_at = ?, score = ?, won = ? WHERE id = ?',
)

/* ---- GET /api/investigations --------------------------------------------- */

investigationRouter.get('/', (_req, res) => {
  res.json(
    listInvestigations().map((i) => ({
      id: i.id,
      title: i.title,
      category: i.category,
      durationSeconds: i.durationSeconds,
      flagCount: i.flags.length,
    })),
  )
})

/* ---- POST /api/investigations/sessions ----------------------------------- */

investigationRouter.post('/sessions', (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return fail(res, BAD_REQUEST, 'invalid_request', 'language is required')

  const investigation = parsed.data.investigationId
    ? getInvestigation(parsed.data.investigationId)
    : listInvestigations()[0]

  if (!investigation) {
    return fail(res, NOT_FOUND, 'investigation_not_found', 'no investigation available')
  }

  const id = randomUUID()
  insertSession.run(id, investigation.id, parsed.data.language, Date.now())

  res.status(201).json({
    sessionId: id,
    investigation: stripInvestigation(investigation),
  })
})

/* ---- POST /api/investigations/sessions/:id/taps -------------------------- */

investigationRouter.post('/sessions/:id/taps', (req, res) => {
  const parsed = tapSchema.safeParse(req.body)
  if (!parsed.success) return fail(res, BAD_REQUEST, 'invalid_request', 'elementId is required')

  const session = selectSession.get(req.params.id) as SessionRow | undefined
  if (!session || session.mode !== 'investigation') {
    return fail(res, NOT_FOUND, 'session_not_found', 'unknown investigation session')
  }
  if (session.finished_at !== null) {
    return fail(res, CONFLICT, 'session_finished', 'this investigation is already over')
  }

  const investigation = getInvestigation(session.scenario_id ?? '')
  if (!investigation) return fail(res, NOT_FOUND, 'investigation_not_found', 'content is gone')

  const { elementId } = parsed.data
  if (!investigation.elements.some((e) => e.id === elementId)) {
    return fail(res, NOT_FOUND, 'element_not_found', 'no such element')
  }

  const flag = investigation.flags.find((f) => f.elementId === elementId)
  const hit = flag !== undefined

  try {
    insertTap.run(session.id, elementId, hit ? 1 : 0, Date.now())
  } catch {
    // Tapping the same element twice must neither score twice nor be punished
    // twice — it is a mis-tap, not a new attempt.
    return fail(res, CONFLICT, 'element_already_tapped', 'you already tapped that')
  }

  const taps = selectTaps.all(session.id) as TapRow[]
  const found = taps.filter((t) => t.hit === 1).length
  const done = found >= investigation.flags.length

  if (done) {
    finishSession.run(Date.now(), investigationPoints(found), 1, session.id)
  }

  res.json({
    hit,
    elementId,
    explanation: flag ? flag.explanation : null,
    found,
    flagCount: investigation.flags.length,
    penaltySeconds: hit ? 0 : INVESTIGATION_WRONG_TAP_PENALTY_SECONDS,
    done,
  })
})

/* ---- POST /api/investigations/sessions/:id/finish ------------------------ */

/** Called when the clock runs out. Idempotent — the timer is client-side and
 *  a flaky connection should not be able to break a finished run. */
investigationRouter.post('/sessions/:id/finish', (req, res) => {
  const session = selectSession.get(req.params.id) as SessionRow | undefined
  if (!session || session.mode !== 'investigation') {
    return fail(res, NOT_FOUND, 'session_not_found', 'unknown investigation session')
  }

  const investigation = getInvestigation(session.scenario_id ?? '')
  if (!investigation) return fail(res, NOT_FOUND, 'investigation_not_found', 'content is gone')

  const taps = selectTaps.all(session.id) as TapRow[]
  const found = taps.filter((t) => t.hit === 1).length

  if (session.finished_at === null) {
    finishSession.run(
      Date.now(),
      investigationPoints(found),
      found >= investigation.flags.length ? 1 : 0,
      session.id,
    )
  }

  const foundIds = new Set(taps.filter((t) => t.hit === 1).map((t) => t.element_id))

  res.json({
    sessionId: session.id,
    investigationId: investigation.id,
    found,
    flagCount: investigation.flags.length,
    score: investigationPoints(found),
    // Only now — the run is over, so naming what was missed is the lesson
    // rather than a spoiler.
    missed: investigation.flags.filter((f) => !foundIds.has(f.elementId)),
    rule: investigation.rule,
    level: levelFor(investigationPoints(found)),
    complete: found >= investigation.flags.length,
  })
})
