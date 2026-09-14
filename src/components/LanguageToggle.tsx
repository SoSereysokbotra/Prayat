import { Languages } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

type Variant = 'quiet' | 'pill'

interface LanguageToggleProps {
  /** Drops the label for gameplay screens where the header is already busy. */
  compact?: boolean
  /**
   * `quiet` (default) — a single button showing the language it switches TO.
   * Used mid-game, where a bright switcher would outshine the scam the player
   * is supposed to be reading.
   *
   * `pill` — a KH | EN segmented control. Only for the home banner, where
   * there is nothing to compete with and a first-time player needs to see at
   * a glance that the app speaks both languages.
   */
  variant?: Variant
}

export default function LanguageToggle({ compact = false, variant = 'quiet' }: LanguageToggleProps) {
  const language = useGameStore((s) => s.language)
  const setLanguage = useGameStore((s) => s.setLanguage)

  if (variant === 'pill') {
    const segment = (lang: 'kh' | 'en', label: string) => {
      const active = language === lang
      return (
        <button
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={active}
          className={`tap-target rounded-button px-stack text-small font-semibold
                      transition-colors duration-option-fade
                      ${lang === 'kh' ? 'font-kh' : ''}
                      ${active ? 'bg-primary text-primary-text' : 'text-muted hover:text-text'}`}
        >
          {label}
        </button>
      )
    }
    return (
      <div
        role="group"
        aria-label="Language"
        className="flex shrink-0 rounded-button border border-border bg-surface/80 p-ring backdrop-blur"
      >
        {segment('kh', 'ខ្មែរ')}
        {segment('en', 'EN')}
      </div>
    )
  }

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
