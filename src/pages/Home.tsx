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
    <main className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-screen-x py-section">
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
            <ModeCard
              to="/guardian"
              icon={ShieldCheck}
              title={t('guardianMode')}
              blurb={t('guardianModeBlurb')}
              meta={stageCount === null ? '' : `${stageCount} ${t('stages')} · 10 ${t('minutes')}`}
            />
            <ModeCard
              to="/triage"
              icon={Zap}
              title={t('speedTriage')}
              blurb={t('speedTriageBlurb')}
              meta={`2 ${t('minutes')}`}
            />
            <ModeCard
              to="/investigation"
              icon={Search}
              title={t('investigation')}
              blurb={t('investigationBlurb')}
              meta={`7 ${t('minutes')}`}
            />
          </>
        )}
      </section>

      {placeholders && (
        <p className="mt-section rounded-card border border-caution bg-surface p-stack text-small text-muted">
          Placeholder content in use — the scenario is still being written.
          Run <code>npm run validate:content</code> to see what is left.
        </p>
      )}
    </main>
  )
}
