#!/usr/bin/env tsx
/**
 * backfill-bat-transmission.ts
 *
 * Re-parses bring-a-trailer listings whose `transmission` field is NULL,
 * then writes back the new (corrected) parser output.
 *
 * Background: the old BaT parser matched feature bullets ("Automatic Climate
 * Control", "Owner's Manual & Tool Kit", etc.) as transmission values.  The
 * fix landed in commit 98b0438.  The affected rows were subsequently cleared
 * to NULL — this script re-fetches those listings from BaT and writes the
 * corrected transmission value (or leaves NULL if the listing has no
 * transmission bullet that matches the new stricter pattern).
 *
 * Usage:
 *   npx tsx scripts/backfill-bat-transmission.ts
 *
 * Safe to re-run (idempotent — skips rows that already have a non-null value).
 */

import * as path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { parseBaTListing } from '../lib/listing-parser/bring-a-trailer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../.env.local') })

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 2–3 second jitter between requests — matches seed-corpus-bat.ts convention. */
function delayMs(): number {
  return 2000 + Math.random() * 1000
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createClient(supabaseUrl, serviceKey) as any

  // Only target bring-a-trailer listings with null transmission.
  // Idempotent: if a row already has a value (from a prior run), skip it.
  const { data: listings, error: fetchErr } = await admin
    .from('listings')
    .select('id, source_url')
    .eq('source_platform', 'bring-a-trailer')
    .is('transmission', null)
    .not('source_url', 'is', null)
    .order('id')

  if (fetchErr) {
    console.error('[backfill] Failed to query listings:', fetchErr.message)
    process.exit(1)
  }

  const total = (listings ?? []).length
  console.log(`\n[backfill] Found ${total} bring-a-trailer listings with null transmission`)
  if (total === 0) {
    console.log('[backfill] Nothing to do.')
    return
  }

  let updated = 0
  let skipped = 0  // parsed successfully but no transmission bullet found
  let errored = 0

  for (let i = 0; i < total; i++) {
    const { id, source_url } = listings[i]
    const idx = `[${i + 1}/${total}]`

    process.stdout.write(`${idx} ${id.slice(0, 8)}  ${source_url.slice(0, 70)}  `)

    let parsed: Awaited<ReturnType<typeof parseBaTListing>>
    try {
      parsed = await parseBaTListing(source_url)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`ERROR: ${msg.slice(0, 120)}`)
      errored++
      if (i < total - 1) await sleep(delayMs())
      continue
    }

    if (parsed.transmission === null || parsed.transmission === undefined) {
      console.log('null (no transmission bullet)')
      skipped++
    } else {
      const { error: updateErr } = await admin
        .from('listings')
        .update({ transmission: parsed.transmission })
        .eq('id', id)

      if (updateErr) {
        console.log(`DB ERROR: ${updateErr.message}`)
        errored++
      } else {
        console.log(`→ ${parsed.transmission}`)
        updated++
      }
    }

    if (i < total - 1) await sleep(delayMs())
  }

  console.log(`
[backfill] Done.
  Updated : ${updated}
  Null    : ${skipped}  (no transmission bullet; field stays null)
  Errors  : ${errored}
  Total   : ${total}
`)
}

main().catch((err) => {
  console.error('[backfill] Fatal:', err)
  process.exit(1)
})
