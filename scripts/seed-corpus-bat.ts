#!/usr/bin/env tsx
/**
 * seed-corpus-bat.ts
 *
 * CLI script: seeds the listings corpus from BaT's public sold-archive pages.
 * Does NOT use the Next.js runtime. Uses the existing BaT parser directly.
 *
 * Usage:
 *   npx tsx scripts/seed-corpus-bat.ts --generation 993 --max 200
 *
 * Args:
 *   --generation  BaT tag slug suffix (default: "993", maps to tag "porsche-911-993")
 *   --max         Maximum listings to parse and seed (default: 200)
 *
 * Behavior:
 *   1. Checks BaT's robots.txt — aborts if paths are disallowed.
 *   2. Calls BaT's listings-filter REST API to discover sold listing URLs for the generation.
 *   3. For each discovered listing URL: checks if already in DB, skips if so.
 *   4. Parses the listing using the production BaT parser, persists to listings table.
 *   5. Runs computeComps on all seeded listings after the crawl completes.
 *   6. Prints a final summary report.
 *
 * Rate limit: 2-3s between requests (random jitter). Never parallel.
 * User-Agent: ProjectVintageBot/0.1 (Auction analytics tool; contact: hello@projectvintage.com)
 */

import * as path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { parseBaTListing } from '../lib/listing-parser/bring-a-trailer.js'
import { computeComps } from '../lib/comp-engine/index.js'

// Load .env.local from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../.env.local') })

const BAT_HOSTNAME = 'https://bringatrailer.com'
const USER_AGENT = 'ProjectVintageBot/0.1 (Auction analytics tool; contact: hello@projectvintage.com)'
const MIN_DELAY_MS = 2000
const MAX_DELAY_MS = 3000

// ─── CLI argument parsing ────────────────────────────────────────────────────

function parseArgs(): { generation: string; max: number } {
  const args = process.argv.slice(2)
  let generation = '993'
  let max = 200

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--generation' && args[i + 1]) {
      generation = args[i + 1]
      i++
    } else if (args[i] === '--max' && args[i + 1]) {
      max = parseInt(args[i + 1], 10)
      i++
    }
  }
  return { generation, max }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function jitteredDelay(): Promise<void> {
  const ms = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
  return sleep(ms)
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(30_000),
    })
    if (response.status === 429) {
      console.warn(`[scraper] 429 rate-limited on ${url}`)
      return null
    }
    if (!response.ok) {
      console.warn(`[scraper] HTTP ${response.status} on ${url}`)
      return null
    }
    return await response.text()
  } catch (err) {
    console.warn(`[scraper] fetch error on ${url}:`, err instanceof Error ? err.message : String(err))
    return null
  }
}

// ─── Robots.txt check ────────────────────────────────────────────────────────

async function checkRobotsTxt(): Promise<boolean> {
  console.log('[scraper] checking robots.txt...')
  const html = await fetchHtml(`${BAT_HOSTNAME}/robots.txt`)
  if (!html) {
    console.warn('[scraper] could not fetch robots.txt — proceeding cautiously')
    return true
  }

  const lines = html.split('\n').map(l => l.trim())
  let inOurBlock = false
  let disallowedTagPaths = false

  for (const line of lines) {
    if (line.toLowerCase().startsWith('user-agent:')) {
      const agent = line.split(':')[1]?.trim() ?? ''
      inOurBlock = agent === '*' || agent.toLowerCase().includes('bot')
    }
    if (inOurBlock && line.toLowerCase().startsWith('disallow:')) {
      const disallowed = line.split(':')[1]?.trim() ?? ''
      if (disallowed === '/tag/' || disallowed.startsWith('/tag/')) {
        disallowedTagPaths = true
        break
      }
    }
  }

  if (disallowedTagPaths) {
    console.error('[scraper] robots.txt disallows /tag/ — aborting per policy')
    return false
  }

  console.log('[scraper] robots.txt: no tag-path restrictions found, proceeding')
  return true
}

// ─── Archive discovery ────────────────────────────────────────────────────────

// Generation → search params map for BaT listings-filter API
const GENERATION_PARAMS: Record<string, { include_s: string; minimum_year: number; maximum_year: number }> = {
  '993': { include_s: 'porsche 993', minimum_year: 1993, maximum_year: 1998 },
  '964': { include_s: 'porsche 964', minimum_year: 1989, maximum_year: 1994 },
  '930': { include_s: 'porsche 930', minimum_year: 1975, maximum_year: 1989 },
  '996': { include_s: 'porsche 996', minimum_year: 1997, maximum_year: 2005 },
  '997': { include_s: 'porsche 997', minimum_year: 2004, maximum_year: 2012 },
}

interface BaTApiItem {
  url: string
  title: string
  current_bid: number
  active: boolean
}

interface BaTApiResponse {
  items: BaTApiItem[]
  items_total: number
  pages_total: number
  page_current: number
}

/**
 * Discovers sold listing URLs via BaT's listings-filter REST API.
 * Endpoint: /wp-json/bringatrailer/1.0/data/listings-filter
 * Paginates through all sold results for the given generation.
 */
async function discoverListingUrls(generation: string, max: number): Promise<string[]> {
  const params = GENERATION_PARAMS[generation]
  if (!params) {
    console.warn(`[scraper] no generation params for "${generation}" — falling back to keyword search`)
  }
  const searchTerm = params?.include_s ?? `porsche ${generation}`
  const minYear = params?.minimum_year
  const maxYear = params?.maximum_year

  const discoveredUrls: string[] = []
  let page = 1
  let totalPages = 1

  console.log(`[scraper] discovering URLs via API — search: "${searchTerm}"`)

  while (page <= totalPages && discoveredUrls.length < max) {
    const qp = new URLSearchParams({
      page: String(page),
      get_items: '1',
      state: 'sold',
      include_s: searchTerm,
    })
    if (minYear) qp.set('minimum_year', String(minYear))
    if (maxYear) qp.set('maximum_year', String(maxYear))

    const apiUrl = `${BAT_HOSTNAME}/wp-json/bringatrailer/1.0/data/listings-filter?${qp.toString()}`
    console.log(`[scraper] API page ${page}/${totalPages}: fetching`)

    const html = await fetchHtml(apiUrl)
    if (!html) {
      console.warn(`[scraper] API page ${page}: no response — stopping`)
      break
    }

    let data: BaTApiResponse
    try {
      data = JSON.parse(html) as BaTApiResponse
    } catch {
      console.warn(`[scraper] API page ${page}: JSON parse failed — stopping`)
      break
    }

    if (!Array.isArray(data.items)) {
      console.warn(`[scraper] API page ${page}: unexpected response shape — stopping`)
      break
    }

    totalPages = data.pages_total ?? page
    console.log(`[scraper] API page ${page}/${totalPages}: ${data.items.length} items (total: ${data.items_total})`)

    for (const item of data.items) {
      if (!item.url || item.active) continue
      const normalized = item.url.split('?')[0].replace(/\/$/, '')
      if (normalized.includes('/listing/') && !discoveredUrls.includes(normalized)) {
        discoveredUrls.push(normalized)
        if (discoveredUrls.length >= max) break
      }
    }

    if (page < totalPages && discoveredUrls.length < max) {
      await jitteredDelay()
    }
    page++
  }

  return discoveredUrls
}

// ─── Database helpers ─────────────────────────────────────────────────────────

function makeAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key)
}

async function isAlreadySeeded(admin: ReturnType<typeof makeAdmin>, sourceUrl: string): Promise<string | null> {
  // Returns the existing listing_id if found, null otherwise
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (admin as any)
    .from('listings')
    .select('id')
    .eq('source_url', sourceUrl)
    .maybeSingle() as { data: { id: string } | null }
  return data?.id ?? null
}

async function upsertListing(
  admin: ReturnType<typeof makeAdmin>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Record<string, unknown>,
): Promise<string | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('listings')
    .upsert(row, { onConflict: 'source_platform,source_listing_id' })
    .select('id')
    .single() as { data: { id: string } | null; error: { message: string } | null }

  if (error || !data) {
    console.error('[scraper] upsert failed:', error?.message)
    return null
  }
  return data.id
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { generation, max } = parseArgs()
  console.log(`\n[seed-corpus-bat] starting — generation: ${generation}, max: ${max}`)
  console.log(`[seed-corpus-bat] date: ${new Date().toISOString()}\n`)

  // 1. Check robots.txt
  const allowed = await checkRobotsTxt()
  if (!allowed) {
    await writeSeedBlockedDoc('robots.txt disallows /tag/ paths')
    process.exit(1)
  }
  await jitteredDelay()

  const admin = makeAdmin()

  // 2. Discover listing URLs from BaT tag archive
  const urls = await discoverListingUrls(generation, max)
  console.log(`\n[scraper] total URLs discovered: ${urls.length}`)

  if (urls.length === 0) {
    console.warn('[scraper] no URLs found — BaT may have blocked or page structure changed')
    await writeSeedBlockedDoc('no listing URLs found on tag page — possible rate-limit or structure change')
    return
  }

  // 3. Parse and seed each listing
  let seeded = 0
  let skipped = 0
  let failed = 0
  const seededIds: string[] = []
  const failures: { url: string; reason: string }[] = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    console.log(`\n[scraper] ${i + 1}/${urls.length}: ${url}`)

    // Check if already in DB
    const existingId = await isAlreadySeeded(admin, url)
    if (existingId) {
      console.log(`[scraper] skipped (already in DB): ${url}`)
      seededIds.push(existingId)
      skipped++
      continue
    }

    // Rate limit
    await jitteredDelay()

    // Parse the listing
    let listing: Awaited<ReturnType<typeof parseBaTListing>> | null = null
    try {
      listing = await parseBaTListing(url)
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      console.error(`[scraper] parse failed: ${reason}`)
      failures.push({ url, reason })
      failed++
      continue
    }

    // Build the DB row
    const row: Record<string, unknown> = {
      source_platform: listing.source_platform,
      source_url: listing.source_url,
      source_listing_id: listing.source_listing_id,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      trim: listing.trim,
      vin: listing.vin,
      mileage: listing.mileage,
      transmission: listing.transmission,
      exterior_color: listing.exterior_color,
      interior_color: listing.interior_color,
      final_price: listing.sold_price_cents,
      high_bid: listing.high_bid_cents,
      listing_status: listing.listing_status,
      reserve_met: listing.reserve_met,
      has_no_reserve: listing.has_no_reserve,
      ended_date: listing.auction_end_date,
      auction_ends_at: listing.auction_end_date,
      last_verified_at: new Date().toISOString(),
      raw_description: listing.description,
    }

    const listingId = await upsertListing(admin, row)
    if (!listingId) {
      failures.push({ url, reason: 'DB upsert failed' })
      failed++
      continue
    }

    seededIds.push(listingId)
    seeded++
    console.log(`[scraper] seeded: ${listing.title ?? url} — ${listing.listing_status} — ${listing.sold_price_cents ? `$${Math.round(listing.sold_price_cents / 100).toLocaleString()}` : 'no price'}`)
  }

  console.log(`\n[seed-corpus-bat] crawl complete: ${seeded} seeded, ${skipped} skipped, ${failed} failed`)

  // 4. Run computeComps on all seeded listings (skipped + newly seeded)
  if (seededIds.length > 0) {
    console.log(`\n[seed-corpus-bat] running computeComps on ${seededIds.length} listings...`)

    let compsSuccess = 0
    let compsFailed = 0

    for (const listingId of seededIds) {
      try {
        await computeComps(listingId)
        compsSuccess++
      } catch (err) {
        console.error(`[seed-corpus-bat] computeComps failed for ${listingId}:`, err instanceof Error ? err.message : String(err))
        compsFailed++
      }
      // Small delay between comp computations
      await sleep(200)
    }

    console.log(`[seed-corpus-bat] computeComps: ${compsSuccess} ok, ${compsFailed} failed`)
  }

  // 5. Final summary
  console.log(`
╔════════════════════════════════════════╗
║     seed-corpus-bat — Final Report    ║
╠════════════════════════════════════════╣
  Generation:  ${generation}
  Max allowed: ${max}
  URLs found:  ${urls.length}
  Seeded:      ${seeded}
  Skipped:     ${skipped}
  Failed:      ${failed}
╚════════════════════════════════════════╝
`)

  if (failures.length > 0) {
    console.log('Failures:')
    for (const f of failures) {
      console.log(`  - ${f.url}: ${f.reason}`)
    }
  }
}

async function writeSeedBlockedDoc(reason: string) {
  const { writeFile } = await import('fs/promises')
  const content = `# Seed Pull Blocked\n\n**Date:** ${new Date().toISOString()}\n**Reason:** ${reason}\n`
  await writeFile(path.resolve(__dirname, '../docs/seed-pull-blocked.md'), content)
  console.log('[scraper] wrote docs/seed-pull-blocked.md')
}

main().catch(err => {
  console.error('[seed-corpus-bat] fatal error:', err)
  process.exit(1)
})
