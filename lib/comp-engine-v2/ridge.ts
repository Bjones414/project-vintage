// ============================================================
// Comp Engine V2 — Ridge Regression (pure TypeScript)
//
// Closed-form solution: β = (X'X + αI)^-1 X'y
// No external math library. Matrices are number[][] (row-major).
// Intercept is expected at column 0 and is NOT regularized.
//
// Numerical approach:
//   - Non-intercept features are standardised (μ=0, σ=1) for
//     numerical stability and comparable coefficient magnitudes.
//   - y (log prices) is NOT standardised; the intercept absorbs
//     the unconditional mean.
//   - Linear system solved with Gaussian elimination + partial
//     pivoting. Returns null when the system is singular (< 1e-12
//     pivot) — caller falls back to weighted percentile.
// ============================================================

// ---- Matrix utilities -------------------------------------------------------

/** A[i][j]: row i, column j. */
export type Matrix = number[][]

export function matMul(A: Matrix, B: Matrix): Matrix {
  const n = A.length
  const p = B.length
  const q = B[0].length
  const C: Matrix = Array.from({ length: n }, () => new Array<number>(q).fill(0))
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < p; k++) {
      const aik = A[i][k]
      if (aik === 0) continue
      for (let j = 0; j < q; j++) {
        C[i][j] += aik * B[k][j]
      }
    }
  }
  return C
}

export function transpose(A: Matrix): Matrix {
  const n = A.length
  const p = A[0].length
  const At: Matrix = Array.from({ length: p }, () => new Array<number>(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      At[j][i] = A[i][j]
    }
  }
  return At
}

/**
 * Solve Ax = b via Gaussian elimination with partial pivoting.
 * Returns null if the system is singular (|pivot| < 1e-12).
 */
export function solveLinear(A: Matrix, b: number[]): number[] | null {
  const p = A.length
  // Augmented matrix [A | b]
  const M: number[][] = A.map((row, i) => [...row, b[i]])

  for (let col = 0; col < p; col++) {
    // Partial pivot: find row with largest |M[row][col]|
    let maxRow = col
    let maxVal = Math.abs(M[col][col])
    for (let row = col + 1; row < p; row++) {
      const v = Math.abs(M[row][col])
      if (v > maxVal) { maxVal = v; maxRow = row }
    }
    if (maxVal < 1e-12) return null  // singular

    if (maxRow !== col) {
      const tmp = M[col]; M[col] = M[maxRow]; M[maxRow] = tmp
    }

    const pivot = M[col][col]
    for (let row = col + 1; row < p; row++) {
      const factor = M[row][col] / pivot
      for (let j = col; j <= p; j++) {
        M[row][j] -= factor * M[col][j]
      }
    }
  }

  // Back substitution
  const x = new Array<number>(p).fill(0)
  for (let i = p - 1; i >= 0; i--) {
    x[i] = M[i][p]
    for (let j = i + 1; j < p; j++) {
      x[i] -= M[i][j] * x[j]
    }
    if (Math.abs(M[i][i]) < 1e-12) return null
    x[i] /= M[i][i]
  }
  return x
}

// ---- Standardisation --------------------------------------------------------

export interface ColumnStats {
  mean: number
  std: number  // ≥ 1e-10; fallback to 1 if constant column
}

/**
 * Compute per-column mean and std for a design matrix.
 * Column 0 is the intercept (all 1s) — stats are computed but
 * standardiseX skips column 0.
 */
export function computeColumnStats(X: Matrix): ColumnStats[] {
  const n = X.length
  const p = X[0].length
  return Array.from({ length: p }, (_, j) => {
    const vals = X.map(row => row[j])
    const mean = vals.reduce((s, v) => s + v, 0) / n
    const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / n
    const std = Math.sqrt(variance)
    return { mean, std: std < 1e-10 ? 1 : std }
  })
}

/** Standardise columns 1..p-1; leave intercept column (0) as-is. */
export function standardiseX(X: Matrix, stats: ColumnStats[]): Matrix {
  return X.map(row =>
    row.map((val, j) => (j === 0 ? val : (val - stats[j].mean) / stats[j].std)),
  )
}

// ---- Ridge fit & predict ----------------------------------------------------

export interface RidgeFitResult {
  /** Coefficients in standardised feature space. beta[0] = intercept. */
  beta: number[]
  /** Column stats used for standardisation (needed to transform new data). */
  colStats: ColumnStats[]
  /** Number of training observations. */
  n: number
}

/**
 * Fit Ridge regression.
 * X: n×p design matrix with intercept column (all 1s) at index 0.
 * y: n-length target vector (log prices in cents).
 * alpha: regularisation strength (NOT applied to intercept).
 * Returns null when n < p (underdetermined) or matrix is singular.
 */
export function fitRidge(X: Matrix, y: number[], alpha: number): RidgeFitResult | null {
  const n = X.length
  if (n === 0) return null
  const p = X[0].length
  if (n < p) return null  // underdetermined system

  const colStats = computeColumnStats(X)
  const Xs = standardiseX(X, colStats)

  const Xt = transpose(Xs)
  // XtX = Xsᵀ × Xs  (p×p)
  const XtX = matMul(Xt, Xs)

  // Ridge: add alpha to diagonal (skip intercept at j=0)
  for (let j = 1; j < p; j++) {
    XtX[j][j] += alpha
  }

  // Xty = Xsᵀ × y  (p-length vector)
  const Xty = Xt.map(row => row.reduce((s, v, i) => s + v * y[i], 0))

  const beta = solveLinear(XtX, Xty)
  if (!beta) return null

  return { beta, colStats, n }
}

// ---- Per-feature contribution -----------------------------------------------

export interface FeatureContribution {
  featureName: string
  /** Raw (unstandardised) feature value. */
  featureValueRaw: number
  /** Standardised feature value. */
  featureValueStd: number
  /** Ridge coefficient (standardised space). */
  beta: number
  /** beta × featureValueStd — this feature's additive contribution to log(price). */
  contributionLogPrice: number
  /** Approximate price contribution in cents (proportional allocation of non-intercept terms). */
  contributionCentsApprox: number
}

export interface PredictResult {
  predictedLogPrice: number
  predictedCents: number
  featureContributions: FeatureContribution[]
}

/**
 * Predict for a single new observation.
 * xRaw: raw (unstandardised) feature vector, length = fit.beta.length.
 *   xRaw[0] must be 1.0 (intercept).
 * featureNames: human-readable names for each column (length = p).
 */
export function predictRidge(
  xRaw: number[],
  fit: RidgeFitResult,
  featureNames: string[],
): PredictResult {
  const p = xRaw.length

  // Standardise features (skip intercept at index 0)
  const xStd = xRaw.map((v, j) =>
    j === 0 ? v : (v - fit.colStats[j].mean) / fit.colStats[j].std,
  )

  let predictedLogPrice = 0
  const raw: FeatureContribution[] = []
  for (let j = 0; j < p; j++) {
    const contrib = fit.beta[j] * xStd[j]
    predictedLogPrice += contrib
    raw.push({
      featureName: featureNames[j],
      featureValueRaw: xRaw[j],
      featureValueStd: xStd[j],
      beta: fit.beta[j],
      contributionLogPrice: contrib,
      contributionCentsApprox: 0,  // filled below
    })
  }

  const predictedCents = Math.round(Math.exp(predictedLogPrice))

  // Approximate cents allocation: apportion non-intercept log contributions
  // proportionally. Ensures non-intercept contributions sum to
  // (prediction - intercept baseline) cents.
  const interceptCents = Math.round(Math.exp(raw[0].contributionLogPrice))
  const nonInterceptCents = Math.max(0, predictedCents - interceptCents)
  const nonInterceptLogTotal = raw
    .slice(1)
    .reduce((s, c) => s + Math.abs(c.contributionLogPrice), 0)

  for (let j = 1; j < p; j++) {
    const share =
      nonInterceptLogTotal > 1e-12
        ? raw[j].contributionLogPrice / nonInterceptLogTotal
        : 1 / (p - 1)
    raw[j].contributionCentsApprox = Math.round(share * nonInterceptCents)
  }

  return { predictedLogPrice, predictedCents, featureContributions: raw }
}

/**
 * Compute in-sample residuals for P25/P75 spread estimation.
 * Returns sorted residuals in log-price space.
 */
export function computeResiduals(
  X: Matrix,
  y: number[],
  fit: RidgeFitResult,
  featureNames: string[],
): number[] {
  return X.map((xRaw, i) => {
    const { predictedLogPrice } = predictRidge(xRaw, fit, featureNames)
    return y[i] - predictedLogPrice
  }).sort((a, b) => a - b)
}
