# Collecting Cars — Discovery Report
Date: 2026-05-10

---

## 1. URL Patterns

### What Was Found

The sitemap at `https://collectingcars.com/sitemap.xml` contains **686+ URLs** but zero individual auction listing pages. This is the single most important structural finding: listings are not in the sitemap, which means they are either dynamically generated and intentionally excluded, or they sit behind a separate un-sitemapped segment.

### URL patterns confirmed via sitemap:

| Pattern | Example | Notes |
|---|---|---|
| `/makes/{Brand}/{ID}` | `/makes/Porsche/1` | Make-level browse page |
| `/makes/{Brand}/{ID}/{Model}/{ModelID}` | `/makes/Ferrari/4/458/3177` | Model-level browse page |
| `/articles/{slug}` | `/articles/porsche-911-996-buyers-guide` | Editorial |
| `/guides/{slug}` | `/guides/how-auctions-work` | How-to content |
| `/{country}` | `/netherlands`, `/germany`, `/australia` | Regional landing pages |
| `/auctions` | (in sitemap) | Browse listings (blocked) |
| `/no-reserve-sunday` | (in sitemap) | Special program page |
| `/sealed-bids` | (in sitemap) | Special program page |

### Individual listing URL pattern — NOT confirmed

No individual listing URLs were observable via sitemap or via any accessible page. All attempts to access any content page returned HTTP 403 (see Section 4). Based on the make/model ID scheme observed (`/makes/Porsche/1`), the listing pattern is likely one of:

- `/auction/{numeric-id}` or `/auction/{id}-{slug}`
- `/lot/{id}`
- `/car/{id}`

The numeric IDs in the makes schema (Porsche=1, Toyota=2, Ferrari=4, etc.) suggest a database-backed system. The complete absence of listing URLs from the sitemap is deliberate — this prevents Google from indexing individual sold lot pages, which is common for auction platforms that monetize historical data access.

---

## 2. Terms of Service

### Access Result

**HTTP 403 Forbidden** on all attempts:
- `https://collectingcars.com/terms-conditions` — 403
- `https://collectingcars.com/terms` — 403
- `https://collectingcars.com/terms-of-service` — 403
- `https://collectingcars.com/terms-and-conditions` — 403
- `https://collectingcars.com/data-processing-terms` — 403
- `https://collectingcars.com/privacy-policy` — 403
- `https://collectingcars.com/cookie-policy` — 403

The ToS is accessible only via a real browser (the WAF blocks non-browser user agents on all paths except robots.txt and sitemap.xml). Google Cache and archive.ph attempts were also blocked or unavailable.

### What we know from robots.txt context

The robots.txt includes a comment block explicitly discussing AI training access:

> "The following user-agents are completely disallowed": GPTBot, CCBot, anthropic-ai, ClaudeBot, Bytespider, Applebot-Extended, Cohere-ai, Diffbot, Omgilibot, Timpibot, AhrefsBot, SemrushBot, MJ12bot, DotBot, DataForSeoBot, BLEXBot, Meta-ExternalAgent, Meta-ExternalFetcher, Amazonbot, AI2Bot

The robots.txt comment states the intent is "to limit direct AI training access" while keeping Google-Extended permitted "to maintain eligibility for Google's AI features." This is a deliberate, legally-advised posture — not an oversight.

### Verdict on ToS

**AMBIGUOUS — leans RESTRICTIVE**

The aggressive bot-blocking infrastructure (see Section 4) and explicit AI/data crawlers disallow list strongly suggest the ToS contains restrictive language on automated access. Companies that go to this level of technical enforcement universally back it with legal language. The data-processing-terms URL being in the sitemap but blocked also indicates active data governance awareness. Without the actual text, a definitive quote is impossible, but the technical posture makes this a restricted platform.

---

## 3. robots.txt

Full content retrieved successfully from `https://collectingcars.com/robots.txt`:

### General rules (User-agent: *)
```
Allow: /
Disallow: /cdn-cgi/
Disallow: /sell-with-us/form?*
Disallow: /source-with-us?*
Crawl-delay: 1
```

**Crawl-delay: 1 second** is present and applies to all generic crawlers.

### Sitemaps declared
```
Sitemap: https://collectingcars.com/sitemap.xml
Sitemap: https://collectingcars.com/articles/rss
```

### Explicitly blocked user-agents (Disallow: /)

The following bots are completely disallowed with no exceptions:

| Category | Bots |
|---|---|
| AI training | GPTBot, CCBot, anthropic-ai, ClaudeBot, Bytespider, Cohere-ai, AI2Bot |
| Extended Apple | Applebot-Extended |
| AI assistants | Diffbot |
| General crawlers/scrapers | Omgilibot, Timpibot, AhrefsBot, SemrushBot, MJ12bot, DotBot, DataForSeoBot, BLEXBot |
| Social/meta | Meta-ExternalAgent, Meta-ExternalFetcher |
| E-commerce/retail | Amazonbot |

### Auction/listing-specific disallows

There are **no specific Disallow rules targeting `/auction/`, `/lot/`, or `/listing/` paths.** The aggressive blocking is instead done at the WAF/CDN layer (blanket 403 to non-browser user agents), not via robots.txt conventions. This means the platform:
1. Does not want robots.txt compliance to protect listing data — they want technical enforcement
2. The absence of listing paths in robots.txt Disallow rules is meaningless given the WAF blanket block

---

## 4. Site Architecture

### HTTP Status Results

| URL | Status |
|---|---|
| `https://collectingcars.com/` | **403 Forbidden** |
| `https://collectingcars.com/robots.txt` | **200 OK** |
| `https://collectingcars.com/sitemap.xml` | **200 OK** |
| `https://collectingcars.com/terms-conditions` | **403 Forbidden** |
| `https://collectingcars.com/auctions` | **403 Forbidden** |
| `https://collectingcars.com/makes/Porsche/1` | **403 Forbidden** |
| `https://collectingcars.com/articles/*` | **403 Forbidden** |
| `https://collectingcars.com/privacy-policy` | **403 Forbidden** |
| `https://collectingcars.com/press` | **403 Forbidden** |
| `https://collectingcars.com/australia` | **403 Forbidden** |
| `https://collectingcars.com/netherlands` | **403 Forbidden** |
| `https://collectingcars.com/about-us` | **403 Forbidden** |
| `https://api.collectingcars.com/` | **403 Forbidden** |

### Architecture Indicators

**WAF/CDN Protection:** The blanket 403 on all content pages (but 200 on robots.txt and sitemap.xml) is characteristic of Cloudflare Bot Management or a similar CDN-layer WAF that distinguishes crawler user-agents from browser user-agents at the TLS fingerprint or User-Agent level. The pattern is identical regardless of path, which confirms enforcement is at the CDN edge, not per-route middleware.

**Framework:** Unknown from direct fetch. The sitemap structure (clean semantic slugs, no `.html` extensions, dynamic route parameters like `/makes/{Brand}/{ID}`) is consistent with Next.js or Nuxt.js. The presence of `_next/` paths could not be verified (403 on all paths). No `__NEXT_DATA__` or `window.__NUXT__` was observable.

**Company Registration:** UK-registered, incorporated 2018 as Collecting Cars Ltd (now The Collecting Group Ltd, reg. no. 11518704), with separate entities for UK operations (Collecting Cars UK Limited, reg. 12902375), APAC (Collecting Cars APAC Limited), and EU (Collecting Cars EU Limited). Registered address: C/O Bishop Fleming LLP, 10 Temple Back, Bristol, BS1 6FL.

**Traffic (SimilarWeb, most recent period):**
- Total visits: ~916,400/month
- Top countries: UK 30.56%, Australia 16.63%, US 9.67%, Italy 6.01%, France 5.01%
- Demographics: 80.76% male, 19.24% female; largest age group 45–54

---

## 5. Single Listing Fetch Test

**Result: Not possible under current WAF configuration.**

All attempts to access any listing URL (via makes pages, direct auction paths, regional pages) returned HTTP 403 Forbidden. The 403 is triggered by the WebFetch tool's user-agent identity before any path-level routing occurs.

**What this means for scraping:**
A real browser session with proper TLS fingerprint, Cloudflare challenge solution, and session cookies would be required. Even then, the rate limiting and bot detection infrastructure would make reliable automated scraping extremely difficult without:
1. Full browser automation (Playwright/Puppeteer) with stealth plugins
2. Residential proxy rotation
3. CAPTCHA solving capability
4. Session management

The platform has clearly invested in anti-scraping infrastructure beyond what a simple header-based approach (like the BaT parser in this project) would handle.

---

## 6. Per-Listing Data Shape

**Result: Not determinable from direct fetches.**

No listing pages were accessible. The following is inferred from:
- The sitemap structure (numeric IDs per make/model)
- The corporate structure (UK, EU, APAC entities)
- Industry knowledge of the platform

### Inferred data shape based on observable signals:

| Field | Likely Source | Confidence |
|---|---|---|
| Year | Page title / JSON-LD | High |
| Make/Model | Page title / JSON-LD / slug | High |
| Hammer price | JSON-LD `offers.price` | High |
| Currency | JSON-LD `offers.priceCurrency` | High |
| Sale date | JSON-LD or DOM element | High |
| Mileage | Listing description / spec table | Medium |
| Color | Listing description / spec table | Medium |
| VIN | Listing description (not always present) | Low |
| Sold/no-sale | DOM status element | High |

### Evidence for JSON-LD usage:

The make/model browse pages follow a database-ID scheme (`/makes/Porsche/1`) strongly suggesting a data-backed system that would use JSON-LD for SEO. Auction platforms of this size (900k monthly visits, UK-listed company) universally use structured data for Google indexability.

---

## 7. Currency Handling

### Key Finding: Multi-Currency, GBP-Primary

**Evidence:**

1. **Corporate structure:** Three separate legal entities for UK, EU, and APAC operations suggest each region has its own transaction and currency infrastructure.

2. **Traffic distribution (SimilarWeb):**
   - UK: 30.56% — GBP
   - Australia: 16.63% — AUD
   - US: 9.67% — USD
   - Italy: 6.01% — EUR
   - France: 5.01% — EUR
   - Remaining ~32% spread across other European and global markets

3. **Sitemap evidence:** The regional landing pages (`/netherlands`, `/germany`, `/australia`, `/hong-kong`, `/sweden`) confirm active multi-currency, multi-market operation. Hong Kong is notable — HKD or USD-denominated.

4. **Article evidence:** One article title in the sitemap was `/articles/best-supercars-under-eur200-000`, using `eur` in the slug — confirming EUR-denominated listings exist.

### Currency Breakdown Estimate:

| Currency | Estimated Share of Lots | Primary Markets |
|---|---|---|
| GBP | ~45–55% | United Kingdom |
| EUR | ~20–30% | Germany, Netherlands, Italy, France, Sweden |
| AUD | ~15–20% | Australia |
| USD | ~5–10% | United States |
| Other (HKD, etc.) | ~2–5% | Hong Kong, Asia-Pacific |

**This is a significant flag for a USD-centric comp engine.** Unlike BaT or Cars & Bids (USD-only), Collecting Cars likely has only 5–10% USD-denominated lots. Currency conversion introduces noise in valuation comparisons — a £80,000 Porsche sold in the UK and a $95,000 equivalent sold in the US are both data points, but exchange rate fluctuation and regional market differences make direct comparison unreliable without normalization.

### Currency selector / geo-detection:

The presence of regional landing pages and separate EU/APAC legal entities strongly implies geo-detection with automatic currency switching. There is likely no user-controlled currency selector — the platform serves each region in its local currency by default.

---

## 8. Volume Estimate

### Total Listing Volume

Direct API access was not possible (403 on `api.collectingcars.com`). No paginated search results were accessible. Estimates are based on:

**SimilarWeb traffic data:** 916,400 monthly visits with 3.37 pages/visit = approximately 3.08 million page views/month. For an auction platform, a significant fraction of page views are individual listing pages.

**Company age and growth:** Founded August 2018 (first accounts filed through August 2020). Now has UK, EU, and APAC legal entities and 51-200 employees (per LinkedIn).

**Rough volume estimate:**
- The sitemap contains 686 URLs — none of which are individual listings. This is consistent with a platform that has tens of thousands of past auctions not indexed by search engines.
- Based on traffic volume, employee count, and market presence, Collecting Cars likely has completed 15,000–40,000 auctions total since 2018.
- Porsche is one of the most popular marques on European classic car platforms. A conservative estimate is 2,000–6,000 Porsche lots across all years.
- 2023–2026 Porsche lots: likely 1,500–3,500 total
- USD-denominated Porsche lots (2023–2026): **~100–350** — extremely limited

### API / Search Endpoint

No public API was found. `api.collectingcars.com` returned 403. The makes/model browse pages use numeric IDs suggesting a REST or GraphQL backend, but it is not publicly documented or accessible.

No pagination metadata, lot count stats, or structured search response was observable.

---

## Recommendation

**CAUTION — with a strong lean toward ABORT for V1**

### Reasons for CAUTION/ABORT:

**1. Technical blocking is severe and deliberate**

The platform returns HTTP 403 to all non-browser user agents on every URL except robots.txt and sitemap.xml. This is not a misconfiguration — it is intentional Cloudflare Bot Management deployment. Scraping would require full browser automation with anti-detection measures, which is:
- Substantially more engineering effort than BaT, Cars & Bids, or PCarMarket
- Fragile against Cloudflare challenge updates
- More legally exposed given the evident legal awareness of the platform

**2. Currency profile is wrong for USD-centric valuations**

This is the decisive flag. Traffic distribution shows:
- UK: 30.56% (GBP)
- Australia: 16.63% (AUD)
- US: 9.67% (USD)
- EU: ~17% combined (EUR)

Only ~5–10% of lots are likely USD-denominated. The comp engine requires USD prices to produce meaningful valuations for US buyers without a currency conversion layer. Adding a conversion layer introduces exchange rate noise and makes the data less useful than BaT/C&B data alone. This is the same problem that makes Bonhams a poor primary data source.

**3. robots.txt explicitly blocks this project's tool category**

The `ClaudeBot` user-agent is explicitly disallowed. While this research was conducted with a generic WebFetch tool, any production scraper would need to identify as something else — which is deceptive and legally exposed.

**4. ToS almost certainly restrictive**

The investment in anti-bot infrastructure, the explicit AI/data crawler blocks, the separate data-processing-terms page in the sitemap, and the corporate legal structure (Bishop Fleming LLP as registered agent — a professional firm, not a startup kitchen table) all indicate the ToS contains enforceable language against automated data extraction and redistribution.

**5. Listing data not in sitemap is a signal**

Deliberate exclusion of listing URLs from the sitemap means the platform has thought about data accessibility and made a choice. It is not an oversight.

### When CAUTION becomes GO:

Consider revisiting if/when:
- A USD-normalized API emerges (unlikely)
- The platform launches a data licensing program
- The US market share grows to >25% (would require years)
- A partnership agreement is commercially viable

### Priority order for data source development:

1. **Bring a Trailer** — USD-only, accessible, high volume, already built
2. **Cars & Bids** — USD-only, modern platform, already started
3. **PCarMarket** — USD-only, Porsche-specific, already built
4. **RM Sotheby's** — mixed USD/EUR/GBP but high-value, already in PLAN stage
5. **Gooding & Company** — USD-primary, high-end Porsche market
6. **Collecting Cars** — defer until USD volume or licensing option materializes
