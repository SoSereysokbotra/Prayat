import { type LucideIcon } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'

/**
 * The label on top of a Guardian chat zone.
 *
 * It was a bare <p> sitting above a scrolling pane, and clipped text scrolled
 * up to sit right against it — which read as a rendering bug rather than as a
 * conversation continuing above the fold. It is now a solid bar with its own
 * background and a bottom border, so the pane visibly ends where the label
 * begins.
 *
 * The threat zone says out loud that the player can only watch. That
 * restriction is the mechanic, not a limitation to hide.
 */
export default function ZoneHeader({
  label,
  icon: Icon,
  tone = 'default',
  readOnly = false,
  right,
}: {
  label: string
  icon?: LucideIcon
  tone?: 'default' | 'threat'
  readOnly?: boolean
  right?: React.ReactNode
}) {
  const t = useT()
  const isKhmer = useIsKhmer()

  return (
    <div
      className={`flex shrink-0 items-center gap-stack border-b border-border px-screen-x py-stack
                  ${tone === 'threat' ? 'bg-zone-threat' : 'bg-surface'}`}
    >
      {Icon && <Icon aria-hidden className="h-icon w-icon shrink-0 text-muted" />}

      <span
        className={`min-w-0 flex-1 truncate text-small font-semibold text-muted ${
          isKhmer ? 'leading-kh' : ''
        }`}
      >
        {label}
      </span>

      {readOnly && (
        <span className={`shrink-0 rounded-button bg-surface-alt px-stack text-small text-muted ${
          isKhmer ? 'leading-kh' : ''
        }`}>
          {t('watchOnly')}
        </span>
      )}
      {right}
    </div>
  )
}
