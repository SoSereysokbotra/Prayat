import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Flame,
  HeartCrack,
  Home,
  Lightbulb,
  Package,
  RotateCcw,
  Share2,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'
import { useLocalized } from '../store/gameStore'
import { getTriageSummary, listTriageDecks } from '../api/client'
import { TRIAGE_PACKS } from '../lib/triagePacks'
import type { CardSurface, TriageSummary } from '../../shared/types'
import type { UIKey } from '../i18n/ui'

/** One answered card, as the run saw it. */
export interface SurfaceResult {
  surface: CardSurface
  isCorrect: boolean
}

const SURFACE_LABEL: Record<CardSurface, UIKey> = {
  sms: 'surfaceSms',
  telegram: 'surfaceTelegram',
  facebook: 'surfaceFacebook',
  'url-bar': 'surfaceUrlBar',
  qr: 'surfaceQr',
  receipt: 'surfaceReceipt',
}

/**
 * Which pack drills a surface. Only the honest pairings: a URL pack for
 * URLs and QR links, the jobs pack for Telegram (where those scams live).
 * A surface with no natural pack gets no tip rather than a vague one.
 */
const PACK_FOR_SURFACE: Partial<Record<CardSurface, string>> = {
  'url-bar': 'pack-web',
  qr: 'pack-web',
  telegram: 'pack-jobs',
}

interface TriageGameOverProps {
  sessionId: string
  deckId: string
  results: SurfaceResult[]
  /** The device's best before this run was banked. */
  previousBest: number
  score: number
}

/**
 * Speed Triage — the run is over.
 *
 * What happened (cards, score, best streak), whether it beat the device's
 * record, and where the mistakes were — by surface, because "you keep
 * falling for fake URLs" is something a player can act on and "you got 4
 * wrong" is not. The tip points at the pack that drills the weakest
 * surface, but only if that pack exists.
 */
export default function TriageGameOver({ sessionId, deckId, results, previousBest, score }: TriageGameOverProps) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const localized = useLocalized()
  const [summary, setSummary] = useState<TriageSummary | null>(null)
  const [availableDecks, setAvailableDecks] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let alive = true
    getTriageSummary(sessionId)
      .then((s) => alive && setSummary(s))
      .catch(() => {
        /* the score is already on screen; the summary only adds detail */
      })
    listTriageDecks()
      .then((rows) => alive && setAvailableDecks(rows.map((d) => d.id)))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [sessionId])

  const kh = isKhmer ? 'leading-kh' : ''
  const isNewBest = score > previousBest

  /* ---- mistakes by surface, worst first; then surfaces with a clean sheet ---- */
  const bySurface = new Map<CardSurface, { wrong: number; seen: number }>()
  for (const r of results) {
    const row = bySurface.get(r.surface) ?? { wrong: 0, seen: 0 }
    row.seen++
    if (!r.isCorrect) row.wrong++
    bySurface.set(r.surface, row)
  }
  const struggled = [...bySurface.entries()].filter(([, v]) => v.wrong > 0).sort((a, b) => b[1].wrong - a[1].wrong)
  const clean = [...bySurface.entries()].filter(([, v]) => v.wrong === 0)

  const worst = struggled[0]?.[0]
  const tipDeckId = worst ? PACK_FOR_SURFACE[worst] : undefined
  const tipPack = tipDeckId && availableDecks.includes(tipDeckId) ? TRIAGE_PACKS.find((p) => p.deckId === tipDeckId) : undefined

  const share = useCallback(async () => {
    const cards = summary?.cardsAnswered ?? results.length
    const text = `${t('shareTriageText').replace('{n}', String(cards)).replace('{score}', String(score))} ${location.origin}`
    try {
      if (navigator.share) {
        await navigator.share({ text })
        return
      }
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      /* cancelled, or clipboard refused — nothing to report */
    }
  }, [t, summary, results.length, score])

  const stat = (label: UIKey, value: React.ReactNode) => (
    <div className="flex items-baseline justify-between gap-stack">
      <dt className={`text-body text-muted ${kh}`}>{t(label)}</dt>
      <dd className="text-body font-semibold tabular-nums">{value}</dd>
    </div>
  )

  return (
    <main className="screen-in mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col gap-section px-screen-x py-section">
      <header className="flex flex-col items-center gap-stack text-center">
        <span
          aria-hidden
          className="flex h-illustration-sm w-illustration-sm items-center justify-center rounded-full bg-danger/15 text-danger"
        >
          <HeartCrack className="h-wordmark w-wordmark" />
        </span>
        <h1 className={`text-title font-bold ${kh}`}>{t('gameOver')}</h1>
      </header>

      {/* ---- the run ---- */}
      <dl className="flex flex-col gap-stack rounded-card border border-border bg-surface p-stack">
        {stat('cardsSurvived', summary?.cardsAnswered ?? results.length)}
        {stat('scoreLabel', score)}
        {stat(
          'bestStreak',
          <span className="flex items-center gap-ring">
            {summary?.bestStreak ?? '–'}
            <Flame aria-hidden className="h-icon w-icon fill-current text-caution" />
          </span>,
        )}
      </dl>

      {/* ---- the record ---- */}
      <dl className={`flex flex-col gap-stack rounded-card border p-stack ${isNewBest ? 'border-caution bg-caution/10' : 'border-border bg-surface'}`}>
        <div className="flex items-baseline justify-between gap-stack">
          <dt className={`text-body text-muted ${kh}`}>{t('yourHighScore')}</dt>
          <dd className="flex items-center gap-stack text-body font-semibold tabular-nums">
            {Math.max(score, previousBest)}
            {isNewBest && (
              <span className={`flex items-center gap-ring rounded-button bg-caution px-stack text-small font-bold text-primary-text ${kh}`}>
                <Sparkles aria-hidden className="h-icon w-icon" />
                {t('newRecord')}
              </span>
            )}
          </dd>
        </div>
        {isNewBest && previousBest > 0 && stat('previousBest', previousBest)}
      </dl>

      {/* ---- where it went wrong ---- */}
      {bySurface.size > 0 && (
        <section>
          <h2 className={`text-body font-bold ${kh}`}>{t('struggledWith')}</h2>
          <ul className="mt-stack divide-y divide-border rounded-card border border-border bg-surface">
            {struggled.map(([surface, v]) => (
              <li key={surface} className={`flex items-center gap-stack p-stack text-body ${kh}`}>
                <XCircle aria-hidden className="h-icon w-icon shrink-0 text-danger" />
                <span className="min-w-0 flex-1">{t(SURFACE_LABEL[surface])}</span>
                <span className="shrink-0 text-small text-muted">{t('nWrong').replace('{n}', String(v.wrong))}</span>
              </li>
            ))}
            {clean.map(([surface]) => (
              <li key={surface} className={`flex items-center gap-stack p-stack text-body ${kh}`}>
                <CheckCircle2 aria-hidden className="h-icon w-icon shrink-0 text-safe" />
                <span className="min-w-0 flex-1">{t(SURFACE_LABEL[surface])}</span>
                <span className="shrink-0 text-small text-muted">{t('allCorrect')}</span>
              </li>
            ))}
          </ul>

          {tipPack && (
            <Link
              to={`/triage/countdown/${tipPack.deckId}`}
              className={`mt-stack flex items-start gap-stack rounded-card border border-primary bg-primary/10 p-stack text-body
                          transition-colors duration-option-fade hover:bg-primary/15 ${kh}`}
            >
              <Lightbulb aria-hidden className="h-icon w-icon shrink-0 text-primary" />
              <span className="min-w-0 flex-1">
                <span className="font-semibold text-primary">{t('tip')}: </span>
                {t('tryPackTip').replace('{pack}', localized(tipPack.title))}
              </span>
            </Link>
          )}
        </section>
      )}

      {/* ---- what next ---- */}
      <div className="mt-auto flex flex-col gap-stack">
        <Link
          to={`/triage/countdown/${deckId}`}
          replace
          className={`tap-target flex items-center justify-center gap-stack rounded-button bg-primary
                      px-section text-body font-semibold text-primary-text ${kh}`}
        >
          <RotateCcw aria-hidden className="h-icon w-icon" />
          {t('playAgain')}
        </Link>
        <div className="flex gap-stack">
          <Link
            to="/triage"
            className={`tap-target flex flex-1 items-center justify-center gap-stack rounded-button border border-border
                        bg-surface px-stack text-body ${kh}`}
          >
            <Package aria-hidden className="h-icon w-icon" />
            {t('changePack')}
          </Link>
          <Link
            to="/"
            className={`tap-target flex flex-1 items-center justify-center gap-stack rounded-button border border-border
                        bg-surface px-stack text-body ${kh}`}
          >
            <Home aria-hidden className="h-icon w-icon" />
            {t('home')}
          </Link>
        </div>
        <button
          type="button"
          onClick={share}
          className={`tap-target flex items-center justify-center gap-stack rounded-button px-section text-body text-muted ${kh}`}
        >
          <Share2 aria-hidden className="h-icon w-icon" />
          {copied ? t('shareCopied') : t('shareScore')}
        </button>
      </div>
    </main>
  )
}
