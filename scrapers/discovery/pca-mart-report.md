# PCA Mart — Discovery Report
**Date:** 2026-05-10
**Investigator:** Claude Code (automated discovery)
**Status:** CAUTION

## Canonical URL
https://mart.pca.org/

Individual listings follow the pattern: `https://mart.pca.org/ads/{id}` (e.g., https://mart.pca.org/ads/81990)

Paths tested that 404'd: `https://www.pca.org/marketplace`, `https://www.pca.org/mart`
Path that 302'd to pca.org homepage: `https://mart.pca.org/classifieds`, `https://mart.pca.org/ad/cars-for-sale`

## ToS Verdict: PROHIBITS (content redistribution) / SILENT (scraping specifically)

### PCA Terms of Service — https://www.pca.org/terms-of-service

Relevant clauses (verbatim):

> "You may not modify, copy, reproduce, republish, upload, post, transmit or distribute in any way any material from the Service"

> "If you are a member of the Porsche Club of America, Inc., chartered Region, Zone, or Register, you may download material from the Service for your personal, non-commercial use only, provided you keep intact all copyright and other proprietary notices."

**Assessment:** The ToS broadly prohibits redistribution of any material from the service. The commercial-use restriction is explicit. There is no specific mention of automated access, bots, or scraping — but the blanket "may not copy, reproduce, or distribute in any way" language clearly covers systematic data extraction for commercial aggregation. A scraper that captures listing data (price, description, photos, VIN) and feeds it into Project Vintage's database would violate the "non-commercial use only" carve-out and the broader no-distribution clause.

### PCA Mart Rules — https://mart.pca.org/rules

Key provisions:
- Non-members can view listings but "can't post ads, but they can view them sans seller contact information"
- "PCA reserves the right to delete or unpublish an ad at any time without notifying the member"
- "Dealers may not use the PCA Mart/classifieds for business purposes"
- "Members cannot post ads on behalf of friends, family members, or others"
- Ads expire/must be refreshed every 30 days to remain published
- Sold listings remain in search results for up to 60 days

The Mart Rules do not explicitly address automated scraping, but the anti-commercial-dealer stance and the ToS redistribution prohibition together create a clear CAUTION posture.

### Privacy Policy — https://www.pca.org/privacy-policy
No scraping or automated access provisions found. Standard GDPR/CCPA data handling policy.

## robots.txt
**File location:** https://mart.pca.org/robots.txt

Relevant rules:
```
User-agent: gsa-crawler-www
Crawl-delay: 100

User-agent: Googlebot
Crawl-delay: 100

User-agent: DuckDuckBot
Crawl-delay: 100

User-agent: BingBot
Crawl-delay: 100

User-agent: FacebookExternalHit
Crawl-delay: 100

Disallow: /layouts/
Disallow: /handlers/
Disallow: /includes/javascript/
Disallow: /includes/styles/
Disallow: /models/
Disallow: /scripts/
Disallow: /views/
```

**Assessment:** No `User-agent: *` block. No Disallow on `/ads/` or any classifieds path. The 100-second crawl delay is applied only to named major crawlers (Googlebot, Bing, DuckDuck, Facebook, GSA). A custom User-Agent scraper is technically not named in robots.txt. However, the crawl delay signal (100 seconds between requests) indicates strong preference for low-frequency access. The `/ads/` path is not disallowed, which means individual listing pages are technically crawlable by robots.txt convention — but this does not override the ToS.

**Note:** There is no `User-agent: *` wildcard block at all, which means robots.txt is technically silent on general automated access. But the ToS redistribution clause takes precedence.

## Site Architecture
- **Static HTML vs SPA:** SPA. The index page at mart.pca.org renders a filter UI shell (~35-45 KB) but listings are loaded via JavaScript. No rendered listing cards appear in the raw HTML of the index. Individual listing pages (`/ads/{id}`) ARE server-rendered with full data in the HTML — confirmed by successful data extraction without JS execution.
- **Auth requirement:** Partial. Listings are publicly viewable (year, model, mileage, price, color, transmission, VIN, photos, description). Seller contact information (phone, email) is gated behind PCA membership login with the message: "YOU MUST BE A MEMBER OF PCA TO CONTACT SELLER." The paste-and-go analysis use case (valuation from a listing URL) does not require auth — the core data is public.
- **Pagination:** Unknown from index page alone (SPA loads results dynamically, no page parameters visible in static HTML). Individual listing IDs appear to be sequential integers. No API endpoint found — `mart.pca.org/api/ads` 302s to pca.org homepage.
- **Headers tested:** Standard browser headers implied by WebFetch (Chrome-like User-Agent)
- **Status code:** 200 for mart.pca.org index and individual `/ads/{id}` pages; 302 redirect to pca.org for unknown paths; 404 for pca.org/marketplace and pca.org/mart
- **Response size:** ~35-45 KB for index page

## Single Listing Test
- **URL tested:** https://mart.pca.org/ads/81990 (1997 Porsche 911 993 Targa, active as of 2026-05-04)
- **Status:** 200 (active listing, accessible without login)
- **Content type:** text/html (server-rendered, full listing data in HTML)
- **Price data available:** Asking price only — displayed as a dollar figure (e.g., "$94,500"). No confirmed sale price. No "sold" label on active listings. Sold/expired listings display "This ad is not available or the item may have been sold" with no price or other data preserved. **This is a critical limitation: there is no sold-price data available on PCA Mart. It is purely an active-listings classifieds platform, not an auction results archive.**
- **VIN:** Present — full 17-character VIN confirmed on two tested listings (ads/81742: WP0AA29988S710357; ads/81990: WP0DA2995VS385224)

## Data Shape

| Field | Present | Notes |
|-------|---------|-------|
| year | yes | In listing title and structured field |
| model | yes | e.g., "911 Targa", "Boxster", "Carrera GTS" |
| generation | yes | Labeled (e.g., "Generation 993", "Generation 992") |
| mileage | yes | Exact miles shown |
| asking_price | yes | Dollar amount, no price history or final sale price |
| exterior_color | yes | Porsche official color name when seller provides it (e.g., "Zenith Blue Metallic") |
| transmission | yes | Manual, PDK, Tiptronic, Sportomatic — as structured field |
| VIN | yes | Full 17-character VIN present on tested listings; not mandatory (one listing had no VIN) |
| sale_outcome | no | Sold listings show generic "not available" page — no price or outcome data |
| interior_color | yes | Shown as structured field |
| body_style | yes | Coupe, Targa, Cabriolet, etc. |
| photos | yes | Hosted on mediaassets.pca.org; 4–20 photos per listing observed |
| seller_contact | partial | Gated behind PCA membership; not accessible without login |
| option_codes | no | Not present as structured fields; may appear in free-text description |
| publish_date | yes | Date listed shown on active listings |
| ad_number | yes | Sequential integer ID (e.g., Ad# 81742) |
| financing_estimate | yes | Woodside Credit monthly estimate shown as a widget |

## Volume Estimate
- **Active listings (all categories):** ~200–500 estimated. The SPA index does not expose a count. Based on ad ID sampling: IDs in the 79,000–82,100 range are a mix of active and expired. At any given time, a sampling of IDs in this 3,000-ID range found roughly 30-40% active. With 4 ad categories (Cars, Parts, Wanted, Misc), cars-only volume is a fraction.
- **Cars-for-sale specifically:** ~100–300 active Porsche car listings estimated based on search-indexed results and ID density. A Google site-search of mart.pca.org/ads/ returned only ~10 results, suggesting low search-engine indexing. Observed active car IDs include: 82100 (2025 911 Carrera, $159,999), 82000 (1999 Boxster, $10,000), 81990 (1997 993 Targa, $94,500), 81742 (2008 997 Carrera, $39,500), 81435 (2022 718 Spyder), 80694 (2026 992 GTS, $225,000).
- **Archived/sold listings:** Unknown volume. Sold listings are retained in search index for up to 60 days per Mart Rules, then removed. No permanent sold-listing archive appears to exist. The "This ad is not available or the item may have been sold" page contains zero data.
- **Porsche-specific count:** 100% Porsche — PCA Mart only lists Porsche cars, parts, and accessories by rule.
- **Comparison to BaT volume:** BaT closes approximately 25,000–30,000 Porsche auctions per year (a well-established, high-volume auction result archive). PCA Mart likely has 100–300 active car listings at any moment, with no historical sale price archive. This is a fundamentally different data category: **classified asking prices, not confirmed auction results.** For comp-engine purposes, PCA Mart asking prices represent current market demand signals, not verified transaction prices.

## Key Risks / Notes
- **No sold-price data.** This is the most critical limitation. PCA Mart is classified ads — sellers set asking prices. Final transaction prices are negotiated privately and never disclosed on the platform. The platform cannot serve as an auction-results source for the comp engine. It can only provide current asking price context.
- **ToS redistribution clause is broad.** "You may not... distribute in any way any material from the Service" applies to listing content. Commercial aggregation of listing data almost certainly violates this, even though scraping is not explicitly named.
- **SPA index makes bulk discovery hard.** The listing index requires JavaScript execution to render results. Individual listing pages (`/ads/{id}`) are server-rendered and parseable. A sequential ID scraper would work technically but would be slow and would encounter many expired/sold stubs.
- **Seller contact is gated.** Phone and email are not available without a PCA membership login. This limits the usefulness of listings for anything requiring seller outreach.
- **No option codes.** Structured Porsche option codes (e.g., M030, X51) are not present as fields — sellers may mention them in free-text descriptions inconsistently.
- **Low volume relative to BaT.** Even optimistically, PCA Mart has orders of magnitude fewer listings than BaT/Cars&Bids. As a data source for trend analysis or comp engine calibration, it is too thin.
- **60-day sold window only.** Even if sold listings were accessible (they are not), they only persist for 60 days. No historical archive exists.
- **Membership barrier for contact data.** Paste-and-go analysis of a PCA Mart URL works for vehicle data (price, specs), but any feature requiring seller contact requires PCA membership.
- **No public API.** The mart.pca.org/api path redirects to pca.org. All data extraction requires HTML parsing of individual listing pages.

## Recommendation
**ABORT (as a comp-engine data source) / CAUTION (as a paste-and-go parse target)**

PCA Mart has no historical sale price data — only current asking prices — making it useless as an auction results source for the comp engine. The ToS broadly prohibits redistribution of content, creating legal exposure for commercial aggregation. Volume is low (estimated 100–300 active car listings) compared to BaT's tens of thousands of completed Porsche auctions.

The only viable V1 use case is **paste-and-go parsing of a user-submitted PCA Mart URL**: a user pastes `mart.pca.org/ads/81990` and Project Vintage parses the listing page to populate the analysis form (year, model, mileage, asking price, color, transmission). This is analogous to how BaT URLs are parsed — single-listing fetch, not bulk scraping. In this narrow use case the ToS risk is lower (one-off fetch per user action, not systematic crawling), and it provides genuine user value. However, the listing data produces an **asking price analysis, not a comparable sales analysis** — this distinction must be communicated clearly in the UI.

Do not build a PCA Mart bulk scraper or index pipeline. Do not attempt to aggregate historical listing data. Do not use PCA Mart as a pricing data source for the comp engine.
