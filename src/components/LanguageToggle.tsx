import { Languages } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

/**
 * KH / EN switch. Present on every screen, mid-game included.
 *
 * Deliberately quiet. As a two-pill segmented control it was the brightest
 * element on every screen — a language switcher outshining the scam the player
 * is supposed to be reading. It is now a single button showing the language it
 * switches TO, which is both smaller and the clearer affordance: you read what
 * you will get, not what you already have.
 *
 * `compact` drops the label entirely for gameplay screens, where the header is
 * already carrying a timer, a score and a life count.
 */
export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const language = useGameStore((s) => s.language)
  const setLanguage = useGameStore((s) => s.setLanguage)

  const next = language === 'kh' ? 'en' : 'kh'
  const nextLabel = next === 'kh' ? 'ខ្មែរ' : 'EN'

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={next === 'kh' ? 'ប្ដូរទៅភាសាខ្មែរ' : 'Switch to English'}
      className="tap-target flex items-center justify-center gap-stack rounded-button
                 border border-border bg-surface px-stack text-small text-muted
                 transition-colors duration-option-fade hover:text-text"
    >
      <Languages aria-hidden className="h-icon w-icon" />
      {!compact && <span className={next === 'kh' ? 'font-kh' : undefined}>{nextLabel}</span>}
    </button>
  )
}
