import { useGameStore } from '../store/gameStore'

/**
 * KH / EN toggle. Present on every screen, mid-game included.
 * The inactive half stays legible — this is a switch, not a disabled control.
 */
export default function LanguageToggle() {
  const language = useGameStore((s) => s.language)
  const setLanguage = useGameStore((s) => s.setLanguage)

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-stack rounded-button border border-border bg-surface p-stack"
    >
      {(['kh', 'en'] as const).map((code) => {
        const active = language === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            className={`tap-target rounded-button px-stack text-small transition-colors duration-option-fade ${
              active ? 'bg-primary text-primary-text' : 'text-muted'
            }`}
          >
            {code === 'kh' ? 'ខ្មែរ' : 'EN'}
          </button>
        )
      })}
    </div>
  )
}
