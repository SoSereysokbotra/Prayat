import { useId, useState } from 'react'
import { AlertCircle, Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { useIsKhmer } from '../../hooks/useT'

/**
 * One labelled form field.
 *
 * The label is a real <label>, not placeholder text. Placeholder-as-label
 * disappears the moment someone starts typing, which leaves them guessing what
 * a half-filled field was for — and it is worse in Khmer, where the fallback
 * cue of recognising a short English word is gone.
 *
 * Errors are tied to the input with aria-describedby and marked
 * aria-invalid, so a screen reader announces the problem rather than leaving a
 * red border no one can hear.
 */
export default function TextField({
  label,
  value,
  onChange,
  type = 'text',
  icon: Icon,
  error,
  hint,
  autoComplete,
  inputMode,
  placeholder,
  disabled = false,
  revealLabel,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  icon?: LucideIcon
  error?: string
  hint?: string
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'numeric'
  placeholder?: string
  disabled?: boolean
  /** Accessible name for the show/hide control on a password field. */
  revealLabel?: string
}) {
  const id = useId()
  const isKhmer = useIsKhmer()
  const [revealed, setRevealed] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && revealed ? 'text' : type
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <div className="flex flex-col gap-stack">
      <label htmlFor={id} className={`text-small font-semibold ${kh}`}>
        {label}
      </label>

      <div
        className={`flex items-center gap-stack rounded-button border bg-input px-stack
                    ${error ? 'border-danger' : 'border-input-border'}
                    ${disabled ? 'opacity-50' : ''}`}
      >
        {Icon && <Icon aria-hidden className="h-icon w-icon shrink-0 text-muted" />}

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="h-field min-w-0 flex-1 bg-input text-body text-text
                     outline-none placeholder:text-muted"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealLabel ?? label}
            aria-pressed={revealed}
            className="tap-target flex shrink-0 items-center justify-center text-muted"
          >
            {revealed ? (
              <EyeOff aria-hidden className="h-icon w-icon" />
            ) : (
              <Eye aria-hidden className="h-icon w-icon" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          className={`flex items-start gap-stack text-small text-danger ${kh}`}
        >
          <AlertCircle aria-hidden className="h-icon w-icon shrink-0" />
          <span className="min-w-0 flex-1">{error}</span>
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={`text-small text-muted ${kh}`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
