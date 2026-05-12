# Porsche Finder — Raw Investigation Notes
*Session date: 2026-05-11*

## Fetch Behavior Observed This Session

All direct WebFetch attempts to finder.porsche.com URLs returned **HTTP 429 Too Many Requests**
immediately — first request, no warmup. URLs attempted:

- `https://finder.porsche.com/robots.txt` → 429
- `https://finder.porsche.com` (homepage) → 429
- `https://finder.porsche.com/us/en-US/search` → 429
- `https://finder.porsche.com/us/en-US/search/911?model=911` → 429
- `https://finder.porsche.com/us/en-US/certified-preowned` → 429
- `https://finder.porsche.com/api/offer/vehicle-expose/247288?languageTag=en-GB` → 429
- `https://finder.porsche.com/api/offer/vehicle-expose/247288?languageTag=en-US` → 429

All 429s were immediate — not after a burst of requests. This suggests IP-level rate limiting
on the fetch infrastructure used by WebFetch (likely a known datacenter IP range). 
Browser-UA requests from residential IPs appear to work normally per prior session findings.

The adjacent `https://configurator.porsche.com/robots.txt` returned 403.

## Key URLs Confirmed via Google Search Index

Search results surfaced these exact indexed URLs, which confirm URL structure even without
direct access:

```
https://finder.porsche.com/us/en-US                               (homepage)
https://finder.porsche.com/us/en-US/search                        (all results)
https://finder.porsche.com/us/en-US/search?condition=used         (used filter)
https://finder.porsche.com/us/en-US/search?condition=porsche_approved  (CPO filter)
https://finder.porsche.com/us/en-US/search?modelSeriesKeys=       (model filter)
https://finder.porsche.com/us/en-US/dealer/search                 (dealer search)
https://finder.porsche.com/us/en-US/certified-preowned            (CPO info page)
https://finder.porsche.com/us/en-US/saved-searches                (authenticated feature)
https://finder.porsche.com/us/en-US/search/macan?model=macan      (model-specific)
https://finder.porsche.com/us/en-US/search/911?model=911          (model-specific)
https://finder.porsche.com/api/offer/vehicle-expose/247288?languageTag=en-GB  (API endpoint)
```

## Search Filter URL Parameters (confirmed from search index + community forums)

```
condition=used | new | porsche_approved
model=911 | 718 | cayenne | macan | panamera | taycan
category={specific-model-variant}  e.g. cayenne-turbo, 911-targa-4-gts
minimum-model-year=YYYY
maximum-model-year=YYYY
minimum-price=N
maximum-price=N
maximum-mileage=N
exterior={color-code}
drivetrain=
position={zipcode},{lat},{lon},{radius-miles}
order=closest | price_asc | price_desc
page=N
```

Position parameter example (URL-encoded):
`position=32550%2C30.3790174%2C-86.3427458%2C500`
(Decoded: `32550,30.3790174,-86.3427458,500` = ZIP,lat,lon,radius_miles)

Forum note: position radius of -1 was once a workaround for nationwide search (patched ~mid-2023).
Using radius=9999 reportedly still works for effective nationwide results.

## Internal API Endpoint Discovery

The URL `https://finder.porsche.com/api/offer/vehicle-expose/247288?languageTag=en-GB`
appeared in Google's index. This is interesting because:

1. The offer ID `247288` is a low sequential integer — strongly suggests auto-incrementing DB IDs
2. `languageTag=en-GB` suggests this is the same API serving the GB locale
3. The `vehicle-expose` resource name is consistent with a vehicle detail/PDP API
4. robots.txt Disallows `/api` for all bots
5. Fetch returns 429 — rate-limited but endpoint exists

Implication: the internal API uses numeric offer IDs that differ from the 6-char alphanumeric
listing IDs shown in the detail page URL (`/details/6GL72W`). The 6-char ID is likely a
public-facing slug that maps to an internal offer ID server-side.

## ToS Research Results

### finder.porsche.com legal notice page
- Returned only page title, no body text on fetch (429)
- Prior session extracted: personal use / no redistribution clause
- No explicit anti-scraping language confirmed for finder.porsche.com specifically

### porschemotorcarsales.com terms (successfully fetched)
Explicit prohibition: "Use automated means to download data from the Service"
This is a PCNA-operated dealer inventory portal — analogous to finder.porsche.com.

### developer.porsche.com terms (successfully fetched)
Explicit prohibition: "using any robot, spider, scraper, or other similar automated data
collection or extraction tools"
Different service (API developer portal) but same legal authorship pattern.

## Country/Locale Coverage Observed

Countries confirmed in search index:
- `/us/en-US` — United States
- `/ge/en-GE` — Georgia (country)
- `/de/de-DE` — Germany (inferred)
- `/gb/en-GB` — United Kingdom (inferred from API languageTag)

US listings are fully isolated under `/us/en-US/`. No mixing of currencies within a locale.

## Volume Signals

- 193 US dealers per press announcements
- Inventory data is typically inaccurate or outdated per Rennlist forum discussions
- 100-page hard cap on search results at 15/page = ~1,500 visible at any time (cap, not total)
- CARFAX reports ~1,000 used 2024 Porsche 911s for sale nationally (cross-reference)
- Porsche delivered 310,718 vehicles globally in 2024 (newsroom.porsche.com)

Collector-era pre-2010 cars: sparsely listed. This is primarily an authorized CPO/near-new
dealer portal — NOT a broad pre-owned marketplace. Private sellers are absent.

## Technology Stack Signals

- Framework: Next.js confirmed (/_next/ paths, Porsche Design System uses Next.js)
- CDN/protection: 429 responses from datacenter IPs suggests Vercel Edge + rate limiting
  (prior session confirmed Vercel Security Checkpoint, not Cloudflare challenge pages)
- No GraphQL API found
- JSON-LD structured data (Schema.org Car + Product types) present in SSR HTML
- RSC payload (self.__next_f.push) carries additional vehicle data fields

## What This Source Is / Is Not

WHAT IT IS:
- Active dealer asking prices (live inventory)
- New, used, and Porsche Approved (CPO) vehicles
- All 193 US Porsche authorized dealers
- Rich structured data including VIN, option codes, CPO status

WHAT IT IS NOT:
- Auction results (no BaT / Gooding equivalent data)
- Historical sold prices
- Private seller listings
- Classic/collector car specialist market data

## Relevance to Project Vintage

Utility: MODERATE for paste-and-go (user pastes a dealer listing URL → parse → display asking
price context). LOW for comp engine (asking prices ≠ sold prices; no historical transaction data).

The paste-and-go use case is legitimate: a user researching a specific CPO car could paste its
finder.porsche.com URL to get a structured breakdown. This is user-initiated, single-request,
display-only — consistent with fair use and ToS defensibility.

Bulk collection of inventory for price tracking or market analysis should be treated as PROHIBITS
given the adjacent Porsche portal ToS language on automated access.
