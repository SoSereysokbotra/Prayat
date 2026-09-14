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
import type { LanguageCode, Level } from '../../shared/types'

const LANGUAGE_KEY = 'prayat.language'
const SCORE_KEY = 'prayat.cumulativeScore'

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

interface GameState {
  language: LanguageCode
  cumulativeScore: number
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
    set({ cumulativeScore: total })
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
