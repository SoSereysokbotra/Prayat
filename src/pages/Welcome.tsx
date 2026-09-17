import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, CornerDownRight } from 'lucide-react'
import OnboardingDots from '../components/OnboardingDots'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import { useAuthStore } from '../store/authStore'
import type { UIKey } from '../i18n/ui'

const FEATURES: { title: UIKey; body: UIKey; image: string }[] = [
  { title: 'featScenarios', body: 'featScenariosBody', image: '/welcome-feature-1.jpg' },
  { title: 'featPushback', body: 'featPushbackBody', image: '/welcome-feature-2.jpg' },
  { title: 'featFamily', body: 'featFamilyBody', image: '/welcome-feature-3.jpg' },
]

/** The three things a first-time visitor wants settled before they tap. */
const TRUST: UIKey[] = ['trustFree', 'trustNoAccount', 'trustBilingual']

/**
 * Walkthrough, screen 1: the front door for someone who is not signed in.
 *
 * Same skeleton as the other three screens — title block, cards with round
 * art, one primary button, dots — so the four read as one sequence. Leads
 * with a real-looking scam SMS drawn the way the phone would draw it,
 * because the product is easier to show than to describe.
 *
 * Guest is a real way in, not a bypass — an account wall in front of a
 * public-good product keeps it off the phones that need it most. That is
 * why it gets a proper button and not a footnote.
 *
 * `from` (set by RequireAuth) is passed along the whole walkthrough, so a
 * shared link to a scenario still lands on that scenario afterwards.
 */
export default function Welcome() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const location = useLocation()
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest)

  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const kh = isKhmer ? 'leading-kh' : ''
  // Letter-spacing tricks are Latin tricks; Khmer glyphs need their own room.
  const caps = isKhmer ? '' : 'uppercase tracking-wider'
  const sender = t('sampleScamSender')

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <section>
          <h1 className={`text-title font-bold ${isKhmer ? kh : 'tracking-tight'}`}>{t('welcomeHeadline')}</h1>
          <p className={`mt-ring text-body text-muted ${kh}`}>{t('welcomeBody')}</p>
        </section>

        {/* ---- the product, by example ---- */}
        <section aria-label={t('sampleScamLabel')} className="rounded-card border border-border bg-surface p-stack shadow-card">
          {/* An SMS the way the phone shows it: sender row, then the message. */}
          <div aria-hidden className="relative rounded-bubble border border-border bg-surface-alt p-stack">
            <div className="flex items-center gap-stack pr-wordmark">
              <span className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-chrome-sms text-small font-bold text-primary-text">
                {sender.charAt(0)}
              </span>
              <span className="min-w-0 flex-1 truncate text-small font-semibold">{sender}</span>
            </div>
            <p className={`mt-stack text-small ${kh}`}>
              <span className="block">{t('sampleScamBody')}</span>
              <span className="block font-semibold text-danger underline decoration-danger/40 underline-offset-2">
                {t('sampleScamLink')}
              </span>
            </p>
            {/* The verdict, stamped on the corner. */}
            <span
              className={`absolute -right-ring -top-stack rotate-6 rounded-button border-2 border-danger bg-surface
                          px-stack py-ring text-small font-bold text-danger shadow-card ${caps} ${kh}`}
            >
              {t('verdictScam')}
            </span>
          </div>
          <p className={`mt-stack flex items-center gap-stack text-small font-semibold text-primary ${kh}`}>
            <CornerDownRight aria-hidden className="h-icon w-icon shrink-0" />
            {t('teachesYouToCatchThis')}
          </p>
        </section>

        {/* ---- what it does ---- */}
        <section>
          <h2 className={`mb-stack text-small font-semibold text-muted ${caps} ${kh}`}>{t('welcomeFeaturesHeading')}</h2>
          <ul className="flex flex-col gap-stack">
            {FEATURES.map(({ title, body, image }) => (
              <li key={title} className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack shadow-card">
                <img
                  src={image}
                  alt=""
                  aria-hidden
                  className="h-illustration-sm w-illustration-sm shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className={`text-body font-bold ${kh}`}>{t(title)}</h3>
                  <p className={`mt-ring text-small text-muted ${kh}`}>{t(body)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- the way in ---- */}
        <div className="mt-auto flex flex-col gap-stack">
          <ul className={`flex flex-wrap items-center justify-center gap-x-stack gap-y-ring text-small text-muted ${kh}`}>
            {TRUST.map((key) => (
              <li key={key} className="flex items-center gap-ring">
                <Check aria-hidden className="h-icon w-icon text-safe" />
                {t(key)}
              </li>
            ))}
          </ul>

          <Link
            to="/welcome/how-it-works"
            state={{ from }}
            className={`tap-target flex h-field w-full items-center justify-center gap-stack rounded-button bg-primary
                        px-section text-body font-bold text-primary-text shadow-cta transition-colors duration-option-fade
                        hover:bg-primary/90 ${kh}`}
          >
            {t('getStarted')}
            <span className="font-normal">— {t('itsFree')}</span>
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </Link>

          <button
            type="button"
            onClick={() => {
              continueAsGuest()
              navigate('/bootcamp', { replace: true })
            }}
            className={`tap-target flex h-field w-full items-center justify-center rounded-button border border-border bg-surface
                        px-section text-body font-semibold text-text transition-colors duration-option-fade hover:bg-surface-alt ${kh}`}
          >
            {t('continueWithoutAccount')}
          </button>

          <p className={`flex items-center justify-center text-small text-muted ${kh}`}>
            {t('alreadyHaveAccount')}
            <Link
              to="/signin"
              state={{ from }}
              className="tap-target inline-flex items-center px-stack font-semibold text-primary underline underline-offset-2"
            >
              {t('signIn')}
            </Link>
          </p>

          <OnboardingDots current={1} />
        </div>
      </div>
    </main>
  )
}
