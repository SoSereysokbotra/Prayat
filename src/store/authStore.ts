/**
 * Who is signed in.
 *
 * ⚠️ THIS IS NOT AUTHENTICATION. There is no backend, no token, no signature —
 * just a marker in localStorage saying the UI should behave as though someone
 * signed in. Anyone can set it from devtools. It exists so the route guard and
 * the screens can be built and demoed before the backend lands.
 *
 * WHEN THE BACKEND EXISTS: replace the stored marker with the real session
 * token, and have `restore()` validate it against the server instead of
 * trusting what it reads. The rest of the app does not change.
 *
 * The session must survive a reload. Without that, every refresh throws the
 * player back to sign-in, which is both miserable and would break a demo run
 * on a phone.
 */

import { create } from 'zustand'
import type { AuthUser } from '../api/auth'

const SESSION_KEY = 'prayat.session'

/**
 * Guest is a first-class state, not an absence of one.
 *
 * Scam awareness is a public-good product: making an account a hard wall in
 * front of it keeps the app off the phones that need it most. A guest can
 * play; a guest's score simply lives on the device.
 */
export type Session =
  | { kind: 'user'; email: string; emailVerified: boolean }
  | { kind: 'guest' }

function read(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (parsed?.kind === 'guest') return parsed
    if (parsed?.kind === 'user' && typeof parsed.email === 'string') return parsed
    return null
  } catch {
    // Private window, blocked site data, or corrupted JSON. Treat it as signed
    // out rather than crashing the app on boot.
    return null
  }
}

function write(session: Session | null): void {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    /* the session still works for this tab */
  }
}

interface AuthState {
  session: Session | null
  /** False until the stored session has been read, so the guard does not
   *  redirect on the first frame before it knows the answer. */
  ready: boolean
  signInAs: (user: AuthUser) => void
  continueAsGuest: () => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: read(),
  ready: true,

  signInAs: (user) => {
    const session: Session = {
      kind: 'user',
      email: user.email,
      emailVerified: user.emailVerified,
    }
    write(session)
    set({ session })
  },

  continueAsGuest: () => {
    const session: Session = { kind: 'guest' }
    write(session)
    set({ session })
  },

  signOut: () => {
    write(null)
    set({ session: null })
  },
}))

/** True when anything at all is signed in, guest included. */
export function useIsSignedIn(): boolean {
  return useAuthStore((s) => s.session !== null)
}
