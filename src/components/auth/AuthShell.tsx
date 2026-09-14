import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LanguageToggle from '../LanguageToggle'
import { useT, useIsKhmer } from '../../hooks/useT'

/**
 * The frame every auth screen sits in.
 *
 * One layout for all five means the wordmark, the back control and the
 * language toggle never move between screens — so a player moving from sign-in
 * to sign-up to verification is not re-learning where things are at every step.
 */
export default function AuthShell({
  title,
  subtitle,
  back,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  /** Where the back arrow goes. Omitted on the entry screen. */
  back?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <main className="screen-in mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col px-screen-x py-section">
      <header className="flex shrink-0 items-center justify-between gap-stack">
        {back ? (
          <Link
            to={back}
            className="tap-target flex items-center gap-stack rounded-button text-small text-muted"
          >
            <ArrowLeft aria-hidden className="h-icon w-icon" />
            <span className={kh}>{t('back')}</span>
          </Link>
        ) : (
          <span className="text-title font-bold tracking-tight">Prayat</span>
        )}
        <LanguageToggle />
      </header>

      <div className="flex flex-1 flex-col justify-center gap-section py-section">
        <div className="flex flex-col gap-stack">
          <h1 className={`text-title font-semibold ${kh}`}>{title}</h1>
          {subtitle && <p className={`text-body text-muted ${kh}`}>{subtitle}</p>}
        </div>

        {children}
      </div>

      {footer && <div className="shrink-0">{footer}</div>}
    </main>
  )
}
