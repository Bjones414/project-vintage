# Hagerty Marketplace — Scraper Discovery Report

**Date:** 2026-05-10  
**Investigator:** Claude Code (automated discovery, no data writes, no auth)  
**Recommendation:** CAUTION — ToS contains explicit scraping prohibition; individual listing pages are client-side rendered (SPA); search/results pages are server-rendered and accessible. Legal review required before proceeding.

---

## Summary

Hagerty Marketplace (`hagerty.com/marketplace`) is a live collector car auction and classifieds platform with 183 completed Porsche auctions in its publicly accessible history (dating back to late 2022). The auction results listing page is **server-rendered HTML** and returns Porsche lots with title, sale price, sale date, and listing ID without JavaScript. However, individual listing detail pages (e.g., `/marketplace/auction/[slug]/[uuid]`) return only a navigation/footer shell when fetched statically — the detail content is rendered client-side and requires JavaScript execution (headless browser).

The critical blocker is legal, not technical: Hagerty's main website Terms of Use at `hagerty.com/legal` explicitly prohibits use of a "spider, scraper, or other automated technology to access the Website." This is unambiguous. The Marketplace-specific terms at `hagerty.com/marketplace/terms` do not repeat this language but reference the main website terms. The robots.txt does not block marketplace or auction paths, creating a discrepancy between robots.txt permissiveness and ToS prohibition.

**Bottom-line recommendation: CAUTION / LEGAL REVIEW REQUIRED.** The data is technically reachable (results pages via HTTP, detail pages via headless browser), but the explicit ToS scraping prohibition requires a deliberate go/no-go decision by the product owner before any scraper is built.

---

## ToS Analysis

### Primary Terms — hagerty.com/legal

The main Hagerty website Terms of Use (confirmed live at `https://www.hagerty.com/legal`) contains the following explicit prohibitions in the **"Acceptable Uses"** section:

> *"You agree to follow these Terms, and you promise not to break the law or harm anyone. Additionally, you cannot do any of the following:*
> *...*
> *2. Impose a disproportionate load on the Website or its server infrastructure, whether through a denial-of-service attack or otherwise;*
> *3. Attempt to interfere with the operation of the Website;*
> *4. Circumvent the Website's technological protection or security mechanisms;*
> *5. Use a spider, scraper, or other automated technology to access the Website;*
> *...*
> *Violating any system or network security may result in civil or criminal liability. We will investigate and may involve law enforcement authorities in prosecuting users who are involved in these violations."*

The **"License for Personal Use"** section adds:

> *"You can use our Website and Online Services and the content on them for your personal use only. You cannot use our Website or any content on it to make money unless you have written permission from Hagerty. This license is just for you so you cannot give it to somebody else."*

### Marketplace-Specific Terms — hagerty.com/marketplace/terms

The Marketplace Terms of Use (live at `https://www.hagerty.com/marketplace/terms`) has the following structure: Platform Terms of Use, Listings, Offers/Bidding, Payment, Comments and Moderating, Auction Terms, Governing Law, IP. It does **not** independently repeat the scraping prohibition. However, it contains:

- IP clause: "Hagerty and its affiliates owns or licenses the copyright in all photographs, videos, and descriptions created by or for Hagerty."
- Comments section prohibits: "Is posted for your financial gain (advertising, sponsorship, offering a vehicle for sale outside of a listing, etc.)"
- The document references `hagerty.com/legal` as the governing website Terms of Use, incorporating the prohibition above by reference.

### ToS Verdict

**PROHIBITS** — Item 5 of the Acceptable Uses section ("Use a spider, scraper, or other automated technology to access the Website") is explicit, unambiguous, and applies to `hagerty.com` as a whole including the Marketplace subdirectory. The commercial use restriction ("to make money") adds a second layer.

---

## robots.txt

Fetched from `https://www.hagerty.com/robots.txt` (marketplace.hagerty.com returns ECONNREFUSED — the marketplace is hosted on the main hagerty.com domain).

```
Sitemap: https://www.hagerty.com/sitemaps/sitemap.xml
Sitemap: https://www.hagerty.com/sitemaps/resources-sitemap.xml
Sitemap: https://www.hagerty.com/media/sitemap_index.xml
Sitemap: https://www.hagerty.com/valuation-tools/sitemap.xml
Sitemap: https://www.hagerty.com/drivers-club/sitemap.xml

User-agent: *
Disallow: /Admin/
Disallow: /bberry/
Disallow: /Documents/
Disallow: /DocumentTemp/
Disallow: /Encompass/
Disallow: /eRenewal/
Disallow: /Images2Upload/
Disallow: /LiveSupport/
Disallow: /Pollmanager/
Disallow: /SupApps/
Disallow: /Temp/
Disallow: /PrintApplication.asp
Disallow: /lifestyle/eventdetail.aspx
Disallow: /*.axd$
Disallow: /design/designersReport.aspx
Disallow: /qte/mobile/
Disallow: /qte/quoteinput.aspx?aff=*
Disallow: /*/sitecore/content/
Disallow: /valuationtools/HVT/VehicleSearch/Report
Disallow: /*/CaptchaImage.axd
Disallow: /apps/QuoteMyClassic/
Disallow: /apps/Resources/Chat/
Disallow: /~/media/Images
Disallow: /-/media/Images
Disallow: /~/media/images
Disallow: /-/media/images
Disallow: /apps/manifold
Disallow: /authenticate
Disallow: /sc
Disallow: /articles-videos/-/media/images
Disallow: /articles-videos/~/media/images
Disallow: /articles-videos/-/media/Images
Disallow: /articles-videos/~/media/Images
Disallow: /yourstories
Disallow: /articles-videos/Featured-Classics/
Disallow: /drivers-club/api/auth/signin/identity-server4
Disallow: /pay?*

User-agent: Yandex
Disallow: /
```

**Key observations:**

- `/marketplace/` — **NOT disallowed**
- `/marketplace/search/` — **NOT disallowed**
- `/marketplace/auction/` — **NOT disallowed**
- `/valuationtools/HVT/VehicleSearch/Report` — disallowed (this is the Hagerty Valuation Tool report path, consistent with their competitive product separation)
- No crawl-delay directive
- No marketplace sitemap declared (the main sitemap does not index marketplace listing pages)

**robots.txt verdict: PERMISSIVE for marketplace paths** — creates a direct conflict with the ToS scraping prohibition. robots.txt permissiveness does not override ToS.

---

## Site Architecture

### Correct Base URL

`https://www.hagerty.com/marketplace` (not marketplace.hagerty.com — that subdomain returns ECONNREFUSED)

### URL Patterns

```
# Auction results (completed)
https://www.hagerty.com/marketplace/search?type=auctions&forSale=false

# Auction results filtered by make
https://www.hagerty.com/marketplace/search?type=auctions&forSale=false&make=Porsche

# Auction results filtered by make + start year
https://www.hagerty.com/marketplace/search?type=auctions&forSale=false&make=Porsche&startYear=2023

# Active auctions
https://www.hagerty.com/marketplace/search?type=auctions&forSale=true&make=Porsche

# Pagination
https://www.hagerty.com/marketplace/search?type=auctions&forSale=false&make=Porsche&page=2

# Sort options: Recently ended, Lowest price, Highest price, Lowest mileage

# Individual listing
https://www.hagerty.com/marketplace/auction/{year}-{make}-{model}/{uuid}
Example: https://www.hagerty.com/marketplace/auction/1972-Porsche-911T-Targa/824f4de7-a358-4115-a5fc-3b0f7b101493
```

Note: listing UUIDs appear in two formats — standard UUID-v4 (hyphenated) and base62-style alphanumeric strings (e.g., `6peVdjTLMVAHfV1sNwbajZ`). Both formats appear in active use.

### Rendering Architecture

| Page Type | Rendering | Content Available via HTTP? |
|---|---|---|
| Search/results pages (`/marketplace/search?...`) | Server-rendered HTML | Yes — title, price, date, listing ID in HTML |
| Individual listing pages (`/marketplace/auction/...`) | Client-side SPA | No — only nav/footer shell returned |
| Homepage (`/marketplace`) | Server-rendered HTML | Yes — counts, navigation |

**Search/results pages** return complete listing cards with: title, sold price or high bid, sale date, listing UUID, and image CDN URL — all in static HTML. No `__NEXT_DATA__` or embedded JSON payload observed. No API endpoint or GraphQL URL surfaced in the HTML.

**Individual listing pages** return only the site navigation and footer shell when fetched without JavaScript execution. The full listing detail (mileage, VIN, color, transmission, bid history) requires a headless browser. This is consistent with a React SPA that hydrates after initial HTML delivery.

**Framework:** Not conclusively identified from static fetch. The site likely uses a mix — server-rendered pages for SEO-critical listing indexes and a client-side SPA for individual listing detail. No Next.js `_next/data/` paths or `__NEXT_DATA__` payloads found.

**CDN:** Images served from `hagerty-marketplace-prod.imgix.net`.

**No public API or GraphQL endpoint identified.** No API URLs found in script tags or data attributes on any fetched page.

### Query Parameters

| Parameter | Values | Notes |
|---|---|---|
| `type` | `auctions`, `classifieds` | Required to distinguish auction vs. classified |
| `forSale` | `true`, `false` | `false` = completed/ended, `true` = active |
| `make` | e.g., `Porsche` | Make filter |
| `startYear` | e.g., `2023` | Year range filter (start) |
| `endYear` | e.g., `2026` | Year range filter (end) |
| `page` | integer | Pagination |

---

## Data Shape

### What is accessible from search/results pages (server-rendered, HTTP-only)

Each listing card on the results page contains:

| Field | Availability | Example |
|---|---|---|
| Title / name | Present in HTML `<h4>` | "Three-Decades-Family-Owned 1972 Porsche 911T Targa" |
| Year | Parseable from title | 1972 |
| Make | Parseable from title | Porsche |
| Model | Parseable from title | 911T Targa |
| Sold price (USD) | Present as text, e.g., "Sold for $72,760" | $72,760 |
| High bid / no-sale amount | Present as text, e.g., "Bid to $135,000" | $135,000 |
| Sale date | Present as text, e.g., "on 04/28/26" | 04/28/26 |
| Listing UUID | Present in `<a href>` | `824f4de7-a358-4115-a5fc-3b0f7b101493` |
| Sold vs. no-sale status | Distinguishable from "Sold for" vs. "Bid to" prefix | Yes |
| Thumbnail image URL | Present as `<img src>` on imgix CDN | Yes |

**Not available from results pages (requires individual listing fetch):**

| Field | Notes |
|---|---|
| Mileage | Detail page only |
| VIN / chassis number | Detail page only |
| Exterior color | Detail page only |
| Transmission | Detail page only |
| Bid count | Detail page only |
| Lot number | Detail page only |
| Interior color | Detail page only |
| Engine | Detail page only |
| Reserve met / no reserve | Detail page only |
| Full description / seller notes | Detail page only |
| Full image gallery | Detail page only |

### Sample Listings (from results pages, all USD)

| Title | Price | Date | Status |
|---|---|---|---|
| Outlaw-Style 1957 Porsche 356A Sunroof Coupe | $190,460 | 05/05/26 | Sold |
| 1959 Porsche 356A Cabriolet | $189,390 | 05/04/26 | Sold |
| 1965 Porsche 911 Coupe | $130,000 | 04/30/26 | No-sale (bid) |
| 1972 Porsche 911T Targa | $72,760 | 04/28/26 | Sold |
| 1973 Porsche 911T RSR-Style | $301,740 | 12/11/25 | Sold |
| 1990 Porsche 911 Carrera 2 | $135,000 | 11/03/25 | No-sale (bid) |
| 1972 Porsche 911T | $42,179 | 12/12/25 | Sold |

---

## Volume Estimate

**Total Porsche auction results (all time, as of 2026-05-10): 183**

- 6 pages of results, ~30 listings per page
- Date range: November 2022 (earliest observed) through May 2026 (present)
- This represents approximately 3.5 years of history
- Run rate: ~52 Porsche lots/year (183 ÷ 3.5 years)

**Active Porsche auctions (live as of 2026-05-10): 4**

Run rate comparison: BaT completes hundreds of Porsche lots per year. Hagerty Marketplace volume is approximately 10-15x lower for Porsche-specific inventory.

**All-makes completed auction total: 4,622** across 141 pages (as of 2026-05-10).

**Year filter note:** The `startYear` parameter did not appear to reduce the 183 result count when `startYear=2023` was applied — the filter may not work precisely, or the displayed count still shows all-time totals. The data does span back to late 2022 regardless.

---

## Currency

**USD confirmed.** All prices observed in discovery are denominated in US dollars:
- "Sold for $190,460"
- "Bid to $135,000"
- "Sold for $72,760"

No multi-currency or non-USD listings observed. Hagerty Marketplace appears to be a US-only platform.

---

## Competitor Flag

**CLAUDE.md lists "Hagerty Valuation Tools" as a competitor — not Hagerty Marketplace.**

This distinction matters and requires a deliberate product decision:

**Hagerty Valuation Tools** (`hagerty.com/valuation-tools`) is a subscription-based vehicle pricing database that competes directly with Project Vintage's valuation pillar. It is correctly listed as a competitor in CLAUDE.md.

**Hagerty Marketplace** (`hagerty.com/marketplace`) is an auction and classifieds platform where real vehicles are bought and sold. It is more analogous to Bring a Trailer or Cars & Bids than to Hagerty's own valuation product. The marketplace generates actual transaction records (hammer prices, dates, vehicle specs) — exactly the data type Project Vintage ingests from BaT and C&B.

However, Hagerty is a single legal entity. The robots.txt disallows `/valuationtools/HVT/VehicleSearch/Report` while leaving marketplace paths open, suggesting Hagerty itself distinguishes the two products technically. But the Terms of Use at `hagerty.com/legal` cover the entire `hagerty.com` domain including the marketplace.

**Recommendation for product owner:** Treat the competitive flag as a ToS/legal question, not a technical one. The question is: does scraping Hagerty Marketplace's auction results data create a conflict with a company whose valuation tool competes with Project Vintage? Possible positions:

1. **Proceed with legal counsel review** — the marketplace data is public transaction data, not Hagerty's proprietary valuation methodology. Many auction data aggregators treat public hammer prices as factual records not subject to IP claims (the "facts are not copyrightable" doctrine, per *Feist*). The ToS prohibition is a contractual claim, not a copyright one.
2. **Skip Hagerty Marketplace** — with 183 Porsche lots over 3.5 years (~52/year), the data volume is modest compared to BaT. The legal exposure may not be worth the marginal data gain, especially given the explicit ToS prohibition.
3. **Deprioritize and revisit** — add Hagerty Marketplace to a backlog; address after BaT, C&B, and PCarMarket are live and the platform has legal infrastructure in place.

This decision is flagged for **human review** — it is not a technical call.

---

## Raw Notes

### Discovery sequence
1. `marketplace.hagerty.com` — ECONNREFUSED. Marketplace is at `hagerty.com/marketplace`.
2. `hagerty.com/robots.txt` — fetched successfully. No marketplace paths blocked.
3. `hagerty.com/marketplace` — server-rendered HTML, 200 OK. Title: "Classic Cars Auctions / Classifieds | Hagerty Marketplace". ~958+ active listings.
4. `hagerty.com/marketplace/search?type=auctions&forSale=false` — 4,622 completed auctions across all makes, 141 pages, server-rendered.
5. `hagerty.com/marketplace/search?type=auctions&forSale=false&make=Porsche` — 183 Porsche lots, 6 pages, server-rendered. Prices and dates in static HTML.
6. Individual listing pages (3 tested) — all returned nav/footer shell only. Content is client-side rendered (SPA).
7. `hagerty.com/legal` — ToS found. Explicit scraping prohibition in "Acceptable Uses" item 5.
8. `hagerty.com/marketplace/terms` — Marketplace-specific ToS found. No independent scraping prohibition, but references `hagerty.com/legal`.
9. Sitemap — no marketplace listing pages indexed in `sitemaps/sitemap.xml`.
10. No public API or GraphQL endpoint found in any fetched page.

### Technical path if proceeding (for reference only — do not build without legal clearance)

- **Results pages:** HTTP-only scraping works. Use browser headers (see `lib/listing-parser/bring-a-trailer.ts` for the pattern). Paginate through `/marketplace/search?type=auctions&forSale=false&make=Porsche&page=N`. Each page yields ~30 listings with title, price, date, status, UUID.
- **Detail pages:** Require headless browser (Playwright or Puppeteer). The detail content (mileage, VIN, color, transmission, bid count) does not appear in static HTML.
- **Rate limiting:** No crawl-delay observed in robots.txt. Conservative posture: 2–5 second delay between requests, headless browser for details.
- **No API found:** Unlike BaT (JSON-LD) or C&B (REST API), Hagerty Marketplace has no discovered public API. Data extraction relies on HTML parsing.
- **Identifier format:** Listing UUIDs in two formats — standard UUID-v4 and base62 alphanumeric. Both appear in production URLs.
