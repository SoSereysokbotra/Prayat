import { BadgeCheck, Forward } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'

export type BubbleVariant = 'scammer' | 'relative' | 'player'

/**
 * One message in a conversation.
 *
 * The player's own messages sit on the right, everyone else on the left —
 * the arrangement every Cambodian already reads fluently from Telegram and
 * Messenger. Nothing here signals that a message is a scam. Real life does
 * not come with warning colours, so the game does not either; the scammer's
 * bubble tint reads as "not your conversation", not as "danger".
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
}: {
  variant: BubbleVariant
  children: React.ReactNode
  animate?: boolean
  /** Shown beside the bubble, bottom-aligned. Pass on the LAST bubble of a run. */
  avatar?: React.ReactNode
  /** Who the relative forwarded this from. Scammer bubbles only. */
  forwardedFrom?: { name: string; verified?: boolean }
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
    <div className={`flex items-end gap-stack ${mine ? 'justify-end' : 'justify-start'}`}>
      {/* Keep the column aligned whether or not this bubble carries the avatar. */}
      {!mine && <div className="h-avatar w-avatar shrink-0">{avatar}</div>}

      <div
        className={`bubble-max rounded-bubble px-stack py-stack text-body ${tint} ${
          animate ? 'bubble-in' : ''
        } ${kh}`}
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
      </div>
    </div>
  )
}
