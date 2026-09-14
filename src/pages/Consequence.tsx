import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ScreenState from '../components/ScreenState'
import { useIsKhmer } from '../hooks/useT'
import { motionToken } from '../hooks/useMotionToken'
import { useGameStore } from '../store/gameStore'
import { getDebrief } from '../fixtures/scenario'
import type { Localized } from '../../shared/types'

/**
 * The failure path, three days later.
 *
 * One message, full screen, no controls. The page is deleted, the transfer
 * cannot be reversed, the money is gone, and the same person is working the
 * rest of the street.
 *
 * It exists to make the threat concrete, not to shame the player — which is
 * why it is a beat rather than a screen you have to dismiss, and why the
 * debrief follows immediately.
 */
export default function Consequence() {
  const navigate = useNavigate()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const sessionId = useGameStore((s) => s.sessionId)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [text, setText] = useState<Localized | null>(null)

  useEffect(() => {
    if (!sessionId) return
    let alive = true

    getDebrief(sessionId)
      .then((summary) => {
        if (!alive) return
        setText(summary.debrief.consequence)
        setStatus('ready')
      })
      .catch(() => alive && setStatus('error'))

    return () => {
      alive = false
    }
  }, [sessionId])

  // Hold the beat, then move on. The player never taps to continue — being
  // made to acknowledge this would turn a consequence into a punishment.
  useEffect(() => {
    if (status !== 'ready') return
    const timer = setTimeout(
      () => navigate('/debrief', { replace: true }),
      motionToken('--timing-consequence'),
    )
    return () => clearTimeout(timer)
  }, [status, navigate])

  // Landing here directly, with no session, is not a state worth explaining.
  if (!sessionId) return <Navigate to="/" replace />

  if (status !== 'ready') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind={status === 'error' ? 'error' : 'loading'} onRetry={() => navigate('/')} />
      </main>
    )
  }

  return (
    <main
      role="status"
      className="mx-auto flex h-dvh w-full max-w-screen-sm flex-col items-center justify-center
                 bg-zone-threat px-screen-x py-section"
    >
      <p
        className={`bubble-in max-w-screen-sm text-center text-rule ${isKhmer ? 'leading-kh' : ''}`}
      >
        {text?.[language]}
      </p>
    </main>
  )
}
