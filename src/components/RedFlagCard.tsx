import { Flag } from 'lucide-react'
import { useIsKhmer } from '../hooks/useT'

/**
 * One red flag in the debrief.
 *
 * Numbered, because the debrief's promise is "the three red flags" — a player
 * should be able to count them off afterwards from memory.
 */
export default function RedFlagCard({ index, children }: { index: number; children: React.ReactNode }) {
  const isKhmer = useIsKhmer()

  return (
    <li className="flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center rounded-button bg-danger p-stack text-primary-text"
      >
        <Flag className="h-icon w-icon" />
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-small text-muted">{index}</span>
        <p className={`text-body ${isKhmer ? 'leading-kh' : ''}`}>{children}</p>
      </div>
    </li>
  )
}
