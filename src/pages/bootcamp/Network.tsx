import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, CheckCircle2, Eye, Lightbulb, Lock, Mail, MapPin, RotateCcw, Shield, ShieldCheck, Timer } from 'lucide-react'
import ModuleHeader from '../../components/ModuleHeader'
import { useT, useIsKhmer } from '../../hooks/useT'
import { motionToken } from '../../hooks/useMotionToken'
import { useBootcampStore } from '../../store/bootcampStore'

/**
 * Module 1 — The Network. The coffee shop.
 *
 * Five postcards leave the laptop and cross the café towards the stranger
 * on the free Wi-Fi. Tap SHIELD while one is in flight and it becomes a
 * locked box he cannot read; let it reach him and he reads it. Four of
 * five secured passes. Each postcard is a little quicker than the last.
 *
 * There is no hidden answer here — the only skill is noticing in time —
 * so the game runs on the device and the server is not involved. Passing
 * awards the Shield Badge. Failing resets the round in place; the screen
 * does not change, because the lesson is in the retry.
 *
 * All timings are tokens in global.css, read once on mount.
 */

const PACKETS = 5
const PASS_MARK = 4
/** Where the postcard path starts and ends, as % of the scene width. */
const PATH_START = 20
const PATH_END = 73
const PATH_Y = 56

import { triggerCorrectFeedback, triggerWrongFeedback } from '../../lib/feedback'

type PacketResult = 'shielded' | 'read'
type Phase = 'ready' | 'playing' | 'passed' | 'failed'

export default function Network() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const markPassed = useBootcampStore((s) => s.markPassed)
  const kh = isKhmer ? 'leading-kh' : ''

  const [phase, setPhase] = useState<Phase>('ready')
  const [results, setResults] = useState<PacketResult[]>([])
  const [progress, setProgress] = useState(0)
  const [flying, setFlying] = useState(false)
  const [reaction, setReaction] = useState<PacketResult | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const timing = useRef({ travel: 0, speedup: 0, pause: 0, total: 0, buzzShield: 0, buzzRead: 0 })
  const runRef = useRef(0)
  const rafRef = useRef(0)
  const indexRef = useRef(0)
  const resultsRef = useRef<PacketResult[]>([])
  const packetStartRef = useRef(0)
  const gameStartRef = useRef(0)
  const flyingRef = useRef(false)

  useEffect(() => {
    timing.current = {
      travel: motionToken('--timing-packet-travel'),
      speedup: motionToken('--timing-packet-speedup'),
      pause: motionToken('--timing-packet-pause'),
      total: motionToken('--timing-coffee-shop'),
      buzzShield: motionToken('--timing-buzz-short'),
      buzzRead: motionToken('--timing-buzz-wrong'),
    }
    setSecondsLeft(Math.round(timing.current.total / 1000))
    return () => {
      runRef.current += 1
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const finish = useCallback(
    (run: number) => {
      if (run !== runRef.current) return
      cancelAnimationFrame(rafRef.current)
      flyingRef.current = false
      setFlying(false)
      const secured = resultsRef.current.filter((r) => r === 'shielded').length
      if (secured >= PASS_MARK) {
        markPassed('network')
        setPhase('passed')
      } else {
        setPhase('failed')
      }
    },
    [markPassed],
  )

  const launch = useCallback(
    (run: number, index: number) => {
      if (run !== runRef.current) return
      indexRef.current = index
      packetStartRef.current = performance.now()
      flyingRef.current = true
      setFlying(true)
      setReaction(null)
      setProgress(0)
    },
    [],
  )

  const settle = useCallback(
    (run: number, result: PacketResult) => {
      if (run !== runRef.current || !flyingRef.current) return
      flyingRef.current = false
      setFlying(false)
      setReaction(result)
      resultsRef.current = [...resultsRef.current, result]
      setResults(resultsRef.current)
      if (result === 'shielded') {
        triggerCorrectFeedback(timing.current.buzzShield)
      } else {
        triggerWrongFeedback(timing.current.buzzRead)
      }
      const next = indexRef.current + 1
      window.setTimeout(() => {
        if (next < PACKETS) launch(run, next)
        else finish(run)
      }, timing.current.pause)
    },
    [launch, finish],
  )

  const start = useCallback(() => {
    const run = ++runRef.current
    resultsRef.current = []
    setResults([])
    setReaction(null)
    setPhase('playing')
    gameStartRef.current = performance.now()
    launch(run, 0)

    const frame = (now: number) => {
      if (run !== runRef.current) return
      const { travel, speedup, total } = timing.current
      const left = Math.max(0, total - (now - gameStartRef.current))
      setSecondsLeft(Math.ceil(left / 1000))
      if (left <= 0) {
        finish(run)
        return
      }
      if (flyingRef.current) {
        const duration = Math.max(travel / 2, travel - indexRef.current * speedup)
        const p = Math.min(1, (now - packetStartRef.current) / duration)
        setProgress(p)
        if (p >= 1) settle(run, 'read')
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
  }, [launch, settle, finish])

  const shield = () => {
    if (phase === 'ready' || phase === 'failed') {
      start()
      return
    }
    if (flyingRef.current) settle(runRef.current, 'shielded')
  }

  const secured = results.filter((r) => r === 'shielded').length
  const totalSeconds = Math.max(1, Math.round(timing.current.total / 1000))
  const timeFraction = secondsLeft / totalSeconds
  const packetX = PATH_START + (PATH_END - PATH_START) * progress
  const showPacket = flying || reaction !== null
  const playing = phase === 'playing'

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <ModuleHeader index={1} />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        {/* ---- the concept ---- */}
        <section className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
          <img src="/bootcamp-network.jpg" alt="" aria-hidden className="h-illustration w-illustration shrink-0 rounded-full object-cover" />
          <div className="min-w-0">
            <h1 className={`text-title font-bold ${kh}`}>{t('networkTitle')}</h1>
            <p className={`mt-ring text-small text-muted ${kh}`}>{t('networkConcept')}</p>
          </div>
        </section>

        {/* ---- the game ---- */}
        <section className="rounded-card border border-border bg-surface p-stack">
          <div className="flex items-center justify-between gap-stack">
            <h2 className={`flex items-center gap-ring text-body font-bold ${kh}`}>
              <MapPin aria-hidden className="h-icon w-icon text-primary" />
              {t('coffeeShop')}
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
          <p className={`mt-stack text-small text-muted ${kh}`}>{t('coffeeShopHint')}</p>

          {/* the scene: the postcard crosses from the laptop to the stranger */}
          <div className="relative mt-stack overflow-hidden rounded-card border border-border">
            <img src="/bootcamp-coffee-shop.jpg" alt="" aria-hidden className="block w-full" />
            {showPacket && (
              <span
                aria-hidden
                style={{ left: `${packetX}%`, top: `${PATH_Y}%` }}
                className={`absolute flex h-packet w-packet -translate-x-1/2 -translate-y-1/2 items-center justify-center
                            rounded-button border transition-colors duration-option-fade
                            ${
                              reaction === 'shielded'
                                ? 'border-safe bg-safe text-primary-text'
                                : reaction === 'read'
                                  ? 'border-danger bg-danger text-primary-text'
                                  : 'border-primary bg-surface text-primary'
                            }`}
              >
                {reaction === 'shielded' ? <Lock className="h-icon w-icon" /> : <Mail className="h-icon w-icon" />}
              </span>
            )}
            {/* the stranger reacting — this is where the lesson lands */}
            {reaction && (
              <span
                role="status"
                className={`count-pop absolute bottom-stack right-stack flex items-center gap-ring rounded-button px-stack py-ring
                            text-small font-bold text-primary-text ${reaction === 'shielded' ? 'bg-safe' : 'bg-danger'} ${kh}`}
              >
                {reaction === 'shielded' ? <ShieldCheck className="h-icon w-icon" /> : <Eye className="h-icon w-icon" />}
                {reaction === 'shielded' ? t('strangerBlocked') : t('strangerRead')}
              </span>
            )}
          </div>

          {phase !== 'passed' && (
            <button
              type="button"
              onClick={shield}
              className={`tap-target mt-stack flex w-full items-center justify-center gap-stack rounded-button px-section
                          text-body font-bold text-primary-text transition-colors duration-option-fade
                          ${phase === 'failed' ? 'bg-danger' : 'bg-primary'} ${kh}`}
            >
              {phase === 'failed' ? <RotateCcw aria-hidden className="h-icon w-icon" /> : <Shield aria-hidden className="h-icon w-icon" />}
              {phase === 'failed' ? t('tryModuleAgain') : t('tapToShield')}
            </button>
          )}

          <div className={`mt-stack flex items-center justify-center gap-stack text-small font-semibold text-muted ${kh}`}>
            <span>
              {t('secured')}: <span className="tabular-nums text-text">{secured} / {PACKETS}</span>
            </span>
            <span className="flex items-center gap-ring" aria-hidden>
              {Array.from({ length: PACKETS }, (_, i) => {
                const r = results[i]
                const active = playing && i === results.length
                return (
                  <span
                    key={i}
                    className={`flex h-icon w-icon items-center justify-center rounded-full border
                                ${r === 'shielded' ? 'border-safe bg-safe text-primary-text' : ''}
                                ${r === 'read' ? 'border-danger bg-danger text-primary-text' : ''}
                                ${!r ? (active ? 'border-primary bg-primary/15' : 'border-border bg-surface-alt') : ''}`}
                  >
                    {r === 'shielded' && <Check className="h-icon w-icon" />}
                    {r === 'read' && <Eye className="h-icon w-icon" />}
                  </span>
                )
              })}
            </span>
          </div>

          {phase === 'failed' && (
            <p role="alert" className={`mt-stack rounded-card bg-danger/10 p-stack text-center text-small text-danger ${kh}`}>
              {t('coffeeShopFailed')
                .replace('{n}', String(PACKETS - secured))
                .replace('{pass}', String(PASS_MARK))
                .replace('{total}', String(PACKETS))}
            </p>
          )}
        </section>

        {/* ---- after the game: result, rule, tool — inline, the scene stays above ---- */}
        {phase === 'passed' && (
          <>
            <section className="screen-in flex items-center gap-stack rounded-card border border-safe bg-safe/10 p-stack">
              <CheckCircle2 aria-hidden className="h-icon w-icon shrink-0 text-safe" />
              <div className="min-w-0">
                <p className={`text-body font-bold text-safe ${kh}`}>{t('coffeeShopPassed')}</p>
                <p className={`text-small text-muted ${kh}`}>
                  {t('coffeeShopPassedSub').replace('{n}', String(secured)).replace('{total}', String(PACKETS))}
                </p>
              </div>
            </section>

            <section className="screen-in flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
              <span aria-hidden className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Lightbulb className="h-icon w-icon" />
              </span>
              <div className="min-w-0">
                <p className={`text-body font-bold ${kh}`}>{t('ruleToRemember')}</p>
                <p className={`mt-ring text-rule ${kh}`}>{t('networkRule')}</p>
              </div>
            </section>

            <section className="screen-in flex items-center gap-stack rounded-card border border-primary/40 bg-primary/10 p-stack">
              <img src="/bootcamp-tool-shield.jpg" alt="" aria-hidden className="h-avatar w-avatar shrink-0 rounded-full object-cover" />
              <p className={`text-body font-semibold text-primary ${kh}`}>{t('shieldBadgeUnlocked')}</p>
            </section>

            <button
              type="button"
              onClick={() => navigate('/bootcamp/vip-club')}
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
