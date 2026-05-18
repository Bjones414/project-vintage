# Transaxle Era Family Reference — 924 · 944 · 968 · 928 (1976–1995)

*Per-family doc | Sections A / B / C*
*Compiled 2026-05-18. Uncertain claims tagged [VERIFY]. Read alongside `canonical-porsche-production.md` §7, `trim-list-audit.md`, and `production-counts.md`.*

---

## Summary

The transaxle era covers four distinct model families sharing one architectural principle: a front-mounted engine connected to a rear-mounted transaxle via a rigid torque tube, placing approximately 50 percent of the car's weight over each axle. All four families are rear-wheel drive only. No AWD variant was ever produced across any of the four families.

**Common platform thread:** 924 → 924 S (adopts 944 engine) → 944 → 944 S2 (944's 3.0L becomes 968's base engine) → 968. These three families share a continuous platform lineage with engine displacement growing 1.98 → 2.48 → 2.99L across ~15 years. The 928 is mechanically separate — its V8, wider body, and higher price point place it in its own comp pool.

**Critical catalog status:** All four model families are **entirely absent** from `lib/porsche/models.ts`. No generation entries exist in `GENERATION_DEFS` for any trim or variant in this era. This is the largest single structural gap in the catalog. Combined road-car production across the four families is approximately **375,000+ units.**

---

## Section A — Catalog Extract

No entries for 924, 944, 968, or 928 exist in `GENERATION_DEFS`. The table below shows expected gen IDs alongside the current catalog state.

| Expected Gen ID | Model | Catalog `yearStart` | Catalog `yearEnd` | Catalog Trims | Catalog Status |
|-----------------|-------|---------------------|-------------------|---------------|----------------|
| `924` | 924 | (not in catalog) | (not in catalog) | (not in catalog) | ⛔ Entirely absent |
| `944` | 944 | (not in catalog) | (not in catalog) | (not in catalog) | ⛔ Entirely absent |
| `968` | 968 | (not in catalog) | (not in catalog) | (not in catalog) | ⛔ Entirely absent |
| `928` | 928 | (not in catalog) | (not in catalog) | (not in catalog) | ⛔ Entirely absent |

No `lib/trim-category/index.ts` routing exists for any of these families. No DB generation seed rows are expected (seed rows are added alongside `models.ts` entries); confirm current `supabase/migrations/` state before implementation.

**Comp engine impact:** `era.ts`, `feature-registry.ts`, `similarity.ts`, and `prior-blend.ts` contain no transaxle-era priors or generation boundaries. Any transaxle-era listing ingested today will fall through to `null` generation and produce a degenerate comp result.

---

## Section B — Canonical Specification Tables

HP figures are SAE net for US-market cars; where EU and US outputs diverge significantly, both are noted. Torque in lb-ft. MSRP is US-market at launch year unless marked (EU). Production figures are worldwide unless marked (US) or (NA). [VERIFY] = figure uncertain or disputed across sources. RACE = race-origin / not road-registered for road-car comp purposes.

---

### B.1 — Porsche 924 (1976–1988)

**Total 924-family road car production: ~138,423** [Source: PCA Tech Q&A]
Internal code: 924. Engine: front-mounted VW/Audi-sourced 2.0L I4. All body styles: Coupé only (no factory Cabriolet).

| Trim | Body | Engine | HP (SAE) | Torque (lb-ft) | Trans | Drive | Curb Wt (lb) | MSRP (USD, launch yr) | WW Production | US Production | Collector Notes |
|------|------|--------|----------|----------------|-------|-------|--------------|----------------------|--------------|--------------|-----------------|
| 924 | Coupé | 1984cc I4 NA (VW/Audi-sourced) | 123 | 122 | 5MT or 3-spd auto | RWD | ~2,370 | $9,395 (1977) | ~121,900 [VERIFY: some cite 122,304] | ~30% of WW | Entry Porsche of its era; widely criticized for non-Porsche engine; good transaxle handling; values remain low; do not comp against 944 |
| 924 Turbo (Series 1) | Coupé | 1984cc I4 turbo | 168 | 181 | 5MT | RWD | ~2,535 | $19,000 (1979) | [VERIFY: sub-split not confirmed within 13,616 total] | ~3,000 US est [VERIFY] | NACA duct hood; vented discs; 60% new parts vs base 924; cracked cylinder heads (coolant passages) most critical known issue |
| 924 Turbo (Series 2) | Coupé | 1984cc I4 turbo (revised cooling) | 175 | 181 | 5MT | RWD | ~2,535 | ~$21,000 (1981) | [VERIFY: sub-split within 13,616 total — see Section C] | [VERIFY] | [VERIFY: "Series 2" is a marque-registry designation for 1981–1983 cars with 177 PS and revised cooling; Porsche AG used "924 Turbo" throughout; confirm factory production distinction before adding as separate trim] |
| 924 Carrera GT | Coupé | 1984cc I4 turbo + intercooler | 207 | 207 | 5MT close-ratio | RWD | ~2,315 | ~$35,000 (1980) | 400 road + 6 proto [Source: evo.co.uk] | ~75 RHD (UK); US alloc [VERIFY] | Homologation special; fiberglass hood and front fenders; intercooled 210 PS; significant values |
| 924 Carrera GTS | Coupé | 1984cc I4 turbo | 242 | ~229 | Close-ratio | RWD | ~2,205 | N/A | 59 [VERIFY] | ~0 | RACE — customer race cars derived from Carrera GT; borderline road-registerable |
| 924 Carrera GTR | Coupé | 1984cc I4 turbo | 370 | ~258 | Close-ratio | RWD | ~2,050 | N/A | 17 [VERIFY] | 0 | RACE — factory works Le Mans 1981 entries; not road-registered |
| 924 S | Coupé | 2479cc I4 NA (944 engine) | 158 | 155 | 5MT | RWD | ~2,535 | $19,900 (1986) | ~16,523 [VERIFY] | ~30% of WW | End-of-life 924 with 944 engine; balance shaft belts critical (same as 944); values remain low |
| 924 S "Le Mans" | Coupé | 2479cc I4 NA (944 engine) | 158 | 155 | 5MT | RWD | ~2,535 | [VERIFY] | [VERIFY: UK-market only; no confirmed unit count in primary sources] | 0 (UK only) | [VERIFY: reportedly a UK-market commemorative edition to mark Le Mans results; confirm with Porsche GB or Porsche Klassik records before adding as distinct trim; may be a cosmetic package only] |

---

### B.2 — Porsche 944 (1982–1991)

**Total 944-family production: 163,192** [Source: Wikipedia 944, consistent with Pelican Parts data]
Internal code: 944. Engine: purpose-designed Porsche 2.5L (SOHC) or 3.0L (DOHC) I4 with twin balance shafts. All body styles: Coupé and Cabriolet (Cabriolet available 1989+ with S2 powertrain only — see Section C).

| Trim | Body | Engine | HP (SAE) | Torque (lb-ft) | Trans | Drive | Curb Wt (lb) | MSRP (USD, launch yr) | WW Production | US Production | Collector Notes |
|------|------|--------|----------|----------------|-------|-------|--------------|----------------------|--------------|--------------|-----------------|
| 944 | Coupé | 2479cc I4 NA (SOHC) | 160 | 151 | 5MT or 3-spd auto | RWD | ~2,778 | $18,450 (1983) | ~113,000 est | ~40% of WW | Most common 944; timing belt + water pump + balance shaft belts must all be replaced together; do not comp against 928 |
| 944 S | Coupé | 2479cc I4 NA (DOHC) | 188 | 170 | 5MT | RWD | ~2,800 | $26,000 (1987) | ~14,000 est [VERIFY] | ~30% of WW | First DOHC 944; two-year run only; DOHC head gasket issues; bridge model to S2 |
| 944 S2 | Coupé | 2990cc I4 NA (DOHC) | 208 | 207 | 5MT | RWD | ~2,910 | $41,900 (1989) | ~16,000 est [VERIFY] | ~30% of WW | Largest-displacement production 4-cyl at launch; shares engine with 968; strong performance; separate comp pool from base 944 |
| 944 S2 Cabriolet | Cabriolet | 2990cc I4 NA (DOHC) | 208 | 207 | 5MT | RWD | ~3,010 | $46,000 (1989) | 5,640 [Source: Rennlist; Pelican Parts] | 2,386 US [Source: Rennlist] | Rare open-top 944; heavier than coupé; separate comp category from S2 Coupé; 2,386 US units well-documented |
| 944 Turbo (951) | Coupé | 2479cc I4 turbo | 217 (1985–87) / 247 (1988–91) | 243 / 258 | 5MT | RWD | ~2,832 | $29,900 (1986) | 25,245 [Source: Wikipedia] | 13,982 US [Source: Wikipedia] | US received majority of production; turbo oil lines and intercooler end-tank leaks are known issues; most balanced 944 |
| 944 Turbo S (951) | Coupé | 2479cc I4 turbo | 247 [Source: auto-data.net] | 258 | 5MT (close-ratio option) | RWD | ~2,832 | ~$55,000 (1988) | ~1,000 est [VERIFY: sources inconsistent] | ~500 US [VERIFY] | Highest-output 944; Cup Design wheels; larger brakes; limited production; appreciating market; [VERIFY] production count before using in confidence scoring |

---

### B.3 — Porsche 968 (1992–1995)

**Total 968 production: 12,776** [Source: PCA Tech Q&A; Wikipedia 968]
Internal code: 968. Engine: 3.0L VarioCam DOHC I4 (direct evolution of 944 S2 engine with variable cam timing added). Final evolution of the 924/944 platform. All variants RWD.

| Trim | Body | Engine | HP (SAE) | Torque (lb-ft) | Trans | Drive | Curb Wt (lb) | MSRP (USD, launch yr) | WW Production | US Production | Collector Notes |
|------|------|--------|----------|----------------|-------|-------|--------------|----------------------|--------------|--------------|-----------------|
| 968 | Coupé | 2990cc I4 NA (VarioCam DOHC) | 237 | 225 | 6MT or 4-spd Tiptronic | RWD | ~3,042 | $42,000 (1992) | ~9,000 est coupé [VERIFY: total 968 = 12,776; Coupé/Cab split unconfirmed in primary sources] | ~2,500 US [VERIFY] | Final and most capable naturally-aspirated transaxle; VarioCam chain tensioner a known issue; values rising strongly |
| 968 Cabriolet | Cabriolet | 2990cc I4 NA (VarioCam DOHC) | 237 | 225 | 6MT or 4-spd Tiptronic | RWD | ~3,197 | $52,000 est (1992) | ~3,776 est [VERIFY: derived by subtraction from 12,776 total; not confirmed in primary sources] | ~500 US est [VERIFY] | Rarer than Coupé; less track-focused; separate comp pool; good values in clean condition |
| 968 Club Sport (CS) | Coupé | 2990cc I4 NA (VarioCam DOHC) | 237 | 225 | 6MT only | RWD | ~2,865 | ~$49,000 EU est [VERIFY] | ~1,578 [VERIFY: range 1,500–1,700 across sources] | Minimal (primarily EU) | Deleted AC, rear wiper, sound deadening; rollcage option; rare in US; significant collector premium over standard 968 Coupé; comp data sparse for US queries |
| 968 Turbo S | Coupé | 2990cc I4 turbo | 301 [Source: Porsche AG] | 369 | 6MT | RWD | ~2,932 | Special order only | 14 [Source: Porsche AG; widely cited] | 0 | Rarest transaxle Porsche; 14 road-legal examples; special-order builds; dominant in single-marque club racing; standard comp logic inapplicable at this volume |
| 968 Turbo RS | Coupé | 2990cc I4 turbo | 345 est | ~332 | 6MT | RWD | ~2,668 | N/A | ~20 [VERIFY] | 0 | RACE — not road-registered; customer race cars; do not include in road-car comp queries |

---

### B.4 — Porsche 928 (1977–1995)

**Total 928 production: ~61,000** [Source: Wikipedia 928; carsales.com.au citing Porsche AG]
Internal code: 928. Engine: front-mounted V8 (4.5 → 4.7 → 5.0 → 5.4L progression). Only transaxle family with a V8; originally intended to replace the 911. Mechanically unrelated to 924/944/968 platform. All variants RWD. 5-speed manual or automatic (model-year specific).

| Trim | Body | Engine | HP (SAE) | Torque (lb-ft) | Trans | Drive | Curb Wt (lb) | MSRP (USD, launch yr) | WW Production | US Production | Collector Notes |
|------|------|--------|----------|----------------|-------|-------|--------------|----------------------|--------------|--------------|-----------------|
| 928 | Coupé | 4474cc V8 NA | 219 (US) / 237 (EU 240 PS) | 258 | 5MT or 3-spd auto | RWD | ~3,219 | $28,000 (1978) | ~11,000 est | ~35% of WW | Motor Trend Car of the Year 1978; timing belt every 30k miles; cam follower wear is dominant issue; US version detuned vs EU |
| 928 S | Coupé | 4664cc V8 NA | ~234 (US) / 296 (EU 300 PS) | 279 (US) / 295 (EU) | 5MT or auto | RWD | ~3,307 | $42,000 (1980) | ~19,000 est [VERIFY] | ~35% of WW | Major power upgrade; EU and US outputs differ significantly — flag US-spec listings vs EU-spec in comp queries; timing belt critical |
| 928 S2 | Coupé | 4664cc V8 NA | [VERIFY: figure not confirmed separately from 928 S] | [VERIFY] | 5MT or auto | RWD | ~3,307 | [VERIFY] | [VERIFY: separate S2 production count not in available primary sources] | [VERIFY] | [VERIFY: "S2" appears in European market documentation and enthusiast registries as a MY designation (approx. 1983–1984) within the 928 S production run; not confirmed as a distinct factory nameplate in Porsche AG records; Porsche Klassik and Ludvigsen are authoritative — see Section C] |
| 928 S3 | Coupé | 4664cc V8 NA [VERIFY: some sources suggest displacement or output change vs S] | [VERIFY] | [VERIFY] | 5MT or auto | RWD | ~3,307 | [VERIFY] | [VERIFY: separate S3 production count not in available primary sources] | [VERIFY] | [VERIFY: same status as S2 — may be an enthusiast/registry label for late-S production (approx. 1984–1986) with incremental updates; no factory designation confirmed in primary sources reviewed] |
| 928 S4 | Coupé | 4957cc V8 NA | 316 [Source: stuttcars.com] | 317 | 5MT or auto | RWD | ~3,439 | $62,000 (1987) | ~15,000 est [Source: supercarnostalgia.com] | ~35% of WW | Major 1987 redesign; integrated bumpers; 32-valve V8; best-selling 928; values appreciating strongly; separate comp pool from S and GT |
| 928 GT | Coupé | 4957cc V8 NA | 326 | 317 | 5MT only (mandatory) | RWD | ~3,439 | $76,000 (1989) | ~2,900 est [VERIFY] | ~600 US est [VERIFY] | Manual-only; meaningfully different comp population from S4 (which was predominantly auto); do not combine with S4 in comp queries |
| 928 GTS | Coupé | 5397cc V8 NA | 345 | 369 | 5MT or auto | RWD | ~3,593 | $83,000 (1993) | ~2,904 [Source: carsales.com.au citing Porsche AG; 77 US final year] | 77 US final year only [Source: carsales.com.au] | Final 928; largest V8; flared rear arches; 17-inch wheels; only 77 US-bound in final year; comp data extremely thin for US-market 1994–1995 GTS; values rising |
| 928 Clubsport | Coupé | 4957cc V8 NA | [VERIFY: likely ~326, similar to GT] | [VERIFY: ~317] | 5MT only [VERIFY] | RWD | [VERIFY: likely lighter than S4] | [VERIFY] | [VERIFY: estimated very low — possibly 10–50 units; no confirmed factory figure in sources reviewed] | [VERIFY: EU only] | [VERIFY: documented in enthusiast literature and Porsche Klassik as a lightweight factory option package for the S4 era, European markets only; primary source confirmation required before adding as catalog trim; if confirmed, treat as limited-production flag similar to 968 Turbo S] |

---

## Section C — Gaps

Ordered by urgency for catalog implementation.

---

### C.1 — STRUCTURAL: All Four Families Absent from Catalog

- **No generation entries in `lib/porsche/models.ts`** for 924, 944, 968, or 928. Adding these families requires new `GenerationDef` objects in `GENERATION_DEFS`. Minimum viable addition: one gen entry per family (`'924'`, `'944'`, `'968'`, `'928'`) with appropriate `yearStart`, `yearEnd`, and `trims` arrays.
- **No `lib/trim-category/index.ts` routing** for any transaxle family. Each new gen ID requires a routing case or an explicit `return null` to prevent fallthrough.
- **No DB generation seed rows** are expected in `supabase/migrations/`; confirm state before running schema migrations alongside `models.ts` additions.
- **Comp engine modules require review:** `era.ts`, `feature-registry.ts`, `similarity.ts`, and `prior-blend.ts` contain no transaxle-era priors, generation boundaries, or feature weights. These must be populated before comp queries on transaxle-era listings will produce reliable output.

---

### C.2 — VERIFY BEFORE ADDING: 924 Turbo Series 1 / Series 2 Split

The scope lists "924 Turbo" and "924 Turbo Series 2" as separate trims. The factory designation **throughout the full production run (1979–1983) was "924 Turbo"** — Porsche AG did not use "Series 1" or "Series 2" in factory literature or VIN documentation.

The 1981 model year update (177 PS vs 170 PS, revised cooling, changed front grille treatment) is real and distinguishable. Several marque registries and PCA technical documents refer to this as a "Series 2" change.

**Decision required before catalog entry:**
- If PCA Panorama or Porsche AG production records confirm a distinct model designation or engine code change at 1981, add `'Turbo Series 2'` as a separate trim from `'Turbo'`.
- If no factory designation change is confirmed, use a single `'Turbo'` trim covering 1979–1983 with a comp-engine annotation that 1981+ cars produce 177 PS and are preferred by collectors.
- **Do not add `'Turbo Series 2'` as a catalog trim without primary source confirmation.** Using an informal registry label in the comp engine creates a category that cannot be reliably matched against listing data.

---

### C.3 — VERIFY BEFORE ADDING: 924 S "Le Mans"

The "924 S Le Mans" reportedly was a UK-market commemorative edition of the 924 S, produced to mark Porsche's 1986 Le Mans results. No production count has been confirmed in primary sources reviewed (Porsche GB, Porsche Klassik, PCA Tech Q&A).

**Action:** Confirm with Porsche GB records or Porsche Klassik before adding. If confirmed as a cosmetic package only (badging and color choices on the standard 924 S powertrain), this does not warrant a separate catalog trim — flag as a special edition note on `'S'`. If confirmed as a mechanically distinct model, add as a separate trim with production count.

---

### C.4 — VERIFY BEFORE ADDING: 944 Base Cabriolet (Non-S2)

The scope includes "944 Cabriolet variants." Available primary sources (Wikipedia 944, Pelican Parts, Rennlist) document the **944 S2 Cabriolet** (5,640 units; 2,386 US) as the convertible variant.

**[VERIFY]** whether a base-engine (2479cc SOHC) 944 Cabriolet was also produced. If no base-engine Cabriolet exists, "944 Cabriolet variants" = `'S2 Cabriolet'` only. Do not add a `'Cabriolet'` trim under the base 944 without confirming production.

---

### C.5 — VERIFY BEFORE ADDING: 928 S2 and S3 Designations

The "S2" and "S3" designations appear in European market documentation and enthusiast registries as shorthand for model-year updates within the **928 S** production run (approximately 1983–1984 for S2, 1984–1986 for S3). These are not confirmed as distinct factory model names in Porsche AG production records reviewed.

**Decision required:**
- If Porsche AG records (Porsche Museum archive) or Porsche Klassik confirm "S2" and "S3" as distinct factory designations with separate engine codes or option codes, add as separate trim entries.
- If they are informal marque-registry labels for incremental updates within the "928 S" run, use a single `'S'` trim covering 1980–1986 with year-range annotations.
- Authoritative sources: Ludvigsen, *Excellence Was Expected* Vol. III; Porsche Klassik issue covering the 928 S era; Porsche Museum production records.

---

### C.6 — VERIFY BEFORE ADDING: 928 Clubsport

The 928 Club Sport is documented in enthusiast literature and at least one Porsche Klassik article as a lightweight factory option for the S4 era in European markets, with extremely limited production (estimates range widely from 7 to ~50 units; no confirmed factory figure found in sources reviewed).

**Action:** Confirm production count and factory designation with Porsche Klassik or PCA Panorama before adding as a catalog trim. If confirmed, apply a `limitedProduction` flag and exclude from standard comp queries (insufficient market data at any plausible volume).

---

### C.7 — RACE-ORIGIN FLAGS REQUIRED

Three trims in the scope are race-origin cars that were not road-registered for public use:
- **924 Carrera GTR** (17 units) — factory Le Mans works cars
- **968 Turbo RS** (~20 units) — customer race cars

One additional trim is borderline (some road registration in certain markets):
- **924 Carrera GTS** (59 units) — customer race cars; some may have been registered

**Action:** Add a `raceOrigin: true` flag or equivalent to the catalog schema if it does not already exist. Exclude race-origin trims from standard road-car comp queries. The 968 Turbo RS should be cataloged but gated from comp output.

---

### C.8 — COMP ENGINE: Cross-Family Architectural Flags

These gaps affect all four families and require implementation in the comp engine, not just the catalog:

**Torque tube condition flag:**
All four families share the torque tube connecting engine to rear transaxle. Torque tube bearing failure is a known failure mode. No existing condition flag addresses this. Add `torque_tube_bearings` to the comp engine's condition flag taxonomy for all transaxle-era listings.

**Timing belt as a hard discount:**
All four families are timing-belt-critical (unlike the chain-driven 911). Undocumented belt service history is effectively the most significant known defect for a buyer. The comp engine's condition scoring should treat missing belt service records as a hard percentage discount for all transaxle-era cars. This is more serious than for water-cooled 911s because belt failure is engine-destructive in all cases.

**924/944/968 platform isolation:**
These three families share a continuous platform. The comp engine must recognize that a 1989 944 S2 and a 1992 968 share engine displacement and architecture. However, for comp purposes, each model designation should remain its own pool — do not allow cross-model comps (944 vs 968) unless explicitly requested.

**928 must be fully isolated:**
The 928 is mechanically unrelated to the 924/944/968 platform despite sharing the transaxle architecture label. Its V8, wider body, substantially higher mass, and different price tier make it unsuitable for any shared comp pool with the front-four-cylinder families. Enforce strict isolation.

**US-spec vs EU-spec 928 S output gap:**
The 928 S in US-market spec produced approximately 220–240 hp (SAE net) due to emissions equipment; EU-spec cars produced 300 PS (296 hp). Listing data that does not indicate market origin will cause significant comp mismatch. Flag 928 S listings without confirmed US-spec documentation for manual review before comp output is generated.

**968 Club Sport US scarcity:**
The 968 CS was rarely sold new in the US. US-market comp queries for the CS will have extremely thin data. Apply a low-confidence flag to any CS comp result and widen the comparable set to include non-CS 968 Coupés with appropriate discount modeling.

---

## Sources

| Source | Used For |
|--------|----------|
| `docs/overnight/canonical-porsche-production.md` §7 | Primary production figures, engine specs, MSRP, known issues for all four families |
| PCA Tech Q&A (via canonical doc citations) | 924 total production (~121,900); 968 total production (12,776) |
| Wikipedia — Porsche 944 | 944 total family production (163,192); Turbo 25,245 / 13,982 US; S2 Cabriolet 5,640 |
| Wikipedia — Porsche 928 | Total 928 production (~61,000) |
| carsales.com.au citing Porsche AG | 928 GTS ~2,904 worldwide; 77 US final-year figure |
| Pelican Parts (via canonical doc) | 924 Turbo total 13,616; 944 family cross-check; S2 Cabriolet US count |
| evo.co.uk (via canonical doc) | 924 Carrera GT road-car count (400 + 6 prototypes) |
| Rennlist forum — 944 registry data (via canonical doc) | 944 S2 Cabriolet US count (2,386) |
| stuttcars.com (via canonical doc) | 928 S4 torque figure |
| supercarnostalgia.com (via canonical doc) | 928 S4 production estimate (~15,000) |
| auto-data.net (via canonical doc) | 944 Turbo S HP (247 SAE) |
| `lib/porsche/models.ts` | Confirmed absence of all four families from GENERATION_DEFS |
| **Recommended — not yet consulted:** | |
| PCA Panorama production data articles | [VERIFY] 924 Turbo Series split; 944 base Cabriolet existence; 944 Turbo S count |
| Porsche Klassik | [VERIFY] 928 Clubsport; 924 S "Le Mans"; 928 S2/S3 designations |
| Ludvigsen, *Excellence Was Expected* Vol. III | [VERIFY] 928 S sub-variant designations; 924 engineering history |
| Porsche Museum Archive / Porsche AG production records | Authoritative resolution for all [VERIFY] items |
| Excellence Magazine — transaxle era retrospectives | Marque specialist corrections; production estimate validation |
| Porsche 356 Registry / PCA marque registries | 924 Turbo Series split confirmation |

---

*Document: `docs/overnight/family-transaxle.md`*
*Date: 2026-05-18 | Status: Research draft — USER TO REVIEW before any catalog implementation*
*Restrictions: Do not modify `lib/porsche/models.ts`, catalog, code, or DB based on this document without human review of all [VERIFY] items. Do not commit or push.*
