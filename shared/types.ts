/**
 * Prayat — the contract.
 *
 * Imported by BOTH the client and the server. This is the main practical
 * benefit of one repo: the contract cannot drift.
 *
 * FROZEN at Phase 2. Changing a type here changes both sides at once —
 * that is the point, but it also means a change on day 5 is expensive.
 * Think before editing.
 *
 * The split that matters:
 *   *Full types  — server-side shape, CONTAINS THE ANSWERS
 *   wire types   — what the browser actually receives, answers removed
 *
 * server/lib/strip.ts is the only place that converts one into the other.
 */

export type Localized = { kh: string; en: string }

export type LanguageCode = 'kh' | 'en'

/* ==========================================================================
   Content — server-side shape, includes answers.
   NEVER send one of these to the client.
   ========================================================================== */

export type ScamType = 'government' | 'job' | 'crypto' | 'romance' | 'malware'

export interface ScenarioFull {
  id: string
  title: Localized
  scamType: ScamType
  relative: {
    name: Localized // "Auntie Sothea"
    age: number // 54
    avatar: string
  }
  stages: StageFull[] // exactly 3
  debrief: Debrief
}

export interface StageFull {
  id: number // 1, 2, 3
  scammerMessages: Localized[] // shown in the read-only threat zone
  relativeMessage: Localized // what she says to the player
  options: OptionFull[] // exactly 4
}

export type OptionId = 'a' | 'b' | 'c' | 'd'

/**
 * Option roles are fixed across every stage. They are a teaching device,
 * not decoration — if the wrong answer is obviously stupid, no learning
 * happens.
 *
 *   a  the trap        — sounds like caring reassurance
 *   b  sounds smart    — hands the scammer a chance to send a fake link
 *   c  correct         — requires knowing the rule about official channels
 *   d  too slow        — reasonable, but she pays before it helps
 *
 * The correct answer is not always 'c'. The role is what matters; the id
 * that carries it is set per stage in the content file.
 */
export interface OptionFull {
  id: OptionId
  text: Localized
  isCorrect: boolean // NEVER sent to the client
  reply: Localized // her response to this specific choice
  note?: Localized // why it was tempting — debrief only
}

export interface Debrief {
  scamName: Localized
  redFlags: Localized[] // exactly 3
  rule: Localized // the one rule — heaviest element on the debrief screen
  realLifeAction: Localized
  outcomeWin: Localized
  outcomeLose: Localized
  /** The three-days-later scene. Shown full-screen before the lose debrief. */
  consequence: Localized
}

/* ==========================================================================
   Wire format — what the client actually receives.
   ========================================================================== */

export type Option = Omit<OptionFull, 'isCorrect' | 'reply' | 'note'>
export type Stage = Omit<StageFull, 'options'> & { options: Option[] }

/** Catalogue entry. No stages, no answers. */
export interface ScenarioSummary {
  id: string
  title: Localized
  scamType: ScamType
  stageCount: number
}

/** Scenario metadata sent alongside stage 1. Still no answers. */
export type ScenarioMeta = Omit<ScenarioFull, 'stages' | 'debrief'> & {
  stageCount: number
}

export interface DecisionResult {
  isCorrect: boolean
  relativeReply: Localized
  nextStage: Stage | null // null means the scenario is over
  done: boolean
}

export type Level = 'Aware' | 'Alert' | 'Defender' | 'Guardian' | 'Protector'

export interface DecisionRecord {
  stageId: number
  optionId: OptionId
  isCorrect: boolean
}

export interface SessionSummary {
  sessionId: string
  scenarioId: string
  decisions: DecisionRecord[]
  score: number
  maxScore: number
  level: Level
  won: boolean
  debrief: Debrief
}

/* ==========================================================================
   Request bodies
   ========================================================================== */

export interface CreateSessionRequest {
  scenarioId: string
  language: LanguageCode
}

export interface CreateSessionResponse {
  sessionId: string
  scenario: ScenarioMeta
  stage: Stage
}

export interface SubmitDecisionRequest {
  stageId: number
  optionId: OptionId
}

export interface HealthResponse {
  status: 'ok'
  uptime: number
  scenariosLoaded: number
}

export interface ApiError {
  error: string
  message: string
}

/* ==========================================================================
   Invariants — the content file and the scoring code both depend on these.
   Defined once so nothing drifts.
   ========================================================================== */

export const STAGE_COUNT = 3
export const OPTIONS_PER_STAGE = 4
export const RED_FLAG_COUNT = 3
export const POINTS_PER_CORRECT = 100
export const MAX_SCORE = STAGE_COUNT * POINTS_PER_CORRECT // 300

export const OPTION_IDS: readonly OptionId[] = ['a', 'b', 'c', 'd'] as const
