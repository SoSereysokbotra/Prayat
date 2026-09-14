import { useGameStore, levelFor, nextLevelAt } from '../store/gameStore'
import { useT, useIsKhmer } from '../hooks/useT'
import type { Level } from '../../shared/types'
import type { UIKey } from '../i18n/ui'

const LEVEL_KEY: Record<Level, UIKey> = {
  Aware: 'levelAware',
  Alert: 'levelAlert',
  Defender: 'levelDefender',
  Guardian: 'levelGuardian',
  Protector: 'levelProtector',
}

/**
 * Cumulative score strip.
 *
 * Shows progress toward the next level rather than a bare number — a number
 * on its own does not tell a player whether they are getting better.
 */
export default function ScoreDisplay() {
  const score = useGameStore((s) => s.cumulativeScore)
  const t = useT()
  const isKhmer = useIsKhmer()

  const level = levelFor(score)
  const next = nextLevelAt(score)

  // Progress within the current band, not across the whole range.
  const bandStart = next === null ? 500 : [0, 100, 200, 300, 500].filter((v) => v <= score).pop() ?? 0
  const progress = next === null ? 1 : (score - bandStart) / (next - bandStart)

  return (
    <section
      aria-label={t('yourScore')}
      className="rounded-card border border-border bg-surface p-stack"
    >
      <div className="flex items-baseline justify-between gap-stack">
        <span className={`text-small text-muted ${isKhmer ? 'leading-kh' : ''}`}>
          {t('yourScore')}
        </span>
        <span className="text-title font-semibold tabular-nums">{score}</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={bandStart}
        aria-valuemax={next ?? 500}
        className="mt-stack h-bar w-full overflow-hidden rounded-button bg-surface-alt"
      >
        <div
          className="h-full rounded-button bg-safe transition-all duration-route"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className="mt-stack flex items-baseline justify-between gap-stack">
        <span className={`text-small font-semibold ${isKhmer ? 'leading-kh' : ''}`}>
          {t(LEVEL_KEY[level])}
        </span>
        <span className={`text-small text-muted ${isKhmer ? 'leading-kh' : ''}`}>
          {next === null ? t('topLevel') : `${next - score} ${t('pointsToNext')}`}
        </span>
      </div>
    </section>
  )
}
