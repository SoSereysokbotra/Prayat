/**
 * Prayat API.
 *
 * One Node service serves both the API and the built frontend, so there is one
 * deploy, one URL, and no CORS to explain on stage.
 */

import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { seedContent } from './db'
import { healthRouter } from './routes/health'
import { scenariosRouter } from './routes/scenarios'
import { sessionsRouter } from './routes/sessions'
import { triageRouter } from './routes/triage'
import { investigationRouter } from './routes/investigation'
import { bootcampRouter } from './routes/bootcamp'
import { docsRouter } from './routes/docs'
import { fail, NOT_FOUND } from './lib/http'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(express.json())

/* Content is version-controlled in git; the database is disposable. Re-seeding
   on every boot means a wiped disk costs nothing but session history. */
const loaded = seedContent()
console.log(
  `[prayat] seeded ${loaded.scenarios} scenario(s), ${loaded.decks} deck(s), ${loaded.investigations} investigation(s), ${loaded.bootcamp} bootcamp module(s)`,
)

/* ---- API ---------------------------------------------------------------- */

const api = express.Router()
api.use('/health', healthRouter)
api.use('/scenarios', scenariosRouter)
api.use('/sessions', sessionsRouter)
api.use('/triage', triageRouter)
api.use('/investigations', investigationRouter)
api.use('/bootcamp', bootcampRouter)
api.use('/docs', docsRouter)

// An unknown /api/* path must not fall through to the SPA catch-all, or a typo
// in a URL returns an HTML page with status 200.
api.use((_req, res) => fail(res, NOT_FOUND, 'not_found', 'no such endpoint'))

app.use('/api', api)

/* ---- Static SPA --------------------------------------------------------- */

/* Registered AFTER the API router. The catch-all is what stops /guardian from
   404-ing when a judge refreshes or scans a QR code pointing at a sub-route.
   Registered first, it would swallow every endpoint above. */
const distDir = path.resolve(process.cwd(), 'dist')

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
} else {
  app.get('*', (_req, res) =>
    res.type('text/plain').send('Prayat API is running. Frontend not built — run `npm run build`.'),
  )
}

app.listen(PORT, () => {
  console.log(`[prayat] listening on http://localhost:${PORT}`)
})
