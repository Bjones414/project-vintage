// ============================================================
// Comp Engine V2 — Types
// ============================================================

export const MODEL_VERSION = 'v1.0'

// Factor names matching generation_weight_config.factor_name
export type FactorName =
  | 'mileage_similarity'
  | 'condition_stub'
  | 'year_similarity'
  | 'trim_variant_match'
  | 'market_region_match'
  | 'spec_composite'
  | 'transmission_variant_match'
  | 'color_rarity'
  | 'consignor_tier_match'
  | 'mechanical_remediation_status'

export const ALL_FACTORS: FactorName[] = [
  'mileage_similarity',
  'condition_stub',
  'year_similarity',
  'trim_variant_match',
  'market_region_match',
  'spec_composite',
  'transmission_variant_match',
  'color_rarity',
  'consignor_tier_match',
  'mechanical_remediation_status',
]

export type MileageBandName = 'ultra_low' | 'low' | 'moderate' | 'high' | 'very_high'

// Loaded from generation_weight_config
export interface GenerationWeights {
  generation: string
  weights: Record<FactorName, number>
}

// Loaded from generation_mileage_bands
export interface MileageBand {
  band_name: MileageBandName
  min_miles: number
  max_miles: number | null
}

// Loaded from trim_taxonomy
export interface TrimTaxonomyEntry {
  generation: string
  trim_category: string
  is_separate_market: boolean
}

// Pre-loaded config passed to the engine (avoids per-call DB queries in backtest)
export interface EngineConfig {
  weights: GenerationWeights       // resolved weights (may be 'default' fallback)
  bands: MileageBand[]             // resolved bands (may be 'default' fallback)
  taxonomy: TrimTaxonomyEntry[]    // all rows for this generation
  generationUsed: string           // actual generation key that was resolved
}

// A candidate comp listing (subset of listings columns needed by V2 engine)
export interface V2CompCandidate {
  listing_id: string
  year: number
  mileage: number | null
  final_price_cents: number
  sold_at: string               // ISO 8601 (auction_ends_at)
  generation_id: string | null
  trim_category: string | null
  body_style: string | null     // decoded_body_class, normalised
  drivetrain: string | null
  trim_variant: string | null
  market_region: string | null
  is_paint_to_sample: boolean | null
  seats_type: string | null
  wheels_factory_correct: boolean | null
  transmission_variant: string | null
  interior_color_rarity: string | null
  consignor_type: string | null
  mechanical_remediation_status: string | null
  // V1 condition stub inputs
  paint_meter_max_microns: number | null
  accident_history_stated: string | null
  listing_photo_count: number | null
  is_featured_listing: boolean | null
}

// The subject listing (same shape as candidate — many fields may be null)
export type V2Subject = V2CompCandidate & {
  id: string
  is_comp_resistant: boolean
}

// Per-comp scoring detail
export interface ScoredComp {
  listing_id: string
  price_cents: number
  similarity_score: number     // 0–1 weighted average of factors
  recency_weight: number       // 0–1 from spec breakpoints
  final_weight: number         // similarity_score × recency_weight
  factor_scores: Partial<Record<FactorName, number>>
}

// Aggregation output
export interface FairValueV2 {
  median_cents: number
  p25_cents: number
  p75_cents: number
  high_variance: boolean       // (P75 - P25) / median > 0.25
}

// Confidence score components (0–1 each)
export interface ConfidenceComponents {
  sample_size: number          // effective comp count, normalized
  iqr_tightness: number        // 1 - IQR/median, normalized
  recency: number              // best comp's recency weight
  best_similarity: number      // max similarity in selected comps
}

// Full engine result
export type V2Verdict =
  | 'priced_fairly'
  | 'priced_above'
  | 'priced_below'
  | 'insufficient_comps'
  | 'uncomparable'
  | 'low_confidence'

export interface V2CompsResult {
  verdict: V2Verdict | null    // null when no price was computed
  predicted_median: number | null
  predicted_p25: number | null
  predicted_p75: number | null
  confidence_score: number | null   // 0–100, not surfaced in UI
  methodology_text: string | null   // not surfaced in UI
  high_variance: boolean
  comp_count: number
  comps_used: ScoredComp[]
  comps_failed: V2CompCandidate[]   // no-sale listings within 24mo
  generation_used: string
  weights_used: Record<FactorName, number>
  insufficient_reason?: string
}
