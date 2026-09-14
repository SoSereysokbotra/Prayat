import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Bug,
  CheckCircle2,
  ChevronRight,
  Coins,
  Flame,
  Heart,
  Landmark,
  ListChecks,
  Lock,
  Share2,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import { currentStreak, levelFor, useGameStore, useLocalized } from '../store/gameStore'
import { SCENARIO_ROSTER } from '../lib/scenarioRoster'
import type { ScamType } from '../../shared/types'
import type { UIKey } from '../i18n/ui'

/** The five categories from the design doc, in display order. */
const CATEGORIES: { type: ScamType; label: UIKey; icon: LucideIcon }[] = [
  { type: 'government', label: 'scamGovernment', icon: Landmark },
  { type: 'job', label: 'scamJob', icon: Briefcase },
  { type: 'crypto', label: 'scamCrypto', icon: Coins },
  { type: 'romance', label: 'scamRomance', icon: Heart },
  { type: 'malware', label: 'scamMalware', icon: Bug },
]

const LEVEL_KEY: Record<ReturnType<typeof levelFor>, UIKey> = {
  Aware: 'levelAware',
  Alert: 'levelAlert',
  Defender: 'levelDefender',
  Guardian: 'levelGuardian',
  Protector: 'levelProtector',
}

const SEGMENTS = 5

/**
 * My Progress.
 *
 * Everything here is per-device: the score, the streak and the per-category
 * ratings all live in gameStore. There is no server-side profile yet, so a
 * player who switches phones starts over — the same trade the rest of the
 * app already makes for the score.
 *
 * The category rating is the design doc's 0–1000 scale, derived from the
 * best Guardian run in that category (earned / available). "Not tried yet"
 * is shown distinctly from a low score, because to a parent those mean
 * opposite things.
 */
export default function Progress() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const localized = useLocalized()
  const score = useGameStore((s) => s.cumulativeScore)
  const streak = useGameStore((s) => s.streak)
  const best = useGameStore((s) => s.bestByScamType)
  const completed = useGameStore((s) => s.completedScamTypes)
  const [copied, setCopied] = useState(false)

  const kh = isKhmer ? 'leading-kh' : ''
  const level = t(LEVEL_KEY[levelFor(score)])
  const days = currentStreak(streak)

  const share = useCallback(async () => {
    const text = `${t('shareScoreText').replace('{score}', String(score)).replace('{level}', level)} ${location.origin}`
    try {
      if (navigator.share) {
        await navigator.share({ text })
        return
      }
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Cancelled share sheet or refused clipboard — nothing to report.
    }
  }, [t, score, level])

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <h1 className={`text-title font-bold ${kh}`}>{t('myProgress')}</h1>

        {/* ---- who you are, in numbers ---- */}
        <section className="flex items-center gap-section rounded-card border border-border bg-surface p-stack">
          <span
            aria-hidden
            className="flex h-illustration w-illustration shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
          >
            <UserRound className="h-wordmark w-wordmark" />
          </span>
          <dl className={`flex min-w-0 flex-1 flex-col gap-ring text-body ${kh}`}>
            <div className="flex items-baseline gap-stack">
              <dt className="text-muted">{t('totalScore')}:</dt>
              <dd className="text-title font-bold tabular-nums text-primary">{score}</dd>
            </div>
            <div className="flex items-baseline gap-stack">
              <dt className="text-muted">{t('level')}:</dt>
              <dd className="font-semibold text-safe">{level}</dd>
            </div>
            <div className="flex items-baseline gap-stack">
              <dt className="text-muted">{t('streak')}:</dt>
              <dd className="flex items-center gap-ring font-semibold text-caution">
                {t('streakDays').replace('{n}', String(days))}
                {days > 0 && <Flame aria-hidden className="h-icon w-icon fill-current" />}
              </dd>
            </div>
          </dl>
        </section>

        {/* ---- resistance by category ---- */}
        <section>
          <h2 className={`flex items-center gap-stack text-body font-bold ${kh}`}>
            <ShieldCheck aria-hidden className="h-icon w-icon text-primary" />
            {t('resistanceHeading')}
          </h2>
          <ul className="mt-stack divide-y divide-border rounded-card border border-border bg-surface">
            {CATEGORIES.map(({ type, label, icon: Icon }) => {
              const result = best[type]
              const rating = result ? Math.round(Math.min(result.earned / result.available, 1) * 1000) : null
              const filled = rating === null ? 0 : Math.round((rating / 1000) * SEGMENTS)
              return (
                <li key={type} className="flex items-center gap-stack p-stack">
                  <span
                    aria-hidden
                    className={`flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full
                                ${rating === null ? 'bg-surface-alt text-muted' : 'bg-primary text-primary-text'}`}
                  >
                    <Icon className="h-icon w-icon" />
                  </span>
                  <span className={`min-w-0 flex-1 text-small font-semibold ${rating === null ? 'text-muted' : ''} ${kh}`}>
                    {t(label)}
                  </span>
                  <span
                    role="meter"
                    aria-valuenow={rating ?? 0}
                    aria-valuemin={0}
                    aria-valuemax={1000}
                    aria-label={rating === null ? t('notTriedYet') : undefined}
                    className="flex shrink-0 gap-ring"
                  >
                    {Array.from({ length: SEGMENTS }, (_, i) => (
                      <span
                        key={i}
                        className={`h-bar w-icon rounded-button ${i < filled ? 'bg-safe' : 'bg-surface-alt'}`}
                      />
                    ))}
                  </span>
                  <span className={`w-tap shrink-0 text-right text-body font-semibold tabular-nums ${rating === null ? 'text-muted' : ''}`}>
                    {rating ?? '–'}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ---- scenarios ---- */}
        <section>
          <h2 className={`flex items-center gap-stack text-body font-bold ${kh}`}>
            <ListChecks aria-hidden className="h-icon w-icon text-primary" />
            {t('completedScenarios')}
          </h2>
          <ul className="mt-stack divide-y divide-border rounded-card border border-border bg-surface">
            {SCENARIO_ROSTER.map((entry) => {
              const done = completed.includes(entry.scamType)
              const row = (
                <>
                  {done ? (
                    <CheckCircle2 aria-hidden className="h-icon w-icon shrink-0 text-safe" />
                  ) : (
                    <Lock aria-hidden className="h-icon w-icon shrink-0 text-muted" />
                  )}
                  <span className={`min-w-0 flex-1 truncate text-body ${done ? 'font-semibold' : 'text-muted'} ${kh}`}>
                    {localized(entry.title)}
                  </span>
                  <ChevronRight aria-hidden className="h-icon w-icon shrink-0 text-muted" />
                </>
              )
              return (
                <li key={entry.scamType}>
                  {/* Every row leads to the picker, which knows what is open. */}
                  <Link
                    to="/guardian"
                    className="tap-target flex items-center gap-stack p-stack transition-colors duration-option-fade hover:bg-surface-alt"
                  >
                    {row}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <button
          type="button"
          onClick={share}
          className={`tap-target mt-auto flex items-center justify-center gap-stack rounded-button
                      bg-primary px-section text-body font-semibold text-primary-text
                      transition-colors duration-option-fade ${kh}`}
        >
          <Share2 aria-hidden className="h-icon w-icon" />
          {copied ? t('shareCopied') : t('shareMyScore')}
        </button>
      </div>
    </main>
  )
}
