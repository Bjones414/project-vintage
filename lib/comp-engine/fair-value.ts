import type { FairValueRange } from './types'

interface WeightedPrice {
  price_cents: number
  weight: number
}

// Computes weighted average and weighted standard deviation.
// Returns fair value range: median ± std dev, clamped so low ≥ 0.
export function computeFairValue(comps: WeightedPrice[]): FairValueRange | null {
  if (comps.length === 0) return null

  const totalWeight = comps.reduce((s, c) => s + c.weight, 0)
  if (totalWeight === 0) return null

  const weightedMean = comps.reduce((s, c) => s + c.price_cents * c.weight, 0) / totalWeight

  const weightedVariance =
    comps.reduce((s, c) => s + c.weight * Math.pow(c.price_cents - weightedMean, 2), 0) /
    totalWeight

  const stdDev = Math.sqrt(weightedVariance)

  const median_cents = Math.round(weightedMean)
  const low_cents = Math.max(0, Math.round(weightedMean - stdDev))
  const high_cents = Math.round(weightedMean + stdDev)

  return { low_cents, median_cents, high_cents }
}
