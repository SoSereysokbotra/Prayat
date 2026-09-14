import { useEffect, useState } from 'react'
import { Search, ShieldCheck, Zap } from 'lucide-react'
import LanguageToggle from '../components/LanguageToggle'
import ModeCard from '../components/ModeCard'
import ScoreDisplay from '../components/ScoreDisplay'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
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

  return (
    <main className="screen-in mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col px-screen-x py-section">
      <header className="flex items-start justify-between gap-stack">
        <div className="min-w-0">
          <h1 className="text-display font-bold tracking-tight">Prayat</h1>
          <p className={`mt-stack text-small text-muted ${kh}`}>{t('tagline')}</p>
        </div>
        <LanguageToggle />
      </header>

      <div className="mt-section">
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
              title={t('speedTriage')}
              blurb={t('speedTriageBlurb')}
              cadence={`2 ${t('minutes')} · ${t('daily')}`}
            />
            <ModeCard
              to="/investigation"
              icon={Search}
              title={t('investigation')}
              blurb={t('investigationBlurb')}
              cadence={`3 ${t('minutes')} · ${t('weekly')}`}
            />
          </>
        )}
      </section>

      {placeholders && (
        <p className="mt-section rounded-card border border-caution bg-surface p-stack text-small text-muted">
          Placeholder content in use — the scenarios are still being written.
          Run <code>npm run validate:content</code> to see what is left.
        </p>
      )}
    </main>
  )
}
