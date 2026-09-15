import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, CheckCircle2, Lightbulb, MapPin, RotateCcw, ShieldCheck, Smartphone, Timer, X } from 'lucide-react'
import ModuleHeader from '../../components/ModuleHeader'
import { useT, useIsKhmer } from '../../hooks/useT'
import { motionToken } from '../../hooks/useMotionToken'
import { useBootcampStore } from '../../store/bootcampStore'
import type { UIKey } from '../../i18n/ui'

/**
 * Module 2 — The Door. The VIP Club.
 *
 * The player is the bouncer. Three visitors come to the door one at a time.
 * Every one of them has the password — that is the point — but only a real
 * member's phone shows the 2FA code. Password + code → LET IN. Password
 * only → BLOCK, however good the excuse.
 *
 * Pass = all three decided correctly. A wrong call is explained on the
 * spot and the same visitor is tried again; a second wrong call resets the
 * door. Rounds stack down the page as they are played and keep their
 * outcome, so by the third visitor the whole argument for 2FA is in view.
 *
 * The answer is visible on the card (code shown or not), so nothing is
 * hidden and the game runs on the device. The 45-second clock only counts
 * while a decision is pending.
 */

type Action = 'letIn' | 'block'

interface Visitor {
  /** Real members get "Round n: Real user", scammers "Round n: Scammer". */
  real: boolean
  password: string
  /** The code on the visitor's phone — only a real member has one. */
  code?: string
  /** What a scammer says instead of showing a code. */
  excuse?: UIKey
}

import { triggerCorrectFeedback, triggerWrongFeedback } from '../../lib/feedback'

const VISITORS: Visitor[] = [
  { real: true, password: 'SunSet99', code: '847291' },
  { real: false, password: 'SunSet99', excuse: 'visitorForgotPhone' },
  { real: false, password: 'SunSet99', excuse: 'visitorPhoneDied' },
]
const MAX_MISTAKES = 2

interface Played {
  visitor: Visitor
  action: Action
  correct: boolean
}

type Phase = 'ready' | 'playing' | 'passed' | 'reset'

export default function VipClub() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const markPassed = useBootcampStore((s) => s.markPassed)
  const kh = isKhmer ? 'leading-kh' : ''

  const [phase, setPhase] = useState<Phase>('ready')
  const [played, setPlayed] = useState<Played[]>([])
  const [index, setIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [lastWrong, setLastWrong] = useState<Played | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [timedOut, setTimedOut] = useState(false)

  const timerRef = useRef(0)
  const totalRef = useRef(0)
  const endsAtRef = useRef(0)

  const stopTimer = () => window.clearInterval(timerRef.current)

  useEffect(() => {
    totalRef.current = motionToken('--timing-vip-club')
    setSecondsLeft(Math.ceil(totalRef.current / 1000))
    return stopTimer
  }, [])

  const reset = useCallback((reason: 'mistakes' | 'time') => {
    stopTimer()
    triggerWrongFeedback([140, 70, 200])
    setIsShaking(true)
    window.setTimeout(() => setIsShaking(false), 300)
    setTimedOut(reason === 'time')
    setPlayed([])
    setIndex(0)
    setMistakes(0)
    setLastWrong(null)
    setPhase('reset')
  }, [])

  const start = useCallback(() => {
    setPlayed([])
    setIndex(0)
    setMistakes(0)
    setLastWrong(null)
    setTimedOut(false)
    setPhase('playing')
    endsAtRef.current = performance.now() + totalRef.current
    setSecondsLeft(Math.ceil(totalRef.current / 1000))
    stopTimer()
    timerRef.current = window.setInterval(() => {
      const left = Math.max(0, endsAtRef.current - performance.now())
      setSecondsLeft(Math.ceil(left / 1000))
      if (left <= 0) reset('time')
    }, motionToken('--timing-countdown-tick'))
  }, [reset])

  const decide = (action: Action) => {
    if (phase !== 'playing') return
    const visitor = VISITORS[index]
    const correct = action === (visitor.real ? 'letIn' : 'block')
    const entry = { visitor, action, correct }

    if (!correct) {
      triggerWrongFeedback(motionToken('--timing-buzz-wrong'))
      setIsShaking(true)
      window.setTimeout(() => setIsShaking(false), 300)
      const next = mistakes + 1
      if (next >= MAX_MISTAKES) {
        reset('mistakes')
        return
      }
      setMistakes(next)
      setLastWrong(entry)
      return
    }

    triggerCorrectFeedback(motionToken('--timing-buzz-short'))
    setLastWrong(null)
    const done = [...played, entry]
    setPlayed(done)
    if (done.length === VISITORS.length) {
      stopTimer()
      markPassed('vip-club')
      setPhase('passed')
    } else {
      setIndex(index + 1)
    }
  }

  const totalSeconds = Math.max(1, Math.round(totalRef.current / 1000))
  const timeFraction = secondsLeft / totalSeconds
  const current = phase === 'playing' ? VISITORS[index] : null

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <ModuleHeader index={2} />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        {/* ---- the concept ---- */}
        <section className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
          <img src="/bootcamp-door.jpg" alt="" aria-hidden className="h-illustration w-illustration shrink-0 rounded-full object-cover" />
          <div className="min-w-0">
            <h1 className={`text-title font-bold ${kh}`}>{t('doorTitle')}</h1>
            <p className={`mt-ring text-small text-muted ${kh}`}>{t('doorConcept')}</p>
          </div>
        </section>

        {/* ---- the game ---- */}
        <section className="rounded-card border border-border bg-surface p-stack">
          <div className="flex items-center justify-between gap-stack">
            <h2 className={`flex items-center gap-ring text-body font-bold ${kh}`}>
              <MapPin aria-hidden className="h-icon w-icon text-primary" />
              {t('vipClub')}
            </h2>
            <span className="flex items-center gap-ring text-body font-bold tabular-nums">
              <Timer aria-hidden className="h-icon w-icon text-primary" />
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
          </div>
          <div role="timer" aria-label={`${secondsLeft}`} className="mt-stack h-timer-bar w-full overflow-hidden rounded-button bg-surface-alt">
            <div
              className={`h-full rounded-button ${timeFraction < 0.35 ? 'bg-danger' : 'bg-primary'}`}
              style={{ width: `${timeFraction * 100}%` }}
            />
          </div>
          <p className={`mt-stack text-small text-muted ${kh}`}>{t('vipClubHint')}</p>

          {phase === 'ready' && (
            <button
              type="button"
              onClick={start}
              className={`tap-target mt-stack flex w-full items-center justify-center gap-stack rounded-button bg-primary
                          px-section text-body font-bold text-primary-text ${kh}`}
            >
              {t('beginTraining')}
              <ArrowRight aria-hidden className="h-icon w-icon" />
            </button>
          )}

          {/* ---- visitors, one card each; played ones keep their verdict ---- */}
          <ol className="mt-stack flex flex-col gap-stack">
            {played.map((p, i) => (
              <li key={i} className="rounded-card border border-border bg-surface-alt p-stack">
                <VisitorCard visitor={p.visitor} n={i + 1} kh={kh} />
                <p className={`mt-stack flex items-center gap-ring text-small font-bold text-safe ${kh}`}>
                  <ShieldCheck aria-hidden className="h-icon w-icon shrink-0" />
                  {p.visitor.real ? t('doorRightIn') : t('doorRightBlock')}
                </p>
              </li>
            ))}

            {current && (
              <li
                key={`live-${index}`}
                className={`bubble-in rounded-card border bg-surface p-stack transition-all ${
                  isShaking ? 'shake-error border-danger shadow-md' : 'border-primary/40'
                }`}
              >
                <VisitorCard visitor={current} n={index + 1} kh={kh} />

                {lastWrong && (
                  <p role="alert" className={`bubble-in mt-stack flex items-start gap-ring rounded-card bg-danger/10 p-stack text-small text-danger ${kh}`}>
                    <X aria-hidden className="h-icon w-icon shrink-0" />
                    {lastWrong.action === 'letIn' ? t('doorWrongIn') : t('doorWrongBlock')}
                  </p>
                )}

                <div className="mt-stack flex gap-stack">
                  <button
                    type="button"
                    onClick={() => decide('letIn')}
                    className={`tap-target flex flex-1 items-center justify-center gap-ring rounded-button
                                bg-verdict-real px-section text-body font-bold text-primary-text ${kh}`}
                  >
                    <Check aria-hidden className="h-icon w-icon" />
                    {t('letIn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => decide('block')}
                    className={`tap-target flex flex-1 items-center justify-center gap-ring rounded-button
                                bg-verdict-scam px-section text-body font-bold text-primary-text ${kh}`}
                  >
                    <X aria-hidden className="h-icon w-icon" />
                    {t('block')}
                  </button>
                </div>
              </li>
            )}
          </ol>

          {phase === 'playing' && (
            <p className={`mt-stack text-center text-small text-muted ${kh}`}>
              {t('mistakes')}: <span className={`tabular-nums ${mistakes ? 'text-danger' : 'text-text'}`}>{mistakes} / {MAX_MISTAKES}</span>
            </p>
          )}

          {phase === 'reset' && (
            <div className="mt-stack flex flex-col gap-stack">
              <p role="alert" className={`rounded-card bg-danger/10 p-stack text-center text-small text-danger ${kh}`}>
                {timedOut ? t('vipClubTimeUp') : t('doorReset')}
              </p>
              <button
                type="button"
                onClick={start}
                className={`tap-target flex w-full items-center justify-center gap-stack rounded-button bg-danger
                            px-section text-body font-bold text-primary-text ${kh}`}
              >
                <RotateCcw aria-hidden className="h-icon w-icon" />
                {t('tryModuleAgain')}
              </button>
            </div>
          )}
        </section>

        {/* ---- after the game: result, rule, tool — inline, the rounds stay above ---- */}
        {phase === 'passed' && (
          <>
            <section className="screen-in flex items-center gap-stack rounded-card border border-safe bg-safe/10 p-stack">
              <CheckCircle2 aria-hidden className="h-icon w-icon shrink-0 text-safe" />
              <div className="min-w-0">
                <p className={`text-body font-bold text-safe ${kh}`}>{t('vipClubPassed')}</p>
                <p className={`text-small text-muted ${kh}`}>{t('vipClubPassedSub')}</p>
              </div>
            </section>

            <section className="screen-in flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
              <span aria-hidden className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Lightbulb className="h-icon w-icon" />
              </span>
              <div className="min-w-0">
                <p className={`text-body font-bold ${kh}`}>{t('ruleToRemember')}</p>
                <p className={`mt-ring text-rule ${kh}`}>{t('doorRule')}</p>
              </div>
            </section>

            <section className="screen-in flex items-center gap-stack rounded-card border border-primary/40 bg-primary/10 p-stack">
              <img src="/bootcamp-tool-token.jpg" alt="" aria-hidden className="h-avatar w-avatar shrink-0 rounded-full object-cover" />
              <p className={`text-body font-semibold text-primary ${kh}`}>{t('authTokenUnlocked')}</p>
            </section>

            <button
              type="button"
              onClick={() => navigate('/bootcamp/url-sorter')}
              className={`tap-target mt-auto flex w-full items-center justify-center gap-stack rounded-button bg-primary
                          px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
            >
              {t('nextModule')}
              <ArrowRight aria-hidden className="h-icon w-icon" />
            </button>
          </>
        )}
      </div>
    </main>
  )
}

/**
 * One visitor at the door: who they are, the password (always right), and
 * the phone — a code for a member, an excuse and no code for a scammer.
 */
function VisitorCard({ visitor, n, kh }: { visitor: Visitor; n: number; kh: string }) {
  const t = useT()
  return (
    <>
      <span className={`inline-flex rounded-button bg-primary px-stack py-ring text-small font-bold text-primary-text ${kh}`}>
        {t(visitor.real ? 'roundRealUser' : 'roundScammer').replace('{n}', String(n))}
      </span>
      <div className="mt-stack flex items-stretch gap-stack">
        <img src="/bootcamp-visitor.jpg" alt="" aria-hidden className="h-illustration-sm w-illustration-sm shrink-0 self-center rounded-full object-cover" />
        <div className="min-w-0 flex-1 rounded-card bg-surface-alt p-stack text-small">
          <p className={`flex flex-wrap items-center gap-ring ${kh}`}>
            <span className="text-muted">{t('passwordLabel')}</span>
            <span className="font-semibold">{visitor.password}</span>
            <Check aria-hidden className="h-icon w-icon text-safe" />
          </p>
          {visitor.code ? (
            <p className={`mt-ring flex flex-wrap items-center gap-ring ${kh}`}>
              <span className="text-muted">{t('codeLabel')}</span>
              <span className="rounded-button bg-safe/15 px-stack font-bold tabular-nums text-safe">{visitor.code}</span>
            </p>
          ) : (
            <>
              {visitor.excuse && <p className={`mt-ring italic ${kh}`}>{t(visitor.excuse)}</p>}
              <p className={`mt-ring text-muted ${kh}`}>{t('noCodeShown')}</p>
            </>
          )}
        </div>
        {/* the phone: the whole difference between the two kinds of visitor */}
        <div
          aria-hidden
          className={`flex shrink-0 flex-col items-center justify-center gap-ring rounded-card border p-stack
                      ${visitor.code ? 'border-safe bg-safe/10 text-safe' : 'border-border bg-surface-alt text-muted'}`}
        >
          <Smartphone className="h-icon w-icon" />
          <span className="text-small font-bold tabular-nums tracking-widest">{visitor.code ?? '****'}</span>
          {visitor.code ? <Check className="h-icon w-icon" /> : <X className="h-icon w-icon text-danger" />}
        </div>
      </div>
    </>
  )
}
