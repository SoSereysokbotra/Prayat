/**
 * Every fetch call in the app lives here.
 *
 * No component calls `fetch` directly. When the API shape changes, one file
 * changes.
 *
 * These signatures match the Phase 3 fixtures deliberately — swapping them in
 * was an import change per call site, not a rewrite, because shared/types.ts
 * was frozen before either side was built.
 */

import type {
  CreateSessionResponse,
  DecisionResult,
  LanguageCode,
  Localized,
  OptionId,
  ScenarioSummary,
  SessionSummary,
} from '../../shared/types'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: init?.body ? { 'content-type': 'application/json' } : undefined,
    })
  } catch {
    // Offline, or the Render service is cold-starting. The caller shows an
    // error state; it must never be a white screen.
    throw new ApiError(0, 'network', 'could not reach the server')
  }

  const text = await response.text()
  let body: unknown = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    throw new ApiError(response.status, 'bad_response', 'server returned malformed data')
  }

  if (!response.ok) {
    const err = body as { error?: string; message?: string } | null
    throw new ApiError(response.status, err?.error ?? 'unknown', err?.message ?? 'request failed')
  }

  return body as T
}

/* ==========================================================================
   Placeholder backfill
   --------------------------------------------------------------------------
   The content file ships with empty strings because Khmer is written first
   (see content/AUTHORING.md). Empty strings render as empty buttons, which
   makes the app impossible to test or demo while the scenario is being
   written.

   Any empty field is filled with Khmer of a realistic length for its shape,
   and `placeholdersInUse` flips to true. Home renders a visible banner
   whenever it does, so unwritten content can never be mistaken for finished
   content — the banner is the safeguard, not the absence of the backfill.

   When the real file is complete this code stops doing anything, and the
   banner disappears on its own.
   ========================================================================== */

const PLACEHOLDER = {
  short: {
    kh: 'អត្ថបទ​គំរូ​សម្រាប់​ការ​រៀបចំ​អេក្រង់',
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

let placeholdersUsed = false

/** True once any response has been backfilled. Home shows a banner when set. */
export function placeholdersInUse(): boolean {
  return placeholdersUsed
}

function fill(value: Localized | undefined, shape: keyof typeof PLACEHOLDER): Localized {
  const kh = value?.kh?.trim()
  const en = value?.en?.trim()
  if (kh && en) return value as Localized

  placeholdersUsed = true
  return { kh: kh || PLACEHOLDER[shape].kh, en: en || PLACEHOLDER[shape].en }
}

function fillStage<T extends { scammerMessages: Localized[]; relativeMessage: Localized; options: { text: Localized }[] }>(
  stage: T,
): T {
  return {
    ...stage,
    scammerMessages: stage.scammerMessages.map((m) => fill(m, 'message')),
    relativeMessage: fill(stage.relativeMessage, 'message'),
    options: stage.options.map((o) => ({ ...o, text: fill(o.text, 'option') })),
  }
}

/* ==========================================================================
   Endpoints
   ========================================================================== */

export function listScenarios(): Promise<ScenarioSummary[]> {
  return request<ScenarioSummary[]>('/scenarios').then((rows) =>
    rows.map((r) => ({ ...r, title: fill(r.title, 'short') })),
  )
}

export async function createSession(
  scenarioId: string,
  language: LanguageCode,
): Promise<CreateSessionResponse> {
  const result = await request<CreateSessionResponse>('/sessions', {
    method: 'POST',
    body: JSON.stringify({ scenarioId, language }),
  })
  return {
    ...result,
    scenario: {
      ...result.scenario,
      title: fill(result.scenario.title, 'short'),
      relative: { ...result.scenario.relative, name: fill(result.scenario.relative?.name, 'short') },
    },
    stage: fillStage(result.stage),
  }
}

export async function submitDecision(
  sessionId: string,
  stageId: number,
  optionId: OptionId,
): Promise<DecisionResult> {
  const result = await request<DecisionResult>(`/sessions/${sessionId}/decisions`, {
    method: 'POST',
    body: JSON.stringify({ stageId, optionId }),
  })
  return {
    ...result,
    relativeReply: fill(result.relativeReply, 'message'),
    nextStage: result.nextStage ? fillStage(result.nextStage) : null,
  }
}

export async function getDebrief(sessionId: string): Promise<SessionSummary> {
  const result = await request<SessionSummary>(`/sessions/${sessionId}/debrief`)
  const d = result.debrief
  return {
    ...result,
    debrief: {
      ...d,
      scamName: fill(d.scamName, 'short'),
      redFlags: d.redFlags.map((f) => fill(f, 'message')),
      rule: fill(d.rule, 'rule'),
      realLifeAction: fill(d.realLifeAction, 'message'),
      outcomeWin: fill(d.outcomeWin, 'message'),
      outcomeLose: fill(d.outcomeLose, 'message'),
      consequence: fill(d.consequence, 'message'),
    },
  }
}

/* ==========================================================================
   Speed Triage
   ========================================================================== */

import type {
  Investigation,
  InvestigationSummary,
  TapResult,
  TriageAnswerResult,
  TriageCard,
  TriageSummary,
  TriageVerdict,
} from '../../shared/types'

function fillCard(card: TriageCard): TriageCard {
  return {
    ...card,
    sender: fill(card.sender, 'short'),
    body: fill(card.body, 'message'),
    ...(card.meta !== undefined ? { meta: fill(card.meta, 'short') } : {}),
  }
}

export interface TriageRun {
  sessionId: string
  deckId: string
  cardCount: number
  maxMistakes: number
  card: TriageCard
}

export async function startTriage(language: LanguageCode): Promise<TriageRun> {
  const run = await request<TriageRun>('/triage/sessions', {
    method: 'POST',
    body: JSON.stringify({ language }),
  })
  return { ...run, card: fillCard(run.card) }
}

export async function answerCard(
  sessionId: string,
  cardId: string,
  verdict: TriageVerdict | 'timeout',
): Promise<TriageAnswerResult> {
  const result = await request<TriageAnswerResult>(`/triage/sessions/${sessionId}/answers`, {
    method: 'POST',
    body: JSON.stringify({ cardId, verdict }),
  })
  return {
    ...result,
    explanation: fill(result.explanation, 'message'),
    nextCard: result.nextCard ? fillCard(result.nextCard) : null,
  }
}

export function getTriageSummary(sessionId: string): Promise<TriageSummary> {
  return request<TriageSummary>(`/triage/sessions/${sessionId}`)
}

/* ==========================================================================
   The Investigation
   ========================================================================== */

export interface InvestigationRun {
  sessionId: string
  investigation: Investigation
}

export async function startInvestigation(language: LanguageCode): Promise<InvestigationRun> {
  const run = await request<InvestigationRun>('/investigations/sessions', {
    method: 'POST',
    body: JSON.stringify({ language }),
  })
  return {
    ...run,
    investigation: {
      ...run.investigation,
      title: fill(run.investigation.title, 'short'),
      rule: fill(run.investigation.rule, 'rule'),
      elements: run.investigation.elements.map((e) => ({ ...e, text: fill(e.text, 'message') })),
    },
  }
}

export async function tapElement(sessionId: string, elementId: string): Promise<TapResult> {
  const result = await request<TapResult>(`/investigations/sessions/${sessionId}/taps`, {
    method: 'POST',
    body: JSON.stringify({ elementId }),
  })
  return {
    ...result,
    explanation: result.explanation ? fill(result.explanation, 'message') : null,
  }
}

export async function finishInvestigation(sessionId: string): Promise<InvestigationSummary> {
  const result = await request<InvestigationSummary>(
    `/investigations/sessions/${sessionId}/finish`,
    { method: 'POST' },
  )
  return {
    ...result,
    rule: fill(result.rule, 'rule'),
    missed: result.missed.map((m) => ({ ...m, explanation: fill(m.explanation, 'message') })),
  }
}
