import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import PickerCard, { type PickerLock } from '../components/PickerCard'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
import { useGameStore, useLocalized } from '../store/gameStore'
import { listScenarios } from '../api/client'
import { SCENARIO_ROSTER } from '../lib/scenarioRoster'
import type { ScenarioSummary } from '../../shared/types'

type Status = 'loading' | 'ready' | 'error'

/**
 * Guardian Mode — choose a scenario.
 *
 * The roster is fixed and in unlock order; the API says which of them have
 * content. A scenario is open when the one before it has been played to the
 * end AND the server has it. The first is always open.
 *
 * Only the next locked scenario says "play N first" — the ones after it
 * just say locked. Telling a player on scenario 1 that scenario 4 needs
 * scenario 3 is noise.
 */
export default function ScenarioSelect() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const localized = useLocalized()
  const completed = useGameStore((s) => s.completedScamTypes)
  const [status, setStatus] = useState<Status>('loading')
  const [available, setAvailable] = useState<ScenarioSummary[]>([])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    listScenarios()
      .then((rows) => {
        if (cancelled) return
        setAvailable(rows)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [])

  const kh = isKhmer ? 'leading-kh' : ''

  // Progression: index of the first roster entry not yet completed.
  const frontier = SCENARIO_ROSTER.findIndex((e) => !completed.includes(e.scamType))
  const reach = frontier === -1 ? SCENARIO_ROSTER.length : frontier

  const lockFor = (index: number): PickerLock => {
    const entry = SCENARIO_ROSTER[index]
    const content = available.find((s) => s.scamType === entry.scamType)
    if (index <= reach) {
      return content ? { kind: 'open', to: `/guardian/${content.id}` } : { kind: 'coming-soon' }
    }
    if (index === reach + 1) return { kind: 'previous', number: reach + 1 }
    return { kind: 'locked' }
  }

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <h1 className={`text-title font-bold ${kh}`}>{t('chooseScenario')}</h1>

        <section className="mt-section flex flex-1 flex-col gap-stack">
          {status === 'loading' && <ScreenState kind="loading" />}
          {status === 'error' && <ScreenState kind="error" onRetry={() => location.reload()} />}
          {status === 'ready' &&
            SCENARIO_ROSTER.map((entry, i) => (
              <PickerCard
                key={entry.scamType}
                title={localized(entry.title)}
                blurb={localized(entry.blurb)}
                difficulty={entry.difficulty}
                image={entry.image}
                icon={entry.icon}
                lock={lockFor(i)}
              />
            ))}
        </section>
      </div>
    </main>
  )
}
