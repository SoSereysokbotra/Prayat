import { Loader2 } from 'lucide-react'
import { useIsKhmer } from '../../hooks/useT'

/**
 * The one primary action on an auth screen.
 *
 * Disabled while submitting AND while the form is invalid, so the failure a
 * player meets is a field marked in red rather than a round trip that comes
 * back rejected.
 */
export default function SubmitButton({
  label,
  busyLabel,
  busy = false,
  disabled = false,
}: {
  label: string
  busyLabel: string
  busy?: boolean
  disabled?: boolean
}) {
  const isKhmer = useIsKhmer()

  return (
    <button
      type="submit"
      disabled={busy || disabled}
      aria-busy={busy}
      className={`tap-target flex w-full items-center justify-center gap-stack rounded-button
                  bg-primary px-section text-primary-text transition-opacity duration-option-fade
                  disabled:opacity-50 ${isKhmer ? 'leading-kh' : ''}`}
    >
      {busy && <Loader2 aria-hidden className="h-icon w-icon animate-spin" />}
      {busy ? busyLabel : label}
    </button>
  )
}
