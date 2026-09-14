import { Link } from 'react-router-dom'
import { Lock, type LucideIcon } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'

interface ModeCardProps {
  to: string
  icon: LucideIcon
  title: string
  blurb: string
  meta: string
  locked?: boolean
}

/**
 * A game mode on the home screen.
 *
 * Locked cards stay legible — dimmed, not hidden. A card you cannot read is
 * not a promise of anything, and these two are the roadmap made visible.
 */
export default function ModeCard({
  to,
  icon: Icon,
  title,
  blurb,
  meta,
  locked = false,
}: ModeCardProps) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <Link
      to={to}
      className={`block rounded-card border p-stack transition-colors duration-option-fade ${
        locked
          ? 'border-border bg-surface-alt/50'
          : 'border-primary bg-surface hover:bg-surface-alt'
      }`}
    >
      <div className="flex items-start gap-stack">
        <span
          aria-hidden
          className={`flex shrink-0 items-center justify-center rounded-button p-stack ${
            locked ? 'bg-surface-alt text-muted' : 'bg-primary text-primary-text'
          }`}
        >
          <Icon className="h-icon w-icon" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-stack">
            <h2 className={`text-title font-semibold ${locked ? 'text-muted' : ''} ${kh}`}>
              {title}
            </h2>
            {locked && (
              <span className="flex items-center gap-stack rounded-button bg-surface-alt px-stack text-small text-muted">
                <Lock aria-hidden className="h-icon w-icon" />
                <span className={kh}>{t('comingSoon')}</span>
              </span>
            )}
          </div>

          <p className={`mt-stack text-body ${locked ? 'text-muted' : ''} ${kh}`}>{blurb}</p>
          <p className={`mt-stack text-small text-muted ${kh}`}>{meta}</p>
        </div>
      </div>
    </Link>
  )
}
