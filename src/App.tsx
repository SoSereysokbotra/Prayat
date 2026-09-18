import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import Guardian from './pages/Guardian'
import ScenarioSelect from './pages/ScenarioSelect'
import ScenarioIntro from './pages/ScenarioIntro'
import Progress from './pages/Progress'
import TriageHowTo from './pages/TriageHowTo'
import TriagePacks from './pages/TriagePacks'
import TriageCountdown from './pages/TriageCountdown'
import Consequence from './pages/Consequence'
import Debrief from './pages/Debrief'
import Triage from './pages/Triage'
import Investigation from './pages/Investigation'
import InvestigationSelect from './pages/InvestigationSelect'
import Welcome from './pages/Welcome'
import WelcomeHow from './pages/WelcomeHow'
import WelcomeWho from './pages/WelcomeWho'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Bootcamp from './pages/bootcamp/Bootcamp'
import Network from './pages/bootcamp/Network'
import BootcampComplete from './pages/bootcamp/BootcampComplete'
import VipClub from './pages/bootcamp/VipClub'
import UrlSorter from './pages/bootcamp/UrlSorter'
import { useDocumentLanguage } from './hooks/useDocumentLanguage'

/**
 * Routes (all route protections removed for free endpoint testing/navigation).
 */

const DEV = import.meta.env.DEV

const DevComponents = DEV ? lazy(() => import('./pages/DevComponents')) : null

export default function App() {
  useDocumentLanguage()

  return (
    <BrowserRouter>
      <Routes>
        {/* ---- Auth / Onboarding ---- */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/welcome/how-it-works" element={<WelcomeHow />} />
        <Route path="/welcome/who-is-it-for" element={<WelcomeWho />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---- Level 0: Bootcamp ---- */}
        <Route path="/bootcamp" element={<Bootcamp />} />
        <Route path="/bootcamp/network" element={<Network />} />
        <Route path="/bootcamp/vip-club" element={<VipClub />} />
        <Route path="/bootcamp/url-sorter" element={<UrlSorter />} />
        <Route path="/bootcamp/complete" element={<BootcampComplete />} />

        {/* ---- Game Modes & Dashboard ---- */}
        <Route path="/" element={<Home />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/coming-soon/:mode" element={<ComingSoon />} />
        <Route path="/guardian" element={<ScenarioSelect />} />
        <Route path="/guardian/:scenarioId" element={<ScenarioIntro />} />
        <Route path="/guardian/:scenarioId/play" element={<Guardian />} />
        <Route path="/triage/how-to-play" element={<TriageHowTo />} />
        <Route path="/triage" element={<TriagePacks />} />
        <Route path="/triage/countdown/:deckId" element={<TriageCountdown />} />
        <Route path="/triage/play/:deckId" element={<Triage />} />
        <Route path="/investigation" element={<InvestigationSelect />} />
        <Route path="/investigation/:investigationId/play" element={<Investigation />} />
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
