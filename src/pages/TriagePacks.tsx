import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Play, Star, Timer } from 'lucide-react'
import TopBar from '../components/TopBar'
import PickerCard from '../components/PickerCard'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
import { useLocalized } from '../store/gameStore'
import { listTriageDecks, type TriageDeckSummary } from '../api/client'
import { hasSeenHowTo } from '../lib/howToSeen'
import { DAILY_DECK_ID, TRIAGE_PACKS } from '../lib/triagePacks'

type Status = 'loading' | 'ready' | 'error'

/**
 * Speed Triage — choose a card pack.
 *
 * Same shape as the Guardian picker: a fixed roster, and the API says which
 * entries have content. No unlock chain here — every pack with a deck is
 * open, because Triage is the daily drill, not the curriculum.
 *
 * The daily challenge sits apart at the bottom: it is the one deck that is
 * always there, and the reason to come back tomorrow.
 */
export default function TriagePacks() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const localized = useLocalized()
  const [status, setStatus] = useState<Status>('loading')
  const [decks, setDecks] = useState<TriageDeckSummary[]>([])
  // First visit goes through the how-to. Read once so the how-to's button
  // marking it seen cannot flip this page under the player.
  const [seenHowTo] = useState(() => hasSeenHowTo('triage'))

  useEffect(() => {
    if (!seenHowTo) return
    let cancelled = false
    setStatus('loading')
    listTriageDecks()
      .then((rows) => {
        if (cancelled) return
        setDecks(rows)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [seenHowTo])

  if (!seenHowTo) return <Navigate to="/triage/how-to-play" replace />

  const kh = isKhmer ? 'leading-kh' : ''
  const daily = decks.find((d) => d.id === DAILY_DECK_ID)

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <h1 className={`text-title font-bold ${kh}`}>{t('choosePack')}</h1>

        <section className="mt-section flex flex-col gap-stack">
          {status === 'loading' && <ScreenState kind="loading" />}
          {status === 'error' && <ScreenState kind="error" onRetry={() => location.reload()} />}
          {status === 'ready' &&
            TRIAGE_PACKS.map((pack) => {
              const deck = decks.find((d) => d.id === pack.deckId)
              return (
                <PickerCard
                  key={pack.deckId}
                  title={localized(pack.title)}
                  blurb={localized(pack.blurb)}
                  difficulty={pack.difficulty}
                  image={pack.image}
                  icon={pack.icon}
                  meta={deck ? `${deck.cardCount} ${t('cards')}` : undefined}
                  lock={deck ? { kind: 'open', to: `/triage/countdown/${deck.id}` } : { kind: 'coming-soon' }}
                />
              )
            })}
        </section>

        {/* ---- daily challenge ---- */}
        {status === 'ready' && daily && (
          <section className="mt-section">
            <h2 className={`flex items-center gap-stack text-body font-bold ${kh}`}>
              <Star aria-hidden className="h-icon w-icon fill-current text-caution" />
              {t('dailyChallenge')}
            </h2>
            <Link
              to={`/triage/countdown/${daily.id}`}
              className="mt-stack flex items-center gap-stack rounded-card border border-primary bg-surface p-stack
                         transition-colors duration-option-fade hover:bg-surface-alt"
            >
              <img
                src="/triage-step-2.jpg"
                alt=""
                aria-hidden
                className="h-illustration-sm w-illustration-sm shrink-0 rounded-full object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className={`block text-body font-semibold ${kh}`}>
                  {t('todaysCards').replace('{n}', String(daily.cardCount))}
                </span>
                <span className={`flex items-center gap-ring text-small text-muted ${kh}`}>
                  <Timer aria-hidden className="h-icon w-icon" />
                  {t('newEveryMorning')}
                </span>
              </span>
              <span
                className={`tap-target flex shrink-0 items-center justify-center gap-ring rounded-button
                            bg-primary px-stack text-small font-semibold text-primary-text ${kh}`}
              >
                <Play aria-hidden className="h-icon w-icon fill-current" />
                {t('playDaily')}
              </span>
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}
