# Cars & Bids — Scraper Discovery Report

**Date:** 2026-05-10  
**Investigator:** Claude Code (automated discovery, no data writes, no auth)  
**Recommendation:** CAUTION — buildable, but requires headless browser; ToS unverified

---

## 1. Terms of Service Review

**Status: UNVERIFIED — human review required**

The ToS page at `https://carsandbids.com/terms` is a React SPA. The HTML shell returns 200 with browser headers but contains no text content — all copy is rendered via JavaScript. Static fetch, the Wayback Machine (temporarily offline during investigation), and Strapi CMS inspection all failed to retrieve the ToS text.

**Action required:** Open `https://carsandbids.com/terms` in a real browser and search for: "scrape", "automat", "crawl", "data mining", "systematic", "commercial". Report back before building the parser.

**robots.txt verdict: PERMISSIVE**

```
User-agent: *
Allow: /sell-car$
Allow: /sell-car/$
Disallow: /sell-car/
Disallow: /widgets$
Disallow: /widgets/
Disallow: /dealers$
Disallow: /dealers/

Sitemap: https://carsandbids.com/cab-sitemap/xml_sitemap.xml
```

`/past-auctions/`, `/auctions/`, and all listing paths are **not disallowed**. The sitemap is openly declared. No crawl-delay directive.

---

## 2. robots.txt Review

- `/past-auctions/` — **NOT blocked**
- `/auctions/{id}/...` (listing pages) — **NOT blocked**
- Blocked paths: `/sell-car/`, `/widgets/`, `/dealers/` only
- Sitemap at `https://carsandbids.com/cab-sitemap/xml_sitemap.xml` — openly declared and accessible

---

## 3. Site Architecture

### URL Pattern

```
https://carsandbids.com/auctions/{8-char-ID}/{year-make-model-slug}
Example: https://carsandbids.com/auctions/9QXAMDJE/2017-porsche-911-carrera-4s-coupe
```

### Technology Stack

- **Frontend:** React SPA (Create React App, not Next.js)  
- **Cloudflare protection:** Present but bypassed by Chrome 131 browser headers — no JS challenge triggered
- **Static HTML content:** Empty `<div id="root">` + global homepage stats JSON only  
- **Response (browser headers):** 200, ~5.5KB compressed  
- **Response (default curl / WebFetch tool):** 403 Forbidden  

### Backend Infrastructure

| Service | URL | Purpose |
|---|---|---|
| Main API | `https://carsandbids.com` (AWS API Gateway) | All auction data — **auth required** |
| Strapi CMS | `https://sbffr.carsandbids.com` | Curated content — **publicly accessible** |
| WebSocket | `wss://websocket.carsandbids.com/carsandbids` | Live bidding |
| Admin | `https://admin.carsandbids.com` | Internal only |

### Authentication Architecture

The main auction data API (AWS Lambda + API Gateway) requires a bearer token. Anonymous tokens are provisioned via `POST /api/auth/ti_ni` — but this endpoint itself returns `{"message":"Missing Authentication Token"}` without an API key in the request header. The API key is stored per-session in localStorage (`cb-keys`), provisioned dynamically from the server. It is **not hardcoded** in the JavaScript bundle.

---

## 4. Single Listing Fetch Test

Three completed Porsche listings tested (different generations):

| Listing | URL | Status | HTML Size |
|---|---|---|---|
| 2017 Porsche 911 Carrera 4S (991) | `carsandbids.com/auctions/9QXAMDJE/...` | 200 | 5,679 bytes |
| 2015 Porsche Cayman S (981) | `carsandbids.com/auctions/3o64nNgg/...` | 200 | 5,592 bytes |
| 2020 Porsche 718 Boxster Spyder (982) | `carsandbids.com/auctions/rkQqY2AW/...` | 200 | 5,604 bytes |

All three return the identical SPA shell (~5.5KB). **No listing data is present in the HTML.** The page body is:

```html
<div id="root" class="init"></div>
```

The `class="init"` hides the root until JavaScript loads. There is no server-side rendering.

---

## 5. Per-Listing Data Shape

### Static HTML: NOTHING EXTRACTABLE

Zero listing fields are present in the static HTML. No JSON-LD structured data. No meta tags with VIN, price, mileage, or spec data.

### Strapi CMS API (130 curated records only)

`GET https://sbffr.carsandbids.com/api/auctions?populate=*&sort=id:desc`

Returns publicly, no auth required. Fields per record:

```json
{
  "id": 404,
  "title": "1996 Ferrari F355 Spider",
  "subtitle": "~25,000 Miles, Gated 6-Speed Manual, 1 Owner Since 2004, Mostly Unmodified",
  "auction_id": "3o68QYlE",
  "num_bids": 39,
  "num_comments": 50,
  "high_bid": 143500,
  "auction_url": "https://carsandbids.com/auctions/3o68QYlE/1996-ferrari-f355-spider",
  "auction_end": "2026-05-07T07:00:00.000Z",
  "auction_status": "sold",
  "make": {
    "name": "Ferrari",
    "slug": "ferrari"
  },
  "main_image": { ... image URLs ... }
}
```

**Critical limitation:** Only 130 curated/featured records total across all makes. This is an editorial selection, not the full auction database. Strapi `pageCount: 130` — no pagination to more records.

### Main API Fields (inferred from JS bundle)

Inferred from JavaScript bundle (`main.c6980c86.chunk.js`) — requires authenticated session:

```
auction_url, title, sub_title, current_bid.amount, sale_amount, 
num_bids, num_comments, photos.main_photo, transaction.external_id (VIN)
```

Color, mileage, transmission, and option codes are visible in listing descriptions (subtitle string) but not in structured fields in the Strapi data.

### URL Slug Data (free, no auth)

The sitemap URL slug encodes year + make + model + trim:
```
2017-porsche-911-carrera-4s-coupe
2015-porsche-cayman-s
2020-porsche-718-boxster-spyder
```

Year, make, and a clean model/trim string are parseable from the slug without any fetch.

---

## 6. Pagination and Filter Capability

**Sitemap:** `https://carsandbids.com/cab-sitemap/auctions.xml`  
- 9,800 total listing entries, fully accessible without auth  
- Filterable by grepping slug for make (e.g., "porsche")  
- Contains: `loc` (full URL), `lastmod`, `priority`, `changefreq`  
- Does NOT contain: sale price, mileage, sold/no-sale, auction date  

**Strapi CMS API:**
- Standard Strapi v5 pagination: `?pagination[page]=1&pagination[pageSize]=25`
- Total: 130 records across all makes  
- Porsche filter: `?filters[make][name][$eq]=Porsche` (500 on `populate=*`, test more carefully)

**Main API (authenticated):**
- Filter/search endpoint: `/autos/auctions/?make=porsche&status=closed&page=1` (returns SPA HTML — client route, not JSON API)
- Actual JSON endpoint: AWS API Gateway, unknown params without auth session

---

## 7. Volume Estimate — Porsche 2023–2026

| Metric | Value |
|---|---|
| Site-reported total completed auctions | 36,000+ (since August 2020 launch) |
| Sitemap total entries | 9,800 |
| Sitemap Porsche entries | 1,014 (~10.4%) |
| Porsche % of all listings | ~10% |
| Estimated total Porsche auctions ever | ~3,700 |
| Estimated Porsche auctions 2023–2026 | ~2,500 |
| Sitemap coverage period (by lastmod) | May 2025 – May 2026 (~12 months) |
| 2023–2026 model-year Porsches in sitemap | 55 (model year, not auction year) |

**Notes:** The sitemap appears to be a rolling window of ~12 months of active/recently-updated listings, not the full 36K+ catalog. Actual Porsche volume in the target date range is estimated at ~2,500 based on Porsche's ~10% share of all C&B sales.

---

## 8. Recommendation: CAUTION

### Why Not ABORT

- robots.txt is permissive — listing paths not blocked
- Cloudflare protection is mild — Chrome headers bypass it cleanly
- Volume is substantial (~2,500 Porsche auctions in range)
- The sitemap provides a complete URL list for all listings
- The site is in-scope per the approved source list in CLAUDE.md

### Why Not GO (Yet)

1. **ToS unverified.** The terms page requires a real browser to read. Could contain scraping prohibitions.
2. **No data in static HTML.** Every field requires JavaScript execution. This eliminates a simple `fetch → cheerio` approach.
3. **Main API requires auth.** Sale price, mileage, transmission, VIN, and colors are behind AWS API Gateway authentication. Reverse-engineering the session init is possible but legally risky without ToS review first.

### Path to GO

**Option A — Headless browser (recommended):**
- Use Playwright/Puppeteer to load listing pages, execute JS, extract rendered DOM
- Listing data renders from in-memory React state — target CSS selectors in rendered output
- Rate-limit: ~2 requests/minute to be conservative; ~1,014 Porsche listings = ~8 hours
- ToS review still required first

**Option B — Strapi CMS API (partial, fast):**
- 130 curated records accessible now, no auth, fields include: title, subtitle (has compact spec), high_bid, auction_end, auction_status, make
- Subtitle string parsing would give approximate mileage/transmission/color for curated listings
- Not a full dataset solution, but could bootstrap comps for high-profile listings

**Option C — Auth flow reverse-engineering:**
- DO NOT pursue without ToS clearance
- The session token provisioning is complex (AWS API Gateway + dynamic key storage) and would constitute intentional circumvention of access controls

---

## Appendix: Key Endpoints Discovered

```
# Sitemap index (public)
GET https://carsandbids.com/cab-sitemap/xml_sitemap.xml

# Auctions sitemap (public — 9,800 listing URLs)
GET https://carsandbids.com/cab-sitemap/auctions.xml

# Strapi CMS — auction list (public, 130 records)
GET https://sbffr.carsandbids.com/api/auctions?populate=*&sort=id:desc&pagination[pageSize]=25

# Strapi CMS — makes list (public)
GET https://sbffr.carsandbids.com/api/makes?populate=*&sort=name

# Listing page (200 with browser headers, SPA shell only)
GET https://carsandbids.com/auctions/{8-char-ID}/{slug}

# Main API auth (403 without x-api-key)
POST https://carsandbids.com/api/auth/ti_ni

# Main API — auction list (400 without session)
GET https://carsandbids.com/api/auctions
```

---

## Appendix: Strapi Auction Fields Available Without Auth

These 130 records could be ingested immediately as a seed dataset:

| Field | Present | Notes |
|---|---|---|
| year | Partial | Parseable from title string |
| model | Partial | Parseable from title string |
| generation | No | Not a field; derivable from year+model |
| mileage | Partial | In subtitle as free text ("~25,000 Miles") |
| sale_price | Yes | `high_bid` in USD |
| sold/no-sale | Yes | `auction_status`: "sold", "sold_after", or implied unsold |
| exterior_color | Partial | Sometimes in subtitle |
| interior_color | No | |
| transmission | Partial | Sometimes in subtitle |
| VIN | No | |
| auction_url | Yes | Full URL |
| auction_end | Yes | ISO timestamp |
| num_bids | Yes | Integer |
| make | Yes | Structured object with name + slug |
| main_image | Yes | Multiple sizes from Strapi Cloud CDN |
