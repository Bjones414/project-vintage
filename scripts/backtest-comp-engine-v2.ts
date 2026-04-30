#!/usr/bin/env tsx
/**
 * backtest-comp-engine-v2.ts
 *
 * Offline backtest harness for Comp Engine V2. Loads all sold listings from the DB,
 * runs 10 random 80/20 train/test splits, reports MAPE, range coverage, and directional
 * bias. Also runs synthetic edge-case tests.
 *
 * Usage:
 *   npx tsx scripts/backtest-comp-engine-v2.ts [--generation 993] [--splits 10] [--seed 42]
 *
 * Args:
 *   --generation  Generation to backtest (default: '993')
 *   --splits      Number of random 80/20 splits (default: 10)
 *   --seed        RNG seed for reproducibility (default: random)
 *
 * Output:
 *   docs/comp-engine-backtest-{timestamp}.md
 *   docs/comp-engine-backtest-{timestamp}.json
 *
 * Runs in-memory after initial DB load. Target: <60s.
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { runCompEngineV2 } from '../lib/comp-engine-v2/engine'
import { loadAllConfigs } from '../lib/comp-engine-v2/config-loader'
import { MODEL_VERSION } from '../lib/comp-engine-v2/types'
import type {
  V2Subject,
  V2CompCandidate,
  EngineConfig,
  MileageBand,
} from '../lib/comp-engine-v2/types'

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
function arg(flag: string, fallback: string): string {
  const idx = process.argv.indexOf(flag)
  return idx !== -1 ? process.argv[idx + 1] : fallback
}
const GENERATION = arg('--generation', '993')
const NUM_SPLITS = parseInt(arg('--splits', '10'), 10)
const SEED_ARG = arg('--seed', String(Date.now()))
let rngSeed = parseInt(SEED_ARG, 10)

// Simple seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(rngSeed)

// ---------------------------------------------------------------------------
// DB fetch
// ---------------------------------------------------------------------------
function makeAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set')
  return createClient(url, key)
}

interface RawRow {
  id: string
  year: number
  mileage: number | null
  final_price: number | null
  auction_ends_at: string | null
  generation_id: string | null
  trim_category: string | null
  decoded_body_class: string | null
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
  paint_meter_max_microns: number | null
  accident_history_stated: string | null
  listing_photo_count: number | null
  is_featured_listing: boolean | null
  is_comp_resistant: boolean
}

function rowToSubject(row: RawRow): V2Subject {
  return {
    id: row.id,
    listing_id: row.id,
    year: row.year,
    mileage: row.mileage,
    final_price_cents: row.final_price ?? 0,
    sold_at: row.auction_ends_at ?? '',
    generation_id: row.generation_id,
    trim_category: row.trim_category,
    body_style: row.decoded_body_class,
    drivetrain: row.drivetrain,
    trim_variant: row.trim_variant,
    market_region: row.market_region,
    is_paint_to_sample: row.is_paint_to_sample,
    seats_type: row.seats_type,
    wheels_factory_correct: row.wheels_factory_correct,
    transmission_variant: row.transmission_variant,
    interior_color_rarity: row.interior_color_rarity,
    consignor_type: row.consignor_type,
    mechanical_remediation_status: row.mechanical_remediation_status,
    paint_meter_max_microns: row.paint_meter_max_microns,
    accident_history_stated: row.accident_history_stated,
    listing_photo_count: row.listing_photo_count,
    is_featured_listing: row.is_featured_listing,
    is_comp_resistant: row.is_comp_resistant ?? false,
  }
}

function rowToCandidate(row: RawRow): V2CompCandidate {
  return {
    listing_id: row.id,
    year: row.year,
    mileage: row.mileage,
    final_price_cents: row.final_price ?? 0,
    sold_at: row.auction_ends_at ?? '',
    generation_id: row.generation_id,
    trim_category: row.trim_category,
    body_style: row.decoded_body_class,
    drivetrain: row.drivetrain,
    trim_variant: row.trim_variant,
    market_region: row.market_region,
    is_paint_to_sample: row.is_paint_to_sample,
    seats_type: row.seats_type,
    wheels_factory_correct: row.wheels_factory_correct,
    transmission_variant: row.transmission_variant,
    interior_color_rarity: row.interior_color_rarity,
    consignor_type: row.consignor_type,
    mechanical_remediation_status: row.mechanical_remediation_status,
    paint_meter_max_microns: row.paint_meter_max_microns,
    accident_history_stated: row.accident_history_stated,
    listing_photo_count: row.listing_photo_count,
    is_featured_listing: row.is_featured_listing,
  }
}

async function fetchAllRows(generation: string): Promise<RawRow[]> {
  const admin = makeAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('listings')
    .select([
      'id', 'year', 'mileage', 'final_price', 'auction_ends_at', 'generation_id',
      'trim_category', 'decoded_body_class', 'drivetrain',
      'trim_variant', 'market_region', 'is_paint_to_sample', 'seats_type',
      'wheels_factory_correct', 'transmission_variant', 'interior_color_rarity',
      'consignor_type', 'mechanical_remediation_status',
      'paint_meter_max_microns', 'accident_history_stated',
      'listing_photo_count', 'is_featured_listing', 'is_comp_resistant',
    ].join(', '))
    .eq('generation_id', generation)
    .eq('listing_status', 'sold')
    .not('final_price', 'is', null)
    .not('auction_ends_at', 'is', null)
    .not('is_comp_resistant', 'is', true)
    .order('auction_ends_at', { ascending: false })
    .limit(1000) as {
      data: RawRow[] | null
      error: { message: string } | null
    }

  if (error) throw new Error(`fetchAllRows error: ${error.message}`)
  return data ?? []
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------
interface PredictionResult {
  listing_id: string
  actual: number
  predicted_median: number
  predicted_p25: number
  predicted_p75: number
  ape: number            // absolute percentage error: |actual - predicted| / actual
  in_range: boolean      // actual within [p25, p75]
  above_median: boolean  // actual > predicted_median
  comp_count: number
  verdict: string | null
  trim_category: string | null
  mileage: number | null
  year: number
}

function getMileageBand(mileage: number | null, bands: MileageBand[]): string {
  if (mileage === null) return 'unknown'
  for (const b of bands) {
    if (mileage >= b.min_miles && (b.max_miles === null || mileage < b.max_miles)) {
      return b.band_name
    }
  }
  return 'unknown'
}

function median(arr: number[]): number {
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
}

function mean(arr: number[]): number {
  return arr.reduce((s, x) => s + x, 0) / arr.length
}

// ---------------------------------------------------------------------------
// Single split run
// ---------------------------------------------------------------------------
function runSplit(
  allRows: RawRow[],
  config: EngineConfig,
  testIndices: Set<number>,
  asOf: Date,
): PredictionResult[] {
  const results: PredictionResult[] = []

  for (const idx of testIndices) {
    const testRow = allRows[idx]
    const subject = rowToSubject(testRow)

    // Build pool: all other rows (train set + remaining test), excluding the subject
    const pool: V2CompCandidate[] = allRows
      .filter((_, i) => i !== idx)
      .map(rowToCandidate)

    const result = runCompEngineV2(subject, pool, config, asOf)

    if (
      result.predicted_median === null ||
      result.predicted_p25 === null ||
      result.predicted_p75 === null
    ) {
      continue // skip non-estimate verdicts
    }

    const actual = testRow.final_price ?? 0
    const ape = actual > 0 ? Math.abs(actual - result.predicted_median) / actual : 0

    results.push({
      listing_id: testRow.id,
      actual,
      predicted_median: result.predicted_median,
      predicted_p25: result.predicted_p25,
      predicted_p75: result.predicted_p75,
      ape,
      in_range: actual >= result.predicted_p25 && actual <= result.predicted_p75,
      above_median: actual > result.predicted_median,
      comp_count: result.comp_count,
      verdict: result.verdict,
      trim_category: testRow.trim_category,
      mileage: testRow.mileage,
      year: testRow.year,
    })
  }

  return results
}

// ---------------------------------------------------------------------------
// Cohort breakdown
// ---------------------------------------------------------------------------
function cohortStats(results: PredictionResult[], key: keyof PredictionResult): Record<string, {
  n: number; mape: number; coverage: number
}> {
  const groups: Record<string, PredictionResult[]> = {}
  for (const r of results) {
    const k = String(r[key] ?? 'unknown')
    ;(groups[k] ??= []).push(r)
  }
  const out: Record<string, { n: number; mape: number; coverage: number }> = {}
  for (const [k, group] of Object.entries(groups)) {
    out[k] = {
      n: group.length,
      mape: mean(group.map(r => r.ape)) * 100,
      coverage: mean(group.map(r => r.in_range ? 1 : 0)) * 100,
    }
  }
  return out
}

function decadeBucket(year: number): string {
  return `${Math.floor(year / 10) * 10}s`
}

// ---------------------------------------------------------------------------
// Synthetic stretch tests
// ---------------------------------------------------------------------------
interface SyntheticResult {
  name: string
  verdict: string | null
  predicted_median: number | null
  note: string
}

function runSyntheticTests(allRows: RawRow[], config: EngineConfig, asOf: Date): SyntheticResult[] {
  if (allRows.length === 0) return []
  const results: SyntheticResult[] = []

  const baseRow = allRows[0]
  const baseSubject = rowToSubject(baseRow)
  const basePool = allRows.slice(1).map(rowToCandidate)

  // 1. comp_resistant flag → should always return 'uncomparable'
  const compResistantSubject: V2Subject = { ...baseSubject, is_comp_resistant: true }
  const crResult = runCompEngineV2(compResistantSubject, basePool, config, asOf)
  results.push({
    name: 'comp_resistant_flag',
    verdict: crResult.verdict,
    predicted_median: crResult.predicted_median,
    note: crResult.verdict === 'uncomparable' ? 'PASS' : 'FAIL — expected uncomparable',
  })

  // 2. empty pool → insufficient_comps
  const emptyResult = runCompEngineV2(baseSubject, [], config, asOf)
  results.push({
    name: 'empty_pool',
    verdict: emptyResult.verdict,
    predicted_median: emptyResult.predicted_median,
    note: emptyResult.verdict === 'insufficient_comps' ? 'PASS' : 'FAIL — expected insufficient_comps',
  })

  // 3. museum subject (mileage = 500) — should only get museum comps
  const museumSubject: V2Subject = { ...baseSubject, mileage: 500 }
  const museumResult = runCompEngineV2(museumSubject, basePool, config, asOf)
  results.push({
    name: 'museum_subject_mileage_500',
    verdict: museumResult.verdict,
    predicted_median: museumResult.predicted_median,
    note: `comp_count=${museumResult.comp_count} (museum cohort separation applied)`,
  })

  // 4. mileage perturbation — same listing but mileage doubled
  if (baseRow.mileage !== null) {
    const highMileSubject: V2Subject = { ...baseSubject, mileage: baseRow.mileage * 2 }
    const highMileResult = runCompEngineV2(highMileSubject, basePool, config, asOf)
    const baseline = runCompEngineV2(baseSubject, basePool, config, asOf)
    const shift = baseline.predicted_median !== null && highMileResult.predicted_median !== null
      ? `median shift: ${((highMileResult.predicted_median - baseline.predicted_median) / (baseline.predicted_median || 1) * 100).toFixed(1)}%`
      : 'no prediction'
    results.push({
      name: 'mileage_doubled_perturbation',
      verdict: highMileResult.verdict,
      predicted_median: highMileResult.predicted_median,
      note: shift,
    })
  }

  // 5. separate-market trim subject against a large pool — should restrict comps
  // Use rs_touring if it exists in any row
  const rsRow = allRows.find(r => r.trim_category === 'rs_touring')
  if (rsRow) {
    const rsSubject = rowToSubject(rsRow)
    const rsPool = allRows.filter(r => r.id !== rsRow.id).map(rowToCandidate)
    const rsResult = runCompEngineV2(rsSubject, rsPool, config, asOf)
    const nonRsInPool = rsPool.filter(c => c.trim_category !== 'rs_touring').length
    results.push({
      name: 'separate_market_rs_touring',
      verdict: rsResult.verdict,
      predicted_median: rsResult.predicted_median,
      note: `${nonRsInPool} non-RS comps in pool excluded; comp_count=${rsResult.comp_count}`,
    })
  }

  return results
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
function fmtUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`
}

function tableRow(cells: string[], widths: number[]): string {
  return '| ' + cells.map((c, i) => c.padEnd(widths[i])).join(' | ') + ' |'
}

function tableSep(widths: number[]): string {
  return '|' + widths.map(w => '-'.repeat(w + 2)).join('|') + '|'
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const startMs = Date.now()
  console.log(`\n[backtest] generation=${GENERATION} splits=${NUM_SPLITS} seed=${rngSeed}`)
  console.log('[backtest] Loading corpus from database...')

  const allRows = await fetchAllRows(GENERATION)
  console.log(`[backtest] Loaded ${allRows.length} rows.`)

  if (allRows.length < 10) {
    console.error('[backtest] Corpus too small (<10 rows). Aborting.')
    process.exit(1)
  }

  // Load configs once
  const generations = [...new Set(allRows.map(r => r.generation_id ?? 'default'))]
  const configMap = await loadAllConfigs(generations)
  const config = configMap.get(GENERATION) ?? configMap.get('default')!
  console.log('[backtest] Config loaded. Starting splits...')

  const asOf = new Date()
  const n = allRows.length
  const testSize = Math.ceil(n * 0.2) // 20% held out

  // Accumulate results across all splits
  const allPredictions: PredictionResult[] = []

  for (let split = 0; split < NUM_SPLITS; split++) {
    // Shuffle indices and pick first testSize as test set
    const indices = Array.from({ length: n }, (_, i) => i)
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    const testIndices = new Set(indices.slice(0, testSize))
    const splitResults = runSplit(allRows, config, testIndices, asOf)
    allPredictions.push(...splitResults)
    process.stdout.write(`  split ${split + 1}/${NUM_SPLITS}: ${splitResults.length} predictions\n`)
  }

  // Aggregate metrics
  const totalPredictions = allPredictions.length
  const coverageRate = mean(allPredictions.map(r => r.in_range ? 1 : 0)) * 100
  const mape = mean(allPredictions.map(r => r.ape)) * 100
  const medianApe = median(allPredictions.map(r => r.ape)) * 100
  const directionalBias = mean(allPredictions.map(r => r.above_median ? 1 : 0)) * 100
  const avgCompCount = mean(allPredictions.map(r => r.comp_count))

  // Insufficient count
  const corpusRunCount = allRows.length * NUM_SPLITS
  const insufficientCount = corpusRunCount - totalPredictions

  // Top 10 worst outliers (highest APE)
  const worst10 = [...allPredictions]
    .sort((a, b) => b.ape - a.ape)
    .slice(0, 10)

  // Per-trim breakdown
  const trimBreakdown = cohortStats(allPredictions, 'trim_category')

  // Per-mileage-band breakdown
  const bandBreakdown: Record<string, { n: number; mape: number; coverage: number }> = {}
  for (const [bname, group] of Object.entries(
    allPredictions.reduce((acc, r) => {
      const band = getMileageBand(r.mileage, config.bands)
      ;(acc[band] ??= []).push(r)
      return acc
    }, {} as Record<string, PredictionResult[]>)
  )) {
    bandBreakdown[bname] = {
      n: group.length,
      mape: mean(group.map(r => r.ape)) * 100,
      coverage: mean(group.map(r => r.in_range ? 1 : 0)) * 100,
    }
  }

  // Per-decade breakdown
  const decadeBreakdown: Record<string, { n: number; mape: number; coverage: number }> = {}
  for (const [decade, group] of Object.entries(
    allPredictions.reduce((acc, r) => {
      const d = decadeBucket(r.year)
      ;(acc[d] ??= []).push(r)
      return acc
    }, {} as Record<string, PredictionResult[]>)
  )) {
    decadeBreakdown[decade] = {
      n: group.length,
      mape: mean(group.map(r => r.ape)) * 100,
      coverage: mean(group.map(r => r.in_range ? 1 : 0)) * 100,
    }
  }

  // Synthetic tests
  console.log('[backtest] Running synthetic tests...')
  const syntheticResults = runSyntheticTests(allRows, config, asOf)

  const elapsedMs = Date.now() - startMs
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

  // ---------------------------------------------------------------------------
  // Markdown report
  // ---------------------------------------------------------------------------
  const colW = [35, 10, 10, 12, 10, 10]

  let md = `# Comp Engine V2 Backtest — ${GENERATION}\n\n`
  md += `**Date:** ${new Date().toISOString().slice(0, 10)}  \n`
  md += `**Model:** ${MODEL_VERSION}  \n`
  md += `**Generation:** ${GENERATION}  \n`
  md += `**Corpus size:** ${allRows.length} listings  \n`
  md += `**Splits:** ${NUM_SPLITS} × 80/20 random  \n`
  md += `**Seed:** ${rngSeed}  \n`
  md += `**Elapsed:** ${(elapsedMs / 1000).toFixed(1)}s  \n\n`

  md += `---\n\n## Summary Metrics\n\n`
  md += `| Metric | Value |\n|---|---|\n`
  md += `| Total predictions | ${totalPredictions} |\n`
  md += `| Insufficient / no_comps runs | ${insufficientCount} (${fmtPct(insufficientCount / corpusRunCount * 100)}) |\n`
  md += `| MAPE (mean) | ${fmtPct(mape)} |\n`
  md += `| MAPE (median) | ${fmtPct(medianApe)} |\n`
  md += `| Range coverage (P25–P75) | ${fmtPct(coverageRate)} |\n`
  md += `| Directional bias (% actual > median) | ${fmtPct(directionalBias)} |\n`
  md += `| Avg comp count | ${avgCompCount.toFixed(1)} |\n\n`

  md += `---\n\n## Top 10 Worst Outliers\n\n`
  const w10cols = [36, 14, 14, 14, 8, 8, 6]
  md += tableRow(['listing_id', 'actual', 'predicted', 'APE', 'in_range', 'trim', 'year'], w10cols) + '\n'
  md += tableSep(w10cols) + '\n'
  for (const r of worst10) {
    md += tableRow([
      r.listing_id.slice(0, 36),
      fmtUsd(r.actual),
      fmtUsd(r.predicted_median),
      fmtPct(r.ape * 100),
      r.in_range ? 'yes' : 'no',
      r.trim_category ?? 'null',
      String(r.year),
    ], w10cols) + '\n'
  }

  md += `\n---\n\n## Cohort Breakdowns\n\n`

  md += `### By trim_category\n\n`
  const tcW = [30, 8, 10, 12]
  md += tableRow(['trim_category', 'n', 'MAPE', 'coverage'], tcW) + '\n'
  md += tableSep(tcW) + '\n'
  for (const [k, v] of Object.entries(trimBreakdown).sort((a, b) => b[1].n - a[1].n)) {
    md += tableRow([k, String(v.n), fmtPct(v.mape), fmtPct(v.coverage)], tcW) + '\n'
  }

  md += `\n### By mileage band\n\n`
  const bandOrder = ['ultra_low', 'low', 'moderate', 'high', 'very_high', 'unknown']
  md += tableRow(['band', 'n', 'MAPE', 'coverage'], tcW) + '\n'
  md += tableSep(tcW) + '\n'
  for (const band of bandOrder) {
    const v = bandBreakdown[band]
    if (v) md += tableRow([band, String(v.n), fmtPct(v.mape), fmtPct(v.coverage)], tcW) + '\n'
  }

  md += `\n### By year decade\n\n`
  md += tableRow(['decade', 'n', 'MAPE', 'coverage'], tcW) + '\n'
  md += tableSep(tcW) + '\n'
  for (const [k, v] of Object.entries(decadeBreakdown).sort()) {
    md += tableRow([k, String(v.n), fmtPct(v.mape), fmtPct(v.coverage)], tcW) + '\n'
  }

  md += `\n---\n\n## Synthetic Edge-Case Tests\n\n`
  const synW = [40, 20, 16]
  md += tableRow(['test', 'verdict', 'note'], synW) + '\n'
  md += tableSep(synW) + '\n'
  for (const s of syntheticResults) {
    md += tableRow([s.name, s.verdict ?? 'null', s.note], synW) + '\n'
  }

  md += `\n---\n\n## Weights Used (${GENERATION})\n\n`
  for (const [factor, weight] of Object.entries(config.weights.weights)) {
    md += `- \`${factor}\`: ${weight}\n`
  }
  md += '\n'

  // ---------------------------------------------------------------------------
  // JSON output
  // ---------------------------------------------------------------------------
  const jsonOut = {
    meta: {
      date: new Date().toISOString(),
      model_version: MODEL_VERSION,
      generation: GENERATION,
      corpus_size: allRows.length,
      num_splits: NUM_SPLITS,
      seed: rngSeed,
      elapsed_ms: elapsedMs,
    },
    summary: {
      total_predictions: totalPredictions,
      insufficient_runs: insufficientCount,
      insufficient_pct: insufficientCount / corpusRunCount * 100,
      mape_mean: mape,
      mape_median: medianApe,
      range_coverage_pct: coverageRate,
      directional_bias_pct: directionalBias,
      avg_comp_count: avgCompCount,
    },
    cohorts: {
      trim_category: trimBreakdown,
      mileage_band: bandBreakdown,
      year_decade: decadeBreakdown,
    },
    worst_outliers: worst10,
    synthetic_tests: syntheticResults,
    weights: config.weights.weights,
  }

  // ---------------------------------------------------------------------------
  // Write files
  // ---------------------------------------------------------------------------
  mkdirSync(join(process.cwd(), 'docs'), { recursive: true })
  const mdPath = join(process.cwd(), 'docs', `comp-engine-backtest-${timestamp}.md`)
  const jsonPath = join(process.cwd(), 'docs', `comp-engine-backtest-${timestamp}.json`)

  writeFileSync(mdPath, md, 'utf-8')
  writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2), 'utf-8')

  console.log(`\n[backtest] Done in ${(elapsedMs / 1000).toFixed(1)}s`)
  console.log(`[backtest] MAPE: ${fmtPct(mape)} (mean), ${fmtPct(medianApe)} (median)`)
  console.log(`[backtest] Coverage: ${fmtPct(coverageRate)}  Bias: ${fmtPct(directionalBias)}`)
  console.log(`[backtest] Wrote: ${mdPath}`)
  console.log(`[backtest] Wrote: ${jsonPath}\n`)
}

main().catch(err => {
  console.error('[backtest] Fatal:', err)
  process.exit(1)
})
