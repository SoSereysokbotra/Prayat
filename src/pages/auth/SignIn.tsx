import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Lock, Mail } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import SubmitButton from '../../components/auth/SubmitButton'
import TextField from '../../components/auth/TextField'
import { useT, useIsKhmer } from '../../hooks/useT'
import { AuthError, signIn } from '../../api/auth'
import { isEmail } from '../../lib/validate'

export default function SignIn() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  // Field errors appear only after a submit attempt. Marking a field red while
  // someone is still typing their first character is nagging, not helping.
  const [submitted, setSubmitted] = useState(false)

  const emailError = !email.trim()
    ? t('errEmailRequired')
    : !isEmail(email)
      ? t('errEmailInvalid')
      : null
  const passwordError = !password ? t('errPasswordRequired') : null
  const valid = !emailError && !passwordError

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setFormError(null)
    if (!valid) return

    setBusy(true)
    try {
      await signIn(email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <AuthShell
      title={t('signInTitle')}
      subtitle={t('signInSubtitle')}
      footer={
        <div className="flex flex-col gap-stack">
          {/* A secondary button, not an inline link. An inline link renders
              16px tall — a third of the 44px floor — and switching between
              sign in and sign up is a primary journey, not a footnote. */}
          <p className={`text-center text-small text-muted ${kh}`}>{t('noAccountYet')}</p>
          <Link
            to="/signup"
            className={`tap-target flex w-full items-center justify-center rounded-button
                        border border-border bg-surface px-section font-semibold
                        transition-colors duration-option-fade hover:bg-surface-alt ${kh}`}
          >
            {t('signUp')}
          </Link>
          <Link
            to="/"
            className={`tap-target flex items-center justify-center rounded-button
                        text-small text-muted ${kh}`}
          >
            {t('continueWithoutAccount')}
          </Link>
        </div>
      }
    >
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
            label={t('emailLabel')}
            value={email}
            onChange={setEmail}
            type="email"
            inputMode="email"
            icon={Mail}
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            disabled={busy}
            error={submitted ? (emailError ?? undefined) : undefined}
          />

          <TextField
            label={t('passwordLabel')}
            value={password}
            onChange={setPassword}
            type="password"
            icon={Lock}
            autoComplete="current-password"
            revealLabel={t('showPassword')}
            disabled={busy}
            error={submitted ? (passwordError ?? undefined) : undefined}
          />
        </div>

        <div className="flex flex-col gap-stack">
          <SubmitButton
            label={t('signIn')}
            busyLabel={t('signingIn')}
            busy={busy}
            disabled={submitted && !valid}
          />
          <Link
            to="/forgot-password"
            className={`tap-target flex items-center justify-center rounded-button
                        text-small text-muted ${kh}`}
          >
            {t('forgotPassword')}
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}
