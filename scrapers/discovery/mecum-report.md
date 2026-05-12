# Mecum Auctions — Discovery Report
**Date:** 2026-05-10  
**Scope:** Paste-and-go parser source evaluation  
**Status:** CAUTION

---

## 1. Terms of Service Review

**Result: UNABLE TO RETRIEVE**

`mecum.com` is completely blocked to automated HTTP clients — every fetch attempt
returned `"Claude Code is unable to fetch from www.mecum.com"` with no response body.
This means the ToS text itself could not be read.

**What is known from secondary research:**
- The MyMecum account system is the primary access gate. Hammer prices require a
  (free) registered account. A user who registers and logs in has agreed to ToS.
- No web-accessible cached or indexed copy of Mecum's ToS was located.
- Standard collector-car auction ToS language (per industry practice) typically
  prohibits systematic data extraction and commercial redistribution of results
  without a license agreement.

**Verdict on ToS:** Unknown — the site was inaccessible for review. Must treat as
restrictive until explicitly confirmed otherwise. Cannot quote clauses.

---

## 2. robots.txt Review

**Result: UNABLE TO RETRIEVE**

Direct fetch of `https://www.mecum.com/robots.txt` failed with the same total block.
No cached copy was found via web search.

**Implication:** The domain blocks automated access at the infrastructure level before
robots.txt is even relevant. The robots.txt content is unknown, but the effective
behavior is: all automated clients are blocked.

---

## 3. Site Architecture

### URL Pattern (CONFIRMED)
Individual lot pages follow this structure:
```
https://www.mecum.com/lots/[NUMERIC_LOT_ID]/[VEHICLE-SLUG]/
```
Example (confirmed from PCA.org links):
```
https://www.mecum.com/lots/1106284/1987-porsche-959-komfort/
```

Lot numbers use an alphanumeric auction-day prefix (e.g., `S148`, `T109`, `F64`) for
human-readable identification, but the URL uses a sequential numeric ID.

### Results Search
The browse/filter path for sold Porsche lots is:
```
https://www.mecum.com/lots/?type=Sold&ymm=porsche
```
(Could not confirm — fetch blocked.)

### Login Gate
Hammer prices (sold amounts) require a **free MyMecum account** and authenticated
session. The lot page itself may render without login, but sale price is gated.

### Infrastructure / Bot Detection
- Every direct fetch to `mecum.com` returned a hard block ("unable to fetch")
- No Cloudflare challenge page was observed — the block happens before content delivery
- The site runs on WordPress (per Americaneagle.com case study, which built the
  Mecum site), which may mean bot detection is via a plugin or CDN rule, not
  native to the CMS
- No public API or developer feed discovered

### Static vs. SPA
Could not confirm. WordPress origin suggests static or SSR HTML, but auction results
filtering is likely client-side JavaScript. Rick Carey's detailed lot data (including
VIN, engine number, condition) suggests the lot detail page is content-rich HTML,
not a pure SPA — but this is inference only.

---

## 4. Single Lot Fetch Test

**Result: BLOCKED**

Attempted fetch of confirmed lot URL:
```
https://www.mecum.com/lots/1106284/1987-porsche-959-komfort/
```
Returned: `"Claude Code is unable to fetch from www.mecum.com"`

- HTTP status code: not returned (connection blocked before response)
- Cloudflare challenge page: not observed (block is pre-content)
- Content availability: unknown

**This is the strongest signal in the report.** The domain does not allow any
automated HTTP client to connect. A real scraper would need to spoof a full browser
fingerprint (TLS, HTTP/2 headers, JS execution, behavioral signals).

---

## 5. Per-Listing Data Shape

Reconstructed from PCA.org articles linking to Mecum lot pages, and from Rick
Carey's detailed auction reports sourced from Mecum lot pages:

| Field | Available | Notes |
|---|---|---|
| Year | Yes | Displayed in listing title |
| Make | Yes | Part of URL slug and page heading |
| Model / Trim | Yes | Including sub-variant (GT3 RS, 930 Turbo, etc.) |
| Lot Number | Yes | Alphanumeric prefix + sequential number (e.g., S148) |
| Hammer Price | Yes (login) | Shown after authentication; includes buyer's premium note |
| Sale Date | Yes (inferred) | From auction event metadata, not per-lot field |
| Exterior Color | Yes | Listed per-lot (confirmed in multiple sources) |
| Mileage | Yes | Odometer reading shown per lot |
| VIN / Serial Number | Yes | Rick Carey sourced VIN from lot pages directly |
| Engine Number | Yes | Present on lot pages per Rick Carey data |
| Engine Specs | Yes | Displacement and horsepower listed |
| Transmission | Yes | Listed per lot |
| Condition Grade | Yes | Numeric condition rating (1–3+) per Rick Carey |
| Reserve Met / No-Sale | Yes | Sold vs. passed/no-sale status |

**Notable gap:** Sale date is event-level metadata (e.g., "Kissimmee 2024, Jan 2–14"),
not a specific per-lot date. Day-of-sale precision would require cross-referencing
the lot number prefix (T = Thursday, S = Saturday, etc.) against the event calendar.

---

## 6. Volume Estimate — 2023–2026 Porsche Lots

**Per-event data (confirmed):**
- Mecum Kissimmee 2023: ~85 Porsches consigned
- Mecum Kissimmee 2024: ~50 Porsches consigned
- Mecum runs approximately 15–20 auction events per year
  (Kissimmee, Houston, Glendale, Indy, Indy Fall, Dallas, Denver, Monterey, etc.)
- Kissimmee is the largest single event (~4,000+ total lots); others run 300–1,200 lots

**Volume model:**
- Kissimmee: ~50–85 Porsches/event (largest event)
- Mid-tier events (Houston, Indy, Glendale, Dallas): ~5–20 Porsches each, est. ~60–80/year
- Smaller events: ~2–5 Porsches each, est. ~15–25/year

**Estimated total Porsche lots across all Mecum events:**
- ~150–200 Porsches/year
- 2023–2026 (3 years): **~450–600 Porsche lots**

**Historical context:** Since ~2010, over 1,500 Porsches have been consigned at
Mecum — roughly 100/year on average, with a recent uptick in volume.

**Sell-through rate:** Mecum-wide sell-through is ~73–74%, so expect ~110–145 actual
sales per year; ~330–440 confirmed Porsche sales for 2023–2026.

---

## 7. Press Release Data — FLAG: Alternative Source

**Yes, press releases exist. This is a potentially cleaner path.**

Mecum issues event-level press releases after each major auction. These are picked
up by:
- **theSpeedJournal.com** — verbatim press release text with total sales, top lots
- **duPontRegistry News** — similar coverage
- **Conceptcarz.com** — structured event summaries
- **PCA.org** — Porsche-specific post-event roundups (Mecum-sponsored content)

**What press releases contain:**
- Total event sales volume and dollar amount
- Top 10–20 individual results with: vehicle description, lot number, hammer price
- Sell-through rate and total lot count

**What they lack:**
- Comprehensive per-lot data (only top sellers, not all ~50–85 Porsches)
- Mileage, color, VIN, condition per lot
- Machine-readable format (plain prose, not structured JSON/CSV)

**Verdict on press releases:** Useful as a supplemental signal for high-value outlier
sales and to verify top-end comps. Not a replacement for per-lot scraping if the goal
is complete auction coverage.

---

## Recommendation

### CAUTION — Do Not Proceed to Build Without Resolving These First

**Blocking issues:**
1. **Hard infrastructure block:** `mecum.com` refuses all automated HTTP connections.
   A production scraper would require full browser automation (Playwright/Puppeteer
   with stealth plugins) plus authenticated session management. This is materially
   higher complexity than Bring a Trailer or Cars & Bids, which return HTML to
   standard requests.

2. **Login wall on prices:** Even with a working browser session, hammer prices
   require an authenticated MyMecum account. The scraper would need to hold and
   rotate session credentials.

3. **ToS unknown:** Could not read the terms of service. Proceeding without ToS
   review is a legal and operational risk. This must be done manually (human logs
   in, reads ToS) before build starts.

**Positive signals:**
- Data schema is complete and well-structured (year, model, lot, price, color,
  mileage, VIN, engine)
- Volume is moderate (~150–200 Porsche lots/year) — manageable batch scrape, not
  a firehose
- URL pattern is clean and predictable
- No evidence of aggressive rate limiting beyond the initial block
- Press releases provide a lightweight alternative for top-seller coverage

**Priority vs. other sources:**
Mecum is a lower-volume, higher-friction source compared to Bring a Trailer or
Cars & Bids. It should be deprioritized until the higher-traffic online-native
sources are operational. When Mecum is revisited:

1. Human reviews ToS manually (logged in)
2. Test authenticated browser fetch with Playwright + stealth
3. If ToS permits, build a batch scraper that runs post-event (not real-time)
4. Consider whether press-release parsing covers the top-20% of Mecum Porsche
   results at 5% of the engineering cost

---

## Sources Consulted

- PCA.org — Mecum Kissimmee 2024 Top-Selling Porsches (Mecum-sponsored)
- Rick Carey's Collector Car Auction Reports — Kissimmee 2024 detailed lot data
- CorvetteForum — MyMecum login access thread
- FerrariChat — Mecum prices public access discussion
- theSpeedJournal.com — Mecum 2023/2024 press releases
- Glenmarch.com — Mecum results aggregator (403 on fetch; search-indexed data)
- Conceptcarz.com — Mecum event announcements and results
- duPontRegistry News — Mecum event coverage
- Americaneagle.com — Mecum website tech stack (WordPress, enterprise build)
- Wikipedia — Mecum Auctions background
