import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CircleCheck, Target, TriangleAlert } from 'lucide-react'
import TopBar from '../components/TopBar'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
import { useLocalized } from '../store/gameStore'
import { listScenarios } from '../api/client'
import { SCENARIO_ROSTER, type RosterEntry } from '../lib/scenarioRoster'

type Status = 'loading' | 'ready' | 'error'

/**
 * Guardian Mode — the setup before a round.
 *
 * Who the relative is, what is about to happen to him, and the three things
 * the player is there to do. The first mission line carries the one rule a
 * new player must know before the chat opens: you cannot reply to the
 * scammer, only to Uncle. Dropped straight into two stacked chat panes,
 * people try to type in the top one and learn the rule by being confused.
 *
 * The roster entry is found through the API — the URL carries the scenario
 * id, the API says which scam type that is, the roster has the story.
 */
export default function ScenarioIntro() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const localized = useLocalized()
  const { scenarioId = '' } = useParams<{ scenarioId: string }>()
  const [status, setStatus] = useState<Status>('loading')
  const [entry, setEntry] = useState<RosterEntry | null>(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    listScenarios()
      .then((rows) => {
        if (cancelled) return
        const scenario = rows.find((s) => s.id === scenarioId)
        const found = SCENARIO_ROSTER.find((e) => e.scamType === scenario?.scamType) ?? null
        setEntry(found)
        setStatus(found ? 'ready' : 'error')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [scenarioId])

  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/guardian" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        {status === 'loading' && <ScreenState kind="loading" />}
        {status === 'error' && <ScreenState kind="error" onRetry={() => location.reload()} />}

        {status === 'ready' && entry && (
          <>
            {/* The relative, in his world. Wide art if drawn; the card's round crop if not. */}
            {entry.hero ? (
              <img src={entry.hero} alt="" aria-hidden className="w-full rounded-card object-cover" />
            ) : (
              <img
                src={entry.image}
                alt=""
                aria-hidden
                className="mx-auto h-illustration w-illustration rounded-full object-cover"
              />
            )}

            <div>
              <h1 className={`text-title font-bold ${kh}`}>{localized(entry.title)}</h1>
              <p className={`mt-stack text-body text-muted ${kh}`}>{localized(entry.story)}</p>
            </div>

            <section className="rounded-card bg-primary/10 p-stack">
              <h2 className={`flex items-center gap-stack text-body font-semibold ${kh}`}>
                <Target aria-hidden className="h-icon w-icon shrink-0 text-primary" />
                {t('yourMission')}
              </h2>
              <ul className="mt-stack flex flex-col gap-stack">
                {entry.mission.map((item, i) => (
                  <li key={i} className={`flex items-start gap-stack text-body ${kh}`}>
                    <CircleCheck aria-hidden className="h-icon w-icon shrink-0 fill-primary text-primary-text" />
                    <span className="min-w-0 flex-1">{localized(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <aside
              role="note"
              className="flex items-start gap-stack rounded-card border border-caution bg-caution/10 p-stack"
            >
              <TriangleAlert aria-hidden className="h-icon w-icon shrink-0 text-caution" />
              <p className={`min-w-0 flex-1 text-small ${kh}`}>
                <span className="font-semibold text-caution">{t('warning')}: </span>
                {t('warningFeelsReal')}
              </p>
            </aside>

            <Link
              to={`/guardian/${scenarioId}/play`}
              className={`tap-target mt-auto flex items-center justify-center gap-stack rounded-button
                          bg-primary px-section text-body font-semibold text-primary-text
                          transition-colors duration-option-fade ${kh}`}
            >
              {t('startScenario')}
              <ArrowRight aria-hidden className="h-icon w-icon" />
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
