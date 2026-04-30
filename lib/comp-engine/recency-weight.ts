// Returns a recency weight [0, 1] for a comp based on months since it sold.
// Linear interpolation per locked product decisions:
//   0–6 months  → 1.0
//   6–12 months → 0.8 (interpolated from 1.0 at 6mo to 0.8 at 12mo)
//   12–24 months → 0.8 (interpolated from 0.8 at 12mo to 0.6 at 24mo)
//   24–36 months → 0.4 (interpolated from 0.6 at 24mo to 0.4 at 36mo)
//   >36 months  → 0 (drop, should not be passed)
//
// Boundary table:
//   months: 0  → 1.0
//   months: 6  → 1.0
//   months: 12 → 0.8
//   months: 24 → 0.6
//   months: 36 → 0.4

const BREAKPOINTS: [number, number][] = [
  [0, 1.0],
  [6, 1.0],
  [12, 0.8],
  [24, 0.6],
  [36, 0.4],
]

export function recencyWeight(soldAt: string, asOf: Date = new Date()): number {
  const soldMs = new Date(soldAt).getTime()
  const months = (asOf.getTime() - soldMs) / (1000 * 60 * 60 * 24 * 30.4375)

  if (months > 36) return 0
  if (months <= 0) return 1.0

  for (let i = 1; i < BREAKPOINTS.length; i++) {
    const [m0, w0] = BREAKPOINTS[i - 1]
    const [m1, w1] = BREAKPOINTS[i]
    if (months <= m1) {
      const t = (months - m0) / (m1 - m0)
      return w0 + t * (w1 - w0)
    }
  }
  return 0.4
}

export function monthsAgo(soldAt: string, asOf: Date = new Date()): number {
  return (asOf.getTime() - new Date(soldAt).getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
}
