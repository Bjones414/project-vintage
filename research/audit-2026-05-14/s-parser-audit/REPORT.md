# Parser Audit — 2026-05-14

**Scope:** Read-only diagnostic audit of all listing-source parsers.  
**Auditor:** Claude Code (automated read, no code changes)  
**Context:** S-INGESTION (BaT fix) is in flight. This audit informs what ships next, not what is being fixed now.  
**Reference baseline:** `lib/listing-parser/bring-a-trailer.ts`

---

## Canonical Directory Structure

Two parallel systems exist. The audit addresses the paste-and-go system:

| Path | Purpose |
|---|---|
| `lib/listing-parser/` | **Paste-and-go parsers** — called by analyze route on user URL paste |
| `lib/listing-parser/index.ts` | Router — dispatches a URL to the correct parser |
| `playwright-worker/src/parsers/` | Playwright-rendered parsers for SPA sites (currently: Cars & Bids only) |
| `scrapers/auction-houses/` | Batch scraper parsers — different type system (`RawListing` not `CanonicalListing`); NOT on the paste-and-go path |

**Critical:** `lib/listing-parser/index.ts` is the gating layer. A parser that is not wired into `index.ts` is effectively dead for end users, regardless of how complete its implementation is.

---

## Canonical Schema (BaT Reference Fields)

Fields defined in `lib/listing-parser/types.ts`:

```
source_platform, source_url, source_listing_id
title, year, make, model, trim
vin, mileage, engine, transmission
exterior_color, interior_color
original_exterior_color, is_repainted, repaint_year, repaint_disclosure  ← BaT-only extras
original_interior_color, is_reupholstered, reupholstery_disclosure       ← BaT-only extras
sold_price_cents, high_bid_cents, asking_price_cents
listing_status, bid_count, reserve_met, has_no_reserve
auction_end_date, seller_info, description, modification_notes
image_urls, raw_data
```

---

## Parser-by-Parser Findings

---

### 1. Bring a Trailer (BaT)

| Attribute | Value |
|---|---|
| **File** | `lib/listing-parser/bring-a-trailer.ts` (822 lines) |
| **State** | **WORKING** |
| **Wired in index.ts** | YES (`bringatrailer.com`) |
| **Tests** | YES — 5 test files (`auction-end-time`, `bid`, `model-trim`, `reserve`, `transmission`) |
| **TOS posture** | Permissive robots.txt; listing data publicly accessible; no login required |

**Fields extracted vs schema:**

| Field | Status | Notes |
|---|---|---|
| title, year, make, model, trim | ✅ | Via JSON-LD `Product` schema + title parse |
| vin | ✅ | 4-tier extraction (list/table → dt/dd → sibling → raw HTML scan) |
| mileage | ✅ | From `Listing Details` `<ul>` |
| transmission | ✅ | Normalized to canonical form (`6-Speed Manual`, `7-Speed PDK`, etc.) |
| exterior_color, interior_color | ✅ | Structured `<ul>` → description prose → visible text cascade |
| is_repainted, original_exterior_color, repaint_year, repaint_disclosure | ✅ | BaT-specific — no other parser extracts these |
| is_reupholstered, original_interior_color, reupholstery_disclosure | ✅ | BaT-specific |
| sold_price_cents | ✅ | JSON-LD `offers.price` |
| high_bid_cents | ✅ | "Current Bid $X" / "Bid to $X" text extraction |
| listing_status | ✅ | "Sold for" / "Bid to" / "Current Bid" regex detection |
| reserve_met, has_no_reserve | ✅ | Text detection |
| auction_end_date | ✅ | 3-tier: `data-timestamp` DOM → stats row → `end_timestamp` JS var |
| bid_count | ❌ | Not extracted (not in BaT HTML in structured form) |
| engine | ❌ | Not extracted (BaT does not expose engine as a labeled field) |
| image_urls | ✅ | JSON-LD `image` array |
| description | ✅ | JSON-LD `description` |
| asking_price_cents | ❌ | N/A (auction platform) |

**Assessment:** Ship as-is. This is the production baseline. S-INGESTION addresses in-flight issues; do not touch during that sprint.

---

### 2. Gooding & Company

| Attribute | Value |
|---|---|
| **File** | `lib/listing-parser/gooding.ts` (347 lines) |
| **State** | **WORKING** |
| **Wired in index.ts** | YES (`goodingco.com`) |
| **Tests** | YES — `tests/listing-parser/gooding.test.ts` (fixture-based, comprehensive) |
| **TOS posture** | No explicit scraping prohibition found; public auction results; permissive |

**Strategy:** Fetches Gatsby `page-data.json` endpoint (`/page-data{pathname}/page-data.json`), not the HTML page. This is robust because it is a structured JSON API response, not DOM scraping.

**Fields extracted vs schema:**

| Field | Status | Notes |
|---|---|---|
| title, year, make, model, trim | ✅ | Structured from Contentful fields |
| vin | ✅ | From `item.chassis`; pre-1981 chassis numbers kept as-is |
| mileage | ✅ | Regex on `highlights[]` array |
| engine | ✅ | From `specifications[]` array (unique — only parser besides BaT to get engine) |
| transmission | ✅ | From `specifications[]` array |
| exterior_color, interior_color | ✅ | From `highlights[]` "Finished in X over Y" pattern |
| sold_price_cents | ✅ | `lot.salePrice × 100` |
| listing_status | ✅ | Derived from `salePrice !== null` |
| reserve_met, has_no_reserve | ✅ | From `lot.hasReservePrice` |
| auction_end_date | ✅ | Last `ContentfulSubEventAuction.startDate` in `subEvents` |
| estimate_low/high_cents | ✅ | In `raw_data` |
| image_urls | ✅ | From `cloudinaryImages*` arrays → CDN URLs |
| bid_count | ❌ | N/A (consignment auction, no public bid count) |
| high_bid_cents | ❌ | Always null (Gooding does not expose bidding data) |
| description | ❌ | Always null — Gooding lots have catalog descriptions but they aren't in page-data.json |
| asking_price_cents | ❌ | N/A |
| is_repainted, paint disclosure | ❌ | Not extracted |

**USD-only caveat:** Parser throws for non-USD listings. Gooding does occasional EUR/GBP lots (international auctions) — those will surface as user-facing errors.

**Assessment:** Ship as-is. Functionally complete for the core use case. The null `description` is a known limitation but not blocking.

---

### 3. Bonhams

| Attribute | Value |
|---|---|
| **File** | `lib/listing-parser/bonhams.ts` (488 lines) |
| **State** | **WORKING** |
| **Wired in index.ts** | YES (`bonhams.com`) |
| **Tests** | YES — `tests/listing-parser/bonhams.test.ts` (fixture-based, comprehensive including GBP/no-reserve/no-sale paths) |
| **TOS posture** | Soft caution; no explicit scraping prohibition; "mechanism" clause targets automated bidding not data extraction; robots.txt permissive |

**Strategy:** Extracts `__NEXT_DATA__` JSON blob from server-rendered HTML (Next.js SSR). Full HTML/DOM fallback when `__NEXT_DATA__` is absent.

**Key caveat — hostname restriction:** Parser is hardcoded to `cars.bonhams.com`. The main site at `www.bonhams.com` would fail validation. The index.ts routes via `/bonhams\.com$/` regex, which would match both `www.bonhams.com` and `cars.bonhams.com` — but the parser itself then validates the hostname is exactly `cars.bonhams.com`. A user pasting a `www.bonhams.com` URL would get a hostname error, not a parse error. **Edge case, but worth flagging.**

**Fields extracted vs schema:**

| Field | Status | Notes |
|---|---|---|
| title, year, make, model | ✅ | Parsed from `sDesc` field in `__NEXT_DATA__` |
| trim | ❌ | Always null — title is parsed but trim is not split out |
| vin | ✅ | From `sDesc` chassis number; fallback to `dt/dd` scan; raw HTML regex |
| mileage | ✅ | From `sExtraDesc` prose; fallback to `dt/dd`; km→miles conversion |
| engine | ❌ | Always null (engine number goes into `raw_data.engine_number` only) |
| transmission | ✅ | Body text regex; captures Manual/Automatic/PDK/Tiptronic |
| exterior_color, interior_color | ✅ | Via `dt/dd` pairs (Bonhams uses labeled definition lists) |
| sold_price_cents | ✅ | From `dHammerPremium` (incl. premium preferred) or `dHammerPrice` fallback |
| high_bid_cents | ✅ | Set from `dHammerPrice` when listing is UNSOLD |
| listing_status | ✅ | From `sLotStatus` (`SOLD`/`UNSOLD`/`NEW`/`WITHDRAWN`) |
| reserve_met, has_no_reserve | ✅ | From `lWithoutReserve` |
| auction_end_date | ✅ | From `hammerTime.datetime`; fallback to `auction.dates.end.datetime`; fallback to `<time>` |
| estimate_low/high_cents | ✅ | In `raw_data` |
| image_urls | ✅ | From `images[i].image_url` |
| description | ✅ | From `sExtraDesc` HTML (stripped to text) |
| bid_count | ❌ | N/A (consignment auction) |
| asking_price_cents | ❌ | N/A |
| is_repainted, paint disclosure | ❌ | Not extracted |

**USD-only caveat (significant):** Parser throws for non-USD listings. Per the discovery report, ~60–70% of Bonhams Porsche lots are priced in GBP or EUR (UK and European auctions). The parser works correctly for US Bonhams sales (Scottsdale, Quail, Audrain) but will surface a user-facing error for any European or UK Bonhams lot URL. This is an intentional V1 deferral, not a bug, but it is the largest functional limitation of this parser.

**Assessment:** Ship as-is for USD lots. The GBP/EUR limitation is deliberate. Flag to users pasting non-US Bonhams URLs.

---

### 4. PCA Mart

| Attribute | Value |
|---|---|
| **File** | `lib/listing-parser/pca-mart.ts` (204 lines) |
| **State** | **WORKING — but NOT WIRED into `index.ts`** |
| **Wired in index.ts** | **NO** — `mart.pca.org` routing is absent |
| **Tests** | **NO** — no test file exists |
| **TOS posture** | CAUTION — ToS prohibits redistribution of content; `should_persist: false` hardcoded, meaning no DB writes. Paste-and-display to the requesting user is defensible |

**This parser is functionally complete but unreachable by end users.** A user pasting a `mart.pca.org` URL gets `Platform not yet supported` from `index.ts`.

**Fields extracted vs schema:**

| Field | Status | Notes |
|---|---|---|
| title, year, make | ✅ | Make hardcoded to `'Porsche'` (PCA Mart is Porsche-only by rule) |
| model, trim | ✅ | Via `splitModelTrim()` from BaT parser |
| vin | ✅ | From spec field; partial VINs (<17 chars) kept as-is; blank if absent |
| mileage | ✅ | From `Mileage:` spec field |
| transmission | ✅ | From `Transmission:` spec field |
| exterior_color, interior_color | ✅ | From `Exterior:` / `Interior:` spec fields |
| asking_price_cents | ✅ | From `h1.classified-price` |
| listing_status | ✅ | Hardcoded `'asking'` (classified, not auction) |
| image_urls | ✅ | From `a[href*="martAdImages"]` anchors; resolved to absolute URLs |
| description | ✅ | From `.martAdDescription` |
| source_listing_id | ✅ | Ad# from page; fallback to URL path segment |
| sold_price_cents, high_bid_cents | ❌ | Always null (no sale price available on PCA Mart) |
| auction_end_date | ❌ | Always null (classified, not auction) |
| bid_count, reserve_met | ❌ | Always null / false (N/A for classified) |
| engine | ❌ | Not extracted |
| is_repainted, paint disclosure | ❌ | Not extracted |

**`should_persist: false`** is hardcoded on the return type — the analyze route will not write PCA Mart results to the database. This is intentional given ToS ambiguity and the classified-only nature of the data.

**Proximity to shippable:** One routing line in `index.ts`, plus a basic test fixture. This is the closest-to-zero-work parser that is not yet live.

**Assessment:** Small fix. Add `mart.pca.org` routing in `index.ts`, add a smoke test. The implementation is complete.

---

### 5. Cars & Bids

| Attribute | Value |
|---|---|
| **Main app stub** | `lib/listing-parser/cars-and-bids.ts` (7 lines) — throws `PlatformNotSupportedError` |
| **Playwright parser** | `playwright-worker/src/parsers/cars-and-bids.ts` (296 lines) — full implementation |
| **State** | **WIRED BUT BROKEN** — user gets "Platform not supported" on C&B paste |
| **Wired in index.ts** | NO — no `carsandbids.com` routing |
| **Tests** | NO |
| **TOS posture** | **UNVERIFIED** — ToS page is a React SPA, human review required. `robots.txt` is permissive (listing paths not blocked). |

**Architecture:** C&B is a React SPA with no server-side rendering. Static HTML is a 5.5KB shell (`<div id="root" class="init">`). All listing data is rendered client-side via an authenticated AWS API Gateway backend. This makes plain `fetch` useless.

The Playwright worker (`playwright-worker/src/`) is the solution: it renders pages in a headless browser and returns the parsed result. The worker:
- Is deployed and running (Railway, based on `playwright-fallback.ts` references)
- `SUPPORTED_SOURCES = ['cars-and-bids']` is confirmed in `fetch-handler.ts`
- The parser in `playwright-worker/src/parsers/cars-and-bids.ts` is a complete 296-line Cheerio-based HTML parser (runs against the rendered DOM)

**Gap:** `index.ts` does not route `carsandbids.com` URLs to `callPlaywrightWorker('cars-and-bids')`. That call exists in `lib/listing-parser/playwright-fallback.ts` but is never invoked from the router.

**C&B parser fields (Playwright worker):**

| Field | Status | Notes |
|---|---|---|
| title, year, make, model, trim | ✅ | Title parse with PORSCHE_MODEL_PREFIXES |
| vin | ✅ | From `extractDetailField` + raw HTML VIN scan |
| mileage | ✅ | From `Mileage` detail field |
| transmission | ✅ | From `Transmission` detail field |
| exterior_color, interior_color | ✅ | From `Exterior Color` / `Interior Color` detail fields |
| engine | ✅ | From `Engine` detail field (C&B does expose this) |
| sold_price_cents | ✅ | "Sold for $X" text match |
| high_bid_cents | ✅ | "Bid to $X" / "Current Bid $X" text match |
| listing_status | ✅ | sold / no-sale / live |
| reserve_met, has_no_reserve | ✅ | Text detection |
| bid_count | ✅ | "N bids" text match (C&B exposes this) |
| auction_end_date | ✅ | `<time datetime>` + JSON timestamp fallback |
| description | ⚠️ | Meta description only (short); no full listing text |
| image_urls | ⚠️ | All `<img src>` — may include thumbnails/nav images (sliced to 20) |
| asking_price_cents | ❌ | N/A (auction) |
| is_repainted, paint disclosure | ❌ | Not extracted |

**Missing from CanonicalListing shape:** The Playwright worker's `ParsedListing` interface omits `seller_info`, `modification_notes`, `raw_data`, and `asking_price_cents`. `playwright-fallback.ts` re-attaches these as null/empty on success — so the CanonicalListing returned upstream is complete.

**Assessment:** Moderate work. Two wiring steps — add routing in `index.ts` + ensure `PLAYWRIGHT_WORKER_URL`/`PLAYWRIGHT_WORKER_SECRET` env vars are set in production. ToS review is the blocking gate before going live.

---

### 6. RM Sotheby's

| Attribute | Value |
|---|---|
| **Main app stub** | `lib/listing-parser/rm-sothebys.ts` (7 lines) — throws `PlatformNotSupportedError` |
| **Scraper-side parser** | `scrapers/auction-houses/rm-sothebys-parser.ts` (308 lines) |
| **State** | **WIRED BUT BROKEN** for paste-and-go; scraper-side has partial implementation |
| **Wired in index.ts** | NO |
| **Tests** | NO |
| **TOS posture** | Not reviewed (no discovery report found for RM Sotheby's) |

**Two-tier scraper architecture (batch-oriented, not paste-and-go):**

`parseLotFromIndex()` — processes results from RM Sotheby's search API:
- Returns `RawListing` type (from `scrapers/types.ts`) — **not `CanonicalListing`** — different field names
- Extracts: year, make, model, trim, listing_status, final_price_cents, currency, estimate range, image thumbnail, auction date, lot number
- `currency !== 'USD'` → null `final_price_cents` (not a throw — silently drops non-USD prices)

`parseDetailPage()` — parses individual lot HTML pages:
- Extracts: mileage, exterior_color, interior_color, transmission, `vin_hash_partial` (SHA-256 of last 6 chassis chars — **full VIN deliberately withheld**)
- Relies on `.idlabel`/`.iddata` CSS classes for chassis/engine fields, plus bullet list text extraction
- `ul.list-bullets` is the key selector for RM Sotheby's color/mileage bullets

**Gap between scraper and paste-and-go:** Even if `parseDetailPage()` works correctly on a real lot HTML, it produces `DetailPageFields` (a partial object), not a `CanonicalListing`. A paste-and-go parser would need to fetch the lot HTML, call `parseDetailPage()`, and merge with enough inferred fields to produce a `CanonicalListing`. That bridge does not exist.

**Fields available from scraper-side work:**

| Field | Status | Notes |
|---|---|---|
| year, make, model, trim | ✅ | From search index |
| mileage | ✅ | From detail page bullet text |
| exterior_color, interior_color | ✅ | From detail page bullet text |
| transmission | ✅ | From detail page text |
| vin | ⚠️ | Hash only (`vin_hash_partial`) — intentional; full VIN not persisted |
| sold_price_cents | ✅ | USD only; null for GBP/EUR |
| listing_status | ✅ | From `lot.sold` / `lot.auctioned` |
| estimate_low/high | ✅ | Parsed from estimate string |
| bid_count | ❌ | Not available |
| auction_end_date | ✅ | Passed in from auction metadata |
| image_urls | ⚠️ | Single thumbnail only (from search index `crop` field) |
| description | ❌ | Not extracted |
| reserve_met, has_no_reserve | ⚠️ | `has_no_reserve: false` hardcoded (RM Sotheby's always has reserves) |

**Assessment:** Moderate-to-significant work. The scraper-side parser has solid field extraction logic, but building a paste-and-go wrapper that produces `CanonicalListing` requires: (1) fetching the lot page HTML, (2) parsing it with `parseDetailPage()`, (3) inferring or fetching the index-level fields (price, status, dates) from the lot page HTML alone (not from the search API). The existing `parseDetailPage()` only extracts the spec fields, not price/status/dates. A new lot-page HTML parser would need to cover those fields.

---

### 7. Porsche Finder (`finder.porsche.com`)

| Attribute | Value |
|---|---|
| **File** | NONE — no parser exists |
| **State** | **MISSING** |
| **Wired in index.ts** | NO |
| **Tests** | NO |
| **TOS posture** | AMBIGUOUS — no explicit scraping prohibition in finder.porsche.com legal notice; adjacent Porsche dealer portal ToS does prohibit automated access. Single-URL paste-and-display is defensible; bulk collection is not |
| **Discovery report** | `scrapers/discovery/porsche-finder-report.md` — comprehensive |

**Key technical facts (from discovery report):**
- Next.js App Router with full SSR — all data present in initial HTML, **no Playwright needed**
- JSON-LD `["Product","Car"]` schema block contains: VIN, mileage, color, transmission, asking price (USD), dealer name/address, year, model, generation string (`"992 II"`), body type, drivetrain
- RSC payload (`self.__next_f.push`) adds: CPO/Approved Pre-Owned status, stock number, full Porsche option codes with names, service history flag
- URL structure: `/us/en-US/details/{6-char-ID}` — USD guaranteed by locale prefix
- **These are ACTIVE DEALER ASKING PRICES, not auction results.** Sold listings are removed; no historical archive exists.
- Rate limiting: parallel requests trigger 429 immediately; single sequential requests succeed

**What a parser would produce:**

| Field | Availability | Source |
|---|---|---|
| title, year, make, model, trim | ✅ | JSON-LD `name`, `model`, `vehicleConfiguration`, `modelDate` |
| vin | ✅ | JSON-LD `vehicleIdentificationNumber` (full 17-char) |
| mileage | ✅ | JSON-LD `mileageFromOdometer` (miles for `/us/`) |
| exterior_color, interior_color | ✅ | JSON-LD `color`, `vehicleInteriorColor` |
| transmission | ✅ | JSON-LD `vehicleTransmission` |
| asking_price_cents | ✅ | JSON-LD `offers.price` (integer USD) |
| listing_status | ✅ | Always `'asking'` — active inventory |
| sold_price_cents | ❌ | Never available |
| auction fields | ❌ | N/A — dealer classified |
| image_urls | ✅ | `offers.image` URL + width variants |
| CPO status | ✅ | RSC payload `porscheApproved` |
| option codes | ✅ | RSC payload `equipment.specialEquipment` |
| generation string | ✅ | JSON-LD `model` field ("992 II", "992 I") — directly useful for comp engine |

**Assessment:** From scratch but straightforward — JSON-LD parsing is simpler than DOM scraping. Significant data utility for the originality/specification use case (full option codes + generation string). **Not a comp-engine source** — no sales data. `should_persist: false` posture appropriate given ToS ambiguity and classified-only nature.

---

### 8. PCarMarket

| Attribute | Value |
|---|---|
| **File** | `lib/listing-parser/pcarmarket.ts` (7 lines) — stub |
| **State** | **STUB** |
| **Wired in index.ts** | NO |
| **Tests** | NO |
| **TOS posture** | Unknown — no discovery report exists |
| **Discovery report** | **NONE** |

The stub throws `PlatformNotSupportedError('pcarmarket')`. No discovery work has been done. PCarMarket is in the approved source list in `CLAUDE.md`. Without a discovery report, site architecture, TOS posture, data shape, and technical feasibility are all unknown.

**Assessment:** Defer. Cannot rank proximity to shippable without discovery work.

---

## Summary Table

| Source | File | State | index.ts | Tests | Ranking | Fields vs BaT |
|---|---|---|---|---|---|---|
| BaT | `lib/listing-parser/bring-a-trailer.ts` | **WORKING** | ✅ | ✅ | #1 Baseline | Full (+ paint/upholstery disclosure) |
| Gooding | `lib/listing-parser/gooding.ts` | **WORKING** | ✅ | ✅ | #2 | Near-full (+ engine; − description) |
| Bonhams | `lib/listing-parser/bonhams.ts` | **WORKING** | ✅ | ✅ | #3 | Near-full (USD lots only; trim always null) |
| PCA Mart | `lib/listing-parser/pca-mart.ts` | **WORKING (unwired)** | ❌ | ❌ | #4 | Asking price only; no engine; no paint disclosure |
| Cars & Bids | `playwright-worker/src/parsers/cars-and-bids.ts` | **WIRED BUT BROKEN** | ❌ | ❌ | #5 | Good (+ engine, + bid_count; ToS unverified) |
| RM Sotheby's | `scrapers/auction-houses/rm-sothebys-parser.ts` | **WIRED BUT BROKEN** | ❌ | ❌ | #6 | Partial; wrong type system; no paste-and-go wrapper |
| Porsche Finder | (none) | **MISSING** | ❌ | ❌ | #7 | Would be excellent (JSON-LD); asking price only |
| PCarMarket | `lib/listing-parser/pcarmarket.ts` | **STUB** | ❌ | ❌ | #8 | Unknown — no discovery |

---

## Ranking by Proximity to Shippable

### Tier 1 — Ship as-is (baseline)

**#1 BaT** — Production-ready. S-INGESTION in flight. Do not touch.

**#2 Gooding & Company** — Working, wired, tested. `page-data.json` strategy is more robust than HTML scraping. USD-only is acceptable for this source. Minor gap: description always null, but not blocking.

**#3 Bonhams** — Working, wired, tested. USD-only caps coverage to ~30-40% of Bonhams Porsche volume, but that is a known V1 deferral. Edge case: `www.bonhams.com` URLs would fail hostname validation (only `cars.bonhams.com` accepted) — may confuse users.

---

### Tier 2 — Small fix (1–2 hours)

**#4 PCA Mart** — The implementation is complete. Zero parsing risk. Two steps to ship:
1. Add `mart.pca.org` → `parsePcaMartListing` routing in `index.ts` (one conditional branch)
2. Add a fixture-based smoke test (one test file)

Consideration: This surfaces asking prices, not auction results. The UI must communicate that distinction clearly. `should_persist: false` is already enforced.

---

### Tier 3 — Moderate work (half-day to full day)

**#5 Cars & Bids** — Playwright worker is built and deployed. Parser is complete. Two remaining steps:
1. Add `carsandbids.com` → `callPlaywrightWorker('cars-and-bids')` routing in `index.ts`
2. Ensure `PLAYWRIGHT_WORKER_URL` and `PLAYWRIGHT_WORKER_SECRET` env vars are set in production

**Hard gate before #1:** ToS review is required. The ToS page is a React SPA and must be read in a real browser. If ToS permits, this is a half-day wiring task. If ToS prohibits, the whole parser is deferred.

**#6 RM Sotheby's** — The scraper-side logic has solid field-extraction for the detail page. However, a paste-and-go wrapper does not exist. Required work:
1. Write a `parseRmSothebysHtml()` function that produces `CanonicalListing` from a lot page (not `RawListing`) — covering price, status, reserve, and dates which `parseDetailPage()` does not handle
2. Wire into `index.ts`
3. Conduct TOS review (not yet done)
4. Add tests

The existing `parseDetailPage()` code is reusable for spec fields. Price/status/reserve extraction must be written from scratch for the paste-and-go context.

---

### Tier 4 — From scratch / defer

**#7 Porsche Finder** — No parser exists but the discovery report is excellent. The JSON-LD approach is simpler than DOM scraping (single `<script type="application/ld+json">` block). Estimate: 1 day implementation including tests. Key considerations:
- Asking prices only — not a comp-engine source
- Option code extraction from RSC payload is valuable for originality analysis
- TOS is ambiguous — `should_persist: false` posture appropriate
- Porsche Finder is not in V1 backlog scope per CLAUDE.md, but the discovery report recommends GO for paste-and-go

**#8 PCarMarket** — No discovery work done. Cannot assess without understanding the site architecture, TOS, and data shape. Discovery sprint required before any implementation decision.

---

## Surprises and Blockers

**1. PCA Mart is fully implemented but dead to users.** `lib/listing-parser/pca-mart.ts` is 204 lines of working parser code, but `index.ts` has no routing for `mart.pca.org`. No test exists either. This appears to be an oversight — it was implemented but not wired up. This is the easiest single fix to ship a new parser.

**2. Cars & Bids wiring gap is very small.** The Playwright worker is live, the parser is complete, and the `callPlaywrightWorker` infrastructure exists in `playwright-fallback.ts`. The only missing piece is a routing branch in `index.ts`. The TOS gate is the real blocker, not the implementation.

**3. RM Sotheby's has two parallel systems that don't connect.** The scraper-side parser (`scrapers/auction-houses/`) uses `RawListing` (bulk scraper type), while the paste-and-go stub (`lib/listing-parser/`) throws immediately. The scraper work cannot be directly reused for paste-and-go — it needs a wrapper. This is easy to miss since the scraper-side code looks substantial.

**4. Bonhams hostname validation is narrower than the router.** `index.ts` routes any `bonhams.com` subdomain, but the parser validates exactly `cars.bonhams.com`. A user pasting `www.bonhams.com/...` gets a hostname error. Whether `www.bonhams.com` lot pages even exist is unknown — this may be a non-issue in practice.

**5. No PCarMarket discovery.** PCarMarket is listed in CLAUDE.md's approved source list but has no discovery report and no parser. Cannot assess effort or feasibility.

---

## Output File

`research/audit-2026-05-14/s-parser-audit/REPORT.md`

---

## SUMMARY (copy-back block)

**Total parsers audited:** 8 (BaT, Gooding, Bonhams, PCA Mart, Cars & Bids, RM Sotheby's, Porsche Finder, PCarMarket)

**Count by state:**
- WORKING: 3 (BaT, Gooding, Bonhams)
- WORKING BUT UNWIRED: 1 (PCA Mart — implementation complete, not in index.ts)
- WIRED BUT BROKEN: 2 (Cars & Bids — Playwright worker exists but not routed; RM Sotheby's — scraper-side only, wrong type system)
- MISSING: 1 (Porsche Finder — full discovery report, no parser)
- STUB: 1 (PCarMarket — no discovery report, unknown)

**Top 3 closest to shippable:**

1. **PCA Mart** — Implementation is complete; missing one routing line in `index.ts` and a smoke test. 1–2 hours to ship. Note: asking prices only, not auction results.
2. **Cars & Bids** — Playwright worker parser is complete and deployed; missing routing in `index.ts`. Half-day of wiring once ToS is cleared by human review (ToS page requires a real browser to read).
3. **Gooding & Company** — Already working, wired, and tested. No work needed; ranking it #3 to confirm it is production-ready without qualification.

**Bottom 3:**

1. **PCarMarket** — No discovery work done. Cannot assess. Needs discovery sprint before any implementation decision.
2. **Porsche Finder** — No parser yet, though discovery report is thorough and implementation would be straightforward (JSON-LD, no Playwright). Asking prices only; not a comp-engine source. Not in current V1 backlog scope.
3. **RM Sotheby's** — Scraper-side parser exists but is in the wrong type system and architecture for paste-and-go. Needs a new `CanonicalListing`-producing HTML parser for the lot page (price/status/reserve — the parts `parseDetailPage()` doesn't cover). Moderate work; TOS review also pending.

**Surprises worth flagging:**
- PCA Mart's complete-but-unwired state is the highest-ROI quick win in the parser layer.
- C&B is closer to live than it appears — the Playwright infrastructure is fully built; it's a routing/env-var wiring task plus ToS clearance.
- RM Sotheby's has more code than expected but none of it is on the paste-and-go path.
- Bonhams' USD-only limitation means ~60–70% of their Porsche lots will surface as user-facing errors (non-US auctions in GBP/EUR). This is a known V1 deferral but worth communicating clearly in error copy.
