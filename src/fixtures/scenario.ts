/**
 * Phase 3 fixtures.
 *
 * Simulates the API so the UI can be built before the backend exists and
 * before the Khmer content is written. The exported functions have the same
 * signatures `src/api/client.ts` will have in Phase 5, so swapping them is a
 * one-line import change per call site — not a rewrite.
 *
 * DELETED IN PHASE 5. Gate 5 checks that no component imports this file.
 */

import raw from '../../content/shop-payment-scam.json'
import { stripStage, toScenarioMeta } from '../../shared/strip'
import type {
  CreateSessionResponse,
  DecisionResult,
  Localized,
  OptionId,
  ScenarioFull,
  SessionSummary,
} from '../../shared/types'
import { MAX_SCORE, POINTS_PER_CORRECT } from '../../shared/types'

/* ==========================================================================
   Placeholder text
   --------------------------------------------------------------------------
   The content file ships with empty strings because Khmer is written first
   (see content/AUTHORING.md). Empty strings make it impossible to check that
   option buttons wrap, that Khmer diacritics clear their line box, or that
   the threat zone scrolls — which is exactly what Phase 3 is for.

   So: any empty field is filled with Khmer of a REALISTIC LENGTH for that
   field. These are placeholders about scam awareness in general, never
   scenario content — nobody should be able to mistake one for finished copy.

   As the writer fills the real file in, the placeholders disappear on their
   own. `hasRealContent` reports whether any are still in use.
   ========================================================================== */

const PLACEHOLDER = {
  short: {
    kh: 'អត្ថបទគំរូ​សម្រាប់​ការ​រៀបចំ​អេក្រង់',
    en: 'Placeholder text for layout',
  },
  message: {
    kh: 'នេះ​ជា​អត្ថបទ​គំរូ​ដែល​ប្រើ​សម្រាប់​ពិនិត្យ​ការ​រៀបចំ​អេក្រង់​ប៉ុណ្ណោះ មិន​មែន​ជា​ខ្លឹមសារ​ពិត​ទេ។',
    en: 'This is placeholder text used only to check screen layout. It is not real content.',
  },
  option: {
    kh: 'នេះ​ជា​ជម្រើស​គំរូ​ដែល​មាន​ប្រវែង​ប្រហាក់ប្រហែល​នឹង​ជម្រើស​ពិត ដើម្បី​ពិនិត្យ​ថា​ប៊ូតុង​អាច​រុំ​បាន​ត្រឹមត្រូវ។',
    en: 'A placeholder option roughly as long as a real one, to check that the button wraps correctly.',
  },
  rule: {
    kh: 'ស្ថាប័ន​រដ្ឋ​មិន​ដែល​ប្រមូល​ថ្លៃ​សេវា​តាម​សារ​ផ្ទាល់​ខ្លួន​ឡើយ។ នេះ​ជា​អត្ថបទ​គំរូ។',
    en: 'Government bodies never collect fees through personal messages. This is placeholder text.',
  },
} as const

let usedPlaceholder = false

function fill(value: Localized | undefined, shape: keyof typeof PLACEHOLDER): Localized {
  const kh = value?.kh?.trim()
  const en = value?.en?.trim()
  if (kh && en) return value as Localized

  usedPlaceholder = true
  return {
    kh: kh || PLACEHOLDER[shape].kh,
    en: en || PLACEHOLDER[shape].en,
  }
}

/** The scenario with every empty field replaced by a length-realistic placeholder. */
const scenario: ScenarioFull = (() => {
  const src = raw as unknown as ScenarioFull
  return {
    ...src,
    title: fill(src.title, 'short'),
    relative: { ...src.relative, name: fill(src.relative?.name, 'short') },
    stages: src.stages.map((stage) => ({
      ...stage,
      scammerMessages: stage.scammerMessages.map((m) => fill(m, 'message')),
      relativeMessage: fill(stage.relativeMessage, 'message'),
      options: stage.options.map((opt) => ({
        ...opt,
        text: fill(opt.text, 'option'),
        reply: fill(opt.reply, 'message'),
        note: opt.note ? fill(opt.note, 'message') : undefined,
      })),
    })),
    debrief: {
      ...src.debrief,
      scamName: fill(src.debrief?.scamName, 'short'),
      redFlags: src.debrief.redFlags.map((f) => fill(f, 'message')),
      rule: fill(src.debrief?.rule, 'rule'),
      realLifeAction: fill(src.debrief?.realLifeAction, 'message'),
      outcomeWin: fill(src.debrief?.outcomeWin, 'message'),
      outcomeLose: fill(src.debrief?.outcomeLose, 'message'),
      consequence: fill(src.debrief?.consequence, 'message'),
    },
  }
})()

/** False while any placeholder is still standing in for unwritten content. */
export const hasRealContent = !usedPlaceholder

/* ==========================================================================
   Fake API — same signatures as src/api/client.ts in Phase 5
   ========================================================================== */

interface FixtureSession {
  id: string
  decisions: { stageId: number; optionId: OptionId; isCorrect: boolean }[]
}

const sessions = new Map<string, FixtureSession>()

export async function listScenarios() {
  return [
    {
      id: scenario.id,
      title: scenario.title,
      scamType: scenario.scamType,
      stageCount: scenario.stages.length,
    },
  ]
}

export async function createSession(): Promise<CreateSessionResponse> {
  const id = `fixture-${Math.random().toString(36).slice(2, 10)}`
  sessions.set(id, { id, decisions: [] })
  return {
    sessionId: id,
    scenario: toScenarioMeta(scenario),
    stage: stripStage(scenario.stages[0]),
  }
}

export async function submitDecision(
  sessionId: string,
  stageId: number,
  optionId: OptionId,
): Promise<DecisionResult> {
  const session = sessions.get(sessionId)
  if (!session) throw new Error('unknown session')

  // Mirrors the server's 409s — the UI must handle them before Phase 5, not
  // discover them against the live API.
  if (session.decisions.some((d) => d.stageId === stageId)) {
    throw new Error('stage already answered')
  }
  if (stageId !== session.decisions.length + 1) {
    throw new Error('stage out of order')
  }

  const stage = scenario.stages.find((s) => s.id === stageId)
  if (!stage) throw new Error('unknown stage')

  const option = stage.options.find((o) => o.id === optionId)
  if (!option) throw new Error('unknown option')

  session.decisions.push({ stageId, optionId, isCorrect: option.isCorrect })

  const next = scenario.stages.find((s) => s.id === stageId + 1)
  return {
    isCorrect: option.isCorrect,
    relativeReply: option.reply,
    nextStage: next ? stripStage(next) : null,
    done: !next,
  }
}

export async function getDebrief(sessionId: string): Promise<SessionSummary> {
  const session = sessions.get(sessionId)
  if (!session) throw new Error('unknown session')
  if (session.decisions.length !== scenario.stages.length) {
    throw new Error('session not finished')
  }

  const score = session.decisions.filter((d) => d.isCorrect).length * POINTS_PER_CORRECT
  // Won = the FINAL decision is correct. A player can stumble at stage 1 and
  // recover — the last word before the money moves is the one that matters.
  const won = session.decisions[session.decisions.length - 1]?.isCorrect ?? false

  return {
    sessionId,
    scenarioId: scenario.id,
    decisions: session.decisions,
    score,
    maxScore: MAX_SCORE,
    level: levelFor(score),
    won,
    debrief: scenario.debrief,
  }
}

function levelFor(score: number) {
  if (score >= 500) return 'Protector' as const
  if (score >= 300) return 'Guardian' as const
  if (score >= 200) return 'Defender' as const
  if (score >= 100) return 'Alert' as const
  return 'Aware' as const
}
