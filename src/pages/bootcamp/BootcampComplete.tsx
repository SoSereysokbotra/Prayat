import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Trophy } from 'lucide-react'
import TopBar from '../../components/TopBar'
import { useT, useIsKhmer } from '../../hooks/useT'
import { useTools } from '../../store/bootcampStore'
import type { ToolId } from '../../../shared/types'
import type { UIKey } from '../../i18n/ui'

const TOOLS: { id: ToolId; name: UIKey; image: string; note?: UIKey }[] = [
  { id: 'shield-badge', name: 'toolShieldBadge', image: '/bootcamp-tool-shield.jpg' },
  { id: 'authenticator-token', name: 'toolAuthenticator', image: '/bootcamp-tool-token.jpg' },
  { id: 'magnifying-glass', name: 'toolMagnifier', image: '/bootcamp-tool-magnifier.jpg', note: 'activeInInvestigation' },
]

/**
 * Level 0, screen 5 — the toolbelt.
 *
 * The end of the bootcamp is not a score, it is three things the player
 * now owns. The trophy lands first, then the tools arrive one after
 * another with their ticks popping in (timed by --timing-trophy and
 * --timing-toolbelt-stagger), then the closing line and the button.
 *
 * A tool not yet earned (the player came here by a back-door route) shows
 * without a tick, so the screen never claims more than the store knows.
 */
export default function BootcampComplete() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const earned = useTools()
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/bootcamp" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <section className="flex flex-col items-center text-center">
          <span
            aria-hidden
            className="trophy-in flex h-illustration w-illustration items-center justify-center rounded-full bg-caution/20 text-caution"
          >
            <Trophy className="h-icon w-icon" />
          </span>
          <h1 className={`mt-stack text-title font-bold ${kh}`}>{t('trainingComplete')}</h1>
          <p className={`mt-ring text-body text-muted ${kh}`}>{t('yourToolbelt')}</p>
        </section>

        <ul className="flex flex-col gap-stack">
          {TOOLS.map(({ id, name, image, note }, i) => {
            const has = earned.includes(id)
            return (
              <li
                key={id}
                style={{ '--toolbelt-i': i } as CSSProperties}
                className="toolbelt-in flex items-center gap-stack rounded-card border border-border bg-surface p-stack"
              >
                <img src={image} alt="" aria-hidden className="h-illustration-sm w-illustration-sm shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className={`text-body font-bold ${kh}`}>{t(name)}</p>
                  {note && <p className={`text-small text-muted ${kh}`}>{t(note)}</p>}
                </div>
                {has && (
                  <span
                    aria-label={t('toolUnlocked')}
                    className="toolbelt-tick flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-safe text-primary-text"
                  >
                    <Check aria-hidden className="h-icon w-icon" />
                  </span>
                )}
              </li>
            )
          })}
        </ul>

        <div className="toolbelt-after mt-auto flex flex-col gap-section">
          <p className={`text-center text-body font-semibold ${kh}`}>{t('youAreReady')}</p>
          <Link
            to="/"
            className={`tap-target flex w-full items-center justify-center gap-stack rounded-button bg-primary
                        px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
          >
            {t('enterScamSim')}
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </Link>
        </div>
      </div>
    </main>
  )
}
