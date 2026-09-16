import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarClock, TrendingDown } from 'lucide-react'
import ChatBubble from '../components/ChatBubble'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
import { motionToken } from '../hooks/useMotionToken'
import { useGameStore } from '../store/gameStore'
import { getDebrief } from '../api/client'
import type { Debrief } from '../../shared/types'

/**
 * The failure path, three days later.
 *
 * Told the way the player has just been reading everything: as messages
 * from the relative. First what happened right after they paid, then the
 * message from three days on — the page deleted, the transfer irreversible,
 * the same man working the rest of the street.
 *
 * It exists to make the threat concrete, not to shame the player — so the
 * screen moves on to the debrief by itself after a beat long enough to
 * read, and the button is there for anyone who has read faster.
 */
export default function Consequence() {
  const t = useT()
  const navigate = useNavigate()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const sessionId = useGameStore((s) => s.sessionId)
  const relative = useGameStore((s) => s.activeRelative)
  const kh = isKhmer ? 'leading-kh' : ''

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [debrief, setDebrief] = useState<Debrief | null>(null)

  useEffect(() => {
    if (!sessionId) return
    let alive = true
    getDebrief(sessionId)
      .then((summary) => {
        if (!alive) return
        setDebrief(summary.debrief)
        setStatus('ready')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [sessionId])

  // Hold the beat, then move on by itself.
  useEffect(() => {
    if (status !== 'ready') return
    const timer = setTimeout(() => navigate('/debrief', { replace: true }), motionToken('--timing-consequence'))
    return () => clearTimeout(timer)
  }, [status, navigate])

  // Landing here directly, with no session, is not a state worth explaining.
  if (!sessionId) return <Navigate to="/" replace />

  if (status !== 'ready' || !debrief) {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind={status === 'error' ? 'error' : 'loading'} onRetry={() => navigate('/')} />
      </main>
    )
  }

  const avatar = relative ? (
    <img src={`/avatar-${relative.avatar}.jpg`} alt="" aria-hidden className="h-avatar w-avatar rounded-full object-cover" />
  ) : null

  return (
    <main role="status" className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col gap-section bg-zone-threat px-screen-x py-section">
      {/* ---- who, and what this is ---- */}
      <section className="flex flex-col items-center text-center">
        <span className="relative">
          {relative && (
            <img
              src={`/avatar-${relative.avatar}.jpg`}
              alt=""
              aria-hidden
              className="h-illustration w-illustration rounded-full border border-danger object-cover grayscale"
            />
          )}
          <span
            aria-hidden
            className="absolute bottom-0 right-0 flex h-avatar w-avatar items-center justify-center rounded-full border border-surface bg-danger text-primary-text"
          >
            <TrendingDown className="h-icon w-icon" />
          </span>
        </span>
        <h1 className={`mt-stack text-title font-bold text-danger ${kh}`}>{t('howItEnded')}</h1>
        {relative && <p className={`text-body text-muted ${kh}`}>{relative.name[language]}</p>}
      </section>

      {/* ---- the story, as the messages the relative sent ---- */}
      <section className="flex flex-col gap-stack">
        <p className="flex justify-center">
          <span className={`flex items-center gap-ring rounded-button bg-chat-time/80 px-stack py-ring text-small font-semibold text-primary-text ${kh}`}>
            <CalendarClock aria-hidden className="h-icon w-icon" />
            {t('rightAfter')}
          </span>
        </p>
        <ChatBubble variant="relative" tail avatar={avatar}>
          {debrief.outcomeLose[language]}
        </ChatBubble>

        <p className="mt-run-gap flex justify-center">
          <span className={`flex items-center gap-ring rounded-button bg-danger px-stack py-ring text-small font-semibold text-primary-text ${kh}`}>
            <CalendarClock aria-hidden className="h-icon w-icon" />
            {t('threeDaysLater')}
          </span>
        </p>
        <ChatBubble variant="relative" tail avatar={avatar}>
          {debrief.consequence[language]}
        </ChatBubble>
      </section>

      <button
        type="button"
        onClick={() => navigate('/debrief', { replace: true })}
        className={`tap-target mt-auto flex w-full items-center justify-center gap-stack rounded-button bg-danger
                    px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
      >
        {t('seeWhatWentWrong')}
        <ArrowRight aria-hidden className="h-icon w-icon" />
      </button>
    </main>
  )
}
