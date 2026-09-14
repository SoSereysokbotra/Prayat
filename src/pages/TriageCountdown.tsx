import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'
import { motionToken } from '../hooks/useMotionToken'
import { useLocalized } from '../store/gameStore'
import { DAILY_DECK_ID, TRIAGE_PACKS } from '../lib/triagePacks'

const START_AT = 3

/**
 * Speed Triage — 3 … 2 … 1 … GO!
 *
 * Its own screen, before the game mounts, so the first card's five-second
 * clock does not start until the player is actually looking. Each beat is
 * --timing-countdown-tick; GO! holds for --timing-countdown-go and then the
 * game opens with `replace`, so Back from the game returns to the picker,
 * not to a countdown that would start the run again.
 */
export default function TriageCountdown() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const localized = useLocalized()
  const navigate = useNavigate()
  const { deckId = '' } = useParams<{ deckId: string }>()
  // 3, 2, 1, then 0 = GO!
  const [count, setCount] = useState(START_AT)

  useEffect(() => {
    const tick = motionToken('--timing-countdown-tick')
    const go = motionToken('--timing-countdown-go')
    const id = setTimeout(
      () => (count > 0 ? setCount(count - 1) : navigate(`/triage/play/${deckId}`, { replace: true })),
      count > 0 ? tick : go,
    )
    return () => clearTimeout(id)
  }, [count, deckId, navigate])

  const kh = isKhmer ? 'leading-kh' : ''
  const pack = TRIAGE_PACKS.find((p) => p.deckId === deckId)
  const title = pack ? localized(pack.title) : deckId === DAILY_DECK_ID ? t('dailyChallenge') : t('speedTriage')

  return (
    <main
      aria-live="assertive"
      className="mx-auto flex h-dvh w-full max-w-screen-sm flex-col items-center justify-center gap-section px-screen-x py-section text-center"
    >
      <div className="flex flex-col items-center gap-stack">
        <span
          aria-hidden
          className="flex h-avatar w-avatar items-center justify-center rounded-full bg-primary text-primary-text"
        >
          <Zap className="h-icon w-icon" />
        </span>
        <p className={`text-title font-semibold ${kh}`}>{title}</p>
        <p className={`text-body text-muted ${kh}`}>{t('getReady')}</p>
      </div>

      {/* Keyed on the count so each beat re-runs the pop. */}
      <p
        key={count}
        className={`count-pop text-countdown font-bold tabular-nums leading-none
                    ${count > 0 ? 'text-primary' : 'text-safe'} ${kh}`}
      >
        {count > 0 ? count : t('go')}
      </p>
    </main>
  )
}
