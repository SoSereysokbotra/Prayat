import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import DevComponents from './pages/DevComponents'
import ThemeToggle from './components/ThemeToggle'
import { useDocumentLanguage } from './hooks/useDocumentLanguage'

/**
 * Routes.
 *
 * Screens land one at a time (Phase 3.1 → 3.6). Unbuilt routes redirect home
 * rather than rendering nothing — a blank screen behind a real link is the
 * worst thing a judge can tap.
 */
export default function App() {
  useDocumentLanguage()

  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/coming-soon/:mode" element={<ComingSoon />} />

        {/* Phase 3.4 */}
        <Route path="/guardian" element={<Navigate to="/" replace />} />

        {/* Phase 3.5 / 3.6 */}
        <Route path="/consequence" element={<Navigate to="/" replace />} />
        <Route path="/debrief" element={<Navigate to="/" replace />} />

        {/* DEV ONLY — removed in Phase 7 with ThemeToggle */}
        <Route path="/dev/components" element={<DevComponents />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
