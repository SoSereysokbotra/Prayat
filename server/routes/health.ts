import { Router } from 'express'
import { counts } from '../db'

export const healthRouter = Router()

/** Hit this from your phone right before you walk on stage. */
healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    scenariosLoaded: counts().scenarios,
    content: counts(),
  })
})
