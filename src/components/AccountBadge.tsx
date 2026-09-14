import { LogOut, User, UserCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT, useIsKhmer } from '../hooks/useT'
import { useAuthStore } from '../store/authStore'

/**
 * Who you are, and the way out.
 *
 * Without a visible sign-out there is no way to leave a session except
 * clearing site data — and on a shared phone, which is common here, that
 * matters more than it would elsewhere.
 *
 * A guest sees an invitation to create an account rather than a sign-out, so
 * the upgrade path is where they already are instead of hidden behind a menu.
 */
export default function AccountBadge() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const session = useAuthStore((s) => s.session)
  const signOut = useAuthStore((s) => s.signOut)

  if (!session) return null

  const kh = isKhmer ? 'leading-kh' : ''

  if (session.kind === 'guest') {
    return (
      <div className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
        <User aria-hidden className="h-icon w-icon shrink-0 text-muted" />
        <span className={`min-w-0 flex-1 truncate text-small text-muted ${kh}`}>
          {t('playingAsGuest')}
        </span>
        <Link
          to="/signup"
          className={`tap-target flex shrink-0 items-center rounded-button bg-primary px-stack
                      text-small font-semibold text-primary-text ${kh}`}
        >
          {t('signUp')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
      <UserCircle aria-hidden className="h-icon w-icon shrink-0 text-muted" />
      <span className="min-w-0 flex-1 truncate text-small">{session.email}</span>
      <button
        type="button"
        onClick={signOut}
        aria-label={t('signOut')}
        className="tap-target flex shrink-0 items-center justify-center rounded-button text-muted"
      >
        <LogOut aria-hidden className="h-icon w-icon" />
      </button>
    </div>
  )
}
