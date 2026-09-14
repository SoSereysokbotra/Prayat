/**
 * Auth — UI ONLY. There is no backend behind any of this yet.
 *
 * Every function here is a stub that waits, then succeeds (or fails on a
 * deliberate test input, so the error states can actually be seen). They have
 * the signatures the real endpoints will have, so wiring the backend later is
 * a change to this one file and nothing else — the same trick the Phase 3
 * fixtures used for the game.
 *
 * WHEN THE BACKEND EXISTS:
 *   1. replace each body with a `request(...)` call
 *   2. delete DEMO_* below
 *   3. nothing in src/pages/auth/ changes
 *
 * Nothing is persisted. Refreshing loses everything, deliberately — a fake
 * session that looked real would be worse than an obviously absent one.
 */

const STUB_DELAY_MS = 900

/** Inputs that force a failure, so the error states are reachable in the UI. */
const DEMO_TAKEN_EMAIL = 'taken@prayat.app'
const DEMO_WRONG_PASSWORD = 'wrongpassword'
const DEMO_BAD_CODE = '000000'

export class AuthError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

function wait(ms = STUB_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface AuthUser {
  email: string
  emailVerified: boolean
}

/* ---- sign in ------------------------------------------------------------- */

export async function signIn(email: string, password: string): Promise<AuthUser> {
  await wait()
  if (password === DEMO_WRONG_PASSWORD) {
    throw new AuthError('invalid_credentials', 'That email and password do not match.')
  }
  return { email, emailVerified: true }
}

/* ---- sign up ------------------------------------------------------------- */

export async function signUp(email: string, _password: string): Promise<AuthUser> {
  await wait()
  if (email.toLowerCase() === DEMO_TAKEN_EMAIL) {
    throw new AuthError('email_taken', 'An account already uses that email.')
  }
  return { email, emailVerified: false }
}

/* ---- verify email -------------------------------------------------------- */

export async function verifyEmail(email: string, code: string): Promise<AuthUser> {
  await wait()
  if (code === DEMO_BAD_CODE) {
    throw new AuthError('invalid_code', 'That code is not right. Check it and try again.')
  }
  return { email, emailVerified: true }
}

export async function resendCode(_email: string): Promise<void> {
  await wait(600)
}

/* ---- password reset ------------------------------------------------------ */

/**
 * Always resolves, even for an unknown address.
 *
 * Telling a stranger whether an email is registered hands them a way to
 * enumerate your users — which is exactly the kind of thing this app teaches
 * people to be careful about. The screen says "if that address has an account,
 * we sent a link" and means it.
 */
export async function requestPasswordReset(_email: string): Promise<void> {
  await wait()
}

export async function resetPassword(token: string, _newPassword: string): Promise<void> {
  await wait()
  if (token === 'expired') {
    throw new AuthError('token_expired', 'That reset link has expired. Request a new one.')
  }
}

/* ---- the demo inputs, for whoever is testing the screens ----------------- */

export const DEMO_INPUTS = {
  takenEmail: DEMO_TAKEN_EMAIL,
  wrongPassword: DEMO_WRONG_PASSWORD,
  badCode: DEMO_BAD_CODE,
} as const
