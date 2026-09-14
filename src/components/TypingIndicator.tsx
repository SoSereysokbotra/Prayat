/**
 * Three bouncing dots in a bubble.
 *
 * This is doing real work, not decoration. It covers network latency and it
 * makes the exchange feel like a conversation rather than a form submission.
 * Keep it even when the response is instant.
 *
 * How long it holds is --timing-typing-min, read in TS via motionToken().
 * The dot animation itself is pure CSS in global.css.
 */
export default function TypingIndicator({ variant = 'auntie' }: { variant?: 'auntie' | 'scammer' }) {
  return (
    <div className="flex justify-start" role="status" aria-label="typing">
      <div
        className={`bubble-in flex items-center gap-stack rounded-bubble px-stack py-stack ${
          variant === 'scammer' ? 'bg-bubble-scammer' : 'bg-bubble-auntie'
        }`}
      >
        <span aria-hidden className="typing-dot bg-muted" />
        <span aria-hidden className="typing-dot bg-muted" />
        <span aria-hidden className="typing-dot bg-muted" />
      </div>
    </div>
  )
}
