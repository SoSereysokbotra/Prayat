/**
 * Swagger UI at /api/docs — the judge-facing surface.
 *
 * This is the 2:00 mark of the demo: hand someone the URL and let them play a
 * whole scenario from their own phone. Every endpoint executes from the page.
 */
import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'node:fs'
import path from 'node:path'

export const docsRouter = Router()

// Read at boot from the source tree. tsconfig.server.json does not copy JSON
// into dist-server, so resolve against cwd rather than __dirname.
const specPath = path.resolve(process.cwd(), 'server/openapi.json')
const spec = JSON.parse(readFileSync(specPath, 'utf8'))

docsRouter.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(spec, {
    customSiteTitle: 'Prayat API',
    swaggerOptions: {
      // Collapsed lists read as a wall of grey on a phone.
      docExpansion: 'list',
      defaultModelsExpandDepth: 0,
      tryItOutEnabled: true,
    },
  }),
)

/** The raw spec, for anyone who would rather import it than read it. */
docsRouter.get('/openapi.json', (_req, res) => res.json(spec))
