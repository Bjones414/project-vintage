# RM Sotheby's Scraper — Implementation Plan
**Status:** Planning  
**Last updated:** 2026-05-08  
**Method:** API-first (SearchLots endpoint) + HTML detail-page fetch

---

## Architecture Overview

RM Sotheby's exposes an internal JSON API used by their website frontend. No auth is required. The strategy:

1. **Enumerate auction codes** — maintain a static list of RM Sotheby's auction codes (e.g., `AZ26`, `NY26`) covering the last 5 years, auto-extended each season.
2. **SearchLots POST per auction** — filter server-side by `make: "Porsche"`, paginate until all lots retrieved.
3. **Detail-page fetch per lot** — the listing JSON contains `link` (relative URL). Fetch the detail page HTML for fields not in the index: mileage, chassis number, color, transmission, full description/provenance.
4. **Normalize → upsert** — map to `RawListing`, run through `normalize.ts`, upsert to `listings` via runner.

No Playwright. No slug enumeration. No headless browser.

---

## Step 0: DevTools — Blake Must Confirm

> **Blake action required before implementation.** In DevTools Network tab on any rmsothebys.com auction page, find a `SearchLots` POST request and capture:

| Field | What to capture |
|---|---|
| Full URL | e.g., `https://rmsothebys.com/api/v2/search/lots` — exact domain + path |
| Request headers | Copy all custom headers (likely just `Content-Type: application/json`) |
| Request body | Full JSON payload for a known Porsche-filtered query |

**Inferred payload shape** (verify against actual DevTools capture):

```json
{
  "make": "Porsche",
  "auction": "AZ26",
  "auctionedStatus": "Auctioned",
  "winningStatus": "Sold",
  "page": 1,
  "pageSize": 50
}
```

Fields `fromYear`, `toYear`, `category` are available filters — likely omitted when fetching full-auction history. Confirm whether `auction` accepts a single code string or an array.

Once confirmed, replace the placeholder `SEARCHLOTS_URL` constant in the implementation file.

---

## Step 1: Auction Code Registry

Maintain a typed list of RM Sotheby's auction codes in `scrapers/rm-sothebys.ts`. These are the short codes in listing URLs (e.g., `AZ26` = Arizona 2026).

```typescript
const AUCTION_CODES: string[] = [
  // 2026
  'AZ26', 'NY26', 'AM26', 'PH26', 'SC26',
  // 2025
  'AZ25', 'NY25', 'AM25', 'PH25', 'SC25',
  // 2024
  'AZ24', 'NY24', 'AM24', 'PH24', 'SC24',
  // 2023
  'AZ23', 'NY23', 'AM23', 'PH23', 'SC23',
  // 2022
  'AZ22', 'NY22', 'AM22', 'PH22', 'SC22',
];
```

These codes are embedded in listing `link` fields (e.g., `/auctions/az26/lots/r0046-.../`) and in the auction filter. Standard RM codes: `AZ` (Scottsdale/Arizona), `NY` (New York), `AM` (Amelia Island), `PH` (Porto), `SC` (Monterey/Sotheby's Concours). Blake to verify complete set and add any missing codes (Battersea, London, Munich, etc.).

---

## Step 2: SearchLots Pagination

For each auction code:

```typescript
async function fetchAuctionLots(auctionCode: string): Promise<RmLot[]> {
  const PAGE_SIZE = 50;
  const lots: RmLot[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await fetch(SEARCHLOTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        make: 'Porsche',
        auction: auctionCode,
        page,
        pageSize: PAGE_SIZE,
      }),
    });

    if (!res.ok) {
      // Log to Sentry with auctionCode + page context; continue to next auction
      throw new RmScrapeError(`SearchLots failed: ${res.status}`, { auctionCode, page });
    }

    const data: SearchLotsResponse = await res.json();
    lots.push(...data.items);
    totalPages = data.pager.totalPages;
    page++;
  } while (page <= totalPages);

  return lots;
}
```

Rate limiting: 300ms delay between paginated requests; 1s delay between auctions. RM Sotheby's is a premium partner — be conservative.

---

## Step 3: Detail Page Fetch

Fields available from SearchLots index:
- `id`, `auctionId`, `publicName`, `lot`, `referenceId`
- `value` (price string), `valueType` ("Sold" / "Not Sold" / ""), `sold`, `auctioned`
- `preSaleEstimate` (populated on some auctions), `link`, `crop`

Fields requiring detail-page fetch:
- Mileage, chassis number (VIN/partial), exterior color, interior color
- Transmission, engine description
- Full description and provenance text
- Option codes (if listed)

Detail URL construction: `https://rmsothebys.com${lot.link}`

Parse detail HTML with `node-html-parser` (already used in other scrapers if present, else add dependency). Specific selectors TBD once a detail page is inspected — likely in a structured data block (`<script type="application/ld+json">`) or a dedicated spec table. Blake to inspect one live detail page and note the HTML structure.

Fallback: if detail fetch fails (404, timeout), log to Sentry and continue with index-only data. Do not block the run for a single failed detail.

---

## Step 4: Price Parsing

The `value` field is a string like `"$240,800 USD"` (sold) or `"$225,000 - $275,000 USD"` (estimate). Parse at normalization time:

```typescript
function parseRmValue(value: string, valueType: string): {
  final_price: number | null;
  preSaleEstimateLow: number | null;
  preSaleEstimateHigh: number | null;
} {
  if (valueType === 'Sold') {
    // "$240,800 USD" → 24080000 cents
  } else {
    // "$225,000 - $275,000 USD" → low/high estimate cents
  }
}
```

All monetary values stored as cents (integers). `currency` column stores `'USD'`. Handle GBP/EUR for non-US auctions (Battersea, Porto, etc.) — derive currency from `locationFlag` or auction code suffix.

---

## Step 5: Normalization to RawListing

Map `RmLot` + detail fields → `RawListing`:

```typescript
interface RmLot {
  id: string;
  auctionId: string;
  publicName: string;    // "1987 Porsche 911 Turbo Coupe"
  lot: string;
  referenceId: string;   // "r0046"
  value: string;
  valueType: 'Sold' | 'Not Sold' | '';
  sold: boolean;
  auctioned: boolean;
  preSaleEstimate: string;
  link: string;
  crop: string;          // hero image URL
  locationFlag: string;  // country flag — derive currency
}
```

`publicName` parsing: `"1987 Porsche 911 Turbo Coupe"` → `year: 1987`, `make: 'Porsche'`, `model/trim` via the existing `parsePublicName()` utility (shared with Gooding/Mecum scrapers — extract to `scrapers/utils/parse-public-name.ts` if not already there).

`source_platform`: `'rm-sothebys'`  
`source_listing_id`: `lot.referenceId` (e.g., `"r0046"`) — stable per listing

---

## Step 6: Deduplication and Upsert

Use existing `runner.ts` deduplication on `(source_platform, source_listing_id)`. No special handling needed — RM Sotheby's lots don't re-list.

Historical backfill: run once with all 5 years of auction codes. Subsequent scheduled runs: fetch only the current + most-recent completed auction (avoid re-fetching history every run).

---

## Step 7: Migrations

No new migrations required — all fields map to existing `listings` columns. Verify these columns exist and have correct types:

- `source_platform` — `text`, constrained to approved values (migration already has `'rm-sothebys'`)
- `source_listing_id` — `text`
- `pre_sale_estimate_low_cents`, `pre_sale_estimate_high_cents` — verify these exist; if not, add migration
- `auction_house` — `text` (stores `'rm-sothebys'` — same as `source_platform`; may be redundant — confirm schema)
- `lot_number` — `text` (stores `lot.lot`, e.g., `"132"`)

If `pre_sale_estimate_low_cents` / `pre_sale_estimate_high_cents` are missing from `listings`, add:

```sql
-- migration: add RM Sotheby's pre-sale estimate columns
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS pre_sale_estimate_low_cents integer,
  ADD COLUMN IF NOT EXISTS pre_sale_estimate_high_cents integer,
  ADD COLUMN IF NOT EXISTS lot_number text;
```

Run `npx supabase db push` + verification SELECT after applying.

---

## Step 8: Shared Utility Extraction

Extract to `scrapers/utils/` if not already present:

| Utility | File | Used by |
|---|---|---|
| `parsePublicName(str)` → `{year, make, model, trim}` | `scrapers/utils/parse-public-name.ts` | RM, Gooding, Mecum |
| `parsePriceCents(str)` → `number \| null` | `scrapers/utils/parse-price.ts` | All scrapers |
| `parsePriceRange(str)` → `{low, high}` | `scrapers/utils/parse-price.ts` | RM, Gooding |
| `deriveCountryFromFlag(flagUrl)` → `'US' \| 'GB' \| ...` | `scrapers/utils/flags.ts` | RM |

---

## Step 9: Error Handling

All errors reported to Sentry with structured context:

```typescript
Sentry.captureException(err, {
  extra: {
    platform: 'rm-sothebys',
    auctionCode,
    lotReferenceId: lot?.referenceId,
    jobRunId,
  },
});
```

Error taxonomy:
- `SearchLots non-200` → log + skip auction, continue
- `Detail page 404` → log + continue with index-only data (still upsert)
- `Detail page parse failure` → log + continue (nulls on optional fields are acceptable)
- `Normalization failure` → log + skip lot (do not upsert malformed row)
- `Upsert failure` → log + skip (runner handles)

---

## Step 10: Tests

Following the same pattern as other scraper tests:

```
tests/scrapers/rm-sothebys/
  searchlots-response.fixture.json    # Real API response (sanitized)
  detail-page.fixture.html            # Real detail page HTML (sanitized)
  normalize.test.ts                   # fixture → expected RawListing row
```

Test cases:
1. Sold lot with price → `final_price_cents` populated, `status: 'sold'`
2. No-sale lot → `status: 'no_sale'`, `final_price_cents: null`
3. Lot with pre-sale estimate range → `pre_sale_estimate_low/high_cents` populated
4. Non-Porsche lot in fixture (should be absent — API filters server-side, but test the filter)
5. Detail fetch failure → normalizes to index-only, no throw

---

## Runtime Estimate

| Phase | Volume | Time |
|---|---|---|
| SearchLots API calls | ~100 calls (50 auctions × ~2 pages avg) | ~2 min |
| Detail page fetches | ~1,500 Porsche lots × 1.5s avg | ~38 min |
| Normalization + upsert | ~1,500 rows | ~2 min |
| **Total (5-year backfill)** | | **~45 min** |

Ongoing scheduled run (2 auctions): ~5 min.

Previous estimate with Playwright + slug enumeration: **8 hours**. API-first approach is **~10× faster** and eliminates browser infrastructure entirely.

---

## Implementation Order

1. Blake confirms DevTools: URL + payload shape → fill `SEARCHLOTS_URL` constant
2. Blake inspects one detail page HTML → identify selectors for mileage/VIN/color
3. Implement `fetchAuctionLots()` + pagination
4. Implement detail page fetch + HTML parser
5. Implement `normalizeRmLot()` → `RawListing`
6. Extract shared utilities to `scrapers/utils/`
7. Add migration if pre-sale estimate columns missing
8. Write fixture tests
9. Run backfill with `--dry-run` flag → inspect output
10. Enable live upsert, run full backfill, verify row count in Supabase
