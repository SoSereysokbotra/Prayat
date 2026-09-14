import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Search, Zap, type LucideIcon } from 'lucide-react'
import LanguageToggle from '../components/LanguageToggle'
import { useT, useIsKhmer } from '../hooks/useT'
import type { UIKey } from '../i18n/ui'

/**
 * The two locked modes land here.
 *
 * Small on purpose. It exists so the locked cards on Home go somewhere real —
 * a card that promises a mode and then does nothing is worse than no card.
 */

const MODES: Record<string, { icon: LucideIcon; title: UIKey; blurb: UIKey; meta: string }> = {
  'speed-triage': { icon: Zap, title: 'speedTriage', blurb: 'speedTriageBlurb', meta: '2' },
  investigation: { icon: Search, title: 'investigation', blurb: 'investigationBlurb', meta: '7' },
}

export default function ComingSoon() {
  const { mode } = useParams<{ mode: string }>()
  const t = useT()
  const isKhmer = useIsKhmer()

  const config = mode ? MODES[mode] : undefined

  // An unknown mode is a broken link, not an error screen. Go home.
  if (!config) return <Navigate to="/" replace />

  const Icon = config.icon
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-screen-x py-section">
      <header className="flex items-center justify-between gap-stack">
        <Link
          to="/"
          className="tap-target flex items-center gap-stack rounded-button px-stack text-small
                     text-muted transition-colors duration-option-fade hover:text-text"
        >
          <ArrowLeft aria-hidden className="h-icon w-icon" />
          <span className={kh}>{t('back')}</span>
        </Link>
        <LanguageToggle />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-stack text-center">
        <span
          aria-hidden
          className="flex items-center justify-center rounded-card bg-surface-alt p-section text-muted"
        >
          <Icon className="h-icon w-icon" />
        </span>

        <h1 className={`text-title font-semibold ${kh}`}>{t(config.title)}</h1>

        <span className="rounded-button bg-surface-alt px-stack py-stack text-small text-muted">
          <span className={kh}>{t('comingSoon')}</span>
        </span>

        <p className={`max-w-screen-sm text-body text-muted ${kh}`}>{t(config.blurb)}</p>

        <p className={`text-small text-muted ${kh}`}>
          {config.meta} {t('minutes')}
        </p>

        <p className={`mt-section text-small text-muted ${kh}`}>{t('comingSoonBody')}</p>

        <Link
          to="/guardian"
          className={`tap-target mt-stack flex items-center rounded-button bg-primary px-section
                      text-primary-text transition-colors duration-option-fade ${kh}`}
        >
          {t('guardianMode')}
        </Link>
      </section>
    </main>
  )
}
