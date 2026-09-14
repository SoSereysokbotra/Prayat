import { useEffect, useRef } from 'react'
import { useIsKhmer } from '../../hooks/useT'

/**
 * The six-digit verification code.
 *
 * Six boxes rather than one field, because that is what a code from an SMS or
 * an email looks like everywhere else, and it makes the expected length
 * visible instead of something you discover by being rejected.
 *
 * The details that matter on a phone:
 *   - inputMode numeric brings up the number pad, not the full keyboard
 *   - typing advances, backspace on an empty box steps back
 *   - pasting the whole code into ANY box fills all six — people paste, and
 *     a paste that only fills the first box is the classic broken version
 *   - autoComplete="one-time-code" lets iOS and Android offer the code from
 *     the notification, so most players never type it at all
 */
export default function CodeInput({
  value,
  onChange,
  length = 6,
  error,
  disabled = false,
  label,
}: {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: boolean
  disabled?: boolean
  label: string
}) {
  const isKhmer = useIsKhmer()
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  const digits = value.padEnd(length, ' ').slice(0, length).split('')

  function setDigit(index: number, digit: string) {
    const next = digits.map((d, i) => (i === index ? digit : d)).join('').trimEnd()
    onChange(next.replace(/\s/g, ''))
  }

  function handleChange(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, '')
    if (!cleaned) return

    // A paste lands here as a multi-character value. Spread it across the
    // boxes from wherever it was dropped.
    if (cleaned.length > 1) {
      const merged = (value.slice(0, index) + cleaned).slice(0, length)
      onChange(merged)
      refs.current[Math.min(merged.length, length - 1)]?.focus()
      return
    }

    setDigit(index, cleaned)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index].trim()) {
        setDigit(index, ' ')
      } else if (index > 0) {
        // Backspace on an empty box steps back and clears the previous one,
        // which is what every code field on a phone does.
        e.preventDefault()
        setDigit(index - 1, ' ')
        refs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) refs.current[index + 1]?.focus()
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex justify-between gap-stack ${isKhmer ? 'leading-kh' : ''}`}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
          }}
          value={digit.trim()}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`${label} ${index + 1}`}
          aria-invalid={error}
          className={`h-code-box w-code-box min-w-0 flex-1 rounded-button border bg-input
                      text-center text-title font-semibold tabular-nums text-text outline-none
                      ${error ? 'border-danger' : 'border-input-border'}
                      ${disabled ? 'opacity-50' : ''}`}
        />
      ))}
    </div>
  )
}
