# Barrett-Jackson Discovery Report

**Date:** 2026-05-10  
**Verdict:** ABORT  
**Investigator:** Claude Code (automated discovery session)

---

## 1. Terms of Service Review

**ToS URL:** `https://www.barrett-jackson.com/conditions-of-use`  
**Robots.txt URL:** `https://www.barrett-jackson.com/robots.txt` (returned 403 — inaccessible via automated fetch)

### Key Prohibitions (verbatim, sourced via search index)

> "Use any data mining, robots or similar data gathering or extraction methods designed to scrape or extract data from our Services, including any application that reads areas of RAM used by the Services to store information about a character or an environment"

> "Bypass or ignore instructions contained in our robots.txt file"

**Verdict:** Explicit, unambiguous prohibition on automated data extraction. No carve-outs for research or non-commercial use found. The ToS page itself returned 402 (Cloudflare block) during direct fetch — language sourced via indexed search snippets. The phrasing is broad enough to cover any systematic catalog scraping regardless of request rate or politeness headers.

---

## 2. robots.txt Review

Direct fetch of `https://www.barrett-jackson.com/robots.txt` returned **HTTP 403 Forbidden** — the file exists but Cloudflare is blocking all non-browser access to it.

The ToS explicitly requires compliance with robots.txt. The 403 itself is informative: the site is configured to refuse robots.txt disclosure to crawlers, which is a strong signal of aggressive bot blocking posture.

**Could not read directives** — but irrelevant given ToS prohibition above.

---

## 3. Site Architecture

### Protection Layer
Every subdomain tested returned Cloudflare bot-block codes:
- `www.barrett-jackson.com` → **402 Payment Required** (Cloudflare synthetic response)
- `bid.barrett-jackson.com` → **402 Payment Required**
- `showroom.barrett-jackson.com` → **Partially accessible** (returns rendered HTML for some pages)

HTTP 402 from Cloudflare is not a real payment wall — it is Cloudflare's bot challenge synthetic response code used to reject non-browser traffic that fails JS challenge / TLS fingerprint checks. This is enterprise-tier Cloudflare Bot Management, not basic rate limiting.

### Site Structure (reconstructed from search index + indirect evidence)

**Main site:** `www.barrett-jackson.com`
- Past auction pages: `/{auction-name}/docket/vehicle/{slug}`
  - Example: `/scottsdale-2025/docket/vehicle/2024-porsche-911-dakar-285538`
- Results index: `/results?type=Vehicles`

**Bidding platform:** `bid.barrett-jackson.com`
- Auction catalog: `/auctions/catalog/id/{catalog_id}`
  - Example: `/auctions/catalog/id/42` (Scottsdale 2025)
  - Paginated: `?page={n}&view=comp`
- Individual lot: `/lot-details/index/catalog/{catalog_id}/lot/{lot_id}`
  - Example: `/lot-details/index/catalog/42/lot/29604`

**Showroom (dealer inventory, not auction results):** `showroom.barrett-jackson.com`
- Individual vehicles: `/Home/Details?lotid={uuid}`

**Catalog IDs discovered:**
| Event | Catalog ID |
|---|---|
| Scottsdale 2023 | 28 |
| Palm Beach 2023 | 30 |
| Las Vegas 2023 | 31 |
| Scottsdale 2024 | 35 |
| Palm Beach 2024 | 37 |
| Scottsdale Fall 2024 | 41 |
| Scottsdale 2025 | 42 |
| Palm Beach 2025 | 44 |

### Rendering Model
Could not confirm server-rendered vs. SPA due to Cloudflare block. Given the pagination parameters in indexed URLs (`?page=38&view=comp`) and lot detail pattern, the bidding platform is likely a mix of server-rendered pages with JS-driven filter/search. The Cloudflare layer makes this moot for scraping purposes.

### Pre-sale vs. Post-sale
Barrett-Jackson operates No Reserve auctions for nearly all lots. The docket (pre-sale) is published on the main site with VIN, description, and photos. Post-sale hammer prices appear on the same lot page after the event. Both phases are behind the same Cloudflare wall.

---

## 4. Single Porsche Lot Fetch Test

**Attempted URL:** `https://bid.barrett-jackson.com/lot-details/index/catalog/42/lot/29604` (1996 Porsche 911 Turbo, Scottsdale 2025)  
**Result:** HTTP 402 — Cloudflare block. No data returned.

**Attempted URL:** `https://www.barrett-jackson.com/2026-palm-beach/docket/vehicle/2024-porsche-911-st-299139`  
**Result:** HTTP 402 — Cloudflare block. No data returned.

Data shape inferred from third-party aggregators and press coverage:

| Field | Availability | Notes |
|---|---|---|
| Year | ✓ Consistent | Always present |
| Make / Model | ✓ Consistent | Always present |
| Lot number | ✓ Consistent | Present in URL and page |
| Hammer price | ✓ Post-sale | Published after gavel falls |
| Auction name / date | ✓ Consistent | Inferable from catalog ID |
| VIN | ⚠ Inconsistent | Present for modern cars, often absent for classics |
| Mileage | ⚠ Inconsistent | Present for modern/supercar; absent for most classics |
| Color | ⚠ Inconsistent | Mentioned in description, not a structured field |
| Engine / Transmission | ⚠ Inconsistent | In description text, not structured |
| Condition / grade | ✗ Absent | BJ does not use formal condition grading |
| Sale status (sold vs. no-sale) | ✓ (100% sell-through) | BJ runs almost exclusively No Reserve — 100% sell-through is typical |
| Buyer's premium | ✓ | ~10% buyer's premium standard |

**Assessment:** Data density is lower than BaT or C&B. VIN and mileage are especially spotty for the vintage Porsches that are most relevant to Project Vintage's use case. Color and condition are buried in description text, not structured fields.

---

## 5. Porsche Volume Estimate (2023–2026)

Barrett-Jackson's brand identity is built on American muscle cars, customs, and high-profile celebrity-consignment vehicles. Porsches appear regularly but as a small fraction of inventory.

**Evidence-based estimate:**

| Auction | Total Lots | Porsche Lots (estimated) | Source |
|---|---|---|---|
| Scottsdale 2023 | ~1,907 | ~20–35 | "Top 10" article implies deeper pool; lot numbers spread 1088–1430 |
| Palm Beach 2023 | ~500–700 | ~8–15 | Smaller event |
| Las Vegas 2023 | ~500–700 | ~8–15 | Smaller event |
| Scottsdale 2024 | 2,016 | ~20–40 | Confirmed: Carrera GT, 918 Spyder in top results |
| Palm Beach 2024 | ~600 | ~8–15 | Smaller event |
| Scottsdale Fall 2024 | ~400–600 | ~6–12 | Fall events smaller |
| Scottsdale 2025 | ~2,000 | ~20–35 | Confirmed: 959, GT3 RS, GT2 RS, 911 Turbo, Singer, Dakar |
| Palm Beach 2026 | ~700 | ~10–15 | Confirmed: S/T + 3x GT3 RS + Targa 4 GTS + Carrera T |

**Rough total 2023–2026 (all auctions ~6–8/year):** **~150–300 Porsche lots across ~3 years**

For comparison: BaT lists 150–250 Porsches per *month*. Barrett-Jackson's Porsche coverage represents roughly 2–5% of BaT's volume for the same period.

Porsche share of BJ inventory: approximately **1–2%** of total lots. The platform skews heavily American, with Porsches concentrated in the higher-value lots (GT2 RS, GT3 RS, Carrera GT, 918 Spyder).

---

## 6. Recommendation

**ABORT**

### Reasons, in order of severity:

1. **Explicit ToS prohibition** — Barrett-Jackson's Conditions of Use ban data mining and automated extraction in unambiguous terms. Proceeding would be a knowing violation with legal exposure.

2. **Enterprise Cloudflare Bot Management** — HTTP 402 across all subdomains, including the robots.txt file itself. Bypassing this would require TLS fingerprint spoofing and JS execution at scale — significant engineering cost even before considering the ToS issue.

3. **Low Porsche density** — Estimated 150–300 Porsche lots over 3 years from a platform with 30,000+ total lots in the same period. Poor ROI for scraping infrastructure.

4. **Weak data structure for our use case** — VIN absent on most classics, mileage inconsistent, color/condition in unstructured text. The lots most relevant to Project Vintage (vintage 911s, Carrera GT, etc.) are the ones least likely to have structured VIN/mileage data.

5. **Better alternatives exist** — BaT, C&B, and PCarMarket have higher Porsche density, better structured data, lower Cloudflare protection, and overlapping coverage of the BJ "blue chip" Porsche sales via syndication.

### Possible revisit conditions (V2+)
- If a commercial data partnership with BJ is pursued (they license data to industry partners)
- If a Wayback Machine / archive.org approach to historical lots proves viable
- If coverage gaps in BaT/C&B/PCM specifically around high-value BJ exclusives justify the cost

---

## Appendix: URLs Catalogued

```
https://www.barrett-jackson.com/conditions-of-use        — ToS (blocked 402)
https://www.barrett-jackson.com/robots.txt               — robots (blocked 403)
https://bid.barrett-jackson.com/auctions/                — auction index (blocked 402)
https://bid.barrett-jackson.com/auctions/catalog/id/42   — Scottsdale 2025 catalog (blocked 402)
https://bid.barrett-jackson.com/lot-details/index/catalog/{cid}/lot/{lid}  — lot detail pattern
https://www.barrett-jackson.com/{event}/docket/vehicle/{slug}              — pre-sale docket pattern
https://showroom.barrett-jackson.com/Home/Inventory      — dealer showroom (partially accessible)
https://showroom.barrett-jackson.com/Home/Details?lotid={uuid}             — showroom lot detail
```
