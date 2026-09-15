import { Navigate, useLocation } from 'react-router-dom'
import { useBootcampAccessible } from '../store/bootcampStore'

/**
 * Level 0 is a prerequisite, so the game modes stay shut until it is passed
 * or explicitly skipped.
 *
 * This sits INSIDE RequireAuth, not beside it: someone signed out who opens
 * /guardian should meet sign-in first and the bootcamp second, rather than
 * being sent to a bootcamp they cannot save the result of.
 */
export default function RequireBootcamp({ children }: { children: React.ReactNode }) {
  const accessible = useBootcampAccessible()
  const location = useLocation()

  if (!accessible) {
    return (
      <Navigate to="/bootcamp" replace state={{ from: location.pathname + location.search }} />
    )
  }

  return <>{children}</>
}
