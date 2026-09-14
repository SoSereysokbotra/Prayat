import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Globe, Search, Trash2, X } from 'lucide-react'
import LanguageToggle from '../../components/LanguageToggle'
import ScreenState from '../../components/ScreenState'
import { useT, useIsKhmer } from '../../hooks/useT'
import { useGameStore } from '../../store/gameStore'
import { useBootcampStore } from '../../store/bootcampStore'
import { sortUrl, startUrlSorter } from '../../api/client'
import { BOOTCAMP_PASS_RATIO, type Localized, type UrlCard } from '../../../shared/types'

/**
 * Module 2 — The URL Sorter.
 *
 * Safe or trash, one address at a time.
 *
 * The URL is rendered LARGE and in a monospace-ish tabular face, because the
 * whole skill is reading it character by character: `faceb00k` and `rnicrosoft`
 * only give themselves away when the glyphs are big enough to separate. A
 * realistic tiny address bar would be a better simulation and a worse teacher,
 * and this is the module where teaching wins.
 *
 * The URL itself is never localized and never backfilled with placeholder
 * text. Everything else in the app falls back to sample Khmer when unwritten;
 * a URL must not, because a fake address presented as real is the one mistake
 * this module cannot make.
 */

type Phase = 'loading' | 'sorting' | 'feedback' | 'done' | 'error'

interface Feedback {
  isCorrect: boolean
  wasSafe: boolean
  explanation: Localized
}

export default function UrlSorter() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const language = useGameStore((s) => s.language)
  const markPassed = useBootcampStore((s) => s.markPassed)

  const [phase, setPhase] = useState<Phase>('loading')
  const [card, setCard] = useState<UrlCard | null>(null)
  const [cardCount, setCardCount] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [passed, setPassed] = useState(false)

  const sessionRef = useRef<string | null>(null)
  const aliveRef = useRef(true)
  const lockRef = useRef(false)

  const kh = isKhmer ? 'leading-kh' : ''

  useEffect(() => {
    aliveRef.current = true
    startUrlSorter()
      .then((run) => {
        if (!aliveRef.current) return
        sessionRef.current = run.sessionId
        setCard(run.card)
        setCardCount(run.cardCount)
        lockRef.current = false
        setPhase('sorting')
      })
      .catch(() => aliveRef.current && setPhase('error'))
    return () => {
      aliveRef.current = false
    }
  }, [])

  const sort = useCallback(
    async (verdict: 'safe' | 'trash') => {
      if (lockRef.current) return
      lockRef.current = true

      const sessionId = sessionRef.current
      const current = card
      if (!sessionId || !current) return

      try {
        const result = await sortUrl(sessionId, current.id, verdict)
        if (!aliveRef.current) return

        setFeedback({
          isCorrect: result.isCorrect,
          wasSafe: result.wasSafe,
          explanation: result.explanation,
        })
        setAnswered(result.answered)
        setCorrect(result.correctSoFar)

        if (result.done) {
          setPassed(result.passed)
          if (result.passed) markPassed('url-sorter')
          setPhase('done')
        } else {
          setCard(result.nextCard)
          setPhase('feedback')
        }
      } catch {
        if (!aliveRef.current) return
        setPhase('error')
      }
    },
    [card, markPassed],
  )

  function nextCard() {
    setFeedback(null)
    lockRef.current = false
    setPhase('sorting')
  }

  if (phase === 'loading' || phase === 'error') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind={phase === 'error' ? 'error' : 'loading'} onRetry={() => navigate(0)} />
      </main>
    )
  }

  /* ---- finished ---- */
  if (phase === 'done') {
    return (
      <main className="screen-in mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col justify-center gap-section px-screen-x py-section text-center">
        <span
          aria-hidden
          className={`mx-auto flex items-center justify-center rounded-card p-section text-primary-text
                      ${passed ? 'bg-safe' : 'bg-danger'}`}
        >
          <Search className="h-icon w-icon" />
        </span>

        <h1 className={`text-title font-semibold ${kh}`}>
          {passed ? t('modulePassed') : t('moduleFailed')}
        </h1>

        <p className="text-title font-semibold tabular-nums">
          {correct} / {cardCount}
        </p>
        <p className={`text-small text-muted ${kh}`}>
          {t('passMark')} {Math.round(BOOTCAMP_PASS_RATIO * 100)}%
        </p>

        {passed && (
          <p className={`flex items-center justify-center gap-stack text-body ${kh}`}>
            <Search aria-hidden className="h-icon w-icon text-safe" />
            {t('toolUnlocked')}: <span className="font-semibold">{t('toolMagnifier')}</span>
          </p>
        )}

        <div className="flex flex-col gap-stack">
          {!passed && (
            <button
              type="button"
              onClick={() => navigate(0)}
              className={`tap-target flex items-center justify-center rounded-button bg-primary
                          px-section text-primary-text ${kh}`}
            >
              {t('tryModuleAgain')}
            </button>
          )}
          <Link
            to="/bootcamp"
            className={`tap-target flex items-center justify-center rounded-button
                        ${passed ? 'bg-primary text-primary-text' : 'border border-border bg-surface'}
                        px-section ${kh}`}
          >
            {t('backToBootcamp')}
          </Link>
        </div>
      </main>
    )
  }

  if (!card) return null

  return (
    <main className="screen-in mx-auto flex h-dvh w-full max-w-screen-sm flex-col px-screen-x py-section">
      <header className="flex shrink-0 items-center justify-between gap-stack">
        <Link to="/bootcamp" className="tap-target flex items-center gap-stack text-small text-muted">
          <ArrowLeft aria-hidden className="h-icon w-icon" />
          <span className={kh}>{t('back')}</span>
        </Link>
        <span className="text-small text-muted tabular-nums">
          {answered} / {cardCount}
        </span>
        <LanguageToggle compact />
      </header>

      {/* ---- the address ---- */}
      <section className="flex min-h-0 flex-1 flex-col justify-center gap-section py-section">
        <div className="flex items-center gap-stack rounded-card border border-input-border bg-input p-stack">
          <Globe aria-hidden className="h-icon w-icon shrink-0 text-muted" />
          {/* Large and break-all: the skill is reading it character by
              character, and a wrapped address is better than a truncated one. */}
          <span className="min-w-0 flex-1 break-all text-title font-semibold tabular-nums">
            {card.url}
          </span>
        </div>

        {phase === 'feedback' && feedback && (
          <div
            className={`bubble-in flex flex-col gap-stack rounded-card border bg-surface p-stack
                        ${feedback.isCorrect ? 'border-safe' : 'border-danger'}`}
          >
            <p className="flex items-center gap-stack text-small font-semibold">
              {feedback.isCorrect ? (
                <Check aria-hidden className="h-icon w-icon text-safe" />
              ) : (
                <X aria-hidden className="h-icon w-icon text-danger" />
              )}
              <span className={kh}>{feedback.wasSafe ? t('thatOneWasSafe') : t('thatOneWasFake')}</span>
            </p>
            <p className={`text-body ${kh}`}>{feedback.explanation[language]}</p>
          </div>
        )}
      </section>

      {/* ---- sort it ---- */}
      <section className="shrink-0">
        {phase === 'feedback' ? (
          <button
            type="button"
            onClick={nextCard}
            className={`tap-target flex w-full items-center justify-center rounded-button bg-primary
                        px-section text-primary-text ${kh}`}
          >
            {t('nextCard')}
          </button>
        ) : (
          <div className="flex gap-stack">
            <button
              type="button"
              onClick={() => sort('safe')}
              className={`tap-target flex flex-1 items-center justify-center gap-stack rounded-button
                          bg-verdict-real px-section text-primary-text ${kh}`}
            >
              <Check aria-hidden className="h-icon w-icon" />
              {t('sortSafe')}
            </button>
            <button
              type="button"
              onClick={() => sort('trash')}
              className={`tap-target flex flex-1 items-center justify-center gap-stack rounded-button
                          bg-verdict-scam px-section text-primary-text ${kh}`}
            >
              <Trash2 aria-hidden className="h-icon w-icon" />
              {t('sortTrash')}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
