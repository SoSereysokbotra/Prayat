import { useEffect, useState } from 'react'
import { BarChart3, Search, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ModeCard from '../components/ModeCard'
import AccountBadge from '../components/AccountBadge'
import ScoreDisplay from '../components/ScoreDisplay'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { listScenarios, placeholdersInUse } from '../api/client'

type Status = 'loading' | 'ready' | 'error'

export default function Home() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const [status, setStatus] = useState<Status>('loading')
  const [stageCount, setStageCount] = useState<number | null>(null)
  const [placeholders, setPlaceholders] = useState(false)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    listScenarios()
      .then((scenarios) => {
        if (cancelled) return
        setStageCount(scenarios[0]?.stageCount ?? null)
        setPlaceholders(placeholdersInUse())
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
    }
  }, [])

  const kh = isKhmer ? 'leading-kh' : ''

  // Pull the sheet down to refresh; the river under it is the reward.
  const pull = usePullToRefresh(() => location.reload())

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar pull={pull} />

      {/* The sheet: rounded top corners riding up over the river half of the
          banner. Dragged down by touch, eased back on release. */}
      <div
        style={{ transform: `translateY(${pull.pull}px)` }}
        className={`relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col
                    rounded-t-sheet bg-bg px-screen-x pb-section pt-section
                    ${pull.phase === 'pulling' || pull.phase === 'armed' ? '' : 'sheet-settle'}`}
      >
        <div className="flex flex-col gap-stack">
          <AccountBadge />
          <ScoreDisplay />
        </div>

        <section className="mt-section flex flex-1 flex-col gap-stack">
          {status === 'loading' && <ScreenState kind="loading" />}

          {status === 'error' && <ScreenState kind="error" onRetry={() => location.reload()} />}

          {status === 'ready' && (
            <>
              {/* Guardian is the product. It gets the card that looks like it. */}
              <ModeCard
                emphasis="primary"
                to="/guardian"
                icon={ShieldCheck}
                image="/mode-guardian.jpg"
                title={t('guardianMode')}
                blurb={t('guardianModeBlurb')}
                teaches={t('guardianTeaches')}
                cadence={
                  stageCount === null
                    ? t('weekly')
                    : `${stageCount} ${t('stages')} · 10 ${t('minutes')} · ${t('weekly')}`
                }
              />

              <p className={`mt-stack text-small text-muted ${kh}`}>{t('keepSharp')}</p>

              <ModeCard
                to="/triage"
                icon={Zap}
                image="/mode-triage.jpg"
                title={t('speedTriage')}
                blurb={t('speedTriageBlurb')}
                cadence={`2 ${t('minutes')} · ${t('daily')}`}
              />
              <ModeCard
                to="/investigation"
                icon={Search}
                image="/mode-investigation.jpg"
                title={t('investigation')}
                blurb={t('investigationBlurb')}
                cadence={`3 ${t('minutes')} · ${t('weekly')}`}
              />
            </>
          )}
        </section>

        <Link
          to="/progress"
          className={`tap-target mt-section flex items-center justify-center gap-stack rounded-button
                      border border-border bg-surface px-section text-body font-semibold
                      transition-colors duration-option-fade hover:bg-surface-alt ${kh}`}
        >
          <BarChart3 aria-hidden className="h-icon w-icon text-primary" />
          {t('myProgress')}
        </Link>

        {placeholders && (
          <p className="mt-section rounded-card border border-caution bg-surface p-stack text-small text-muted">
            Placeholder content in use — the scenarios are still being written.
            Run <code>npm run validate:content</code> to see what is left.
          </p>
        )}
      </div>
    </main>
  )
}
