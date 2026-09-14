import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  AtSign,
  Clock,
  DollarSign,
  FileWarning,
  Flag,
  Link2,
  MessageSquare,
  Phone,
  QrCode,
  type LucideIcon,
} from 'lucide-react'
import LanguageToggle from '../components/LanguageToggle'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
import { useGameStore } from '../store/gameStore'
import { finishInvestigation, startInvestigation, tapElement } from '../api/client'
import {
  INVESTIGATION_WRONG_TAP_PENALTY_SECONDS,
  type ElementKind,
  type Investigation as InvestigationData,
  type InvestigationSummary,
} from '../../shared/types'

/**
 * The Investigation.
 *
 * A whole conversation, and the player taps what looks wrong. Tappable units
 * are discrete elements — a message, a link, an amount, a filename — never
 * free text: Khmer is written without spaces between words, so a word-level
 * tap target is not merely hard to hit, it is not well defined.
 *
 * A wrong tap costs ten seconds. Unlimited free taps would let a player tap
 * everything and brute-force a perfect score; ending the run on a wrong tap
 * would punish the exploration the mode exists to teach.
 *
 * The server decides hit or miss, one tap at a time. Sending the flags to the
 * browser would put the answers in devtools.
 */

const KIND_ICON: Record<ElementKind, LucideIcon> = {
  message: MessageSquare,
  link: Link2,
  qr: QrCode,
  phone: Phone,
  amount: DollarSign,
  sender: AtSign,
  file: FileWarning,
  timestamp: Clock,
}

type Phase = 'loading' | 'hunting' | 'over' | 'error'

export default function Investigation() {
  const navigate = useNavigate()
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const addScore = useGameStore((s) => s.addScore)

  const [phase, setPhase] = useState<Phase>('loading')
  const [data, setData] = useState<InvestigationData | null>(null)
  const [found, setFound] = useState<Record<string, string>>({})
  const [missed, setMissed] = useState<string[]>([])
  const [summary, setSummary] = useState<InvestigationSummary | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [flash, setFlash] = useState<string | null>(null)

  const sessionRef = useRef<string | null>(null)
  const aliveRef = useRef(true)
  const deadlineRef = useRef(0)
  const pendingRef = useRef(new Set<string>())
  const finishedRef = useRef(false)

  const kh = isKhmer ? 'leading-kh' : ''

  /* ---- end the hunt ---- */
  const finish = useCallback(async () => {
    if (finishedRef.current) return
    finishedRef.current = true

    const sessionId = sessionRef.current
    if (!sessionId) return

    try {
      const result = await finishInvestigation(sessionId)
      if (!aliveRef.current) return
      setSummary(result)
      addScore(result.score)
      setPhase('over')
    } catch {
      if (!aliveRef.current) return
      setPhase('error')
    }
  }, [addScore])

  /* ---- tap ---- */
  const tap = useCallback(
    async (elementId: string) => {
      const sessionId = sessionRef.current
      if (!sessionId || phase !== 'hunting') return
      if (found[elementId] || missed.includes(elementId)) return
      // A second tap on the same element while the first is still in flight
      // would be punished twice for one gesture.
      if (pendingRef.current.has(elementId)) return
      pendingRef.current.add(elementId)

      try {
        const result = await tapElement(sessionId, elementId)
        if (!aliveRef.current) return

        if (result.hit) {
          setFound((f) => ({ ...f, [elementId]: result.explanation?.[language] ?? '' }))
          if (result.done) void finish()
        } else {
          setMissed((m) => [...m, elementId])
          // The penalty is time, not the run.
          deadlineRef.current -= INVESTIGATION_WRONG_TAP_PENALTY_SECONDS * 1000
          setFlash(elementId)
          setTimeout(() => aliveRef.current && setFlash(null), 900)
        }
      } catch {
        /* a 409 means it was already tapped — nothing to tell the player */
      } finally {
        pendingRef.current.delete(elementId)
      }
    },
    [phase, found, missed, language, finish],
  )

  /* ---- start ---- */
  useEffect(() => {
    aliveRef.current = true

    startInvestigation(language)
      .then((run) => {
        if (!aliveRef.current) return
        sessionRef.current = run.sessionId
        setData(run.investigation)
        deadlineRef.current = Date.now() + run.investigation.durationSeconds * 1000
        setRemaining(run.investigation.durationSeconds * 1000)
        setPhase('hunting')
      })
      .catch(() => aliveRef.current && setPhase('error'))

    return () => {
      aliveRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---- the clock ----
     Wall-clock deadline, so a backgrounded tab cannot buy extra time, and so
     a wrong-tap penalty is a simple subtraction from the deadline. */
  useEffect(() => {
    if (phase !== 'hunting') return

    const tick = setInterval(() => {
      const left = deadlineRef.current - Date.now()
      setRemaining(Math.max(left, 0))
      if (left <= 0) void finish()
    }, 100)

    return () => clearInterval(tick)
  }, [phase, finish])

  if (phase === 'loading' || phase === 'error') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState
          kind={phase === 'error' ? 'error' : 'loading'}
          onRetry={() => navigate(0)}
        />
      </main>
    )
  }

  /* ---- summary ---- */
  if (phase === 'over' && summary) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col gap-section px-screen-x py-section">
        <header className="flex items-center justify-end">
          <LanguageToggle />
        </header>

        <section
          className={`flex items-center gap-stack rounded-card p-stack text-primary-text ${
            summary.complete ? 'bg-safe' : 'bg-danger'
          }`}
        >
          <Flag aria-hidden className="h-icon w-icon shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className={`text-title font-semibold ${kh}`}>
              {summary.complete ? t('youFoundAll') : t('timeUp')}
            </h1>
            <p className={`text-small tabular-nums ${kh}`}>
              {summary.found} / {summary.flagCount} {t('flagsFound')}
            </p>
          </div>
        </section>

        {summary.missed.length > 0 && (
          <section>
            <h2 className={`mb-stack text-small text-muted ${kh}`}>{t('missedFlags')}</h2>
            <ul className="flex flex-col gap-stack">
              {summary.missed.map((m) => (
                <li
                  key={m.elementId}
                  className="flex items-start gap-stack rounded-card border border-border bg-surface p-stack"
                >
                  <Flag aria-hidden className="h-icon w-icon shrink-0 text-danger" />
                  <p className={`min-w-0 flex-1 text-body ${kh}`}>{m.explanation[language]}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className={`mb-stack text-small text-muted ${kh}`}>{t('ruleHeading')}</h2>
          <p
            className={`rounded-card border border-caution bg-surface p-section text-rule font-semibold ${kh}`}
          >
            {summary.rule[language]}
          </p>
        </section>

        <section className="flex items-baseline justify-between gap-stack rounded-card border border-border bg-surface p-stack">
          <span className={`text-small text-muted ${kh}`}>{t('pointsEarned')}</span>
          <span className="text-title font-semibold tabular-nums">{summary.score}</span>
        </section>

        <div className="flex flex-col gap-stack">
          <button
            type="button"
            onClick={() => navigate(0)}
            className={`tap-target flex items-center justify-center rounded-button bg-primary
                        px-section text-primary-text ${kh}`}
          >
            {t('playAgain')}
          </button>
          <Link
            to="/"
            className={`tap-target flex items-center justify-center rounded-button px-section text-muted ${kh}`}
          >
            {t('backHome')}
          </Link>
        </div>
      </main>
    )
  }

  if (!data) return null

  const seconds = Math.ceil(remaining / 1000)
  const mmss = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  const low = remaining < 30000

  return (
    <main className="mx-auto flex h-dvh w-full max-w-screen-sm flex-col px-screen-x py-stack">
      {/* ---- status ---- */}
      <header className="flex shrink-0 items-center justify-between gap-stack">
        <Link to="/" aria-label={t('back')} className="tap-target flex items-center text-muted">
          <ArrowLeft aria-hidden className="h-icon w-icon" />
        </Link>

        <div className="flex items-center gap-stack">
          <span className="flex items-center gap-stack text-small tabular-nums">
            <Flag aria-hidden className="h-icon w-icon text-caution" />
            {Object.keys(found).length} / {data.flagCount}
          </span>
          <span
            role="timer"
            className={`flex items-center gap-stack text-small font-semibold tabular-nums ${
              low ? 'text-danger' : ''
            }`}
          >
            <Clock aria-hidden className="h-icon w-icon" />
            {mmss}
          </span>
        </div>

        <LanguageToggle />
      </header>

      <p className={`shrink-0 py-stack text-center text-small text-muted ${kh}`}>
        {t('tapSuspicious')}
      </p>

      {/* ---- the conversation ---- */}
      <div className="flex min-h-0 flex-1 flex-col gap-stack overflow-y-auto overscroll-contain pb-stack">
        {data.elements.map((el) => {
          const Icon = KIND_ICON[el.kind]
          const isFound = el.id in found
          const isMissed = missed.includes(el.id)
          const isFlashing = flash === el.id
          const mine = el.from === 'you'

          return (
            <div key={el.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
              <button
                type="button"
                onClick={() => tap(el.id)}
                disabled={isFound || isMissed}
                aria-pressed={isFound}
                className={`tap-target bubble-max flex items-start gap-stack rounded-bubble border
                            px-stack py-stack text-left text-body transition-colors duration-option-fade
                            ${
                              isFound
                                ? 'border-safe bg-surface'
                                : isFlashing || isMissed
                                  ? 'border-danger bg-surface'
                                  : mine
                                    ? 'border-border bg-bubble-player'
                                    : 'border-border bg-bubble-auntie'
                            }
                            ${isMissed && !isFlashing ? 'opacity-50' : ''}`}
              >
                <Icon
                  aria-hidden
                  className={`h-icon w-icon shrink-0 ${isFound ? 'text-safe' : 'text-muted'}`}
                />
                <span className={`min-w-0 flex-1 ${kh}`}>{el.text[language]}</span>
              </button>

              {isFound && (
                <p
                  className={`bubble-in bubble-max mt-stack rounded-card border border-safe
                              bg-surface p-stack text-small ${kh}`}
                >
                  {found[el.id]}
                </p>
              )}

              {isFlashing && (
                <p className={`bubble-in mt-stack text-small text-danger ${kh}`}>
                  {t('notTheIssue')} · {t('penaltyTenSeconds')}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
