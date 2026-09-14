import { useState } from 'react'
import ChatBubble from '../components/ChatBubble'
import ChatWindow from '../components/ChatWindow'
import LanguageToggle from '../components/LanguageToggle'
import OptionButton from '../components/OptionButton'
import TypingIndicator from '../components/TypingIndicator'
import { useLockedChoice } from '../hooks/useLockedChoice'
import { OPTION_IDS } from '../../shared/types'

/**
 * DEV ONLY — the Phase 3.3 sub-gate made checkable.
 *
 * Renders every chat component in isolation, including the longest realistic
 * Khmer option so the wrap can be verified at 375px on a real phone.
 *
 * TO REMOVE (Phase 7):
 *   1. delete this file
 *   2. delete its import and its <Route> in src/App.tsx
 * Nothing else references it.
 */

/* Deliberately long — this is roughly the worst case an option will ever hold. */
const LONG_KH =
  'ចាំ​បង​ទៅ​ហាង​បន្ទាប់​ពី​ចប់​ការងារ រួច​យើង​មើល​រឿង​នេះ​ជាមួយ​គ្នា កុំ​ទាន់​ធ្វើ​អ្វី​ទាំងអស់​សិន​ណា​ពូ។'
const MEDIUM_KH = 'ពូ​កុំ​ទាន់​បង់​លុយ​សិន។ ខ្ញុំ​នឹង​ពិនិត្យ​មើល​ជូន។'
const SHORT_KH = 'អូខេ បង។'

export default function DevComponents() {
  const { choice, select, reset } = useLockedChoice(() => {})
  const [messages, setMessages] = useState(3)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col gap-section px-screen-x py-section">
      <header className="flex items-center justify-between gap-stack">
        <h1 className="text-title font-semibold">Components</h1>
        <LanguageToggle />
      </header>

      <section>
        <h2 className="mb-stack text-small text-muted">Bubble variants</h2>
        <div className="flex flex-col gap-stack rounded-card border border-border p-stack">
          <ChatBubble variant="scammer">{MEDIUM_KH}</ChatBubble>
          <ChatBubble variant="relative">{LONG_KH}</ChatBubble>
          <ChatBubble variant="player">{SHORT_KH}</ChatBubble>
          <TypingIndicator />
          <TypingIndicator variant="scammer" />
        </div>
      </section>

      <section>
        <h2 className="mb-stack text-small text-muted">
          Scrolling window — auto-scrolls to newest
        </h2>
        <ChatWindow
          label="demo"
          dependency={messages}
          tone="threat"
          className="h-chat-pane rounded-card border border-border"
        >
          {Array.from({ length: messages }, (_, i) => (
            <ChatBubble key={i} variant={i % 2 ? 'relative' : 'scammer'}>
              {i + 1}. {MEDIUM_KH}
            </ChatBubble>
          ))}
        </ChatWindow>
        <button
          type="button"
          onClick={() => setMessages((n) => n + 1)}
          className="tap-target mt-stack rounded-button bg-primary px-section text-primary-text"
        >
          Add message
        </button>
      </section>

      <section>
        <h2 className="mb-stack text-small text-muted">
          Options — longest realistic Khmer, must wrap without clipping
        </h2>
        <div className="flex flex-col gap-stack">
          {OPTION_IDS.map((id, i) => (
            <OptionButton
              key={id}
              id={id}
              onSelect={select}
              disabled={choice !== null}
              selected={choice === id}
            >
              {i === 1 ? LONG_KH : i === 2 ? MEDIUM_KH : i === 3 ? LONG_KH : SHORT_KH}
            </OptionButton>
          ))}
        </div>
        <button
          type="button"
          onClick={reset}
          className="tap-target mt-stack rounded-button border border-border px-section text-small text-muted"
        >
          Reset
        </button>
      </section>
    </main>
  )
}
