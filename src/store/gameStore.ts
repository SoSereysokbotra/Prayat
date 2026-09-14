/**
 * Game state.
 *
 * Deliberately small. There are no accounts in the prototype, so the only
 * things that survive a reload are the language choice and the cumulative
 * score — both per-device, both in localStorage.
 *
 * localStorage can throw (private windows, blocked site data), so every read
 * and write is guarded and the app renders correctly with no stored value.
 */

import { create } from 'zustand'
import type { LanguageCode, Level, ScamType } from '../../shared/types'

const LANGUAGE_KEY = 'prayat.language'
const SCORE_KEY = 'prayat.cumulativeScore'
const COMPLETED_KEY = 'prayat.completedScamTypes'
const BEST_KEY = 'prayat.bestByScamType'
const STREAK_KEY = 'prayat.streak'
const TRIAGE_BEST_KEY = 'prayat.triageBest'

const SCAM_TYPES: readonly ScamType[] = ['government', 'job', 'crypto', 'romance', 'malware']

function readStored<T>(key: string, fallback: T, parse: (raw: string) => T | null): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return parse(raw) ?? fallback
  } catch {
    return fallback
  }
}

function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* private window or blocked site data — the session still works */
  }
}

/**
 * Levels come from cumulative score across all sessions.
 * These thresholds also exist in server/lib/scoring.ts; the server's value is
 * authoritative, this is for the home screen before any session has run.
 */
export function levelFor(score: number): Level {
  if (score >= 500) return 'Protector'
  if (score >= 300) return 'Guardian'
  if (score >= 200) return 'Defender'
  if (score >= 100) return 'Alert'
  return 'Aware'
}

/** Points still needed for the next level, or null at the top level. */
export function nextLevelAt(score: number): number | null {
  for (const threshold of [100, 200, 300, 500]) {
    if (score < threshold) return threshold
  }
  return null
}

export interface BestResult {
  earned: number
  available: number
}

export interface Streak {
  /** Consecutive days with at least one round banked. */
  count: number
  /** Local calendar day of the last banked round, YYYY-MM-DD. */
  last: string
}

/** Local calendar day, so a round at 23:50 and one at 00:10 count as two days. */
function today(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function yesterdayOf(day: string): string {
  const [y, m, d] = day.split('-').map(Number)
  const prev = new Date(y, m - 1, d - 1)
  const mm = String(prev.getMonth() + 1).padStart(2, '0')
  const dd = String(prev.getDate()).padStart(2, '0')
  return `${prev.getFullYear()}-${mm}-${dd}`
}

/**
 * The streak as it stands NOW, not as it was last written. A streak whose
 * last round was before yesterday has already lapsed even if nothing has
 * rewritten it yet; the progress screen must not show "3 days" for a player
 * who stopped a week ago.
 */
export function currentStreak(streak: Streak): number {
  const now = today()
  if (streak.last === now || streak.last === yesterdayOf(now)) return streak.count
  return 0
}

interface GameState {
  language: LanguageCode
  cumulativeScore: number
  /**
   * Best Guardian run per scam type — the progress screen's per-category
   * resistance rating (earned / available, on the design doc's 0–1000
   * scale). Best rather than cumulative: a learner who bombed scenario 1
   * twice and then aced it has learned it, and the number should say so.
   */
  bestByScamType: Partial<Record<ScamType, BestResult>>
  recordGuardianResult: (scamType: ScamType, earned: number, available: number) => void
  /** Which scenario the current session is playing. Set by Guardian, read by Debrief. */
  activeScamType: ScamType | null
  setActiveScamType: (scamType: ScamType | null) => void
  streak: Streak
  /** Best single Speed Triage run on this device. */
  triageBest: number
  /** Records a run; returns the best BEFORE it, so the screen can say "new record". */
  recordTriageRun: (score: number) => number
  /**
   * Scam types the player has played to the end, win or lose. Drives the
   * scenario picker's unlock order: reaching the end of one scenario opens
   * the next. Losing still counts — the debrief after a loss is the lesson.
   */
  completedScamTypes: ScamType[]
  markCompleted: (scamType: ScamType) => void
  /** Set by Guardian, read by Consequence and Debrief. */
  sessionId: string | null
  setSessionId: (id: string | null) => void
  setLanguage: (language: LanguageCode) => void
  toggleLanguage: () => void
  addScore: (points: number) => void
  resetScore: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  language: readStored<LanguageCode>(LANGUAGE_KEY, 'kh', (raw) =>
    raw === 'kh' || raw === 'en' ? raw : null,
  ),

  cumulativeScore: readStored<number>(SCORE_KEY, 0, (raw) => {
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? n : null
  }),

  completedScamTypes: readStored<ScamType[]>(COMPLETED_KEY, [], (raw) => {
    try {
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed)
        ? parsed.filter((v): v is ScamType => SCAM_TYPES.includes(v as ScamType))
        : null
    } catch {
      return null
    }
  }),

  bestByScamType: readStored<Partial<Record<ScamType, BestResult>>>(BEST_KEY, {}, (raw) => {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return null
      const out: Partial<Record<ScamType, BestResult>> = {}
      for (const type of SCAM_TYPES) {
        const v = (parsed as Record<string, unknown>)[type]
        if (v && typeof v === 'object') {
          const { earned, available } = v as Record<string, unknown>
          if (typeof earned === 'number' && typeof available === 'number' && available > 0) {
            out[type] = { earned, available }
          }
        }
      }
      return out
    } catch {
      return null
    }
  }),

  recordGuardianResult: (scamType, earned, available) => {
    if (available <= 0) return
    const prev = get().bestByScamType[scamType]
    if (prev && prev.earned / prev.available >= earned / available) return
    const next = { ...get().bestByScamType, [scamType]: { earned, available } }
    writeStored(BEST_KEY, JSON.stringify(next))
    set({ bestByScamType: next })
  },

  activeScamType: null,
  setActiveScamType: (activeScamType) => set({ activeScamType }),

  streak: readStored<Streak>(STREAK_KEY, { count: 0, last: '' }, (raw) => {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return null
      const { count, last } = parsed as Record<string, unknown>
      return typeof count === 'number' && typeof last === 'string' ? { count, last } : null
    } catch {
      return null
    }
  }),

  triageBest: readStored<number>(TRIAGE_BEST_KEY, 0, (raw) => {
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? n : null
  }),

  recordTriageRun: (score) => {
    const previous = get().triageBest
    if (score > previous) {
      writeStored(TRIAGE_BEST_KEY, String(score))
      set({ triageBest: score })
    }
    return previous
  },

  markCompleted: (scamType) => {
    if (get().completedScamTypes.includes(scamType)) return
    const next = [...get().completedScamTypes, scamType]
    writeStored(COMPLETED_KEY, JSON.stringify(next))
    set({ completedScamTypes: next })
  },

  sessionId: null,

  setSessionId: (sessionId) => set({ sessionId }),

  setLanguage: (language) => {
    writeStored(LANGUAGE_KEY, language)
    set({ language })
  },

  toggleLanguage: () => {
    const next: LanguageCode = get().language === 'kh' ? 'en' : 'kh'
    get().setLanguage(next)
  },

  addScore: (points) => {
    const total = get().cumulativeScore + points
    writeStored(SCORE_KEY, String(total))

    // Banking points is "playing today". Same day: no change. Yesterday:
    // the streak grows. Anything older: it starts again at 1.
    const now = today()
    const { count, last } = get().streak
    const streak: Streak =
      last === now
        ? { count, last }
        : { count: last === yesterdayOf(now) ? count + 1 : 1, last: now }
    writeStored(STREAK_KEY, JSON.stringify(streak))

    set({ cumulativeScore: total, streak })
  },

  resetScore: () => {
    writeStored(SCORE_KEY, '0')
    set({ cumulativeScore: 0 })
  },
}))

/** Pick the active half of a Localized value. */
export function useLocalized() {
  const language = useGameStore((s) => s.language)
  return (value: { kh: string; en: string } | undefined): string =>
    (value?.[language] ?? '').trim()
}
