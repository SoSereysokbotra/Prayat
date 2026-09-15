/**
 * The browser's "add to home screen" prompt, held until the player asks.
 *
 * Chrome on Android fires `beforeinstallprompt` once, early, and only lets
 * you show the prompt from a user gesture later — so it must be caught at
 * app start (this module is imported from main.tsx) and kept. iOS never
 * fires it; there the install screen shows the Share → Add to Home Screen
 * instructions instead.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
    listeners.forEach((fn) => fn())
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    listeners.forEach((fn) => fn())
  })
}

/** True when the browser has offered a native install prompt we can show. */
export function canPromptInstall(): boolean {
  return deferred !== null
}

/** Already running from the home screen — nothing to install. */
export function isInstalled(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

/** iPhone/iPad Safari: no prompt API, only the manual route. */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/** Show the native prompt. Resolves to whether they accepted. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false
  const ev = deferred
  deferred = null
  await ev.prompt()
  const { outcome } = await ev.userChoice
  listeners.forEach((fn) => fn())
  return outcome === 'accepted'
}

/** Re-render when the prompt becomes available or is used up. */
export function onInstallChange(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
