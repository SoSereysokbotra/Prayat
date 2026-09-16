import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, BarChart3, Clock, FolderOpen, Lock, MessageCircle, Send } from 'lucide-react'
import ScreenState from '../components/ScreenState'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import { useGameStore } from '../store/gameStore'
import { listInvestigations } from '../api/client'
import { CASE_ROSTER, type CaseEntry } from '../lib/investigationRoster'
import type { InvestigationListItem } from '../../shared/types'

/**
 * The Investigation — case select.
 *
 * One list. The case that is open now shows its whole briefing and an
 * OPEN CASE button; everything after it is drawn locked with its name and
 * difficulty only, so the player can see what is coming without reading
 * a spoiler. Cases the server does not have yet are locked as "coming
 * soon" rather than pretending to be playable. Which case is open comes
 * from this device's results in the game store.
 */
type Availability = { kind: 'open' } | { kind: 'previous'; number: number } | { kind: 'locked' } | { kind: 'soon' }

export default function InvestigationSelect() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const results = useGameStore((s) => s.investigationResults)
  const kh = isKhmer ? 'leading-kh' : ''

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [served, setServed] = useState<InvestigationListItem[]>([])
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let alive = true
    setStatus('loading')
    listInvestigations()
      .then((items) => {
        if (!alive) return
        setServed(items)
        setStatus('ready')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [reload])

  if (status !== 'ready') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind={status === 'error' ? 'error' : 'loading'} onRetry={() => setReload((n) => n + 1)} />
      </main>
    )
  }

  // The first unsolved case is the one that is open; the rest wait in order.
  const firstOpen = CASE_ROSTER.findIndex((c) => !results[c.id]?.complete)
  const availability = (entry: CaseEntry, i: number): Availability => {
    const onServer = served.some((s) => s.id === entry.id)
    if (i <= firstOpen || firstOpen === -1) return onServer ? { kind: 'open' } : { kind: 'soon' }
    if (i === firstOpen + 1) return { kind: 'previous', number: CASE_ROSTER[firstOpen].number }
    return { kind: 'locked' }
  }

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <h1 className={`text-title font-bold ${kh}`}>{t('investigation')}</h1>

        {/* ---- the cases ---- */}
        <ul className="flex flex-col gap-stack">
          {CASE_ROSTER.map((entry, i) => {
            const state = availability(entry, i)
            const item = served.find((s) => s.id === entry.id)
            const flags = item?.flagCount ?? 0
            const minutes = Math.round((item?.durationSeconds ?? 0) / 60)
            const done = results[entry.id]?.complete
            const open = state.kind === 'open'
            return (
              <li
                key={entry.id}
                className={`rounded-card border bg-surface p-stack ${open ? 'border-primary/40' : 'border-border'}`}
              >
                <div className="flex items-start gap-stack">
                  <img
                    src={entry.image}
                    alt=""
                    aria-hidden
                    className={`shrink-0 rounded-card object-cover ${open ? 'h-illustration w-illustration' : 'h-illustration-sm w-illustration-sm opacity-70'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-flex items-center gap-ring rounded-button px-stack py-ring text-small font-bold
                                  ${open ? 'bg-primary text-primary-text' : 'bg-surface-alt text-muted'} ${kh}`}
                    >
                      <FolderOpen aria-hidden className="h-icon w-icon" />
                      {t('caseNumber').replace('{n}', String(entry.number).padStart(3, '0'))}
                    </span>
                    <h2 className={`mt-ring text-body font-bold ${open ? '' : 'text-muted'} ${kh}`}>{entry.title[language]}</h2>

                    {open ? (
                      <dl className="mt-stack grid grid-cols-2 gap-ring text-small">
                        <Fact icon={Send} label={t('platform')} value={entry.platform[language]} kh={kh} />
                        <Fact icon={Clock} label={t('timeLimit')} value={t('minutesShort').replace('{n}', String(minutes))} kh={kh} />
                        <Fact icon={MessageCircle} label={t('messages')} value={String(entry.messages)} kh={kh} />
                        <div className={`flex items-center gap-ring ${kh}`}>
                          <BarChart3 aria-hidden className="h-icon w-icon shrink-0 text-primary" />
                          <dt className="text-muted">{t('difficultyLabel')}:</dt>
                          <dd>
                            <Dots n={entry.difficulty} />
                          </dd>
                        </div>
                        <Fact icon={AlertTriangle} label={t('redFlagsToFind')} value={String(flags)} tone="caution" kh={kh} />
                      </dl>
                    ) : (
                      <p className={`mt-ring flex items-center gap-stack text-small text-muted ${kh}`}>
                        <span className="flex items-center gap-ring">
                          <AlertTriangle aria-hidden className="h-icon w-icon" />
                          {t('redFlagsCount')}: {flags || '?'}
                        </span>
                        <Dots n={entry.difficulty} muted />
                      </p>
                    )}
                  </div>
                </div>

                {open ? (
                  <>
                    <p className={`mt-stack border-t border-border pt-stack text-small ${kh}`}>{entry.briefing[language]}</p>
                    <div className="mt-stack flex flex-wrap items-center justify-between gap-stack">
                      <span
                        className={`flex items-center gap-ring rounded-button px-stack py-ring text-small font-semibold
                                    ${done ? 'bg-safe/15 text-safe' : 'bg-caution/15 text-caution'} ${kh}`}
                      >
                        <span aria-hidden className={`h-dot w-dot rounded-full ${done ? 'bg-safe' : 'bg-caution'}`} />
                        {done ? t('statusSolved') : t('statusUnsolved')}
                      </span>
                      <Link
                        to={`/investigation/${entry.id}/play`}
                        className={`tap-target flex items-center justify-center gap-stack rounded-button bg-primary
                                    px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
                      >
                        {t('openCase')}
                        <ArrowRight aria-hidden className="h-icon w-icon" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className={`mt-stack flex items-center gap-ring rounded-button bg-surface-alt px-stack py-ring text-small text-muted ${kh}`}>
                    <Lock aria-hidden className="h-icon w-icon shrink-0" />
                    {state.kind === 'previous'
                      ? t('solveCaseFirst').replace('{n}', String(state.number).padStart(3, '0'))
                      : state.kind === 'soon'
                        ? t('comingSoon')
                        : t('caseLocked')}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}

function Fact({
  icon: Icon,
  label,
  value,
  tone = 'primary',
  kh,
}: {
  icon: typeof Send
  label: string
  value: string
  tone?: 'primary' | 'caution'
  kh: string
}) {
  return (
    <div className={`flex items-center gap-ring ${kh}`}>
      <Icon aria-hidden className={`h-icon w-icon shrink-0 ${tone === 'caution' ? 'text-caution' : 'text-primary'}`} />
      <dt className="text-muted">{label}:</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}

/** Difficulty as five dots, the mockup's own notation. */
function Dots({ n, muted = false }: { n: number; muted?: boolean }) {
  return (
    <span className="flex items-center gap-ring" aria-label={`${n} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={`h-dot w-dot rounded-full ${i < n ? (muted ? 'bg-muted' : 'bg-primary') : 'bg-border'}`}
        />
      ))}
    </span>
  )
}
