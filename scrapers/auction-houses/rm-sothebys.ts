import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/supabase/types';
import { normalizeToInsert } from '../normalize';
import { RM_AUCTIONS, auctionEndDate } from './auction-codes-rm';
import {
  extractLots,
  extractTotalPages,
  parseLotFromIndex,
  parseDetailPage,
  type SearchLotsResponse,
  type RmLot,
} from './rm-sothebys-parser';
import { randomUserAgent } from './shared/user-agents';
import { detailPageDelay, auctionCodeDelay, paginationDelay } from './shared/rate-limiter';

// Confirmed from DevTools capture. Page is 0-indexed in the query string.
const SEARCHLOTS_BASE = 'https://rmsothebys.com/api/search/SearchLots';
const PAGE_SIZE = 40;
const HARD_CAP = 2_000;

// Extends generated type with post-migration tables not yet regenerated into types.ts.
// Run `npx supabase gen types typescript --linked > lib/supabase/types.ts` after migration.
type ExtendedDB = Database & {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      scraper_errors: {
        Row: {
          id: string;
          platform: string;
          source_url: string | null;
          error: string;
          created_at: string;
        };
        Insert: { platform: string; source_url?: string | null; error: string };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
  };
};

const supabase = createClient<ExtendedDB>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

let totalUpserted = 0;

async function logError(sourceUrl: string | undefined, err: unknown): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[error] ${sourceUrl ?? 'n/a'} — ${message}`);
  await supabase.from('scraper_errors').insert({
    platform: 'rm_sothebys',
    source_url: sourceUrl ?? null,
    error: message,
  });
}

function buildSearchLotsUrl(page: number): string {
  return `${SEARCHLOTS_BASE}?page=${page}&pageSize=${PAGE_SIZE}`;
}

function buildSearchLotsBody(auctionCode: string): string {
  return JSON.stringify({
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
}

// All error paths call process.exit — this function always returns a parsed response.
async function safeFetchJson(url: string, auctionCode: string, page: number): Promise<SearchLotsResponse> {
  const referer = `https://rmsothebys.com/en/auctions/${auctionCode}/lots/`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'User-Agent': randomUserAgent(),
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Origin: 'https://rmsothebys.com',
        Referer: referer,
      },
      body: buildSearchLotsBody(auctionCode),
    });
  } catch (err) {
    await logError(url, err);
    return process.exit(0);
  }

  if (res.status === 429 || res.status === 403) {
    await logError(url, `HTTP ${res.status}`);
    return process.exit(0);
  }

  if (!res.ok) {
    await logError(url, `SearchLots HTTP ${res.status} (auction=${auctionCode} page=${page})`);
    return process.exit(0);
  }

  return res.json() as Promise<SearchLotsResponse>;
}

async function safeFetchHtml(url: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        'User-Agent': randomUserAgent(),
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Referer: 'https://rmsothebys.com/',
      },
    });
  } catch (err) {
    await logError(url, err);
    process.exit(0);
  }

  if (res.status === 429 || res.status === 403) {
    await logError(url, `HTTP ${res.status}`);
    process.exit(0);
  }

  if (!res.ok) {
    await logError(url, `HTTP ${res.status}`);
    process.exit(0);
  }

  return res.text();
}

async function processLot(
  lot: RmLot,
  auctionCode: string,
  endDate: string | null,
): Promise<void> {
  const indexData = parseLotFromIndex(lot, auctionCode, endDate);
  if (!indexData) {
    await logError(undefined, `parse failed: ${auctionCode}/${lot.referenceId ?? '?'} "${lot.publicName ?? ''}"`);
    return;
  }

  const html = await safeFetchHtml(indexData.source_url);
  let detailFields = {
    mileage: null as number | null,
    exterior_color: null as string | null,
    interior_color: null as string | null,
    transmission: null as string | null,
    vin_hash_partial: null as string | null,
  };
  try {
    detailFields = parseDetailPage(html);
  } catch (err) {
    // Parse failure is non-fatal — upsert proceeds with index-only data.
    await logError(indexData.source_url, err);
  }

  const raw = { ...indexData, ...detailFields };
  const insert = { ...normalizeToInsert(raw), data_source: 'foundation_test' };

  // Cast to any: includes post-migration columns (estimate_low/high_cents, lot_number,
  // data_source) not yet in generated types. Safe once migration has been applied.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from('listings').upsert(insert as any, {
    onConflict: 'source_platform,source_listing_id',
    ignoreDuplicates: false,
  });

  if (error) {
    await logError(indexData.source_url, error.message);
    return;
  }

  totalUpserted++;
  const label = `${raw.year} Porsche ${raw.model}${raw.trim ? ' ' + raw.trim : ''}`;
  console.log(`[ok] ${raw.source_listing_id} — ${label} (${totalUpserted}/${HARD_CAP})`);
}

async function processAuction(auctionCode: string, endDate: string | null): Promise<boolean> {
  console.log(`\n[auction] ${auctionCode}`);
  let page = 0; // 0-indexed in URL query string
  let totalPages = 1;

  do {
    const url = buildSearchLotsUrl(page);
    const response = await safeFetchJson(url, auctionCode, page);
    const lots = extractLots(response);
    totalPages = extractTotalPages(response);

    if (lots.length === 0 && page === 0) {
      console.log(`[skip] ${auctionCode} — no Porsche lots`);
      return false;
    }

    for (const lot of lots) {
      if (totalUpserted >= HARD_CAP) {
        console.log(`[cap] Hard cap of ${HARD_CAP} reached.`);
        return true;
      }

      await detailPageDelay();
      await processLot(lot, auctionCode, endDate);
    }

    if (page + 1 < totalPages) {
      await paginationDelay();
      page++;
    } else {
      break;
    }
  } while (page < totalPages);

  return false;
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  console.log(`Starting. Hard cap: ${HARD_CAP}. Auction codes: ${RM_AUCTIONS.length}.`);

  for (let i = 0; i < RM_AUCTIONS.length; i++) {
    if (totalUpserted >= HARD_CAP) break;

    const { code, endDate } = RM_AUCTIONS[i];

    if (i > 0) {
      console.log(`[delay] Waiting before ${code}...`);
      await auctionCodeDelay();
    }

    const hitCap = await processAuction(code, endDate);
    if (hitCap) break;
  }

  console.log(`\nDone. Total upserted: ${totalUpserted}.`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
