import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Lock, Mail } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import SubmitButton from '../../components/auth/SubmitButton'
import TextField from '../../components/auth/TextField'
import { useT, useIsKhmer } from '../../hooks/useT'
import { AuthError, signUp } from '../../api/auth'
import { isEmail, isStrongEnough } from '../../lib/validate'

export default function SignUp() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const emailError = !email.trim()
    ? t('errEmailRequired')
    : !isEmail(email)
      ? t('errEmailInvalid')
      : null
  const passwordError = !password
    ? t('errPasswordRequired')
    : !isStrongEnough(password)
      ? t('errPasswordShort')
      : null
  const valid = !emailError && !passwordError

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setFormError(null)
    if (!valid) return

    setBusy(true)
    try {
      await signUp(email.trim(), password)
      // The address is carried in the URL rather than in state, so a refresh
      // on the verify screen does not strand the player with no way back.
      navigate(`/verify?email=${encodeURIComponent(email.trim())}`, { replace: true })
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <AuthShell
      title={t('signUpTitle')}
      subtitle={t('signUpSubtitle')}
      back="/signin"
      footer={
        <div className="flex flex-col gap-stack">
          <p className={`text-center text-small text-muted ${kh}`}>{t('alreadyHaveAccount')}</p>
          <Link
            to="/signin"
            className={`tap-target flex w-full items-center justify-center rounded-button
                        border border-border bg-surface px-section font-semibold
                        transition-colors duration-option-fade hover:bg-surface-alt ${kh}`}
          >
            {t('signIn')}
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
            autoComplete="new-password"
            revealLabel={t('showPassword')}
            hint={t('passwordHint')}
            disabled={busy}
            error={submitted ? (passwordError ?? undefined) : undefined}
          />
        </div>

        <SubmitButton
          label={t('signUp')}
          busyLabel={t('signingUp')}
          busy={busy}
          disabled={submitted && !valid}
        />
      </form>
    </AuthShell>
  )
}
