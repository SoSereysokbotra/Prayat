import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowRight, Check, CheckCircle2, Globe, Lightbulb, RotateCcw, Timer, Trash2, X } from 'lucide-react'
import ModuleHeader from '../../components/ModuleHeader'
import { useT, useIsKhmer } from '../../hooks/useT'
import { motionToken } from '../../hooks/useMotionToken'
import { useBootcampStore } from '../../store/bootcampStore'

/**
 * Module 3 — The Map. The URL Sorter.
 *
 * Four addresses drop one at a time. Each has until it reaches the
 * bottom to be sorted SAFE or TRASH; let it land and it counts as wrong.
 * Pass = 3 of 4; two wrong resets the sorter. The owner label is set in
 * bold on every card, so the rule is shown, not just tested.
 *
 * One rule decides every card: the word just before .com / .org / .kh is
 * the owner, and everything in front of it is decoration. A wrong tap
 * flashes that owner so the player sees the rule applied, not just a red
 * border. Real domains only for the safe cards — the module must never
 * teach a guessed address as genuine.
 */

interface UrlCard {
  url: string
  safe: boolean
  /** The label just before the registry suffix — what the rule points at. */
  owner: string
}

const CARDS: UrlCard[] = [
  { url: 'facebook.com', safe: true, owner: 'facebook' },
  { url: 'faceb00k.com', safe: false, owner: 'faceb00k' },
  { url: 'www.ababank.com', safe: true, owner: 'ababank' },
  { url: 'google.com.verify-login.net', safe: false, owner: 'verify-login' },
]
const PASS_MARK = 3
const MAX_WRONG = 2

type Verdict = 'safe' | 'trash'
type Flash = 'correct' | 'wrong' | 'timeout'
import { triggerCorrectFeedback, triggerWrongFeedback } from '../../lib/feedback'

type Phase = 'ready' | 'playing' | 'passed' | 'failed'

/** Spelled out so Tailwind keeps the classes; built dynamically they vanish. */
const FLASH_OUTLINE: Record<Flash, string> = {
  correct: 'verdict-outline verdict-correct border-safe',
  wrong: 'verdict-outline verdict-wrong border-danger shake-error',
  timeout: 'verdict-outline verdict-timeout border-caution shake-error',
}

export default function UrlSorter() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const markPassed = useBootcampStore((s) => s.markPassed)
  const kh = isKhmer ? 'leading-kh' : ''

  const [phase, setPhase] = useState<Phase>('ready')
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [flash, setFlash] = useState<Flash | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [resetReason, setResetReason] = useState<'wrong' | 'score' | null>(null)

  const timing = useRef({ total: 0, fall: 0, next: 0, tick: 0, buzzRight: 0, buzzWrong: 0 })
  const runRef = useRef(0)
  const timerRef = useRef(0)
  const fallRef = useRef(0)
  const endsAtRef = useRef(0)
  const lockRef = useRef(false)
  const correctRef = useRef(0)
  const wrongRef = useRef(0)

  const clearTimers = () => {
    window.clearInterval(timerRef.current)
    window.clearTimeout(fallRef.current)
  }

  useEffect(() => {
    timing.current = {
      total: motionToken('--timing-url-sorter'),
      fall: motionToken('--timing-url-fall'),
      next: motionToken('--timing-url-next'),
      tick: motionToken('--timing-countdown-tick'),
      buzzRight: motionToken('--timing-buzz-short'),
      buzzWrong: motionToken('--timing-buzz-wrong'),
    }
    setSecondsLeft(Math.ceil(timing.current.total / 1000))
    return () => {
      runRef.current += 1
      clearTimers()
    }
  }, [])

  const finish = useCallback(
    (run: number) => {
      if (run !== runRef.current) return
      clearTimers()
      lockRef.current = true
      if (correctRef.current >= PASS_MARK) {
        markPassed('url-sorter')
        setPhase('passed')
      } else {
        setResetReason(wrongRef.current >= MAX_WRONG ? 'wrong' : 'score')
        setPhase('failed')
      }
    },
    [markPassed],
  )

  /** Drop card `i`; if it is still unsorted when the fall ends, it is a miss. */
  const drop = useCallback(
    (run: number, i: number) => {
      if (run !== runRef.current) return
      if (i >= CARDS.length) {
        finish(run)
        return
      }
      setIndex(i)
      setFlash(null)
      lockRef.current = false
      fallRef.current = window.setTimeout(() => settle(run, i, 'timeout'), timing.current.fall)
    },
    // settle is defined below and stable per run via refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [finish],
  )

  const settle = useCallback(
    (run: number, i: number, result: Flash) => {
      if (run !== runRef.current || lockRef.current) return
      lockRef.current = true
      window.clearTimeout(fallRef.current)
      setFlash(result)
      if (result === 'correct') {
        correctRef.current += 1
        setCorrect(correctRef.current)
        triggerCorrectFeedback(timing.current.buzzRight)
      } else {
        wrongRef.current += 1
        setWrong(wrongRef.current)
        triggerWrongFeedback(timing.current.buzzWrong)
        if (wrongRef.current >= MAX_WRONG) {
          window.setTimeout(() => finish(run), timing.current.next)
          return
        }
      }
      window.setTimeout(() => drop(run, i + 1), timing.current.next)
    },
    [drop, finish],
  )

  const start = useCallback(() => {
    const run = ++runRef.current
    clearTimers()
    correctRef.current = 0
    wrongRef.current = 0
    setCorrect(0)
    setWrong(0)
    setResetReason(null)
    setPhase('playing')
    endsAtRef.current = performance.now() + timing.current.total
    setSecondsLeft(Math.ceil(timing.current.total / 1000))
    timerRef.current = window.setInterval(() => {
      const left = Math.max(0, endsAtRef.current - performance.now())
      setSecondsLeft(Math.ceil(left / 1000))
      if (left <= 0) finish(run)
    }, timing.current.tick)
    drop(run, 0)
  }, [drop, finish])

  const sort = (verdict: Verdict) => {
    if (phase !== 'playing' || lockRef.current) return
    const card = CARDS[index]
    settle(runRef.current, index, (verdict === 'safe') === card.safe ? 'correct' : 'wrong')
  }

  const totalSeconds = Math.max(1, Math.round(timing.current.total / 1000))
  const timeFraction = secondsLeft / totalSeconds
  const card = CARDS[index]
  const outline = flash ? FLASH_OUTLINE[flash] : 'border-primary'

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <ModuleHeader index={3} />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        {/* ---- the concept ---- */}
        <section className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
          <img src="/bootcamp-map.jpg" alt="" aria-hidden className="h-illustration w-illustration shrink-0 rounded-full object-cover" />
          <div className="min-w-0">
            <h1 className={`text-title font-bold ${kh}`}>{t('mapTitle')}</h1>
            <p className={`mt-ring text-small text-muted ${kh}`}>{t('mapConcept')}</p>
          </div>
        </section>

        {/* ---- the game ---- */}
        <section className="rounded-card border border-border bg-surface p-stack">
          <div className="flex items-center justify-between gap-stack">
            <h2 className={`flex items-center gap-ring text-body font-bold ${kh}`}>
              <Globe aria-hidden className="h-icon w-icon text-primary" />
              {t('urlSorter')}
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
          <p className={`mt-stack text-small text-muted ${kh}`}>{t('urlSorterHint')}</p>

          {/* the chute: the active address falls through it */}
          <div className="relative mt-stack flex flex-col items-center gap-stack overflow-hidden rounded-card bg-surface-alt p-stack pb-section">
            {phase === 'playing' ? (
              <div
                key={`${runRef.current}-${index}`}
                className={`url-fall flex w-full max-w-bubble flex-col items-center gap-ring rounded-card border bg-surface p-stack ${outline}`}
                aria-live="polite"
              >
                <p className="break-all text-center text-body tabular-nums">
                  <OwnerHighlight url={card.url} owner={card.owner} />
                </p>
                {flash && flash !== 'correct' && (
                  <p className={`text-small text-danger ${kh}`}>
                    {flash === 'timeout' ? t('urlMissed') : t('ownerIs').replace('{owner}', card.owner)}
                  </p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={start}
                disabled={phase === 'passed'}
                className={`tap-target flex w-full max-w-bubble items-center justify-center gap-stack rounded-button px-section
                            text-body font-bold text-primary-text transition-opacity duration-option-fade disabled:opacity-50
                            ${phase === 'failed' ? 'bg-danger' : 'bg-primary'} ${kh}`}
              >
                {phase === 'failed' ? <RotateCcw aria-hidden className="h-icon w-icon" /> : <ArrowRight aria-hidden className="h-icon w-icon" />}
                {phase === 'failed' ? t('tryModuleAgain') : t('beginTraining')}
              </button>
            )}
            <ArrowDown aria-hidden className="h-icon w-icon text-primary" />
            <div className="flex w-full gap-stack">
              <button
                type="button"
                onClick={() => sort('safe')}
                disabled={phase !== 'playing'}
                className={`tap-target flex flex-1 items-center justify-center gap-ring rounded-button bg-verdict-real
                            px-section text-body font-bold text-primary-text transition-opacity duration-option-fade disabled:opacity-50 ${kh}`}
              >
                <Check aria-hidden className="h-icon w-icon" />
                {t('sortSafe')}
              </button>
              <button
                type="button"
                onClick={() => sort('trash')}
                disabled={phase !== 'playing'}
                className={`tap-target flex flex-1 items-center justify-center gap-ring rounded-button border border-border bg-surface
                            px-section text-body font-bold transition-opacity duration-option-fade disabled:opacity-50 ${kh}`}
              >
                <Trash2 aria-hidden className="h-icon w-icon" />
                {t('sortTrash')}
              </button>
            </div>
          </div>

          <p className={`mt-stack flex items-center justify-center gap-section text-small text-muted ${kh}`}>
            <span>
              {t('score')}: <span className="font-bold tabular-nums text-text">{correct} / {CARDS.length}</span>
            </span>
            {phase === 'playing' && (
              <span className="flex items-center gap-ring" aria-label={`${wrong} / ${MAX_WRONG}`}>
                {Array.from({ length: MAX_WRONG }, (_, i) => (
                  <X key={i} aria-hidden className={`h-icon w-icon ${i < wrong ? 'text-danger' : 'text-border'}`} />
                ))}
              </span>
            )}
          </p>

          {phase === 'failed' && (
            <p role="alert" className={`mt-stack rounded-card bg-danger/10 p-stack text-center text-small text-danger ${kh}`}>
              {resetReason === 'wrong'
                ? t('urlSorterReset')
                : t('urlSorterFailedScore')
                    .replace('{n}', String(correct))
                    .replace('{total}', String(CARDS.length))
                    .replace('{pass}', String(PASS_MARK))}
            </p>
          )}
        </section>

        {/* ---- after the game: result, rule, tool — inline ---- */}
        {phase === 'passed' && (
          <>
            <section className="screen-in flex items-center gap-stack rounded-card border border-safe bg-safe/10 p-stack">
              <CheckCircle2 aria-hidden className="h-icon w-icon shrink-0 text-safe" />
              <p className={`text-body font-bold text-safe ${kh}`}>
                {t('urlSorterPassed').replace('{n}', String(correct)).replace('{total}', String(CARDS.length))}
              </p>
            </section>

            <section className="screen-in flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
              <span aria-hidden className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Lightbulb className="h-icon w-icon" />
              </span>
              <div className="min-w-0">
                <p className={`text-body font-bold ${kh}`}>{t('ruleToRemember')}</p>
                <p className={`mt-ring text-rule ${kh}`}>{t('mapRule')}</p>
                <dl className="mt-stack flex flex-col gap-ring text-small tabular-nums">
                  <div className="flex flex-wrap items-center gap-ring">
                    <dt className="font-semibold">ababank.com</dt>
                    <dd className="flex items-center gap-ring text-muted">
                      = ababank <Check aria-hidden className="h-icon w-icon text-safe" />
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-center gap-ring">
                    <dt className="font-semibold">ababank-kh.com</dt>
                    <dd className="flex items-center gap-ring text-muted">
                      = ababank-kh <X aria-hidden className="h-icon w-icon text-danger" />
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="screen-in flex items-center gap-stack rounded-card border border-primary/40 bg-primary/10 p-stack">
              <img src="/bootcamp-tool-magnifier.jpg" alt="" aria-hidden className="h-avatar w-avatar shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <p className={`text-body font-semibold text-primary ${kh}`}>{t('magnifierUnlocked')}</p>
                <p className={`text-small text-muted ${kh}`}>{t('magnifierUse')}</p>
              </div>
            </section>

            <button
              type="button"
              onClick={() => navigate('/bootcamp/complete')}
              className={`tap-target mt-auto flex w-full items-center justify-center gap-stack rounded-button bg-primary
                          px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
            >
              {t('seeYourTools')}
              <ArrowRight aria-hidden className="h-icon w-icon" />
            </button>
          </>
        )}
      </div>
    </main>
  )
}

/**
 * The address with its owner label — the word just before the registry
 * suffix — set in bold. Showing the rule on every card is what makes the
 * sorter learnable: the player reads the bold word and decides.
 */
function OwnerHighlight({ url, owner }: { url: string; owner: string }) {
  const at = url.lastIndexOf(owner)
  if (at < 0) return <>{url}</>
  return (
    <>
      <span className="text-muted">{url.slice(0, at)}</span>
      <span className="font-bold text-text underline decoration-primary">{owner}</span>
      <span className="text-muted">{url.slice(at + owner.length)}</span>
    </>
  )
}
