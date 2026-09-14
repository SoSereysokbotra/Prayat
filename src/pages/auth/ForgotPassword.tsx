import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck, Mail } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import SubmitButton from '../../components/auth/SubmitButton'
import TextField from '../../components/auth/TextField'
import { useT, useIsKhmer } from '../../hooks/useT'
import { requestPasswordReset } from '../../api/auth'
import { isEmail } from '../../lib/validate'

export default function ForgotPassword() {
  const t = useT()
  const isKhmer = useIsKhmer()

  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const emailError = !email.trim()
    ? t('errEmailRequired')
    : !isEmail(email)
      ? t('errEmailInvalid')
      : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (emailError) return

    setBusy(true)
    // Deliberately no error branch. This request succeeds whether or not the
    // address has an account — see the note in api/auth.ts.
    await requestPasswordReset(email.trim())
    setBusy(false)
    setSent(true)
  }

  const kh = isKhmer ? 'leading-kh' : ''

  /* ---- sent ----
     The confirmation never says whether the address was registered. Telling a
     stranger that would hand them a way to enumerate users — exactly the thing
     this app teaches people to be wary of. */
  if (sent) {
    return (
      <AuthShell title={t('resetLinkSentTitle')} back="/signin">
        <div className="flex flex-col items-center gap-section text-center">
          <span
            aria-hidden
            className="flex items-center justify-center rounded-card bg-safe p-section text-primary-text"
          >
            <MailCheck className="h-icon w-icon" />
          </span>

          <p className={`text-body ${kh}`}>{t('resetLinkSentBody')}</p>
          <p className="break-all text-small font-semibold">{email.trim()}</p>

          <Link
            to="/signin"
            className={`tap-target flex w-full items-center justify-center rounded-button
                        bg-primary px-section text-primary-text ${kh}`}
          >
            {t('backToSignIn')}
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title={t('forgotTitle')} subtitle={t('forgotSubtitle')} back="/signin">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-section">
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

        <SubmitButton
          label={t('sendResetLink')}
          busyLabel={t('sending')}
          busy={busy}
          disabled={submitted && Boolean(emailError)}
        />
      </form>
    </AuthShell>
  )
}
