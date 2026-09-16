import { BadgeCheck, CheckCheck, Forward } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'

export type BubbleVariant = 'scammer' | 'relative' | 'player'

/**
 * One message in a conversation, drawn the way Telegram draws it.
 *
 * The player's own messages sit on the right in the pale green, everyone
 * else's on the left in white — the arrangement every Cambodian already
 * reads fluently. The last bubble of a run carries the tail (a squared
 * corner pointing at the sender); the time sits bottom-right inside the
 * bubble, with the double tick on your own.
 *
 * Nothing here signals that a message is a scam. Real life does not come
 * with warning colours, so the game does not either.
 *
 * A scammer message is rendered as a FORWARD — "Forwarded from Ministry of
 * Commerce ✓" above the text — because that is how the relative actually got
 * it in front of you. Nobody expects to reply to a forward, which is the
 * whole read-only mechanic explained without a word of UI copy.
 */
export default function ChatBubble({
  variant,
  children,
  animate = true,
  avatar,
  forwardedFrom,
  tail = false,
  time,
  newRun = false,
}: {
  variant: BubbleVariant
  children: React.ReactNode
  animate?: boolean
  /** Shown beside the bubble, bottom-aligned. Pass on the LAST bubble of a run. */
  avatar?: React.ReactNode
  /** Who the relative forwarded this from. Scammer bubbles only. */
  forwardedFrom?: { name: string; verified?: boolean }
  /** Last bubble of a run from one side — draws the tail. */
  tail?: boolean
  /** "14:05" — when it arrived. */
  time?: string
  /** First bubble after the other side spoke — extra air above. */
  newRun?: boolean
}) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const mine = variant === 'player'
  const kh = isKhmer ? 'leading-kh' : ''

  const tint =
    variant === 'scammer'
      ? 'bg-bubble-scammer'
      : variant === 'relative'
        ? 'bg-bubble-relative'
        : 'bg-bubble-player'

  return (
    <div className={`flex items-end gap-stack ${mine ? 'justify-end' : 'justify-start'} ${newRun ? 'mt-run-gap' : ''}`}>
      {/* Keep the column aligned whether or not this bubble carries the avatar. */}
      {!mine && <div className="h-avatar w-avatar shrink-0">{avatar}</div>}

      <div
        className={`bubble-max rounded-bubble px-stack pb-ring pt-stack text-body text-text shadow-sm ${tint}
                    ${tail ? (mine ? 'bubble-tail-out' : 'bubble-tail-in') : ''}
                    ${animate ? 'bubble-in' : ''} ${kh}`}
      >
        {forwardedFrom && (
          <p className="mb-ring flex items-center gap-ring text-small font-semibold text-primary">
            <Forward aria-hidden className="h-icon w-icon shrink-0" />
            <span className="min-w-0 truncate">
              {t('forwardedFrom')} {forwardedFrom.name}
            </span>
            {forwardedFrom.verified && (
              <BadgeCheck aria-label={t('verified')} className="h-icon w-icon shrink-0" />
            )}
          </p>
        )}
        {children}
        {time && (
          <span
            className={`mt-ring flex items-center justify-end gap-ring text-small tabular-nums
                        ${mine ? 'text-chat-time-mine' : 'text-chat-time'}`}
          >
            {time}
            {mine && <CheckCheck aria-hidden className="h-icon w-icon" />}
          </span>
        )}
      </div>
    </div>
  )
}
