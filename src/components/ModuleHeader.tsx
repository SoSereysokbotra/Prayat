import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT, useIsKhmer } from '../hooks/useT'
import { BOOTCAMP_MODULE_IDS } from '../../shared/types'

/**
 * The strip above a bootcamp module: back arrow, "1 of 3" and how far
 * through Level 0 the player is. Sits on the same sky as the TopBar so
 * the modules feel like rooms of the same building, but short — the
 * game below needs the height.
 */
export default function ModuleHeader({ index, back = '/bootcamp' }: { index: number; back?: string }) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''
  const total = BOOTCAMP_MODULE_IDS.length
  const fraction = index / total

  return (
    <header className="topbar-hero relative w-full">
      <div className="mx-auto flex w-full max-w-screen-sm items-center gap-stack px-screen-x pt-section">
        <Link
          to={back}
          aria-label={t('back')}
          className="tap-target flex shrink-0 items-center justify-center rounded-button
                     border border-border bg-surface/80 text-text backdrop-blur
                     transition-colors duration-option-fade hover:bg-surface"
        >
          <ArrowLeft aria-hidden className="h-icon w-icon" />
        </Link>
        <div className="flex flex-1 flex-col items-center gap-ring">
          <p className={`text-small font-semibold text-hero-muted ${kh}`}>
            {t('moduleOf').replace('{n}', String(index)).replace('{total}', String(total))}
          </p>
          <div className="flex items-center gap-stack">
            <div
              role="progressbar"
              aria-valuenow={Math.round(fraction * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-timer-bar w-module-bar overflow-hidden rounded-button bg-surface/80"
            >
              <div className="h-full rounded-button bg-primary" style={{ width: `${fraction * 100}%` }} />
            </div>
            <span className="text-small font-semibold tabular-nums text-hero-muted">{Math.round(fraction * 100)}%</span>
          </div>
        </div>
        {/* keeps the title centred against the back button */}
        <span aria-hidden className="w-tap shrink-0" />
      </div>
    </header>
  )
}
