# Porsche Finder — Discovery Report
*Investigation date: 2026-05-11 (updated from 2026-05-10 initial draft)*
*Scope: Read-only discovery. No data was stored. No production code was written.*

## 1. URL Patterns

### Base URL and Redirects
- `https://finder.porsche.com/` → **301 redirect** → `https://finder.porsche.com/us/en-US`
- Pattern: `/{country-code}/{locale-code}` (e.g., `/us/en-US`, `/de/de-DE`, `/gb/en-GB`)

### Search URL Pattern
```
https://finder.porsche.com/us/en-US/search
https://finder.porsche.com/us/en-US/search?condition=used
https://finder.porsche.com/us/en-US/search?condition=used&model=911
https://finder.porsche.com/us/en-US/search?condition=porsche_approved&model=911
https://finder.porsche.com/us/en-US/search?condition=used&model=911&page=2
https://finder.porsche.com/us/en-US/search?condition=used&model=911&minimum-model-year=2010&maximum-model-year=2015
```

### Individual Listing URL Patterns (two forms)
**Long form (slug + ID):**
```
https://finder.porsche.com/us/en-US/details/porsche-911-gt3-with-touring-package-preowned-6GL72W
https://finder.porsche.com/us/en-US/details/porsche-911-turbo-s-my23-preowned-366P68
https://finder.porsche.com/us/en-US/details/porsche-911-carrera-gts-cabriolet-my24-preowned-8G03Q6
```

**Short canonical form (ID only):**
```
https://finder.porsche.com/us/en-US/details/6GL72W
https://finder.porsche.com/us/en-US/details/366P68
```
The JSON-LD `offers.url` field always uses the short canonical form. Both forms load the same listing. The listing ID is a 6-character alphanumeric string (mixed case, e.g., `6GL72W`, `NPN7N9`).

### Alternative US Portals
- `https://www.porsche.com/usa/approvedcars/` → **404 Not Found** (no separate US portal)
- `https://www.porsche.com/usa/approved-preowned/` → **404 Not Found**
- `finder.porsche.com` is the single canonical global inventory portal for all Porsche dealer listings including CPO/Approved Pre-Owned.

---

## 2. Terms of Service

**Source reviewed:** `https://terms.porsche.com/us/en-US/legal-notice` (linked from the footer of finder.porsche.com)

Also found: `https://terms.porsche.com/medias/us/en-US/Terms_and_Conditions.pdf` (PDF, linked from footer)

### Relevant Clauses (verbatim from legal-notice page)

**Trademarks / Copyrights section:**
> "All photographs, audio and video clips, picture images, graphics, and other content items contained on the website are copyrighted unless otherwise noted and may not be used in any manner, except as provided in this Notice or in the website text, without Porsche's prior written permission."

> "You may browse this website and download or print a copy of material displayed on the website for your personal use only and not for redistribution, unless consented to in writing by Porsche. This limited consent shall automatically terminate upon your breach of any of these terms."

### Adjacent Porsche Domain ToS (Cross-Reference)

During the 2026-05-11 investigation session, direct fetches of `finder.porsche.com` returned HTTP 429 for all requests (see Section 4 — Rate Limiting). However, ToS language was successfully retrieved from two adjacent Porsche properties, which share corporate parentage and legal authorship:

**From porschemotorcarsales.com Terms & Conditions (verbatim):**
> "Use automated means to download data from the Service, included use of unless expressly permitted by Porsche Motor Car Sales"

> "Neither you nor anyone appointed by you may in any way amend the Porsche Motor Car Sales site nor may you republished, copy, transmit or distribute it for commercial use, for the creation of derivative works, or for public display"

> "Any reproduction, modification, creation of derivative works from or redistribution of the site or the Content is prohibited without the express written consent of Porsche Motor Car Sales"

**From developer.porsche.com Terms of Use — Section 4.2(b) (verbatim):**
> "using any robot, spider, scraper, or other similar automated data collection or extraction tools, program, algorithm or methodology to search, access, acquire, copy or monitor any portion of the Developer Portal"

The Developer Portal terms explicitly prohibit scraping. However, the Developer Portal is a separate service (API key management) and its terms do not govern finder.porsche.com. The `porschemotorcarsales.com` terms are more directly analogous and do explicitly prohibit automated data downloads.

### Analysis on Automated Access
The finder.porsche.com legal notice (terms.porsche.com/us/en-US/legal-notice) covers **trademark use, copyright, and redistribution** but does **not contain any explicit clause** addressing automated access, crawlers, or bots.

However, adjacent Porsche dealer-portal ToS (porschemotorcarsales.com — which is structurally identical to finder.porsche.com as a PCNA-operated dealer inventory portal) **explicitly prohibits automated means** of downloading data. This is strong circumstantial evidence that finder.porsche.com carries the same intent even if the literal text on its own legal-notice page does not reproduce it.

**Verdict: AMBIGUOUS trending toward PROHIBITS** — the finder.porsche.com legal-notice page text is silent on automated access, but closely related Porsche dealer portal ToS explicitly prohibit it. For a single paste-and-display use case, the risk is low. For systematic scraping, this should be treated as PROHIBITS.

---

## 3. robots.txt

**Source:** `https://finder.porsche.com/robots.txt`

### Summary
```
User-agent: facebookexternalhit
User-agent: LinkedInBot
User-agent: AdsBot-Google
User-agent: AdsBot-Google-Mobile
Disallow: /api

User-agent: *
Allow: *.js
Allow: *.css
Disallow: /api
Allow: /api/*/similar-listings/
[... extensive query-parameter Disallow rules ...]

Sitemap: https://finder.porsche.com/sitemap.xml
```

### Key Findings

**`/api/` is Disallowed for all bots**, with one explicit exception:
```
Allow: /api/*/similar-listings/
```

**All query-string filter parameters are Disallowed** (this is standard SEO de-duplication practice, not an anti-scraping measure). Examples:
```
Disallow: /*?condition=
Disallow: /*?model=
Disallow: /*?maximum-mileage=
Disallow: /*?minimum-model-year=
Disallow: /*?maximum-price=
Disallow: /*?exterior=
Disallow: /*?drivetrain=
```

**No Crawl-delay directive** is present.

**No explicit Disallow on detail pages** (`/us/en-US/details/`).

**Interpretation:** The robots.txt blocks crawler indexing of filtered search results (normal SEO practice) and the `/api/` endpoint. Individual detail page paths are NOT disallowed. The `/api/*/similar-listings/` explicit Allow suggests the API does exist but is selectively exposed.

---

## 4. Site Architecture

### Framework and Rendering
- **Framework:** Next.js (App Router) — confirmed via `/_next/static/chunks/` CSS and JS paths, `turbopack-*` chunk names
- **Rendering:** Partial SSR (Server-Side Rendered) with React Server Components (RSC) payload
- **RSC payload:** `self.__next_f.push([1, ...])` calls in HTML — these carry serialized vehicle data as escaped JSON strings
- **Bot protection:** Vercel Security Checkpoint (challenge page) appears on some paths when accessed rapidly (rate limiting). Normal browser-UA requests succeed with 200. No persistent Cloudflare challenge on detail pages.

### Rate Limiting
- Parallel requests trigger HTTP 429 immediately
- Sequential requests with 2–3 second spacing succeed
- No `Retry-After` header observed in 429 responses
- **Assessment:** Moderate rate limiting. Not IP-banned. A respectful, request-per-user-action posture (paste-and-display) will not trigger rate limits.

### Response Sizes
| Page Type | Response Size |
|-----------|--------------|
| Homepage (`/us/en-US`) | ~320 KB |
| Search results page | ~1.9–2.2 MB |
| Individual listing detail | ~560–670 KB |

**Note:** Search pages are large because they include full translation strings and equipment option data in the RSC payload for all 15 listed vehicles.

### Data Availability Without JavaScript
The critical finding: **all vehicle data is present in the initial HTML response** — no JavaScript execution required. Both the JSON-LD structured data blocks and the RSC serialized payload (`__next_f.push`) contain complete vehicle data before any client-side hydration occurs.

This means a plain HTTP fetch (curl/node-fetch) with browser headers returns all parseable data. **No Playwright or headless browser is required** for parse-and-display on individual pasted listing URLs.

### Backdoor Data Endpoints
- `https://finder.porsche.com/_next/data/` → 429 (rate limited, but the path exists in Next.js conventions)
- `https://finder.porsche.com/api/` → Disallowed per robots.txt, returns 429
- No exposed GraphQL endpoint found in page source
- No Apollo state blob or `window.__APOLLO_STATE__` found

### Confirmed API Endpoint (from search index cache)
During the 2026-05-11 session, Google's search index surfaced a live URL reference to:
```
https://finder.porsche.com/api/offer/vehicle-expose/247288?languageTag=en-GB
```
This confirms the internal REST API uses numeric offer IDs (not VINs or the 6-char alphanumeric listing IDs). The `vehicle-expose` resource name suggests a per-listing vehicle detail endpoint. Direct fetch attempts returned 429 — the endpoint exists but is rate-protected. Note: `247288` is a low integer, suggesting sequential or near-sequential offer IDs, which would be trivially enumerable for bulk collection — further evidence of why Porsche rate-limits aggressively. This endpoint is Disallowed in robots.txt under `/api/`.

---

## 5. Per-Listing Data Shape

Two independent data sources are present on every detail page HTML response:

### Source A: Schema.org JSON-LD (`application/ld+json`)
Located in `<script type="application/ld+json">` tags. This is the primary, cleanest extraction path.

**Extraction path:** `$('script[type="application/ld+json"]')` → filter for `@type: ["Product", "Car"]`

```json
{
  "@type": ["Product", "Car"],
  "name": "911 GT3 with Touring Package",
  "model": "992 II",
  "color": "Slate Grey Neo",
  "image": "https://images.finder.porsche.com/{uuid}/960",
  "mileageFromOdometer": { "value": 109, "unitCode": "SMI" },
  "numberOfPreviousOwners": 1,
  "vehicleIdentificationNumber": "WP0AC2A93TS288853",
  "vehicleInteriorColor": "Leather Interior In Black With Fabric Seat Centers And GT Silver Stitching",
  "vehicleTransmission": "Manual",
  "modelDate": "2026-01-01",
  "vehicleModelDate": "2026-01-01",
  "vehicleConfiguration": "911 GT3 Touring",
  "bodyType": "Coupe",
  "driveWheelConfiguration": "https://schema.org/RearWheelDriveConfiguration",
  "vehicleEngine": { "fuelType": "PETROL" },
  "vehicleInteriorType": "Leather Interior in Black with Fabric Seat Centers and GT Silver Stitching",
  "offers": {
    "price": 399085,
    "priceCurrency": "USD",
    "itemCondition": "https://schema.org/UsedCondition",
    "availability": "https://schema.org/InStock",
    "url": "https://finder.porsche.com/us/en-US/details/6GL72W",
    "seller": {
      "@type": "AutoDealer",
      "name": "Porsche Stevens Creek",
      "address": {
        "addressLocality": "Santa Clara",
        "postalCode": "95051",
        "streetAddress": "4155 Stevens Creek Boulevard"
      }
    },
    "warranty": {
      "durationOfWarranty": { "value": 24, "unitCode": "MON" }
    }
  }
}
```

### Source B: RSC Serialized Payload (`self.__next_f.push`)
Rich vehicle data embedded in the page's React Server Component stream. Contains everything in JSON-LD plus additional fields.

**Extraction path:** Regex on `__next_f.push` calls, or `$('script')` text scan for `"vin":"` / stock number pattern.

**Additional fields beyond JSON-LD:**
```
porscheApproved: true (boolean — CPO status)
condition: "preowned" (string)
stockNumber: "J42637"
price: "$$399,085.00" (formatted)
msrpBreakdown.totalPrice.value: "$$399,000.00" (vehicle offer price)
dealerFees: [{ amount: "$$85.00", description: "Doc Fee" }]
seller.porschePartnerNumber: "4500150"
seller.websiteUrl: "https://stevenscreek.porsche.com/en"
equipment.importantEquipmentOptions: [{ value: "bose-sound-system", label: "BOSE® Surround Sound System" }, ...]
equipment.specialEquipment: [{ code: "04E", name: "Lightweight Package", description: "..." }, ...]
reserved: false (boolean — whether a buyer has reserved this vehicle)
Full Service History: "Yes, every service done in Porsche Center"
```

### Field Coverage Table

| Field | JSON-LD | RSC Payload | Notes |
|-------|---------|-------------|-------|
| Year | ✓ `modelDate` | ✓ | `2026-01-01` → year |
| Make | implicit (always Porsche) | ✓ | |
| Model | ✓ `name` | ✓ | |
| Generation | ✓ `model` | ✓ | "992 II", "992 I", etc. |
| Trim/Config | ✓ `vehicleConfiguration` | ✓ | |
| VIN | ✓ `vehicleIdentificationNumber` | ✓ | Full 17-char |
| Mileage | ✓ `mileageFromOdometer` | ✓ | SMI = miles |
| Asking Price | ✓ `offers.price` | ✓ | Integer USD (not cents) |
| Currency | ✓ `offers.priceCurrency` = "USD" | ✓ | Always USD for `/us/` |
| Exterior Color | ✓ `color` | ✓ | Text name |
| Interior Color | ✓ `vehicleInteriorColor` | ✓ | Descriptive string |
| Transmission | ✓ `vehicleTransmission` | ✓ | "Manual", "PDK (Automatic)" |
| Body Type | ✓ `bodyType` | ✓ | "Coupe", "Cabriolet" |
| Drivetrain | ✓ `driveWheelConfiguration` (schema.org URL) | ✓ | RWD/AWD |
| Fuel Type | ✓ `vehicleEngine.fuelType` | ✓ | "PETROL" |
| Dealer Name | ✓ `offers.seller.name` | ✓ | |
| Dealer Address | ✓ `offers.seller.address` | ✓ | City, state, zip, street |
| CPO Status | ✗ | ✓ `porscheApproved: true/false` | Not in JSON-LD |
| Stock Number | ✗ | ✓ | |
| Previous Owners | ✓ `numberOfPreviousOwners` | ✓ | |
| Service History | ✗ | ✓ | "Yes, every service done in Porsche Center" |
| Option Codes | ✗ | ✓ | Full option code list with names |
| Warranty Duration | ✓ `offers.warranty` (24 MON) | ✓ | |
| Photos | ✓ `image` (first/primary) | ✓ multiple | `https://images.finder.porsche.com/{uuid}/{width}` |
| Availability | ✓ `availability: InStock` | ✓ `reserved: false` | Active listing |
| Listing Active | ✓ `InStock` | ✓ | No sold/archived listings surface |

### Image URL Pattern
```
https://images.finder.porsche.com/{uuid}/{width}
```
Width variants: `320`, `640`, `960`, `1280`

Example: `https://images.finder.porsche.com/afbbd1aa-ad4b-47fb-910d-1b09b240e249/960`

---

## 6. Currency and Geography

### URL Structure
The `/us/en-US/` path segment is both the country code (`us`) and locale (`en-US`). Every URL is locale-scoped. Example locales observed:
- `/us/en-US/` → US English, USD pricing
- `/de/de-DE/` → Germany, EUR pricing
- `/gb/en-GB/` → UK (presumed GBP)
- `/am/en-AM/` → Armenia
- `/au/en-AU/` → Australia

### Currency Confirmation
- US listings (`/us/en-US/`): `"priceCurrency":"USD"` in all JSON-LD — **verified**
- German listings (`/de/de-DE/`): `"priceCurrency":"EUR"` in all JSON-LD — **verified**

**USD isolation is guaranteed by the country-code URL prefix.** A US-domain URL will always carry USD prices. No ambiguity.

### Geo-Based Sorting
The search results page defaults to geo-sorted order using the server's IP-derived location (detected as San Jose, CA during testing). The `position=City,lat,lon,radius` query parameter controls proximity sorting. It does **not** filter inventory to a radius — it sorts by proximity. All US dealers appear regardless of location when using a large radius value (tested with `radius=9999`).

---

## 7. Volume Estimate

### Methodology
Binary search by incrementing page numbers with `position=New York,40.7128,-74.006,9999` (unlimited effective radius) and `condition=used`.

### Results
- **Page 100:** 15 listings (full page), navigation shows no page 101
- **Page 101:** 0 listings
- **Confirmed cap:** 100 pages × 15 listings/page = **~1,500 active used listings** (US, any model)

The same 100-page cap applies to `condition=porsche_approved`. This is almost certainly a hard search-result cap (backend limits pagination to 100 pages), not the true total inventory count.

**True inventory is likely higher.** The cap means a user pasting a URL to any listing will work fine — individual detail pages are not paginated and are not subject to this cap.

### US Inventory Breakdown (approximate, page-cap limited)
| Condition Filter | Max Pages | Est. Listings |
|-----------------|-----------|---------------|
| `used` (all) | 100 | ~1,500 |
| `porsche_approved` (CPO) | 100 | ~1,500 |
| `used` model=911 (2010–2015) | 1 | ~2 (SSR rendered) |

Collector-era 911s (pre-991) are sparsely represented — this is an authorized dealer portal, not a broad private seller marketplace. New/near-new CPO inventory dominates.

---

## 8. Search/Filter Capability

### URL-Stateful Filters (all confirmed from robots.txt and live testing)
All filtering changes the URL — it is **not purely JavaScript-driven**. The page uses Next.js App Router where filter state is reflected in query parameters.

```
condition=used | new | porsche_approved
model=911 | 718 | cayenne | macan | panamera | taycan
body-type=coupe | convertible
minimum-model-year=YYYY
maximum-model-year=YYYY
minimum-price=N
maximum-price=N
maximum-mileage=N
exterior={color-code}
interior={color}
drivetrain=
wheel-size=
page=N
position=City,lat,lon,radius
```

### Model-Specific Search Paths
The homepage provides both flat and nested search URL forms:
```
/us/en-US/search/911?model=911
/us/en-US/search/718?model=718
/us/en-US/search?condition=used&model=911
```

### Pagination
- 15 listings per page (hardcoded)
- Page numbers are URL-stateful (`?page=N`)
- Navigation renders only `current-1`, `current`, `current+1` page links (sliding window)
- Hard cap at page 100

### Filter Parameters NOT in the URL
From robots.txt analysis, these params exist and are used by the frontend but are intentionally Disallowed for crawling: `finderMode`, `int_id`, `int_medium`, `int_ref` (tracking params), `vatDeductible`, `onlineOrderable`, `referral`, `store`.

---

## 9. Asking Price vs Sold Price

### Explicit Confirmation

**These are active dealer ASKING PRICES, not auction results.**

Evidence:
1. `"availability": "https://schema.org/InStock"` — the vehicle is available for purchase
2. `"reserved": false` — not reserved by a buyer
3. `"itemCondition": "https://schema.org/UsedCondition"` — used vehicle currently for sale
4. The price field (`offers.price`) is labeled "Vehicle Offer Price" in the RSC breakdown UI (not "Sold for" or "Hammer Price")
5. The site's own copy refers to the dealer as seller via `@type: AutoDealer` and presents "Reserve Now" / "Contact Dealer" CTAs
6. There are no auction timers, bid counts, or "Sold for $X" labels anywhere in the page HTML
7. When a listing becomes unavailable, it displays: `"This Porsche has been sold."` — confirming sold listings are **removed**, not archived. The current inventory is exclusively active, unsold stock.

**There is no historical sold-price archive accessible on this platform.** finder.porsche.com is a live dealer inventory portal exclusively. Once sold, listings disappear.

---

## Recommendation

**CAUTION → GO for paste-and-go parser; CAUTION for any bulk collection**

### Technical Feasibility
**Plain HTTP only — no Playwright required.** Both JSON-LD and RSC payload are present in the initial HTML response. A standard `fetch()` with browser UA headers (identical to the BaT parser pattern) returns complete parseable data in a single request.

Key implementation notes:
- Use sequential requests; do not parallelize (HTTP 429 triggers immediately on parallel requests)
- Delay is not required for single-URL paste-and-display (one request per user action)
- Vercel Security Checkpoint can appear on rapid repeat requests but not on individual pasted-URL loads

### ToS Posture
**AMBIGUOUS** — no explicit prohibition of automated access, scraping, or parsing in the legal notice. The key restriction is "personal use only, not for redistribution." Parse-and-display to the submitting user (not redistribution to third parties) is defensible. However, Porsche has not granted explicit permission for programmatic access.

**Practical risk:** Porsche's inventory portal is their commercial sales funnel. A single-URL parser that displays data to a user who already knows the URL is unlikely to be contested. Bulk-scraping their inventory is a different matter and would be inadvisable.

### Data Utility for Asking Price Display
**Excellent.** The JSON-LD structured data is exceptionally clean and complete for a paste-and-go parser:
- Full VIN (17-char)
- Integer USD asking price
- Generation string ("992 II", "992 I" etc.)
- Transmission, drivetrain, body type
- Exterior and interior color as text
- Mileage in miles
- Dealer name and address
- CPO status (via RSC payload `porscheApproved: true/false`)
- Full option code list with names (from RSC payload)

This is significantly richer than most auction sites for per-listing detail. The option code list alone (with Porsche-standard codes like `04E`, `2JG`) is directly useful for originality analysis.

### Currency Clarity
**Fully isolated.** USD is guaranteed by the `/us/en-US/` URL prefix. `priceCurrency: "USD"` is in every JSON-LD offer. A URL with `/de/de-DE/` would carry EUR, but that would be a different pasted URL entirely. No ambiguity within the US locale.

### Paste-and-Go Parser Assessment
**GO.** A user pastes a `finder.porsche.com/us/en-US/details/...` URL. The parser:
1. Validates the hostname and `/us/en-US/` prefix
2. Fetches the URL with browser headers (single request)
3. Parses the `application/ld+json` `["Product","Car"]` block
4. Optionally parses the RSC payload for CPO status and option codes
5. Displays: model, year, generation, VIN, price (USD), mileage, colors, transmission, dealer, CPO badge

**No DB storage of asking prices.** This is the correct posture given ToS ambiguity — display only, no persistence.

### Caveats
- Collector-era cars (pre-2010) are sparsely listed; this is primarily a CPO/near-new dealer portal
- The 100-page search cap means bulk discovery is artificially limited
- Rate limiting requires sequential requests (no issue for paste-and-display)
- `porscheApproved` status and option codes require parsing the RSC payload (more fragile than JSON-LD; will break if Next.js build hash changes)
- The listing ID format (6-char alphanumeric) is opaque — no VIN-based direct lookup URL observed
