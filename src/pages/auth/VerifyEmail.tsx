import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, MailCheck } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import CodeInput from '../../components/auth/CodeInput'
import SubmitButton from '../../components/auth/SubmitButton'
import { useT, useIsKhmer } from '../../hooks/useT'
import { AuthError, resendCode, verifyEmail } from '../../api/auth'

const CODE_LENGTH = 6
const RESEND_COOLDOWN_SECONDS = 30

export default function VerifyEmail() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const email = params.get('email') ?? ''

  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [resent, setResent] = useState(false)
  // A cooldown, because a button that can be hammered will be hammered, and
  // each press is an email.
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const complete = code.length === CODE_LENGTH

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setFormError(null)
    if (!complete) return

    setBusy(true)
    try {
      await verifyEmail(email, code)
      navigate('/', { replace: true })
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong.')
      setCode('')
    } finally {
      setBusy(false)
    }
  }

  async function handleResend() {
    setResent(false)
    setFormError(null)
    setCooldown(RESEND_COOLDOWN_SECONDS)
    await resendCode(email)
    setResent(true)
  }

  // Landing here with no address is not a state worth explaining.
  if (!email) return <Navigate to="/signup" replace />

  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <AuthShell title={t('verifyTitle')} back="/signup">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-section">
        <div className="flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
          <MailCheck aria-hidden className="h-icon w-icon shrink-0 text-primary" />
          <p className={`min-w-0 flex-1 text-small ${kh}`}>
            <span className="text-muted">{t('verifySubtitle')}</span>
            <br />
            <span className="break-all font-semibold">{email}</span>
          </p>
        </div>

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
          <CodeInput
            label={t('verifyCodeLabel')}
            value={code}
            onChange={(v) => {
              setCode(v)
              setFormError(null)
            }}
            length={CODE_LENGTH}
            error={Boolean(formError) || (submitted && !complete)}
            disabled={busy}
          />
          {submitted && !complete && !formError && (
            <p className={`text-small text-danger ${kh}`}>{t('errCodeIncomplete')}</p>
          )}
        </div>

        <SubmitButton
          label={t('verifyAction')}
          busyLabel={t('verifying')}
          busy={busy}
          disabled={submitted && !complete}
        />

        <div className={`flex flex-col items-center gap-stack text-small ${kh}`}>
          <span className="text-muted">{t('didNotGetCode')}</span>
          {cooldown > 0 ? (
            <span className="text-muted tabular-nums">
              {t('resendIn')} {cooldown} {t('seconds')}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="tap-target font-semibold text-primary"
            >
              {t('resendCode')}
            </button>
          )}
          {resent && cooldown > 0 && <span className="text-safe">{t('codeResent')}</span>}
        </div>
      </form>
    </AuthShell>
  )
}
