import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, Gift } from 'lucide-react'
import LanguageToggle from '../../components/LanguageToggle'
import ScreenState from '../../components/ScreenState'
import { useT, useIsKhmer } from '../../hooks/useT'
import { useBootcampStore } from '../../store/bootcampStore'
import { listBootcampModules } from '../../api/client'
import type { BootcampModuleSummary } from '../../../shared/types'

/**
 * Level 0 — Bootcamp Entry Screen.
 *
 * Designed to match the 5-screen flow specification (docs/bootcamp_modify.md):
 *   - Visual hero with Angkor backdrop and glowing 3D Shield Badge emblem
 *   - Clear Level 0 pill and estimated duration
 *   - Tools preview card showing the 3 tools to earn (Shield Badge, Auth Token, Magnifier)
 *   - Direct "BEGIN TRAINING →" CTA to start Module 1
 *   - Direct "Skip (you will not earn the tools)" to enter ScamSim directly
 */
export default function Bootcamp() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const location = useLocation()

  const passed = useBootcampStore((s) => s.passed)
  const skip = useBootcampStore((s) => s.skip)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [modules, setModules] = useState<BootcampModuleSummary[]>([])

  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const kh = isKhmer ? 'leading-kh' : ''

  useEffect(() => {
    let alive = true
    listBootcampModules()
      .then((mods) => {
        if (!alive) return
        setModules(mods)
        setStatus('ready')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [])

  const handleBegin = () => {
    const unpassed = modules.find((m) => !passed.includes(m.id)) ?? modules[0]
    if (unpassed) {
      navigate(`/bootcamp/${unpassed.id}`)
    } else {
      navigate('/bootcamp/vip-club')
    }
  }

  const handleSkip = () => {
    skip()
    navigate('/')
  }

  if (status !== 'ready') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind={status === 'error' ? 'error' : 'loading'} onRetry={() => navigate(0)} />
      </main>
    )
  }

  return (
    <main className="screen-in relative mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-bg">
      {/* ---- Top backdrop & header ---- */}
      <div
        className="relative w-full overflow-hidden pb-section pt-section"
        style={{
          backgroundImage: "url('/topbar.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: '62% 35%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Soft mist overlay so content remains readable over background */}
        <div className="absolute inset-0 bg-bg/25 backdrop-blur-xs" aria-hidden />

        <header className="relative flex items-center justify-between gap-stack px-screen-x">
          <Link
            to={from}
            aria-label={t('back')}
            className="tap-target flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                       border border-border bg-surface/90 text-text shadow-sm backdrop-blur
                       transition-colors duration-option-fade hover:bg-surface"
          >
            <ArrowLeft aria-hidden className="h-icon w-icon" />
          </Link>

          {/* Logo & Brand title */}
          <div className="flex items-center gap-stack">
            <img
              src="/bootcamp/brand_shield_icon.png"
              alt=""
              aria-hidden
              className="h-8 w-auto shrink-0 object-contain"
            />
            <div className="leading-tight">
              <span className="block text-body font-bold text-hero-text">ScamSim</span>
              <span className="block text-small font-medium text-hero-muted leading-none">
                {isKhmer ? t('learnBeforeYouLose') : 'Learn before you lose'}
              </span>
            </div>
          </div>

          <LanguageToggle variant="pill" />
        </header>

        {/* Hero Badge */}
        <div className="relative mt-stack flex justify-center">
          <div className="relative flex items-center justify-center">
            <img
              src="/bootcamp/hero_emblem.png"
              alt="Cyber Bootcamp Badge"
              className="h-28 w-28 object-contain drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* ---- Main content sheet ---- */}
      <div className="flex flex-1 flex-col px-screen-x pb-section pt-stack">
        {/* Level 0 Pill */}
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full bg-primary/15 px-4 py-1 text-small font-bold text-primary">
            {t('levelZero')}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className={`mt-2 text-center text-title font-bold text-text ${kh}`}>
          {t('bootcampTitle')}
        </h1>
        <p className={`mx-auto mt-1 max-w-xs text-center text-body text-muted ${kh}`}>
          {t('bootcampSubtitle')}
        </p>

        {/* Duration badge */}
        <div className={`mt-stack flex items-center justify-center gap-stack text-small font-medium text-muted ${kh}`}>
          <Clock aria-hidden className="h-icon w-icon text-muted shrink-0" />
          <span>{t('bootcampMeta')}</span>
        </div>

        {/* ---- Tools Preview Card ---- */}
        <section className="mt-section rounded-card border border-border bg-surface p-stack shadow-sm">
          <div className="grid grid-cols-3 gap-stack text-center">
            {/* Tool 1 */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center">
                <img
                  src="/bootcamp/tool_shield.png"
                  alt={t('toolShieldBadge')}
                  className="h-16 w-16 object-contain"
                />
              </div>
              <p className={`mt-stack text-small font-semibold text-text ${kh}`}>
                {t('toolShieldBadge')}
              </p>
            </div>

            {/* Tool 2 */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center">
                <img
                  src="/bootcamp/tool_token.png"
                  alt={t('toolAuthenticator')}
                  className="h-16 w-16 object-contain"
                />
              </div>
              <p className={`mt-stack text-small font-semibold text-text ${kh}`}>
                {t('toolAuthenticator')}
              </p>
            </div>

            {/* Tool 3 */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center">
                <img
                  src="/bootcamp/tool_magnifier.png"
                  alt={t('toolMagnifier')}
                  className="h-16 w-16 object-contain"
                />
              </div>
              <p className={`mt-stack text-small font-semibold text-text ${kh}`}>
                {t('toolMagnifier')}
              </p>
            </div>
          </div>

          <div className="my-stack border-t border-border" />

          {/* Gift banner callout */}
          <div className="flex items-center gap-stack px-stack py-1">
            <Gift aria-hidden className="h-icon w-icon shrink-0 text-primary" />
            <p className={`text-small font-medium text-text ${kh}`}>
              {t('bootcampEarnNotice')}
            </p>
          </div>
        </section>

        {/* ---- Bottom Actions ---- */}
        <footer className="mt-auto pt-section flex flex-col items-center gap-stack">
          <button
            type="button"
            onClick={handleBegin}
            className={`tap-target flex w-full items-center justify-center gap-stack rounded-button
                        bg-primary px-section py-stack text-body font-bold text-primary-text shadow-md
                        transition-colors duration-option-fade hover:bg-primary/90 ${kh}`}
          >
            <span>{t('beginTraining')}</span>
            <ArrowRight aria-hidden className="h-icon w-icon" />
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="group mt-stack w-full py-1 text-center transition-colors"
          >
            <span className={`block text-small font-semibold text-muted group-hover:text-text ${kh}`}>
              {t('skip')}
            </span>
            <span className={`block text-small text-muted/80 ${kh}`}>
              {t('skipNoTools')}
            </span>
          </button>
        </footer>
      </div>
    </main>
  )
}
