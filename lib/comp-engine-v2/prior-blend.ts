// ============================================================
// Comp Engine V2 — Prior Blending + Adaptive Alpha
//
// blendWithPrior: blend Ridge point estimate with generation-level
//   prior by comp-count tier. Handles null prior gracefully.
//
// adaptiveAlpha: Ridge regularisation scales with data density.
//   alpha = base_alpha × (k / pool_size)
//   Sparse pool (small pool_size) → high alpha → more regularisation
//   → prediction stays closer to prior.
// ============================================================

import type { GenerationPrior } from './types'

// Comp-count tiers mapped to regression/prior blend weights.
// Ordered descending by minComps so the first matching tier wins.
export const PRIOR_TIERS = [
  { minComps: 20, regressionWeight: 0.95, priorWeight: 0.05 },
  { minComps: 10, regressionWeight: 0.80, priorWeight: 0.20 },
  { minComps:  4, regressionWeight: 0.60, priorWeight: 0.40 },
  { minComps:  1, regressionWeight: 0.30, priorWeight: 0.70 },
] as const

/**
 * Adaptive regularisation: alpha scales with pool density.
 * k = selected comp count; poolSize = total generation pool size.
 */
export function adaptiveAlpha(baseAlpha: number, k: number, poolSize: number): number {
  if (poolSize <= 0) return baseAlpha
  return baseAlpha * (k / poolSize)
}

/**
 * Blend a Ridge regression prediction with a generation-level prior.
 * When prior is null, warns and returns the regression prediction unchanged
 * (prior was not loaded — Session 2 wires the nightly refresh).
 */
export function blendWithPrior(
  regressionPrediction: number,
  prior: GenerationPrior | null,
  compCount: number,
): number {
  if (prior === null) {
    console.warn(
      '[prior-blend] No generation prior available; using regression-only prediction.',
    )
    return regressionPrediction
  }

  const tier =
    PRIOR_TIERS.find(t => compCount >= t.minComps) ??
    PRIOR_TIERS[PRIOR_TIERS.length - 1]

  return (
    regressionPrediction * tier.regressionWeight +
    prior.median_cents * tier.priorWeight
  )
}
