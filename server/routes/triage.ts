/**
 * Speed Triage.
 *
 * Same rule as Guardian: the server owns the verdict. The browser is handed a
 * card with no `isScam` and no explanation, and learns both only after it has
 * committed to REAL or SCAM.
 *
 * A timeout is submitted as a third verdict and counts as a mistake. If a
 * timeout only broke the streak, a player who never taps anything could never
 * fail, and the run would be unloseable.
 */

import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db, getDeck, listDecks } from '../db'
import { stripTriageCard } from '../lib/strip'
import { levelFor, streakMultiplier, triageCardPoints } from '../lib/scoring'
import { BAD_REQUEST, CONFLICT, NOT_FOUND, fail } from '../lib/http'
import { TRIAGE_MAX_MISTAKES, type TriageCardFull } from '../../shared/types'

export const triageRouter = Router()

const createSchema = z.object({
  deckId: z.string().min(1).optional(),
  language: z.enum(['kh', 'en']),
})

const answerSchema = z.object({
  cardId: z.string().min(1),
  // 'timeout' is a real verdict, not an absence of one.
  verdict: z.enum(['real', 'scam', 'timeout']),
})

interface SessionRow {
  id: string
  mode: string
  scenario_id: string | null
  finished_at: number | null
  score: number
}

interface AnswerRow {
  card_id: string
  is_correct: number
  points: number
  category: string
}

const insertSession = db.prepare(
  `INSERT INTO sessions (id, mode, scenario_id, language, started_at) VALUES (?, 'triage', ?, ?, ?)`,
)
const selectSession = db.prepare('SELECT * FROM sessions WHERE id = ?')
const selectAnswers = db.prepare(
  'SELECT card_id, is_correct, points, category FROM triage_answers WHERE session_id = ? ORDER BY id',
)
const insertAnswer = db.prepare(`
  INSERT INTO triage_answers
    (session_id, card_id, verdict, is_correct, points, multiplier, category, answered_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`)
const finishSession = db.prepare(
  'UPDATE sessions SET finished_at = ?, score = ?, won = ? WHERE id = ?',
)

/**
 * Deck order is shuffled per session and stored on the session row, so a
 * player replaying does not meet the same sequence, and so the server — not
 * the client — decides what comes next.
 */
const orders = new Map<string, string[]>()

function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function currentStreak(rows: AnswerRow[]): number {
  let streak = 0
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].is_correct === 1) streak++
    else break
  }
  return streak
}

function bestStreak(rows: AnswerRow[]): number {
  let best = 0
  let run = 0
  for (const r of rows) {
    if (r.is_correct === 1) {
      run++
      best = Math.max(best, run)
    } else run = 0
  }
  return best
}

/* ---- GET /api/triage/decks ----------------------------------------------- */

triageRouter.get('/decks', (_req, res) => {
  res.json(
    listDecks().map((d) => ({ id: d.id, title: d.title, cardCount: d.cards.length })),
  )
})

/* ---- POST /api/triage/sessions ------------------------------------------- */

triageRouter.post('/sessions', (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return fail(res, BAD_REQUEST, 'invalid_request', 'language is required')

  const deck = parsed.data.deckId ? getDeck(parsed.data.deckId) : listDecks()[0]
  if (!deck) return fail(res, NOT_FOUND, 'deck_not_found', 'no triage deck available')
  if (deck.cards.length === 0) return fail(res, NOT_FOUND, 'deck_empty', 'that deck has no cards')

  const id = randomUUID()
  insertSession.run(id, deck.id, parsed.data.language, Date.now())

  const order = shuffle(deck.cards.map((c) => c.id))
  orders.set(id, order)

  const first = deck.cards.find((c) => c.id === order[0]) as TriageCardFull

  res.status(201).json({
    sessionId: id,
    deckId: deck.id,
    cardCount: deck.cards.length,
    maxMistakes: TRIAGE_MAX_MISTAKES,
    card: stripTriageCard(first),
  })
})

/* ---- POST /api/triage/sessions/:id/answers ------------------------------- */

triageRouter.post('/sessions/:id/answers', (req, res) => {
  const parsed = answerSchema.safeParse(req.body)
  if (!parsed.success) {
    return fail(res, BAD_REQUEST, 'invalid_request', 'cardId and verdict are required')
  }

  const session = selectSession.get(req.params.id) as SessionRow | undefined
  if (!session || session.mode !== 'triage') {
    return fail(res, NOT_FOUND, 'session_not_found', 'unknown triage session')
  }
  if (session.finished_at !== null) {
    return fail(res, CONFLICT, 'session_finished', 'this run is already over')
  }

  const deck = getDeck(session.scenario_id ?? '')
  if (!deck) return fail(res, NOT_FOUND, 'deck_not_found', 'deck is gone')

  const answered = selectAnswers.all(session.id) as AnswerRow[]
  const order = orders.get(session.id) ?? deck.cards.map((c) => c.id)

  // The next card is whatever the server says it is. Answering any other card
  // means the client is out of step with the run.
  const expected = order[answered.length]
  if (parsed.data.cardId !== expected) {
    return fail(res, CONFLICT, 'card_out_of_order', `expected card ${expected}`)
  }

  const card = deck.cards.find((c) => c.id === parsed.data.cardId)
  if (!card) return fail(res, NOT_FOUND, 'card_not_found', 'no such card')

  const { verdict } = parsed.data
  const isCorrect =
    verdict === 'timeout' ? false : (verdict === 'scam') === card.isScam

  // The multiplier comes from the streak BEFORE this card and applies to this
  // card alone — never retroactively to points already banked.
  const streakBefore = currentStreak(answered)
  const multiplier = streakMultiplier(streakBefore)
  const points = isCorrect ? triageCardPoints(streakBefore) : 0

  try {
    insertAnswer.run(
      session.id,
      card.id,
      verdict,
      isCorrect ? 1 : 0,
      points,
      multiplier,
      card.category,
      Date.now(),
    )
  } catch {
    return fail(res, CONFLICT, 'card_already_answered', 'that card is already answered')
  }

  const rows = selectAnswers.all(session.id) as AnswerRow[]
  const mistakes = rows.filter((r) => r.is_correct === 0).length
  const score = rows.reduce((sum, r) => sum + r.points, 0)

  const outOfCards = rows.length >= order.length
  const done = mistakes >= TRIAGE_MAX_MISTAKES || outOfCards

  let nextCard = null
  if (!done) {
    const nextId = order[rows.length]
    const found = deck.cards.find((c) => c.id === nextId)
    nextCard = found ? stripTriageCard(found) : null
  }

  if (done) {
    // "Won" for a run means surviving the deck rather than running out of lives.
    finishSession.run(Date.now(), score, mistakes < TRIAGE_MAX_MISTAKES ? 1 : 0, session.id)
    orders.delete(session.id)
  }

  res.json({
    isCorrect,
    wasScam: card.isScam,
    explanation: card.explanation,
    pointsAwarded: points,
    multiplier,
    streak: currentStreak(rows),
    mistakes,
    nextCard,
    done,
  })
})

/* ---- GET /api/triage/sessions/:id ---------------------------------------- */

triageRouter.get('/sessions/:id', (req, res) => {
  const session = selectSession.get(req.params.id) as SessionRow | undefined
  if (!session || session.mode !== 'triage') {
    return fail(res, NOT_FOUND, 'session_not_found', 'unknown triage session')
  }

  const rows = selectAnswers.all(session.id) as AnswerRow[]
  const correct = rows.filter((r) => r.is_correct === 1).length

  res.json({
    sessionId: session.id,
    score: session.score,
    cardsAnswered: rows.length,
    correct,
    mistakes: rows.length - correct,
    bestStreak: bestStreak(rows),
    level: levelFor(session.score),
  })
})
