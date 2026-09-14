import { useCallback, useRef, useState } from 'react'
import type { OptionId } from '../../shared/types'

/**
 * One choice per stage, enforced synchronously.
 *
 * The `disabled` prop alone does NOT prevent a double submit. React state
 * updates are asynchronous: two taps landing in the same tick both run their
 * handlers before a re-render can disable anything. On a phone that is one
 * impatient double-tap, and it is the most likely bug in the whole demo — a
 * player answers stage 1 twice, or answers stage 1 and stage 2 with one
 * gesture.
 *
 * The ref is set synchronously inside the handler, so the second call in the
 * same tick is already too late. `disabled` then handles the visuals.
 *
 * This is the first of three guards. The second is the server rejecting a
 * repeat with 409; the third is UNIQUE(session_id, stage_id) in SQLite.
 */
export function useLockedChoice(onChoose: (id: OptionId) => void) {
  const locked = useRef(false)
  const [choice, setChoice] = useState<OptionId | null>(null)

  const select = useCallback(
    (id: OptionId) => {
      if (locked.current) return
      locked.current = true
      setChoice(id)
      onChoose(id)
    },
    [onChoose],
  )

  const reset = useCallback(() => {
    locked.current = false
    setChoice(null)
  }, [])

  return { choice, select, reset, isLocked: choice !== null }
}
