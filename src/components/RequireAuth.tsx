import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * The route guard.
 *
 * Anything wrapped in this sends a signed-out visitor to /signin first, and
 * remembers where they were going so they land there afterwards rather than
 * being dumped on the home screen.
 *
 * `replace` matters: without it the guarded URL stays in history, so pressing
 * back from sign-in returns to a page that immediately redirects again, and
 * the player is stuck in a loop they cannot back out of.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session)
  const ready = useAuthStore((s) => s.ready)
  const location = useLocation()

  // Never redirect before the stored session has been read.
  if (!ready) return null

  if (!session) {
    return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />
  }

  return <>{children}</>
}
