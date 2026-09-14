import { useEffect, useRef, useState } from 'react'
import { motionToken, sizeToken, sleep } from './useMotionToken'

export type PullPhase = 'idle' | 'pulling' | 'armed' | 'refreshing'

export interface PullState {
  /** How far the sheet has been dragged, in px. 0 at rest. */
  pull: number
  /** 0 → 1: pull as a fraction of the maximum. Drives the hint's opacity. */
  progress: number
  phase: PullPhase
}

/* Finger travel → sheet travel. Below 1 so the sheet feels weighted. */
const RESISTANCE = 0.55
/* Fraction of the maximum pull that arms a refresh on release. */
const ARM_AT = 0.7

/**
 * Pull-to-refresh for the home sheet.
 *
 * The sheet rides up over the river half of the banner. Dragging down from
 * the top of the page slides it back down, revealing the river, and letting
 * go past the threshold reloads. Travel is capped just short of the overlap
 * (see --size-pull-max) so a full pull shows the river and nothing beyond it.
 *
 * Touch only. Mouse users have a reload button.
 */
export function usePullToRefresh(onRefresh: () => void | Promise<void>): PullState {
  const [pull, setPull] = useState(0)
  const [phase, setPhase] = useState<PullPhase>('idle')
  const maxRef = useRef(0)

  // The touchend handler needs the latest values without re-binding listeners.
  const phaseRef = useRef<PullPhase>('idle')
  const refreshRef = useRef(onRefresh)
  refreshRef.current = onRefresh

  useEffect(() => {
    maxRef.current = sizeToken('--size-pull-max')
    let startY: number | null = null

    const update = (next: PullPhase) => {
      phaseRef.current = next
      setPhase(next)
    }

    const onStart = (e: TouchEvent) => {
      if (phaseRef.current === 'refreshing') return
      // Only from the very top; otherwise this is an ordinary scroll.
      startY = window.scrollY <= 0 ? e.touches[0].clientY : null
    }

    const onMove = (e: TouchEvent) => {
      if (startY === null || phaseRef.current === 'refreshing') return
      const dy = e.touches[0].clientY - startY
      if (dy <= 0) {
        setPull(0)
        update('idle')
        return
      }
      // Claim the gesture: without this the browser scrolls (or runs its own
      // pull-to-refresh) underneath us.
      if (e.cancelable) e.preventDefault()
      const max = maxRef.current
      const next = Math.min(max, dy * RESISTANCE)
      setPull(next)
      update(next >= max * ARM_AT ? 'armed' : 'pulling')
    }

    const onEnd = async () => {
      if (startY === null) return
      startY = null
      if (phaseRef.current !== 'armed') {
        setPull(0)
        update('idle')
        return
      }
      // Hold the sheet fully open while refreshing so the river stays visible.
      update('refreshing')
      setPull(maxRef.current)
      await sleep(motionToken('--timing-sheet-settle'))
      await refreshRef.current()
      setPull(0)
      update('idle')
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
    window.addEventListener('touchcancel', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [])

  const max = maxRef.current
  return { pull, progress: max > 0 ? pull / max : 0, phase }
}
