// ============================================================
// Comp Engine V2 — V1 Condition Stub
//
// Computes a 0–1 condition score from observable BaT signals.
// Formula from spec:
//   condition_stub = 0.4*paint_score + 0.3*accident_score
//                  + 0.2*photo_score + 0.1*featured_score
//
// All inputs may be null; defaults are set conservatively (0.5 = unknown).
// This stub is replaced by Phase 2 AI-extracted condition_signal.
// ============================================================

interface ConditionInputs {
  paint_meter_max_microns: number | null
  accident_history_stated: string | null
  listing_photo_count: number | null
  is_featured_listing: boolean | null
}

export function paintScore(microns: number | null): number {
  if (microns === null) return 0.5
  if (microns < 150) return 1.0
  if (microns < 200) return 0.7
  if (microns < 300) return 0.4
  return 0.1
}

export function accidentScore(stated: string | null): number {
  switch (stated) {
    case 'none_stated': return 1.0
    case 'minor_stated': return 0.6
    case 'major_stated': return 0.2
    default: return 0.5  // unknown or null
  }
}

export function photoScore(count: number | null): number {
  if (count === null) return 0.5
  if (count >= 40) return 1.0
  if (count >= 25) return 0.8
  if (count >= 15) return 0.6
  return 0.4
}

export function featuredScore(isFeatured: boolean | null): number {
  if (isFeatured === null) return 0.5
  return isFeatured ? 1.0 : 0.5
}

export function computeConditionStub(inputs: ConditionInputs): number {
  return (
    0.4 * paintScore(inputs.paint_meter_max_microns) +
    0.3 * accidentScore(inputs.accident_history_stated) +
    0.2 * photoScore(inputs.listing_photo_count) +
    0.1 * featuredScore(inputs.is_featured_listing)
  )
}

// Condition similarity: how close two listings' condition stubs are.
// 1 - |subject_score - comp_score| (both 0–1)
export function conditionSimilarity(subjectStub: number, compStub: number): number {
  return 1 - Math.abs(subjectStub - compStub)
}
