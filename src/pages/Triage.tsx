import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Flame, Heart, TimerOff, X } from 'lucide-react'
import LanguageToggle from '../components/LanguageToggle'
import ScreenState from '../components/ScreenState'
import TriageCardView from '../components/TriageCardView'
import TriageGameOver, { type SurfaceResult } from '../components/TriageGameOver'
import { useT, useIsKhmer } from '../hooks/useT'
import { motionToken } from '../hooks/useMotionToken'
import { useGameStore } from '../store/gameStore'
import { answerCard, startTriage } from '../api/client'
import {
  STREAK_TIERS,
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

type Outcome = 'correct' | 'wrong' | 'timeout'

interface Feedback {
  outcome: Outcome
  isCorrect: boolean
  wasScam: boolean
  explanation: Localized
  points: number
  multiplier: number
  streak: number
  livesLeft: number
}

/* Spelled out in full: Tailwind only emits layer classes it can see verbatim. */
const VERDICT_OUTLINE: Record<Outcome, string> = {
  correct: 'verdict-outline verdict-correct',
  wrong: 'verdict-outline verdict-wrong',
  timeout: 'verdict-outline verdict-timeout',
}

/** Haptics where the phone has them. Silently nothing elsewhere. */
function buzz(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* some browsers throw on vibrate without a user gesture; ignore */
  }
}

export default function Triage() {
  const navigate = useNavigate()
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const addScore = useGameStore((s) => s.addScore)
  const recordTriageRun = useGameStore((s) => s.recordTriageRun)

  const [phase, setPhase] = useState<Phase>('loading')
  // From the pack picker. Absent → the server's default deck.
  const { deckId } = useParams<{ deckId: string }>()
  const [card, setCard] = useState<TriageCard | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [remaining, setRemaining] = useState(TRIAGE_SECONDS_PER_CARD * 1000)
  // A streak tier just reached; shown as a banner for --timing-milestone.
  const [milestone, setMilestone] = useState<{ at: number; multiplier: number } | null>(null)
  // Every answer by surface, for the game-over breakdown.
  const [results, setResults] = useState<SurfaceResult[]>([])
  // The device record before this run was banked (null until it is).
  const [previousBest, setPreviousBest] = useState<number | null>(null)

  const sessionRef = useRef<string | null>(null)
  const aliveRef = useRef(true)
  // Synchronous, like Guardian's: two taps in the same tick would otherwise
  // both submit before a re-render could disable anything.
  const lockRef = useRef(false)
  const deadlineRef = useRef(0)
  // The two-seconds-left buzz fires once per card.
  const warnedRef = useRef(false)

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

        const outcome: Outcome = verdict === 'timeout' ? 'timeout' : result.isCorrect ? 'correct' : 'wrong'
        setFeedback({
          outcome,
          isCorrect: result.isCorrect,
          wasScam: result.wasScam,
          explanation: result.explanation,
          points: result.pointsAwarded,
          multiplier: result.multiplier,
          streak: result.streak,
          livesLeft: TRIAGE_MAX_MISTAKES - result.mistakes,
        })
        setScore((s) => s + result.pointsAwarded)
        setStreak(result.streak)
        setMistakes(result.mistakes)
        setResults((prev) => [...prev, { surface: current.surface, isCorrect: result.isCorrect }])

        // Wrong hurts once; time's up is a double buzz.
        const wrongBuzz = motionToken('--timing-buzz-wrong')
        const shortBuzz = motionToken('--timing-buzz-short')
        if (outcome === 'wrong') buzz(wrongBuzz)
        if (outcome === 'timeout') buzz([shortBuzz, shortBuzz, wrongBuzz])

        // Landing exactly on a tier is the moment to say so.
        const tier = STREAK_TIERS.find((tr) => tr.at === result.streak)
        if (result.isCorrect && tier) setMilestone({ at: tier.at, multiplier: tier.multiplier })

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
          warnedRef.current = false
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

    startTriage(language, deckId)
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

    const warnAt = motionToken('--timing-warn-at')
    const shortBuzz = motionToken('--timing-buzz-short')

    const tick = setInterval(() => {
      const left = deadlineRef.current - Date.now()
      setRemaining(Math.max(left, 0))
      if (left <= warnAt && !warnedRef.current) {
        warnedRef.current = true
        buzz(shortBuzz)
      }
      if (left <= 0) answer('timeout')
    }, 50)

    return () => clearInterval(tick)
  }, [phase, answer])

  /* ---- the milestone banner fades on its own ---- */
  useEffect(() => {
    if (!milestone) return
    const id = setTimeout(() => setMilestone(null), motionToken('--timing-milestone'))
    return () => clearTimeout(id)
  }, [milestone])

  /* ---- bank the score once, when the run ends ---- */
  const bankedRef = useRef(false)
  useEffect(() => {
    if (phase !== 'over' || bankedRef.current) return
    bankedRef.current = true
    addScore(score)
    setPreviousBest(recordTriageRun(score))
  }, [phase, score, addScore, recordTriageRun])

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
      <TriageGameOver
        sessionId={sessionRef.current ?? ''}
        deckId={deckId ?? ''}
        results={results}
        previousBest={previousBest ?? 0}
        score={score}
      />
    )
  }

  const secondsLeft = Math.ceil(remaining / 1000)
  const fraction = remaining / (TRIAGE_SECONDS_PER_CARD * 1000)
  const livesLeft = TRIAGE_MAX_MISTAKES - mistakes

  return (
    <main className="screen-in mx-auto flex h-dvh w-full max-w-screen-sm flex-col px-screen-x py-stack">
      {/* ---- status ---- */}
      <header className="flex shrink-0 items-center justify-between gap-stack">
        <Link to="/triage" aria-label={t('back')} className="tap-target flex items-center text-muted">
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
      <section className="relative flex min-h-0 flex-1 py-stack">
        <div
          className={`flex min-h-0 w-full ${
            feedback
              ? VERDICT_OUTLINE[feedback.outcome]
              : ''
          }`}
        >
          {card && <TriageCardView card={card} />}
        </div>

        {/* ---- streak milestone: a banner over the card, gone on its own ---- */}
        {milestone && (
          <div
            role="status"
            className={`bubble-in absolute inset-x-0 top-stack mx-auto flex w-fit max-w-full flex-col items-center
                        rounded-card bg-caution px-section py-stack text-center text-primary-text ${kh}`}
          >
            <span className="flex items-center gap-ring text-body font-bold">
              {Array.from({ length: Math.max(1, STREAK_TIERS.length - STREAK_TIERS.findIndex((tr) => tr.at === milestone.at)) }, (_, i) => (
                <Flame key={i} aria-hidden className="h-icon w-icon fill-current" />
              ))}
              {t('streakMilestone').replace('{n}', String(milestone.at))}
            </span>
            <span className="text-small">
              {t('multiplierFromNow').replace('{m}', String(milestone.multiplier))}
            </span>
          </div>
        )}
      </section>

      {/* ---- verdict, or the explanation ---- */}
      <section className="shrink-0">
        {feedback ? (
          <div
            role="status"
            className={`bubble-in rounded-card border p-stack bg-surface ${
              feedback.outcome === 'correct'
                ? 'border-safe'
                : feedback.outcome === 'wrong'
                  ? 'border-danger'
                  : 'border-caution'
            }`}
          >
            {/* line 1: the verdict */}
            <p className={`flex items-center gap-stack text-body font-bold ${kh}`}>
              {feedback.outcome === 'correct' && (
                <>
                  <Check aria-hidden className="h-icon w-icon shrink-0 text-safe" />
                  <span className="text-safe">{t('correct')}</span>
                </>
              )}
              {feedback.outcome === 'wrong' && (
                <>
                  <X aria-hidden className="h-icon w-icon shrink-0 text-danger" />
                  <span className="text-danger">{t('wrong')}</span>
                  <span className="text-muted">— {feedback.wasScam ? t('itWasScam') : t('itWasReal')}</span>
                </>
              )}
              {feedback.outcome === 'timeout' && (
                <>
                  <TimerOff aria-hidden className="h-icon w-icon shrink-0 text-caution" />
                  <span className="text-caution">{t('timeUp')}</span>
                </>
              )}
            </p>

            {/* line 2: what it cost or earned */}
            <p className={`mt-ring flex flex-wrap items-center gap-stack text-small text-muted ${kh}`}>
              {feedback.outcome === 'correct' ? (
                <>
                  <span className="font-semibold tabular-nums text-safe">
                    +{feedback.points} {t('points')}
                    {feedback.multiplier > 1 && ` (×${feedback.multiplier})`}
                  </span>
                  <span>{t('streakX').replace('{n}', String(feedback.streak))}</span>
                </>
              ) : (
                <>
                  <span>{t('livesRemaining').replace('{n}', String(feedback.livesLeft))}</span>
                  {feedback.outcome === 'timeout' && (
                    <span>
                      {t('theAnswerWas')}:{' '}
                      <span className={`font-semibold ${feedback.wasScam ? 'text-verdict-scam' : 'text-verdict-real'}`}>
                        {feedback.wasScam ? t('verdictScam') : t('verdictReal')}
                      </span>
                    </span>
                  )}
                </>
              )}
            </p>

            {/* the lesson */}
            <p className={`mt-stack text-small font-semibold uppercase text-muted ${kh}`}>
              {feedback.wasScam ? t('whyScam') : t('whyReal')}
            </p>
            <p className={`mt-ring text-body ${kh}`}>{feedback.explanation[language]}</p>
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
