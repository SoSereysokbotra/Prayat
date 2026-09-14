import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import Guardian from './pages/Guardian'
import Consequence from './pages/Consequence'
import Debrief from './pages/Debrief'
import Triage from './pages/Triage'
import Investigation from './pages/Investigation'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Bootcamp from './pages/bootcamp/Bootcamp'
import VipClub from './pages/bootcamp/VipClub'
import UrlSorter from './pages/bootcamp/UrlSorter'
import RequireAuth from './components/RequireAuth'
import RequireBootcamp from './components/RequireBootcamp'
import RedirectIfSignedIn from './components/RedirectIfSignedIn'
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
        {/* ---- public: the auth screens ----
            Already signed in, these bounce home. Without that, pressing back
            after signing in lands on the sign-in form again, which reads as
            though the sign-in did not work.

            Password reset is deliberately NOT bounced: someone signed in on
            this device still has to be able to follow a reset link. */}
        <Route
          path="/signin"
          element={
            <RedirectIfSignedIn>
              <SignIn />
            </RedirectIfSignedIn>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfSignedIn>
              <SignUp />
            </RedirectIfSignedIn>
          }
        />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---- Level 0 ----
            Behind sign-in, but deliberately NOT behind the bootcamp gate —
            gating the bootcamp on the bootcamp is a locked door with the key
            inside. */}
        <Route
          path="/bootcamp"
          element={
            <RequireAuth>
              <Bootcamp />
            </RequireAuth>
          }
        />
        <Route
          path="/bootcamp/vip-club"
          element={
            <RequireAuth>
              <VipClub />
            </RequireAuth>
          }
        />
        <Route
          path="/bootcamp/url-sorter"
          element={
            <RequireAuth>
              <UrlSorter />
            </RequireAuth>
          }
        />

        {/* ---- protected: everything else ----
            A signed-out visitor opening any of these URLs directly lands on
            sign-in first, and is returned here afterwards. */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <RequireBootcamp>
                <Home />
              </RequireBootcamp>
            </RequireAuth>
          }
        />
        <Route
          path="/coming-soon/:mode"
          element={
            <RequireAuth>
              <RequireBootcamp>
                <ComingSoon />
              </RequireBootcamp>
            </RequireAuth>
          }
        />
        <Route
          path="/guardian"
          element={
            <RequireAuth>
              <RequireBootcamp>
                <Guardian />
              </RequireBootcamp>
            </RequireAuth>
          }
        />
        <Route
          path="/triage"
          element={
            <RequireAuth>
              <RequireBootcamp>
                <Triage />
              </RequireBootcamp>
            </RequireAuth>
          }
        />
        <Route
          path="/investigation"
          element={
            <RequireAuth>
              <RequireBootcamp>
                <Investigation />
              </RequireBootcamp>
            </RequireAuth>
          }
        />
        <Route
          path="/consequence"
          element={
            <RequireAuth>
              <RequireBootcamp>
                <Consequence />
              </RequireBootcamp>
            </RequireAuth>
          }
        />
        <Route
          path="/debrief"
          element={
            <RequireAuth>
              <RequireBootcamp>
                <Debrief />
              </RequireBootcamp>
            </RequireAuth>
          }
        />

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
