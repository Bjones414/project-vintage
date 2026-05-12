# Gooding & Company — On-Demand Parser Discovery Report
Date: 2026-05-10

## Recommendation

**CAUTION** — Gooding & Company's Terms of Service contain explicit, broad prohibitions on all automated access and data extraction — both commercial and non-commercial ("or otherwise"). The site is built on Gatsby SSG and every lot page ships a companion `page-data.json` that contains a fully structured JSON payload (lot number, estimates, sale price, chassis/VIN, make, model, year, auction name, sale date) — meaning extraction would be trivially easy with no Playwright or JS rendering required. The technical path is wide open (robots.txt allows all crawlers, HTTP 200s with no bot-wall, ~14 KB JSON per lot). The legal path is closed by ToS. Before integrating Gooding as a data source, consult counsel on whether paste-and-go single-URL analysis falls within the "evaluation and investigation of Gooding auction events" carve-out, and whether a data-licensing or partnership arrangement is worth pursuing. Gooding is high-prestige and covers ~994 Porsche lots across 9,282 total lots in the sitemap — a material dataset for collector car comps.

---

## 1. Terms of Service

Source: https://www.goodingco.com/terms

The ToS contains the following verbatim prohibitions in its **Prohibited Uses** section:

> "Reproduce, duplicate, copy, sell, trade, resell, distribute or exploit, any part of the Site or any Site Content, for any purpose other than for your own internal purposes relating to the evaluation and investigation of Gooding auction events and the items for sale at such events;"

> "Access or use the Site for any comparative or competitive research purposes;"

> "Use any manual or automated means to access the site, or to extract and/or compile content from the Site for any commercial purpose or otherwise;"

The copyright section separately states:

> "Gooding Christie's shall own the copyright in all photographs, videos, illustrations and written descriptions of the Lots created by or for Gooding Christie's."

**Analysis of relevant clauses:**

- **Automated access/bots/scrapers/crawlers:** Explicitly prohibited. The clause covers "any manual or automated means" to access or extract content — this is unusually broad and covers even manual copy-paste at scale.
- **Data extraction / screen scraping:** Explicitly prohibited for "any commercial purpose or otherwise." The "or otherwise" clause removes the commercial-only safe harbor that sometimes exists in other ToS.
- **Personal vs. commercial use:** The only permitted use is "your own internal purposes relating to the evaluation and investigation of Gooding auction events." This is narrowly scoped to a buyer researching a specific lot — not building a comp database.
- **Competitive/comparative research:** Explicitly prohibited as its own clause. A comp engine that uses Gooding data to price collector cars would almost certainly qualify.
- **robots.txt referenced in ToS:** No. The ToS does not reference robots.txt or crawl restrictions technically.

---

## 2. robots.txt

Source: https://www.goodingco.com/robots.txt (HTTP 200, 102 bytes)

```
User-agent: *
Allow: /
Sitemap: https://www.goodingco.com/sitemap.xml
Host: https://www.goodingco.com
```

**Findings:**
- No Disallow rules whatsoever.
- No crawl-delay directives.
- No user-agent-specific blocks.
- `/vehicle/` paths: Not blocked (and not used — actual path is `/lot/`).
- `/lot/` paths: Not blocked.
- The sitemap is publicly declared at `/sitemap.xml` and contains 9,282 lot URLs.

The robots.txt creates no technical barrier. All legal restrictions come from the ToS only.

---

## 3. HTTP Fetch Test

**URL tested:** https://www.goodingco.com/lot/2009-porsche-997-gt2/  
**Status code:** 200  
**Response size:** 571,446 bytes (~558 KB)  
**Response type:** Full HTML — Gatsby SSG pre-rendered page with embedded JS bundles  
**First 200 chars of response body:**

```
<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="ie=edge"/><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/><style data-href="/styles.39be15eb05f52f4
```

**Key finding — Gatsby page-data.json endpoint:**  
The site is built with Gatsby SSG. Every lot page has a companion JSON endpoint at:
```
https://www.goodingco.com/page-data/lot/[slug]/page-data.json
```
This endpoint returns ~14 KB of fully structured JSON containing all lot data. HTTP 200, no auth, no bot-wall. This is far more parseable than the HTML itself.

Example tested: https://www.goodingco.com/page-data/lot/2009-porsche-997-gt2/page-data.json (HTTP 200, 14,317 bytes)

---

## 4. Field Availability

All fields below are available from the `page-data.json` endpoint — no JavaScript execution, no Playwright, no HTML parsing required. The JSON is delivered as a Gatsby static asset.

| Field | Available | Selector/Pattern | Sample Value |
|-------|-----------|-----------------|--------------|
| year | YES | `result.data.contentfulLot.item.modelYear` | `2009` |
| make | YES | `result.data.contentfulLot.item.make.name` | `"Porsche"` |
| model | YES | `result.data.contentfulLot.item.model` | `"997 GT2"` |
| title (full) | YES | `result.data.contentfulLot.item.title` | `"2009 Porsche 997 GT2"` |
| mileage | PARTIAL | `result.data.contentfulLot.item.highlights[]` — mileage in text | `"Showed Approximately 17,800 Miles when Catalogued"` (regex extract) |
| hammer/sale price | YES | `result.data.contentfulLot.salePrice` | `368000` (USD integer) |
| low estimate | YES | `result.data.contentfulLot.lowEstimate` | `400000` |
| high estimate | YES | `result.data.contentfulLot.highEstimate` | `500000` |
| lot number | YES | `result.data.contentfulLot.lotNumber` | `113` |
| auction name | YES | `result.data.contentfulLot.auction.name` | `"Amelia Island Auctions"` |
| sale date | YES | `result.data.contentfulLot.auction.subEvents[].startDate` (auction type) | `"2026-03-05T15:00-05:00"` |
| has reserve | YES | `result.data.contentfulLot.hasReservePrice` | `true` |
| VIN / chassis | YES | `result.data.contentfulLot.item.chassis` | `"WP0AD29939S778090"` |
| exterior color | PARTIAL | `result.data.contentfulLot.item.highlights[]` — color in text | `"Finished in Elegant Black over Black Color Combination"` |
| interior color | PARTIAL | `result.data.contentfulLot.item.highlights[]` — interior in text | `"Tarpan Brown and Houndstooth Interior"` |
| specifications | YES | `result.data.contentfulLot.item.specifications[]` | `["3,600 CC DOHC Flat 6-Cylinder Engine", "6-Speed Manual Transaxle", ...]` |
| images | YES | `result.data.contentfulLot.item.cloudinaryImagesCombined[]` | Cloudinary public_id + dimensions |
| slug (for URL) | YES | `result.data.contentfulLot.slug` | `"2009-porsche-997-gt2"` |
| archived/sold | YES | `result.pageContext.isArchived` | `true` |
| prev/next lot slug | YES | `result.pageContext.prev` / `result.pageContext.next` | `"1956-talbot-lago-t14ls-sport-coupe"` |

**JSON-LD structured data:** None found. The page uses Gatsby's React Helmet for OG meta tags but no `<script type="application/ld+json">` blocks.

**OG meta tags (static HTML, no JS required):**
- `og:title`: `" 2009 Porsche 997 GT2"` — year + make + model in title
- `og:description`: auction context and basic lot info
- `og:image`: Cloudinary image URL

---

## 5. SPA / JS Dependency

The site is built with **Gatsby** (confirmed: `gatsby-global-css` CSS attribute, `___gatsby` div, `gatsby-chunk` JS references, `window.___chunkMapping` bundle manifest).

**For the lot detail page:**
- The raw HTML shell delivered at `/lot/[slug]/` contains minimal visible content — navigation, CSS, and JS bundle references.
- **However**, the Gatsby `page-data.json` endpoint at `/page-data/lot/[slug]/page-data.json` delivers all structured lot data as a static JSON file, generated at build time.
- This endpoint requires no JavaScript execution, no headless browser, and no session/cookie state.
- Gatsby generates these JSON files during its static build process (triggered from Contentful CMS), so they are available as durable server-side assets.

**Conclusion:** The lot HTML page itself is effectively an SPA shell. But the companion `page-data.json` file bypasses that entirely — it is a plain JSON endpoint accessible with a single `fetch()` call. This is the correct integration target.

**Parser strategy:** Given a user-pasted URL like `https://www.goodingco.com/lot/2009-porsche-997-gt2/`, extract the slug (`2009-porsche-997-gt2`), construct `https://www.goodingco.com/page-data/lot/2009-porsche-997-gt2/page-data.json`, and parse the JSON. Zero rendering dependency.

---

## 6. Volume Estimate

**Sitemap-derived data (as of 2026-05-10):**
- Total lot URLs in sitemap: **9,282** (all makes, all years)
- Porsche lot URLs (slug contains "porsche"): **994**
- Additional Porsche-adjacent slugs (RUF, 356, 911, 928 without "porsche" in slug): likely adds ~100–200 more

**Auction schedule (observed from site):**
- Gooding typically runs 4–5 live auctions per year: Amelia Island, Scottsdale, Pebble Beach, Rétromobile Paris, Rétromobile New York, plus periodic Geared Online auctions
- Lot count per event: 60–200 lots (Pebble Beach is largest at ~130–200 lots; Scottsdale is ~80–120)
- Porsche representation: approximately 15–20% of lots per event (consistent with the premium sports car focus)

**Estimated annual Porsche volume:**
- ~5 live auctions × ~100 total lots × 17% Porsche rate ≈ **85–100 Porsche lots/year**
- This is smaller than Bring a Trailer or Cars & Bids but represents the highest-value segment: consignment-auction Porsches at Gooding average significantly higher hammer prices than online platforms

**Historical depth:** 994 Porsche lots in sitemap across the company's full history (founded 2004) — approximately 22 years of data at ~45 lots/year average, consistent with the modern higher throughput rate above.

---

## Raw Notes

1. **Contentful CMS backend:** The page-data.json structure reveals Gooding uses Contentful as their CMS (`contentfulLot`, `contentfulVehicle`, `contentfulSubEvent` types). The `contentful_id` fields are also present, though not needed for parsing.

2. **Currency field:** `result.data.contentfulLot.auction.currency` = `"USD"` — useful for Rétromobile Paris lots which may be EUR.

3. **Sitemap completeness:** The sitemap is declared in robots.txt and appears comprehensive. All 9,282 lots are accessible via direct URL. The sitemap can be used to enumerate all Porsche lots without any search/browse interaction.

4. **Slug uniqueness:** Some slugs include a suffix like `-fl26` or `-1a`, `-1b`, `-1c` to disambiguate duplicate year/make/model combinations. The slug is the stable identifier for a lot.

5. **No-sale detection:** `salePrice` is an integer when sold, and presumably `null` when not sold (reserve not met). The `hasReservePrice` boolean and `salePrice` together indicate sold vs. passed status.

6. **Mileage parsing:** Mileage is embedded in natural-language highlights text, not a structured field. Regex pattern: `(\d[\d,]+)\s+[Mm]iles` against the highlights array is sufficient to extract the odometer reading in most cases.

7. **Color parsing:** Exterior and interior colors appear in highlights text. They are not structured fields. A regex or NLP extraction pass is needed. The `og:description` also sometimes contains color context.

8. **Bot-wall status:** No CAPTCHA, no Cloudflare challenge, no rate-limit headers observed in testing. Three separate lot fetches all returned HTTP 200 with full content. The absence of any technical protection should not be read as implicit permission — the ToS is explicit.

9. **Partnership angle:** Gooding is now "Gooding Christie's" following a Christie's partnership (2024). Christie's is an established institutional player that likely has formal data licensing programs. A data partnership inquiry to Gooding/Christie's may be worth exploring given the prestige alignment with Project Vintage's collector audience.

10. **Comparison to other sources:**
    - BaT: higher volume (~500+ Porsche/year), more democratized, good for market pricing
    - Cars & Bids: modern Porsche focus, online-only, good for 986/987/996/997 era
    - Gooding: lower volume but highest average hammer price, covers rare/valuable cars, best for establishing ceiling prices and blue-chip comparables
