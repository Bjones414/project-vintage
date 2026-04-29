import { createClient } from '@/lib/supabase/server'

export interface MatchInput {
  decoded_year: number | null
  decoded_make: string | null
  decoded_model: string | null
  decoded_body_class: string | null
  parsed_title: string | null
  parsed_model_family: string | null
}

export interface MatchResult {
  generation_id: string | null
  confidence: 'high' | 'medium' | 'low' | 'none'
  reason: string
  candidates: string[]
  needs_review: boolean
}

interface GenerationRow {
  generation_id: string
  model_family: string | null
  year_start: number
  year_end: number | null
}

// Model family resolution — ordered to avoid false matches.
// '718' must precede 'Boxster'/'Cayman' (e.g., "718 Boxster" → '718', not 'Boxster').
// '930' is the internal type designation for the air-cooled Turbo; model_family is '911'.
const FAMILY_PATTERNS: Array<[RegExp, string]> = [
  [/\b911\b/, '911'],
  [/\b930\b/, '911'],   // 930 Turbo type designation; resolves to '911' model_family
  [/\b356\b/, '356'],
  [/\b718\b/, '718'],   // 718 Boxster / 718 Cayman → '718' family (982 era only)
  [/\btaycan\b/i, 'Taycan'],
  [/\bpanamera\b/i, 'Panamera'],
  [/\bcayenne\b/i, 'Cayenne'],
  [/\bmacan\b/i, 'Macan'],
  [/\bcayman\b/i, 'Cayman'],
  [/\bboxster\b/i, 'Boxster'],
]

function resolveModelFamily(input: MatchInput): string | null {
  if (input.parsed_model_family) return input.parsed_model_family

  const candidates = [input.decoded_model, input.parsed_title].filter(Boolean)
  for (const s of candidates) {
    for (const [re, family] of FAMILY_PATTERNS) {
      if (re.test(s!)) return family
    }
  }
  return null
}

// Explicit transition-year disambiguation rules — checked before generic fallback.
// Ordered: more specific pattern first within each year/family key.
const TRANSITION_RULES: Record<string, Array<{ id: string; pattern: RegExp; reason: string }>> = {
  '911:1989': [
    {
      id: '911-3.2-carrera',
      pattern: /carrera\s*3\.?2|speedster/i,
      reason: 'Transition 1989: title indicates Carrera 3.2 / Speedster',
    },
    {
      id: '964',
      pattern: /\b964\b|\bC[24]\b/,
      reason: 'Transition 1989: title indicates 964 / C2 / C4',
    },
  ],
  '911:1994': [
    {
      id: '964',
      pattern: /\b964\b|\bC[24]\b/,
      reason: 'Transition 1994: title indicates 964 / C2 / C4',
    },
    {
      id: '993',
      pattern: /\b993\b/,
      reason: 'Transition 1994: title indicates 993',
    },
  ],
}

function disambiguateTransition(
  title: string,
  candidates: GenerationRow[],
  year: number,
  family: string,
  allIds: string[],
): MatchResult {
  if (candidates.length === 1) {
    return {
      generation_id: candidates[0].generation_id,
      confidence: 'high',
      reason: 'Transition year: single candidate after prior disambiguation',
      candidates: allIds,
      needs_review: false,
    }
  }

  // Explicit rules for known transition years
  const key = `${family}:${year}`
  const rules = TRANSITION_RULES[key]
  if (rules && title) {
    for (const rule of rules) {
      if (rule.pattern.test(title) && candidates.some((c) => c.generation_id === rule.id)) {
        return {
          generation_id: rule.id,
          confidence: 'high',
          reason: rule.reason,
          candidates: allIds,
          needs_review: false,
        }
      }
    }
  }

  // Generic: check if a generation's numeric prefix appears in the title.
  // "997.1" → "997", "991.2" → "991", "992" → "992", "964" → "964".
  // Skip the prefix when it equals the family name (e.g., "911" for 911-family IDs like
  // "911-3.2-carrera") — the model name appears in every listing title and is not
  // a discriminating generation signal.
  if (title) {
    for (const c of candidates) {
      const numPrefix = c.generation_id.match(/^(\d{3}(?:\.\d)?)/)?.[1]
      if (numPrefix && numPrefix !== family) {
        const escaped = numPrefix.replace('.', '\\.')
        if (new RegExp(`\\b${escaped}\\b`).test(title)) {
          return {
            generation_id: c.generation_id,
            confidence: 'high',
            reason: `Transition year ${year}: title contains generation identifier "${numPrefix}"`,
            candidates: allIds,
            needs_review: false,
          }
        }
      }
    }
  }

  // Default: pick the later generation (highest year_start), medium confidence
  const sorted = [...candidates].sort((a, b) => b.year_start - a.year_start)
  return {
    generation_id: sorted[0].generation_id,
    confidence: 'medium',
    reason: `Transition year ${year}, defaulted to later generation (${sorted[0].generation_id})`,
    candidates: allIds,
    needs_review: false,
  }
}

function disambiguate(
  input: MatchInput,
  candidates: GenerationRow[],
  family: string,
  year: number,
): MatchResult {
  const allIds = candidates.map((c) => c.generation_id)

  if (candidates.length === 1) {
    return {
      generation_id: candidates[0].generation_id,
      confidence: 'high',
      reason: 'year+family unique match',
      candidates: allIds,
      needs_review: false,
    }
  }

  // Step 4a — Turbo detection for G-series era (1975–1989, family 911, '930' in candidates)
  if (family === '911' && year >= 1975 && year <= 1989 && allIds.includes('930')) {
    const title = input.parsed_title ?? ''
    if (/\bturbo\b/i.test(title)) {
      return {
        generation_id: '930',
        confidence: 'high',
        reason: 'G-series era: Turbo detected in title',
        candidates: allIds,
        needs_review: false,
      }
    }
    // No turbo → remove 930 and continue with Carrera-line candidates
    const carreraLine = candidates.filter((c) => c.generation_id !== '930')
    if (carreraLine.length === 1) {
      return {
        generation_id: carreraLine[0].generation_id,
        confidence: 'high',
        reason: 'G-series era: no Turbo detected — Carrera line',
        candidates: allIds,
        needs_review: false,
      }
    }
    // Multiple Carrera-line candidates (e.g., year 1989: 911-3.2-carrera + 964) → 4c
    return disambiguateTransition(input.parsed_title ?? '', carreraLine, year, family, allIds)
  }

  // Step 4b — Boxster vs Cayman for 718 family (982 era)
  if (family === '718' && allIds.includes('982-boxster') && allIds.includes('982-cayman')) {
    const bodyClass = input.decoded_body_class ?? ''
    const titleLower = (input.parsed_title ?? '').toLowerCase()
    if (bodyClass === 'Coupe' || titleLower.includes('cayman')) {
      return {
        generation_id: '982-cayman',
        confidence: 'high',
        reason: `718 era: Cayman identified via ${bodyClass === 'Coupe' ? 'body class (Coupe)' : 'title keyword'}`,
        candidates: allIds,
        needs_review: false,
      }
    }
    if (/convertible|roadster/i.test(bodyClass) || titleLower.includes('boxster')) {
      return {
        generation_id: '982-boxster',
        confidence: 'high',
        reason: `718 era: Boxster identified via ${bodyClass ? 'body class' : 'title keyword'}`,
        candidates: allIds,
        needs_review: false,
      }
    }
    return {
      generation_id: allIds[0],
      confidence: 'low',
      reason: '718 era Boxster/Cayman ambiguity unresolved',
      candidates: allIds,
      needs_review: true,
    }
  }

  // Step 4c — Two-candidate transition year
  if (candidates.length === 2) {
    return disambiguateTransition(input.parsed_title ?? '', candidates, year, family, allIds)
  }

  // Step 4d — Multiple candidates, no disambiguation rule resolved
  return {
    generation_id: allIds[0],
    confidence: 'low',
    reason: `Multiple candidates, disambiguation rules did not resolve: [${allIds.join(', ')}]`,
    candidates: allIds,
    needs_review: true,
  }
}

// Step 6 — Title-only path for pre-1981 / no decoded_year cases.
// Family is already resolved by the caller (Step 2).
function matchFromTitle(
  input: MatchInput,
  rows: GenerationRow[],
  family: string,
): MatchResult {
  const title = input.parsed_title ?? ''

  // Extract a model year from the title
  const yearMatch = title.match(/\b((19|20)\d{2})\b/)
  const extractedYear = yearMatch ? parseInt(yearMatch[1]) : null

  if (extractedYear !== null) {
    const yearCandidates = rows.filter(
      (r) =>
        r.model_family === family &&
        r.year_start <= extractedYear &&
        (r.year_end === null || r.year_end >= extractedYear),
    )

    if (yearCandidates.length === 1) {
      return {
        generation_id: yearCandidates[0].generation_id,
        confidence: 'medium',
        reason: 'Title-based match (pre-1981 or no VIN decode)',
        candidates: yearCandidates.map((c) => c.generation_id),
        needs_review: false,
      }
    }

    if (yearCandidates.length > 1) {
      const inner = disambiguate(input, yearCandidates, family, extractedYear)
      return {
        ...inner,
        // Cap confidence at 'medium' — we're working from title, not a decoded VIN
        confidence: inner.confidence === 'high' ? 'medium' : inner.confidence,
        reason: `Title-based match (pre-1981 or no VIN decode): ${inner.reason}`,
      }
    }
    // zero candidates → fall through to keyword search
  }

  // Try matching a generation_id keyword found in the title against family rows
  const familyRows = rows.filter((r) => r.model_family === family)
  for (const row of familyRows) {
    // Extract the numeric prefix of the ID (e.g., "993" from "993", "996" from "996.1")
    const numPrefix = row.generation_id.match(/^(\d{3}(?:\.\d)?)/)?.[1]
    if (numPrefix && new RegExp(`\\b${numPrefix.replace('.', '\\.')}\\b`).test(title)) {
      return {
        generation_id: row.generation_id,
        confidence: 'medium',
        reason: 'Title-based match via generation ID keyword (pre-1981 or no VIN decode)',
        candidates: [row.generation_id],
        needs_review: false,
      }
    }
  }

  return {
    generation_id: null,
    confidence: 'none',
    reason: 'Pre-1981 chassis, no title-based match',
    candidates: [],
    needs_review: true,
  }
}

// computeMatch is the pure matching function — exported for testing.
// Callers supply the full porsche_generations row set; matchGeneration fetches it from Supabase.
export function computeMatch(input: MatchInput, rows: GenerationRow[]): MatchResult {
  // Step 1 — Make guard
  if (input.decoded_make !== null && input.decoded_make.toUpperCase() !== 'PORSCHE') {
    return {
      generation_id: null,
      confidence: 'none',
      reason: `Non-Porsche make: ${input.decoded_make}`,
      candidates: [],
      needs_review: true,
    }
  }

  // Step 2 — Model family resolution
  const family = resolveModelFamily(input)
  if (family === null) {
    return {
      generation_id: null,
      confidence: 'none',
      reason: 'Model family unresolved',
      candidates: [],
      needs_review: true,
    }
  }

  // Step 6 — No decoded year → title-only fallback
  if (input.decoded_year === null) {
    return matchFromTitle(input, rows, family)
  }

  // Step 3 — Year-window candidate search
  // Sanity-check the year before querying. NHTSA won't return impossible years, but
  // explicit guard here prevents open-ended generations (year_end: null) from matching
  // years that are clearly out of any plausible production window.
  // TODO: bump the upper bound as production years advance past 2040.
  const year = input.decoded_year
  if (year < 1886 || year > 2040) {
    return {
      generation_id: null,
      confidence: 'none',
      reason: `Year ${year} is outside the valid range (1886–2040)`,
      candidates: [],
      needs_review: true,
    }
  }

  const candidates = rows.filter(
    (r) =>
      r.model_family === family &&
      r.year_start <= year &&
      (r.year_end === null || r.year_end >= year),
  )

  // Step 5 — Zero candidates
  if (candidates.length === 0) {
    return {
      generation_id: null,
      confidence: 'none',
      reason: `No generation matched year=${year} family=${family}`,
      candidates: [],
      needs_review: true,
    }
  }

  // Step 4 — Disambiguation
  return disambiguate(input, candidates, family, year)
}

// matchGeneration fetches all porsche_generations rows and delegates to computeMatch.
// Errors from the DB query return a safe 'none' result — the analyze flow continues.
export async function matchGeneration(input: MatchInput): Promise<MatchResult> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('porsche_generations')
      .select('generation_id, model_family, year_start, year_end')

    if (error || !data) {
      console.error('[generation-match] Failed to fetch porsche_generations:', error)
      return {
        generation_id: null,
        confidence: 'none',
        reason: 'Database error fetching generation data',
        candidates: [],
        needs_review: true,
      }
    }

    return computeMatch(input, data)
  } catch (err) {
    console.error('[generation-match] Unexpected error:', err)
    return {
      generation_id: null,
      confidence: 'none',
      reason: 'Unexpected error during generation matching',
      candidates: [],
      needs_review: true,
    }
  }
}
