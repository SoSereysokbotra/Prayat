import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, Check, Lock } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import SubmitButton from '../../components/auth/SubmitButton'
import TextField from '../../components/auth/TextField'
import { useT, useIsKhmer } from '../../hooks/useT'
import { AuthError, resetPassword } from '../../api/auth'
import { isStrongEnough } from '../../lib/validate'

export default function ResetPassword() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const [params] = useSearchParams()
  // The token arrives in the emailed link. Absent, the stub still runs — the
  // real endpoint will reject it, and the expired-token error state is
  // reachable here with ?token=expired.
  const token = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const passwordError = !password
    ? t('errPasswordRequired')
    : !isStrongEnough(password)
      ? t('errPasswordShort')
      : null
  const confirmError = confirm !== password ? t('errPasswordMismatch') : null
  const valid = !passwordError && !confirmError

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setFormError(null)
    if (!valid) return

    setBusy(true)
    try {
      await resetPassword(token, password)
      setDone(true)
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const kh = isKhmer ? 'leading-kh' : ''

  if (done) {
    return (
      <AuthShell title={t('resetDoneTitle')}>
        <div className="flex flex-col items-center gap-section text-center">
          <span
            aria-hidden
            className="flex items-center justify-center rounded-card bg-safe p-section text-primary-text"
          >
            <Check className="h-icon w-icon" />
          </span>

          <p className={`text-body ${kh}`}>{t('resetDoneBody')}</p>

          <Link
            to="/signin"
            className={`tap-target flex w-full items-center justify-center rounded-button
                        bg-primary px-section text-primary-text ${kh}`}
          >
            {t('signIn')}
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title={t('resetTitle')} subtitle={t('resetSubtitle')} back="/signin">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-section">
        {formError && (
          <p
            role="alert"
            className={`flex items-start gap-stack rounded-card border border-danger
                        bg-surface p-stack text-small text-danger ${kh}`}
          >
            <AlertCircle aria-hidden className="h-icon w-icon shrink-0" />
            <span className="min-w-0 flex-1">{formError}</span>
          </p>
        )}

        <div className="flex flex-col gap-stack">
          <TextField
            label={t('newPasswordLabel')}
            value={password}
            onChange={setPassword}
            type="password"
            icon={Lock}
            autoComplete="new-password"
            revealLabel={t('showPassword')}
            hint={t('passwordHint')}
            disabled={busy}
            error={submitted ? (passwordError ?? undefined) : undefined}
          />

          <TextField
            label={t('confirmPasswordLabel')}
            value={confirm}
            onChange={setConfirm}
            type="password"
            icon={Lock}
            autoComplete="new-password"
            revealLabel={t('showPassword')}
            disabled={busy}
            // Shown as soon as the two diverge, not held until submit: a
            // mismatch is obvious the moment it happens and waiting to say so
            // wastes the player's next keystroke.
            error={confirm && confirmError ? confirmError : undefined}
          />
        </div>

        <SubmitButton
          label={t('resetAction')}
          busyLabel={t('resetting')}
          busy={busy}
          disabled={submitted && !valid}
        />
      </form>
    </AuthShell>
  )
}
