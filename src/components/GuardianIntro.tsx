import { Eye, MessageCircle, ShieldCheck } from 'lucide-react'
import { useT, useIsKhmer } from '../hooks/useT'

/**
 * The one thing a first-time player must understand before the scam starts.
 *
 * Guardian's whole mechanic is that you have NO access to the scammer — only
 * to the person already half convinced. Dropped straight into two stacked
 * chat panes, a new player reasonably assumes the top one is theirs to reply
 * in, tries, and learns the rule by being confused.
 *
 * Three lines and a button fixes that. It costs four seconds and it is the
 * difference between "why can't I type up there" and understanding the point
 * of the game.
 */
export default function GuardianIntro({ onStart }: { onStart: () => void }) {
  const t = useT()
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <div className="screen-in mx-auto flex h-dvh w-full max-w-screen-sm flex-col justify-center gap-section px-screen-x py-section">
      <div className="flex flex-col items-center gap-stack text-center">
        <span
          aria-hidden
          className="flex items-center justify-center rounded-card bg-primary p-section text-primary-text"
        >
          <ShieldCheck className="h-icon w-icon" />
        </span>
        <h1 className={`text-title font-semibold ${kh}`}>{t('guardianMode')}</h1>
      </div>

      <ul className="flex flex-col gap-stack">
        <li className="flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
          <Eye aria-hidden className="h-icon w-icon shrink-0 text-danger" />
          <p className={`min-w-0 flex-1 text-body ${kh}`}>{t('introWatchOnly')}</p>
        </li>
        <li className="flex items-start gap-stack rounded-card border border-border bg-surface p-stack">
          <MessageCircle aria-hidden className="h-icon w-icon shrink-0 text-primary" />
          <p className={`min-w-0 flex-1 text-body ${kh}`}>{t('introYouAdvise')}</p>
        </li>
      </ul>

      <p className={`text-center text-rule font-semibold ${kh}`}>{t('introSheIsConvinced')}</p>

      <button
        type="button"
        onClick={onStart}
        className={`tap-target flex items-center justify-center rounded-button bg-primary
                    px-section text-primary-text ${kh}`}
      >
        {t('introBegin')}
      </button>
    </div>
  )
}
