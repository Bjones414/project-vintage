#!/usr/bin/env tsx
/**
 * refresh-comps-993.ts
 *
 * Step 7: Assign generation_id='993' to seeded 993 listings, then
 * re-run computeComps on all 993-generation listings in the corpus.
 * Idempotent — safe to run multiple times.
 *
 * Usage: npx tsx scripts/refresh-comps-993.ts
 */

import * as path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { computeComps } from '../lib/comp-engine/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../.env.local') })

const GENERATION_ID = '993'
const YEAR_MIN = 1993
const YEAR_MAX = 1998

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createClient(url, key) as any

  console.log(`\n[refresh-comps] Assigning generation_id='${GENERATION_ID}' to un-tagged 993 listings...`)

  // Update listings where make=Porsche, year in 993 range, generation_id IS NULL
  const { data: updated, error: updateErr } = await admin
    .from('listings')
    .update({ generation_id: GENERATION_ID })
    .eq('make', 'Porsche')
    .gte('year', YEAR_MIN)
    .lte('year', YEAR_MAX)
    .is('generation_id', null)
    .select('id')

  if (updateErr) {
    console.error('[refresh-comps] Update failed:', updateErr.message)
    process.exit(1)
  }
  console.log(`[refresh-comps] Tagged ${(updated ?? []).length} listings with generation_id='${GENERATION_ID}'`)

  // Fetch all 993 listings with final_price
  const { data: listings, error: fetchErr } = await admin
    .from('listings')
    .select('id')
    .eq('generation_id', GENERATION_ID)
    .not('final_price', 'is', null)

  if (fetchErr) {
    console.error('[refresh-comps] Fetch failed:', fetchErr.message)
    process.exit(1)
  }

  const ids: string[] = (listings ?? []).map((r: { id: string }) => r.id)
  console.log(`\n[refresh-comps] Running computeComps on ${ids.length} listings...`)

  let ok = 0
  let failed = 0
  const tierCounts: Record<string, number> = {}

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    try {
      const result = await computeComps(id)
      ok++
      tierCounts[result.tier] = (tierCounts[result.tier] ?? 0) + 1
      if ((i + 1) % 20 === 0) {
        console.log(`[refresh-comps] ${i + 1}/${ids.length} done`)
      }
    } catch (err) {
      console.error(`[refresh-comps] computeComps failed for ${id}:`, err instanceof Error ? err.message : String(err))
      failed++
    }
    await sleep(100)
  }

  console.log(`
╔════════════════════════════════════════╗
║    refresh-comps-993 — Final Report   ║
╠════════════════════════════════════════╣
  Listings processed: ${ids.length}
  computeComps ok:    ${ok}
  computeComps fail:  ${failed}
  Tier distribution:  ${JSON.stringify(tierCounts)}
╚════════════════════════════════════════╝
`)
}

main().catch(err => {
  console.error('[refresh-comps] fatal:', err)
  process.exit(1)
})
