import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Gift, Lock } from 'lucide-react'
import TopBar from '../../components/TopBar'
import { useT, useIsKhmer } from '../../hooks/useT'
import { useBootcampStore } from '../../store/bootcampStore'
import { BOOTCAMP_MODULE_IDS } from '../../../shared/types'
import type { UIKey } from '../../i18n/ui'

const TOOLS: { name: UIKey; image: string }[] = [
  { name: 'toolShieldBadge', image: '/bootcamp-tool-shield.jpg' },
  { name: 'toolAuthenticator', image: '/bootcamp-tool-token.jpg' },
  { name: 'toolMagnifier', image: '/bootcamp-tool-magnifier.jpg' },
]

/**
 * Level 0 — the entry to the bootcamp.
 *
 * Framed as the start of the game, not a gate before it: a Level 0 badge
 * opens the sheet, the three tools are shown locked so the player sees
 * what they are playing for, and Skip is there but says plainly what it
 * costs. Same banner-and-sheet layout as the welcome walkthrough and the
 * Triage how-to.
 */
export default function Bootcamp() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const location = useLocation()

  const passed = useBootcampStore((s) => s.passed)
  const skip = useBootcampStore((s) => s.skip)

  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const kh = isKhmer ? 'leading-kh' : ''

  /** Resume at the first module not yet passed; from the top if all are. */
  const handleBegin = () => {
    const next = BOOTCAMP_MODULE_IDS.find((id) => !passed.includes(id)) ?? BOOTCAMP_MODULE_IDS[0]
    navigate(`/bootcamp/${next}`)
  }

  const handleSkip = () => {
    skip()
    navigate('/')
  }

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back={from} />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section">
        {/* ---- level badge ---- */}
        <section className="flex flex-col items-center pt-section text-center">
          <span
            className={`rounded-button bg-primary/15 px-stack py-ring text-small font-bold text-primary ${kh}`}
          >
            {t('levelZero')}
          </span>
          <h1 className={`mt-stack text-title font-bold ${kh}`}>{t('bootcampTitle')}</h1>
          <p className={`mt-ring text-body text-muted ${kh}`}>{t('bootcampSubtitle')}</p>
          <p className={`mt-stack flex items-center gap-ring text-small font-semibold text-muted ${kh}`}>
            <Clock aria-hidden className="h-icon w-icon" />
            {t('bootcampMeta')}
          </p>
        </section>

        {/* ---- what you are playing for ---- */}
        <section className="rounded-card border border-border bg-surface p-stack">
          <ul className="grid grid-cols-3 gap-stack">
            {TOOLS.map(({ name, image }) => (
              <li key={name} className="flex flex-col items-center text-center">
                <span className="relative">
                  <img
                    src={image}
                    alt=""
                    aria-hidden
                    className="h-illustration-sm w-illustration-sm rounded-full border border-border object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 flex items-center justify-center rounded-full border border-surface bg-primary p-ring text-primary-text"
                  >
                    <Lock className="h-icon w-icon" />
                  </span>
                </span>
                <p className={`mt-stack text-small font-semibold ${kh}`}>{t(name)}</p>
              </li>
            ))}
          </ul>

          <p className={`mt-stack flex items-center gap-stack border-t border-border pt-stack text-small text-muted ${kh}`}>
            <span
              aria-hidden
              className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
            >
              <Gift className="h-icon w-icon" />
            </span>
            {t('bootcampEarnNotice')}
          </p>
        </section>

        {/* ---- begin / skip ---- */}
        <div className="mt-auto flex flex-col items-center gap-stack">
          <button
            type="button"
            onClick={handleBegin}
            className={`tap-target flex w-full items-center justify-center gap-stack rounded-button bg-primary
                        px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
          >
            {t('beginTraining')}
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className={`tap-target flex flex-col items-center rounded-button px-section text-small text-muted ${kh}`}
          >
            <span className="font-semibold">{t('skip')}</span>
            <span>{t('skipNoTools')}</span>
          </button>
        </div>
      </div>
    </main>
  )
}
