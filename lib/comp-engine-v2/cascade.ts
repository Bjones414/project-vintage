// ============================================================
// Comp Engine V2 — Cascade Pool Selection
//
// Tries progressively broader comp pools until ≥ MIN_COMPS candidates
// are found. Preserves trim isolation: Turbo never falls back to Carrera.
//
// Levels:
//   1 — same trim + same year + same body + same transmission
//   2 — same trim + same body + adjacent years (±2)
//   3 — same trim + same body + full generation (current hard-filter baseline)
//   4 — same trim + any body + full generation
//   5 — Carrera-family trims + full generation  (Carrera subjects only)
//   6 — all Carrera variants in generation      (broadest; display caveat)
//
// For non-Carrera-family subjects (Turbo, GT3, GT2, RS, Speedster, etc.)
// the cascade tops out at level 4.  These trims must never fall back to
// Carrera.
// ============================================================

import type { V2Subject, V2CompCandidate, CascadeLevel } from './types'
import { normalizeBodyStyle } from './hard-filter'

// Minimum comps required before accepting a cascade level.
export const CASCADE_MIN_COMPS = 5

// Trim categories that belong to the "Carrera family" and may be pooled
// together at cascade levels 5-6.  Includes naturally-aspirated Carrera
// variants across all generations and GTS.  Excludes every halo, GT,
// Turbo, RS, and limited-edition category.
const CARRERA_FAMILY = new Set([
  // 996 / 997 / 991 / 992 Carrera variants
  'carrera_base',
  'carrera_4',
  'carrera_s',
  'carrera_4s',
  // GTS — own market for levels 1-4; Carrera-family for levels 5-6
  'gts',
  // 993 Carrera variants (narrow and wide body)
  'carrera_2_narrow',
  'carrera_4_narrow',
  'carrera_s_wide',
  'carrera_4s_wide',
  // 964 Carrera variants
  // (carrera_2_narrow and carrera_4_narrow already listed above)
  // Targa: NOT included — Targa is a body style variant and is handled
  // by the body_style hard filter, not the trim cascade.
])

export function isCarreraFamily(trimCategory: string | null): boolean {
  return trimCategory !== null && CARRERA_FAMILY.has(trimCategory)
}

function sameBodyStyle(a: string | null, b: string | null): boolean {
  const na = normalizeBodyStyle(a)
  const nb = normalizeBodyStyle(b)
  if (na === null || nb === null) return true  // unknown body: don't exclude
  return na === nb
}

// Build the comp pool for a given cascade level.
//
// hardFilteredPool: output of applyHardFilters (trim + body filtered, standard)
// fullGenerationPool: all sold candidates for this generation (pre-filtered
//   to ≤36 months by fetchV2Pool), used for levels 5-6 expansion.
export function buildCascadePool(
  subject: V2Subject,
  hardFilteredPool: V2CompCandidate[],
  fullGenerationPool: V2CompCandidate[],
  level: CascadeLevel,
): V2CompCandidate[] {
  const subjectYear = subject.year

  switch (level) {
    case 1:
      // Same trim + same year + same body + same transmission
      return hardFilteredPool.filter(c => {
        if (c.year !== subjectYear) return false
        if (!sameBodyStyle(subject.body_style, c.body_style)) return false
        if (
          subject.transmission_variant != null &&
          c.transmission_variant != null &&
          c.transmission_variant !== subject.transmission_variant
        ) return false
        return true
      })

    case 2:
      // Same trim + same body + adjacent years (±2)
      return hardFilteredPool.filter(c => {
        if (Math.abs(c.year - subjectYear) > 2) return false
        if (!sameBodyStyle(subject.body_style, c.body_style)) return false
        return true
      })

    case 3:
      // Same trim + same body + full generation (= hard filter with body)
      return hardFilteredPool.filter(c => sameBodyStyle(subject.body_style, c.body_style))

    case 4:
      // Same trim + any body + full generation (= hard filter, no body constraint)
      return hardFilteredPool

    case 5:
    case 6: {
      // Carrera-family trims + full generation.
      // Only applies when the subject itself is Carrera-family.
      if (!isCarreraFamily(subject.trim_category)) {
        // Non-Carrera subjects cannot widen beyond level 4.
        return hardFilteredPool
      }
      return fullGenerationPool.filter(c => isCarreraFamily(c.trim_category))
    }

    default:
      return hardFilteredPool
  }
}

// Try each cascade level in order; return the first level with ≥ CASCADE_MIN_COMPS.
// Returns null when no level yields enough comps.
export function selectCascadePool(
  subject: V2Subject,
  hardFilteredPool: V2CompCandidate[],
  fullGenerationPool: V2CompCandidate[],
): { pool: V2CompCandidate[]; level: CascadeLevel } | null {
  const maxLevel: CascadeLevel = isCarreraFamily(subject.trim_category) ? 6 : 4

  for (let level = 1 as CascadeLevel; level <= maxLevel; level++) {
    const pool = buildCascadePool(subject, hardFilteredPool, fullGenerationPool, level as CascadeLevel)
    if (pool.length >= CASCADE_MIN_COMPS) {
      return { pool, level: level as CascadeLevel }
    }
  }

  // No level met the threshold; return the broadest available with whatever is there
  // so the engine can try and return low_confidence rather than hard-insufficient.
  const broadest = buildCascadePool(
    subject,
    hardFilteredPool,
    fullGenerationPool,
    maxLevel,
  )
  if (broadest.length > 0) {
    return { pool: broadest, level: maxLevel }
  }

  return null
}

// Human-readable caveat for cascade levels > 2 (displayed on analyze page).
export function getCascadeCaveat(
  level: CascadeLevel | null,
  generationId: string | null,
): string | null {
  if (level === null || level <= 2) return null
  const gen = generationId ?? 'this generation'
  switch (level) {
    case 3:
      return `Comps draw from the full ${gen} model year range for this trim. Same-year data was limited.`
    case 4:
      return `Comps include all body styles for this trim in the ${gen} generation. Same-body data was limited.`
    case 5:
      return `Comps include broader ${gen} Carrera variants due to limited data for this specific configuration.`
    case 6:
      return `Comps include all Carrera variants for the ${gen} generation. Specific variant data was insufficient.`
    default:
      return null
  }
}
