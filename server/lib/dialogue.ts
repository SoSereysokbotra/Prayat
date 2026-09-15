/**
 * AI-varied dialogue on a fixed skeleton.
 *
 * The scenario JSON stays the source of truth for everything that teaches:
 * the facts, the four options, which one is correct, the red flags, the
 * rule, the debrief. This module only re-words two things per stage — the
 * scammer's messages and the relative's line — so a scenario reads a little
 * differently each time without the lesson moving.
 *
 * Hard rules, in order:
 *   1. OFF unless PRAYAT_AI=on and a provider key is set. The demo runs on
 *      the script.
 *   2. Every generated stage is validated (shape, length, no dropped facts)
 *      and anything that fails falls back to the scripted text. Silently.
 *   3. A slow provider is a failed provider: PRAYAT_AI_TIMEOUT_MS, default
 *      12000 (DeepSeek measured at 6–8 s for a Khmer stage), then the script.
 *   4. What was shown is stored (generated_dialogue), so a reviewer can
 *      audit exactly what the model said to a player.
 *
 * Only the session's language is generated; the other half of each
 * Localized value keeps the scripted text.
 */

import { z } from 'zod'
import { db } from '../db'
import type { LanguageCode, Localized, ScenarioFull, StageFull } from '../../shared/types'

/* ---- configuration ------------------------------------------------------- */

export interface DialogueConfig {
  enabled: boolean
  provider: 'deepseek' | 'off'
  model: string
  timeoutMs: number
}

export function dialogueConfig(): DialogueConfig {
  const wanted = process.env.PRAYAT_AI === 'on'
  const key = process.env.DEEPSEEK_API_KEY
  const enabled = wanted && Boolean(key)
  return {
    enabled,
    provider: enabled ? 'deepseek' : 'off',
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-v4-pro',
    timeoutMs: Number(process.env.PRAYAT_AI_TIMEOUT_MS) || 12000,
  }
}

/* ---- provider interface -------------------------------------------------- */

export interface StageDialogueInput {
  language: LanguageCode
  scenario: Pick<ScenarioFull, 'title' | 'scamType' | 'relative'>
  /** The scripted text — the facts the rewrite must keep. */
  scammerMessages: string[]
  relativeMessage: string
  /** The lesson the dialogue must stay inside. */
  redFlags: string[]
}

export interface StageDialogue {
  scammerMessages: string[]
  relativeMessage: string
}

export interface DialogueProvider {
  readonly name: string
  generate(input: StageDialogueInput, signal: AbortSignal): Promise<StageDialogue>
}

/* ---- the prompt ---------------------------------------------------------- */

const LANGUAGE_NAME: Record<LanguageCode, string> = { kh: 'Khmer', en: 'English' }

/**
 * Same wording for every provider, and stable across calls (providers cache
 * on the prefix). The variable parts go in the user message.
 */
function systemPrompt(language: LanguageCode): string {
  return [
    `You rewrite chat messages for a scam-awareness training game set in Cambodia.`,
    `Write in natural ${LANGUAGE_NAME[language]}, the way real people write on Facebook Messenger.`,
    language === 'kh'
      ? `The scammer writes formal, urgent, official-sounding Khmer. The relative writes casual spoken Khmer and refers to himself as ពូ when he is an uncle, មីង when she is an aunt.`
      : `The scammer writes formal, urgent, official-sounding English. The relative writes casual, worried English.`,
    `You are given the scripted messages. Rewrite them so they read fresh, but keep EVERY fact exactly:`,
    `names, numbers, amounts, deadlines, links, payment methods, and who is asking whom.`,
    `Do not add facts, do not remove facts, do not hint whether it is a scam, do not add warnings.`,
    `Paraphrase substantially — different sentence structure and word choice — do not copy sentences from the script.`,
    `Keep the same number of scammer messages. Keep each message about the same length as the original.`,
    `Output ONLY a JSON object: {"scammerMessages": string[], "relativeMessage": string}. No markdown, no commentary.`,
  ].join(' ')
}

function userPrompt(input: StageDialogueInput): string {
  const relative = `${input.scenario.relative.name[input.language] || input.scenario.relative.name.en}, ${input.scenario.relative.age}`
  return JSON.stringify(
    {
      scenario: input.scenario.title[input.language] || input.scenario.title.en,
      scamType: input.scenario.scamType,
      relative,
      redFlagsTheLessonIsAbout: input.redFlags,
      scripted: { scammerMessages: input.scammerMessages, relativeMessage: input.relativeMessage },
      task: 'Rewrite the scripted messages. Same facts, fresh wording.',
    },
    null,
    0,
  )
}

/* ---- DeepSeek (OpenAI-compatible) ---------------------------------------- */

const deepseekResponse = z.object({
  choices: z
    .array(
      z.object({
        finish_reason: z.string().nullable().optional(),
        message: z.object({ content: z.string().nullable() }),
      }),
    )
    .min(1),
})

export class DeepSeekProvider implements DialogueProvider {
  readonly name = 'deepseek'
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async generate(input: StageDialogueInput, signal: AbortSignal): Promise<StageDialogue> {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      signal,
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        // These are reasoning models; thinking would eat the token budget on
        // a task that is a rewrite, not a puzzle.
        thinking: { type: 'disabled' },
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt(input.language) },
          { role: 'user', content: userPrompt(input) },
        ],
      }),
    })
    if (!res.ok) throw new Error(`deepseek ${res.status}`)
    const body = deepseekResponse.parse(await res.json())
    const choice = body.choices[0]
    if (choice.finish_reason === 'length') throw new Error('deepseek: output truncated')
    return parseDialogue(choice.message.content ?? '')
  }
}

/* ---- validation ---------------------------------------------------------- */

const dialogueSchema = z.object({
  scammerMessages: z.array(z.string().trim().min(1)).min(1),
  relativeMessage: z.string().trim().min(1),
})

function parseDialogue(text: string): StageDialogue {
  // Tolerate a stray ```json fence; reject anything else that is not JSON.
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  return dialogueSchema.parse(JSON.parse(cleaned))
}

/**
 * Anything that looks like a fact: numbers, URLs, and Latin tokens (names,
 * brands, product names). Numbers are compared without currency glyphs or
 * separators, so "$200" and "200 ដុល្លារ" are the same fact — the writer's
 * amount survived, only its dress changed.
 */
const FACT_TOKEN = /\d[\d,.:-]*|https?:\/\/\S+|[A-Za-z][\w.-]{2,}/g

function facts(text: string): Set<string> {
  return new Set(
    (text.match(FACT_TOKEN) ?? []).map((t) => (/^\d/.test(t) ? t.replace(/[,.:-]+$/, '').replace(/,/g, '') : t.toLowerCase())),
  )
}

/**
 * A rewrite is acceptable when it kept the skeleton: same number of scammer
 * messages, nothing bloated past three times its original, and every
 * hard fact (numbers, links, brand names) from the script still present.
 * Soft wording is the model's; hard facts are the writer's.
 */
export function acceptable(script: StageDialogue, generated: StageDialogue): boolean {
  if (generated.scammerMessages.length !== script.scammerMessages.length) return false
  const tooLong = (a: string, b: string) => b.length > Math.max(120, a.length * 3)
  if (script.scammerMessages.some((m, i) => tooLong(m, generated.scammerMessages[i]))) return false
  if (tooLong(script.relativeMessage, generated.relativeMessage)) return false

  const scriptFacts = facts([...script.scammerMessages, script.relativeMessage].join(' '))
  const generatedFacts = facts([...generated.scammerMessages, generated.relativeMessage].join(' '))
  for (const f of scriptFacts) if (!generatedFacts.has(f)) return false
  return true
}

/* ---- persistence: what the player actually saw --------------------------- */

db.exec(`
  CREATE TABLE IF NOT EXISTS generated_dialogue (
    session_id   TEXT NOT NULL,
    stage_id     INTEGER NOT NULL,
    provider     TEXT NOT NULL,
    model        TEXT NOT NULL,
    language     TEXT NOT NULL,
    payload      TEXT NOT NULL,
    generated_at INTEGER NOT NULL,
    PRIMARY KEY (session_id, stage_id)
  )
`)

const insertGenerated = db.prepare(`
  INSERT OR REPLACE INTO generated_dialogue
    (session_id, stage_id, provider, model, language, payload, generated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

/* ---- the entry point the routes call ------------------------------------- */

function providerFor(config: DialogueConfig): DialogueProvider | null {
  if (!config.enabled) return null
  const key = process.env.DEEPSEEK_API_KEY
  return key ? new DeepSeekProvider(key, config.model) : null
}

function withLanguage(script: Localized, language: LanguageCode, text: string): Localized {
  return { ...script, [language]: text }
}

/**
 * The stage as the player should see it: scripted, or re-worded when the
 * feature is on and the provider delivered something acceptable in time.
 * Never throws — the script is always the answer of last resort.
 */
export async function dialogueFor(
  scenario: ScenarioFull,
  stage: StageFull,
  language: LanguageCode,
  sessionId: string,
): Promise<Pick<StageFull, 'scammerMessages' | 'relativeMessage'>> {
  const scripted = { scammerMessages: stage.scammerMessages, relativeMessage: stage.relativeMessage }
  const config = dialogueConfig()
  const provider = providerFor(config)
  if (!provider) return scripted

  const script: StageDialogue = {
    scammerMessages: stage.scammerMessages.map((m) => m[language]),
    relativeMessage: stage.relativeMessage[language],
  }
  // Nothing to rewrite yet — the content for this stage is still unwritten.
  if (script.scammerMessages.some((m) => !m.trim()) || !script.relativeMessage.trim()) return scripted

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.timeoutMs)
  try {
    const generated = await provider.generate(
      {
        language,
        scenario: { title: scenario.title, scamType: scenario.scamType, relative: scenario.relative },
        scammerMessages: script.scammerMessages,
        relativeMessage: script.relativeMessage,
        redFlags: scenario.debrief.redFlags.map((f) => f[language]),
      },
      controller.signal,
    )
    if (!acceptable(script, generated)) {
      console.warn(`[dialogue] ${provider.name} output rejected for ${scenario.id} stage ${stage.id}; using script`)
      return scripted
    }
    insertGenerated.run(sessionId, stage.id, provider.name, config.model, language, JSON.stringify(generated), Date.now())
    return {
      scammerMessages: stage.scammerMessages.map((m, i) => withLanguage(m, language, generated.scammerMessages[i])),
      relativeMessage: withLanguage(stage.relativeMessage, language, generated.relativeMessage),
    }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    console.warn(`[dialogue] ${provider.name} failed for ${scenario.id} stage ${stage.id} (${reason}); using script`)
    return scripted
  } finally {
    clearTimeout(timer)
  }
}
