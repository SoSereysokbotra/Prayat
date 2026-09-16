import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  AtSign,
  Check,
  CheckCheck,
  Circle,
  Clock,
  DollarSign,
  FileWarning,
  Flag,
  FolderOpen,
  Info,
  Link2,
  MessageSquare,
  Phone,
  QrCode,
  Home,
  Lightbulb,
  RotateCcw,
  Search,
  Share2,
  Trophy,
  X,
  type LucideIcon,
} from 'lucide-react'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
import { motionToken } from '../hooks/useMotionToken'
import { useGameStore } from '../store/gameStore'
import { useHasTool } from '../store/bootcampStore'
import { hasSeenHowTo, markHowToSeen } from '../lib/howToSeen'
import { CASE_ROSTER } from '../lib/investigationRoster'
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

type Phase = 'loading' | 'briefing' | 'hunting' | 'over' | 'error'

export default function Investigation() {
  const navigate = useNavigate()
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const addScore = useGameStore((s) => s.addScore)
  const recordInvestigation = useGameStore((s) => s.recordInvestigation)
  const { investigationId } = useParams<{ investigationId: string }>()

  const [phase, setPhase] = useState<Phase>('loading')
  const [data, setData] = useState<InvestigationData | null>(null)
  const [found, setFound] = useState<Record<string, string>>({})
  const [missed, setMissed] = useState<string[]>([])
  const [summary, setSummary] = useState<InvestigationSummary | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [flash, setFlash] = useState<string | null>(null)
  // The Toolbelt payoff. Earned by passing the URL Sorter, and it genuinely
  // changes how this mode plays: a lookalike domain is unreadable at body size
  // and obvious at zoom size. Tapping the glass is free — it costs no time and
  // is not a tap on an element, so it never triggers the wrong-tap penalty.
  const hasMagnifier = useHasTool('magnifying-glass')
  const [zoomed, setZoomed] = useState(false)

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
      recordInvestigation(result.investigationId, result.found, result.flagCount, result.complete)
      setPhase('over')
    } catch {
      if (!aliveRef.current) return
      setPhase('error')
    }
  }, [addScore, recordInvestigation])

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

    startInvestigation(language, investigationId)
      .then((run) => {
        if (!aliveRef.current) return
        sessionRef.current = run.sessionId
        setData(run.investigation)
        setRemaining(run.investigation.durationSeconds * 1000)
        // First case ever on this device: the how-to sits over the
        // conversation and the clock waits for GOT IT.
        if (hasSeenHowTo('investigation')) {
          deadlineRef.current = Date.now() + run.investigation.durationSeconds * 1000
          setPhase('hunting')
        } else {
          setPhase('briefing')
        }
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

  /* ---- result + debrief, one scrolling screen ---- */
  if (phase === 'over' && summary && data) {
    const roster = CASE_ROSTER.find((c) => c.id === data.id)
    const caseNo = String(roster?.number ?? 1).padStart(3, '0')
    const falseAlarms = missed.length
    const verdict: 'perfect' | 'partial' | 'unsolved' =
      summary.complete && falseAlarms === 0 ? 'perfect' : summary.found * 2 >= summary.flagCount ? 'partial' : 'unsolved'
    const textOf = (id: string) => data.elements.find((e) => e.id === id)?.text[language] ?? ''
    // The next case in the roster, if this one is now solved — else stay here.
    const nextEntry = roster && summary.complete ? CASE_ROSTER[CASE_ROSTER.indexOf(roster) + 1] : undefined

    const share = async () => {
      const text = `${roster?.title[language] ?? ''}\n\n${summary.rule[language]}`
      try {
        if (navigator.share) await navigator.share({ text })
        else await navigator.clipboard.writeText(text)
      } catch {
        /* cancelled share sheet, or a browser that refused the clipboard */
      }
    }

    const VERDICT = {
      perfect: { icon: Trophy, title: t('resultPerfect'), card: 'border-safe bg-safe/10', badge: 'bg-safe', text: 'text-safe', pill: 'bg-safe/15 text-safe' },
      partial: { icon: Search, title: t('resultPartial'), card: 'border-caution bg-caution/10', badge: 'bg-caution', text: 'text-caution', pill: 'bg-caution/15 text-caution' },
      unsolved: { icon: X, title: t('resultUnsolved'), card: 'border-danger bg-danger/10', badge: 'bg-danger', text: 'text-danger', pill: 'bg-danger/15 text-danger' },
    } as const
    const v = VERDICT[verdict]
    const VerdictIcon = v.icon

    const Heading = ({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) => (
      <h2 className={`flex items-center gap-stack text-body font-bold ${kh}`}>
        <Icon aria-hidden className="h-icon w-icon shrink-0 text-primary" />
        <span className="shrink-0">{children}</span>
        <span aria-hidden className="h-px min-w-0 flex-1 bg-border" />
      </h2>
    )

    return (
      <main className="screen-in flex min-h-dvh w-full flex-col">
        {/* ---- a short strip of sky: back, and which case ---- */}
        <header className="topbar-hero relative w-full shrink-0">
          <div className="mx-auto flex w-full max-w-screen-sm items-center gap-stack px-screen-x pt-section">
            <Link
              to="/investigation"
              className={`tap-target flex shrink-0 items-center gap-ring rounded-button border border-border bg-surface/80 px-stack
                          text-small font-semibold text-text backdrop-blur ${kh}`}
            >
              <ArrowLeft aria-hidden className="h-icon w-icon" />
              {t('back')}
            </Link>
            <span className={`mx-auto flex min-w-0 items-center gap-ring rounded-button bg-primary px-stack py-ring text-body font-bold text-primary-text ${kh}`}>
              <FolderOpen aria-hidden className="h-icon w-icon shrink-0" />
              <span className="truncate">{t('caseDebrief').replace('{n}', caseNo)}</span>
            </span>
            <span aria-hidden className="w-tap shrink-0" />
          </div>
        </header>

        <div className="relative -mt-sheet-overlap-deep mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
          {/* ---- result ---- */}
          <section className="flex flex-col gap-stack rounded-card border border-border bg-surface p-stack">
            <Heading icon={Trophy}>{t('result')}</Heading>
            <div className={`rounded-card border p-stack ${v.card}`}>
              <div className="flex items-center gap-stack">
                <span aria-hidden className={`flex h-illustration-sm w-illustration-sm shrink-0 items-center justify-center rounded-full text-primary-text ${v.badge}`}>
                  <VerdictIcon className="h-icon w-icon" />
                </span>
                <span className={`rounded-button px-stack py-ring text-body font-bold ${v.badge} text-primary-text ${kh}`}>{v.title}</span>
              </div>
              <ul className={`mt-stack flex flex-col gap-ring text-small ${kh}`}>
                {verdict === 'perfect' ? (
                  <>
                    <Line tone="safe">{t('allFlagsFound').replace('{n}', String(summary.flagCount))}</Line>
                    <Line tone="safe">{t('noFalseAlarms')}</Line>
                  </>
                ) : (
                  <>
                    <Line tone="safe">{t('foundOfFlags').replace('{n}', String(summary.found)).replace('{total}', String(summary.flagCount))}</Line>
                    <Line tone="danger">{t('missedN').replace('{n}', String(summary.missed.length))}</Line>
                    {falseAlarms > 0 && <Line tone="caution">{t('falseAlarmsN').replace('{n}', String(falseAlarms))}</Line>}
                  </>
                )}
              </ul>
              <p className={`mt-stack rounded-button px-stack py-ring text-center text-body font-bold tabular-nums ${v.pill} ${kh}`}>
                {t('scorePoints').replace('{n}', String(summary.score))}
              </p>
            </div>
          </section>

          {/* ---- your flags vs the real flags ---- */}
          <section className="flex flex-col gap-stack rounded-card border border-border bg-surface p-stack">
            <Heading icon={Flag}>{t('yourFlagsVsReal')}</Heading>
            <ol className="flex flex-col gap-stack">
              {Object.entries(found).map(([id, explanation], i) => (
                <FlagRow key={id} n={i + 1} state="correct" quote={textOf(id)} body={explanation} kh={kh} />
              ))}
              {summary.missed.map((m, i) => (
                <FlagRow
                  key={m.elementId}
                  n={Object.keys(found).length + i + 1}
                  state="missed"
                  quote={textOf(m.elementId)}
                  body={m.explanation[language]}
                  kh={kh}
                />
              ))}
              {missed.map((id) => (
                <FlagRow key={id} state="false" quote={textOf(id)} body={t('falseAlarmBody')} kh={kh} />
              ))}
            </ol>
          </section>

          {/* ---- the one rule ---- */}
          <section className="flex flex-col gap-stack rounded-card border border-primary/40 bg-primary/10 p-stack">
            <Heading icon={Lightbulb}>{t('ruleHeading')}</Heading>
            <div className="flex items-center gap-stack">
              <img src="/investigation-rule.jpg" alt="" aria-hidden className="h-illustration w-illustration shrink-0 rounded-card object-cover" />
              <p className={`min-w-0 flex-1 text-rule font-bold ${kh}`}>{summary.rule[language]}</p>
            </div>
          </section>

          {/* ---- actions ---- */}
          <div className="mt-auto grid grid-cols-2 gap-stack sm:grid-cols-4">
            <button
              type="button"
              onClick={() => void share()}
              className={`tap-target flex items-center justify-center gap-ring rounded-button border border-border bg-surface px-stack text-body font-semibold text-primary ${kh}`}
            >
              <Share2 aria-hidden className="h-icon w-icon" />
              {t('share')}
            </button>
            <button
              type="button"
              onClick={() => navigate(0)}
              className={`tap-target flex items-center justify-center gap-ring rounded-button border border-border bg-surface px-stack text-body font-semibold text-primary ${kh}`}
            >
              <RotateCcw aria-hidden className="h-icon w-icon" />
              {t('tryModuleAgain')}
            </button>
            <Link
              to="/investigation"
              className={`tap-target flex items-center justify-center gap-ring rounded-button bg-primary px-stack text-body font-bold text-primary-text
                          ${nextEntry ? '' : 'opacity-50'} ${kh}`}
            >
              <FolderOpen aria-hidden className="h-icon w-icon" />
              {t('nextCase')}
            </Link>
            <Link
              to="/"
              className={`tap-target flex items-center justify-center gap-ring rounded-button bg-primary px-stack text-body font-bold text-primary-text ${kh}`}
            >
              <Home aria-hidden className="h-icon w-icon" />
              {t('home')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!data) return null

  const seconds = Math.ceil(remaining / 1000)
  const mmss = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  const warnAt = motionToken('--timing-clock-warn')
  const dangerAt = motionToken('--timing-clock-danger')
  const tone = remaining < dangerAt ? 'danger' : remaining < warnAt ? 'warn' : 'ok'
  const total = data.durationSeconds * 1000
  const fraction = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0
  const roster = CASE_ROSTER.find((c) => c.id === data.id)
  const flaggedCount = Object.keys(found).length + missed.length
  const asClock = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.round((ms % 60000) / 1000)).padStart(2, '0')}`

  const begin = () => {
    markHowToSeen('investigation')
    deadlineRef.current = Date.now() + total
    setPhase('hunting')
  }

  return (
    <main className="screen-in flex h-dvh w-full flex-col">
      {/* ---- a slim bar, not the banner: the conversation needs the height ---- */}
      <header className="shrink-0 border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-screen-sm items-center justify-between gap-stack px-screen-x py-ring">
          <Link
            to="/investigation"
            className={`tap-target flex items-center gap-ring rounded-button px-stack text-small font-semibold text-muted ${kh}`}
          >
            <ArrowLeft aria-hidden className="h-icon w-icon" />
            {t('exit')}
          </Link>
          <span className={`flex items-center gap-ring rounded-button bg-primary px-stack py-ring text-small font-bold text-primary-text ${kh}`}>
            <FolderOpen aria-hidden className="h-icon w-icon" />
            {t('caseNumber').replace('{n}', String(roster?.number ?? 1).padStart(3, '0'))}
          </span>
          <span className="flex items-center gap-ring px-stack text-body font-bold tabular-nums">
            <Flag aria-hidden className="h-icon w-icon fill-current text-danger" />
            {Object.keys(found).length}/{data.flagCount}
          </span>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-screen-sm flex-1 flex-col">
        {/* ---- the clock ---- */}
        <section className="shrink-0 border-b border-border bg-surface px-screen-x py-ring">
          <div className="flex items-center gap-stack">
            <div role="timer" aria-label={mmss} className="h-timer-bar min-w-0 flex-1 overflow-hidden rounded-button bg-surface-alt">
              <div
                className={`h-full rounded-button transition-all duration-option-fade
                            ${tone === 'danger' ? 'clock-flash bg-danger' : tone === 'warn' ? 'bg-caution' : 'bg-primary'}`}
                style={{ width: `${fraction * 100}%` }}
              />
            </div>
            <span
              className={`shrink-0 text-body font-bold tabular-nums
                          ${tone === 'danger' ? 'clock-flash text-danger' : tone === 'warn' ? 'text-caution' : 'text-primary'}`}
            >
              {mmss}
            </span>
          </div>
          <div className={`mt-ring flex flex-wrap items-center justify-center gap-stack text-small text-muted ${kh}`}>
            <span className="flex items-center gap-ring">
              <AlertTriangle aria-hidden className="h-icon w-icon text-caution" />
              {t('turnsYellowAt').replace('{t}', asClock(warnAt))}
            </span>
            <span className="flex items-center gap-ring border-l border-border pl-stack">
              <Circle aria-hidden className="h-icon w-icon fill-current text-danger" />
              {t('flashesRedAt').replace('{t}', asClock(dangerAt))}
            </span>
            {hasMagnifier && (
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-pressed={zoomed}
                className={`tap-target flex items-center gap-ring rounded-button border px-stack transition-colors duration-option-fade
                            ${zoomed ? 'border-primary bg-primary text-primary-text' : 'border-border bg-surface text-muted'} ${kh}`}
              >
                <Search aria-hidden className="h-icon w-icon" />
                {t('zoomIn')}
              </button>
            )}
          </div>
        </section>

        {/* ---- the conversation ---- */}
        <div className="relative min-h-0 flex-1 bg-chat-wallpaper">
          <div className="flex h-full flex-col gap-bubble-gap overflow-y-auto overscroll-contain px-screen-x py-stack">
            {data.elements.map((el) => {
              const Icon = KIND_ICON[el.kind]
              const isFound = el.id in found
              const isMissed = missed.includes(el.id)
              const isFlashing = flash === el.id
              const mine = el.from === 'you'
              const chip = el.kind === 'sender' || el.kind === 'timestamp'
              const name = mine ? roster?.you[language] : roster?.them[language]
              const avatar = mine ? '/investigation-avatar-you.jpg' : '/investigation-avatar-them.jpg'

              const feedback = (
                <>
                  {isFound && (
                    <p className={`bubble-in bubble-max mt-ring rounded-card border border-danger bg-surface p-stack text-small ${kh}`}>
                      {found[el.id]}
                    </p>
                  )}
                  {isFlashing && (
                    <p className={`bubble-in mt-ring text-small text-danger ${kh}`}>
                      {t('notTheIssue')} · {t('penaltyTenSeconds')}
                    </p>
                  )}
                </>
              )

              // Sender and timestamp are the thread's own chrome: a centred
              // chip, still evidence, still tappable.
              if (chip) {
                return (
                  <div key={el.id} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => tap(el.id)}
                      disabled={isFound || isMissed}
                      aria-pressed={isFound}
                      aria-label={t('tapSuspicious')}
                      className={`tap-target flex max-w-bubble items-center gap-stack rounded-card border-l-4 bg-surface px-stack py-ring text-small
                                  shadow-sm transition-colors duration-option-fade
                                  ${isFound || isFlashing ? 'border-danger' : 'border-transparent'}
                                  ${isMissed && !isFlashing ? 'opacity-50' : ''} ${kh}`}
                    >
                      <Icon aria-hidden className="h-icon w-icon shrink-0 text-muted" />
                      <span className={`min-w-0 break-words text-left ${zoomed ? 'text-zoom' : ''}`}>{el.text[language]}</span>
                      {/* the same flag as on a bubble — this line is evidence too */}
                      <span
                        aria-hidden
                        className={`flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full border
                                    ${isFound ? 'border-danger bg-danger text-primary-text' : isMissed ? 'border-border bg-surface-alt text-muted' : 'border-border bg-surface text-muted'}`}
                      >
                        {isMissed && !isFound ? <X className="h-icon w-icon" /> : <Flag className={`h-icon w-icon ${isFound ? 'fill-current' : ''}`} />}
                      </span>
                    </button>
                    {feedback}
                  </div>
                )
              }

              return (
                <div key={el.id} className={`flex items-end gap-stack ${mine ? 'flex-row-reverse' : ''}`}>
                  <img src={avatar} alt="" aria-hidden className="h-avatar w-avatar shrink-0 rounded-full object-cover" />
                  <div className={`flex min-w-0 flex-col ${mine ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`bubble-max rounded-bubble border-l-4 px-stack py-ring shadow-sm
                                  ${mine ? 'bubble-tail-out bg-bubble-player' : 'bubble-tail-in bg-surface'}
                                  ${isFound || isFlashing ? 'border-danger' : 'border-transparent'}
                                  ${isMissed && !isFlashing ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-stack">
                        <span className={`text-small font-semibold text-primary ${kh}`}>{name}</span>
                        {/* the flag: the tap target for "this is suspicious" */}
                        {!mine && (
                          <button
                            type="button"
                            onClick={() => tap(el.id)}
                            disabled={isFound || isMissed}
                            aria-pressed={isFound}
                            aria-label={t('tapSuspicious')}
                            className={`flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full border transition-colors duration-option-fade
                                        ${isFound ? 'border-danger bg-danger text-primary-text' : isMissed ? 'border-border bg-surface-alt text-muted' : 'border-border bg-surface text-muted'}`}
                          >
                            {isMissed && !isFound ? <X className="h-icon w-icon" /> : <Flag className={`h-icon w-icon ${isFound ? 'fill-current' : ''}`} />}
                          </button>
                        )}
                      </div>
                      <p className={`flex items-start gap-ring text-small ${zoomed ? 'text-zoom' : ''} ${kh}`}>
                        {el.kind !== 'message' && <Icon aria-hidden className="mt-ring h-icon w-icon shrink-0 text-muted" />}
                        <span className="min-w-0 break-words">{el.text[language]}</span>
                      </p>
                      <span className={`flex items-center justify-end ${mine ? 'text-chat-time-mine' : 'text-chat-time'}`}>
                        <CheckCheck aria-hidden className="h-icon w-icon" />
                      </span>
                    </div>
                    {feedback}
                  </div>
                </div>
              )
            })}
            <p className={`text-center text-small text-muted ${kh}`}>{t('scrollForMore')}</p>
          </div>

          {/* ---- first time only: how to play, over the conversation ---- */}
          {phase === 'briefing' && (
            <div className="absolute inset-0 flex items-center justify-center bg-text/40 p-section">
              <div role="dialog" aria-modal="true" aria-labelledby="inv-howto" className="bubble-in w-full max-w-bubble rounded-card bg-surface p-stack">
                <h2 id="inv-howto" className={`flex items-center gap-stack text-body font-bold ${kh}`}>
                  <span aria-hidden className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-primary text-primary-text">
                    <Info className="h-icon w-icon" />
                  </span>
                  {t('howToPlay')}
                </h2>
                <p className={`mt-stack text-small ${kh}`}>{t('investigationHowTo')}</p>
                <button
                  type="button"
                  onClick={begin}
                  className={`tap-target mt-stack flex w-full items-center justify-center gap-ring rounded-button bg-primary
                              px-section text-body font-bold text-primary-text ${kh}`}
                >
                  {t('gotItStartTimer')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ---- flagged so far, and submit ---- */}
        <footer className="flex shrink-0 items-center justify-between gap-stack border-t border-border bg-surface px-screen-x py-stack">
          <span className={`flex items-center gap-ring text-body font-bold ${kh}`}>
            <Flag aria-hidden className="h-icon w-icon fill-current text-danger" />
            {t('flagged')}: <span className="tabular-nums">{flaggedCount}</span>
          </span>
          <button
            type="button"
            onClick={() => void finish()}
            disabled={phase !== 'hunting'}
            className={`tap-target flex items-center justify-center gap-ring rounded-button bg-primary px-section
                        text-body font-bold text-primary-text transition-opacity duration-option-fade disabled:opacity-50 ${kh}`}
          >
            {t('submitFindings')}
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </button>
        </footer>
      </div>
    </main>
  )
}

/** One line of the result checklist, with a small tick / cross / warning. */
function Line({ tone, children }: { tone: 'safe' | 'danger' | 'caution'; children: React.ReactNode }) {
  const Icon = tone === 'safe' ? Check : tone === 'danger' ? X : AlertTriangle
  const color = tone === 'safe' ? 'bg-safe' : tone === 'danger' ? 'bg-danger' : 'bg-caution'
  return (
    <li className="flex items-center gap-stack">
      <span aria-hidden className={`flex h-icon w-icon shrink-0 items-center justify-center rounded-full text-primary-text ${color}`}>
        <Icon className="h-icon w-icon p-ring" />
      </span>
      {children}
    </li>
  )
}

/**
 * One row of the debrief: a flag the player got, one they missed, or a
 * false alarm — the evidence quoted on the left, why it matters (or does
 * not) in the blue box on the right. Stacks on a narrow phone.
 */
function FlagRow({
  n,
  state,
  quote,
  body,
  kh,
}: {
  n?: number
  state: 'correct' | 'missed' | 'false'
  quote: string
  body: string
  kh: string
}) {
  const t = useT()
  const Icon = state === 'correct' ? Check : state === 'missed' ? X : AlertTriangle
  const badge = state === 'correct' ? 'bg-safe' : state === 'missed' ? 'bg-danger' : 'bg-caution'
  const chip = state === 'correct' ? 'bg-safe/15 text-safe' : state === 'missed' ? 'bg-danger/15 text-danger' : 'bg-caution/15 text-caution'
  const label = state === 'correct' ? t('flagCorrect') : state === 'missed' ? t('flagMissed') : t('falseAlarm')
  return (
    <li className="flex flex-col gap-stack rounded-card border border-border bg-surface p-stack sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-stack">
        <span aria-hidden className={`flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full text-primary-text ${badge}`}>
          <Icon className="h-icon w-icon" />
        </span>
        <div className="min-w-0 flex-1">
          <span className={`inline-flex rounded-button px-stack py-ring text-small font-bold ${chip} ${kh}`}>
            {n !== undefined && <>{t('flagN').replace('{n}', String(n))} — </>}
            {label}
          </span>
          <p className={`mt-ring break-words text-body font-semibold ${kh}`}>“{quote}”</p>
        </div>
      </div>
      <p className={`min-w-0 rounded-card bg-primary/10 p-stack text-small sm:flex-1 ${kh}`}>{body}</p>
    </li>
  )
}
