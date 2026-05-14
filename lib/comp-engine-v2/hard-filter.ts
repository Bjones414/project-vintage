// ============================================================
// Comp Engine V2 — Stage 1: Hard Categorical Filters
//
// A comp is dropped if it doesn't match the subject on:
//   - trim_category: when subject has a known category, comp MUST
//     match exactly. Null-category comps are excluded when the
//     subject's category is known (no D6 escape hatch for comps).
//   - body_style (decoded_body_class, normalized): when subject has
//     a known body style, comp MUST match. Null-body comps are
//     excluded when subject's body style is known.
//   - is_separate_market gate: if subject is separate market,
//     comp must be same trim_category (belt-and-suspenders).
//
// D6 rule fires only when the SUBJECT itself has no known value.
// A comp with null trim_category is NOT treated as universally
// compatible when the subject's category is known.
//
// Drivetrain is intentionally NOT a hard filter — it is a weighted
// soft factor in similarity scoring (Stage 4).
// ============================================================

import type { V2Subject, V2CompCandidate, TrimTaxonomyEntry } from './types'

// These categories are always treated as separate markets regardless of taxonomy config.
// They must only comp against their own category; null-trim comps are excluded.
// Expanding this set is belt-and-suspenders: even when the DB taxonomy is incomplete or
// a listing has null trim_category (D6 fires), known halo/performance categories never
// bleed into base Carrera pools and vice versa.
const ALWAYS_SEPARATE_MARKET = new Set([
  // Already-existing entries
  'coachbuilt',         // Singer, RUF, other restomod builds
  'limited',            // Sport Classic, R, Speedster (generic limited-edition bucket)

  // Turbo variants — every generation, never comp with Carrera
  'turbo_base',
  'turbo_s',
  'turbo_x50',          // 993 Turbo X50
  'turbo_look_m491',    // 993 Turbo Look (M491 option)

  // GT programme — each is its own market
  'gt2',
  'gt2_rs',
  'gt2_evo',            // 993 GT2 Evo
  'gt3',
  'gt3_rs',

  // Anniversary / homologation editions
  'anniversary',        // 40 Jahre 911, 50 Jahre, etc.

  // 911 R and S/T — limited halo production
  'r',                  // 991 R, 997.2 R
  'st',                 // 911 S/T

  // RS variants — all own market
  'rs_lightweight',     // 964 RS / Leichtbau
  'rs_america',         // 964 RS America (US-market lightweight)
  'rs_touring',         // 993 RS Touring
  'rs_clubsport',       // 993 RS Clubsport
  'rs_club',            // alias used in older catalog entries

  // Cup / Supercup / race-homologation
  'supercup',
  'cup',

  // Sport Classic — 997 limited
  'sport_classic',

  // Boxster / 718 halo models
  'boxster_spyder',     // 987/718 Spyder
  'boxster_gt4',        // 718 Boxster GT4
  'boxster_gt4_rs',     // 718 Boxster GT4 RS

  // Cayman halo models
  'cayman_r',           // 987 Cayman R
  'cayman_gt4',         // 981/718 Cayman GT4 — never comp with base Cayman
  'cayman_gt4_rs',      // 718 Cayman GT4 RS
])

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
  if (ALWAYS_SEPARATE_MARKET.has(trimCategory)) return true
  const entry = taxonomy.find(t => t.trim_category === trimCategory)
  return entry?.is_separate_market ?? false
}

export function applyHardFilters(
  subject: V2Subject,
  candidates: V2CompCandidate[],
  taxonomy: TrimTaxonomyEntry[],
): V2CompCandidate[] {
  const subjectBodyStyle = normalizeBodyStyle(subject.body_style)
  const subjectIsSeparateMarket = isSeparateMarket(subject.trim_category, taxonomy)

  return candidates.filter(comp => {
    // trim_category: when subject has a known category, comp MUST match.
    // Null-category comps are excluded — they are not safe defaults.
    // D6 only fires when subject.trim_category is itself null.
    if (subject.trim_category !== null) {
      if (comp.trim_category !== subject.trim_category) return false
    }

    // Bilateral separate-market gate: always-separate-market comps (coachbuilt,
    // limited) must never reach a subject outside their own category, even when
    // the subject has null trim_category. A Singer 964 must not appear in the
    // pool for a regular Carrera 2 regardless of whether the Carrera is categorized.
    if (comp.trim_category && ALWAYS_SEPARATE_MARKET.has(comp.trim_category)) {
      if (comp.trim_category !== subject.trim_category) return false
    }

    // body_style: when subject has a known body style, comp MUST match.
    // Null-body comps are excluded — a coupe subject must not pick up
    // cabriolet comps just because their body_class wasn't parsed.
    // D6 only fires when subject body style is unknown.
    const compBodyStyle = normalizeBodyStyle(comp.body_style)
    if (subjectBodyStyle !== null) {
      if (compBodyStyle !== subjectBodyStyle) return false
    }

    // is_separate_market gate: belt-and-suspenders on top of trim_category
    // filter. Fires when subject is a separate-market car (Singer, RS, etc.)
    // and ensures the comp is exactly the same category.
    if (subjectIsSeparateMarket) {
      if (comp.trim_category !== subject.trim_category) return false
    }

    return true
  })
}

export { normalizeBodyStyle, normalizeDrivetrain }
