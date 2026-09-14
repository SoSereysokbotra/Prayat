import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Globe, Languages, Search, ShieldCheck, Users, WifiOff, Zap } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import { useAuthStore } from '../store/authStore'
import type { UIKey } from '../i18n/ui'

const MODES: { title: UIKey; blurb: UIKey; image: string; icon: typeof ShieldCheck }[] = [
  { title: 'guardianMode', blurb: 'guardianModeBlurb', image: '/mode-guardian.jpg', icon: ShieldCheck },
  { title: 'speedTriage', blurb: 'speedTriageBlurb', image: '/mode-triage.jpg', icon: Zap },
  { title: 'investigation', blurb: 'investigationBlurb', image: '/mode-investigation.jpg', icon: Search },
]

/**
 * The front door for someone who is not signed in.
 *
 * One screen instead of the four-step onboarding in the design doc: what
 * Prayat is, the three ways to train, who it is for, and three ways in.
 * Guest is a real way in, not a bypass — an account wall in front of a
 * public-good product keeps it off the phones that need it most.
 *
 * `from` (set by RequireAuth) is passed along to sign-in and sign-up, so a
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
        {/* ---- what this is ---- */}
        <section>
          <h1 className={`text-title font-bold ${kh}`}>{t('welcomeHeadline')}</h1>
          <p className={`mt-stack text-body text-muted ${kh}`}>{t('welcomeBody')}</p>
        </section>

        {/* ---- the way in ---- */}
        <section className="flex flex-col gap-stack">
          <Link
            to="/signup"
            state={{ from }}
            className={`tap-target flex items-center justify-center gap-stack rounded-button bg-primary
                        px-section text-body font-semibold text-primary-text
                        transition-colors duration-option-fade ${kh}`}
          >
            {t('getStarted')}
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </Link>
          <Link
            to="/signin"
            state={{ from }}
            className={`tap-target flex items-center justify-center rounded-button border border-border bg-surface
                        px-section text-body font-semibold transition-colors duration-option-fade hover:bg-surface-alt ${kh}`}
          >
            {t('signIn')}
          </Link>
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
        </section>

        {/* ---- three ways to train ---- */}
        <section>
          <h2 className={`text-body font-bold ${kh}`}>{t('threeWays')}</h2>
          <ul className="mt-stack divide-y divide-border rounded-card border border-border bg-surface">
            {MODES.map(({ title, blurb, image }) => (
              <li key={title} className="flex items-center gap-stack p-stack">
                <img
                  src={image}
                  alt=""
                  aria-hidden
                  className="h-illustration-sm w-illustration-sm shrink-0 rounded-full object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className={`block text-body font-semibold ${kh}`}>{t(title)}</span>
                  <span className={`block text-small text-muted ${kh}`}>{t(blurb)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- who it is for ---- */}
        <section className="flex items-start gap-stack rounded-card bg-primary/10 p-stack">
          <Users aria-hidden className="h-icon w-icon shrink-0 text-primary" />
          <p className={`min-w-0 flex-1 text-body ${kh}`}>
            <span className="font-semibold">{t('forEveryone')} </span>
            <span className="text-muted">{t('forEveryoneBody')}</span>
          </p>
        </section>

        {/* ---- the small print that matters here ---- */}
        <ul className={`mt-auto flex flex-wrap justify-center gap-section text-small text-muted ${kh}`}>
          <li className="flex items-center gap-ring">
            <Languages aria-hidden className="h-icon w-icon" />
            {t('khmerAndEnglish')}
          </li>
          <li className="flex items-center gap-ring">
            <WifiOff aria-hidden className="h-icon w-icon" />
            {t('worksOffline')}
          </li>
          <li className="flex items-center gap-ring">
            <Globe aria-hidden className="h-icon w-icon" />
            {t('noAppStore')}
          </li>
        </ul>
      </div>
    </main>
  )
}
