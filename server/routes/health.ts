import { Router } from 'express'
import { countScenarios } from '../db'

export const healthRouter = Router()

/** Hit this from your phone right before you walk on stage. */
healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    scenariosLoaded: countScenarios(),
  })
})
