import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronRight, DoorOpen, KeyRound, Link2, Lock, Search } from 'lucide-react'
import LanguageToggle from '../../components/LanguageToggle'
import ScreenState from '../../components/ScreenState'
import { useT, useIsKhmer } from '../../hooks/useT'
import { useGameStore } from '../../store/gameStore'
import { useBootcampStore, useBootcampComplete } from '../../store/bootcampStore'
import { listBootcampModules } from '../../api/client'
import type { BootcampModuleId, BootcampModuleSummary, ToolId } from '../../../shared/types'

/**
 * Level 0 — the bootcamp hub.
 *
 * Mandatory, so this is where a new player lands before the game modes open.
 * It has to justify itself in the first two seconds: the header says what is
 * being unlocked and why, rather than presenting itself as homework.
 *
 * Each module shows the TOOL it grants, not a score. That is the whole design
 * — you are not being graded, you are being equipped, and the Magnifying Glass
 * really does work inside The Investigation afterwards.
 */

const MODULE_ICON: Record<BootcampModuleId, typeof DoorOpen> = {
  'vip-club': DoorOpen,
  'url-sorter': Link2,
}

const TOOL_ICON: Record<ToolId, typeof KeyRound> = {
  'authenticator-token': KeyRound,
  'magnifying-glass': Search,
}

const TOOL_NAME: Record<ToolId, 'toolAuthenticator' | 'toolMagnifier'> = {
  'authenticator-token': 'toolAuthenticator',
  'magnifying-glass': 'toolMagnifier',
}

export default function Bootcamp() {
  const t = useT()
  const isKhmer = useIsKhmer()
  const navigate = useNavigate()
  const language = useGameStore((s) => s.language)
  const passed = useBootcampStore((s) => s.passed)
  const complete = useBootcampComplete()

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [modules, setModules] = useState<BootcampModuleSummary[]>([])

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

  const kh = isKhmer ? 'leading-kh' : ''

  if (status !== 'ready') {
    return (
      <main className="flex h-dvh flex-col px-screen-x py-section">
        <ScreenState kind={status === 'error' ? 'error' : 'loading'} onRetry={() => navigate(0)} />
      </main>
    )
  }

  return (
    <main className="screen-in mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col px-screen-x py-section">
      <header className="flex items-start justify-between gap-stack">
        <div className="min-w-0">
          <p className={`text-small font-semibold text-primary ${kh}`}>{t('levelZero')}</p>
          <h1 className={`text-title font-semibold ${kh}`}>{t('bootcampTitle')}</h1>
        </div>
        <LanguageToggle />
      </header>

      <p className={`mt-stack text-body text-muted ${kh}`}>{t('bootcampIntro')}</p>

      <section className="mt-section flex flex-1 flex-col gap-stack">
        {modules.map((module) => {
          const Icon = MODULE_ICON[module.id]
          const ToolIcon = TOOL_ICON[module.tool]
          const isPassed = passed.includes(module.id)

          return (
            <Link
              key={module.id}
              to={`/bootcamp/${module.id}`}
              className={`flex flex-col gap-stack rounded-card border p-stack
                          transition-colors duration-option-fade
                          ${isPassed ? 'border-safe bg-surface' : 'border-border bg-surface hover:bg-surface-alt'}`}
            >
              <div className="flex items-start gap-stack">
                <span
                  aria-hidden
                  className={`flex shrink-0 items-center justify-center rounded-button p-stack
                              ${isPassed ? 'bg-safe text-primary-text' : 'bg-surface-alt text-text'}`}
                >
                  {isPassed ? <Check className="h-icon w-icon" /> : <Icon className="h-icon w-icon" />}
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className={`text-body font-semibold ${kh}`}>{module.title[language]}</h2>
                  <p className={`text-small text-muted ${kh}`}>{module.analogy[language]}</p>
                </div>

                <ChevronRight aria-hidden className="h-icon w-icon shrink-0 text-muted" />
              </div>

              {/* The reward is a tool, not a mark. */}
              <p
                className={`flex items-center gap-stack rounded-button border border-border
                            bg-surface-alt px-stack py-stack text-small ${kh}`}
              >
                <ToolIcon
                  aria-hidden
                  className={`h-icon w-icon shrink-0 ${isPassed ? 'text-safe' : 'text-muted'}`}
                />
                <span className="min-w-0 flex-1 text-muted">
                  {isPassed ? t('toolUnlocked') : t('unlocks')}
                </span>
                <span className="shrink-0 font-semibold">{t(TOOL_NAME[module.tool])}</span>
              </p>
            </Link>
          )
        })}
      </section>

      <footer className="mt-section shrink-0">
        {complete ? (
          <Link
            to="/"
            className={`tap-target flex w-full items-center justify-center gap-stack rounded-button
                        bg-primary px-section text-primary-text ${kh}`}
          >
            <Check aria-hidden className="h-icon w-icon" />
            {t('bootcampDoneAction')}
          </Link>
        ) : (
          <p
            className={`flex items-center justify-center gap-stack rounded-card border border-border
                        bg-surface p-stack text-center text-small text-muted ${kh}`}
          >
            <Lock aria-hidden className="h-icon w-icon shrink-0" />
            {t('bootcampLocked')}
          </p>
        )}
      </footer>
    </main>
  )
}
