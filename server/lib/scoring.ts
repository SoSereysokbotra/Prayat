/**
 * Scoring — defined once, here.
 *
 * Locked in the Phase 0 decision sheet:
 *   100 points per correct decision, 0 per wrong, max 300.
 *
 * Won = the FINAL decision is correct. A player can stumble at stage 1 and
 * recover, which mirrors real life: the last word before the money moves is
 * the one that matters.
 */

import { MAX_SCORE, POINTS_PER_CORRECT, type DecisionRecord, type Level } from '../../shared/types'

export function scoreFor(decisions: Pick<DecisionRecord, 'isCorrect'>[]): number {
  return Math.min(decisions.filter((d) => d.isCorrect).length * POINTS_PER_CORRECT, MAX_SCORE)
}

export function wonBy(decisions: Pick<DecisionRecord, 'isCorrect'>[]): boolean {
  if (decisions.length === 0) return false
  return decisions[decisions.length - 1].isCorrect
}

/**
 * Level from cumulative score across all sessions. The thresholds are
 * arbitrary but consistent — change them here and nowhere else.
 */
export function levelFor(score: number): Level {
  if (score >= 500) return 'Protector'
  if (score >= 300) return 'Guardian'
  if (score >= 200) return 'Defender'
  if (score >= 100) return 'Alert'
  return 'Aware'
}
