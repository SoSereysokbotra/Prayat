import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import ChatBubble from '../components/ChatBubble'
import ChatWindow from '../components/ChatWindow'
import LanguageToggle from '../components/LanguageToggle'
import OptionButton from '../components/OptionButton'
import ScreenState from '../components/ScreenState'
import TypingIndicator from '../components/TypingIndicator'
import { useT, useIsKhmer } from '../hooks/useT'
import { motionToken, sleep } from '../hooks/useMotionToken'
import { useGameStore } from '../store/gameStore'
import { createSession, listScenarios, submitDecision } from '../api/client'
import { SCENARIO_ROSTER, type RosterEntry } from '../lib/scenarioRoster'
import { POINTS_PER_CORRECT, type Localized, type Option, type OptionId, type ScamType, type Stage } from '../../shared/types'

/**
 * Guardian Mode.
 *
 * One chat thread with the relative, the way it would look on the player's
 * own phone. The scammer never talks to the player: his messages arrive as
 * FORWARDS from the relative, so the player can read them but has no way to
 * answer them. That read-only-ness is the whole mechanic — you have no access
 * to the scammer, only to the person who is already half convinced — and a
 * forward is how everyone already understands it.
 *
 * Replies live in a sheet at the bottom, like a quick-reply keyboard.
 *
 * Every delay here comes from a motion token. None of these numbers exist in
 * this file.
 */

type Phase = 'loading' | 'playing' | 'awaiting' | 'error'

interface Message {
  key: string
  /** `scammer` = a forward from the relative; the player cannot answer it. */
  from: 'scammer' | 'relative' | 'player'
  text: Localized
}

export default function Guardian() {
  const navigate = useNavigate()
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const setSessionId = useGameStore((s) => s.setSessionId)
  const markCompleted = useGameStore((s) => s.markCompleted)
  const setActiveScamType = useGameStore((s) => s.setActiveScamType)
  // From the picker. Absent (old links, bookmarks) → the first scenario.
  const { scenarioId } = useParams<{ scenarioId: string }>()

  const [phase, setPhase] = useState<Phase>('loading')
  // Header furniture: where in the scenario we are, and what it has earned.
  const [stageCount, setStageCount] = useState(0)
  const [correct, setCorrect] = useState(0)
  // Who is talking: the relative from the content, the scammer from the roster.
  const [relative, setRelative] = useState<{ name: Localized; avatar: string } | null>(null)
  const [roster, setRoster] = useState<RosterEntry | null>(null)
  const [thread, setThread] = useState<Message[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [stageId, setStageId] = useState<number | null>(null)
  // One indicator: the relative is the only one who ever types to the player.
  const [typing, setTyping] = useState(false)

  const sessionRef = useRef<string | null>(null)
  const scamTypeRef = useRef<ScamType | null>(null)
  // Which mount's async chain is allowed to touch state. A boolean is not
  // enough: StrictMode mounts twice in dev, and the second mount's `true`
  // would let the first mount's orphaned chain carry on — two sessions, every
  // bubble twice. Each mount takes a fresh number; a stale chain sees a
  // mismatch and stops.
  const runRef = useRef(0)
  const live = (run: number) => runRef.current === run
  // Synchronous lock. React state is async, so two taps in the same tick both
  // run their handlers before a re-render can disable anything.
  const lockRef = useRef(false)

  const pick = useCallback((v: Localized) => v[language], [language])

  /* ---- run one stage: scammer messages, then the relative, then the options ---- */
  const playStage = useCallback(async (stage: Stage, run: number) => {
    const stagger = motionToken('--timing-scammer-stagger')
    const typing = motionToken('--timing-typing-min')

    setStageId(stage.id)
    setOptions([])

    // The relative forwards the scammer's messages one by one, then speaks.
    setTyping(true)
    for (const message of stage.scammerMessages) {
      await sleep(stagger)
      if (!live(run)) return
      setThread((prev) => [...prev, { key: `s${stage.id}-${prev.length}`, from: 'scammer', text: message }])
    }

    await sleep(typing)
    if (!live(run)) return
    setTyping(false)

    setThread((prev) => [
      ...prev,
      { key: `a${stage.id}-${prev.length}`, from: 'relative', text: stage.relativeMessage },
    ])
    setOptions(stage.options)
    lockRef.current = false
    setPhase('awaiting')
  }, [])

  /* ---- start ---- */
  useEffect(() => {
    const run = ++runRef.current

    // The picker passes the id. Going through the catalogue when it is
    // missing means an old /guardian link still plays something.
    listScenarios()
      .then((scenarios) => {
        const chosen = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]
        if (!chosen) throw new Error('no scenarios available')
        return createSession(chosen.id, language)
      })
      .then((session) => {
        if (!live(run)) return
        sessionRef.current = session.sessionId
        scamTypeRef.current = session.scenario.scamType
        setStageCount(session.scenario.stageCount)
        setRelative(session.scenario.relative)
        setRoster(SCENARIO_ROSTER.find((e) => e.scamType === session.scenario.scamType) ?? null)
        setSessionId(session.sessionId)
        setActiveScamType(session.scenario.scamType)
        setPhase('playing')
        return playStage(session.stage, run)
      })
      .catch(() => live(run) && setPhase('error'))

    return () => {
      // Invalidate this mount's chain. The next mount takes a new number.
      runRef.current++
    }
    // `language` is intentionally omitted: it sets the session's language on
    // the server at creation, and switching mid-game must not restart the run.
    // The UI still re-renders in the new language because every string is
    // Localized and picked at render time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playStage, setSessionId, setActiveScamType, scenarioId])

  /* ---- the player answers ---- */
  const choose = useCallback(
    async (optionId: OptionId) => {
      if (lockRef.current) return
      lockRef.current = true

      const sessionId = sessionRef.current
      if (sessionId === null || stageId === null) return
      const run = runRef.current

      const chosen = options.find((o) => o.id === optionId)
      if (!chosen) return

      setPhase('playing')
      setOptions([])
      setThread((prev) => [
        ...prev,
        { key: `p${stageId}-${prev.length}`, from: 'player', text: chosen.text },
      ])

      const typing = motionToken('--timing-typing-min')
      setTyping(true)

      try {
        const [result] = await Promise.all([
          submitDecision(sessionId, stageId, optionId),
          sleep(typing),
        ])
        if (!live(run)) return

        setTyping(false)
        if (result.isCorrect) setCorrect((n) => n + 1)
        setThread((prev) => [
          ...prev,
          { key: `r${stageId}-${prev.length}`, from: 'relative', text: result.relativeReply },
        ])

        if (result.nextStage) {
          await sleep(typing)
          if (!live(run)) return
          await playStage(result.nextStage, run)
        } else {
          // Won = the final decision is correct. Losing gets the consequence
          // scene first; winning goes straight to the debrief.
          await sleep(typing)
          if (!live(run)) return
          // Reaching the end unlocks the next scenario, win or lose.
          if (scamTypeRef.current) markCompleted(scamTypeRef.current)
          navigate(result.isCorrect ? '/debrief' : '/consequence', { replace: true })
        }
      } catch {
        if (!live(run)) return
        setTyping(false)
        setPhase('error')
      }
    },
    [markCompleted, navigate, options, playStage, stageId],
  )

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

  const kh = isKhmer ? 'leading-kh' : ''

  const relativeName = relative ? pick(relative.name) : ''
  const progress = stageCount > 0 && stageId ? stageId / stageCount : 0

  const relativeAvatar = relative ? (
    <img
      src={`/avatar-${relative.avatar}.jpg`}
      alt=""
      aria-hidden
      className="h-avatar w-avatar rounded-full object-cover"
    />
  ) : null

  const forwardedFrom = roster
    ? { name: pick(roster.scammer.name), verified: roster.scammer.verified }
    : undefined

  return (
    <main className="mx-auto flex h-dvh w-full max-w-screen-sm flex-col">
      {/* ---- header: a chat app's header. Who, plus how far along. ---- */}
      <header className="shrink-0 border-b border-border bg-surface">
        <div className="flex items-center gap-stack px-screen-x py-stack">
          <Link
            to="/guardian"
            aria-label={t('back')}
            className="tap-target flex shrink-0 items-center justify-center rounded-button text-muted"
          >
            <ArrowLeft aria-hidden className="h-icon w-icon" />
          </Link>

          {relativeAvatar}

          <div className="min-w-0 flex-1">
            <p className={`truncate text-body font-semibold ${kh}`}>{relativeName}</p>
            <p className={`truncate text-small text-muted ${kh}`}>
              {t('stage')} {stageId ?? 1}/{stageCount || '?'}
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-ring text-small font-semibold tabular-nums">
            <Star aria-hidden className="h-icon w-icon fill-current text-caution" />
            {correct * POINTS_PER_CORRECT}
          </span>

          <LanguageToggle compact />
        </div>

        {/* Progress as a hairline, not a widget. */}
        <div
          role="progressbar"
          aria-valuenow={stageId ?? 0}
          aria-valuemin={0}
          aria-valuemax={stageCount}
          className="h-timer-bar w-full bg-surface-alt"
        >
          <div
            className="h-full bg-primary transition-all duration-route"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </header>

      {/* ---- the thread ---- */}
      <ChatWindow
        label={t('yourChatLabel')}
        dependency={`${thread.length}:${typing}:${options.length}`}
        className="chat-anchor min-h-0 flex-1 px-screen-x"
      >
        {thread.map((m, i) => {
          const next = thread[i + 1]
          // Avatar on the last bubble of a run from the relative's side —
          // forwards included, since it is the relative who forwarded them.
          const endOfRun = m.from !== 'player' && (!next || next.from === 'player')
          return (
            <ChatBubble
              key={m.key}
              variant={m.from}
              avatar={endOfRun && !typing ? relativeAvatar : undefined}
              forwardedFrom={m.from === 'scammer' ? forwardedFrom : undefined}
            >
              {pick(m.text)}
            </ChatBubble>
          )
        })}
        {typing && (
          <div className="flex items-end gap-stack">
            <div className="h-avatar w-avatar shrink-0">{relativeAvatar}</div>
            <TypingIndicator />
          </div>
        )}
      </ChatWindow>

      {/* ---- replies: a sheet, like a quick-reply keyboard ---- */}
      <section
        aria-label={t('whatDoYouReply')}
        className="flex max-h-zone-options shrink-0 flex-col rounded-t-sheet border-t border-border bg-surface"
      >
        <p className={`shrink-0 px-screen-x pt-stack text-small font-semibold text-muted ${kh}`}>
          {options.length > 0 ? t('whatDoYouReply') : t('waitingForRelative')}
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-screen-x py-stack">
          {options.length > 0 && (
            <div className="flex flex-col gap-stack">
              {options.map((option) => (
                <OptionButton
                  key={option.id}
                  id={option.id}
                  onSelect={choose}
                  disabled={phase !== 'awaiting'}
                >
                  {pick(option.text)}
                </OptionButton>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
