#!/usr/bin/env tsx
/**
 * backfill-generation-id.ts
 *
 * Populates NULL generation_id on listings rows using the same matching logic
 * as lib/generation-match.ts (computeMatch), reusing the exported pure function.
 *
 * Input for computeMatch is assembled from each listing's decoded VIN fields
 * plus the model field used as a parsed_title proxy for title-pattern matching.
 *
 * Safety:
 *   - --dry-run flag prints proposed changes without writing
 *   - IS NULL guard in query + update means re-runs are idempotent
 *   - Rows where computeMatch returns confidence 'none' are skipped
 *   - Log written to /research/audit-2026-05-14/s-backfill/generation-id-log.json
 *
 * Usage:
 *   npx tsx scripts/backfill/backfill-generation-id.ts [--dry-run]
 */

import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { computeMatch } from '../../lib/generation-match.js'
import type { MatchInput } from '../../lib/generation-match.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../.env.local') })

const DRY_RUN = process.argv.includes('--dry-run')
const LOG_PATH = path.resolve(
  __dirname,
  '../../research/audit-2026-05-14/s-backfill/generation-id-log.json',
)

interface GenerationRow {
  generation_id: string
  model_family: string | null
  year_start: number
  year_end: number | null
}

interface LogEntry {
  id: string
  model: string
  year: number
  generation_id_before: string | null
  generation_id_after: string | null
  confidence: string
  reason: string
  candidates: string[]
  needs_review: boolean
  outcome: 'updated' | 'skipped' | 'error'
  skip_reason?: string
  error?: string
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !serviceKey || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    )
  }

  // Service role for listings (RLS bypass); anon for porsche_generations
  // (only anon/authenticated are granted SELECT on that table).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createClient(supabaseUrl, serviceKey) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reader = createClient(supabaseUrl, anonKey) as any

  console.log(`\n[generation-id backfill] ${DRY_RUN ? 'DRY RUN — no writes' : 'LIVE RUN'}\n`)

  // Fetch porsche_generations once — computeMatch is a pure function that takes the rows.
  const { data: genRows, error: genErr } = await reader
    .from('porsche_generations')
    .select('generation_id, model_family, year_start, year_end')

  if (genErr || !genRows) {
    console.error('[generation-id backfill] Failed to fetch porsche_generations:', genErr?.message)
    process.exit(1)
  }

  const generationRows = genRows as GenerationRow[]
  console.log(`[generation-id backfill] Loaded ${generationRows.length} porsche_generations rows`)

  // Fetch all listings with NULL generation_id.
  // Idempotency: only rows still NULL are returned on re-runs.
  const { data: rows, error: fetchErr } = await admin
    .from('listings')
    .select(
      'id, model, year, generation_id, decoded_year, decoded_make, decoded_model, decoded_body_class',
    )
    .is('generation_id', null)
    .order('year', { ascending: false })

  if (fetchErr) {
    console.error('[generation-id backfill] Failed to query listings:', fetchErr.message)
    process.exit(1)
  }

  const total = (rows ?? []).length
  console.log(`[generation-id backfill] ${total} rows with NULL generation_id`)
  if (total === 0) {
    console.log('[generation-id backfill] Nothing to do.')
    writeLog([])
    return
  }

  const log: LogEntry[] = []
  let updated = 0
  let skipped = 0
  let errored = 0

  for (let i = 0; i < total; i++) {
    const row = rows[i]
    const { id, model, year, decoded_year, decoded_make, decoded_model, decoded_body_class } = row

    const idx = `[${i + 1}/${total}]`

    // Build MatchInput — use model as parsed_title proxy for disambiguation
    const input: MatchInput = {
      decoded_year: decoded_year ?? null,
      decoded_make: decoded_make ?? 'PORSCHE', // default for Porsche-only corpus
      decoded_model: decoded_model ?? null,
      decoded_body_class: decoded_body_class ?? null,
      parsed_title: model ?? null,
      parsed_model_family: null, // let computeMatch derive from parsed_title
    }

    const result = computeMatch(input, generationRows)

    const entry: LogEntry = {
      id,
      model,
      year,
      generation_id_before: null,
      generation_id_after: result.generation_id,
      confidence: result.confidence,
      reason: result.reason,
      candidates: result.candidates,
      needs_review: result.needs_review,
      outcome: 'skipped',
    }

    if (result.generation_id === null || result.confidence === 'none') {
      entry.outcome = 'skipped'
      entry.skip_reason = `computeMatch returned confidence="${result.confidence}" reason="${result.reason}"`
      console.log(
        `${idx} ${id.slice(0, 8)} year=${year} model="${model}" → no match (${result.reason})`,
      )
      skipped++
      log.push(entry)
      continue
    }

    if (DRY_RUN) {
      entry.outcome = 'updated'
      console.log(
        `${idx} ${id.slice(0, 8)} year=${year} model="${model}" → "${result.generation_id}" conf=${result.confidence} (DRY RUN)`,
      )
      updated++
      log.push(entry)
      continue
    }

    const { error: updateErr } = await admin
      .from('listings')
      .update({ generation_id: result.generation_id })
      .eq('id', id)
      .is('generation_id', null) // idempotency guard

    if (updateErr) {
      entry.outcome = 'error'
      entry.error = updateErr.message
      console.log(`${idx} ${id.slice(0, 8)} DB ERROR: ${updateErr.message}`)
      errored++
    } else {
      entry.outcome = 'updated'
      console.log(
        `${idx} ${id.slice(0, 8)} year=${year} model="${model}" → "${result.generation_id}" conf=${result.confidence}`,
      )
      updated++
    }

    log.push(entry)
  }

  writeLog(log)

  console.log(`
[generation-id backfill] ${DRY_RUN ? 'DRY RUN' : 'Done'}.
  Total rows processed : ${total}
  Updated (or would)   : ${updated}
  Skipped (no match)   : ${skipped}
  Errors               : ${errored}
  Log written to       : ${LOG_PATH}
`)
}

function writeLog(log: LogEntry[]) {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true })
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), 'utf-8')
}

main().catch((err) => {
  console.error('[generation-id backfill] Fatal:', err)
  process.exit(1)
})
