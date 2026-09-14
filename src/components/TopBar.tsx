import { ArrowDown, ArrowLeft, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import LanguageToggle from './LanguageToggle'
import { useT, useIsKhmer } from '../hooks/useT'
import type { PullState } from '../hooks/usePullToRefresh'

/**
 * Home banner: the wordmark and tagline over the Angkor illustration, with
 * the language switch top-right.
 *
 * The illustration is a fixed light image and does not follow the theme, so
 * everything drawn on it uses the `hero-*` colours rather than `text`/`muted`
 * — otherwise the wordmark goes white-on-sky in dark mode and vanishes.
 *
 * The banner is the FULL illustration, river included. The content sheet
 * (see Home) rides up over the river, so at rest only sky, hills and temple
 * show. The river is revealed by pulling the sheet down to refresh, and the
 * refresh hint lives in that band so it is only ever seen mid-pull.
 */
interface TopBarProps {
  pull?: PullState
  /** Where the back arrow goes. Omit on Home, which has nowhere to go back to. */
  back?: string
}

export default function TopBar({ pull, back }: TopBarProps) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  const hint =
    pull?.phase === 'refreshing'
      ? t('refreshing')
      : pull?.phase === 'armed'
        ? t('releaseToRefresh')
        : t('pullToRefresh')

  return (
    <header className="topbar-hero relative w-full">
      <div className="mx-auto flex w-full max-w-screen-sm items-start justify-between gap-stack px-screen-x pt-section">
        <div className="flex min-w-0 items-start gap-stack">
          {back && (
            <Link
              to={back}
              aria-label={t('back')}
              className="tap-target flex shrink-0 items-center justify-center rounded-button
                         border border-border bg-surface/80 text-text backdrop-blur
                         transition-colors duration-option-fade hover:bg-surface"
            >
              <ArrowLeft aria-hidden className="h-icon w-icon" />
            </Link>
          )}
          <BrandMark className="h-wordmark w-wordmark shrink-0" />
          <div className="min-w-0">
            <h1 className="text-display font-bold leading-none tracking-tight text-hero-text">Prayat</h1>
            <p className={`mt-stack text-small text-hero-muted ${kh}`}>{t('tagline')}</p>
          </div>
        </div>
        <LanguageToggle variant="pill" />
      </div>

      {/* The river band: hidden under the sheet until the player pulls. */}
      {pull && (
        <div
          aria-live="polite"
          style={{ opacity: pull.progress }}
          className={`absolute inset-x-0 bottom-0 flex h-sheet-overlap items-center justify-center
                      gap-stack text-small font-semibold text-hero-text ${kh}`}
        >
          {pull.phase === 'refreshing' ? (
            <RefreshCw aria-hidden className="refresh-spin h-icon w-icon" />
          ) : (
            <ArrowDown
              aria-hidden
              className={`h-icon w-icon transition-transform duration-option-fade
                          ${pull.phase === 'armed' ? 'rotate-180' : ''}`}
            />
          )}
          <span>{hint}</span>
        </div>
      )}
    </header>
  )
}
