import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Download, Info, Lock, Plus, Share, Smartphone, WifiOff, Zap } from 'lucide-react'
import OnboardingDots from '../components/OnboardingDots'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import { useAuthStore } from '../store/authStore'
import { canPromptInstall, isInstalled, isIOS, onInstallChange, promptInstall } from '../lib/installPrompt'
import type { UIKey } from '../i18n/ui'

const PERKS: { text: UIKey; icon: typeof WifiOff }[] = [
  { text: 'perkOffline', icon: WifiOff },
  { text: 'perkFast', icon: Zap },
  { text: 'perkPrivate', icon: Lock },
  { text: 'perkPlatforms', icon: Smartphone },
]

/**
 * Walkthrough, screen 4: add to home screen.
 *
 * The button only claims what the browser can do: on Android/Chrome it
 * shows the real install prompt; on iOS there is no prompt API, so it
 * points at the Share → Add to Home Screen route; already installed, it
 * just says so. Install is a convenience, not a gate — and neither is an
 * account: the big button starts Level 0 as a guest.
 */
export default function WelcomeInstall() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest)
  const kh = isKhmer ? 'leading-kh' : ''

  const [, rerender] = useState(0)
  useEffect(() => onInstallChange(() => rerender((n) => n + 1)), [])

  const installed = isInstalled()
  const ios = isIOS()
  const canPrompt = canPromptInstall()

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/welcome/who-is-it-for" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <section className="flex items-center gap-stack">
          <img src="/welcome-install-hero.jpg" alt="" aria-hidden className="w-illustration shrink-0 rounded-card object-cover" />
          <div className="min-w-0">
            <h1 className={`text-title font-bold ${kh}`}>{t('addToHomeScreen')}</h1>
            <p className={`mt-ring text-small text-muted ${kh}`}>{t('addToHomeScreenBody')}</p>
          </div>
        </section>

        <ul className="flex flex-col gap-stack rounded-card bg-primary/10 p-stack">
          {PERKS.map(({ text, icon: Icon }) => (
            <li key={text} className={`flex items-center gap-stack text-body font-semibold ${kh}`}>
              <span aria-hidden className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                <Icon className="h-icon w-icon" />
              </span>
              {t(text)}
            </li>
          ))}
        </ul>

        {/* iPhone has no install prompt; show the manual route instead. */}
        {!installed && (ios || !canPrompt) && (
          <aside className="flex items-center gap-stack rounded-card border border-primary/40 bg-surface p-stack">
            <span aria-hidden className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-primary text-primary-text">
              <Info className="h-icon w-icon" />
            </span>
            <p className={`min-w-0 flex-1 text-small ${kh}`}>
              <span className="block font-semibold">{ios ? t('forIphoneUsers') : t('forThisBrowser')}</span>
              <span className="text-muted">{t('shareThenAdd')}</span>
            </p>
            <span aria-hidden className="flex shrink-0 items-center gap-ring rounded-button border border-border px-stack py-ring text-primary">
              <Share className="h-icon w-icon" />→<Plus className="h-icon w-icon rounded-button bg-primary text-primary-text" />
            </span>
          </aside>
        )}

        <div className="mt-auto flex flex-col items-center gap-stack">
          {installed ? (
            <p className={`text-body font-semibold text-safe ${kh}`}>{t('alreadyInstalled')}</p>
          ) : (
            canPrompt && (
              <button
                type="button"
                onClick={() => void promptInstall()}
                className={`tap-target flex w-full items-center justify-center gap-stack rounded-button border border-primary
                            bg-surface px-section text-body font-semibold text-primary transition-colors duration-option-fade ${kh}`}
              >
                <Download aria-hidden className="h-icon w-icon" />
                {t('installPrayat')}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => {
              continueAsGuest()
              navigate('/bootcamp', { replace: true })
            }}
            className={`tap-target flex w-full items-center justify-center gap-stack rounded-button bg-primary
                        px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
          >
            {t('startAsGuest')}
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </button>
          <Link to="/signup" className={`tap-target flex items-center justify-center rounded-button px-section text-center text-small text-muted underline ${kh}`}>
            {t('createAccountOptional')}
          </Link>
          <OnboardingDots current={4} />
        </div>
      </div>
    </main>
  )
}
