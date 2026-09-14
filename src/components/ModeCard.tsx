import { Link } from 'react-router-dom'
import { ChevronRight, Lock, type LucideIcon } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'

export type ModeEmphasis = 'primary' | 'supporting'

interface ModeCardProps {
  to: string
  icon: LucideIcon
  title: string
  blurb: string
  /** "2 min · daily" — the rhythm, not just a duration. */
  cadence: string
  /** What the mode builds. Shown on the primary card only. */
  teaches?: string
  emphasis?: ModeEmphasis
  locked?: boolean
}

/**
 * A game mode on the home screen.
 *
 * The three modes are NOT equal and the card should not pretend they are.
 * Guardian Mode is the product; Speed Triage is the retention mechanic; The
 * Investigation is a supporting drill. Three identical cards tell a first-time
 * player to start anywhere, and most will start with the shortest one — which
 * is the weakest introduction to what this app is for.
 *
 * The primary card is larger, carries the accent border, and says what the
 * mode teaches. The supporting cards are a compact row: icon, name, cadence.
 */
export default function ModeCard({
  to,
  icon: Icon,
  title,
  blurb,
  cadence,
  teaches,
  emphasis = 'supporting',
  locked = false,
}: ModeCardProps) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  /* ---- supporting: one compact row ---- */
  if (emphasis === 'supporting') {
    return (
      <Link
        to={to}
        className={`flex items-center gap-stack rounded-card border border-border p-stack
                    transition-colors duration-option-fade
                    ${locked ? 'bg-surface-alt/50' : 'bg-surface hover:bg-surface-alt'}`}
      >
        <span
          aria-hidden
          className={`flex shrink-0 items-center justify-center rounded-button p-stack
                      ${locked ? 'bg-surface-alt text-muted' : 'bg-surface-alt text-text'}`}
        >
          <Icon className="h-icon w-icon" />
        </span>

        <span className="min-w-0 flex-1">
          <span className={`block truncate text-body font-semibold ${locked ? 'text-muted' : ''} ${kh}`}>
            {title}
          </span>
          <span className={`block truncate text-small text-muted ${kh}`}>
            {locked ? t('comingSoon') : cadence}
          </span>
        </span>

        {locked ? (
          <Lock aria-hidden className="h-icon w-icon shrink-0 text-muted" />
        ) : (
          <ChevronRight aria-hidden className="h-icon w-icon shrink-0 text-muted" />
        )}
      </Link>
    )
  }

  /* ---- primary: the card that should be tapped first ---- */
  return (
    <Link
      to={to}
      className="block rounded-card border border-primary bg-surface p-section
                 transition-colors duration-option-fade hover:bg-surface-alt"
    >
      <div className="flex items-start gap-stack">
        <span
          aria-hidden
          className="flex shrink-0 items-center justify-center rounded-button bg-primary p-stack text-primary-text"
        >
          <Icon className="h-icon w-icon" />
        </span>

        <div className="min-w-0 flex-1">
          <p className={`text-small font-semibold text-primary ${kh}`}>{t('startHere')}</p>
          <h2 className={`text-title font-semibold ${kh}`}>{title}</h2>
        </div>

        <ChevronRight aria-hidden className="h-icon w-icon shrink-0 text-muted" />
      </div>

      <p className={`mt-stack text-body ${kh}`}>{blurb}</p>

      {teaches && (
        <p className={`mt-stack border-t border-border pt-stack text-small text-muted ${kh}`}>
          {teaches}
        </p>
      )}

      <p className={`mt-stack text-small text-muted ${kh}`}>{cadence}</p>
    </Link>
  )
}
