import { Router } from 'express'
import { getScenario, listScenarioRows } from '../db'
import { stripStage, toScenarioMeta, toScenarioSummary } from '../lib/strip'
import { NOT_FOUND, fail } from '../lib/http'

export const scenariosRouter = Router()

/** The catalogue. No stages, no answers. */
scenariosRouter.get('/', (_req, res) => {
  res.json(listScenarioRows().map(toScenarioSummary))
})

/** Metadata plus stage 1 only, stripped. Later stages are never sent early. */
scenariosRouter.get('/:id', (req, res) => {
  const scenario = getScenario(req.params.id)
  if (!scenario) return fail(res, NOT_FOUND, 'scenario_not_found', `no scenario "${req.params.id}"`)

  return res.json({
    ...toScenarioMeta(scenario),
    stage: stripStage(scenario.stages[0]),
  })
})
