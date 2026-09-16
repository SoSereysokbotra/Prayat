import { useIsKhmer } from '../hooks/useT'
import type { OptionId } from '../../shared/types'

/**
 * One of the four replies the player can send.
 *
 * The tightest space in the app. Khmer runs physically longer than English, so
 * the button grows to fit its content and wraps — it never truncates, never
 * clips, never scrolls sideways. Height is content-driven with a 44px floor,
 * not a fixed value.
 *
 * Nothing marks an option as right or wrong before the player commits. If the
 * bad option looked bad, no learning would happen.
 */
export default function OptionButton({
  id,
  children,
  onSelect,
  disabled = false,
  selected = false,
}: {
  id: OptionId
  children: React.ReactNode
  onSelect: (id: OptionId) => void
  disabled?: boolean
  selected?: boolean
}) {
  const isKhmer = useIsKhmer()

  return (
    <button
      type="button"
      // Disabling every button the moment one is tapped is the guard against
      // the double-submit bug. The database UNIQUE constraint is the second.
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={`tap-target flex w-full items-start gap-stack rounded-button border
                  px-stack py-stack text-left text-body transition-colors duration-option-fade
                  ${
                    selected
                      ? 'border-primary bg-bubble-player'
                      : 'border-surface bg-surface'
                  }
                  ${disabled && !selected ? 'opacity-50' : ''}
                  ${!disabled ? 'hover:border-primary/40' : ''}`}
    >
      <span
        aria-hidden
        className={`flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full text-small
                    font-bold ${
                      selected ? 'bg-primary text-primary-text' : 'bg-primary/15 text-primary'
                    }`}
      >
        {id.toUpperCase()}
      </span>
      <span className={`min-w-0 flex-1 ${isKhmer ? 'leading-kh' : ''}`}>{children}</span>
    </button>
  )
}
