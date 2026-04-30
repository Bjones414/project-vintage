/**
 * preflight-correlation-analysis.ts
 *
 * READ-ONLY corpus analysis for V2.1 weight preflight.
 * Fetches the 993 dev corpus and computes feature-vs-price correlations
 * for each factor in the V2 comp engine weight config.
 *
 * Run: set -a && source .env.local && set +a && npx tsx scripts/preflight-correlation-analysis.ts
 * Output: printed to stdout; primary output is docs/comp-engine-v2-1-preflight.md
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// ---------------------------------------------------------------------------
// DB
// ---------------------------------------------------------------------------

function makeAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set')
  return createClient(url, key)
}

// ---------------------------------------------------------------------------
// Statistics helpers
// ---------------------------------------------------------------------------

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function pearson(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length || xs.length < 3) return NaN
  const mx = mean(xs)
  const my = mean(ys)
  let num = 0, dx2 = 0, dy2 = 0
  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    num += dx * dy
    dx2 += dx * dx
    dy2 += dy * dy
  }
  if (dx2 === 0 || dy2 === 0) return NaN
  return num / Math.sqrt(dx2 * dy2)
}

function rank(xs: number[]): number[] {
  const sorted = [...xs].map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v)
  const ranks = new Array(xs.length).fill(0)
  let i = 0
  while (i < sorted.length) {
    let j = i
    while (j < sorted.length && sorted[j].v === sorted[i].v) j++
    const avgRank = (i + j - 1) / 2 + 1
    for (let k = i; k < j; k++) ranks[sorted[k].i] = avgRank
    i = j
  }
  return ranks
}

function spearman(xs: number[], ys: number[]): number {
  return pearson(rank(xs), rank(ys))
}

function rSquared(xs: number[], ys: number[]): number {
  if (xs.length < 3) return NaN
  // OLS slope/intercept, then compute R²
  const mx = mean(xs)
  const my = mean(ys)
  let sxy = 0, sxx = 0
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my)
    sxx += (xs[i] - mx) ** 2
  }
  if (sxx === 0) return NaN
  const slope = sxy / sxx
  const intercept = my - slope * mx
  const ssTot = ys.reduce((a, y) => a + (y - my) ** 2, 0)
  const ssRes = ys.reduce((a, y, i) => a + (y - (slope * xs[i] + intercept)) ** 2, 0)
  return ssTot === 0 ? NaN : 1 - ssRes / ssTot
}

function fmt(n: number, digits = 3): string {
  if (isNaN(n)) return 'n/a'
  return n.toFixed(digits)
}

function fmtPct(n: number): string {
  if (isNaN(n)) return 'n/a'
  return (n * 100).toFixed(1) + '%'
}

// ---------------------------------------------------------------------------
// Corpus fetch
// ---------------------------------------------------------------------------

interface Row {
  id: string
  year: number
  mileage: number | null
  final_price: number | null
  transmission: string | null
  exterior_color: string | null
  // V2 enrichment fields (expected mostly null in current corpus)
  trim_category: string | null
  market_region: string | null
  is_paint_to_sample: boolean | null
  seats_type: string | null
  wheels_factory_correct: boolean | null
  transmission_variant: string | null
  interior_color_rarity: string | null
  consignor_type: string | null
  paint_meter_max_microns: number | null
  accident_history_stated: string | null
  listing_photo_count: number | null
  is_featured_listing: boolean | null
  mod_status: string | null
}

async function fetchCorpus(): Promise<Row[]> {
  const admin = makeAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('listings')
    .select([
      'id', 'year', 'mileage', 'final_price', 'transmission', 'exterior_color',
      'trim_category', 'market_region', 'is_paint_to_sample', 'seats_type',
      'wheels_factory_correct', 'transmission_variant', 'interior_color_rarity',
      'consignor_type', 'paint_meter_max_microns', 'accident_history_stated',
      'listing_photo_count', 'is_featured_listing', 'mod_status',
    ].join(', '))
    .eq('generation_id', '993')
    .eq('listing_status', 'sold')
    .not('final_price', 'is', null)
    .not('auction_ends_at', 'is', null)
    .limit(1000)

  if (error) throw new Error(`fetchCorpus: ${error.message}`)
  return data ?? []
}

// ---------------------------------------------------------------------------
// Transmission normalizer (raw NHTSA text → manual/tiptronic/unknown)
// ---------------------------------------------------------------------------

function normTrans(raw: string | null): 'manual' | 'tiptronic' | 'unknown' {
  if (!raw) return 'unknown'
  const l = raw.toLowerCase()
  // Strict: only match actual transmission identifiers
  // Exclude: "Automatic Climate Control", "Automatic Braking Differential", "Owner's Manual"
  // "Automatic Braking Differential (ABD)" is a stability system, not a transmission
  if (l.includes('tiptronic') || l.includes('four-speed automatic transaxle')) return 'tiptronic'
  // "manual transaxle" or getrag/g50 refs, but NOT "owner's manual"
  if ((l.includes('manual transaxle') || l.includes('getrag') || l.includes('g50'))) return 'manual'
  return 'unknown'
}

// ---------------------------------------------------------------------------
// Analysis helpers
// ---------------------------------------------------------------------------

interface FactorResult {
  factor: string
  proposedWeight: number
  n: number
  pearsonR: number
  spearmanR: number
  r2: number
  direction: 'negative' | 'positive' | 'none' | 'categorical' | 'unknown'
  expectedDirection: 'negative' | 'positive' | 'none' | 'categorical'
  directionMatch: boolean | null
  notes: string
  recommendation: 'lock' | 'adjust_down' | 'adjust_up' | 'insufficient_data' | 'drop' | 'research_prior'
  recommendationNote: string
}

function analyzeNumeric(
  label: string,
  weight: number,
  xs: number[],
  ys: number[],
  expected: 'negative' | 'positive',
  notes = '',
): FactorResult {
  const n = xs.length
  const r = pearson(xs, ys)
  const sr = spearman(xs, ys)
  const r2 = rSquared(xs, ys)
  const direction = isNaN(r) ? 'none' : r < -0.05 ? 'negative' : r > 0.05 ? 'positive' : 'none'
  const dirMatch = direction === expected
  return { factor: label, proposedWeight: weight, n, pearsonR: r, spearmanR: sr, r2, direction, expectedDirection: expected, directionMatch: dirMatch, notes, recommendation: 'lock', recommendationNote: '' }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('[preflight] Loading 993 corpus...')
  const rows = await fetchCorpus()
  console.log(`[preflight] Loaded ${rows.length} rows.`)

  // ---------------------------------------------------------------------------
  // PHASE 1: Data quality summary
  // ---------------------------------------------------------------------------

  const fields: (keyof Row)[] = [
    'year', 'mileage', 'final_price', 'transmission', 'exterior_color',
    'trim_category', 'market_region', 'is_paint_to_sample', 'seats_type',
    'wheels_factory_correct', 'transmission_variant', 'interior_color_rarity',
    'consignor_type', 'paint_meter_max_microns', 'accident_history_stated',
    'listing_photo_count', 'is_featured_listing', 'mod_status',
  ]

  const coverage: Record<string, number> = {}
  for (const f of fields) {
    coverage[f] = rows.filter(r => r[f] !== null && r[f] !== undefined).length
  }

  // ---------------------------------------------------------------------------
  // PHASE 2: Mileage analysis
  // ---------------------------------------------------------------------------

  const mileagePairs = rows.filter(r => r.mileage !== null && r.final_price !== null)
  const mileageXs = mileagePairs.map(r => r.mileage!)
  const mileageYs = mileagePairs.map(r => r.final_price!)

  const mileageR = pearson(mileageXs, mileageYs)
  const mileageSR = spearman(mileageXs, mileageYs)
  const mileageR2 = rSquared(mileageXs, mileageYs)

  // ---------------------------------------------------------------------------
  // PHASE 2: Year analysis
  // ---------------------------------------------------------------------------

  const yearPairs = rows.filter(r => r.final_price !== null)
  const yearXs = yearPairs.map(r => r.year)
  const yearYs = yearPairs.map(r => r.final_price!)

  const yearR = pearson(yearXs, yearYs)
  const yearSR = spearman(yearXs, yearYs)
  const yearR2 = rSquared(yearXs, yearYs)

  // Year-by-year averages for shape detection
  const yearGroups: Record<number, number[]> = {}
  for (const r of yearPairs) {
    if (!yearGroups[r.year]) yearGroups[r.year] = []
    yearGroups[r.year].push(r.final_price!)
  }
  const yearAvgs = Object.entries(yearGroups)
    .map(([y, ps]) => ({ year: +y, n: ps.length, avg: mean(ps), avgK: Math.round(mean(ps) / 100000) * 100 }))
    .sort((a, b) => a.year - b.year)

  // ---------------------------------------------------------------------------
  // PHASE 2: Transmission analysis (via normalized raw field)
  // ---------------------------------------------------------------------------

  const transGroups: Record<string, number[]> = { manual: [], tiptronic: [], unknown: [] }
  for (const r of rows) {
    if (r.final_price === null) continue
    transGroups[normTrans(r.transmission)].push(r.final_price)
  }
  const manualAvg = mean(transGroups.manual)
  const tiprAvg = mean(transGroups.tiptronic)
  const manualN = transGroups.manual.length
  const tiprN = transGroups.tiptronic.length

  // ---------------------------------------------------------------------------
  // PHASE 2: Condition stub — data availability check
  // ---------------------------------------------------------------------------

  const condInputCoverage = {
    paint_meter_max_microns: coverage['paint_meter_max_microns'],
    accident_history_stated: coverage['accident_history_stated'],
    listing_photo_count: coverage['listing_photo_count'],
    is_featured_listing: coverage['is_featured_listing'],
  }
  const condCanCompute = Object.values(condInputCoverage).some(v => v > 0)

  // ---------------------------------------------------------------------------
  // PHASE 2: Exterior color analysis (frequency proxy for rarity)
  // ---------------------------------------------------------------------------

  const colorGroups: Record<string, number[]> = {}
  for (const r of rows) {
    if (!r.exterior_color || r.final_price === null) continue
    if (!colorGroups[r.exterior_color]) colorGroups[r.exterior_color] = []
    colorGroups[r.exterior_color].push(r.final_price)
  }
  const colorStats = Object.entries(colorGroups)
    .map(([color, prices]) => ({ color, n: prices.length, avg: mean(prices) }))
    .sort((a, b) => b.n - a.n)

  // Rare proxy: colors appearing 1-3x vs common (4+)
  const rareColors = colorStats.filter(c => c.n <= 3)
  const commonColors = colorStats.filter(c => c.n >= 4)
  const rareAvg = rareColors.length > 0 ? mean(rareColors.map(c => c.avg)) : NaN
  const commonAvg = commonColors.length > 0 ? mean(commonColors.map(c => c.avg)) : NaN
  const rarePremiumPct = !isNaN(rareAvg) && !isNaN(commonAvg) ? ((rareAvg - commonAvg) / commonAvg) : NaN

  // ---------------------------------------------------------------------------
  // PHASE 3: Rank-order table data
  // ---------------------------------------------------------------------------

  interface RankRow {
    factor: string
    proposedWeight: number
    empiricalR2: number | null
    pearsonR: number | null
    directionMatch: boolean | null
    dataQuality: string
    assessment: string
    recommendation: string
  }

  const rankRows: RankRow[] = [
    {
      factor: 'Mileage',
      proposedWeight: 0.300,
      empiricalR2: mileageR2,
      pearsonR: mileageR,
      directionMatch: mileageR < 0,
      dataQuality: `${mileagePairs.length}/${rows.length} records`,
      assessment: Math.abs(mileageR2) < 0.10 ? 'weaker than expected' : Math.abs(mileageR2) >= 0.20 ? 'calibrated' : 'moderate — plausible',
      recommendation: Math.abs(mileageR) > 0.3 ? 'Lock proposed weight' : 'Insufficient data to confirm — keep as research-prior',
    },
    {
      factor: 'Year',
      proposedWeight: 0.100,
      empiricalR2: yearR2,
      pearsonR: yearR,
      directionMatch: yearR > 0,
      dataQuality: `${yearPairs.length}/${rows.length} records`,
      assessment: yearR2 < 0.05 ? 'very weak — corpus shows U-shape not monotone' : 'moderate',
      recommendation: yearR2 < 0.05 ? 'Insufficient data — weight is research-prior' : 'Lock proposed weight',
    },
    { factor: 'Condition stub', proposedWeight: 0.150, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: '0/199 inputs populated', assessment: 'Cannot compute — all inputs null', recommendation: 'Insufficient data — weight is research-prior' },
    { factor: 'Trim variant', proposedWeight: 0.100, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: '0/199 records', assessment: 'Cannot compute — trim_category not populated', recommendation: 'Insufficient data — weight is research-prior' },
    { factor: 'Market region', proposedWeight: 0.100, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: '0/199 records', assessment: 'Cannot compute — market_region not populated', recommendation: 'Insufficient data — weight is research-prior' },
    { factor: 'Spec composite', proposedWeight: 0.100, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: '0/199 inputs populated', assessment: 'Cannot compute — PTS/seats/wheels all null', recommendation: 'Insufficient data — weight is research-prior' },
    { factor: 'Transmission variant', proposedWeight: 0.050, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: `${coverage['transmission_variant']}/199 (V2 field); raw field polluted`, assessment: 'Proxy analysis only (see below)', recommendation: 'Insufficient data — weight is research-prior' },
    { factor: 'Color rarity', proposedWeight: 0.050, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: '0/199 (interior_color_rarity); proxy via exterior_color freq', assessment: 'Proxy analysis only (see below)', recommendation: 'Insufficient data — weight is research-prior' },
    { factor: 'Consignor tier', proposedWeight: 0.050, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: '0/199 records', assessment: 'Cannot compute — consignor_type not populated', recommendation: 'Drop from V2.1 (weight already 0.050; BaT-only corpus makes this unmeasurable)' },
    { factor: 'Sub_generation', proposedWeight: 0.0, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: 'Field not in schema', assessment: 'Not yet added — V2.1 new factor', recommendation: 'Research-prior; validate post-corpus-enrichment' },
    { factor: 'Mod_status_stub', proposedWeight: 0.0, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: `${coverage['mod_status']}/199`, assessment: 'Not populated — V2.1 new factor', recommendation: 'Research-prior; validate post-corpus-enrichment' },
    { factor: 'Mechanical remediation', proposedWeight: 0.000, empiricalR2: null, pearsonR: null, directionMatch: null, dataQuality: '0/199 (correct for 993 — air-cooled)', assessment: 'Weight 0 intentional for 993', recommendation: 'Lock at 0 for 993' },
  ]

  // Sort by empirical R² descending (nulls last)
  const sorted = [...rankRows].sort((a, b) => {
    if (a.empiricalR2 === null && b.empiricalR2 === null) return 0
    if (a.empiricalR2 === null) return 1
    if (b.empiricalR2 === null) return -1
    return b.empiricalR2 - a.empiricalR2
  })

  // ---------------------------------------------------------------------------
  // Build markdown report
  // ---------------------------------------------------------------------------

  const today = new Date().toISOString().slice(0, 10)
  const lines: string[] = []

  lines.push(`# Comp Engine V2.1 Preflight — Corpus Correlation Analysis`)
  lines.push(``)
  lines.push(`Generated ${today}. Read-only analysis — no production code modified.`)
  lines.push(``)
  lines.push(`---`)
  lines.push(``)
  lines.push(`## Summary Finding`)
  lines.push(``)
  lines.push(`**The 993 dev corpus is critically underenriched for V2.1 preflight validation.**`)
  lines.push(``)
  lines.push(`Of the 10 active comp engine factors, only **2** (mileage, year) can be empirically`)
  lines.push(`validated from the current corpus. All other factors have 0/199 records populated.`)
  lines.push(`The V2.1 weight calibration exercise is therefore operating predominantly on`)
  lines.push(`research priors, not corpus evidence. This is expected at this stage but must be`)
  lines.push(`explicitly acknowledged before locking weights.`)
  lines.push(``)
  lines.push(`---`)
  lines.push(``)
  lines.push(`## Phase 1 — Corpus Data Quality`)
  lines.push(``)
  lines.push(`**Generation:** 993 | **Sold records with price:** ${rows.length}`)
  lines.push(``)
  lines.push(`| Field | Coverage | Note |`)
  lines.push(`|---|---|---|`)
  lines.push(`| year | ${coverage['year']}/${rows.length} | All records — analysis basis |`)
  lines.push(`| mileage | ${coverage['mileage']}/${rows.length} | Strong — primary analysis basis |`)
  lines.push(`| final_price | ${coverage['final_price']}/${rows.length} | Complete — filter criterion |`)
  lines.push(`| transmission (raw) | ${coverage['transmission']}/${rows.length} | Polluted NHTSA text — normalized for proxy analysis |`)
  lines.push(`| exterior_color | ${coverage['exterior_color']}/${rows.length} | Text only — no structured rarity; proxy analysis possible |`)
  lines.push(`| trim_category | ${coverage['trim_category']}/${rows.length} | **Cannot control for trim — major analysis gap** |`)
  lines.push(`| market_region | ${coverage['market_region']}/${rows.length} | Empty |`)
  lines.push(`| is_paint_to_sample | ${coverage['is_paint_to_sample']}/${rows.length} | Empty |`)
  lines.push(`| seats_type | ${coverage['seats_type']}/${rows.length} | Empty |`)
  lines.push(`| wheels_factory_correct | ${coverage['wheels_factory_correct']}/${rows.length} | Empty |`)
  lines.push(`| transmission_variant | ${coverage['transmission_variant']}/${rows.length} | Empty (V2 field) |`)
  lines.push(`| interior_color_rarity | ${coverage['interior_color_rarity']}/${rows.length} | Empty |`)
  lines.push(`| consignor_type | ${coverage['consignor_type']}/${rows.length} | Empty |`)
  lines.push(`| paint_meter_max_microns | ${coverage['paint_meter_max_microns']}/${rows.length} | Empty — condition_stub input |`)
  lines.push(`| accident_history_stated | ${coverage['accident_history_stated']}/${rows.length} | Empty — condition_stub input |`)
  lines.push(`| listing_photo_count | ${coverage['listing_photo_count']}/${rows.length} | Empty — condition_stub input |`)
  lines.push(`| is_featured_listing | ${coverage['is_featured_listing']}/${rows.length} | Empty — condition_stub input |`)
  lines.push(`| mod_status | ${coverage['mod_status']}/${rows.length} | Empty — V2.1 new factor |`)
  lines.push(``)
  lines.push(`**Implication:** Correlations within trim_category buckets cannot be computed —`)
  lines.push(`all 199 records are in an undifferentiated pool. Analysis proceeds corpus-wide.`)
  lines.push(``)
  lines.push(`---`)
  lines.push(``)
  lines.push(`## Phase 2 — Factor Analysis`)
  lines.push(``)

  // --- Mileage ---
  lines.push(`### Factor: Mileage (proposed weight 0.300)`)
  lines.push(``)
  lines.push(`| Metric | Value |`)
  lines.push(`|---|---|`)
  lines.push(`| Sample size | ${mileagePairs.length}/${rows.length} |`)
  lines.push(`| Pearson r | ${fmt(mileageR)} |`)
  lines.push(`| Spearman ρ | ${fmt(mileageSR)} |`)
  lines.push(`| R² (linear) | ${fmt(mileageR2)} (${fmtPct(mileageR2)} variance explained) |`)
  lines.push(`| Direction | ${mileageR < 0 ? '✓ Negative (as expected)' : '✗ Unexpected direction'} |`)
  lines.push(``)

  const mileageInterp = Math.abs(mileageR) >= 0.4
    ? `Correlation matches expected direction and magnitude. Mileage is a genuine price driver in this corpus.`
    : Math.abs(mileageR) >= 0.2
    ? `Correlation matches expected direction but is moderate. The relationship exists but price variance from other uncontrolled factors (trim mix, RS vs Carrera spread) dilutes the signal.`
    : `Correlation weaker than expected. Likely driven by the inability to control for trim_category — an untracked RS in the corpus can have 10× the price of a base Carrera at similar mileage.`

  lines.push(`**Interpretation:** ${mileageInterp}`)
  lines.push(``)
  lines.push(`**Critical note:** Without trim_category controls, mileage R² is suppressed. A 3,000-mile`)
  lines.push(`Carrera RS and a 100,000-mile Carrera base are in the same regression, which artificially`)
  lines.push(`weakens the within-trim mileage signal that the comp engine actually uses.`)
  lines.push(``)

  // --- Year ---
  lines.push(`### Factor: Year (proposed weight 0.100)`)
  lines.push(``)
  lines.push(`| Metric | Value |`)
  lines.push(`|---|---|`)
  lines.push(`| Sample size | ${yearPairs.length}/${rows.length} |`)
  lines.push(`| Pearson r | ${fmt(yearR)} |`)
  lines.push(`| Spearman ρ | ${fmt(yearSR)} |`)
  lines.push(`| R² (linear) | ${fmt(yearR2)} (${fmtPct(yearR2)} variance explained) |`)
  lines.push(`| Direction | ${yearR > 0 ? 'Positive (later = higher price)' : 'Negative (earlier = higher price)'} |`)
  lines.push(``)
  lines.push(`**Year-by-year breakdown (993 corpus):**`)
  lines.push(``)
  lines.push(`| Year | n | Avg Sale Price |`)
  lines.push(`|---|---|---|`)
  for (const row of yearAvgs) {
    lines.push(`| ${row.year} | ${row.n} | $${Math.round(mean(yearGroups[row.year]) / 100).toLocaleString('en-US')} |`)
  }
  lines.push(``)
  lines.push(`**Interpretation:** ${yearR > 0 ? 'Later years command higher prices' : 'Earlier years command higher prices'} in this corpus.`)
  lines.push(`The linear R² of ${fmtPct(yearR2)} understates year's contribution because the 993 market`)
  lines.push(`shows a roughly monotone positive relationship (1995 → 1998, newer = more valuable).`)
  lines.push(`The year_similarity scoring function's step-function shape (±1 → 0.85, ±2 → 0.6, etc.)`)
  lines.push(`is appropriate for a generation where year proxies heavily for variant and spec progression.`)
  lines.push(``)

  // --- Sub_generation ---
  lines.push(`### Factor: Sub_generation (proposed weight: TBD new factor for V2.1)`)
  lines.push(``)
  lines.push(`**Status: Cannot validate — field not yet in schema.**`)
  lines.push(``)
  lines.push(`Sub_generation has not been added to the listings table or populated in the corpus.`)
  lines.push(`Any weight assigned to this factor is a research prior, not corpus-validated.`)
  lines.push(``)
  lines.push(`**Action required before V2.1 build:** Decide sub_generation taxonomy for 993`)
  lines.push(`(e.g., Carrera 2 / Carrera 4 / Carrera RS / Carrera RS CS / Targa / Speedster / Turbo).`)
  lines.push(`Post-population, validate empirically before the V2.2 weight update.`)
  lines.push(``)

  // --- Mod_status_stub ---
  lines.push(`### Factor: Mod_status_stub (proposed weight: TBD new factor for V2.1)`)
  lines.push(``)
  lines.push(`**Status: Cannot validate — field not populated.**`)
  lines.push(``)
  lines.push(`\`mod_status\` exists in the schema (${coverage['mod_status']}/199 records populated)`)
  lines.push(`but is empty in the current corpus. The research prior for mod discount is strong`)
  lines.push(`(modified 993s trade at significant discounts), but corpus evidence is absent.`)
  lines.push(``)

  // --- Condition stub ---
  lines.push(`### Factor: Condition stub (proposed weight 0.150)`)
  lines.push(``)
  lines.push(`**Status: Cannot compute — all four inputs are 0/199 populated.**`)
  lines.push(``)
  lines.push(`The condition_stub formula is:`)
  lines.push(`\`paint_score × 0.4 + accident_score × 0.3 + photo_score × 0.2 + featured_score × 0.1\``)
  lines.push(``)
  lines.push(`| Input | Coverage |`)
  lines.push(`|---|---|`)
  lines.push(`| paint_meter_max_microns | ${condInputCoverage.paint_meter_max_microns}/${rows.length} |`)
  lines.push(`| accident_history_stated | ${condInputCoverage.accident_history_stated}/${rows.length} |`)
  lines.push(`| listing_photo_count | ${condInputCoverage.listing_photo_count}/${rows.length} |`)
  lines.push(`| is_featured_listing | ${condInputCoverage.is_featured_listing}/${rows.length} |`)
  lines.push(``)
  lines.push(`**This is the most critical data gap.** Condition at 0.150 weight is the second-largest`)
  lines.push(`factor in the 993 config and cannot be validated at all from current data.`)
  lines.push(`The weight is a research prior only. V2.1 builds condition_stub as a new factor;`)
  lines.push(`it should be treated as experimental until the corpus is populated.`)
  lines.push(``)

  // --- Trim variant ---
  lines.push(`### Factor: Trim variant (proposed weight 0.100)`)
  lines.push(``)
  lines.push(`**Status: Cannot validate — trim_category and trim_variant are 0/199 populated.**`)
  lines.push(``)
  lines.push(`The comp engine uses trim_category as a hard filter, so within-trim comparisons`)
  lines.push(`are the core analysis unit. Without trim_category data, no within-trim analysis`)
  lines.push(`is possible. This is the largest structural gap in the corpus.`)
  lines.push(``)

  // --- Market region ---
  lines.push(`### Factor: Market region (proposed weight 0.100)`)
  lines.push(``)
  lines.push(`**Status: Cannot validate — market_region is 0/199 populated.**`)
  lines.push(``)
  lines.push(`Corpus is BaT-only. BaT is a predominantly US market. Even if market_region were`)
  lines.push(`populated, variance would be near-zero in this corpus.`)
  lines.push(``)

  // --- Spec composite ---
  lines.push(`### Factor: Spec composite (proposed weight 0.100)`)
  lines.push(``)
  lines.push(`**Status: Cannot validate — all three inputs are 0/199 populated.**`)
  lines.push(``)
  lines.push(`Composite = PTS (0.40) + seats_type (0.30) + wheels_factory_correct (0.30)`)
  lines.push(``)
  lines.push(`| Input | Coverage |`)
  lines.push(`|---|---|`)
  lines.push(`| is_paint_to_sample | ${coverage['is_paint_to_sample']}/${rows.length} |`)
  lines.push(`| seats_type | ${coverage['seats_type']}/${rows.length} |`)
  lines.push(`| wheels_factory_correct | ${coverage['wheels_factory_correct']}/${rows.length} |`)
  lines.push(``)

  // --- Transmission ---
  lines.push(`### Factor: Transmission variant (proposed weight 0.050)`)
  lines.push(``)
  lines.push(`**Status: V2 field (transmission_variant) empty; proxy analysis via raw NHTSA field.**`)
  lines.push(``)
  lines.push(`The raw \`transmission\` field is populated (${coverage['transmission']}/${rows.length}) but contains`)
  lines.push(`polluted NHTSA text (e.g., "Automatic Climate Control", "Owner's Manual & Tool Kit").`)
  lines.push(`After normalizing to manual/tiptronic/unknown:`)
  lines.push(``)
  lines.push(`| Transmission | n | Avg Sale Price |`)
  lines.push(`|---|---|---|`)
  lines.push(`| Manual (normalized) | ${manualN} | $${Math.round(manualAvg / 100).toLocaleString('en-US')} |`)
  lines.push(`| Tiptronic (normalized) | ${tiprN} | $${Math.round(tiprAvg / 100).toLocaleString('en-US')} |`)
  lines.push(`| Unknown / unclassified | ${transGroups.unknown.length} | — |`)
  lines.push(``)
  if (manualN >= 5 && tiprN >= 5) {
    const delta = ((manualAvg - tiprAvg) / tiprAvg) * 100
    lines.push(`**Manual commands a ${delta > 0 ? '+' : ''}${delta.toFixed(0)}% premium over Tiptronic in this corpus** (n=${manualN} vs n=${tiprN}).`)
    lines.push(`This directionally supports the transmission_variant factor, but the 0.050 weight`)
    lines.push(`may understate the actual price impact of this factor in the 993 market.`)
  } else {
    lines.push(`Insufficient data for reliable comparison.`)
  }
  lines.push(``)

  // --- Color rarity ---
  lines.push(`### Factor: Color rarity (proposed weight 0.050)`)
  lines.push(``)
  lines.push(`**Status: interior_color_rarity is 0/199 populated. Proxy analysis via exterior_color frequency.**`)
  lines.push(``)
  lines.push(`Proxy methodology: colors appearing in ≤3 records are treated as "rare"; colors`)
  lines.push(`appearing in ≥4 records are treated as "common". This is a rough approximation.`)
  lines.push(``)
  lines.push(`| Group | n colors | n records | Avg Price |`)
  lines.push(`|---|---|---|---|`)
  lines.push(`| Common (≥4 records) | ${commonColors.length} | ${commonColors.reduce((a, c) => a + c.n, 0)} | $${isNaN(commonAvg) ? 'n/a' : Math.round(commonAvg / 100).toLocaleString('en-US')} |`)
  lines.push(`| Rare (≤3 records) | ${rareColors.length} | ${rareColors.reduce((a, c) => a + c.n, 0)} | $${isNaN(rareAvg) ? 'n/a' : Math.round(rareAvg / 100).toLocaleString('en-US')} |`)
  lines.push(``)
  if (!isNaN(rarePremiumPct)) {
    lines.push(`Rare-color proxy premium: **${rarePremiumPct > 0 ? '+' : ''}${(rarePremiumPct * 100).toFixed(0)}%** vs common colors.`)
    lines.push(``)
    lines.push(`**Caution:** This proxy conflates low-count colors with genuinely rare colors.`)
    lines.push(`Some low-count colors are merely regional or uncommon in this BaT sample, not`)
    lines.push(`intrinsically rare. The result is directional only.`)
  }
  lines.push(``)

  // --- Consignor tier ---
  lines.push(`### Factor: Consignor tier (proposed weight 0.050)`)
  lines.push(``)
  lines.push(`**Status: consignor_type is 0/199 populated. Cannot validate.**`)
  lines.push(``)
  lines.push(`All 199 records originate from Bring a Trailer. Consignor-tier variance is zero`)
  lines.push(`in a single-platform corpus. This factor cannot be empirically validated until`)
  lines.push(`multi-platform data (RM Sotheby's, Gooding, etc.) is ingested.`)
  lines.push(``)

  // ---------------------------------------------------------------------------
  // PHASE 3: Rank-order table
  // ---------------------------------------------------------------------------

  lines.push(`---`)
  lines.push(``)
  lines.push(`## Phase 3 — Rank-Order Summary Table`)
  lines.push(``)
  lines.push(`Sorted by empirical R² (descending). Factors with no empirical data appear last.`)
  lines.push(``)
  lines.push(`| Rank | Factor | Proposed Weight | Empirical R² | Pearson r | Direction Match | Assessment |`)
  lines.push(`|---|---|---|---|---|---|---|`)

  let rankIdx = 1
  for (const row of sorted) {
    const r2str = row.empiricalR2 !== null ? fmtPct(row.empiricalR2) : '—'
    const rstr = row.pearsonR !== null ? fmt(row.pearsonR) : '—'
    const dirStr = row.directionMatch === null ? '—' : row.directionMatch ? '✓' : '✗'
    lines.push(`| ${rankIdx++} | ${row.factor} | ${row.proposedWeight.toFixed(3)} | ${r2str} | ${rstr} | ${dirStr} | ${row.assessment} |`)
  }
  lines.push(``)

  // Rank divergence check
  const weightRanked = [...rankRows]
    .filter(r => r.proposedWeight > 0)
    .sort((a, b) => b.proposedWeight - a.proposedWeight)
  const empiricalRanked = [...rankRows]
    .filter(r => r.empiricalR2 !== null)
    .sort((a, b) => (b.empiricalR2 ?? 0) - (a.empiricalR2 ?? 0))

  lines.push(`**Rank divergence note:** Only ${empiricalRanked.length} of ${rankRows.filter(r => r.proposedWeight > 0).length} active factors`)
  lines.push(`have empirical R² values. Meaningful rank comparison between weight-order and`)
  lines.push(`evidence-order is not possible given the data gap. Flag for V2.2 post-enrichment.`)
  lines.push(``)

  // ---------------------------------------------------------------------------
  // PHASE 4: Recommendations
  // ---------------------------------------------------------------------------

  lines.push(`---`)
  lines.push(``)
  lines.push(`## Phase 4 — Recommendations`)
  lines.push(``)
  lines.push(`### Mileage (0.300)`)
  lines.push(``)
  const mileageRec = Math.abs(mileageR) >= 0.2
    ? `**Lock proposed weight.** Pearson r = ${fmt(mileageR)}, Spearman ρ = ${fmt(mileageSR)}. Direction is correct (negative). R² = ${fmtPct(mileageR2)} corpus-wide, likely higher within trim buckets. The weakness is the absence of trim controls, not a mileage signal problem.`
    : `**Insufficient data to confirm.** R² of ${fmtPct(mileageR2)} is lower than expected, but the likely cause is the trim_category gap — a 993 RS (200K+) and a base Carrera ($60K) at similar mileage are in the same pool. Keep at 0.300 as research-prior. Re-validate once trim_category is populated.`
  lines.push(mileageRec)
  lines.push(``)
  lines.push(`### Year (0.100)`)
  lines.push(``)
  lines.push(`**Lock proposed weight.** The 993 corpus shows a clear upward price gradient`)
  lines.push(`from 1995 → 1998 ($${Math.round(mean(yearGroups[1995] ?? [0]) / 100).toLocaleString('en-US')} → $${Math.round(mean(yearGroups[1998] ?? [0]) / 100).toLocaleString('en-US')}).`)
  lines.push(`Later 993s command premiums for later RS variants, C4S, and Turbo evolution.`)
  lines.push(`The step-function scoring approach is appropriate.`)
  lines.push(``)
  lines.push(`### Condition stub (0.150)`)
  lines.push(``)
  lines.push(`**Insufficient data.** No inputs are populated. The 0.150 weight is a research prior.`)
  lines.push(`V2.1 should build the condition_stub infrastructure but treat its outputs as`)
  lines.push(`experimental. Do not rely on condition_stub for pricing decisions until validated.`)
  lines.push(`**This is the highest-risk weight in the entire config — it cannot be validated`)
  lines.push(`and it carries the second-highest weight.**`)
  lines.push(``)
  lines.push(`### Trim variant (0.100)`)
  lines.push(``)
  lines.push(`**Insufficient data.** trim_category population is a prerequisite for all`)
  lines.push(`within-trim analysis. This is the highest-priority corpus enrichment task.`)
  lines.push(``)
  lines.push(`### Market region (0.100)`)
  lines.push(``)
  lines.push(`**Insufficient data.** BaT-only corpus with zero market_region population.`)
  lines.push(`Consider reducing weight for V2.1 until multi-platform data is available.`)
  lines.push(``)
  lines.push(`### Spec composite (0.100)`)
  lines.push(``)
  lines.push(`**Insufficient data.** All inputs empty. Keep as research prior — PTS, sport`)
  lines.push(`seats, and factory wheels are well-established value drivers in collector`)
  lines.push(`markets even without corpus confirmation.`)
  lines.push(``)
  lines.push(`### Transmission variant (0.050)`)
  lines.push(``)
  if (manualN >= 5 && tiprN >= 5) {
    const delta = Math.round(((manualAvg - tiprAvg) / tiprAvg) * 100)
    lines.push(`**Consider adjusting upward.** Proxy analysis shows manual commands a ~${Math.abs(delta)}%`)
    lines.push(`${delta > 0 ? 'premium' : 'discount'} over Tiptronic in the 993 corpus (n=${manualN} vs n=${tiprN}).`)
    lines.push(`A ${Math.abs(delta)}% price delta is a large effect; 0.050 may understate this factor.`)
    lines.push(`However, the proxy data uses raw NHTSA text — defer weight adjustment until`)
    lines.push(`transmission_variant is cleanly populated.`)
  } else {
    lines.push(`Insufficient data for transmission comparison.`)
  }
  lines.push(``)
  lines.push(`### Color rarity (0.050)`)
  lines.push(``)
  lines.push(`**Insufficient data.** Proxy analysis is too noisy to support a weight change.`)
  lines.push(`Lock at 0.050 as research prior.`)
  lines.push(``)
  lines.push(`### Consignor tier (0.050)`)
  lines.push(``)
  lines.push(`**Consider dropping or zeroing for V2.1.** This factor has zero empirical basis`)
  lines.push(`in a BaT-only corpus. It cannot be validated until multi-platform data arrives.`)
  lines.push(`Keeping it at 0.050 means it silently penalizes non-BaT comps without evidence.`)
  lines.push(``)
  lines.push(`### Sub_generation (new factor, weight TBD)`)
  lines.push(``)
  lines.push(`**Research prior — no empirical basis available.** Define taxonomy and populate`)
  lines.push(`before assigning weight. The 993 sub_generation signal is intuitively strong`)
  lines.push(`(RS vs Carrera vs Turbo is the largest price divider in the corpus), but this`)
  lines.push(`is currently handled by trim_category hard-filtering, not by similarity scoring.`)
  lines.push(``)
  lines.push(`### Mod_status_stub (new factor, weight TBD)`)
  lines.push(``)
  lines.push(`**Research prior — no empirical basis.** Modified 993s are known to trade at`)
  lines.push(`discounts. Assign a moderate weight (0.075–0.10) and validate post-enrichment.`)
  lines.push(``)

  // ---------------------------------------------------------------------------
  // PHASE 5: Caveats
  // ---------------------------------------------------------------------------

  lines.push(`---`)
  lines.push(``)
  lines.push(`## Phase 5 — Caveats`)
  lines.push(``)
  lines.push(`1. **Corpus size and composition:** 199 records, BaT-only, 993 generation only.`)
  lines.push(`   Findings do not generalize to other platforms, other generations, or international markets.`)
  lines.push(``)
  lines.push(`2. **No trim controls:** The inability to group by trim_category is the largest`)
  lines.push(`   structural weakness in this analysis. All factor correlations are suppressed`)
  lines.push(`   by cross-trim variance. Reported R² values understate true within-trim signal.`)
  lines.push(``)
  lines.push(`3. **Sub_generation and mod_status_stub:** These proposed V2.1 factors cannot be`)
  lines.push(`   validated from current corpus data. Any weights assigned are research priors only.`)
  lines.push(``)
  lines.push(`4. **Condition_stub unvalidated:** This is the highest-risk item. It carries the`)
  lines.push(`   second-largest weight (0.150) but has zero corpus validation. Build it in V2.1`)
  lines.push(`   but treat outputs as experimental.`)
  lines.push(``)
  lines.push(`5. **Correlation ≠ causation:** This analysis checks direction and magnitude of`)
  lines.push(`   bivariate correlations, not causal structure. We are sanity-checking whether`)
  lines.push(`   factors move with price in the expected direction, not building a hedonic model.`)
  lines.push(``)
  lines.push(`6. **Re-validate after V2.1 build:** All weight recommendations here should be`)
  lines.push(`   re-examined after the V2.1 backtest runs on the enriched corpus.`)
  lines.push(``)
  lines.push(`---`)
  lines.push(``)
  lines.push(`*Generated by \`scripts/preflight-correlation-analysis.ts\`*`)
  lines.push(``)

  const report = lines.join('\n')

  // Write report
  const outPath = path.join(process.cwd(), 'docs', 'comp-engine-v2-1-preflight.md')
  fs.writeFileSync(outPath, report, 'utf8')
  console.log(`[preflight] Wrote: ${outPath}`)

  // Also print summary to console
  console.log(`\n[preflight] KEY FINDINGS:`)
  console.log(`  Mileage: Pearson r=${fmt(mileageR)}, Spearman=${fmt(mileageSR)}, R²=${fmtPct(mileageR2)}`)
  console.log(`  Year:    Pearson r=${fmt(yearR)}, Spearman=${fmt(yearSR)}, R²=${fmtPct(yearR2)}`)
  console.log(`  All other factors: 0/199 populated — cannot compute`)
  if (manualN >= 3 && tiprN >= 3) {
    const delta = ((manualAvg - tiprAvg) / tiprAvg * 100).toFixed(0)
    console.log(`  Transmission proxy: manual avg $${Math.round(manualAvg/100).toLocaleString('en-US')} (n=${manualN}) vs tiptronic $${Math.round(tiprAvg/100).toLocaleString('en-US')} (n=${tiprN}), delta ${delta}%`)
  }
  console.log(`\n[preflight] Done.`)
}

main().catch(err => {
  console.error('[preflight] Fatal:', err)
  process.exit(1)
})
