// Dry-run validation for a single auction code.
// Fetches lots from the SearchLots API and detail pages, prints parsed fields.
// Does NOT write to the database.
// Run: npx tsx scrapers/auction-houses/rm-sothebys-dry-run.ts
import { config } from 'dotenv';
config({ path: '.env.local' });

import {
  extractLots,
  extractTotalPages,
  parseLotFromIndex,
  parseDetailPage,
  type SearchLotsResponse,
  type RmLot,
  type DetailPageFields,
} from './rm-sothebys-parser';
import { auctionEndDate } from './auction-codes-rm';
import { randomUserAgent } from './shared/user-agents';
import { detailPageDelay, paginationDelay } from './shared/rate-limiter';

const TEST_AUCTION_CODE = 'az26';
const SEARCHLOTS_BASE = 'https://rmsothebys.com/api/search/SearchLots';
const PAGE_SIZE = 40;

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchJson(url: string, auctionCode: string): Promise<SearchLotsResponse> {
  const body = JSON.stringify({
    sortBy: 'Default',
    searchTerm: null,
    category: null,
    fromYear: null,
    toYear: null,
    includeWithdrawnLots: false,
    auction: auctionCode.toUpperCase(),
    auctions: null,
    offerStatus: null,
    auctionYear: null,
    model: null,
    make: 'Porsche',
    featuredOnly: false,
    stillForSaleOnly: false,
    collection: null,
    tagLine: null,
    withoutReserveOnly: false,
    day: null,
    categoryTag: [],
    tags: null,
    items: null,
    timedOnly: false,
    referenceNumber: null,
    oneHubLinkOnly: false,
    winningStatus: null,
    biddingStatus: null,
    locationCountry: [],
    auctionedStatus: null,
    auctionType: null,
    vehicleCategoryId: null,
    favoritesOnly: false,
    biddingOnly: null,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': randomUserAgent(),
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      Origin: 'https://rmsothebys.com',
      Referer: `https://rmsothebys.com/en/auctions/${auctionCode}/lots/`,
    },
    body,
  });

  if (!res.ok) throw new Error(`SearchLots HTTP ${res.status}`);
  return res.json() as Promise<SearchLotsResponse>;
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': randomUserAgent(),
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      Referer: 'https://rmsothebys.com/',
    },
  });
  if (!res.ok) throw new Error(`Detail page HTTP ${res.status}`);
  return res.text();
}

// ── Display helpers ───────────────────────────────────────────────────────────

function centsToDisplay(cents: number | null | undefined): string {
  if (cents == null) return 'null';
  return `$${(cents / 100).toLocaleString('en-US')} (${cents} cents)`;
}

function printLot(
  i: number,
  total: number,
  lotId: string,
  index: ReturnType<typeof parseLotFromIndex>,
  detail: DetailPageFields | null,
  detailError: string | null,
): void {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`LOT ${i}/${total}: ${lotId}`);
  console.log('─'.repeat(60));

  if (!index) {
    console.log('  [PARSE FAILURE] parseLotFromIndex returned null');
    return;
  }

  console.log(`  year:               ${index.year}`);
  console.log(`  make:               ${index.make}`);
  console.log(`  model:              ${index.model}`);
  console.log(`  trim:               ${index.trim ?? '(none)'}`);
  console.log(`  listing_status:     ${index.listing_status}`);
  console.log(`  final_price:        ${centsToDisplay(index.final_price_cents)}`);
  console.log(
    `  estimate:           ${centsToDisplay(index.estimate_low_cents)} – ${centsToDisplay(index.estimate_high_cents)}`,
  );
  console.log(`  currency:           ${index.currency}`);
  console.log(`  lot_number:         ${index.lot_number ?? 'null'}`);
  console.log(`  source_url:         ${index.source_url}`);

  if (detailError) {
    console.log(`\n  [DETAIL FETCH ERROR] ${detailError}`);
    return;
  }

  if (!detail) {
    console.log('\n  [DETAIL] not fetched');
    return;
  }

  console.log(`\n  mileage:            ${detail.mileage != null ? `${detail.mileage.toLocaleString()} mi` : 'null'}`);
  console.log(`  exterior_color:     ${detail.exterior_color ?? 'null'}`);
  console.log(`  interior_color:     ${detail.interior_color ?? 'null'}`);
  console.log(`  transmission:       ${detail.transmission ?? 'null'}`);
  console.log(`  engine_description: ${detail.engine_description ?? 'null'}`);
  console.log(
    `  vin_hash_partial:   ${detail.vin_hash_partial ? detail.vin_hash_partial.slice(0, 6) + '... (6 of 64 chars)' : 'null'}`,
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

interface LotResult {
  lotId: string;
  parseSuccess: boolean;
  detailSuccess: boolean;
  detailError: string | null;
}

async function run(): Promise<void> {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  DRY RUN — ${TEST_AUCTION_CODE.toUpperCase()}`);
  console.log(`${'═'.repeat(60)}`);

  const endDate = auctionEndDate(TEST_AUCTION_CODE);
  console.log(`  Auction end date:   ${endDate ?? '(unknown)'}`);
  console.log(`  No database writes.\n`);

  // ── Paginate through all API results ────────────────────────────────────
  let page = 0;
  let totalPages = 1;
  const allLots: RmLot[] = [];
  let apiTotalItems = 0;

  do {
    const url = `${SEARCHLOTS_BASE}?page=${page}&pageSize=${PAGE_SIZE}`;
    console.log(`[api] Fetching page ${page}...`);
    const response = await fetchJson(url, TEST_AUCTION_CODE);

    const lots = extractLots(response);
    totalPages = extractTotalPages(response);
    apiTotalItems = response.pager?.totalItems ?? lots.length;

    console.log(
      `[api] Page ${page}: ${lots.length} lots returned | pager: totalItems=${apiTotalItems}, totalPages=${totalPages}`,
    );

    allLots.push(...lots);

    if (page + 1 < totalPages) {
      await paginationDelay();
      page++;
    } else {
      break;
    }
  } while (page < totalPages);

  console.log(`\n[api] Total lots fetched: ${allLots.length} (API reports ${apiTotalItems} total)`);

  // ── Parse and fetch detail for each lot ─────────────────────────────────
  const results: LotResult[] = [];
  let lotCounter = 0;
  const nullFields = {
    mileage: 0,
    exterior_color: 0,
    interior_color: 0,
    transmission: 0,
    engine_description: 0,
    vin_hash_partial: 0,
  };

  for (const lot of allLots) {
    lotCounter++;
    const rawId = lot.referenceId ?? `lot-${lotCounter}`;
    const lotId = `${TEST_AUCTION_CODE}-${rawId}`;

    const indexData = parseLotFromIndex(lot, TEST_AUCTION_CODE, endDate);

    if (!indexData) {
      printLot(lotCounter, allLots.length, lotId, null, null, null);
      results.push({ lotId, parseSuccess: false, detailSuccess: false, detailError: null });
      continue;
    }

    console.log(`\n[detail] Fetching (${lotCounter}/${allLots.length}) ${indexData.source_url}`);
    await detailPageDelay();

    let detail: DetailPageFields | null = null;
    let detailError: string | null = null;

    try {
      const html = await fetchHtml(indexData.source_url);
      detail = parseDetailPage(html);
    } catch (err) {
      detailError = err instanceof Error ? err.message : String(err);
    }

    if (detail) {
      if (detail.mileage == null)           nullFields.mileage++;
      if (detail.exterior_color == null)    nullFields.exterior_color++;
      if (detail.interior_color == null)    nullFields.interior_color++;
      if (detail.transmission == null)      nullFields.transmission++;
      if (detail.engine_description == null) nullFields.engine_description++;
      if (detail.vin_hash_partial == null)  nullFields.vin_hash_partial++;
    }

    printLot(lotCounter, allLots.length, lotId, indexData, detail, detailError);

    results.push({
      lotId,
      parseSuccess: true,
      detailSuccess: detail !== null,
      detailError,
    });
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const parseSuccesses = results.filter(r => r.parseSuccess).length;
  const detailSuccesses = results.filter(r => r.detailSuccess).length;
  const detailErrors = results.filter(r => r.detailError !== null);

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  SUMMARY`);
  console.log('═'.repeat(60));
  console.log(`  Auction code:       ${TEST_AUCTION_CODE.toUpperCase()}`);
  console.log(`  API total (make=Porsche): ${apiTotalItems}`);
  console.log(`  Lots fetched:       ${allLots.length}`);
  console.log(`  Index parse OK:     ${parseSuccesses} / ${allLots.length}`);
  console.log(`  Detail fetch OK:    ${detailSuccesses} / ${parseSuccesses}`);

  if (detailErrors.length > 0) {
    console.log(`\n  Detail fetch errors (${detailErrors.length}):`);
    for (const r of detailErrors) {
      console.log(`    ${r.lotId}: ${r.detailError}`);
    }
  }

  console.log('\n  Null field counts (across all lots with successful detail fetch):');
  console.log('  (null = selector did not match — adjust findByLabel labels if many nulls)');
  console.log(`    mileage:            ${nullFields.mileage}`);
  console.log(`    exterior_color:     ${nullFields.exterior_color}`);
  console.log(`    interior_color:     ${nullFields.interior_color}`);
  console.log(`    transmission:       ${nullFields.transmission}`);
  console.log(`    engine_description: ${nullFields.engine_description}`);
  console.log(`    vin_hash_partial:   ${nullFields.vin_hash_partial}`);

  console.log(`\n${'═'.repeat(60)}\n`);
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
