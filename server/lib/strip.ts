/**
 * Re-export of the shared stripping layer.
 *
 * The implementation lives in shared/strip.ts so the Phase 3 fixtures use the
 * identical code path. This file exists because every server route imports
 * stripping from here — one import site to audit.
 */
export {
  stripOption,
  stripStage,
  toScenarioMeta,
  toScenarioSummary,
  containsAnswers,
  stripTriageCard,
  stripInvestigation,
} from '../../shared/strip'
