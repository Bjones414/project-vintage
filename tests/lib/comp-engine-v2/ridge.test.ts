import { describe, it, expect } from 'vitest'
import {
  matMul,
  transpose,
  solveLinear,
  computeColumnStats,
  standardiseX,
  fitRidge,
  predictRidge,
  computeResiduals,
} from '@/lib/comp-engine-v2/ridge'
import { adaptiveAlpha, blendWithPrior, PRIOR_TIERS } from '@/lib/comp-engine-v2/prior-blend'
import type { GenerationPrior } from '@/lib/comp-engine-v2/types'

// ---- Matrix utilities -------------------------------------------------------

describe('matMul', () => {
  it('2×2 identity product', () => {
    const I = [[1, 0], [0, 1]]
    const A = [[3, 4], [5, 6]]
    expect(matMul(A, I)).toEqual(A)
  })

  it('2×3 × 3×2 → 2×2', () => {
    const A = [[1, 2, 3], [4, 5, 6]]
    const B = [[7, 8], [9, 10], [11, 12]]
    const C = matMul(A, B)
    expect(C[0][0]).toBe(1 * 7 + 2 * 9 + 3 * 11)  // 58
    expect(C[0][1]).toBe(1 * 8 + 2 * 10 + 3 * 12) // 64
    expect(C[1][0]).toBe(4 * 7 + 5 * 9 + 6 * 11)  // 139
    expect(C[1][1]).toBe(4 * 8 + 5 * 10 + 6 * 12) // 154
  })
})

describe('transpose', () => {
  it('transposes a 2×3 matrix to 3×2', () => {
    const A = [[1, 2, 3], [4, 5, 6]]
    const At = transpose(A)
    expect(At).toHaveLength(3)
    expect(At[0]).toEqual([1, 4])
    expect(At[1]).toEqual([2, 5])
    expect(At[2]).toEqual([3, 6])
  })

  it('double-transpose is identity', () => {
    const A = [[1, 2], [3, 4], [5, 6]]
    expect(transpose(transpose(A))).toEqual(A)
  })
})

describe('solveLinear', () => {
  it('solves a 2×2 system correctly', () => {
    // 2x + y = 5, x + 3y = 10 → x=1, y=3
    const A = [[2, 1], [1, 3]]
    const b = [5, 10]
    const x = solveLinear(A, b)
    expect(x).not.toBeNull()
    expect(x![0]).toBeCloseTo(1, 10)
    expect(x![1]).toBeCloseTo(3, 10)
  })

  it('solves a 3×3 system correctly', () => {
    // Diagonal system: straightforward ground-truth
    // [[1,0,0],[0,2,0],[0,0,3]] × [1,2,3] = [1,4,9]
    const A = [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
    const b = [1, 4, 9]
    const x = solveLinear(A, b)
    expect(x).not.toBeNull()
    expect(x![0]).toBeCloseTo(1, 10)
    expect(x![1]).toBeCloseTo(2, 10)
    expect(x![2]).toBeCloseTo(3, 10)
  })

  it('returns null for a singular matrix', () => {
    const A = [[1, 2], [2, 4]]  // row 2 = 2 × row 1
    const b = [1, 2]
    expect(solveLinear(A, b)).toBeNull()
  })
})

describe('computeColumnStats', () => {
  it('computes mean and std for each column', () => {
    const X = [[1, 2, 4], [1, 4, 8], [1, 6, 12]]
    const stats = computeColumnStats(X)
    // col 0 (intercept): all 1s → mean=1, std=0 → fallback std=1
    expect(stats[0].mean).toBeCloseTo(1)
    expect(stats[0].std).toBeCloseTo(1)  // constant column fallback
    // col 1: [2,4,6] → mean=4, std=sqrt(((2-4)²+(4-4)²+(6-4)²)/3)=sqrt(8/3)≈1.633
    expect(stats[1].mean).toBeCloseTo(4)
    expect(stats[1].std).toBeCloseTo(Math.sqrt(8 / 3), 5)
  })
})

describe('standardiseX', () => {
  it('leaves intercept column (0) unchanged', () => {
    const X = [[1, 10], [1, 20], [1, 30]]
    const stats = computeColumnStats(X)
    const Xs = standardiseX(X, stats)
    expect(Xs[0][0]).toBe(1)
    expect(Xs[1][0]).toBe(1)
    expect(Xs[2][0]).toBe(1)
  })

  it('standardised non-intercept columns have ~mean=0', () => {
    const X = [[1, 10], [1, 20], [1, 30]]
    const stats = computeColumnStats(X)
    const Xs = standardiseX(X, stats)
    const col1 = Xs.map(r => r[1])
    const mean = col1.reduce((s, v) => s + v, 0) / col1.length
    expect(mean).toBeCloseTo(0, 10)
  })
})

// ---- Ridge fit and predict --------------------------------------------------

// Hand-designed 1-D Ridge case (intercept + mileage_log):
// X = [[1, ln(10k)], [1, ln(30k)], [1, ln(50k)], [1, ln(80k)], [1, ln(100k)]]
// y = ln([15M, 12M, 10M, 8M, 7M] cents) — higher mileage → lower price
// Expected: β_mileage_log < 0 (negative relationship)

const M10 = Math.log(10_000)
const M30 = Math.log(30_000)
const M50 = Math.log(50_000)
const M80 = Math.log(80_000)
const M100 = Math.log(100_000)

const X_1D = [
  [1, M10],
  [1, M30],
  [1, M50],
  [1, M80],
  [1, M100],
]
const Y_1D = [
  Math.log(15_000_000),
  Math.log(12_000_000),
  Math.log(10_000_000),
  Math.log(8_000_000),
  Math.log(7_000_000),
]

describe('fitRidge — 1D hand case', () => {
  it('returns non-null result', () => {
    expect(fitRidge(X_1D, Y_1D, 0.01)).not.toBeNull()
  })

  it('β for mileage_log is NEGATIVE (higher mileage → lower price)', () => {
    const fit = fitRidge(X_1D, Y_1D, 0.01)!
    // beta[1] is the coefficient for mileage_log (standardised feature)
    expect(fit.beta[1]).toBeLessThan(0)
  })

  it('returns null for underdetermined system (n < p)', () => {
    const X2 = [[1, 2, 3], [1, 3, 4]]   // 2 rows, 3 cols → n < p
    const y2 = [1, 2]
    expect(fitRidge(X2, y2, 0.1)).toBeNull()
  })

  it('returns null for empty data', () => {
    expect(fitRidge([], [], 0.1)).toBeNull()
  })
})

describe('predictRidge — 1D case', () => {
  const fit = fitRidge(X_1D, Y_1D, 0.01)!
  const featureNames = ['intercept', 'mileage_log']

  it('prediction at median mileage is in a plausible range', () => {
    // Predict for mileage=50K (near middle of training data)
    const xRaw = [1, Math.log(50_000)]
    const { predictedCents } = predictRidge(xRaw, fit, featureNames)
    // Training prices range from $70K–$150K; 50K miles should be ~$100K
    expect(predictedCents).toBeGreaterThan(7_000_000)    // > $70K
    expect(predictedCents).toBeLessThan(15_000_000)      // < $150K
  })

  it('higher mileage predicts lower price', () => {
    const lowMilePred = predictRidge([1, Math.log(5_000)],  fit, featureNames)
    const highMilePred = predictRidge([1, Math.log(150_000)], fit, featureNames)
    expect(lowMilePred.predictedCents).toBeGreaterThan(highMilePred.predictedCents)
  })

  it('feature contributions are structured correctly', () => {
    const { featureContributions } = predictRidge([1, Math.log(50_000)], fit, featureNames)
    expect(featureContributions).toHaveLength(2)
    expect(featureContributions[0].featureName).toBe('intercept')
    expect(featureContributions[1].featureName).toBe('mileage_log')
  })

  it('non-intercept contributions sum to (predicted - intercept contribution) in log space', () => {
    const xRaw = [1, Math.log(40_000)]
    const { predictedLogPrice, featureContributions } = predictRidge(xRaw, fit, featureNames)
    const interceptContrib = featureContributions[0].contributionLogPrice  // = beta[0] × 1
    const nonInterceptSum = featureContributions
      .slice(1)
      .reduce((s, c) => s + c.contributionLogPrice, 0)
    expect(nonInterceptSum).toBeCloseTo(predictedLogPrice - interceptContrib, 10)
  })

  it('all feature contributions have the expected shape', () => {
    const { featureContributions } = predictRidge([1, Math.log(30_000)], fit, featureNames)
    for (const c of featureContributions) {
      expect(typeof c.featureName).toBe('string')
      expect(typeof c.featureValueRaw).toBe('number')
      expect(typeof c.featureValueStd).toBe('number')
      expect(typeof c.beta).toBe('number')
      expect(typeof c.contributionLogPrice).toBe('number')
      expect(typeof c.contributionCentsApprox).toBe('number')
    }
  })
})

describe('computeResiduals', () => {
  const fit = fitRidge(X_1D, Y_1D, 0.01)!
  const featureNames = ['intercept', 'mileage_log']

  it('returns n residuals (one per training comp)', () => {
    const residuals = computeResiduals(X_1D, Y_1D, fit, featureNames)
    expect(residuals).toHaveLength(X_1D.length)
  })

  it('residuals are sorted ascending', () => {
    const residuals = computeResiduals(X_1D, Y_1D, fit, featureNames)
    for (let i = 1; i < residuals.length; i++) {
      expect(residuals[i]).toBeGreaterThanOrEqual(residuals[i - 1])
    }
  })

  it('residuals are small (within 20% log-price of zero)', () => {
    const residuals = computeResiduals(X_1D, Y_1D, fit, featureNames)
    for (const r of residuals) {
      expect(Math.abs(r)).toBeLessThan(0.2)   // 20% relative error
    }
  })
})

// ---- Adaptive alpha ---------------------------------------------------------

describe('adaptiveAlpha', () => {
  it('alpha = base × k/poolSize', () => {
    expect(adaptiveAlpha(1.0, 5, 100)).toBeCloseTo(0.05)
    expect(adaptiveAlpha(1.0, 10, 50)).toBeCloseTo(0.2)
  })

  it('k = poolSize → alpha = base (maximum regularisation for tiny pool)', () => {
    expect(adaptiveAlpha(1.0, 10, 10)).toBeCloseTo(1.0)
  })

  it('poolSize 0 → returns baseAlpha (guard)', () => {
    expect(adaptiveAlpha(1.0, 5, 0)).toBe(1.0)
  })

  it('larger pool → smaller alpha', () => {
    const small = adaptiveAlpha(1.0, 5, 10)
    const large = adaptiveAlpha(1.0, 5, 100)
    expect(large).toBeLessThan(small)
  })
})

// ---- Prior blending ---------------------------------------------------------

const DUMMY_PRIOR: GenerationPrior = {
  generation_id: '997.2',
  median_cents: 12_000_000,
  sample_size: 150,
  computed_at: '2026-01-01T00:00:00Z',
}

describe('blendWithPrior', () => {
  const regressionPrediction = 10_000_000  // $100K

  it('tier 1–3 comps: 30% regression, 70% prior', () => {
    const blended = blendWithPrior(regressionPrediction, DUMMY_PRIOR, 3)
    const expected = regressionPrediction * 0.30 + DUMMY_PRIOR.median_cents * 0.70
    expect(blended).toBeCloseTo(expected, 0)
  })

  it('tier 4–9 comps: 60% regression, 40% prior', () => {
    const blended = blendWithPrior(regressionPrediction, DUMMY_PRIOR, 9)
    const expected = regressionPrediction * 0.60 + DUMMY_PRIOR.median_cents * 0.40
    expect(blended).toBeCloseTo(expected, 0)
  })

  it('tier 10–19 comps: 80% regression, 20% prior', () => {
    const blended = blendWithPrior(regressionPrediction, DUMMY_PRIOR, 15)
    const expected = regressionPrediction * 0.80 + DUMMY_PRIOR.median_cents * 0.20
    expect(blended).toBeCloseTo(expected, 0)
  })

  it('tier 20+ comps: 95% regression, 5% prior', () => {
    const blended = blendWithPrior(regressionPrediction, DUMMY_PRIOR, 25)
    const expected = regressionPrediction * 0.95 + DUMMY_PRIOR.median_cents * 0.05
    expect(blended).toBeCloseTo(expected, 0)
  })

  it('tier boundary: exactly 20 comps → 20+ tier', () => {
    const tier20 = blendWithPrior(regressionPrediction, DUMMY_PRIOR, 20)
    const tier19 = blendWithPrior(regressionPrediction, DUMMY_PRIOR, 19)
    // Tier changes at 20: 95%/5% vs 80%/20%
    expect(tier20).not.toBeCloseTo(tier19, -2)
  })

  it('tier boundary: exactly 10 comps → 10–19 tier', () => {
    const tier10 = blendWithPrior(regressionPrediction, DUMMY_PRIOR, 10)
    const tier9  = blendWithPrior(regressionPrediction, DUMMY_PRIOR, 9)
    expect(tier10).not.toBeCloseTo(tier9, -2)
  })

  it('null prior → returns regression prediction unchanged', () => {
    const result = blendWithPrior(regressionPrediction, null, 5)
    expect(result).toBe(regressionPrediction)
  })

  it('PRIOR_TIERS are ordered descending by minComps', () => {
    for (let i = 1; i < PRIOR_TIERS.length; i++) {
      expect(PRIOR_TIERS[i].minComps).toBeLessThan(PRIOR_TIERS[i - 1].minComps)
    }
  })
})

// ---- End-to-end: full predict() with contribution log -----------------------

describe('end-to-end predict with contribution log', () => {
  // 3-feature design: intercept + mileage_log + age_months + mileage_log_x_era
  // Training data: 5 water_cooled_na 997.2 comps (era ordinal = 1)
  const mileages  = [10_000, 25_000, 50_000, 80_000, 120_000]
  const ageMonths = [6,      12,     18,     24,     30]
  // era = 997.2 → water_cooled_na → ordinal 1
  const eraOrdinal = 1
  const prices = [14_000_000, 12_000_000, 10_000_000, 8_500_000, 7_000_000]  // cents

  const X3D = mileages.map((m, i) => [
    1,
    Math.log(m),
    ageMonths[i],
    Math.log(m) * eraOrdinal,
  ])
  const Y3D = prices.map(p => Math.log(p))
  const names3D = ['intercept', 'mileage_log', 'age_months', 'mileage_log_x_era']

  it('fitRidge returns non-null for 3-feature model', () => {
    expect(fitRidge(X3D, Y3D, 0.1)).not.toBeNull()
  })

  it('contribution non-intercept terms sum to (predicted - intercept contribution)', () => {
    const fit = fitRidge(X3D, Y3D, 0.1)!
    const xSubject = [1, Math.log(40_000), 15, Math.log(40_000) * eraOrdinal]
    const { predictedLogPrice, featureContributions } = predictRidge(xSubject, fit, names3D)

    const interceptContrib = featureContributions[0].contributionLogPrice
    const nonInterceptSum = featureContributions
      .slice(1)
      .reduce((s, c) => s + c.contributionLogPrice, 0)

    // Core invariant: non-intercept contributions sum to (total - intercept)
    expect(nonInterceptSum).toBeCloseTo(predictedLogPrice - interceptContrib, 10)
  })

  it('all four contribution entries have correct feature names', () => {
    const fit = fitRidge(X3D, Y3D, 0.1)!
    const { featureContributions } = predictRidge(
      [1, Math.log(40_000), 15, Math.log(40_000) * eraOrdinal],
      fit,
      names3D,
    )
    expect(featureContributions.map(c => c.featureName)).toEqual(names3D)
  })

  it('higher alpha (sparse pool) → predictions pulled more toward the mean', () => {
    const meanLogPrice = Y3D.reduce((s, v) => s + v, 0) / Y3D.length
    const xSubject = [1, Math.log(120_000), 30, Math.log(120_000) * eraOrdinal]

    const fitHigh  = fitRidge(X3D, Y3D, 10.0)!  // heavy regularisation
    const fitLow   = fitRidge(X3D, Y3D, 0.001)! // light regularisation

    const predHigh = predictRidge(xSubject, fitHigh, names3D).predictedLogPrice
    const predLow  = predictRidge(xSubject, fitLow,  names3D).predictedLogPrice

    // With heavy regularisation, prediction is closer to the unconditional mean
    expect(Math.abs(predHigh - meanLogPrice)).toBeLessThanOrEqual(
      Math.abs(predLow - meanLogPrice) + 0.01,  // allow small numeric tolerance
    )
  })
})
