import { useEffect, useRef } from 'react'

/**
 * A scrolling conversation pane.
 *
 * Guardian stacks two of these and they scroll independently — the player has
 * to be able to re-read what the scammer said while their own conversation
 * moves on. Each pane auto-scrolls to the newest message.
 *
 * `dependency` is what "newest" means to the caller, usually a message count.
 * Scrolling on every render would fight a player who has scrolled up.
 */
export default function ChatWindow({
  children,
  dependency,
  label,
  tone = 'default',
  className = '',
}: {
  children: React.ReactNode
  dependency: unknown
  label: string
  tone?: 'default' | 'threat'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [dependency])

  return (
    <div
      ref={ref}
      role="log"
      aria-label={label}
      aria-live="polite"
      className={`flex flex-col gap-stack overflow-y-auto overscroll-contain px-stack py-stack ${
        tone === 'threat' ? 'bg-zone-threat' : 'bg-bg'
      } ${className}`}
    >
      {children}
    </div>
  )
}
