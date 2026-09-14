import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, KeyRound, Lightbulb, ShieldCheck, UserRound, X } from 'lucide-react'
import LanguageToggle from '../../components/LanguageToggle'
import ScreenState from '../../components/ScreenState'
import { useT, useIsKhmer } from '../../hooks/useT'
import { useGameStore } from '../../store/gameStore'
import { useBootcampStore } from '../../store/bootcampStore'
import { startVipClub, takeDoorAction } from '../../api/client'
import type { BouncerRound, DoorAction, Localized } from '../../../shared/types'

/**
 * Module 1 — The VIP Club.
 *
 * The player is the bouncer. Three rounds:
 *   1  a real member gives the password  -> let them in
 *   2  a stranger GUESSES the password   -> there was no way to tell
 *   3  two-factor is on                  -> ask for the code, and he has none
 *
 * Round 2 is designed to be lost, and the UI treats it as a demonstration
 * rather than a mistake — no red, no penalty, just the realisation. Scoring it
 * as a failure would punish the player for a situation that genuinely had no
 * right answer, which is the exact opposite of what the round is teaching.
 *
 * "Ask for the code" only appears once 2FA is switched on. Offering it earlier
 * would give away that the answer changes.
 */

type Phase = 'loading' | 'deciding' | 'result' | 'done' | 'error'

interface Outcome {
  isCorrect: boolean
  unwinnable: boolean
  outcome: Localized
  lesson: Localized
}

export default function VipClub() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const language = useGameStore((s) => s.language)
  const markPassed = useBootcampStore((s) => s.markPassed)

  const [phase, setPhase] = useState<Phase>('loading')
  const [round, setRound] = useState<BouncerRound | null>(null)
  const [roundCount, setRoundCount] = useState(0)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [passed, setPassed] = useState(false)

  const sessionRef = useRef<string | null>(null)
  const aliveRef = useRef(true)
  const lockRef = useRef(false)

  const kh = isKhmer ? 'leading-kh' : ''

  useEffect(() => {
    aliveRef.current = true
    startVipClub()
      .then((run) => {
        if (!aliveRef.current) return
        sessionRef.current = run.sessionId
        setRound(run.round)
        setRoundCount(run.roundCount)
        lockRef.current = false
        setPhase('deciding')
      })
      .catch(() => aliveRef.current && setPhase('error'))
    return () => {
      aliveRef.current = false
    }
  }, [])

  const act = useCallback(
    async (action: DoorAction) => {
      if (lockRef.current) return
      lockRef.current = true

      const sessionId = sessionRef.current
      if (!sessionId) return

      try {
        const result = await takeDoorAction(sessionId, action)
        if (!aliveRef.current) return

        setOutcome({
          isCorrect: result.isCorrect,
          unwinnable: result.unwinnable,
          outcome: result.outcome,
          lesson: result.lesson,
        })

        if (result.done) {
          setPassed(result.passed)
          if (result.passed) markPassed('vip-club')
          setPhase('done')
        } else {
          setRound(result.nextRound)
          setPhase('result')
        }
      } catch {
        if (!aliveRef.current) return
        setPhase('error')
      }
    },
    [markPassed],
  )

  function nextRound() {
    setOutcome(null)
    lockRef.current = false
    setPhase('deciding')
  }

  if (phase === 'loading' || phase === 'error') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind={phase === 'error' ? 'error' : 'loading'} onRetry={() => navigate(0)} />
      </main>
    )
  }

  /* ---- finished ---- */
  if (phase === 'done') {
    return (
      <main className="screen-in mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col justify-center gap-section px-screen-x py-section text-center">
        <span
          aria-hidden
          className={`mx-auto flex items-center justify-center rounded-card p-section text-primary-text
                      ${passed ? 'bg-safe' : 'bg-danger'}`}
        >
          <KeyRound className="h-icon w-icon" />
        </span>

        <h1 className={`text-title font-semibold ${kh}`}>
          {passed ? t('modulePassed') : t('moduleFailed')}
        </h1>

        {outcome && (
          <p className={`rounded-card border border-caution bg-surface p-section text-rule font-semibold ${kh}`}>
            {outcome.lesson[language]}
          </p>
        )}

        {passed && (
          <p className={`flex items-center justify-center gap-stack text-body ${kh}`}>
            <KeyRound aria-hidden className="h-icon w-icon text-safe" />
            {t('toolUnlocked')}: <span className="font-semibold">{t('toolAuthenticator')}</span>
          </p>
        )}

        <div className="flex flex-col gap-stack">
          {!passed && (
            <button
              type="button"
              onClick={() => navigate(0)}
              className={`tap-target flex items-center justify-center rounded-button bg-primary
                          px-section text-primary-text ${kh}`}
            >
              {t('tryModuleAgain')}
            </button>
          )}
          <Link
            to="/bootcamp"
            className={`tap-target flex items-center justify-center rounded-button
                        ${passed ? 'bg-primary text-primary-text' : 'border border-border bg-surface'}
                        px-section ${kh}`}
          >
            {t('backToBootcamp')}
          </Link>
        </div>
      </main>
    )
  }

  if (!round) return null

  return (
    <main className="screen-in mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col px-screen-x py-section">
      <header className="flex shrink-0 items-center justify-between gap-stack">
        <Link to="/bootcamp" className="tap-target flex items-center gap-stack text-small text-muted">
          <ArrowLeft aria-hidden className="h-icon w-icon" />
          <span className={kh}>{t('back')}</span>
        </Link>
        <span className="text-small text-muted tabular-nums">
          {round.id} / {roundCount}
        </span>
        <LanguageToggle compact />
      </header>

      {/* ---- the door ---- */}
      <section className="flex flex-1 flex-col justify-center gap-section py-section">
        <div className="flex flex-col items-center gap-stack text-center">
          <span
            aria-hidden
            className="flex items-center justify-center rounded-card bg-surface-alt p-section"
          >
            <UserRound className="h-icon w-icon text-muted" />
          </span>
          <p className={`text-small text-muted ${kh}`}>{round.visitor[language]}</p>
        </div>

        <p className={`rounded-bubble bg-bubble-relative p-stack text-body ${kh}`}>
          {round.claim[language]}
        </p>

        {/* Visible state of the door itself — the difference between round 2
            and round 3 is this line, and it is the whole module. */}
        <p
          className={`flex items-center justify-center gap-stack rounded-button border px-stack py-stack
                      text-small ${round.twoFactorOn ? 'border-safe text-safe' : 'border-border text-muted'} ${kh}`}
        >
          <ShieldCheck aria-hidden className="h-icon w-icon shrink-0" />
          {round.twoFactorOn ? t('twoFactorOn') : t('twoFactorOff')}
        </p>

        {phase === 'result' && outcome && (
          <div
            className={`bubble-in flex flex-col gap-stack rounded-card border p-stack
                        ${outcome.unwinnable ? 'border-caution' : outcome.isCorrect ? 'border-safe' : 'border-danger'}
                        bg-surface`}
          >
            <p className="flex items-center gap-stack text-small font-semibold">
              {outcome.unwinnable ? (
                <Lightbulb aria-hidden className="h-icon w-icon text-caution" />
              ) : outcome.isCorrect ? (
                <Check aria-hidden className="h-icon w-icon text-safe" />
              ) : (
                <X aria-hidden className="h-icon w-icon text-danger" />
              )}
              <span className={kh}>
                {outcome.unwinnable
                  ? t('noWayToTell')
                  : outcome.isCorrect
                    ? t('goodCall')
                    : t('badCall')}
              </span>
            </p>
            <p className={`text-body ${kh}`}>{outcome.outcome[language]}</p>
            <p className={`text-small text-muted ${kh}`}>{outcome.lesson[language]}</p>
          </div>
        )}
      </section>

      {/* ---- what the bouncer can do ---- */}
      <section className="shrink-0">
        {phase === 'result' ? (
          <button
            type="button"
            onClick={nextRound}
            className={`tap-target flex w-full items-center justify-center rounded-button bg-primary
                        px-section text-primary-text ${kh}`}
          >
            {t('nextRound')}
          </button>
        ) : (
          <div className="flex flex-col gap-stack">
            {round.twoFactorOn && (
              <button
                type="button"
                onClick={() => act('demandCode')}
                className={`tap-target flex w-full items-center justify-center gap-stack rounded-button
                            bg-primary px-section text-primary-text ${kh}`}
              >
                <KeyRound aria-hidden className="h-icon w-icon" />
                {t('askForCode')}
              </button>
            )}
            <div className="flex gap-stack">
              <button
                type="button"
                onClick={() => act('admit')}
                className={`tap-target flex flex-1 items-center justify-center rounded-button
                            bg-verdict-real px-section text-primary-text ${kh}`}
              >
                {t('letThemIn')}
              </button>
              <button
                type="button"
                onClick={() => act('refuse')}
                className={`tap-target flex flex-1 items-center justify-center rounded-button
                            bg-verdict-scam px-section text-primary-text ${kh}`}
              >
                {t('turnThemAway')}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
