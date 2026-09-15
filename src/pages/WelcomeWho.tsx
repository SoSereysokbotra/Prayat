import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Landmark, MapPin, UserRound, Users } from 'lucide-react'
import OnboardingDots from '../components/OnboardingDots'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import type { UIKey } from '../i18n/ui'

const AUDIENCES: { title: UIKey; body: UIKey; image: string; icon: typeof UserRound }[] = [
  { title: 'whoYou', body: 'whoYouBody', image: '/welcome-who-1.jpg', icon: UserRound },
  { title: 'whoParents', body: 'whoParentsBody', image: '/welcome-who-2.jpg', icon: Users },
  { title: 'whoSchools', body: 'whoSchoolsBody', image: '/welcome-who-3.jpg', icon: Landmark },
]

/**
 * Walkthrough, screen 3: who it is for.
 *
 * Three audiences and the line that separates this from a generic quiz:
 * every scenario is built from tactics actually used on Telegram, Facebook
 * and Wing in Cambodia. NEXT continues to sign-up, still carrying `from`.
 */
export default function WelcomeWho() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/welcome/how-it-works" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <section>
          <h1 className={`text-title font-bold ${kh}`}>{t('whoIsItFor')}</h1>
          <p className={`text-body text-muted ${kh}`}>{t('whoIsItForSub')}</p>
        </section>

        <ul className="flex flex-col gap-stack">
          {AUDIENCES.map(({ title, body, image, icon: Icon }) => (
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

        {/* ---- why Cambodia specifically ---- */}
        <aside className="flex items-center gap-stack rounded-card border border-safe bg-safe/10 p-stack">
          <img src="/welcome-who-4.jpg" alt="" aria-hidden className="h-illustration w-illustration shrink-0 rounded-full object-cover" />
          <p className={`min-w-0 flex-1 border-l border-safe/40 pl-stack text-small ${kh}`}>
            <MapPin aria-hidden className="mr-ring inline h-icon w-icon text-safe" />
            <span className="font-semibold text-safe">{t('builtForCambodia')} — </span>
            {t('builtForCambodiaBody')}
          </p>
        </aside>

        <div className="mt-auto flex flex-col gap-stack">
          <Link
            to="/welcome/install"
            state={{ from }}
            className={`tap-target flex items-center justify-center gap-stack rounded-button bg-primary
                        px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
          >
            {t('thatsMeNext')}
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </Link>
          <OnboardingDots current={3} />
        </div>
      </div>
    </main>
  )
}
