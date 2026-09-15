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
    name: Localized // "Uncle Chan"
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

/* ==========================================================================
   Scam categories
   --------------------------------------------------------------------------
   The four buckets from the game design doc. Every scorable item in every
   mode belongs to exactly one, which is what makes a per-category breakdown
   possible without a second scoring system.
   ========================================================================== */

export type ScamCategory = 'authority' | 'opportunity' | 'trust' | 'technical'

export const SCAM_CATEGORIES: readonly ScamCategory[] = [
  'authority',
  'opportunity',
  'trust',
  'technical',
] as const

/** Which category a Guardian scenario's scamType belongs to. */
export const CATEGORY_OF_SCAM_TYPE: Record<ScamType, ScamCategory> = {
  government: 'authority',
  job: 'opportunity',
  crypto: 'opportunity',
  romance: 'trust',
  malware: 'technical',
}

/* ==========================================================================
   Resistance Points — one currency across all three modes
   --------------------------------------------------------------------------
   Guardian decision      100
   Triage card             10 x streak multiplier, applied per card
   Investigation flag      25

   The 0-1000 per-category score from the design doc is DERIVED from these —
   points earned in a category over points available in it — not a second
   currency. One definition, in server/lib/scoring.ts.
   ========================================================================== */

export const POINTS_TRIAGE_CARD = 10
export const POINTS_INVESTIGATION_FLAG = 25

/** Streak multiplier applied at the moment a card is answered, never retroactively. */
export const STREAK_TIERS = [
  { at: 10, multiplier: 2 },
  { at: 5, multiplier: 1.5 },
] as const

export type GameMode = 'guardian' | 'triage' | 'investigation'

export interface CategoryScore {
  category: ScamCategory
  earned: number
  available: number
  /** 0-1000, the design doc's scale. Derived, never stored. */
  rating: number
}

/* ==========================================================================
   Speed Triage
   ========================================================================== */

/**
 * The chrome a card is dressed in. The card is rendered as HTML, not shipped
 * as an image: an image cannot answer the KH/EN toggle, cannot be edited
 * without re-exporting an asset, and fifty PNGs would eat the offline cache.
 */
export type CardSurface = 'sms' | 'telegram' | 'facebook' | 'url-bar' | 'qr' | 'receipt'

export interface TriageCardFull {
  id: string
  surface: CardSurface
  category: ScamCategory
  /** Phone number, page name, sender — whatever the surface puts in its header. */
  sender: Localized
  body: Localized
  /** Surface-specific extra: a URL, an amount, a transaction id. */
  meta?: Localized
  isScam: boolean // NEVER sent to the client
  /** Two sentences at most: name the red flag, then the rule it teaches. */
  explanation: Localized // NEVER sent before the player answers
}

export type TriageCard = Omit<TriageCardFull, 'isScam' | 'explanation'>

export interface TriageDeck {
  id: string
  title: Localized
  cards: TriageCardFull[]
}

export type TriageVerdict = 'real' | 'scam'

export interface TriageAnswerResult {
  isCorrect: boolean
  /** What it actually was — disclosed only now. */
  wasScam: boolean
  explanation: Localized
  pointsAwarded: number
  multiplier: number
  streak: number
  mistakes: number
  /** null when the run is over. */
  nextCard: TriageCard | null
  done: boolean
}

export interface TriageSummary {
  sessionId: string
  score: number
  cardsAnswered: number
  correct: number
  mistakes: number
  bestStreak: number
  level: Level
}

/** Three mistakes end a run. A timeout is a mistake, not merely a broken streak. */
export const TRIAGE_MAX_MISTAKES = 3
export const TRIAGE_SECONDS_PER_CARD = 5

/* ==========================================================================
   The Investigation
   ========================================================================== */

/**
 * Tappable units are discrete elements, never free text. Khmer is written
 * without spaces between words, so a word-level tap target is not merely hard
 * to hit — it is not well defined.
 */
export type ElementKind =
  | 'message'
  | 'link'
  | 'qr'
  | 'phone'
  | 'amount'
  | 'sender'
  | 'file'
  | 'timestamp'

export interface InvestigationElement {
  id: string
  kind: ElementKind
  /** 'them' renders left, 'you' renders right — same as the chat. */
  from: 'them' | 'you'
  text: Localized
}

export interface InvestigationFlagFull {
  elementId: string
  explanation: Localized
}

export interface InvestigationFull {
  id: string
  title: Localized
  category: ScamCategory
  durationSeconds: number
  elements: InvestigationElement[]
  flags: InvestigationFlagFull[] // NEVER sent to the client
  rule: Localized
}

/** What the browser receives: the conversation, and nothing about which parts matter. */
export type Investigation = Omit<InvestigationFull, 'flags'> & { flagCount: number }

export interface TapResult {
  hit: boolean
  elementId: string
  /** Present only on a hit. */
  explanation: Localized | null
  found: number
  flagCount: number
  /** Seconds added to the clock for a wrong tap. Negative time, positive number. */
  penaltySeconds: number
  done: boolean
}

export interface InvestigationSummary {
  sessionId: string
  investigationId: string
  found: number
  flagCount: number
  score: number
  missed: InvestigationFlagFull[]
  rule: Localized
  level: Level
  /** True when every flag was found before the clock ran out. */
  complete: boolean
}

/** A wrong tap costs time, not the run. Unlimited taps would let a player
 *  brute-force every element and make the mode meaningless. */
export const INVESTIGATION_WRONG_TAP_PENALTY_SECONDS = 10
export const INVESTIGATION_DEFAULT_SECONDS = 180

/* ==========================================================================
   Level 0 — Cyber Bootcamp
   --------------------------------------------------------------------------
   Framed as the start of the game, not a gate before it. Three short
   mini-games, each ~1 minute, each awarding a TOOL rather than a grade. A
   tool changes how the other modes play, so the foundational learning pays
   off where the player actually feels it.

   All three run on the device: none of them has an answer worth hiding
   behind the server (the coffee shop is a reflex; the door shows the code
   or not; the sorter's rule is the lesson itself). Only whether this phone
   has passed them is stored, in localStorage — see src/store/bootcampStore.
   ========================================================================== */

export type BootcampModuleId = 'network' | 'vip-club' | 'url-sorter'

/** Play order. */
export const BOOTCAMP_MODULE_IDS: readonly BootcampModuleId[] = ['network', 'vip-club', 'url-sorter'] as const

/** What passing a module gives you. */
export type ToolId = 'shield-badge' | 'authenticator-token' | 'magnifying-glass'

export const TOOL_OF_MODULE: Record<BootcampModuleId, ToolId> = {
  network: 'shield-badge',
  'vip-club': 'authenticator-token',
  'url-sorter': 'magnifying-glass',
}
