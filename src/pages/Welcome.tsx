import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Ban, MessageSquareReply, Smartphone, TriangleAlert, Users } from 'lucide-react'
import OnboardingDots from '../components/OnboardingDots'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import { useAuthStore } from '../store/authStore'
import type { UIKey } from '../i18n/ui'

const FEATURES: { title: UIKey; body: UIKey; image: string; icon: typeof Smartphone }[] = [
  { title: 'featScenarios', body: 'featScenariosBody', image: '/welcome-feature-1.jpg', icon: Smartphone },
  { title: 'featPushback', body: 'featPushbackBody', image: '/welcome-feature-2.jpg', icon: MessageSquareReply },
  { title: 'featFamily', body: 'featFamilyBody', image: '/welcome-feature-3.jpg', icon: Users },
]

/**
 * Walkthrough, screen 1: the front door for someone who is not signed in.
 *
 * Same skeleton as the other three screens — title block, cards with round
 * art, one primary button, dots — so the four read as one sequence. Leads
 * with a real-looking scam SMS, because the product is easier to show than
 * to describe.
 *
 * Guest is a real way in, not a bypass — an account wall in front of a
 * public-good product keeps it off the phones that need it most.
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

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <section>
          <h1 className={`text-title font-bold ${kh}`}>{t('welcomeHeadline')}</h1>
          <p className={`text-body text-muted ${kh}`}>{t('welcomeBody')}</p>
        </section>

        {/* ---- the product, by example ---- */}
        <section aria-label={t('sampleScamLabel')} className="rounded-card border border-border bg-surface p-stack">
          <div className="relative">
            <div
              aria-hidden
              className={`rounded-bubble border border-danger/40 bg-bubble-scammer p-stack pr-wordmark text-small ${kh}`}
            >
              <p className="flex items-start gap-stack">
                <TriangleAlert className="h-icon w-icon shrink-0 text-danger" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{t('sampleScamBody')}</span>
                  <span className="block text-danger">{t('sampleScamLink')}</span>
                </span>
              </p>
            </div>
            <Ban
              aria-hidden
              className="absolute -right-ring -top-ring h-wordmark w-wordmark rounded-full bg-surface p-ring text-danger"
            />
          </div>
          <p className={`mt-stack text-small font-semibold text-primary ${kh}`}>{t('teachesYouToCatchThis')}</p>
        </section>

        {/* ---- what it does ---- */}
        <ul className="flex flex-col gap-stack">
          {FEATURES.map(({ title, body, image, icon: Icon }) => (
            <li key={title} className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
              <img src={image} alt="" aria-hidden className="h-illustration w-illustration shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <h2 className={`flex items-center gap-stack text-body font-bold ${kh}`}>
                  <span
                    aria-hidden
                    className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                  >
                    <Icon className="h-icon w-icon" />
                  </span>
                  {t(title)}
                </h2>
                <p className={`mt-ring text-small text-muted ${kh}`}>{t(body)}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ---- the way in ---- */}
        <div className="mt-auto flex flex-col items-center gap-stack">
          <Link
            to="/welcome/how-it-works"
            state={{ from }}
            className={`tap-target flex w-full items-center justify-center gap-stack rounded-button bg-primary
                        px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
          >
            {t('getStarted')}
            <span className="font-normal">— {t('itsFree')}</span>
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </Link>

          <p className={`text-small text-muted ${kh}`}>
            {t('alreadyHaveAccount')}{' '}
            <Link to="/signin" state={{ from }} className="font-semibold text-primary underline">
              {t('signIn')}
            </Link>
          </p>

          <button
            type="button"
            onClick={() => {
              continueAsGuest()
              navigate(from, { replace: true })
            }}
            className={`tap-target flex items-center justify-center rounded-button px-section text-small text-muted ${kh}`}
          >
            {t('continueWithoutAccount')}
          </button>

          <OnboardingDots current={1} />
        </div>
      </div>
    </main>
  )
}
