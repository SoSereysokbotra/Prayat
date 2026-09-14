/**
 * DEV ONLY — proves that .theme-light flips the entire app with zero
 * component changes.
 *
 * TO REMOVE (Phase 7):
 *   1. delete this file
 *   2. delete its import in src/App.tsx
 *   3. delete the single <ThemeToggle /> line in src/App.tsx
 * Nothing else references it.
 */
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [light, setLight] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', light)
  }, [light])

  return (
    <button
      type="button"
      onClick={() => setLight((v) => !v)}
      aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
      className="tap-target fixed bottom-stack right-stack z-50 flex items-center
                 justify-center gap-stack rounded-button border border-border
                 bg-surface px-stack text-small text-muted shadow-lg"
    >
      {light ? <Moon size={16} /> : <Sun size={16} />}
      <span>{light ? 'dark' : 'light'}</span>
    </button>
  )
}
