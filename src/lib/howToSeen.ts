import type { GameMode } from '../../shared/types'

/**
 * Whether a mode's "How to play" has been shown on this device.
 *
 * First visit to a mode goes through its how-to; after that the mode opens
 * straight into play and the how-to is a link, not a gate. Per device, like
 * the score — and guarded, because localStorage can throw.
 */
const KEY = (mode: GameMode) => `prayat.howToSeen.${mode}`

export function hasSeenHowTo(mode: GameMode): boolean {
  try {
    return localStorage.getItem(KEY(mode)) === '1'
  } catch {
    return true // if we cannot remember, do not trap them in the how-to
  }
}

export function markHowToSeen(mode: GameMode): void {
  try {
    localStorage.setItem(KEY(mode), '1')
  } catch {
    /* fine — they will see it once more next time */
  }
}
