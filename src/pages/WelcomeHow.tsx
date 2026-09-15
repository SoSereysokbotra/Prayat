import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import BrandMark from '../components/BrandMark'
import OnboardingDots from '../components/OnboardingDots'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import type { UIKey } from '../i18n/ui'

const STEPS: { title: UIKey; body: UIKey; image: string }[] = [
  { title: 'howStep1', body: 'howStep1Body', image: '/welcome-how-step-1.jpg' },
  { title: 'howStep2', body: 'howStep2Body', image: '/welcome-how-step-2.jpg' },
  { title: 'howStep3', body: 'howStep3Body', image: '/welcome-how-step-3.jpg' },
]

/**
 * Walkthrough, screen 2: how it works.
 *
 * Three steps — a scam arrives, you decide, you see what happens — and the
 * one sentence the whole product rests on. NEXT continues to sign-up,
 * still carrying `from` so a shared link lands where it pointed.
 */
export default function WelcomeHow() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/welcome" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        {/* ---- heading beside the hero art ---- */}
        <section className="flex items-center gap-stack">
          <img src="/welcome-how-hero.jpg" alt="" aria-hidden className="w-illustration shrink-0 rounded-card object-cover" />
          <div className="min-w-0">
            <h1 className={`text-title font-bold ${kh}`}>{t('howItWorks')}</h1>
            <p className={`text-body text-muted ${kh}`}>{t('howItWorksSub')}</p>
          </div>
        </section>

        {/* ---- the three steps ---- */}
        <ol className="flex flex-col gap-stack">
          {STEPS.map(({ title, body, image }, i) => (
            <li key={title} className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
              <img src={image} alt="" aria-hidden className="h-illustration w-illustration shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <h2 className={`flex items-center gap-stack text-body font-bold ${kh}`}>
                  <span
                    aria-hidden
                    className="flex h-icon w-icon shrink-0 items-center justify-center rounded-full bg-primary text-small text-primary-text"
                  >
                    {i + 1}
                  </span>
                  {t(title)}
                </h2>
                <p className={`mt-ring text-small text-muted ${kh}`}>{t(body)}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* ---- the one sentence ---- */}
        <blockquote className="flex items-center gap-stack rounded-card bg-primary/10 p-stack">
          <BrandMark className="h-wordmark w-wordmark shrink-0" />
          <p className={`min-w-0 flex-1 border-l border-primary/30 pl-stack text-body font-semibold ${kh}`}>
            <Quote aria-hidden className="mr-ring inline h-icon w-icon text-primary/50" />
            {t('howQuote')}
          </p>
        </blockquote>

        <div className="mt-auto flex flex-col gap-stack">
          <Link
            to="/welcome/who-is-it-for"
            state={{ from }}
            className={`tap-target flex items-center justify-center gap-stack rounded-button bg-primary
                        px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
          >
            {t('next')}
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </Link>
          <OnboardingDots current={2} />
        </div>
      </div>
    </main>
  )
}
