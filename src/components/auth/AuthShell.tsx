import TopBar from '../TopBar'
import { useIsKhmer } from '../../hooks/useT'

/**
 * The frame every auth screen sits in.
 *
 * The same banner-and-sheet as the rest of the app, so arriving at sign-in
 * from the walkthrough does not feel like leaving the product. One layout
 * for all five screens means the back control and the language toggle never
 * move — a player going sign-in → sign-up → verification is not re-learning
 * where things are at every step.
 *
 * The form sits in a card; the footer (the other ways in) is pinned to the
 * bottom so it stays put whether the form is three fields or one.
 */
export default function AuthShell({
  title,
  subtitle,
  back,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  /** Where the back arrow goes. Omitted on the entry screen. */
  back?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const isKhmer = useIsKhmer()
  const kh = isKhmer ? 'leading-kh' : ''

  return (
    <main className="screen-in flex min-h-dvh w-full flex-col">
      <TopBar back={back} />

      <div className="relative -mt-sheet-overlap mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-section rounded-t-sheet bg-bg px-screen-x pb-section pt-section">
        <section>
          <h1 className={`text-title font-bold ${kh}`}>{title}</h1>
          {subtitle && <p className={`text-body text-muted ${kh}`}>{subtitle}</p>}
        </section>

        <div className="rounded-card border border-border bg-surface p-stack">{children}</div>

        {footer && <div className="mt-auto shrink-0">{footer}</div>}
      </div>
    </main>
  )
}
