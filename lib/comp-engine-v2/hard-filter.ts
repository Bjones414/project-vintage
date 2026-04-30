// ============================================================
// Comp Engine V2 — Stage 1: Hard Categorical Filters
//
// A comp is dropped if it doesn't match the subject on:
//   - trim_category (unless either is null — decision D6)
//   - body_style (decoded_body_class, normalized)
//   - drivetrain (normalized)
//   - is_separate_market gate (if subject is separate market,
//     comp must be same trim_category; null subject → skip gate)
//
// Decision D6: NULL on either side → skip that filter, treat as compatible.
// ============================================================

import type { V2Subject, V2CompCandidate, TrimTaxonomyEntry } from './types'

function normalizeBodyStyle(raw: string | null): string | null {
  if (!raw) return null
  const s = raw.toLowerCase().trim()
  if (s.includes('convertible') || s.includes('cabriolet') || s.includes('cabrio')) return 'cabriolet'
  if (s.includes('targa')) return 'targa'
  if (s.includes('speedster')) return 'speedster'
  return 'coupe'
}

function normalizeDrivetrain(raw: string | null): string | null {
  if (!raw) return null
  const s = raw.toLowerCase().trim()
  if (s.includes('awd') || s.includes('4wd') || s === 'all-wheel drive') return 'awd'
  if (s.includes('rwd') || s === 'rear-wheel drive') return 'rwd'
  return s
}

function isSeparateMarket(trimCategory: string | null, taxonomy: TrimTaxonomyEntry[]): boolean {
  if (!trimCategory) return false
  const entry = taxonomy.find(t => t.trim_category === trimCategory)
  return entry?.is_separate_market ?? false
}

export function applyHardFilters(
  subject: V2Subject,
  candidates: V2CompCandidate[],
  taxonomy: TrimTaxonomyEntry[],
): V2CompCandidate[] {
  const subjectBodyStyle = normalizeBodyStyle(subject.body_style)
  const subjectDrivetrain = normalizeDrivetrain(subject.drivetrain)
  const subjectIsSeparateMarket = isSeparateMarket(subject.trim_category, taxonomy)

  return candidates.filter(comp => {
    // trim_category: exact match required if both sides are non-null
    if (subject.trim_category !== null && comp.trim_category !== null) {
      if (subject.trim_category !== comp.trim_category) return false
    }

    // body_style: exact match (normalized) if both are non-null
    const compBodyStyle = normalizeBodyStyle(comp.body_style)
    if (subjectBodyStyle !== null && compBodyStyle !== null) {
      if (subjectBodyStyle !== compBodyStyle) return false
    }

    // drivetrain: exact match (normalized) if both are non-null
    const compDrivetrain = normalizeDrivetrain(comp.drivetrain)
    if (subjectDrivetrain !== null && compDrivetrain !== null) {
      if (subjectDrivetrain !== compDrivetrain) return false
    }

    // is_separate_market gate: if subject is separate market,
    // comp must be exactly the same trim_category.
    // (If comp.trim_category is null we still allow — decision D6.)
    if (subjectIsSeparateMarket && comp.trim_category !== null) {
      if (comp.trim_category !== subject.trim_category) return false
    }

    return true
  })
}

export { normalizeBodyStyle, normalizeDrivetrain }
