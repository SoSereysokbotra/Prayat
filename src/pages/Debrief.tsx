import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Check, Home, RotateCcw, Share2, X } from 'lucide-react'
import LanguageToggle from '../components/LanguageToggle'
import RedFlagCard from '../components/RedFlagCard'
import ScreenState from '../components/ScreenState'
import { useT, useIsKhmer } from '../hooks/useT'
import { useGameStore } from '../store/gameStore'
import { getDebrief } from '../api/client'
import type { SessionSummary } from '../../shared/types'

/**
 * The debrief.
 *
 * The design doc calls this the most important screen in the platform, and it
 * is the answer to "why pay when YouTube is free" — free content tells you
 * scams exist, this tells you why *you* would have clicked.
 *
 * Four blocks, in this order: name the scam, the three red flags, the one
 * rule, what to do in real life. The rule is the heaviest element on the
 * screen because it is the part a player carries into Tuesday.
 */
export default function Debrief() {
  const navigate = useNavigate()
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const sessionId = useGameStore((s) => s.sessionId)
  const addScore = useGameStore((s) => s.addScore)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [copied, setCopied] = useState(false)

  // A session's points are banked once. Without this, React StrictMode's
  // double-invoked effects — and any re-render — would bank them twice.
  const banked = useRef(false)

  useEffect(() => {
    if (!sessionId) return
    let alive = true

    getDebrief(sessionId)
      .then((result) => {
        if (!alive) return
        setSummary(result)
        setStatus('ready')
        if (!banked.current) {
          banked.current = true
          addScore(result.score)
        }
      })
      .catch(() => alive && setStatus('error'))

    return () => {
      alive = false
    }
  }, [sessionId, addScore])

  const share = useCallback(async () => {
    if (!summary) return
    const d = summary.debrief
    const text = [
      d.scamName[language],
      '',
      ...d.redFlags.map((f, i) => `${i + 1}. ${f[language]}`),
      '',
      d.rule[language],
    ].join('\n')

    try {
      if (navigator.share) {
        await navigator.share({ text })
        return
      }
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // The player cancelled the share sheet, or the browser refused the
      // clipboard. Neither is an error worth showing.
    }
  }, [summary, language])

  if (!sessionId) return <Navigate to="/" replace />

  if (status !== 'ready' || !summary) {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind={status === 'error' ? 'error' : 'loading'} onRetry={() => navigate('/')} />
      </main>
    )
  }

  const d = summary.debrief
  const kh = isKhmer ? 'leading-kh' : ''
  const won = summary.won

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col gap-section px-screen-x py-section">
      <header className="flex items-center justify-end">
        <LanguageToggle />
      </header>

      {/* ---- outcome ---- */}
      <section
        className={`flex items-start gap-stack rounded-card p-stack ${
          won ? 'bg-safe' : 'bg-danger'
        } text-primary-text`}
      >
        <span aria-hidden className="flex shrink-0 items-center justify-center">
          {won ? <Check className="h-icon w-icon" /> : <X className="h-icon w-icon" />}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className={`text-title font-semibold ${kh}`}>
            {won ? t('debriefWinTitle') : t('debriefLoseTitle')}
          </h1>
          <p className={`text-small ${kh}`}>{won ? d.outcomeWin[language] : d.outcomeLose[language]}</p>
        </div>
      </section>

      {/* ---- 1. name the scam ---- */}
      <section>
        <h2 className={`mb-stack text-small text-muted ${kh}`}>{t('whatScamHeading')}</h2>
        <p className={`rounded-card border border-border bg-surface p-stack text-title font-semibold ${kh}`}>
          {d.scamName[language]}
        </p>
      </section>

      {/* ---- 2. the three red flags ---- */}
      <section>
        <h2 className={`mb-stack text-small text-muted ${kh}`}>{t('redFlagsHeading')}</h2>
        <ul className="flex flex-col gap-stack">
          {d.redFlags.map((flag, i) => (
            <RedFlagCard key={i} index={i + 1}>
              {flag[language]}
            </RedFlagCard>
          ))}
        </ul>
      </section>

      {/* ---- 3. the one rule — the heaviest element on the screen ---- */}
      <section>
        <h2 className={`mb-stack text-small text-muted ${kh}`}>{t('ruleHeading')}</h2>
        <p
          className={`rounded-card border border-caution bg-surface p-section text-rule font-semibold ${kh}`}
        >
          {d.rule[language]}
        </p>
      </section>

      {/* ---- 4. what to do in real life ---- */}
      <section>
        <h2 className={`mb-stack text-small text-muted ${kh}`}>{t('realLifeHeading')}</h2>
        <p className={`rounded-card border border-border bg-surface p-stack text-body ${kh}`}>
          {d.realLifeAction[language]}
        </p>
      </section>

      {/* ---- score ---- */}
      <section className="flex items-baseline justify-between gap-stack rounded-card border border-border bg-surface p-stack">
        <span className={`text-small text-muted ${kh}`}>{t('scoreThisRound')}</span>
        <span className="text-title font-semibold tabular-nums">
          {summary.score} / {summary.maxScore}
        </span>
      </section>

      {/* ---- actions ---- */}
      <div className="flex flex-col gap-stack">
        {/* Prominent because it earns its place twice: it is the teaching
            moment and it is the distribution channel. */}
        <button
          type="button"
          onClick={share}
          className={`tap-target flex items-center justify-center gap-stack rounded-button
                      bg-primary px-section text-primary-text transition-colors duration-option-fade ${kh}`}
        >
          <Share2 aria-hidden className="h-icon w-icon" />
          {copied ? t('shareCopied') : t('shareToFamily')}
        </button>

        <Link
          to="/guardian"
          className={`tap-target flex items-center justify-center gap-stack rounded-button
                      border border-border bg-surface px-section transition-colors duration-option-fade ${kh}`}
        >
          <RotateCcw aria-hidden className="h-icon w-icon" />
          {t('playAgain')}
        </Link>

        <Link
          to="/"
          className={`tap-target flex items-center justify-center gap-stack rounded-button
                      px-section text-muted transition-colors duration-option-fade ${kh}`}
        >
          <Home aria-hidden className="h-icon w-icon" />
          {t('backHome')}
        </Link>
      </div>
    </main>
  )
}
