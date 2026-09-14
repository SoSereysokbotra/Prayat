import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Play, Star, type LucideIcon } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'
import { MAX_DIFFICULTY } from '../lib/scenarioRoster'

export type PickerLock =
  /** Playable now. */
  | { kind: 'open'; to: string }
  /** The previous item has not been finished. */
  | { kind: 'previous'; number: number }
  /** Further down the chain than the next one. */
  | { kind: 'locked' }
  /** Unlocked by progress, but the content has not been written yet. */
  | { kind: 'coming-soon' }

interface PickerCardProps {
  title: string
  blurb: string
  difficulty: number
  /** Round artwork. Falls back to `icon` if the file is missing. */
  image?: string
  icon: LucideIcon
  /** A short fact beside the stars, e.g. "15 cards". */
  meta?: string
  /** Button label when open. Defaults to "Play". */
  cta?: string
  lock: PickerLock
}

/**
 * One choice in a picker — a Guardian scenario, a Speed Triage card pack.
 *
 * Artwork on the left, the hook line on the right, difficulty as stars, and
 * either a PLAY button or the reason it is locked. The reason matters: a
 * bare padlock tells a player nothing about what to do, "play scenario 1
 * first" tells them exactly.
 *
 * Only the open card is a link. A locked card is inert — navigating to a
 * placeholder page and back is worse than a clear label where they are.
 */
export default function PickerCard({
  title,
  blurb,
  difficulty,
  image,
  icon: Icon,
  meta,
  cta,
  lock,
}: PickerCardProps) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  // The artwork is optional until it has been drawn; the icon stands in.
  const [imageBroken, setImageBroken] = useState(false)
  const open = lock.kind === 'open'

  const lockLabel =
    lock.kind === 'previous'
      ? t('playScenarioFirst').replace('{n}', String(lock.number))
      : lock.kind === 'coming-soon'
        ? t('comingSoon')
        : t('locked')

  const body = (
    <>
      {image && !imageBroken ? (
        <img
          src={image}
          alt=""
          aria-hidden
          onError={() => setImageBroken(true)}
          className={`h-illustration w-illustration shrink-0 rounded-full object-cover
                      ${open ? '' : 'opacity-50 grayscale'}`}
        />
      ) : (
        <span
          aria-hidden
          className={`flex h-illustration w-illustration shrink-0 items-center justify-center rounded-full
                      ${open ? 'bg-primary text-primary-text' : 'bg-surface-alt text-muted'}`}
        >
          <Icon className="h-icon w-icon" />
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-stack">
        <div>
          <h2 className={`text-title font-semibold ${open ? '' : 'text-muted'} ${kh}`}>{title}</h2>
          <p className={`text-body ${open ? 'text-text' : 'text-muted'} ${kh}`}>{blurb}</p>
        </div>

        <p
          className="flex flex-wrap items-center gap-stack text-small text-muted"
          aria-label={`${t('difficulty')} ${difficulty} ${t('outOf')} ${MAX_DIFFICULTY}`}
        >
          <span aria-hidden className="flex">
            {Array.from({ length: MAX_DIFFICULTY }, (_, i) => (
              <Star
                key={i}
                className={`h-icon w-icon ${i < difficulty ? 'fill-current text-caution' : 'text-border'}`}
              />
            ))}
          </span>
          <span className={kh}>
            {difficulty} {t('outOf')} {MAX_DIFFICULTY}
          </span>
          {meta && <span className={`${kh}`}>· {meta}</span>}
        </p>

        {open ? (
          <span
            className={`tap-target flex items-center justify-center gap-stack rounded-button
                        bg-primary px-section text-body font-semibold text-primary-text ${kh}`}
          >
            <Play aria-hidden className="h-icon w-icon fill-current" />
            {cta ?? t('play')}
          </span>
        ) : (
          <p className={`flex items-center gap-stack text-small text-muted ${kh}`}>
            <Lock aria-hidden className="h-icon w-icon shrink-0" />
            {lockLabel}
          </p>
        )}
      </div>
    </>
  )

  const frame = 'flex items-start gap-stack rounded-card border p-stack'

  if (open) {
    return (
      <Link
        to={lock.to}
        className={`${frame} border-primary bg-surface transition-colors duration-option-fade hover:bg-surface-alt`}
      >
        {body}
      </Link>
    )
  }

  return (
    <div aria-disabled className={`${frame} border-border bg-surface-alt/50`}>
      {body}
    </div>
  )
}
