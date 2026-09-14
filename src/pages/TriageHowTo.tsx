import { Link } from 'react-router-dom'
import { ArrowRight, Check, CheckCircle2, Heart, Timer, X } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import { motionToken } from '../hooks/useMotionToken'
import { markHowToSeen } from '../lib/howToSeen'
import { TRIAGE_MAX_MISTAKES, TRIAGE_SECONDS_PER_CARD } from '../../shared/types'
import type { UIKey } from '../i18n/ui'

const STEPS: { text: UIKey; image: string }[] = [
  { text: 'triageStep1', image: '/triage-step-1.jpg' },
  { text: 'triageStep2', image: '/triage-step-2.jpg' },
  { text: 'triageStep3', image: '/triage-step-3.jpg' },
  { text: 'triageStep4', image: '/triage-step-4.jpg' },
  { text: 'triageStep5', image: '/triage-step-5.jpg' },
]

/**
 * Speed Triage — how to play.
 *
 * Five steps, each with a small demo of the thing it describes: the timer
 * bar, the two verdict buttons, the explanation card, the lives. The numbers
 * (seconds per card, mistakes allowed, explanation hold) come from the same
 * constants the game runs on, so this page cannot drift from the rules.
 *
 * Shown once on the first visit to /triage; after that it is a link from
 * the game-over screen.
 */
export default function TriageHowTo() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  const explainSeconds = Math.round(motionToken('--timing-explain-right') / 1000)
  const countdown = Array.from({ length: TRIAGE_SECONDS_PER_CARD }, (_, i) => TRIAGE_SECONDS_PER_CARD - i)

  /* The little demo beside a step. Decorative; the copy carries the meaning. */
  const demo = (step: number) => {
    switch (step) {
      case 2:
        return (
          <div aria-hidden className="mt-stack">
            <div className="flex gap-ring overflow-hidden rounded-button border border-border bg-surface-alt p-ring">
              {countdown.map((n) => (
                <span key={n} className="h-bar flex-1 rounded-button bg-primary" />
              ))}
            </div>
            <p className="mt-ring text-small tabular-nums text-muted">{countdown.join('…')}…</p>
          </div>
        )
      case 3:
        return (
          <div aria-hidden className={`mt-stack flex gap-stack ${kh}`}>
            <span className="tap-target flex flex-1 items-center justify-center gap-ring rounded-button bg-verdict-real text-body font-bold text-primary-text">
              {t('verdictReal')} <Check className="h-icon w-icon" />
            </span>
            <span className="tap-target flex flex-1 items-center justify-center gap-ring rounded-button bg-verdict-scam text-body font-bold text-primary-text">
              {t('verdictScam')} <X className="h-icon w-icon" />
            </span>
          </div>
        )
      case 4:
        return (
          <div aria-hidden className="mt-stack flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
            <CheckCircle2 className="h-icon w-icon shrink-0 text-safe" />
            <span className="flex min-w-0 flex-1 flex-col gap-ring">
              <span className="h-ring w-full rounded-button bg-surface-alt" />
              <span className="h-ring w-2/3 rounded-button bg-surface-alt" />
            </span>
            <span className="flex shrink-0 items-center gap-ring rounded-button bg-primary px-stack text-small font-semibold text-primary-text">
              <Timer className="h-icon w-icon" /> {explainSeconds}s
            </span>
          </div>
        )
      case 5:
        return (
          <div aria-hidden className="mt-stack flex items-center gap-stack">
            <span className="flex gap-ring">
              {Array.from({ length: TRIAGE_MAX_MISTAKES }, (_, i) => (
                <Heart
                  key={i}
                  className={`h-icon w-icon ${i < TRIAGE_MAX_MISTAKES - 1 ? 'fill-current text-danger' : 'text-border'}`}
                />
              ))}
            </span>
            <span className={`rounded-button bg-surface-alt px-stack text-small text-muted ${kh}`}>
              {t('wrongCount').replace('{n}', String(TRIAGE_MAX_MISTAKES - 1)).replace('{max}', String(TRIAGE_MAX_MISTAKES))}
            </span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <h1 className={`text-title font-bold ${kh}`}>{t('howToPlay')}</h1>

        <img src="/triage-howto-hero.jpg" alt="" aria-hidden className="w-full rounded-card object-cover" />

        <ol className="divide-y divide-border rounded-card border border-border bg-surface">
          {STEPS.map(({ text, image }, i) => {
            const n = i + 1
            return (
              <li key={n} className="flex items-start gap-stack p-stack">
                <span className="relative shrink-0">
                  <img src={image} alt="" aria-hidden className="h-illustration-sm w-illustration-sm rounded-full object-cover" />
                  <span
                    aria-hidden
                    className="absolute -left-ring -top-ring flex h-icon w-icon items-center justify-center rounded-full bg-primary text-small font-bold text-primary-text"
                  >
                    {n}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className={`text-body font-bold text-primary ${kh}`}>
                    {t('stepN').replace('{n}', String(n))}
                  </h2>
                  <p className={`text-body ${kh}`}>
                    {t(text)
                      .replace('{seconds}', String(TRIAGE_SECONDS_PER_CARD))
                      .replace('{explain}', String(explainSeconds))
                      .replace('{mistakes}', String(TRIAGE_MAX_MISTAKES))}
                  </p>
                  {demo(n)}
                </div>
              </li>
            )
          })}
        </ol>

        <Link
          to="/triage"
          onClick={() => markHowToSeen('triage')}
          className={`tap-target mt-auto flex items-center justify-center gap-stack rounded-button
                      bg-primary px-section text-body font-semibold text-primary-text
                      transition-colors duration-option-fade ${kh}`}
        >
          {t('gotItLetsPlay')}
          <ArrowRight aria-hidden className="h-icon w-icon" />
        </Link>
      </div>
    </main>
  )
}
