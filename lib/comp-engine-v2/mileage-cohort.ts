// ============================================================
// Comp Engine V2 — Stage 3: Museum/Delivery Mileage Cohort
//
// Museum threshold: < 1000 miles.
// If subject < 1000: pool restricted to other <1000-mile comps.
// If subject >= 1000: pool excludes <1000-mile comps entirely.
// Null subject mileage: no cohort separation (both pools available).
// ============================================================

import type { V2CompCandidate } from './types'

export const MUSEUM_THRESHOLD = 1000

export function applyCohortSeparation(
  subjectMileage: number | null,
  candidates: V2CompCandidate[],
): { pool: V2CompCandidate[]; isMuseumSubject: boolean } {
  if (subjectMileage === null) {
    // Can't determine cohort — include all (conservative, per decision D6 spirit)
    return { pool: candidates, isMuseumSubject: false }
  }

  const isMuseumSubject = subjectMileage < MUSEUM_THRESHOLD

  if (isMuseumSubject) {
    // Museum subject: only use other museum comps
    const pool = candidates.filter(
      c => c.mileage !== null && c.mileage < MUSEUM_THRESHOLD,
    )
    return { pool, isMuseumSubject: true }
  } else {
    // Normal subject: exclude museum comps entirely
    const pool = candidates.filter(
      c => c.mileage === null || c.mileage >= MUSEUM_THRESHOLD,
    )
    return { pool, isMuseumSubject: false }
  }
}
