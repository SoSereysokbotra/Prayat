import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Flag, Home, Lightbulb, ListChecks, RotateCcw, Share2, ShieldCheck, ShieldX, Star, Trophy } from 'lucide-react'
import RedFlagCard from '../components/RedFlagCard'
import ScreenState from '../components/ScreenState'
import TopBar from '../components/TopBar'
import { useT, useIsKhmer } from '../hooks/useT'
import { useGameStore } from '../store/gameStore'
import { getDebrief } from '../api/client'
import { SCENARIO_ROSTER } from '../lib/scenarioRoster'
import type { Level, SessionSummary } from '../../shared/types'
import type { UIKey } from '../i18n/ui'

const LEVEL_KEY: Record<Level, UIKey> = {
  Aware: 'levelAware',
  Alert: 'levelAlert',
  Defender: 'levelDefender',
  Guardian: 'levelGuardian',
  Protector: 'levelProtector',
}

/**
 * The debrief.
 *
 * The design doc calls this the most important screen in the platform, and it
 * is the answer to "why pay when YouTube is free" — free content tells you
 * scams exist, this tells you why *you* would have clicked.
 *
 * Same banner-and-sheet as the rest of the app, then in this order: the
 * outcome with the relative's face, name the scam (with its artwork), the
 * three red flags, the one rule, what to do in real life, the score. The
 * rule is the heaviest element on the screen because it is the part a
 * player carries into Tuesday.
 */
export default function Debrief() {
  const navigate = useNavigate()
  const t = useT()
  const isKhmer = useIsKhmer()
  const language = useGameStore((s) => s.language)
  const sessionId = useGameStore((s) => s.sessionId)
  const relative = useGameStore((s) => s.activeRelative)
  const addScore = useGameStore((s) => s.addScore)
  const activeScamType = useGameStore((s) => s.activeScamType)
  const recordGuardianResult = useGameStore((s) => s.recordGuardianResult)

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
          if (activeScamType) recordGuardianResult(activeScamType, result.score, result.maxScore)
        }
      })
      .catch(() => alive && setStatus('error'))

    return () => {
      alive = false
    }
  }, [sessionId, addScore, activeScamType, recordGuardianResult])

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
  const roster = SCENARIO_ROSTER.find((r) => r.scamType === activeScamType)
  const fraction = summary.maxScore > 0 ? summary.score / summary.maxScore : 0

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back="/" />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        {/* ---- outcome: the relative's face and what happened to him ---- */}
        <section
          className={`flex items-center gap-stack rounded-card border p-stack ${
            won ? 'border-safe bg-safe/10' : 'border-danger bg-danger/10'
          }`}
        >
          <span className="relative shrink-0">
            {relative ? (
              <img
                src={`/avatar-${relative.avatar}.jpg`}
                alt=""
                aria-hidden
                className={`h-illustration w-illustration rounded-full border object-cover ${won ? 'border-safe' : 'border-danger grayscale'}`}
              />
            ) : (
              <span className="block h-illustration w-illustration rounded-full bg-surface-alt" />
            )}
            <span
              aria-hidden
              className={`absolute bottom-0 right-0 flex h-avatar w-avatar items-center justify-center rounded-full border border-surface text-primary-text ${
                won ? 'bg-safe' : 'bg-danger'
              }`}
            >
              {won ? <ShieldCheck className="h-icon w-icon" /> : <ShieldX className="h-icon w-icon" />}
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <h1 className={`text-title font-bold ${won ? 'text-safe' : 'text-danger'} ${kh}`}>
              {won ? t('debriefWinTitle') : t('debriefLoseTitle')}
            </h1>
            <p className={`mt-ring text-small text-muted ${kh}`}>{won ? d.outcomeWin[language] : d.outcomeLose[language]}</p>
          </div>
        </section>

        {/* ---- 1. name the scam ---- */}
        <section>
          <h2 className={`mb-stack text-small font-semibold text-muted ${kh}`}>{t('whatScamHeading')}</h2>
          <div className="flex items-center gap-stack rounded-card border border-border bg-surface p-stack">
            {roster && (
              <img src={roster.image} alt="" aria-hidden className="h-illustration-sm w-illustration-sm shrink-0 rounded-full object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-body font-bold ${kh}`}>{d.scamName[language]}</p>
              {roster && (
                <p className="mt-ring flex items-center gap-ring" aria-label={`${roster.difficulty}`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden
                      className={`h-icon w-icon ${i < roster.difficulty ? 'fill-current text-caution' : 'text-border'}`}
                    />
                  ))}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ---- 2. the three red flags ---- */}
        <section>
          <h2 className={`mb-stack flex items-center gap-ring text-small font-semibold text-muted ${kh}`}>
            <Flag aria-hidden className="h-icon w-icon text-danger" />
            {t('redFlagsHeading')}
          </h2>
          <ul className="flex flex-col gap-stack">
            {d.redFlags.map((flag, i) => (
              <RedFlagCard key={i} index={i + 1}>
                {flag[language]}
              </RedFlagCard>
            ))}
          </ul>
        </section>

        {/* ---- 3. the one rule — the heaviest element on the screen ---- */}
        <section className="flex items-start gap-stack rounded-card border border-caution bg-caution/10 p-stack">
          <span aria-hidden className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-caution text-primary-text">
            <Lightbulb className="h-icon w-icon" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className={`text-small font-semibold text-caution ${kh}`}>{t('ruleHeading')}</h2>
            <p className={`mt-ring text-rule font-bold ${kh}`}>{d.rule[language]}</p>
          </div>
        </section>

        {/* ---- 4. what to do in real life ---- */}
        <section className="flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
          <span aria-hidden className="flex h-avatar w-avatar shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <ListChecks className="h-icon w-icon" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className={`text-small font-semibold text-muted ${kh}`}>{t('realLifeHeading')}</h2>
            <p className={`mt-ring text-body ${kh}`}>{d.realLifeAction[language]}</p>
          </div>
        </section>

        {/* ---- score ---- */}
        <section className="rounded-card border border-border bg-surface p-stack">
          <div className="flex items-center justify-between gap-stack">
            <span className={`flex items-center gap-ring text-small font-semibold text-muted ${kh}`}>
              <Trophy aria-hidden className="h-icon w-icon text-caution" />
              {t('scoreThisRound')}
            </span>
            <span className="text-title font-bold tabular-nums">
              {summary.score} <span className="text-small font-semibold text-muted">/ {summary.maxScore}</span>
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={summary.score}
            aria-valuemin={0}
            aria-valuemax={summary.maxScore}
            className="mt-stack h-timer-bar w-full overflow-hidden rounded-button bg-surface-alt"
          >
            <div className={`h-full rounded-button ${won ? 'bg-safe' : 'bg-caution'}`} style={{ width: `${fraction * 100}%` }} />
          </div>
          <p className={`mt-stack flex items-center gap-ring text-small text-muted ${kh}`}>
            {t('level')}: <span className="rounded-button bg-primary/15 px-stack py-ring font-semibold text-primary">{t(LEVEL_KEY[summary.level])}</span>
          </p>
        </section>

        {/* ---- actions ---- */}
        <div className="mt-auto flex flex-col gap-stack">
          {/* Prominent because it earns its place twice: it is the teaching
              moment and it is the distribution channel. */}
          <button
            type="button"
            onClick={share}
            className={`tap-target flex items-center justify-center gap-stack rounded-button
                        bg-primary px-section text-body font-bold text-primary-text transition-colors duration-option-fade ${kh}`}
          >
            <Share2 aria-hidden className="h-icon w-icon" />
            {copied ? t('shareCopied') : t('shareToFamily')}
          </button>

          <Link
            to="/guardian"
            className={`tap-target flex items-center justify-center gap-stack rounded-button
                        border border-border bg-surface px-section text-body font-semibold transition-colors duration-option-fade ${kh}`}
          >
            <RotateCcw aria-hidden className="h-icon w-icon" />
            {t('playAgain')}
          </Link>

          <Link
            to="/"
            className={`tap-target flex items-center justify-center gap-stack rounded-button
                        px-section text-small font-semibold text-muted transition-colors duration-option-fade ${kh}`}
          >
            <Home aria-hidden className="h-icon w-icon" />
            {t('backHome')}
          </Link>
        </div>
      </div>
    </main>
  )
}
