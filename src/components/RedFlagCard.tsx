import { Flag } from 'lucide-react'
import { useIsKhmer } from '../hooks/useT'

/**
 * One red flag in the debrief.
 *
 * Numbered, because the debrief's promise is "the three red flags" — a player
 * should be able to count them off afterwards from memory. The number is the
 * badge; the flag is the small mark inside it.
 */
export default function RedFlagCard({ index, children }: { index: number; children: React.ReactNode }) {
  const isKhmer = useIsKhmer()

  return (
    <li className="flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
      <span
        aria-hidden
        className="relative flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-danger/15 text-body font-bold text-danger"
      >
        {index}
        <Flag className="absolute -right-ring -top-ring h-icon w-icon rounded-full bg-danger p-ring text-primary-text" />
      </span>
      <p className={`min-w-0 flex-1 text-body ${isKhmer ? 'leading-kh' : ''}`}>{children}</p>
    </li>
  )
}
