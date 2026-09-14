/**
 * Scoring — one currency, defined once, for all three modes.
 *
 *   Guardian decision    100
 *   Triage card           10 x streak multiplier, applied per card
 *   Investigation flag    25
 *
 * Won (Guardian) = the FINAL decision is correct. A player can stumble at
 * stage 1 and recover, which mirrors real life: the last word before the money
 * moves is the one that matters.
 *
 * The 0-1000 per-category rating from the design doc is DERIVED here — points
 * earned in a category over points available in it. It is never stored, so it
 * can never disagree with the points it comes from.
 */

import {
  MAX_SCORE,
  POINTS_INVESTIGATION_FLAG,
  POINTS_PER_CORRECT,
  POINTS_TRIAGE_CARD,
  STREAK_TIERS,
  type CategoryScore,
  type DecisionRecord,
  type Level,
  type ScamCategory,
} from '../../shared/types'

/* ---- Guardian ------------------------------------------------------------ */

export function scoreFor(decisions: Pick<DecisionRecord, 'isCorrect'>[]): number {
  return Math.min(decisions.filter((d) => d.isCorrect).length * POINTS_PER_CORRECT, MAX_SCORE)
}

export function wonBy(decisions: Pick<DecisionRecord, 'isCorrect'>[]): boolean {
  if (decisions.length === 0) return false
  return decisions[decisions.length - 1].isCorrect
}

/* ---- Speed Triage -------------------------------------------------------- */

/**
 * The multiplier a card is worth AT THE MOMENT IT IS ANSWERED.
 *
 * `streak` is the number of correct answers BEFORE this one. Applying the
 * multiplier to the run total instead would retroactively rescale points
 * already earned, which cannot be displayed honestly.
 */
export function streakMultiplier(streak: number): number {
  for (const tier of STREAK_TIERS) {
    if (streak >= tier.at) return tier.multiplier
  }
  return 1
}

export function triageCardPoints(streak: number): number {
  return Math.round(POINTS_TRIAGE_CARD * streakMultiplier(streak))
}

/* ---- The Investigation --------------------------------------------------- */

export function investigationPoints(flagsFound: number): number {
  return flagsFound * POINTS_INVESTIGATION_FLAG
}

/* ---- Level --------------------------------------------------------------- */

/**
 * Level from cumulative Resistance Points across every mode. The thresholds
 * are arbitrary but consistent — change them here and nowhere else.
 */
export function levelFor(score: number): Level {
  if (score >= 500) return 'Protector'
  if (score >= 300) return 'Guardian'
  if (score >= 200) return 'Defender'
  if (score >= 100) return 'Alert'
  return 'Aware'
}

/* ---- Per-category rating ------------------------------------------------- */

/**
 * The design doc's 0-1000 rating, derived rather than stored.
 *
 * A category with nothing attempted rates 0 and reports `available: 0`, so a
 * dashboard can tell "not tried yet" from "tried and failed" — which is the
 * whole point of showing a breakdown to a parent.
 */
export function categoryRating(earned: number, available: number): number {
  if (available <= 0) return 0
  return Math.round(Math.min(earned / available, 1) * 1000)
}

export function buildCategoryScores(
  totals: Record<ScamCategory, { earned: number; available: number }>,
): CategoryScore[] {
  return (Object.keys(totals) as ScamCategory[]).map((category) => {
    const { earned, available } = totals[category]
    return { category, earned, available, rating: categoryRating(earned, available) }
  })
}
