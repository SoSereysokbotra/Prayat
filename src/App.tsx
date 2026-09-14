/**
 * Phase 1 — Foundation check.
 *
 * This is not a feature screen. It exists to make Gate 1 checkable on a real
 * phone: token opacity, theme flip, Khmer rendering, motion token reads.
 * Phase 3 replaces it with the router and the real screens.
 */
import { useEffect, useState } from 'react'
import ThemeToggle from './components/ThemeToggle'
import { motionToken } from './hooks/useMotionToken'

const MOTION_TOKENS = [
  '--timing-scammer-stagger',
  '--timing-typing-min',
  '--timing-option-fade',
  '--timing-consequence',
  '--timing-route',
]

/* The longest realistic Khmer string in the app is an option button.
   Stacked consonants and below-baseline diacritics are the clipping test. */
const KHMER_SAMPLE =
  'សូមជម្រាបសួរ លោកស្រី នេះគឺជាសេចក្ដីជូនដំណឹងបន្ទាន់ពីក្រសួងពាណិជ្ជកម្ម។'

const KHMER_LONG_OPTION =
  'ចាំបង​ទៅ​ហាង​បន្ទាប់​ពី​ចប់​ការងារ រួច​យើង​មើល​រឿង​នេះ​ជាមួយ​គ្នា កុំ​ទាន់​ធ្វើ​អ្វី​ទាំងអស់។'

export default function App() {
  const [health, setHealth] = useState<'loading' | 'ok' | 'error'>('loading')
  const [uptime, setUptime] = useState<number | null>(null)
  const [motion, setMotion] = useState<Record<string, number>>({})

  useEffect(() => {
    setMotion(Object.fromEntries(MOTION_TOKENS.map((t) => [t, motionToken(t)])))
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/health')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (cancelled) return
        setUptime(typeof data.uptime === 'number' ? Math.round(data.uptime) : null)
        setHealth('ok')
      })
      .catch(() => !cancelled && setHealth('error'))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="min-h-screen bg-bg px-screen-x py-section text-text">
      <ThemeToggle />

      <header className="mb-section">
        <h1 className="text-title font-semibold">Prayat</h1>
        <p className="text-small text-muted">Phase 1 — foundation check</p>
      </header>

      {/* ---- API health ------------------------------------------------- */}
      <Section title="API">
        {health === 'loading' && <p className="text-small text-muted">Checking…</p>}
        {health === 'ok' && (
          <p className="text-small">
            <Dot tone="safe" /> /api/health ok
            {uptime !== null && <span className="text-muted"> · uptime {uptime}s</span>}
          </p>
        )}
        {health === 'error' && (
          <p className="text-small">
            <Dot tone="danger" /> /api/health unreachable — is the server running?
          </p>
        )}
      </Section>

      {/* ---- Opacity modifiers ------------------------------------------ */}
      <Section title="Opacity modifiers">
        <p className="mb-stack text-small text-muted">
          Each block is the same token at a different alpha. If they all look identical,
          the channel-only colour format is broken.
        </p>
        <div className="flex gap-stack">
          <Swatch className="bg-surface" label="100" />
          <Swatch className="bg-surface/75" label="75" />
          <Swatch className="bg-surface/50" label="50" />
          <Swatch className="bg-surface/25" label="25" />
        </div>
      </Section>

      {/* ---- Chat tokens ------------------------------------------------ */}
      <Section title="Chat tokens">
        <div className="flex flex-col gap-stack">
          <div className="rounded-bubble bg-bubble-scammer p-stack text-small">scammer</div>
          <div className="rounded-bubble bg-bubble-auntie p-stack text-small">auntie</div>
          <div className="rounded-bubble bg-bubble-player p-stack text-small">player</div>
          <div className="rounded-card bg-zone-threat p-stack text-small">threat zone</div>
        </div>
      </Section>

      {/* ---- Khmer typography ------------------------------------------- */}
      <Section title="Khmer typography">
        <p className="mb-stack text-small text-muted">
          Diacritics must not clip above or below. Check on a real phone, not here.
        </p>
        <p lang="km" className="mb-stack rounded-card bg-surface p-stack text-body">
          {KHMER_SAMPLE}
        </p>
        <p className="mb-stack text-small text-muted">
          Longest realistic option button — must wrap, never clip or overflow:
        </p>
        <button
          type="button"
          lang="km"
          className="tap-target w-full rounded-button border border-border bg-surface-alt
                     p-stack text-left text-body"
        >
          {KHMER_LONG_OPTION}
        </button>
      </Section>

      {/* ---- Motion tokens ---------------------------------------------- */}
      <Section title="Motion tokens">
        <p className="mb-stack text-small text-muted">
          Read from CSS via getComputedStyle — never duplicated in JS.
        </p>
        <ul className="flex flex-col gap-stack">
          {MOTION_TOKENS.map((t) => (
            <li key={t} className="flex justify-between text-small">
              <code className="text-muted">{t}</code>
              <span>{motion[t] ?? '—'}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- Semantic colours ------------------------------------------- */}
      <Section title="Semantic colours">
        <div className="flex flex-wrap gap-stack">
          <Chip className="bg-primary text-primary-text" label="primary" />
          <Chip className="bg-safe text-primary-text" label="safe" />
          <Chip className="bg-danger text-primary-text" label="danger" />
          <Chip className="bg-caution text-primary-text" label="caution" />
        </div>
        <p className="mt-stack text-small text-muted">
          primary must be visibly distinct from the page background in both themes.
        </p>
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-section rounded-card border border-border bg-surface/50 p-stack">
      <h2 className="mb-stack text-small font-semibold text-muted">{title}</h2>
      {children}
    </section>
  )
}

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-stack">
      <div className={`tap-target w-full rounded-button border border-border ${className}`} />
      <span className="text-small text-muted">{label}</span>
    </div>
  )
}

function Chip({ className, label }: { className: string; label: string }) {
  return (
    <span className={`tap-target flex items-center rounded-button px-stack text-small ${className}`}>
      {label}
    </span>
  )
}

function Dot({ tone }: { tone: 'safe' | 'danger' }) {
  return (
    <span
      aria-hidden
      className={`mr-stack inline-block rounded-bubble p-stack ${
        tone === 'safe' ? 'bg-safe' : 'bg-danger'
      }`}
    />
  )
}
