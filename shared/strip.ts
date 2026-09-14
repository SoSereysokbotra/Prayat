/**
 * The answer-stripping layer.
 *
 * Converts server-side *Full shapes into the wire shapes the browser receives,
 * removing `isCorrect`, `reply` and `note`.
 *
 * EVERY response path goes through this file. One function means one place to
 * get it wrong, and one place to check.
 *
 * It lives in shared/ rather than server/lib/ so the Phase 3 fixtures use the
 * exact same implementation the server does — a second copy would be free to
 * drift, and a drifted copy is how an answer leaks. server/lib/strip.ts
 * re-exports these.
 *
 * Note this strips the *function's* output only. The full scenario data must
 * never reach the client in the first place.
 */

import type {
  Option,
  OptionFull,
  ScenarioFull,
  ScenarioMeta,
  ScenarioSummary,
  Stage,
  StageFull,
} from './types'

export function stripOption(option: OptionFull): Option {
  // Explicit construction, not destructuring-with-rest: a new field added to
  // OptionFull later must be added here deliberately, rather than leaking by
  // default.
  return {
    id: option.id,
    text: option.text,
  }
}

export function stripStage(stage: StageFull): Stage {
  return {
    id: stage.id,
    scammerMessages: stage.scammerMessages,
    relativeMessage: stage.relativeMessage,
    options: stage.options.map(stripOption),
  }
}

export function toScenarioMeta(scenario: ScenarioFull): ScenarioMeta {
  return {
    id: scenario.id,
    title: scenario.title,
    scamType: scenario.scamType,
    relative: scenario.relative,
    stageCount: scenario.stages.length,
  }
}

export function toScenarioSummary(scenario: ScenarioFull): ScenarioSummary {
  return {
    id: scenario.id,
    title: scenario.title,
    scamType: scenario.scamType,
    stageCount: scenario.stages.length,
  }
}

/**
 * Test hook: true if a serialized payload contains anything that should have
 * been stripped. Used by the Gate 4 check that reads the raw response.
 */
export function containsAnswers(payload: unknown): boolean {
  return /"(isCorrect|reply|note)"\s*:/.test(JSON.stringify(payload))
}

/* ==========================================================================
   Speed Triage and The Investigation
   --------------------------------------------------------------------------
   Same rule as Guardian: the browser learns nothing it has not earned.

   A Triage card ships without isScam and without its explanation — knowing
   the explanation would give away the verdict, so both leave together.

   An Investigation ships its conversation but not its flags. The player is
   told HOW MANY red flags there are, because the design calls for "find every
   red flag" and a hunt with no known end is a different, worse game. Which
   elements they are is decided by the server, one tap at a time.
   ========================================================================== */

import type {
  Investigation,
  InvestigationFull,
  TriageCard,
  TriageCardFull,
} from './types'

export function stripTriageCard(card: TriageCardFull): TriageCard {
  // Explicit construction, not rest-spread: a field added to TriageCardFull
  // later must be exposed deliberately rather than leaking by default.
  return {
    id: card.id,
    surface: card.surface,
    category: card.category,
    sender: card.sender,
    body: card.body,
    ...(card.meta !== undefined ? { meta: card.meta } : {}),
  }
}

export function stripInvestigation(investigation: InvestigationFull): Investigation {
  return {
    id: investigation.id,
    title: investigation.title,
    category: investigation.category,
    durationSeconds: investigation.durationSeconds,
    elements: investigation.elements,
    rule: investigation.rule,
    flagCount: investigation.flags.length,
  }
}
