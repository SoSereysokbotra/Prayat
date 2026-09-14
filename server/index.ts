/**
 * Prayat API — Phase 1 skeleton.
 *
 * Phase 4 adds scenarios, sessions, decisions and the answer-stripping layer.
 * For now this exists so /api/health is live on the Render URL from day 1,
 * and so the Express catch-all that serves the SPA is registered correctly
 * (AFTER the API router) before anything is built on top of it.
 */
import express from 'express'
import path from 'node:path'
import fs from 'node:fs'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(express.json())

/* ---- API ---------------------------------------------------------------- */
const api = express.Router()

api.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    scenariosLoaded: 0, // Phase 4 seeds content and reports the real count
  })
})

app.use('/api', api)

/* ---- Static SPA --------------------------------------------------------- */
/* Registered AFTER the API router. The catch-all below is what stops
   /guardian from 404-ing when a judge refreshes or scans a QR code pointing
   at a sub-route. If it were registered first it would swallow /api/*. */
const distDir = path.resolve(process.cwd(), 'dist')

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
} else {
  app.get('*', (_req, res) => {
    res
      .status(200)
      .type('text/plain')
      .send('Prayat API is running. Frontend not built yet — run `npm run build`.')
  })
}

app.listen(PORT, () => {
  console.log(`[prayat] api listening on http://localhost:${PORT}`)
})
