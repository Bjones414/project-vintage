import { loadDefectCatalog } from './defect-catalog/parser'
import type { WatchForItem, WatchForSeverity, DefectApplicability, DefectExclude } from './defect-catalog/types'
import type { NhtsaRecall } from './recalls/nhtsa'

// DB generation_id → catalog generation name(s).
// Catalog files use family-level aliases ('996', '997', '987', '981') while the DB
// stores fine-grained IDs ('996.1', '997.2', '987.1-boxster', etc.). Each entry here
// lists the DB id plus any catalog aliases it should match.
const DB_GENERATION_TO_CATALOG: Record<string, string[]> = {
  // 996 family
  '996.1': ['996.1', '996'],
  '996.2': ['996.2', '996'],
  // 997 family
  '997.1': ['997.1', '997'],
  '997.2': ['997.2', '997'],
  // 987 Boxster family
  '987.1-boxster': ['987.1-boxster', '987.1', '987'],
  '987.2-boxster': ['987.2-boxster', '987.2', '987'],
  // 987 Cayman family
  '987.1-cayman': ['987.1-cayman', '987.1', '987'],
  '987.2-cayman': ['987.2-cayman', '987.2', '987'],
  // 981 family
  '981-boxster': ['981-boxster', '981'],
  '981-cayman': ['981-cayman', '981'],
  // 718 / 982 family
  '982-cayman': ['982-cayman', '718'],
  '982-boxster': ['982-boxster', '718'],
  // 991 family
  '991.1': ['991.1', '991'],
  '991.2': ['991.2', '991'],
  // 992 family
  '992.1': ['992.1', '992'],
  '992.2': ['992.2', '992'],
}

// Generations where M96/M97 and Mezger engines coexist in the same lineup.
// Trim text is required to distinguish which engine a specific listing has.
const MIXED_ENGINE_GENS = new Set(['996.1', '996.2', '997.1', '997.2'])

const SEVERITY_ORDER: Record<WatchForSeverity, number> = { high: 0, moderate: 1, low: 2 }

export interface ListingContext {
  generation_id: string | null
  engine_family: string | null
  year: number | null
  mileage: number | null
  trim?: string | null  // raw listing trim text; used to derive engine family for mixed-engine generations
}

// Derives 'Mezger' from trim text when the listing is in a mixed-engine generation.
// GT2 and GT3 are Mezger in all mixed-engine generations.
// Turbo is Mezger in 996.x and 997.1 — but the 997.2 Turbo/Turbo S switched to 9A1.
// Returns null when the trim doesn't conclusively identify the engine family.
export function deriveEngineFamily(
  trim: string | null | undefined,
  generationId: string | null | undefined,
): string | null {
  if (!trim || !generationId || !MIXED_ENGINE_GENS.has(generationId)) return null
  if (/\b(gt2|gt3)\b/i.test(trim)) return 'Mezger'
  if (/\bturbo\b/i.test(trim) && generationId !== '997.2') return 'Mezger'
  return null
}

function normalizeSeverity(raw: string): WatchForSeverity {
  const s = raw.toLowerCase()
  if (s.includes('catastrophic') || s === 'high' || s === 'high_to_catastrophic') return 'high'
  if (s.includes('moderate') || s === 'moderate_to_high' || s === 'low_to_moderate') return 'moderate'
  return 'low'
}

function generationMatchesList(dbId: string, catalogList: string[]): boolean {
  const aliases = DB_GENERATION_TO_CATALOG[dbId] ?? [dbId]
  return aliases.some((alias) => catalogList.includes(alias))
}

// Returns true when the exclude block applies to the given context — meaning the
// defect should be excluded. All criteria in the block must match simultaneously.
// An exclude block with no actionable criteria (i.e. only engine_family and we
// can't determine engine family) conservatively does not trigger exclusion.
function matchesExclude(exclude: DefectExclude, context: ListingContext): boolean {
  let hasActionableCriteria = false

  if (exclude.generation && exclude.generation.length > 0) {
    hasActionableCriteria = true
    if (!context.generation_id || !generationMatchesList(context.generation_id, exclude.generation)) {
      return false
    }
  }

  if (exclude.year_range && exclude.year_range.length === 2) {
    hasActionableCriteria = true
    const [low, high] = exclude.year_range
    if (!context.year || context.year < low || context.year > high) {
      return false
    }
  }

  if (exclude.engine_family && exclude.engine_family.length > 0) {
    // Prefer trim-derived engine family (precise) over generation-level engine family (coarse).
    const derivedEF = deriveEngineFamily(context.trim, context.generation_id)
    const ef = derivedEF ?? context.engine_family
    if (ef) {
      hasActionableCriteria = true
      // ef must be in the exclude list for this criterion to match
      if (!exclude.engine_family.some((e) => e.toLowerCase() === ef.toLowerCase())) {
        return false
      }
    }
    // If ef is null we cannot verify — skip this criterion rather than over-excluding.
  }

  return hasActionableCriteria
}

function isExcluded(applicability: DefectApplicability, context: ListingContext): boolean {
  if (!applicability.excludes) return false
  const excludes = Array.isArray(applicability.excludes)
    ? applicability.excludes
    : [applicability.excludes]
  return excludes.some((e) => matchesExclude(e, context))
}

export function matchDefects(context: ListingContext): WatchForItem[] {
  if (!context.generation_id) return []

  const catalog = loadDefectCatalog()
  const results: WatchForItem[] = []

  for (const record of catalog) {
    const { applicability } = record
    if (!applicability.generation || applicability.generation.length === 0) continue

    if (!generationMatchesList(context.generation_id, applicability.generation)) continue

    if (applicability.year_range && applicability.year_range.length === 2 && context.year) {
      const [low, high] = applicability.year_range
      if (context.year < low || context.year > high) continue
    }

    // Positive engine_family check: skip catalog records whose engine_family list
    // doesn't include this listing's engine family. Uses trim-derived EF when available,
    // falls back to context.engine_family (generation-level). When neither is available,
    // we conservatively include the record (avoid false negatives).
    if (applicability.engine_family?.length) {
      const derivedEF = deriveEngineFamily(context.trim, context.generation_id)
      const ef = derivedEF ?? context.engine_family
      if (ef && !applicability.engine_family.some((e) => e.toLowerCase() === ef.toLowerCase())) {
        continue
      }
    }

    if (isExcluded(applicability, context)) continue

    const description = (record.editorial_note ?? record.description ?? '').trim()
    const buyer_check = record.buyer_questions?.[0] ?? null

    // Relevance: count how many applicability fields narrowed the match beyond generation.
    // Higher score = more specific applicability = should rank higher within same severity.
    const relevance_score =
      (applicability.year_range ? 1 : 0) +
      (applicability.engine_family?.length ? 1 : 0) +
      (applicability.trim_category?.length ? 1 : 0)

    results.push({
      title: record.flag_title,
      severity: normalizeSeverity(record.severity),
      description,
      buyer_check,
      source: 'catalog',
      source_id: record.id,
      relevance_score,
    })
  }

  results.sort((a, b) => {
    const sevDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    if (sevDiff !== 0) return sevDiff
    return (b.relevance_score ?? 0) - (a.relevance_score ?? 0)
  })
  return results
}

export function recallsToWatchForItems(recalls: NhtsaRecall[]): WatchForItem[] {
  return recalls.map((r) => ({
    title: r.component,
    severity: 'high' as WatchForSeverity,
    description: [r.summary, r.consequence].filter(Boolean).join(' '),
    buyer_check: r.remedy || null,
    source: 'recall',
    source_id: r.campaignNumber,
  }))
}
