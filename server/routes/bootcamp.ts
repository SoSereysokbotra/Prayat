/**
 * Level 0 — Cyber Bootcamp.
 *
 * Mandatory: the client keeps the game modes locked until both modules are
 * passed. The server owns every answer, exactly as it does for the game modes,
 * so reading the network tab during the bootcamp gives away no more than it
 * does during a scenario.
 *
 * Completion lives on the device rather than here, because there are no
 * accounts. The server's job is to say whether an answer was right; whether a
 * player has finished is a fact about that phone.
 */

import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { getBouncerModule, getUrlModule } from '../db'
import { stripBouncerRound, stripUrlCard } from '../lib/strip'
import { BAD_REQUEST, CONFLICT, NOT_FOUND, fail } from '../lib/http'
import { BOOTCAMP_PASS_RATIO, TOOL_OF_MODULE } from '../../shared/types'

export const bootcampRouter = Router()

/* Sessions are in memory. A bootcamp run is a couple of minutes long, and a
   restart mid-run costing someone three taps is not worth a table. */
interface DoorRun {
  index: number
  correct: number
}
interface UrlRun {
  order: string[]
  index: number
  correct: number
}

const doorRuns = new Map<string, DoorRun>()
const urlRuns = new Map<string, UrlRun>()

const doorSchema = z.object({ action: z.enum(['admit', 'refuse', 'demandCode']) })
const urlSchema = z.object({ cardId: z.string().min(1), verdict: z.enum(['safe', 'trash']) })

function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const swap = out[i]
    out[i] = out[j]
    out[j] = swap
  }
  return out
}

/* ---- GET /api/bootcamp/modules ------------------------------------------- */

bootcampRouter.get('/modules', (_req, res) => {
  const door = getBouncerModule()
  const urls = getUrlModule()
  const modules = []

  if (door) {
    modules.push({
      id: door.id,
      title: door.title,
      blurb: door.blurb,
      analogy: door.analogy,
      tool: TOOL_OF_MODULE['vip-club'],
      itemCount: door.rounds.length,
    })
  }
  if (urls) {
    modules.push({
      id: urls.id,
      title: urls.title,
      blurb: urls.blurb,
      analogy: urls.analogy,
      tool: TOOL_OF_MODULE['url-sorter'],
      itemCount: urls.cards.length,
    })
  }

  res.json(modules)
})

/* ---- Module 1: the VIP Club ---------------------------------------------- */

bootcampRouter.post('/vip-club/sessions', (_req, res) => {
  const module = getBouncerModule()
  if (!module || module.rounds.length === 0) {
    return fail(res, NOT_FOUND, 'module_not_found', 'the VIP Club module is not available')
  }

  const id = randomUUID()
  doorRuns.set(id, { index: 0, correct: 0 })

  res.status(201).json({
    sessionId: id,
    roundCount: module.rounds.length,
    round: stripBouncerRound(module.rounds[0]),
  })
})

bootcampRouter.post('/vip-club/sessions/:id/actions', (req, res) => {
  const parsed = doorSchema.safeParse(req.body)
  if (!parsed.success) return fail(res, BAD_REQUEST, 'invalid_request', 'action is required')

  const run = doorRuns.get(req.params.id)
  if (!run) return fail(res, NOT_FOUND, 'session_not_found', 'unknown bootcamp session')

  const module = getBouncerModule()
  if (!module) return fail(res, NOT_FOUND, 'module_not_found', 'content is gone')

  const round = module.rounds[run.index]
  if (!round) return fail(res, CONFLICT, 'run_finished', 'this run is already over')

  // demandCode is only a legitimate move once 2FA is on. Accepting it earlier
  // would give away that the answer changes, which is the lesson.
  if (parsed.data.action === 'demandCode' && !round.twoFactorOn) {
    return fail(res, CONFLICT, 'action_unavailable', 'two-factor is not switched on yet')
  }

  const isCorrect = parsed.data.action === round.correctAction

  // An unwinnable round always counts toward passing. The player is being shown
  // something, not tested on it, and failing them for a situation that had no
  // right answer would teach exactly the wrong thing.
  if (isCorrect || round.unwinnable) run.correct++

  run.index++
  const next = module.rounds[run.index] ?? null
  const done = next === null
  const passed = done && run.correct / module.rounds.length >= BOOTCAMP_PASS_RATIO

  if (done) doorRuns.delete(req.params.id)

  res.json({
    isCorrect,
    unwinnable: round.unwinnable,
    outcome: round.outcome,
    lesson: round.lesson,
    nextRound: next ? stripBouncerRound(next) : null,
    done,
    passed,
  })
})

/* ---- Module 2: the URL Sorter -------------------------------------------- */

bootcampRouter.post('/url-sorter/sessions', (_req, res) => {
  const module = getUrlModule()
  if (!module || module.cards.length === 0) {
    return fail(res, NOT_FOUND, 'module_not_found', 'the URL Sorter module is not available')
  }

  const id = randomUUID()
  const order = shuffle(module.cards.map((c) => c.id))
  urlRuns.set(id, { order, index: 0, correct: 0 })

  const first = module.cards.find((c) => c.id === order[0])
  if (!first) return fail(res, NOT_FOUND, 'card_not_found', 'deck is empty')

  res.status(201).json({
    sessionId: id,
    cardCount: module.cards.length,
    card: stripUrlCard(first),
  })
})

bootcampRouter.post('/url-sorter/sessions/:id/sorts', (req, res) => {
  const parsed = urlSchema.safeParse(req.body)
  if (!parsed.success) {
    return fail(res, BAD_REQUEST, 'invalid_request', 'cardId and verdict are required')
  }

  const run = urlRuns.get(req.params.id)
  if (!run) return fail(res, NOT_FOUND, 'session_not_found', 'unknown bootcamp session')

  const module = getUrlModule()
  if (!module) return fail(res, NOT_FOUND, 'module_not_found', 'content is gone')

  const expected = run.order[run.index]
  if (parsed.data.cardId !== expected) {
    return fail(res, CONFLICT, 'card_out_of_order', `expected card ${expected}`)
  }

  const card = module.cards.find((c) => c.id === parsed.data.cardId)
  if (!card) return fail(res, NOT_FOUND, 'card_not_found', 'no such card')

  const isCorrect = (parsed.data.verdict === 'safe') === card.isSafe
  if (isCorrect) run.correct++
  run.index++

  const nextId = run.order[run.index]
  const next = nextId ? (module.cards.find((c) => c.id === nextId) ?? null) : null
  const done = next === null
  const passed = done && run.correct / module.cards.length >= BOOTCAMP_PASS_RATIO

  if (done) urlRuns.delete(req.params.id)

  res.json({
    isCorrect,
    wasSafe: card.isSafe,
    explanation: card.explanation,
    correctSoFar: run.correct,
    answered: run.index,
    nextCard: next ? stripUrlCard(next) : null,
    done,
    passed,
  })
})
