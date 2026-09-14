import { useIsKhmer } from '../hooks/useT'

export type BubbleVariant = 'scammer' | 'auntie' | 'player'

/**
 * One message in a conversation.
 *
 * The player's own messages sit on the right, everyone else on the left —
 * the arrangement every Cambodian already reads fluently from Telegram and
 * Messenger. Nothing here signals that a message is a scam. Real life does
 * not come with warning colours, so the game does not either; the scammer's
 * bubble tint reads as "not your conversation", not as "danger".
 */
export default function ChatBubble({
  variant,
  children,
  animate = true,
}: {
  variant: BubbleVariant
  children: React.ReactNode
  animate?: boolean
}) {
  const isKhmer = useIsKhmer()
  const mine = variant === 'player'

  const tint =
    variant === 'scammer'
      ? 'bg-bubble-scammer'
      : variant === 'auntie'
        ? 'bg-bubble-auntie'
        : 'bg-bubble-player'

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`bubble-max rounded-bubble px-stack py-stack text-body ${tint} ${
          animate ? 'bubble-in' : ''
        } ${isKhmer ? 'leading-kh' : ''}`}
      >
        {children}
      </div>
    </div>
  )
}
