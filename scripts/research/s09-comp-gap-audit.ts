#!/usr/bin/env tsx
/**
 * s09-comp-gap-audit.ts
 *
 * Session 09 — Comp Data Gap Audit
 * Identifies every variant+year combo across all Porsche sports car generations
 * (911, Boxster, Cayman) that has insufficient comparable sales data in the DB.
 *
 * Thresholds:
 *   critical:  < 5 comps
 *   sparse:    5–9 comps
 *   warning:   10–14 comps
 *   sufficient: 15+ comps
 *
 * Usage: npx tsx scripts/research/s09-comp-gap-audit.ts
 */

import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { getGenerationContent } from '../../lib/era-content/generation-content.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../.env.local') })

// ---------------------------------------------------------------------------
// Generation scope: 911, Boxster, Cayman only
// ---------------------------------------------------------------------------

interface GenerationDef {
  id: string
  label: string // human-readable generation label
  model: '911' | 'Boxster' | '718 Boxster' | 'Cayman' | '718 Cayman'
}

// Trim-category mappings for generations where the DB has trim_category populated.
// The comp engine hard-filters by trim_category when the subject's trim_category is non-null,
// so counts for 993/964 must use the fine (body+drivetrain+trim_category) key, not the coarse key.
// These map each generation-content.ts variant name to its canonical trim_category code.
const TRIM_CATEGORY_MAP: Record<string, Record<string, string>> = {
  '993': {
    'Carrera (pre-Varioram)': 'carrera_2_narrow',
    'Carrera (Varioram)':     'carrera_2_narrow',
    'Carrera 4':              'carrera_4_narrow',
    'Carrera 4S':             'carrera_4s_wide',
    'Carrera S':              'carrera_s_wide',
    'Targa':                  'targa',
    'Turbo':                  'turbo_base',
    'Turbo S':                'turbo_s',
    'GT2':                    'gt2',
    'Carrera RS':             'rs_touring',
  },
  '964': {
    'Carrera 2':                           'carrera_2_narrow',
    'Carrera 4':                           'carrera_4_narrow',
    'Turbo 3.3':                           'turbo_base',
    'Turbo 3.6':                           'turbo_base',
    'Turbo S Leichtbau':                   'turbo_s',
    'Turbo 3.6 S (Flachbau and Package)':  'turbo_s',
    'Carrera RS (Europe)':                 'rs_lightweight',
    'RS America':                          'rs_america',
    'Speedster':                           'speedster',
    '30 Jahre Anniversary':                'carrera_4_narrow',
  },
}

const GENERATIONS: GenerationDef[] = [
  // 911 generations (chronological)
  { id: '964',    label: '964',    model: '911' },
  { id: '993',    label: '993',    model: '911' },
  { id: '996.1',  label: '996.1',  model: '911' },
  { id: '996.2',  label: '996.2',  model: '911' },
  { id: '997.1',  label: '997.1',  model: '911' },
  { id: '997.2',  label: '997.2',  model: '911' },
  { id: '991.1',  label: '991.1',  model: '911' },
  { id: '991.2',  label: '991.2',  model: '911' },
  { id: '992.1',  label: '992.1',  model: '911' },
  { id: '992.2',  label: '992.2',  model: '911' },
  // Boxster generations (chronological)
  { id: '986',              label: '986',        model: 'Boxster' },
  { id: '987.1-boxster',   label: '987.1',       model: 'Boxster' },
  { id: '987.2-boxster',   label: '987.2',       model: 'Boxster' },
  { id: '981-boxster',     label: '981',         model: 'Boxster' },
  { id: '982-boxster',     label: '718',         model: '718 Boxster' },
  // Cayman generations (chronological)
  { id: '987.1-cayman',   label: '987.1',       model: 'Cayman' },
  { id: '987.2-cayman',   label: '987.2',       model: 'Cayman' },
  { id: '981-cayman',     label: '981',         model: 'Cayman' },
  { id: '982-cayman',     label: '718',         model: '718 Cayman' },
]

// ---------------------------------------------------------------------------
// Year range parsing
// ---------------------------------------------------------------------------

function parseYearRange(yearsStr: string): { start: number; end: number } | null {
  if (!yearsStr) return null
  const cleaned = yearsStr
    .replace(/MY/gi, '')
    .replace(/present/gi, '2026')
    .replace(/\(.*?\)/g, '') // strip parentheticals like "(MY2026)"
    .trim()

  // Range: "2009–2012" or "2009-2012"
  const rangeMatch = cleaned.match(/(\d{4})\s*[–\-]\s*(\d{4})/)
  if (rangeMatch) {
    return { start: parseInt(rangeMatch[1]), end: parseInt(rangeMatch[2]) }
  }

  // Single year: "2019"
  const singleMatch = cleaned.match(/(\d{4})/)
  if (singleMatch) {
    const yr = parseInt(singleMatch[1])
    return { start: yr, end: yr }
  }

  return null
}

// ---------------------------------------------------------------------------
// Body style inference from variant name
// ---------------------------------------------------------------------------

function inferBodyStyle(variantName: string, modelFamily: string): string {
  const lower = variantName.toLowerCase()
  if (lower.includes('cabriolet') || lower.includes('cab')) return 'Cabriolet'
  if (lower.includes('roadster')) return 'Roadster'
  if (lower.includes('targa')) return 'Targa'
  if (lower.includes('speedster')) return 'Speedster'
  // Boxster and 718 Boxster are roadsters
  if (modelFamily.toLowerCase().includes('boxster')) return 'Roadster'
  return 'Coupe'
}

// ---------------------------------------------------------------------------
// Normalize body style for DB comparison
// ---------------------------------------------------------------------------

function normalizeBody(raw: string | null): string {
  if (!raw) return 'unknown'
  const s = raw.toLowerCase().trim()
  if (s.includes('convertible') || s.includes('cabriolet') || s.includes('cabrio')) return 'cabriolet'
  if (s.includes('roadster')) return 'roadster'
  if (s.includes('targa')) return 'targa'
  if (s.includes('speedster')) return 'speedster'
  return 'coupe'
}

// ---------------------------------------------------------------------------
// Output line formatting
// ---------------------------------------------------------------------------

function formatOutputLine(
  year: number,
  gen: GenerationDef,
  variantName: string,
  count: number,
): string {
  const modelDisplay = gen.model === '911' ? '911' : gen.model
  return `${year} ${modelDisplay} ${variantName} [${count} comps]`
}

// ---------------------------------------------------------------------------
// Sort key for output ordering: gen chronological → year → variant name
// ---------------------------------------------------------------------------

const GEN_ORDER = GENERATIONS.map((g, i) => ({ id: g.id, idx: i }))
const genOrder = (id: string) => GEN_ORDER.find(g => g.id === id)?.idx ?? 99

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars — check .env.local')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createClient(url, key) as any

  console.log('\n[s09] Fetching sold listings for 911/Boxster/Cayman generations…')

  const genIds = GENERATIONS.map(g => g.id)

  // Single broad query: all sold listings for target generations
  const { data: rows, error } = await admin
    .from('listings')
    .select('generation_id, year, decoded_body_class, drivetrain, trim_category, trim')
    .in('generation_id', genIds)
    .eq('listing_status', 'sold')
    .not('final_price', 'is', null)
    .or('auction_outcome.is.null,auction_outcome.neq.no_sale_reserve_not_met') as {
      data: Array<{
        generation_id: string
        year: number
        decoded_body_class: string | null
        drivetrain: string | null
        trim_category: string | null
        trim: string | null
      }> | null
      error: { message: string } | null
    }

  if (error) throw new Error(`DB query failed: ${error.message}`)
  if (!rows) throw new Error('No data returned from DB')

  console.log(`[s09] Fetched ${rows.length} total sold listings across target generations`)

  // ---------------------------------------------------------------------------
  // Build a count map: key = "generationId|year|body_norm|drivetrain_norm|trim_cat"
  // We also build a simpler key: "generationId|year|body_norm" for gen-level counts
  // ---------------------------------------------------------------------------

  type CountKey = string
  const countMap = new Map<CountKey, number>()
  // Also track "coarse" counts by (gen, year, body, drivetrain) for non-trim-cat gens
  const coarseMap = new Map<CountKey, number>()
  // And raw data for the full-counts CSV
  type RowAgg = { generation_id: string; year: number; body: string; drivetrain: string; trim_category: string; count: number }
  const aggMap = new Map<string, RowAgg>()

  for (const row of rows) {
    const body = normalizeBody(row.decoded_body_class)
    const drv = (row.drivetrain ?? 'unknown').toLowerCase()
    const tc = row.trim_category ?? 'null'

    // Fine key (with trim_category)
    const fineKey = `${row.generation_id}|${row.year}|${body}|${drv}|${tc}`
    countMap.set(fineKey, (countMap.get(fineKey) ?? 0) + 1)

    // Coarse key (without trim_category) — used for gens where tc is null
    const coarseKey = `${row.generation_id}|${row.year}|${body}|${drv}`
    coarseMap.set(coarseKey, (coarseMap.get(coarseKey) ?? 0) + 1)

    // Aggregation for CSV
    const aggKey = `${row.generation_id}|${row.year}|${body}|${drv}|${tc}`
    if (!aggMap.has(aggKey)) {
      aggMap.set(aggKey, { generation_id: row.generation_id, year: row.year, body, drivetrain: drv, trim_category: tc, count: 0 })
    }
    aggMap.get(aggKey)!.count++
  }

  // ---------------------------------------------------------------------------
  // For each generation+variant, compute comp count
  // ---------------------------------------------------------------------------

  interface VariantEntry {
    genId: string
    genLabel: string
    model: string
    variantName: string
    year: number
    bodyStyle: string
    drivetrain: string
    compCount: number
    displayLine: string
  }

  const allEntries: VariantEntry[] = []

  for (const gen of GENERATIONS) {
    const content = getGenerationContent(gen.id)
    if (!content) {
      console.log(`[s09] No generation-content for ${gen.id} — skipping`)
      continue
    }

    if (!content.variants?.length) {
      console.log(`[s09] No variants defined for ${gen.id} — skipping`)
      continue
    }

    for (const variant of content.variants) {
      const yearRange = parseYearRange(variant.years)
      if (!yearRange) {
        console.warn(`[s09] Could not parse year range "${variant.years}" for ${gen.id} / ${variant.name}`)
        continue
      }

      const body = inferBodyStyle(variant.name, gen.model)
      const bodyNorm = normalizeBody(body)
      const drv = (variant.drivetrain ?? 'unknown').toLowerCase()
        .replace('awd', 'awd').replace('rwd', 'rwd').replace('all-wheel drive', 'awd').replace('rear-wheel drive', 'rwd')

      for (let year = yearRange.start; year <= yearRange.end; year++) {
        // For generations with trim_category populated (993/964), use the fine key so
        // counts match what the comp engine actually returns for a non-null trim_category subject.
        // For all other generations, use the coarse key (all listings of same body+drivetrain).
        const tcMap = TRIM_CATEGORY_MAP[gen.id]
        const trimCat = tcMap ? (tcMap[variant.name] ?? null) : null
        let compCount: number
        if (trimCat !== null) {
          const fineKey = `${gen.id}|${year}|${bodyNorm}|${drv}|${trimCat}`
          compCount = countMap.get(fineKey) ?? 0
        } else {
          const coarseKey = `${gen.id}|${year}|${bodyNorm}|${drv}`
          compCount = coarseMap.get(coarseKey) ?? 0
        }

        const genLabel = gen.label
        const modelDisplay = gen.model

        const displayLine = `${year} ${modelDisplay} ${variant.name}` +
          (body !== 'Coupe' ? '' : '') // body style is implied in the variant name or is default Coupe

        allEntries.push({
          genId: gen.id,
          genLabel,
          model: modelDisplay,
          variantName: variant.name,
          year,
          bodyStyle: body,
          drivetrain: drv,
          compCount,
          displayLine,
        })
      }
    }
  }

  console.log(`[s09] Evaluated ${allEntries.length} total variant+year combinations`)

  // ---------------------------------------------------------------------------
  // Sort entries: gen order → year → variant name
  // ---------------------------------------------------------------------------

  allEntries.sort((a, b) => {
    const go = genOrder(a.genId) - genOrder(b.genId)
    if (go !== 0) return go
    if (a.year !== b.year) return a.year - b.year
    return a.variantName.localeCompare(b.variantName)
  })

  // ---------------------------------------------------------------------------
  // Classify
  // ---------------------------------------------------------------------------

  const critical  = allEntries.filter(e => e.compCount < 5)
  const sparse    = allEntries.filter(e => e.compCount >= 5 && e.compCount < 10)
  const warning   = allEntries.filter(e => e.compCount >= 10 && e.compCount < 15)
  const sufficient = allEntries.filter(e => e.compCount >= 15)

  // ---------------------------------------------------------------------------
  // Output helpers
  // ---------------------------------------------------------------------------

  const OUT_DIR = path.resolve(__dirname, '../../research/audit-2026-05-14/s09-comp-gaps')

  function writeList(filename: string, entries: VariantEntry[]) {
    const lines = entries.map(e => {
      const bodyTag = (e.bodyStyle !== 'Coupe') ? ` ${e.bodyStyle}` : ''
      const drvTag = e.drivetrain !== 'unknown' ? ` (${e.drivetrain.toUpperCase()})` : ''
      return `${e.year} ${e.model} ${e.variantName}${bodyTag}${drvTag}`
    })
    fs.writeFileSync(path.join(OUT_DIR, filename), lines.join('\n') + '\n', 'utf-8')
    console.log(`[s09] Wrote ${filename} (${entries.length} entries)`)
  }

  writeList('critical.txt', critical)
  writeList('sparse.txt', sparse)
  writeList('warning.txt', warning)

  // ---------------------------------------------------------------------------
  // full-counts.csv
  // ---------------------------------------------------------------------------

  const csvLines = [
    'generation_id,generation_label,model,variant_name,year,body_style,drivetrain,comp_count,tier',
    ...allEntries.map(e => {
      const tier =
        e.compCount < 5  ? 'critical' :
        e.compCount < 10 ? 'sparse'   :
        e.compCount < 15 ? 'warning'  : 'sufficient'
      return [
        e.genId, e.genLabel, e.model, `"${e.variantName}"`,
        e.year, e.bodyStyle, e.drivetrain, e.compCount, tier,
      ].join(',')
    }),
  ]
  fs.writeFileSync(path.join(OUT_DIR, 'full-counts.csv'), csvLines.join('\n') + '\n', 'utf-8')
  console.log(`[s09] Wrote full-counts.csv (${allEntries.length} rows)`)

  // ---------------------------------------------------------------------------
  // Generation breakdown for REPORT.md
  // ---------------------------------------------------------------------------

  interface GenStats {
    id: string
    label: string
    model: string
    total: number
    sufficient: number
    warning: number
    sparse: number
    critical: number
    uniqueVariants: Set<string>
  }

  const genStats = new Map<string, GenStats>()
  for (const gen of GENERATIONS) {
    genStats.set(gen.id, {
      id: gen.id, label: gen.label, model: gen.model,
      total: 0, sufficient: 0, warning: 0, sparse: 0, critical: 0,
      uniqueVariants: new Set(),
    })
  }

  for (const e of allEntries) {
    const gs = genStats.get(e.genId)
    if (!gs) continue
    gs.total++
    gs.uniqueVariants.add(e.variantName)
    if (e.compCount >= 15) gs.sufficient++
    else if (e.compCount >= 10) gs.warning++
    else if (e.compCount >= 5) gs.sparse++
    else gs.critical++
  }

  // ---------------------------------------------------------------------------
  // Top 20 highest-priority variants to backfill
  // Heuristic: smallest comp count + earlier generation (more market activity)
  // Priority: critical first, then sparse, sort by genOrder (ascending = older/more valuable)
  // ---------------------------------------------------------------------------

  const top20 = [...critical, ...sparse]
    .sort((a, b) => {
      if (a.compCount !== b.compCount) return a.compCount - b.compCount
      return genOrder(a.genId) - genOrder(b.genId)
    })
    .slice(0, 20)

  // ---------------------------------------------------------------------------
  // REPORT.md
  // ---------------------------------------------------------------------------

  const totalVariants = allEntries.length
  const totalSufficient = sufficient.length
  const totalWarning = warning.length
  const totalSparse = sparse.length
  const totalCritical = critical.length

  const genRows = GENERATIONS
    .map(gen => genStats.get(gen.id))
    .filter((gs): gs is GenStats => !!gs && gs.total > 0)
    .map(gs => {
      return `| ${gs.model} ${gs.label} | ${gs.total} | ${gs.sufficient} | ${gs.warning} | ${gs.sparse} | ${gs.critical} |`
    })

  const top20Lines = top20.map((e, i) => {
    const bodyTag = (e.bodyStyle !== 'Coupe') ? ` ${e.bodyStyle}` : ''
    const drvTag = e.drivetrain !== 'unknown' ? ` (${e.drivetrain.toUpperCase()})` : ''
    return `${i + 1}. ${e.year} ${e.model} ${e.variantName}${bodyTag}${drvTag} — **${e.compCount} comps** (${e.genId})`
  })

  const top5Critical = [...critical]
    .sort((a, b) => {
      if (a.compCount !== b.compCount) return a.compCount - b.compCount
      return genOrder(a.genId) - genOrder(b.genId)
    })
    .slice(0, 5)
    .map(e => {
      const bodyTag = (e.bodyStyle !== 'Coupe') ? ` ${e.bodyStyle}` : ''
      return `- ${e.year} ${e.model} ${e.variantName}${bodyTag}: **${e.compCount} comps**`
    })

  const report = `# Comp Data Gap Audit — Session 09
**Date:** 2026-05-14
**Scope:** All Porsche sports car generations (911, Boxster, Cayman) in generation-content.ts
**DB table queried:** \`listings\` (listing_status='sold', final_price IS NOT NULL, auction_outcome != 'no_sale_reserve_not_met')
**Matching method:** generation_id + year + decoded_body_class (normalized) + drivetrain; plus trim_category for 993 and 964

> **Note on variant matching:** Comp counts reflect the actual comp pool available to the engine.
> For **993 and 964** (trim_category populated in DB), counts use per-trim_category matching —
> matching the comp engine's hard-filter behaviour when the subject has a non-null trim_category.
> For **all other generations** (trim_category NULL in DB), the engine pools ALL sold listings of
> the same generation+body_style+drivetrain together, regardless of specific trim (Carrera vs GT3
> etc.). A "997.1 Carrera Coupe RWD" and "997.1 GT3 Coupe RWD" share the same comp count, which
> is the correct representation of current engine behavior for those generations.

---

## Summary Totals

| Metric | Count |
|---|---|
| Total variant+year combinations audited | ${totalVariants} |
| Sufficient (15+ comps) | ${totalSufficient} |
| Warning (10–14 comps) | ${totalWarning} |
| Sparse (5–9 comps) | ${totalSparse} |
| Critical (<5 comps) | ${totalCritical} |

---

## Breakdown by Generation

| Generation | Total V+Y | Sufficient | Warning | Sparse | Critical |
|---|---|---|---|---|---|
${genRows.join('\n')}

---

## Top 20 Highest-Priority Variants to Backfill

Sorted by lowest comp count, then by generation (older/higher-value generations first).

${top20Lines.join('\n')}

---

## Top 5 Most Critical

${top5Critical.join('\n')}

---

## Output Files

| File | Description |
|---|---|
| \`critical.txt\` | ${totalCritical} variant+year combos with <5 comps |
| \`sparse.txt\` | ${totalSparse} variant+year combos with 5–9 comps |
| \`warning.txt\` | ${totalWarning} variant+year combos with 10–14 comps |
| \`full-counts.csv\` | All ${totalVariants} combinations with exact counts and tier classification |
| \`REPORT.md\` | This file |

---

*Generated by scripts/research/s09-comp-gap-audit.ts on 2026-05-14*
`

  fs.writeFileSync(path.join(OUT_DIR, 'REPORT.md'), report, 'utf-8')
  console.log('[s09] Wrote REPORT.md')

  // ---------------------------------------------------------------------------
  // Console summary
  // ---------------------------------------------------------------------------

  console.log('\n' + '═'.repeat(60))
  console.log('COMP GAP AUDIT — SUMMARY')
  console.log('═'.repeat(60))
  console.log(`Total variant+year combos audited:  ${totalVariants}`)
  console.log(`  Sufficient (15+):  ${totalSufficient}`)
  console.log(`  Warning  (10–14):  ${totalWarning}`)
  console.log(`  Sparse   (5–9):    ${totalSparse}`)
  console.log(`  Critical (<5):     ${totalCritical}`)
  console.log('\nTop 5 most critical:')
  top5Critical.forEach(l => console.log('  ' + l))
  console.log('\nOutput files:')
  console.log(`  ${OUT_DIR}/critical.txt`)
  console.log(`  ${OUT_DIR}/sparse.txt`)
  console.log(`  ${OUT_DIR}/warning.txt`)
  console.log(`  ${OUT_DIR}/full-counts.csv`)
  console.log(`  ${OUT_DIR}/REPORT.md`)
  console.log('═'.repeat(60))
}

main().catch(err => {
  console.error('[s09] Fatal error:', err)
  process.exit(1)
})
