import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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
import type { Localized, Option, OptionId, Stage } from '../../shared/types'

/**
 * Guardian Mode.
 *
 * Three stacked zones. The top one is the scammer's conversation with Auntie:
 * the player can read it but cannot reply into it. That read-only-ness is the
 * whole mechanic — you have no access to the scammer, only to the person who
 * is already half convinced.
 *
 * Every delay here comes from a motion token. None of these numbers exist in
 * this file.
 */

type Phase = 'loading' | 'playing' | 'awaiting' | 'error'

interface PlayerMessage {
  key: string
  from: 'auntie' | 'player'
  text: Localized
}

export default function Guardian() {
  const navigate = useNavigate()
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const setSessionId = useGameStore((s) => s.setSessionId)

  const [phase, setPhase] = useState<Phase>('loading')
  const [scammerMessages, setScammerMessages] = useState<{ key: string; text: Localized }[]>([])
  const [thread, setThread] = useState<PlayerMessage[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [stageId, setStageId] = useState<number | null>(null)
  const [scammerTyping, setScammerTyping] = useState(false)
  const [auntieTyping, setAuntieTyping] = useState(false)

  const sessionRef = useRef<string | null>(null)
  const aliveRef = useRef(true)
  // Synchronous lock. React state is async, so two taps in the same tick both
  // run their handlers before a re-render can disable anything.
  const lockRef = useRef(false)

  const pick = useCallback((v: Localized) => v[language], [language])

  /* ---- run one stage: scammer messages, then Auntie, then the options ---- */
  const playStage = useCallback(async (stage: Stage) => {
    const stagger = motionToken('--timing-scammer-stagger')
    const typing = motionToken('--timing-typing-min')

    setStageId(stage.id)
    setOptions([])

    setScammerTyping(true)
    for (const message of stage.scammerMessages) {
      await sleep(stagger)
      if (!aliveRef.current) return
      setScammerMessages((prev) => [...prev, { key: `s${stage.id}-${prev.length}`, text: message }])
    }
    setScammerTyping(false)

    setAuntieTyping(true)
    await sleep(typing)
    if (!aliveRef.current) return
    setAuntieTyping(false)

    setThread((prev) => [
      ...prev,
      { key: `a${stage.id}-${prev.length}`, from: 'auntie', text: stage.relativeMessage },
    ])
    setOptions(stage.options)
    lockRef.current = false
    setPhase('awaiting')
  }, [])

  /* ---- start ---- */
  useEffect(() => {
    aliveRef.current = true

    // The prototype ships one scenario, so the catalogue's first entry is it.
    // Going through the catalogue rather than hardcoding an id means adding a
    // second scenario is a content change, not a code change.
    listScenarios()
      .then((scenarios) => {
        const first = scenarios[0]
        if (!first) throw new Error('no scenarios available')
        return createSession(first.id, language)
      })
      .then((session) => {
        if (!aliveRef.current) return
        sessionRef.current = session.sessionId
        setSessionId(session.sessionId)
        setPhase('playing')
        return playStage(session.stage)
      })
      .catch(() => aliveRef.current && setPhase('error'))

    return () => {
      aliveRef.current = false
    }
    // `language` is intentionally omitted: it sets the session's language on
    // the server at creation, and switching mid-game must not restart the run.
    // The UI still re-renders in the new language because every string is
    // Localized and picked at render time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playStage, setSessionId])

  /* ---- the player answers ---- */
  const choose = useCallback(
    async (optionId: OptionId) => {
      if (lockRef.current) return
      lockRef.current = true

      const sessionId = sessionRef.current
      if (sessionId === null || stageId === null) return

      const chosen = options.find((o) => o.id === optionId)
      if (!chosen) return

      setPhase('playing')
      setOptions([])
      setThread((prev) => [
        ...prev,
        { key: `p${stageId}-${prev.length}`, from: 'player', text: chosen.text },
      ])

      const typing = motionToken('--timing-typing-min')
      setAuntieTyping(true)

      try {
        const [result] = await Promise.all([
          submitDecision(sessionId, stageId, optionId),
          sleep(typing),
        ])
        if (!aliveRef.current) return

        setAuntieTyping(false)
        setThread((prev) => [
          ...prev,
          { key: `r${stageId}-${prev.length}`, from: 'auntie', text: result.relativeReply },
        ])

        if (result.nextStage) {
          await sleep(typing)
          if (!aliveRef.current) return
          await playStage(result.nextStage)
        } else {
          // Won = the final decision is correct. Losing gets the consequence
          // scene first; winning goes straight to the debrief.
          await sleep(typing)
          if (!aliveRef.current) return
          navigate(result.isCorrect ? '/debrief' : '/consequence', { replace: true })
        }
      } catch {
        if (!aliveRef.current) return
        setAuntieTyping(false)
        setPhase('error')
      }
    },
    [navigate, options, playStage, stageId],
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

  return (
    <main className="mx-auto flex h-dvh w-full max-w-screen-sm flex-col">
      <header className="flex shrink-0 items-center justify-between gap-stack border-b border-border px-screen-x py-stack">
        <Link
          to="/"
          className="tap-target flex items-center gap-stack rounded-button text-small text-muted"
        >
          <ArrowLeft aria-hidden className="h-icon w-icon" />
          <span className={kh}>{t('back')}</span>
        </Link>
        <LanguageToggle />
      </header>

      {/* The three zones size themselves against THIS box, not the whole
          viewport — otherwise 30+40+30 would be measured against the screen
          height and overflow by exactly the height of the header. */}
      <div className="flex min-h-0 flex-1 flex-col">
      {/* ---- zone 1: the threat. Read-only. ---- */}
      <div className="flex min-h-0 shrink-0 grow-0 basis-zone-threat flex-col border-b border-border">
        <p className={`shrink-0 bg-zone-threat px-screen-x pt-stack text-small text-muted ${kh}`}>
          {t('threatZoneLabel')}
        </p>
        <ChatWindow
          label={t('threatZoneLabel')}
          tone="threat"
          dependency={`${scammerMessages.length}:${scammerTyping}`}
          className="min-h-0 flex-1"
        >
          {scammerMessages.map((m) => (
            <ChatBubble key={m.key} variant="scammer">
              {pick(m.text)}
            </ChatBubble>
          ))}
          {scammerTyping && <TypingIndicator variant="scammer" />}
        </ChatWindow>
      </div>

      {/* ---- zone 2: you and Auntie ---- */}
      <ChatWindow
        label={t('yourChatLabel')}
        dependency={`${thread.length}:${auntieTyping}`}
        className="min-h-0 shrink-0 grow-0 basis-zone-chat border-b border-border"
      >
        {thread.map((m) => (
          <ChatBubble key={m.key} variant={m.from}>
            {pick(m.text)}
          </ChatBubble>
        ))}
        {auntieTyping && <TypingIndicator />}
      </ChatWindow>

      {/* ---- zone 3: the four replies ---- */}
      <div className="min-h-0 shrink-0 grow-0 basis-zone-options overflow-y-auto overscroll-contain px-screen-x py-stack">
        {options.length > 0 ? (
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
        ) : (
          <p className={`py-stack text-center text-small text-muted ${kh}`}>
            {t('waitingForAuntie')}
          </p>
        )}
      </div>
      </div>
    </main>
  )
}
