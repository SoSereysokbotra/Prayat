import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * The inverse guard, for the auth screens.
 *
 * Someone already signed in has no business on /signin. Without this, the back
 * button after signing in lands on the sign-in form again, which reads as
 * though the sign-in did not work.
 *
 * It honours the same `from` the route guard set, and that is not optional.
 * Signing in sets the session while still on /signin, which re-renders this
 * component — so this redirect fires BEFORE the sign-in handler's own
 * navigate() and wins the race. If it sent everyone to "/" it would silently
 * throw away the page the player was trying to reach, and the only symptom
 * would be landing on the home screen for no visible reason.
 *
 * Password reset is deliberately NOT wrapped in this: a signed-in person
 * following a reset link from their email must still be able to reach it.
 */
export default function RedirectIfSignedIn({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session)
  const ready = useAuthStore((s) => s.ready)
  const location = useLocation()

  if (!ready) return null

  if (session) {
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}
