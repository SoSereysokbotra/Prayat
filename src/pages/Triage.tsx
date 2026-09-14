import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Flame, Heart, X } from 'lucide-react'
import LanguageToggle from '../components/LanguageToggle'
import ScreenState from '../components/ScreenState'
import TriageCardView from '../components/TriageCardView'
import { useT, useIsKhmer } from '../hooks/useT'
import { motionToken } from '../hooks/useMotionToken'
import { useGameStore } from '../store/gameStore'
import { answerCard, startTriage } from '../api/client'
import {
  TRIAGE_MAX_MISTAKES,
  TRIAGE_SECONDS_PER_CARD,
  type Localized,
  type TriageCard,
  type TriageVerdict,
} from '../../shared/types'

/**
 * Speed Triage.
 *
 * Five seconds a card, REAL or SCAM, three mistakes and the run ends.
 *
 * A timeout is submitted as a verdict of its own and counts as a mistake.
 * Were it only to break the streak, a player who never taps anything could
 * never fail — the run would be unloseable and the timer decorative.
 *
 * The two-second explanation is what separates this from a reflex game.
 * Without it a player gets faster but not smarter; with it they absorb one
 * specific rule per card. A missed or wrong card holds for three seconds,
 * because that is when a player actually needs the reading time.
 */

type Phase = 'loading' | 'showing' | 'explaining' | 'over' | 'error'

interface Feedback {
  isCorrect: boolean
  wasScam: boolean
  explanation: Localized
  points: number
  multiplier: number
}

export default function Triage() {
  const navigate = useNavigate()
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const addScore = useGameStore((s) => s.addScore)

  const [phase, setPhase] = useState<Phase>('loading')
  const [card, setCard] = useState<TriageCard | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [remaining, setRemaining] = useState(TRIAGE_SECONDS_PER_CARD * 1000)

  const sessionRef = useRef<string | null>(null)
  const aliveRef = useRef(true)
  // Synchronous, like Guardian's: two taps in the same tick would otherwise
  // both submit before a re-render could disable anything.
  const lockRef = useRef(false)
  const deadlineRef = useRef(0)

  const kh = isKhmer ? 'leading-kh' : ''

  /* ---- answer ---- */
  const answer = useCallback(
    async (verdict: TriageVerdict | 'timeout') => {
      if (lockRef.current) return
      lockRef.current = true

      const sessionId = sessionRef.current
      const current = card
      if (!sessionId || !current) return

      setPhase('explaining')

      try {
        const result = await answerCard(sessionId, current.id, verdict)
        if (!aliveRef.current) return

        setFeedback({
          isCorrect: result.isCorrect,
          wasScam: result.wasScam,
          explanation: result.explanation,
          points: result.pointsAwarded,
          multiplier: result.multiplier,
        })
        setScore((s) => s + result.pointsAwarded)
        setStreak(result.streak)
        setMistakes(result.mistakes)

        // Longer on a wrong answer: that is when the explanation is doing work.
        const hold = motionToken(
          result.isCorrect ? '--timing-explain-right' : '--timing-explain-wrong',
        )

        setTimeout(() => {
          if (!aliveRef.current) return
          setFeedback(null)

          if (result.done) {
            setPhase('over')   // the score is banked once by the effect below
            return
          }

          setCard(result.nextCard)
          lockRef.current = false
          deadlineRef.current = Date.now() + TRIAGE_SECONDS_PER_CARD * 1000
          setRemaining(TRIAGE_SECONDS_PER_CARD * 1000)
          setPhase('showing')
        }, hold)
      } catch {
        if (!aliveRef.current) return
        setPhase('error')
      }
    },
    [card],
  )

  /* ---- start ---- */
  useEffect(() => {
    aliveRef.current = true

    startTriage(language)
      .then((run) => {
        if (!aliveRef.current) return
        sessionRef.current = run.sessionId
        setCard(run.card)
        lockRef.current = false
        deadlineRef.current = Date.now() + TRIAGE_SECONDS_PER_CARD * 1000
        setRemaining(TRIAGE_SECONDS_PER_CARD * 1000)
        setPhase('showing')
      })
      .catch(() => aliveRef.current && setPhase('error'))

    return () => {
      aliveRef.current = false
    }
    // Language fixes the session server-side; changing it mid-run must not
    // restart the run, and every string is picked at render time anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---- the clock ----
     Driven from a wall-clock deadline rather than by decrementing, so a
     backgrounded tab or a slow frame cannot hand the player extra time. */
  useEffect(() => {
    if (phase !== 'showing') return

    const tick = setInterval(() => {
      const left = deadlineRef.current - Date.now()
      setRemaining(Math.max(left, 0))
      if (left <= 0) answer('timeout')
    }, 50)

    return () => clearInterval(tick)
  }, [phase, answer])

  /* ---- bank the score once, when the run ends ---- */
  const bankedRef = useRef(false)
  useEffect(() => {
    if (phase !== 'over' || bankedRef.current) return
    bankedRef.current = true
    addScore(score)
  }, [phase, score, addScore])

  if (phase === 'loading') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind="loading" />
      </main>
    )
  }

  if (phase === 'error') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind="error" onRetry={() => navigate(0)} />
      </main>
    )
  }

  if (phase === 'over') {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-screen-sm flex-col items-center justify-center gap-section px-screen-x py-section text-center">
        <h1 className={`text-title font-semibold ${kh}`}>{t('runOver')}</h1>

        <div className="w-full rounded-card border border-border bg-surface p-section">
          <p className={`text-small text-muted ${kh}`}>{t('pointsEarned')}</p>
          <p className="text-display font-bold tabular-nums">{score}</p>
        </div>

        <div className="flex w-full flex-col gap-stack">
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
            className={`tap-target flex items-center justify-center rounded-button px-section
                        text-muted ${kh}`}
          >
            {t('backHome')}
          </Link>
        </div>
      </main>
    )
  }

  const secondsLeft = Math.ceil(remaining / 1000)
  const fraction = remaining / (TRIAGE_SECONDS_PER_CARD * 1000)
  const livesLeft = TRIAGE_MAX_MISTAKES - mistakes

  return (
    <main className="screen-in mx-auto flex h-dvh w-full max-w-screen-sm flex-col px-screen-x py-stack">
      {/* ---- status ---- */}
      <header className="flex shrink-0 items-center justify-between gap-stack">
        <Link to="/" aria-label={t('back')} className="tap-target flex items-center text-muted">
          <ArrowLeft aria-hidden className="h-icon w-icon" />
        </Link>

        <div className="flex items-center gap-stack">
          <span className="flex items-center gap-stack text-small tabular-nums">
            <Flame aria-hidden className="h-icon w-icon text-caution" />
            {streak}
          </span>
          <span className="flex items-center gap-stack text-small tabular-nums">
            {Array.from({ length: TRIAGE_MAX_MISTAKES }, (_, i) => (
              <Heart
                key={i}
                aria-hidden
                className={`h-icon w-icon ${i < livesLeft ? 'text-danger' : 'text-muted'}`}
              />
            ))}
          </span>
          <span className="text-small font-semibold tabular-nums">{score}</span>
        </div>

        <LanguageToggle compact />
      </header>

      {/* ---- the clock ---- */}
      <div
        role="timer"
        aria-label={`${secondsLeft}`}
        className="mt-stack h-timer-bar w-full shrink-0 overflow-hidden rounded-button bg-surface-alt"
      >
        <div
          className={`h-full rounded-button ${fraction < 0.35 ? 'bg-danger' : 'bg-safe'}`}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>

      {/* ---- the card ---- */}
      {/* stretch, not centre: a card floating in empty space reads as a bug */}
      <section className="flex min-h-0 flex-1 py-stack">
        {card && <TriageCardView card={card} />}
      </section>

      {/* ---- verdict, or the explanation ---- */}
      <section className="shrink-0">
        {feedback ? (
          <div
            className={`bubble-in rounded-card border p-stack ${
              feedback.isCorrect ? 'border-safe' : 'border-danger'
            } bg-surface`}
          >
            <p className="flex items-center gap-stack text-small font-semibold">
              {feedback.isCorrect ? (
                <Check aria-hidden className="h-icon w-icon text-safe" />
              ) : (
                <X aria-hidden className="h-icon w-icon text-danger" />
              )}
              <span className={kh}>{feedback.wasScam ? t('itWasScam') : t('itWasReal')}</span>
              {feedback.points > 0 && (
                <span className="ml-auto tabular-nums text-safe">
                  +{feedback.points}
                  {feedback.multiplier > 1 && ` (×${feedback.multiplier})`}
                </span>
              )}
            </p>
            <p className={`mt-stack text-body ${kh}`}>{feedback.explanation[language]}</p>
          </div>
        ) : (
          <div className="flex gap-stack">
            <button
              type="button"
              onClick={() => answer('real')}
              disabled={phase !== 'showing'}
              className={`tap-target flex flex-1 items-center justify-center rounded-button
                          bg-verdict-real px-section text-primary-text
                          transition-opacity duration-option-fade
                          disabled:opacity-50 ${kh}`}
            >
              {t('verdictReal')}
            </button>
            <button
              type="button"
              onClick={() => answer('scam')}
              disabled={phase !== 'showing'}
              className={`tap-target flex flex-1 items-center justify-center rounded-button
                          bg-verdict-scam px-section text-primary-text
                          transition-opacity duration-option-fade
                          disabled:opacity-50 ${kh}`}
            >
              {t('verdictScam')}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
