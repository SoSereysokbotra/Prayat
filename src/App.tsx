import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import Guardian from './pages/Guardian'
import Consequence from './pages/Consequence'
import Debrief from './pages/Debrief'
import { useDocumentLanguage } from './hooks/useDocumentLanguage'

/**
 * Routes.
 *
 * Unknown routes redirect home rather than rendering nothing — a blank screen
 * behind a real link is the worst thing a judge can tap.
 *
 * The two development aids sit behind `import.meta.env.DEV`, which Vite
 * evaluates at build time. A production bundle does not contain them at all —
 * they are tree-shaken out rather than shipped and hidden, so there is no
 * manual deletion step left to forget on demo morning.
 *
 *   npm run dev     theme toggle and /dev/components present
 *   npm run build   neither exists in the output
 */

const DEV = import.meta.env.DEV

const ThemeToggle = DEV ? lazy(() => import('./components/ThemeToggle')) : null
const DevComponents = DEV ? lazy(() => import('./pages/DevComponents')) : null

export default function App() {
  useDocumentLanguage()

  return (
    <BrowserRouter>
      {ThemeToggle && (
        <Suspense fallback={null}>
          <ThemeToggle />
        </Suspense>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coming-soon/:mode" element={<ComingSoon />} />
        <Route path="/guardian" element={<Guardian />} />
        <Route path="/consequence" element={<Consequence />} />
        <Route path="/debrief" element={<Debrief />} />

        {DevComponents && (
          <Route
            path="/dev/components"
            element={
              <Suspense fallback={null}>
                <DevComponents />
              </Suspense>
            }
          />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
