// ============================================================
// Comp Engine V2 — Stage 4: Generation-Aware Similarity Scoring
//
// Computes a 0–1 similarity score per comp against the subject.
// Factors with weight 0 are skipped entirely.
// Factors where data is unavailable on either side score 0.5 (neutral).
// Comps with final similarity < 0.4 are dropped (drop threshold).
// ============================================================

import type {
  V2Subject,
  V2CompCandidate,
  ScoredComp,
  FactorName,
  MileageBand,
  MileageBandName,
  GenerationWeights,
} from './types'
import { computeConditionStub, conditionSimilarity } from './condition-stub'

export const SIMILARITY_DROP_THRESHOLD = 0.4

// Cross-band similarity matrix (same for all generations, per spec)
const BAND_MATRIX: Record<MileageBandName, Record<MileageBandName, number>> = {
  ultra_low: { ultra_low: 1.0, low: 0.4, moderate: 0.0, high: 0.0, very_high: 0.0 },
  low:       { ultra_low: 0.4, low: 1.0, moderate: 0.6, high: 0.2, very_high: 0.0 },
  moderate:  { ultra_low: 0.0, low: 0.6, moderate: 1.0, high: 0.6, very_high: 0.3 },
  high:      { ultra_low: 0.0, low: 0.2, moderate: 0.6, high: 1.0, very_high: 0.7 },
  very_high: { ultra_low: 0.0, low: 0.0, moderate: 0.3, high: 0.7, very_high: 1.0 },
}

function getBand(miles: number | null, bands: MileageBand[]): MileageBandName | null {
  if (miles === null) return null
  const sorted = [...bands].sort((a, b) => a.min_miles - b.min_miles)
  for (const band of sorted) {
    if (miles >= band.min_miles && (band.max_miles === null || miles < band.max_miles)) {
      return band.band_name
    }
  }
  // If beyond all bands (shouldn't happen since very_high is unbounded), return very_high
  return 'very_high'
}

function mileageSimilarity(
  subjectMiles: number | null,
  compMiles: number | null,
  bands: MileageBand[],
): number {
  const subjectBand = getBand(subjectMiles, bands)
  const compBand = getBand(compMiles, bands)
  if (subjectBand === null || compBand === null) return 0.5
  return BAND_MATRIX[subjectBand][compBand]
}

function yearSimilarity(subjectYear: number, compYear: number): number {
  const diff = Math.abs(subjectYear - compYear)
  if (diff === 0) return 1.0
  if (diff === 1) return 0.85
  if (diff === 2) return 0.6
  if (diff === 3) return 0.4
  return 0.0
}

function trimVariantSimilarity(subjectVariant: string | null, compVariant: string | null): number {
  if (subjectVariant === null || compVariant === null) return 0.5
  return subjectVariant === compVariant ? 1.0 : 0.7
}

function marketRegionSimilarity(subjectRegion: string | null, compRegion: string | null): number {
  if (subjectRegion === null || compRegion === null) return 0.5
  return subjectRegion === compRegion ? 1.0 : 0.4
}

function specCompositeSimilarity(subject: V2Subject, comp: V2CompCandidate): number {
  // Sub-factors: PTS (0.40), seats_type (0.30), wheels_factory_correct (0.30)
  const ptsScore = booleanMatch(subject.is_paint_to_sample, comp.is_paint_to_sample)
  const seatsSore = exactMatch(subject.seats_type, comp.seats_type)
  const wheelsSore = booleanMatch(subject.wheels_factory_correct, comp.wheels_factory_correct)
  return 0.40 * ptsScore + 0.30 * seatsSore + 0.30 * wheelsSore
}

function transmissionSimilarity(subjectTx: string | null, compTx: string | null): number {
  if (subjectTx === null || compTx === null) return 0.5
  return subjectTx === compTx ? 1.0 : 0.7
}

function colorRaritySimilarity(subjectRarity: string | null, compRarity: string | null): number {
  if (subjectRarity === null || compRarity === null) return 0.5
  if (subjectRarity === compRarity) return 1.0
  return 0.6
}

function consignorTierSimilarity(subjectType: string | null, compType: string | null): number {
  if (subjectType === null || compType === null) return 0.5
  return subjectType === compType ? 1.0 : 0.7
}

function mechanicalRemediationSimilarity(
  subjectStatus: string | null,
  compStatus: string | null,
): number {
  if (subjectStatus === null || compStatus === null) return 0.5
  if (subjectStatus === 'documented_complete' && compStatus === 'documented_complete') return 1.0
  if (subjectStatus === 'documented_complete' && compStatus !== 'documented_complete') return 0.5
  if (subjectStatus === 'none_documented' && compStatus === 'none_documented') return 1.0
  if (subjectStatus === 'unknown' || compStatus === 'unknown') return 0.5
  return 0.5
}

// Exact text match: 1.0 if equal, 0.5 if either is null, 0.0 if different
function exactMatch(a: string | null, b: string | null): number {
  if (a === null || b === null) return 0.5
  return a === b ? 1.0 : 0.0
}

// Boolean match: 1.0 if equal, 0.5 if either is null, 0.0 if different
function booleanMatch(a: boolean | null, b: boolean | null): number {
  if (a === null || b === null) return 0.5
  return a === b ? 1.0 : 0.0
}

export function scoreComp(
  subject: V2Subject,
  comp: V2CompCandidate,
  weights: GenerationWeights,
  bands: MileageBand[],
): ScoredComp {
  const subjectCondition = computeConditionStub({
    paint_meter_max_microns: subject.paint_meter_max_microns,
    accident_history_stated: subject.accident_history_stated,
    listing_photo_count: subject.listing_photo_count,
    is_featured_listing: subject.is_featured_listing,
  })

  const compCondition = computeConditionStub({
    paint_meter_max_microns: comp.paint_meter_max_microns,
    accident_history_stated: comp.accident_history_stated,
    listing_photo_count: comp.listing_photo_count,
    is_featured_listing: comp.is_featured_listing,
  })

  const factorScores: Partial<Record<FactorName, number>> = {
    mileage_similarity:          mileageSimilarity(subject.mileage, comp.mileage, bands),
    condition_stub:              conditionSimilarity(subjectCondition, compCondition),
    year_similarity:             yearSimilarity(subject.year, comp.year),
    trim_variant_match:          trimVariantSimilarity(subject.trim_variant, comp.trim_variant),
    market_region_match:         marketRegionSimilarity(subject.market_region, comp.market_region),
    spec_composite:              specCompositeSimilarity(subject, comp),
    transmission_variant_match:  transmissionSimilarity(subject.transmission_variant, comp.transmission_variant),
    color_rarity:                colorRaritySimilarity(subject.interior_color_rarity, comp.interior_color_rarity),
    consignor_tier_match:        consignorTierSimilarity(subject.consignor_type, comp.consignor_type),
    mechanical_remediation_status: mechanicalRemediationSimilarity(
      subject.mechanical_remediation_status,
      comp.mechanical_remediation_status,
    ),
  }

  // Weighted average over factors with non-zero weight
  let weightedSum = 0
  let totalWeight = 0

  for (const [factor, score] of Object.entries(factorScores) as [FactorName, number][]) {
    const w = weights.weights[factor] ?? 0
    if (w > 0) {
      weightedSum += w * score
      totalWeight += w
    }
  }

  const similarity_score = totalWeight > 0 ? weightedSum / totalWeight : 0

  return {
    listing_id: comp.listing_id,
    price_cents: comp.final_price_cents,
    similarity_score,
    recency_weight: 0,  // filled in by Stage 5
    final_weight: 0,     // filled in after Stage 5
    factor_scores: factorScores,
  }
}

// Apply scoring to all candidates, then drop those below the threshold
export function applySimilarityScoring(
  subject: V2Subject,
  candidates: V2CompCandidate[],
  weights: GenerationWeights,
  bands: MileageBand[],
): ScoredComp[] {
  return candidates
    .map(c => scoreComp(subject, c, weights, bands))
    .filter(c => c.similarity_score >= SIMILARITY_DROP_THRESHOLD)
}

// Exported for tests
export { getBand, mileageSimilarity, yearSimilarity, specCompositeSimilarity }
