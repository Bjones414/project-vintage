#!/usr/bin/env tsx
/**
 * backfill-trim-category.ts
 *
 * Populates NULL trim_category on listings rows where derivation is possible.
 *
 * Two derivation paths:
 *   1. Normal trim string → deriveTrimCategory(trim, generation_id)
 *   2. trim === 'null' (literal string, common for 993/964 rows) →
 *      extract pseudo-trim from the model field (e.g. "993 Carrera 4S" → "Carrera 4S")
 *      then call deriveTrimCategory(pseudoTrim, generation_id)
 *
 * Safety:
 *   - --dry-run flag prints proposed changes without writing
 *   - IS NULL guard in the query means re-runs are idempotent
 *   - Rows where derivation returns null are skipped (not fabricated)
 *   - Log written to /research/audit-2026-05-14/s-backfill/trim-category-log.json
 *
 * Usage:
 *   npx tsx scripts/backfill/backfill-trim-category.ts [--dry-run]
 */

import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { deriveTrimCategory } from '../../lib/trim-category/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../.env.local') })

const DRY_RUN = process.argv.includes('--dry-run')
const LOG_PATH = path.resolve(
  __dirname,
  '../../research/audit-2026-05-14/s-backfill/trim-category-log.json',
)

// Gen-prefixes that appear literally in the model field for older air-cooled cars.
// Stripping these yields a pseudo-trim the derive functions can match.
const GEN_PREFIXES = ['993 ', '964 ', '930 ', '911 ', '996 ', '997 ', '991 ', '992 ']

function pseudoTrimFromModel(model: string): string | null {
  if (!model) return null
  const m = model.trim()
  for (const prefix of GEN_PREFIXES) {
    if (m.startsWith(prefix)) return m.slice(prefix.length).trim()
  }
  return null
}

interface LogEntry {
  id: string
  model: string
  year: number
  generation_id: string | null
  trim_before: string | null
  trim_category_before: string | null
  trim_category_after: string | null
  derivation_path: 'normal' | 'from_model' | null
  outcome: 'updated' | 'skipped' | 'error'
  skip_reason?: string
  error?: string
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createClient(supabaseUrl, serviceKey) as any

  console.log(`\n[trim-category backfill] ${DRY_RUN ? 'DRY RUN — no writes' : 'LIVE RUN'}\n`)

  // Fetch all listings with NULL trim_category.
  // Idempotency: only rows still NULL will be returned on re-runs.
  const { data: rows, error: fetchErr } = await admin
    .from('listings')
    .select('id, model, year, generation_id, trim, trim_category')
    .is('trim_category', null)
    .order('year', { ascending: false })

  if (fetchErr) {
    console.error('[trim-category backfill] Failed to query listings:', fetchErr.message)
    process.exit(1)
  }

  const total = (rows ?? []).length
  console.log(`[trim-category backfill] ${total} rows with NULL trim_category`)
  if (total === 0) {
    console.log('[trim-category backfill] Nothing to do.')
    writeLog([])
    return
  }

  const log: LogEntry[] = []
  let updated = 0
  let skippedNullDerive = 0
  let skippedNoTrim = 0
  let errored = 0

  for (let i = 0; i < total; i++) {
    const row = rows[i]
    const { id, model, year, generation_id, trim, trim_category } = row
    const idx = `[${i + 1}/${total}]`

    const entry: LogEntry = {
      id,
      model,
      year,
      generation_id,
      trim_before: trim,
      trim_category_before: trim_category,
      trim_category_after: null,
      derivation_path: null,
      outcome: 'skipped',
    }

    // Path 1: trim is a real, non-empty string (not "null")
    if (trim && trim !== 'null') {
      const derived = deriveTrimCategory(trim, generation_id)
      if (derived === null) {
        entry.outcome = 'skipped'
        entry.skip_reason = 'deriveTrimCategory returned null (no rule matched)'
        console.log(`${idx} ${id.slice(0, 8)} [${generation_id ?? 'no-gen'}] trim="${trim}" → null (skipped)`)
        skippedNullDerive++
        log.push(entry)
        continue
      }
      entry.trim_category_after = derived
      entry.derivation_path = 'normal'
    }
    // Path 2: trim is the literal string "null" — derive from model field
    else if (trim === 'null' || trim === null) {
      if (!model) {
        entry.outcome = 'skipped'
        entry.skip_reason = 'trim is null/absent and model is empty — no derivation possible'
        console.log(`${idx} ${id.slice(0, 8)} no trim, no model (skipped)`)
        skippedNoTrim++
        log.push(entry)
        continue
      }

      // Try stripping generation prefix from model to get pseudo-trim
      const pseudo = pseudoTrimFromModel(model) ?? model
      const derived = deriveTrimCategory(pseudo, generation_id)
      if (derived === null) {
        // Last resort: try the full model string
        const derivedFull = deriveTrimCategory(model, generation_id)
        if (derivedFull === null) {
          entry.outcome = 'skipped'
          entry.skip_reason = `trim=null/literal; model="${model}" → derivation returned null`
          console.log(`${idx} ${id.slice(0, 8)} [${generation_id ?? 'no-gen'}] model="${model}" → null (skipped)`)
          skippedNullDerive++
          log.push(entry)
          continue
        }
        entry.trim_category_after = derivedFull
        entry.derivation_path = 'from_model'
      } else {
        entry.trim_category_after = derived
        entry.derivation_path = 'from_model'
      }
    } else {
      entry.outcome = 'skipped'
      entry.skip_reason = 'trim is null with no generation_id — cannot derive'
      skippedNoTrim++
      log.push(entry)
      continue
    }

    // Write the derived value (unless dry-run)
    if (DRY_RUN) {
      entry.outcome = 'updated'
      console.log(
        `${idx} ${id.slice(0, 8)} [${generation_id ?? 'no-gen'}] ${entry.derivation_path} → "${entry.trim_category_after}" (DRY RUN)`,
      )
      updated++
      log.push(entry)
      continue
    }

    const { error: updateErr } = await admin
      .from('listings')
      .update({ trim_category: entry.trim_category_after })
      .eq('id', id)
      .is('trim_category', null) // idempotency guard — only update if still null

    if (updateErr) {
      entry.outcome = 'error'
      entry.error = updateErr.message
      console.log(`${idx} ${id.slice(0, 8)} DB ERROR: ${updateErr.message}`)
      errored++
    } else {
      entry.outcome = 'updated'
      console.log(
        `${idx} ${id.slice(0, 8)} [${generation_id ?? 'no-gen'}] ${entry.derivation_path} → "${entry.trim_category_after}"`,
      )
      updated++
    }

    log.push(entry)
  }

  writeLog(log)

  console.log(`
[trim-category backfill] ${DRY_RUN ? 'DRY RUN' : 'Done'}.
  Total rows processed : ${total}
  Updated (or would)   : ${updated}
  Skipped (no derive)  : ${skippedNullDerive}
  Skipped (no trim)    : ${skippedNoTrim}
  Errors               : ${errored}
  Log written to       : ${LOG_PATH}
`)
}

function writeLog(log: LogEntry[]) {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true })
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), 'utf-8')
}

main().catch((err) => {
  console.error('[trim-category backfill] Fatal:', err)
  process.exit(1)
})
