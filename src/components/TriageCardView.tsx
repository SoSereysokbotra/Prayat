import { FileText, Globe, Lock, QrCode, Receipt, Send, ThumbsUp } from 'lucide-react'
import { useIsKhmer } from '../hooks/useT'
import { useGameStore } from '../store/gameStore'
import type { TriageCard } from '../../shared/types'

/**
 * A Speed Triage card, rendered as HTML.
 *
 * Not an image. An image cannot answer the KH/EN toggle, cannot be edited
 * without re-exporting an asset, and fifty PNGs would eat the offline cache
 * budget the Khmer font needs. A card is JSON with a `surface` field and this
 * component picks the chrome.
 *
 * Nothing here hints at the verdict. The chrome is the chrome a real message
 * of that kind would wear — a scam SMS and a genuine SMS are dressed
 * identically, which is the entire point. Real life does not colour-code.
 */
export default function TriageCardView({ card }: { card: TriageCard }) {
  const language = useGameStore((s) => s.language)
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  const sender = card.sender[language]
  const body = card.body[language]
  const meta = card.meta?.[language] ?? ''

  const shell =
    'flex h-full min-h-card-min w-full flex-col overflow-hidden rounded-card border border-border'

  switch (card.surface) {
    /* ---- phone SMS app ---- */
    case 'sms':
      return (
        <div className={`${shell} bg-chrome-sms`}>
          <div className="flex items-center gap-stack border-b border-border px-stack py-stack">
            <span className="flex items-center justify-center rounded-bubble bg-surface-alt p-stack text-small">
              <Send aria-hidden className="h-icon w-icon" />
            </span>
            <span className="min-w-0 flex-1 truncate text-small font-semibold">{sender}</span>
          </div>
          <div className="flex-1 p-stack">
            <p className={`rounded-bubble bg-surface p-stack text-body ${kh}`}>{body}</p>
            {meta && <p className={`mt-stack break-all text-small text-muted ${kh}`}>{meta}</p>}
          </div>
        </div>
      )

    /* ---- telegram ---- */
    case 'telegram':
      return (
        <div className={`${shell} bg-chrome-telegram`}>
          <div className="flex items-center gap-stack border-b border-border px-stack py-stack">
            <span className="flex items-center justify-center rounded-bubble bg-primary p-stack text-primary-text">
              <Send aria-hidden className="h-icon w-icon" />
            </span>
            <span className="min-w-0 flex-1 truncate text-small font-semibold">{sender}</span>
          </div>
          <div className="flex-1 p-stack">
            <p className={`rounded-bubble bg-bubble-relative p-stack text-body ${kh}`}>{body}</p>
            {meta && (
              <p className={`mt-stack flex items-center gap-stack break-all rounded-button
                             border border-border bg-surface p-stack text-small text-muted ${kh}`}>
                <FileText aria-hidden className="h-icon w-icon shrink-0" />
                {meta}
              </p>
            )}
          </div>
        </div>
      )

    /* ---- facebook post ---- */
    case 'facebook':
      return (
        <div className={`${shell} bg-chrome-facebook`}>
          <div className="flex items-center gap-stack px-stack pt-stack">
            <span className="flex items-center justify-center rounded-bubble bg-surface-alt p-stack">
              <ThumbsUp aria-hidden className="h-icon w-icon" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-small font-semibold">{sender}</p>
              {meta && <p className="truncate text-small text-muted">{meta}</p>}
            </div>
          </div>
          <p className={`flex-1 p-stack text-body ${kh}`}>{body}</p>
        </div>
      )

    /* ---- browser address bar ---- */
    case 'url-bar':
      return (
        <div className={`${shell} bg-chrome-browser`}>
          <div className="flex items-center gap-stack p-stack">
            <Lock aria-hidden className="h-icon w-icon shrink-0 text-muted" />
            <span className="min-w-0 flex-1 break-all rounded-button bg-surface px-stack py-stack text-small">
              {meta || sender}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-stack bg-surface p-stack">
            <Globe aria-hidden className="h-icon w-icon text-muted" />
            <p className={`text-center text-body ${kh}`}>{body}</p>
          </div>
        </div>
      )

    /* ---- payment QR ---- */
    case 'qr':
      return (
        <div className={`${shell} bg-surface`}>
          <div className="flex flex-1 flex-col items-center gap-stack p-stack">
            <span
              aria-hidden
              className="flex h-qr w-qr items-center justify-center rounded-card bg-surface-alt"
            >
              <QrCode className="h-icon w-icon text-muted" />
            </span>
            <p className={`text-center text-body ${kh}`}>{body}</p>
            <p className={`text-center text-small font-semibold ${kh}`}>{sender}</p>
            {meta && <p className={`text-center text-small text-muted ${kh}`}>{meta}</p>}
          </div>
        </div>
      )

    /* ---- transaction receipt ---- */
    case 'receipt':
      return (
        <div className={`${shell} bg-chrome-receipt`}>
          <div className="flex items-center gap-stack border-b border-border px-stack py-stack">
            <Receipt aria-hidden className="h-icon w-icon text-muted" />
            <span className="min-w-0 flex-1 truncate text-small font-semibold">{sender}</span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-stack p-stack text-center">
            <p className={`text-title font-semibold tabular-nums ${kh}`}>{body}</p>
            {meta && <p className={`break-all text-small text-muted ${kh}`}>{meta}</p>}
          </div>
        </div>
      )
  }
}
