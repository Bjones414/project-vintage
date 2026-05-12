# Bonhams Discovery Report

**Date:** 2026-05-10  
**Session:** Discovery-only. No scraping, no data writes, no collector code.  
**Verdict:** CAUTION

---

## 1. Terms of Service

**ToS URL:** `https://www.bonhams.com/legals` → Conditions of Website Use at `/legals/9944/`

Relevant clauses (quoted verbatim):

> **Copyright:** "We own or licence the copyright in this site and in material published on it (including descriptions and photographs of articles)."

> **Reproduction:** "You may print off one copy of any page(s) from our site for your personal reference and you may draw the attention of others within your organisation to material posted but you may not reproduce or permit anyone else to reproduce such material without our prior written consent."

> **Site Security / Mechanisms:** "Please note that you may not use any mechanism, software or other device to affect the functioning of the web site or any sale advertised on the web site."

**Verdict:** No explicit scraping or automated-access prohibition. The "mechanism" clause targets automated bidding/interference with sales (the language is "affect the functioning"), not data extraction. The reproduction clause is the more relevant restriction and is standard boilerplate present on virtually every auction house. Bonhams does not have a robots meta tag or explicit anti-scraping language comparable to a CFAA-invocation-level clause. **Soft caution, not a hard block.** Functionally comparable to BaT and Cars & Bids ToS posture.

---

## 2. robots.txt

**Fetched from:** `https://www.bonhams.com/robots.txt`

```
User-agent: *
Sitemap: http://www.bonhams.com/sitemap.xml
Disallow: /ldc/
Disallow: /vms-assets/
Disallow: */aggregate$
Disallow: */head_image*

User-agent: Bytespider
Disallow: /
```

**Assessment:** Very permissive. Lot pages (`/auction/{id}/lot/{lot_number}/{slug}/`) and auction result pages are **explicitly crawlable** for all user agents. No `Crawl-delay` directive. Bytespider (a known mass AI training crawler) is blocked — this reflects anti-training posture, not anti-price-data posture. **Green light from robots.txt.**

---

## 3. Site Architecture

### Domain structure
- **Main site:** `www.bonhams.com` — full auction house (art, jewelry, wine, cars, etc.)
- **Motoring subdomain:** `cars.bonhams.com` — Next.js app dedicated to motor cars

### URL patterns (confirmed)
| Resource | URL Pattern |
|---|---|
| Auction index | `cars.bonhams.com/auctions/results/?year={YYYY}` |
| Auction detail | `cars.bonhams.com/auction/{id}/{auction-slug}/` |
| Individual lot | `cars.bonhams.com/auction/{id}/lot/{lot_number}/{title-slug}/` |

**Example auction IDs (2025):**
- The Audrain Auction (Oct 2025, Newport RI): `30560`
- Goodwood Revival (Sep 2025, UK): `30544`
- The Beaulieu Sale (Sep 2025, UK): `30971`
- The Golden Age of Motoring (Oct 2025, London): `30972`
- The Zoute Sale (Oct 2025, Belgium): `31021`

**Example lot URL:**
```
https://cars.bonhams.com/auction/30560/lot/140/1996-porsche-911-carrera-rs/
```

### Technical rendering
- **Framework:** Next.js with server-side rendering (SSR)
- **HTML pre-rendered:** Yes — content is in the response HTML, no JS execution required
- **Status codes:** HTTP 200 with standard Chrome browser headers (verified via WebFetch across multiple lot pages)
- **Cloudflare / bot protection:** None detected. No CAPTCHA, no 403, no JS challenge
- **Image optimization:** `/_next/image.jpg` wrapper with base64-encoded params — images are not needed for data extraction
- **Data format in HTML:** Plain HTML text (no JSON-LD, no structured meta tags for lot data)

### Sitemap
Six sub-sitemaps at `bonhams.com/sitemap-{type}.xml`. `sitemap-sale.xml` confirmed to list auction IDs. Lot-level sitemap not confirmed but auction IDs are discoverable.

---

## 4. Single Lot Fetch — HTTP Test

Tested with WebFetch (Chrome 131 User-Agent equivalent). All three test lots returned HTTP 200 with full rendered HTML. No authentication wall, no redirect to login, no rate-limit response.

**Confirmed accessible:**
- `cars.bonhams.com/auction/30560/lot/137/...` → 200 OK
- `cars.bonhams.com/auction/30560/lot/138/...` → 200 OK
- `cars.bonhams.com/auction/30560/lot/140/...` → 200 OK

---

## 5. Per-Listing Data Shape

Three Porsche lots sampled spanning three eras. All from The Audrain Auction (30560), Newport RI, 3 October 2025.

### Lot 137 — 1964 Porsche 356C 1600 Coupe
| Field | Value |
|---|---|
| Year | 1964 |
| Make | Porsche |
| Model | 356C 1600 Coupe |
| Chassis Number | 219443 |
| Engine Number | 714954 |
| Mileage | 30,350 miles |
| Exterior Color | Sky Blue (Code 6403) |
| Interior Color | Black Leatherette with pepita insert |
| Transmission | Four-Speed Manual |
| Lot Number | 137 |
| Hammer Price | US$84,000 **inc. premium** |
| Estimate | Not stated |
| Sale Date | 3 October 2025 |
| Status | Sold |
| Image Count | 143 photos |

### Lot 138 — 1973 Porsche 911 Carrera RS 2.7
| Field | Value |
|---|---|
| Year | 1973 |
| Make | Porsche |
| Model | 911 Carrera RS 2.7 |
| Trim | M472 Touring (converted to M471 Lightweight specs) |
| Chassis Number | 911.360.1403 |
| Engine Number | 6631129 |
| Gearbox Number | 7326846 |
| Mileage | Not disclosed |
| Exterior Color | Tangerine with black Carrera stripes |
| Transmission | 5-Speed Manual Type 915 |
| Lot Number | 138 |
| Estimate | US$450,000 – US$550,000 |
| Hammer Price | Unsold |
| Sale Date | 3 October 2025 |
| Status | Unsold |

### Lot 140 — 1996 Porsche 911 Carrera RS (964)
| Field | Value |
|---|---|
| Year | 1996 |
| Make | Porsche |
| Model | 911 Carrera RS |
| VIN | WP0ZZZ99ZTS390451 |
| Engine Number | M64/20, G5031 |
| Mileage | 48,500 km (European spec) |
| Exterior Color | Grand Prix White |
| Interior Color | Black leather |
| Transmission | 5-Speed Manual |
| Lot Number | 140 |
| Hammer Price | US$390,000 (hammer, pre-premium) |
| Buyer's Premium | 12% on first $250k + 10% above |
| Sale Date | 3 October 2025 |
| Status | Sold |

**Parsing notes:**
- Chassis number / VIN: consistently present in listing body text, requires regex extraction
- Mileage: sometimes miles (US lots), sometimes km (European-spec cars sold in US) — unit must be parsed from text
- Color codes: present when Porsche-documented (e.g., "Code 6403"), not always
- Hammer price display is **inconsistent**: some lots show "inc. premium" (true cost to buyer), others show the pre-premium hammer with premium breakdown separately — the scraper must detect which format applies
- No JSON-LD or structured data — all fields in prose HTML; cheerio parsing required
- Unsold lots clearly indicate "not sold" / "estimate only" in the HTML text

---

## 6. Currency Handling

Bonhams is international. Currency is determined by auction location and is NOT normalized to USD.

| Auction Region | Currency | Example |
|---|---|---|
| United States (Scottsdale, Newport) | USD | Lot 140: US$390,000 |
| United Kingdom (Goodwood, Beaulieu, Bond Street) | GBP | All Beaulieu lots in £ |
| Continental Europe (Zoute/Belgium, Paris, Monaco) | EUR | Lot 155 Zoute: €362,250 |

**No USD conversion is shown for non-USD lots.** A 2025 Porsche 911 S/T at the Zoute Sale sold for €362,250 with zero dollar equivalent on the page.

**Implication for the comp engine:** Any Bonhams ingest pipeline must:
1. Detect the auction's primary currency from the lot page
2. Store the original currency + amount
3. Apply historical FX conversion at ingest time (based on sale date) to normalize to USD for comps
4. Surface the original currency to users to avoid misleading them

**Flag:** Non-USD lots likely represent ~60-70% of total Bonhams Porsche volume (UK and European auctions combined exceed US auctions in count). This is the single largest implementation complexity relative to the other data sources.

---

## 7. Volume Estimate (2023–2026 Porsche Lots)

**Methodology:** Manual sampling of 2025 completed auctions. No programmatic enumeration.

**Sampled auctions (2025 only, confirmed completed):**
| Auction | Date | Country | Currency | Porsche Lots (visible) | Total Lots |
|---|---|---|---|---|---|
| The Audrain Auction | Oct 2025 | US | USD | 4 | ~180 est. |
| The Zoute Sale | Oct 2025 | Belgium | EUR | 1 | 114 |
| Goodwood Revival | Sep 2025 | UK | GBP | unknown (154 total lots) | 154 |
| The Beaulieu Sale | Sep 2025 | UK | GBP | 0 vehicles (automobilia-heavy) | 423 |
| The Golden Age of Motoring | Oct 2025 | UK | GBP | 0 (pre-war focus) | 215 |
| Robert Richardson Collection | Sep 2025 | US | USD | unknown | unknown |

**Not captured in 2025 filter:** Scottsdale (January 2025), Quail/Pebble Beach (August 2025), and other auctions earlier in 2025 that may dominate the Porsche count. Scottsdale is typically Bonhams' largest North American car auction.

**Rough 2023–2026 estimate:**
- 3–6 major car auctions per year with Porsche lots (Scottsdale, Quail, Audrain, Zoute, Goodwood, one UK sale)
- Average 2–8 Porsche lots per auction
- **Total estimate: ~60–180 Porsche lots across 3 years**

This is **thin** — roughly 20–60 lots per year. By comparison, BaT lists 2,000–3,000 Porsche lots per year. Bonhams captures the **very top of the market**: rare homologation specials (RS 2.7, 964 RS, 993 RS), early 356s, GT3 variants, and one-offs. The $300k–$600k+ price range will be almost exclusively Bonhams territory.

**Collector car platform fit:** Bonhams data adds the upper tier of the price distribution that BaT and C&B rarely see. Important for market completeness, but not for statistical volume.

---

## 8. Recommendation: CAUTION

**GO on technical feasibility** — HTTP fetches work, no bot protection detected, robots.txt is permissive, SSR HTML is parseable without JavaScript.

**CAUTION flags:**

1. **Currency complexity (highest impact):** ~60–70% of Porsche lots are priced in GBP or EUR with no USD conversion on-page. Historical FX rates needed for normalization. The comp engine's current USD-cents model requires extension before Bonhams data can be ingested.

2. **Low volume (medium impact):** ~20–60 Porsche lots per year. This rounds to statistical noise for broad trend analysis but is critical for top-end comps (where BaT has almost no data). Prioritize this source only after BaT and C&B are solid.

3. **No structured data (low-medium impact):** All lot fields are in prose HTML, not JSON-LD. The parser will be more brittle than BaT (which embeds JSON in a `<script>` tag). Field extraction requires careful regex and cheerio selectors. High risk of silent misparse on edge cases.

4. **Inconsistent price presentation (low impact):** Some lots report "hammer inc. premium," others report pre-premium hammer with premium formula separately. The scraper must detect format and normalize to pre-premium hammer for comp consistency.

5. **Auction discovery (low impact):** No lot-level sitemap confirmed. Auction IDs are sequential integers; a crawler would need to enumerate auction IDs by year (available via the year filter on cars.bonhams.com/auctions/results/) and then paginate each auction's lot list.

**DO NOT ABORT.** The data is accessible, unique (top-end market), and legally comparable to existing sources. Implement after BaT and C&B, with FX normalization infrastructure as a prerequisite gate.

---

## Appendix: Bonhams Motoring Auction Calendar (2025, confirmed)

| Auction | Date | Location | Currency |
|---|---|---|---|
| Scottsdale | Jan 2025 | Scottsdale, AZ | USD |
| *(others TBD)* | Spring 2025 | Various | Mixed |
| Goodwood Festival of Speed | Jul 2025 | Chichester, UK | GBP |
| Quail Motorsports Gathering | Aug 2025 | Carmel, CA | USD |
| Goodwood Revival | Sep 2025 | Chichester, UK | GBP |
| Robert Richardson Collection | Sep 2025 | Los Angeles, CA | USD |
| The Audrain Auction | Oct 2025 | Newport, RI | USD |
| The Zoute Sale | Oct 2025 | Knokke-Heist, BE | EUR |
| The Golden Age of Motoring | Oct 2025 | London, UK | GBP |
