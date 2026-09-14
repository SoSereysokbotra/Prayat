import { AlertTriangle, Loader2 } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'

/**
 * Loading and error states.
 *
 * Every screen has loading, ready and error. No screen is ever blank — a white
 * screen on a bad connection reads as a broken app, and the demo runs over a
 * phone hotspot.
 */
export default function ScreenState({
  kind,
  onRetry,
}: {
  kind: 'loading' | 'error'
  onRetry?: () => void
}) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  if (kind === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-1 flex-col items-center justify-center gap-stack py-section text-muted"
      >
        <Loader2 aria-hidden className="h-icon w-icon animate-spin" />
        <span className={`text-small ${kh}`}>{t('loading')}</span>
      </div>
    )
  }

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-stack
                 rounded-card border border-border bg-surface p-section text-center"
    >
      <AlertTriangle aria-hidden className="h-icon w-icon text-caution" />
      <h2 className={`text-title font-semibold ${kh}`}>{t('errorTitle')}</h2>
      <p className={`text-small text-muted ${kh}`}>{t('errorBody')}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`tap-target mt-stack rounded-button bg-primary px-section
                      text-primary-text transition-colors duration-option-fade ${kh}`}
        >
          {t('retry')}
        </button>
      )}
    </div>
  )
}
