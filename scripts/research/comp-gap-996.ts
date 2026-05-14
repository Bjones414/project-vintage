#!/usr/bin/env tsx
/**
 * comp-gap-996.ts
 *
 * Audit script: Find 996.1 and 996.2 variant+year combos with <10 sold comp listings.
 * Output: /research/audit-2026-05-14/s03-996/comp-gaps.txt
 *
 * Usage: npx tsx scripts/research/comp-gap-996.ts
 */

import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../.env.local') })

const OUT_DIR = path.resolve(__dirname, '../../research/audit-2026-05-14/s03-996')
const OUT_FILE = path.join(OUT_DIR, 'comp-gaps.txt')

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')

  const admin = createClient(url, key)

  console.log('[comp-gap-996] Querying sold listings for 996.1 and 996.2...')

  // Pull all sold listings for both 996 generations
  const { data: listings, error } = await admin
    .from('listings')
    .select('generation_id, year, trim, model, final_price, id')
    .in('generation_id', ['996.1', '996.2'])
    .eq('listing_status', 'sold')
    .not('final_price', 'is', null)

  if (error) {
    console.error('[comp-gap-996] Query failed:', error.message)
    process.exit(1)
  }

  if (!listings || listings.length === 0) {
    console.log('[comp-gap-996] No sold listings found for 996.1/996.2')
    fs.writeFileSync(OUT_FILE, 'No sold listings found for 996.1/996.2 in database.\n')
    return
  }

  console.log(`[comp-gap-996] Found ${listings.length} total sold listings`)

  // Group by generation_id + year + trim
  const buckets: Record<string, { count: number; ids: string[] }> = {}

  for (const listing of listings) {
    const trim = listing.trim ?? listing.model ?? 'unknown'
    const key = `${listing.generation_id}|${listing.year ?? 'unknown'}|${trim}`
    if (!buckets[key]) buckets[key] = { count: 0, ids: [] }
    buckets[key].count++
    buckets[key].ids.push(listing.id)
  }

  // Sort by generation, then year, then trim
  const sorted = Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b))

  // Find gaps (<10 comps)
  const gaps = sorted.filter(([, v]) => v.count < 10)
  const adequate = sorted.filter(([, v]) => v.count >= 10)

  const lines: string[] = []
  lines.push('COMP GAP REPORT — 996.1 and 996.2')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push(`Total sold listings in DB: ${listings.length}`)
  lines.push(`Total variant+year buckets: ${sorted.length}`)
  lines.push(`Buckets with <10 comps: ${gaps.length}`)
  lines.push(`Buckets with ≥10 comps: ${adequate.length}`)
  lines.push('')
  lines.push('═══════════════════════════════════════════════════')
  lines.push('GAPS — VARIANT+YEAR COMBOS WITH <10 SOLD COMPS')
  lines.push('═══════════════════════════════════════════════════')

  if (gaps.length === 0) {
    lines.push('  (none — all combos have ≥10 comps)')
  } else {
    for (const [key, val] of gaps) {
      const [gen, year, trim] = key.split('|')
      lines.push(`  ${gen} | ${year} | ${trim} — ${val.count} comp${val.count === 1 ? '' : 's'}`)
    }
  }

  lines.push('')
  lines.push('═══════════════════════════════════════════════════')
  lines.push('ADEQUATE — VARIANT+YEAR COMBOS WITH ≥10 SOLD COMPS')
  lines.push('═══════════════════════════════════════════════════')

  for (const [key, val] of adequate) {
    const [gen, year, trim] = key.split('|')
    lines.push(`  ${gen} | ${year} | ${trim} — ${val.count} comps`)
  }

  // Also show generation-level summary
  const genSummary: Record<string, number> = {}
  for (const listing of listings) {
    const g = listing.generation_id ?? 'unknown'
    genSummary[g] = (genSummary[g] ?? 0) + 1
  }
  lines.push('')
  lines.push('═══════════════════════════════════════════════════')
  lines.push('GENERATION TOTALS')
  lines.push('═══════════════════════════════════════════════════')
  for (const [g, count] of Object.entries(genSummary).sort()) {
    lines.push(`  ${g}: ${count} sold listings`)
  }

  const output = lines.join('\n') + '\n'
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT_FILE, output, 'utf-8')

  console.log(`[comp-gap-996] Written to ${OUT_FILE}`)
  console.log(`[comp-gap-996] ${gaps.length} gaps found, ${adequate.length} adequate`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
