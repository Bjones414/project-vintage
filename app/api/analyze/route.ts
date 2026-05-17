// POST /api/analyze
// Accepts a listing URL, checks the listing cache, fetches from source if needed,
// upserts to the listings table, creates a listing_analyses row, and returns { listingId }.
//
// Cache flow:
//   1. URL received → check listings table for existing row by source_url
//   2. If found + cache_status = 'permanent' → return listingId immediately (no fetch)
//   3. If found + cache_status = 'live' + last_fetched_at within 1 hour → return listingId (no fetch)
//   4. If found + stale, OR no row → fetch from source, upsert, run analysis pipeline
//
// SAFETY: This is the only place a source platform fetch is triggered by URL paste.
// No background jobs, cron, or automated refreshes exist in this system.
// Fetches occur only when a user explicitly submits a URL or their watchlist is stale.
import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { parseListing } from '@/lib/listing-parser'
import { decodeVin } from '@/lib/vin-decode/nhtsa'
import { matchGeneration } from '@/lib/generation-match'
import { runFindingsRules } from '@/lib/findings'
import { computeCompsV2 } from '@/lib/comp-engine-v2'
import { guardWrite } from '@/lib/db/never-persist'
import { extractSourceMentions, platformToPublication } from '@/lib/extractors/source-mentions'
import { getRecallsByMakeModelYear } from '@/lib/recalls/nhtsa'
import { shouldRefetch, toCacheStatus } from '@/lib/listing-cache'
import { deriveTrimCategory } from '@/lib/trim-category'
import { writeListingCapture } from '@/lib/data-capture/write'

export async function POST(request: NextRequest) {
  // Validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 })
  }
  if (typeof body !== 'object' || body === null || !('url' in body)) {
    return NextResponse.json({ error: 'Missing required field: url' }, { status: 400 })
  }
  const { url } = body as Record<string, unknown>
  if (typeof url !== 'string' || url.trim() === '') {
    return NextResponse.json({ error: 'url must be a non-empty string' }, { status: 400 })
  }

  // Check auth
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // TODO Task 6: When implementing analyze page gates, watch-list limits, and report counters,
  // bypass all gates for users with role IN ('admin', 'beta'). Member accounts get the full
  // V1 free-tier limits.

  // Service-role client: used for all DB writes and cache lookups.
  // Cache lookups are not user-scoped — they read global listing data.
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // ─── Cache check ────────────────────────────────────────────────────────────
  // Look up existing listing before fetching from source.
  // source_url is practically unique per listing and lets us skip the page fetch.
  // We check both the URL as-submitted and without trailing slash to handle either form.
  const urlTrimmed = url.trim()
  const urlAlt = urlTrimmed.endsWith('/')
    ? urlTrimmed.slice(0, -1)
    : urlTrimmed + '/'

  const { data: cachedRow } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabaseAdmin as any)
      .from('listings')
      .select('id, cache_status, last_fetched_at')
      .in('source_url', [urlTrimmed, urlAlt])
      .limit(1)
      .maybeSingle() as unknown as Promise<{
        data: { id: string; cache_status: string; last_fetched_at: string | null } | null
      }>
  )

  if (cachedRow && !shouldRefetch(cachedRow)) {
    // Serve from cache — no request made to the source platform.
    // 'permanent' listings (sold/no-sale) are never re-fetched.
    // 'live' listings are served from cache for up to 1 hour.
    //
    // Comp engine output is NOT cached — it depends on the current state of the listings table,
    // which grows over time. Caching would cause stale results when new comparable listings are
    // added. Recomputation is cheap (~100ms) and worth the freshness.
    try {
      await computeCompsV2(cachedRow.id)
    } catch (compErr) {
      console.error('[api/analyze] computeCompsV2 failed on cache hit (non-fatal)', {
        listing_id: cachedRow.id,
        error: compErr instanceof Error ? compErr.message : String(compErr),
      })
    }
    return NextResponse.json({ listingId: cachedRow.id, cached: true }, { status: 200 })
  }
  // ─── End cache check ────────────────────────────────────────────────────────

  // Cache miss or stale — fetch fresh from source platform.
  // This is a deliberate user-triggered network request to the auction site.
  const result = await parseListing(urlTrimmed)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 })
  }

  const { listing } = result

  // Require the fields the DB schema marks NOT NULL before attempting upsert
  if (!listing.make || !listing.model || listing.year === null) {
    return NextResponse.json(
      { error: 'Could not extract required fields (make, model, year) from listing' },
      { status: 422 }
    )
  }

  // VIN decode: runs after parse, before upsert. Returns null for pre-1981 chassis
  // (non-17-char VINs), malformed VINs, and NHTSA errors — analyze flow continues
  // regardless. Not moved to a background job yet; awaited in-request per spec.
  const decoded = listing.vin ? await decodeVin(listing.vin) : null

  // Generation matching + recall lookup run in parallel — both only need decoded + listing data.
  const recallMake = decoded?.make ?? listing.make
  const recallModel = decoded?.model ?? listing.model
  const recallYear = decoded?.year ?? listing.year

  const [generationResult, recalls] = await Promise.all([
    matchGeneration({
      decoded_year:        decoded?.year         ?? null,
      decoded_make:        decoded?.make         ?? null,
      decoded_model:       decoded?.model        ?? null,
      decoded_body_class:  decoded?.body_class   ?? null,
      parsed_title:        listing.title         ?? null,
      parsed_model_family: null,
    }),
    getRecallsByMakeModelYear(recallMake, recallModel, recallYear),
  ])

  if (generationResult.needs_review) {
    console.warn('[api/analyze] generation match needs review', {
      source_url: listing.source_url,
      input: {
        decoded_year:       decoded?.year         ?? null,
        decoded_make:       decoded?.make         ?? null,
        decoded_model:      decoded?.model        ?? null,
        decoded_body_class: decoded?.body_class   ?? null,
        parsed_title:       listing.title         ?? null,
      },
      result: generationResult,
    })
  }

  // Source-mention signals: extracted from listing description text at fetch time.
  // Raw text is NOT stored. Extract → set booleans → discard.
  const sourcePublication = platformToPublication(listing.source_platform)
  const mentions = listing.description
    ? extractSourceMentions(listing.description, sourcePublication, listing.source_url)
    : null

  // VIN hash: SHA-256 of last 6 chars of full VIN. Stored alongside full VIN for
  // efficient hash-based cross-listing identity matching without full-scan.
  const vinHashPartial = listing.vin
    ? createHash('sha256').update(listing.vin.slice(-6)).digest('hex')
    : null

  // Maps CanonicalListing → listings table columns.
  // Raw description is not stored — source-mention signals are extracted above and
  // the text is discarded here (facts-only architecture).
  // onConflict: keyed on the unique constraint (source_platform, source_listing_id).
  const now = new Date().toISOString()
  const row = {
    source_platform: listing.source_platform,
    source_url: listing.source_url,
    source_listing_id: listing.source_listing_id,
    source_publication: sourcePublication,
    make: listing.make,
    model: listing.model,
    year: listing.year,
    trim: listing.trim,
    vin: listing.vin ?? null,
    mileage: listing.mileage,
    transmission: listing.transmission,
    exterior_color: listing.exterior_color,
    interior_color: listing.interior_color,
    original_exterior_color: listing.original_exterior_color ?? null,
    is_repainted: listing.is_repainted ?? null,
    repaint_year: listing.repaint_year ?? null,
    repaint_disclosure: listing.repaint_disclosure ?? null,
    original_interior_color: listing.original_interior_color ?? null,
    is_reupholstered: listing.is_reupholstered ?? null,
    reupholstery_disclosure: listing.reupholstery_disclosure ?? null,
    final_price: listing.sold_price_cents,
    high_bid: listing.high_bid_cents,
    listing_status: listing.listing_status,
    reserve_met: listing.reserve_met,
    has_no_reserve: listing.has_no_reserve,
    ended_date: listing.auction_end_date,
    auction_ends_at: listing.auction_end_date,
    last_verified_at: now,
    // Cache metadata: always updated on a fresh fetch.
    // cache_status promotes to 'permanent' when listing_status is sold or no-sale.
    // A permanent listing is never fetched again (its state is final).
    last_fetched_at: now,
    cache_status: toCacheStatus(listing.listing_status),
    // VIN hash for cross-listing identity matching (not the full VIN).
    ...(vinHashPartial !== null && { vin_hash_partial: vinHashPartial }),
    // Source-mention signals (nullable booleans; null means not mentioned in text).
    ...(mentions !== null && {
      mentioned_repaint: mentions.mentioned_repaint,
      mentioned_accident_history: mentions.mentioned_accident_history,
      mentioned_engine_service: mentions.mentioned_engine_service,
      mentioned_transmission_service: mentions.mentioned_transmission_service,
      mentioned_matching_numbers: mentions.mentioned_matching_numbers,
      mentioned_modifications: mentions.mentioned_modifications,
      mentioned_recent_ppi: mentions.mentioned_recent_ppi,
      mentioned_original_owner: mentions.mentioned_original_owner,
      mentioned_repaint_source: mentions.mentioned_repaint !== null ? mentions.source_citation : null,
      mentioned_accident_history_source: mentions.mentioned_accident_history !== null ? mentions.source_citation : null,
      mentioned_engine_service_source: mentions.mentioned_engine_service !== null ? mentions.source_citation : null,
      mentioned_transmission_service_source: mentions.mentioned_transmission_service !== null ? mentions.source_citation : null,
      mentioned_matching_numbers_source: mentions.mentioned_matching_numbers !== null ? mentions.source_citation : null,
      mentioned_modifications_source: mentions.mentioned_modifications !== null ? mentions.source_citation : null,
      mentioned_recent_ppi_source: mentions.mentioned_recent_ppi !== null ? mentions.source_citation : null,
      mentioned_original_owner_source: mentions.mentioned_original_owner !== null ? mentions.source_citation : null,
    }),
    // Generation match — only written when resolved, so existing values are not
    // overwritten with null on re-analysis where generation matching fails.
    ...(generationResult.generation_id !== null && {
      generation_id: generationResult.generation_id,
    }),
    // Trim category — derived from trim string + generation_id at parse time.
    // Only written when a confident mapping is found; does not overwrite a
    // previously curated value with null.
    ...((() => {
      const cat = deriveTrimCategory(listing.trim ?? null, generationResult.generation_id)
      return cat !== null ? { trim_category: cat } : {}
    })()),
    // VIN decode fields — only written when decode succeeded.
    ...(decoded !== null && {
      decoded_year: decoded.year,
      decoded_make: decoded.make,
      decoded_model: decoded.model,
      decoded_body_class: decoded.body_class,
      decoded_engine: decoded.engine,
      decoded_plant: decoded.plant,
      decoded_transmission: decoded.transmission,
      vin_decode_raw: decoded.raw,
    }),
  }

  // Guard: throws if any NEVER_PERSIST_FIELDS appear in the payload.
  guardWrite(row as Record<string, unknown>, 'api/analyze')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upsertResult = await (supabaseAdmin
    .from('listings')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(row as any, { onConflict: 'source_platform,source_listing_id' })
    .select('id')
    .single() as unknown as Promise<{ data: { id: string } | null; error: { message: string } | null }>)
  const { data: upsertData, error: upsertError } = upsertResult

  if (upsertError || !upsertData) {
    return NextResponse.json(
      { error: `Database error: ${upsertError?.message ?? 'Failed to retrieve listing id after upsert'}` },
      { status: 500 }
    )
  }

  const listingId = upsertData.id

  const findings = runFindingsRules({
    listing,
    generationId: generationResult.generation_id,
  })

  // Record this analysis run. Non-fatal: a failure here does not block the redirect.
  const analysisResult = await (supabaseAdmin
    .from('listing_analyses')
    .insert({
      user_id: user.id,
      listing_id: listingId,
      source_url: listing.source_url,
      source_platform: listing.source_platform,
      analysis_data: {
        parsed_at: now,
        listing_status: listing.listing_status,
        recalls,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findings: findings as any,
      finding_count: findings.length,
    })
    .select('id')
    .single() as unknown as Promise<{ data: { id: string } | null; error: { message: string } | null }>)
  const { data: analysisData, error: analysisError } = analysisResult
  const analysisId = analysisData?.id ?? null

  if (analysisError) {
    console.error('[api/analyze] listing_analyses insert failed (non-fatal)', {
      listing_id: listingId,
      error: analysisError.message,
    })
  }

  // Comp engine: non-fatal. Errors are logged but do not block the redirect.
  try {
    await computeCompsV2(listingId)
  } catch (compErr) {
    console.error('[api/analyze] computeCompsV2 failed (non-fatal)', {
      listing_id: listingId,
      error: compErr instanceof Error ? compErr.message : String(compErr),
    })
  }

  // Data capture: side-effect of the analyze run. Non-fatal.
  // Kill switch (DATA_CAPTURE_ENABLED) is checked inside writeListingCapture.
  try {
    await writeListingCapture(supabaseAdmin, {
      listing,
      listingId,
      analyzeRunId: analysisId,
      generationId: generationResult.generation_id,
      generationNeedsReview: generationResult.needs_review,
    })
  } catch (captureErr) {
    console.error('[api/analyze] listing capture write failed (non-fatal)', {
      listing_id: listingId,
      error: captureErr instanceof Error ? captureErr.message : String(captureErr),
    })
  }

  return NextResponse.json({ listingId, cached: false }, { status: 200 })
}
