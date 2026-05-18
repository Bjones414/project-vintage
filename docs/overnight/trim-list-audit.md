# Porsche Trim-List Audit
**Date:** 2026-05-18
**Auditor:** Claude Code (automated research pass)
**Status:** Ready for developer review — do not implement without verifying flagged items

---

## 1. Data Sources and Governing Files

| File | Role |
|---|---|
| `lib/porsche/models.ts` | Single source of truth — `GENERATION_DEFS` array defines all valid year/model/trim combos |
| `lib/trim-category/index.ts` | Maps raw trim strings to comp-engine category keys per generation |
| `supabase/migrations/` | DB seed for generations table; must stay in sync with models.ts |

The trim-category derivation file (`lib/trim-category/index.ts`) includes a `derive930()` function that routes `'930'` generation IDs, but there is **no `'930'` generation in `GENERATION_DEFS`**. This is a structural orphan — code paths exist that can never be reached with valid catalog data.

---

## 2. Executive Summary

| Category | Count |
|---|---|
| Confirmed missing trims (factory production models absent from catalog) | 27 |
| Trims present but needing review/annotation | 9 |
| Entire models absent from models.ts (356, 912) | 2 |
| Generation ID structural issues | 2 (930 orphan; pre-964 compression) |
| Year boundary issues | 4 |
| Sort order issues | 0 (models.ts order is correct; issue exists only in DB seed layer) |

**Critical gaps:** The 993 Speedster is listed in the catalog but was NOT a factory production trim (only 2 bespoke commissions exist). The 981 Cayman GT4 RS did not exist as a factory model. The 997.1 Turbo S did not exist. The 964 Turbo 3.6 is unlisted despite being a distinct factory model from the 3.3. The 996 Targa belongs in 996.2 only, not 996.1. The Taycan 4 is missing. The Macan Gen II trim names are entirely wrong for the EV generation.

---

## 3. Per-Generation Tables

---

### 3.1 Porsche 356 (1948–1965)

> **Structural note:** The 356 is entirely absent from `models.ts`. The DB generations seed contains four 356 generation rows. This section documents what the catalog should contain if the 356 is added.

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Coupe | ❌ Missing from catalog | Flat-4, 1100–1600cc, 40–90hp (varies by year/tune) | 4-speed manual | RWD | 1950–1965 | Core body style across all 356 series |
| Cabriolet | ❌ Missing from catalog | Flat-4, various | 4-speed manual | RWD | 1950–1965 | Open-top; offered across all series |
| Speedster | ❌ Missing from catalog | Flat-4, 1500–1600cc | 4-speed manual | RWD | 1954–1958 | Ultra-low windscreen; 356 A era only |
| Roadster | ❌ Missing from catalog | Flat-4 | 4-speed manual | RWD | 1960–1962 | 356 B T5/T6 era; replaced Speedster |
| Hardtop-Coupe | ❌ Missing from catalog | Flat-4 | 4-speed manual | RWD | 1961–1965 | Notchback; 356 B and C only |
| Carrera (GT) | ❌ Missing from catalog | Flat-4 Carrera, 1500–2000cc, 4-cam, 100–130hp | 4-speed manual | RWD | 1955–1965 | High-performance 4-cam variant; very rare |

**Proposed additions:** If the 356 is added to models.ts, the recommended trim list per sub-generation is:

- **356 pre-A (1948–1955):** Coupe, Cabriolet
- **356 A (1956–1959):** Coupe, Cabriolet, Speedster, Carrera
- **356 B (1960–1963):** Coupe, Cabriolet, Roadster, Hardtop-Coupe, Carrera
- **356 C (1964–1965):** Coupe, Cabriolet, Carrera

**Structural note:** Adding the 356 requires 4 new generation entries in `GENERATION_DEFS` and corresponding additions to `lib/trim-category/index.ts`. The DB generations seed already has the rows; the gap is in models.ts only.

---

### 3.2 Porsche 912 (1965–1969)

> **Structural note:** The 912 is entirely absent from `models.ts`. It is a distinct model (not a 911 trim) with a flat-four engine in the 911 body.

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Coupe | ❌ Missing from catalog | Flat-4, 1582cc/1.6L, 90hp (Type 616/36); 102hp SAE from 1968 | 4-speed manual (5-speed opt.) | RWD | 1965–1969 | ~28,000 units; backbone of 912 production |
| Targa | ❌ Missing from catalog | Flat-4, 1582cc/1.6L | 4-speed manual | RWD | 1967–1969 | ~2,500 units; Targa body introduced 1967 |

**Proposed generation entry:**
```
{ genId: '912', model: '912', yearStart: 1965, yearEnd: 1969, trims: ['Coupe', 'Targa'] }
```

**Notes:** The 912 is an entry-level companion to the 911, using the 356's flat-four engine. Total production ~32,000 units. A separate `912E` was sold in the US for 1976 only (using a VW/Porsche 2.0L flat-four) — this is a collector item but very low production (~2,099 units). The 912E is a separate discussion; it does not belong in the 1965–1969 912 generation entry.

---

### 3.3 pre-964 / Early 911 (1965–1988)

> **Note:** models.ts uses a single `pre-964` generation covering 1965–1988. This is a deliberate simplification that compresses the 0-series, F-series, and G-series into one entry. The DB seed has separate rows for 911-0, 911-F, and 911-G. The discussion below covers the gap between these two layers.

**Sub-generation context (for reference, not necessarily for models.ts):**
- 911 0-series: 1963–1965 (2.0L, 130hp)
- 911 F-series: 1966–1973 (trim tiers: T, E, S)
- 911 G-series: 1974–1989 (impact bumpers; simplified tiers; 911 SC introduced 1978; Carrera 3.2 from 1984)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | Various; 2.7L–3.2L | 5-speed manual | RWD | 1973–1977, 1984–1989 | Covers both the 2.7 Carrera and the G-series Carrera |
| Carrera RS | ✅ Confirmed in catalog | 2.7L flat-6, 210hp | 5-speed manual | RWD | 1972–1974 | Homologation car; ~1,580 units |
| Carrera 3.2 | ✅ Confirmed in catalog | 3.2L flat-6, 231hp | G50 5-speed manual | RWD | 1984–1989 | Last naturally-aspirated pre-964 Carrera |
| Targa | ✅ Confirmed in catalog | Various | Various | RWD | 1967–1988 | Body style offered across many sub-gens |
| Turbo | ✅ Confirmed in catalog | 3.0L/3.3L flat-6 turbocharged | 4-speed manual | RWD | 1975–1989 | 930-series; internal code "930" |
| Turbo 3.3 | ✅ Confirmed in catalog | 3.3L flat-6 turbo, 300PS | 4-speed manual | RWD | 1978–1989 | Specific designation for 3.3L upgrade |
| SC | ✅ Confirmed in catalog | 3.0L flat-6, 180hp | 5-speed manual | RWD | 1978–1983 | Replaced 911S; predecessor to Carrera 3.2 |
| Speedster | ✅ Confirmed in catalog | 3.2L flat-6, 231hp | G50 5-speed manual | RWD | 1988–1989 | ~2,103 units; G-series Speedster |
| 911T | ❌ Missing from catalog | 2.0–2.4L flat-6, 110–140hp | 4- or 5-speed | RWD | 1967–1973 | F-series entry-level trim; high-volume |
| 911E | ❌ Missing from catalog | 2.0–2.4L flat-6, 125–165hp | 4-speed manual | RWD | 1968–1973 | F-series mid-tier trim |
| 911S | ❌ Missing from catalog | 2.0–2.7L flat-6, 160–210hp | 5-speed manual | RWD | 1966–1977 | F-series and early G-series top trim |

**Proposed additions for pre-964 generation:**
The `pre-964` generation (1965–1988) currently omits the F-series trim designations (T, E, S) used 1966–1973. These are distinct collector categories with different valuation profiles. They should be added as `'911T'`, `'911E'`, `'911S'`.

**Structural note regarding the 930 orphan in trim-category/index.ts:** The derivation file has a `case '930'` branch, but `'930'` is not a valid `genId` in models.ts. This means any listing that arrives with `generation_id = '930'` from the DB will match this branch — but the catalog has no way to produce that generation ID. Either:
1. Add a `'930'` generation entry in models.ts (covering 930 Turbo 1975–1989), or
2. Remove the `derive930()` case and route it through the existing `'pre-964'` handling.

Option 1 is more accurate for comp-engine purposes because the 930 Turbo has a completely different valuation profile than a naturally-aspirated pre-964 911.

---

### 3.4 964 (1989–1993)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera 2 | ✅ Confirmed in catalog | 3.6L flat-6, 247hp | G50 5-speed manual or Tiptronic | RWD | 1989–1993 | Coupe, Cabriolet, Targa body styles |
| Carrera 4 | ✅ Confirmed in catalog | 3.6L flat-6, 247hp | G64 5-speed manual | AWD | 1989–1991 | First AWD 911 |
| Carrera 4S | ⚠️ Present but needs review | 3.6L flat-6, 247hp | Manual | AWD | [VERIFY: 964 C4S existed?] | The 993 introduced the C4S wide body; the 964 did not have a C4S. This entry is **incorrect** — remove |
| Turbo | ✅ Confirmed in catalog | 3.6L flat-6 turbo, 360hp | 5-speed manual | AWD | 1992–1993 | Note: "Turbo" in catalog should mean the 3.6 |
| Turbo 3.3 | ✅ Confirmed in catalog | 3.3L flat-6 turbo, 320hp | 4-speed manual | RWD | 1991–1992 MY | Carry-over 930 engine; MY 1991–1992 only |
| Turbo 3.6 | ❌ Missing from catalog | 3.6L flat-6 turbo, 360hp | 5-speed manual | AWD | 1993 MY | Distinct from Turbo 3.3; 1,407 units; different performance |
| Turbo S (Leichtbau) | ❌ Missing from catalog | 3.3L flat-6 turbo, 381hp | 4-speed manual | RWD | 1992–1993 | Only 86 units; "X85" or "Turbo S Leichtbau"; ultra-rare |
| RS | ✅ Confirmed in catalog | 3.6L flat-6, 260hp | G50 5-speed | RWD | 1991–1992 MY | Homologation RS; coupe/touring/N/GT specs |
| RS America | ✅ Confirmed in catalog | 3.6L flat-6, 247hp | G50 5-speed | RWD | 1992–1993 MY | US-market lightweight; ~701 units |
| Speedster | ✅ Confirmed in catalog | 3.6L flat-6, 247hp | G50 5-speed | RWD | 1993 MY | Wide-body or narrow; ~936 units total |
| Targa | ✅ Confirmed in catalog | 3.6L flat-6, 247hp | G50 5-speed or Tiptronic | RWD | 1990–1993 | Standard Targa body (removable roof panel) |
| America Roadster | ❌ Missing from catalog | 3.6L flat-6, 247hp | G50 5-speed only | RWD | 1992–1993 MY | ~250–326 units; US-only; Turbo wide body + Cab body |

**Proposed additions:**
- **Turbo 3.6** — The 964 Turbo was the 3.3 for MY1991–1992, then the 3.6 for MY1992–1993 (production began Oct 1992). Currently the catalog lists "Turbo" and "Turbo 3.3" but omits "Turbo 3.6". The "Turbo" entry is ambiguous. Recommended: rename "Turbo" → "Turbo 3.6" and keep "Turbo 3.3" as a separate entry, or keep "Turbo" as a generic covering the 3.6 and annotate it clearly.
- **Turbo S** (Leichtbau) — 86 units, 1992–1993. Factory Exclusive car. Distinct from standard Turbo; separate comp category warranted.
- **America Roadster** — Factory-built cabriolet on Carrera 2 platform with Turbo body, 5-speed only, US-market, ~250–326 units. This is a distinct collectible trim, not merely a body-style sub-variant of Carrera 2. Warrants its own trim entry `"America Roadster"`.

**Removal required:**
- **Carrera 4S** — This trim did NOT exist for the 964 generation. The Carrera 4S wide body was introduced with the 993 in 1996. The 964 had Carrera 2 and Carrera 4 (and narrow/wide Speedster, RS) but no C4S. **Remove `'Carrera 4S'` from the 964 generation in models.ts.**

**Sort order note:** models.ts lists `['Carrera 2', 'Carrera 4', ...]` which is correct. The DB taxonomy seed lists `carrera_2_narrow` before `carrera_4_narrow`, which is also correct. No sort order issue at the models.ts level.

---

### 3.5 993 (1994–1998)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.6L flat-6, 272hp | G50/02 6-speed | RWD | 1994–1998 | Narrow body; Coupe and Cabriolet |
| Carrera S | ✅ Confirmed in catalog | 3.6L flat-6, 285hp | 6-speed | RWD | 1997–1998 | Wide Turbo-look body; final 2 years only |
| Carrera 4 | ✅ Confirmed in catalog | 3.6L flat-6, 272hp | 6-speed | AWD | 1994–1998 | Narrow body AWD |
| Carrera 4S | ✅ Confirmed in catalog | 3.6L flat-6, 272hp | 6-speed | AWD | **1996–1998** | Wide Turbo body + AWD; first year is 1996, not 1994 |
| Targa | ✅ Confirmed in catalog | 3.6L flat-6, 272hp | 6-speed | RWD | 1995–1998 | Glass sliding Targa roof |
| Turbo | ✅ Confirmed in catalog | 3.6L twin-turbo, 408hp | 6-speed | AWD | 1995–1998 | ~5,978 total; biturbo |
| Turbo S | ✅ Confirmed in catalog | 3.6L twin-turbo, 450hp | 6-speed | AWD | 1997–1998 | ~345–435 units; factory Exclusive |
| GT2 | ✅ Confirmed in catalog | 3.6L twin-turbo, 430hp | 6-speed | RWD | 1995–1998 | ~57 road + 78 racing; also "GT2 Clubsport" variant |
| RS | ✅ Confirmed in catalog | 3.8L flat-6, 300hp | 6-speed | RWD | 1995–1996 | "Carrera RS"; Club Sport and Touring variants |
| Speedster | ⚠️ Present but needs review | N/A | N/A | N/A | **Not a production trim** | Only 2 bespoke factory commissions (F.A. Porsche 1995; Jerry Seinfeld 1998). NOT a factory production model. |

**Removal required:**
- **Speedster** — The 993 Speedster was NOT a factory production trim. Only 2 cars were built by the Exclusiv department as individual commissions. This entry should be removed from the 993 generation or clearly flagged as a bespoke/special-build-only designation that should never match in a comp query.

**Year boundary note for Carrera 4S:** The catalog start year for the 993 generation is 1994, but the Carrera 4S was not available until the 1996 model year. Valuation logic using year + trim must account for this — a "993 Carrera 4S 1994" is impossible. No change needed in models.ts (the generation-level year range is correct), but the year-aware validation function `isValidCombination` does not check this sub-trim year gap. Flag for future validation refinement.

---

### 3.6 996 (996.1: 1999–2001 / 996.2: 2002–2004)

#### 996.1 (1999–2001)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.4L flat-6, 300hp (M96) | 6-speed manual or 5-speed Tiptronic | RWD | 1999–2001 | Water-cooled engine debut |
| Carrera 4 | ✅ Confirmed in catalog | 3.4L flat-6, 300hp | 6-speed or Tiptronic | AWD | 1999–2001 | |
| Carrera 4S | ⚠️ Present but needs review | — | — | — | **Does not exist for 996.1** | C4S (wide body) was not offered in 996.1 (1999–2001); it arrived with the 996.2 facelift in 2002. **Remove from 996.1** |
| Turbo | ✅ Confirmed in catalog | 3.6L twin-turbo, 420hp | 6-speed manual | AWD | 2001 MY (996.1 year) | Launched mid-cycle; first MY was 2001 |
| GT3 | ✅ Confirmed in catalog | 3.6L flat-6, 360hp | 6-speed | RWD | 1999–2001 | First 996 GT3 (Metzger engine); 996.1 only |
| Targa | ❌ Missing from catalog | 3.4L flat-6, 300hp | 6-speed or Tiptronic | RWD | **2002–2005** | 996 Targa did NOT exist in 1999–2001. The glass Targa roof debuted only with the 996.2 facelift in 2002. **Remove from 996.1; add to 996.2** |

**Summary of 996.1 changes:**
- Remove `Carrera 4S` (not available until 996.2)
- Remove `Targa` (not available until 996.2)

#### 996.2 (2002–2004)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.6L flat-6, 320hp (M96.03) | 6-speed or Tiptronic | RWD | 2002–2004 | Facelift model; new headlights |
| Carrera S | ✅ Confirmed in catalog | 3.6L flat-6, 320hp | 6-speed | RWD | 2002–2004 | Narrow body S; not wide-body |
| Carrera 4 | ✅ Confirmed in catalog | 3.6L flat-6, 320hp | 6-speed or Tiptronic | AWD | 2002–2004 | |
| Carrera 4S | ✅ Confirmed in catalog | 3.6L flat-6, 320hp | 6-speed | AWD | 2002–2004 | Wide Turbo body; introduced 2002 |
| Targa | ✅ Confirmed in catalog | 3.6L flat-6, 320hp | 6-speed or Tiptronic | RWD | 2002–2004 | Glass roof Targa; first 996 Targa |
| Turbo | ✅ Confirmed in catalog | 3.6L twin-turbo, 420hp | 6-speed | AWD | 2002–2004 | |
| Turbo S | ✅ Confirmed in catalog | 3.6L twin-turbo, 450hp | 6-speed | AWD | 2004–2005 | [VERIFY: MY2004 or 2005?] |
| GT3 | ✅ Confirmed in catalog | 3.6L flat-6, 381hp | 6-speed | RWD | 2003–2004 | Second GT3 ("GT3 Mk2") |
| GT3 RS | ✅ Confirmed in catalog | 3.6L flat-6, 381hp | 6-speed | RWD | 2003–2004 | Lightweight RS variant |
| GT2 | ✅ Confirmed in catalog | 3.6L twin-turbo, 462hp | 6-speed | RWD | 2002–2004 | |

**No changes needed for 996.2** (beyond migrating Targa from 996.1 to here).

---

### 3.7 997 (997.1: 2005–2008 / 997.2: 2009–2012)

#### 997.1 (2005–2008)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.6L flat-6, 325hp | 6-speed manual or Tiptronic | RWD | 2005–2008 | |
| Carrera S | ✅ Confirmed in catalog | 3.8L flat-6, 355hp | 6-speed or Tiptronic | RWD | 2005–2008 | |
| Carrera 4 | ✅ Confirmed in catalog | 3.6L flat-6, 325hp | 6-speed | AWD | 2006–2008 | |
| Carrera 4S | ✅ Confirmed in catalog | 3.8L flat-6, 355hp | 6-speed | AWD | 2006–2008 | |
| Targa 4 | ✅ Confirmed in catalog | 3.6L flat-6, 325hp | 6-speed | AWD | 2007–2008 | Glass roof Targa; AWD only |
| Targa 4S | ✅ Confirmed in catalog | 3.8L flat-6, 355hp | 6-speed | AWD | 2007–2008 | |
| Turbo | ✅ Confirmed in catalog | 3.6L twin-turbo, 480hp | 6-speed manual or Tiptronic S | AWD | 2007–2008 MY | Launched 2006 for MY2007 |
| Turbo S | ⚠️ Present but needs review | — | — | — | **Did NOT exist for 997.1** | The 997 Turbo S was only available in the 997.2 generation (from MY2010). **Remove from 997.1** |
| GT3 | ✅ Confirmed in catalog | 3.6L flat-6, 415hp | 6-speed manual | RWD | 2006–2009 | |
| GT3 RS | ✅ Confirmed in catalog | 3.6L flat-6, 415–450hp | 6-speed | RWD | 2006–2009 | 997.1 RS used 3.6L |
| GT2 | ✅ Confirmed in catalog | 3.6L twin-turbo, 530hp | 6-speed | RWD | 2008 | Rear-wheel-drive Turbo flagship |
| RS 60 Spyder Edition | ❌ Missing from catalog | 3.4L flat-6, 303hp | 6-speed | RWD | 2008 MY | 1,960 units; special edition based on Boxster S |

**Changes needed for 997.1:**
- Remove `Turbo S` (wrong generation — it belongs in 997.2 only)

**Note on RS 60 Spyder:** This is a Boxster (987.1) special edition, not a 911. It belongs in the 987.1-boxster generation. See Boxster section.

#### 997.2 (2009–2012)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.6L flat-6, 345hp | PDK or 6-speed | RWD | 2009–2012 | |
| Carrera S | ✅ Confirmed in catalog | 3.8L flat-6, 385hp | PDK or 6-speed | RWD | 2009–2012 | |
| Carrera 4 | ✅ Confirmed in catalog | 3.6L flat-6, 345hp | PDK or 6-speed | AWD | 2009–2012 | |
| Carrera 4S | ✅ Confirmed in catalog | 3.8L flat-6, 385hp | PDK or 6-speed | AWD | 2009–2012 | |
| Carrera GTS | ✅ Confirmed in catalog | 3.8L flat-6, 408hp | PDK or 6-speed | RWD | 2011–2012 | |
| Carrera 4 GTS | ✅ Confirmed in catalog | 3.8L flat-6, 408hp | PDK or 6-speed | AWD | 2011–2012 | |
| Targa 4 | ✅ Confirmed in catalog | 3.6L flat-6, 345hp | PDK or 6-speed | AWD | 2009–2012 | |
| Targa 4S | ✅ Confirmed in catalog | 3.8L flat-6, 385hp | PDK or 6-speed | AWD | 2009–2012 | |
| Turbo | ✅ Confirmed in catalog | 3.8L twin-turbo, 500hp | PDK | AWD | 2010–2012 | |
| Turbo S | ✅ Confirmed in catalog | 3.8L twin-turbo, 530hp | PDK | AWD | 2010–2012 | First 997 Turbo S; MY2010 launch |
| GT3 | ✅ Confirmed in catalog | 3.8L flat-6, 435hp | 6-speed | RWD | 2009–2012 | |
| GT3 RS | ✅ Confirmed in catalog | 3.8L flat-6, 450hp | 6-speed | RWD | 2009–2012 | |
| GT2 RS | ✅ Confirmed in catalog | 3.6L twin-turbo, 620hp | PDK | RWD | 2011–2012 | 500 units; most powerful 997 |
| R | ✅ Confirmed in catalog | 3.8L flat-6, 500hp (naturally aspirated) | 6-speed | RWD | 2011 | 356 units; GT3 RS engine; manual only |
| Sport Classic | ❌ Missing from catalog | 3.8L flat-6, 408hp | 6-speed manual only | RWD | 2010 MY | 250 units; Porsche Exclusive; ducktail; gray only |
| Speedster | ❌ Missing from catalog | 3.8L flat-6, 408hp | PDK only | RWD | 2011 MY | 356 units; Carrera GTS engine; very collectible |

**Proposed additions for 997.2:**
- `'Sport Classic'` — 250 units, 2010 MY, manual-only, RWD, Exclusive department
- `'Speedster'` — 356 units, 2011 MY, PDK-only, RWD

---

### 3.8 991 (991.1: 2012–2015 / 991.2: 2016–2018 [some 2019 MY])

#### 991.1 (2012–2015)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.4L flat-6, 350hp | PDK or 7-speed manual | RWD | 2012–2015 | |
| Carrera S | ✅ Confirmed in catalog | 3.8L flat-6, 400hp | PDK or 7-speed | RWD | 2012–2015 | |
| Carrera 4 | ✅ Confirmed in catalog | 3.4L flat-6, 350hp | PDK | AWD | 2013–2015 | |
| Carrera 4S | ✅ Confirmed in catalog | 3.8L flat-6, 400hp | PDK | AWD | 2013–2015 | |
| Carrera GTS | ✅ Confirmed in catalog | 3.8L flat-6, 430hp | PDK or 7-speed | RWD | 2015 MY | |
| Carrera 4 GTS | ✅ Confirmed in catalog | 3.8L flat-6, 430hp | PDK | AWD | 2015 MY | |
| Targa 4 | ✅ Confirmed in catalog | 3.4L flat-6, 350hp | PDK | AWD | 2014–2015 | |
| Targa 4S | ✅ Confirmed in catalog | 3.8L flat-6, 400hp | PDK | AWD | 2014–2015 | |
| Targa 4 GTS | ❌ Missing from catalog | 3.8L flat-6, 430hp | PDK or 7-speed | AWD | 2015–2016 MY | Announced Jan 2015 at NAIAS; confirmed 991.1 variant |
| Turbo | ✅ Confirmed in catalog | 3.8L twin-turbo, 520hp | PDK | AWD | 2014–2015 | |
| Turbo S | ✅ Confirmed in catalog | 3.8L twin-turbo, 560hp | PDK | AWD | 2014–2015 | |
| GT3 | ✅ Confirmed in catalog | 3.8L flat-6, 475hp | PDK | RWD | 2013–2015 | |
| GT3 RS | ✅ Confirmed in catalog | 4.0L flat-6, 500hp | PDK | RWD | 2015–2016 MY | First year MY2015; confirmed in 991.1 era |

**Proposed addition for 991.1:**
- `'Targa 4 GTS'` — Announced January 2015 (NAIAS); available as 991.1 for MY2015–2016. Engine: 3.8L NA flat-six, 430hp. Transmission: PDK or 7-speed manual. Drivetrain: AWD.

#### 991.2 (2016–2018, some 2019 MY)

> **Year boundary note:** The catalog marks 991.2 as 2016–2018. In practice, 991.2 production continued into 2019 for certain variants (Speedster, Sport Classic, final year). The year boundary should be 2016–2019 to accommodate these swan-song models.

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.0L twin-turbo, 370hp | PDK or 7-speed | RWD | 2016–2019 | New turbocharged Carrera |
| Carrera S | ✅ Confirmed in catalog | 3.0L twin-turbo, 420hp | PDK or 7-speed | RWD | 2016–2019 | |
| Carrera 4 | ✅ Confirmed in catalog | 3.0L twin-turbo, 370hp | PDK or 7-speed | AWD | 2016–2019 | |
| Carrera 4S | ✅ Confirmed in catalog | 3.0L twin-turbo, 420hp | PDK or 7-speed | AWD | 2016–2019 | |
| Carrera GTS | ✅ Confirmed in catalog | 3.0L twin-turbo, 450hp | PDK or 7-speed | RWD | 2017–2019 | |
| Carrera 4 GTS | ✅ Confirmed in catalog | 3.0L twin-turbo, 450hp | PDK or 7-speed | AWD | 2017–2019 | |
| Targa 4 | ✅ Confirmed in catalog | 3.0L twin-turbo, 370hp | PDK | AWD | 2016–2019 | |
| Targa 4S | ✅ Confirmed in catalog | 3.0L twin-turbo, 420hp | PDK | AWD | 2016–2019 | |
| Targa 4 GTS | ❌ Missing from catalog | 3.0L twin-turbo, 450hp | PDK or 7-speed | AWD | 2017–2019 | Launched Jan 2017; confirmed 991.2 variant |
| Turbo | ✅ Confirmed in catalog | 3.8L twin-turbo, 540hp | PDK | AWD | 2016–2019 | |
| Turbo S | ✅ Confirmed in catalog | 3.8L twin-turbo, 580hp | PDK | AWD | 2016–2019 | |
| GT3 | ✅ Confirmed in catalog | 4.0L flat-6, 500hp | PDK or 6-speed | RWD | 2017–2019 | |
| GT3 RS | ✅ Confirmed in catalog | 4.0L flat-6, 520hp | PDK | RWD | 2018–2019 | |
| GT2 RS | ✅ Confirmed in catalog | 3.8L twin-turbo, 700hp | PDK | RWD | 2018–2019 | 1,000 units |
| R | ✅ Confirmed in catalog | 4.0L flat-6, 500hp | 6-speed manual | RWD | 2016 MY | 991 units; GT3 RS engine; manual-only |
| Speedster | ❌ Missing from catalog | 4.0L flat-6, 502hp | 6-speed GT Sport manual | RWD | 2019 MY | 1,948 units; swan-song 991.2; GT3 chassis |
| Sport Classic | ❌ Missing from catalog | [VERIFY: did 991.2 Sport Classic exist?] | — | — | [VERIFY] | Research found references but could not confirm a 991.2-era Sport Classic. The 997 Sport Classic is confirmed 2010. The 992 Sport Classic is confirmed 2022–2023. **[VERIFY] whether a 991.2 Sport Classic exists.** |

**Proposed additions for 991.2:**
- `'Targa 4 GTS'` — 3.0L twin-turbo, 450hp, AWD, PDK or 7-speed manual, MY2017–2019
- `'Speedster'` — 4.0L NA, 502hp, 6-speed manual, RWD, MY2019, 1,948 units

**Year boundary fix:** Change `yearEnd: 2018` → `yearEnd: 2019` to accommodate the Speedster and any other 2019 MY 991.2 production.

---

### 3.9 992 (992.1: 2019–2023 / 992.2: 2024–present)

#### 992.1 (2019–2023)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.0L twin-turbo, 385hp | PDK or 8-speed | RWD | 2019–2023 | |
| Carrera S | ✅ Confirmed in catalog | 3.0L twin-turbo, 443hp | PDK or 8-speed | RWD | 2019–2023 | |
| Carrera 4 | ✅ Confirmed in catalog | 3.0L twin-turbo, 385hp | PDK or 8-speed | AWD | 2019–2023 | |
| Carrera 4S | ✅ Confirmed in catalog | 3.0L twin-turbo, 443hp | PDK or 8-speed | AWD | 2019–2023 | |
| Carrera GTS | ✅ Confirmed in catalog | 3.0L twin-turbo, 473hp | PDK or 7-speed | RWD | 2022–2023 | |
| Carrera 4 GTS | ✅ Confirmed in catalog | 3.0L twin-turbo, 473hp | PDK or 7-speed | AWD | 2022–2023 | |
| Targa 4 | ✅ Confirmed in catalog | 3.0L twin-turbo, 385hp | PDK | AWD | 2021–2023 | |
| Targa 4S | ✅ Confirmed in catalog | 3.0L twin-turbo, 443hp | PDK | AWD | 2021–2023 | |
| Targa 4 GTS | ❌ Missing from catalog | 3.0L twin-turbo, 473hp | PDK or 7-speed | AWD | 2022–2023 | Launched June 2021 for MY2022; confirmed |
| Turbo | ✅ Confirmed in catalog | 3.8L twin-turbo, 572hp | PDK | AWD | 2021–2023 | |
| Turbo S | ✅ Confirmed in catalog | 3.8L twin-turbo, 640hp | PDK | AWD | 2021–2023 | |
| GT3 | ✅ Confirmed in catalog | 4.0L flat-6, 502hp | PDK or 6-speed | RWD | 2022–2023 | |
| GT3 RS | ✅ Confirmed in catalog | 4.0L flat-6, 525hp | PDK | RWD | 2023 | |
| Carrera T | ❌ Missing from catalog | 3.0L twin-turbo, 385hp | 7-speed manual (standard) or PDK | RWD | 2023–2024 MY | Lightweight purist variant; between Carrera and S |
| Sport Classic | ❌ Missing from catalog | 3.7L twin-turbo, 543hp | 7-speed manual only | RWD | 2022–2023 | 1,250 units; ducktail; Turbo S engine detuned |
| Dakar | ❌ Missing from catalog | 3.0L twin-turbo, 473hp (C4 GTS tune) | 8-speed PDK | AWD | 2023–2024 MY | 2,500 units; off-road focused; raised ride height |
| S/T | ❌ Missing from catalog | 4.0L flat-6, 525hp | 6-speed manual only | RWD | 2024 MY | 1,963 units; GT3 RS engine; lightest 992; 60th anniv. |
| GT3 Touring | ❌ Missing from catalog | 4.0L flat-6, 502hp | 6-speed manual or PDK | RWD | 2022–2023 | Discreet no-wing GT3; different market segment |

**Proposed additions for 992.1:**
- `'Targa 4 GTS'` — 3.0L T, 473hp, AWD, MY2022–2023
- `'Carrera T'` — 3.0L T, 385hp, 7-speed manual, RWD, MY2023
- `'Sport Classic'` — 3.7L T, 543hp, 7-speed manual only, RWD, 1,250 units, MY2022–2023
- `'Dakar'` — 3.0L T, 473hp, PDK, AWD, 2,500 units, MY2023–2024
- `'S/T'` — 4.0L NA, 525hp, 6-speed manual, RWD, 1,963 units, MY2024
- `'GT3 Touring'` — 4.0L NA, 502hp, manual or PDK, RWD, MY2022–2023

#### 992.2 (2024–present)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed in catalog | 3.0L twin-turbo, 394hp | PDK or 8-speed | RWD | 2024– | +9hp vs. 992.1 Carrera |
| Carrera S | ✅ Confirmed in catalog | 3.0L twin-turbo, 443hp | PDK | RWD | 2024– | |
| Carrera 4 | ✅ Confirmed in catalog | 3.0L twin-turbo, 394hp | PDK | AWD | 2024– | |
| Carrera 4S | ✅ Confirmed in catalog | 3.0L twin-turbo, 443hp | PDK | AWD | 2024– | |
| Carrera GTS | ✅ Confirmed in catalog | 3.6L T-Hybrid, 541hp | PDK | RWD | 2024– | First hybrid 911; T-Hybrid with electric turbo |
| Carrera 4 GTS | ✅ Confirmed in catalog | 3.6L T-Hybrid, 541hp | PDK | AWD | 2024– | |
| Targa 4 | ✅ Confirmed in catalog | 3.0L twin-turbo, 394hp | PDK | AWD | 2024– | |
| Targa 4S | ✅ Confirmed in catalog | 3.0L twin-turbo, 443hp | PDK | AWD | 2024– | |
| Targa 4 GTS | ❌ Missing from catalog | 3.6L T-Hybrid, 541hp | PDK | AWD | 2024– | Confirmed available per Porsche USA; same T-Hybrid |
| Turbo | ✅ Confirmed in catalog | [VERIFY 992.2 Turbo engine] | PDK | AWD | 2024– | |
| Turbo S | ✅ Confirmed in catalog | 3.7L twin-turbo + T-Hybrid, 700hp | PDK | AWD | 2024– | Also gains T-Hybrid system |
| GT3 | ✅ Confirmed in catalog | 4.0L flat-6 | 6-speed or PDK | RWD | 2025– | |
| GT3 RS | ✅ Confirmed in catalog | 4.0L flat-6, 525hp | PDK | RWD | 2025– | |
| Carrera T | ❌ Missing from catalog | 3.0L twin-turbo, 394hp | 7-speed manual (std) | RWD | 2025– | Carries forward from 992.1; confirmed 992.2 variant |
| GT3 Touring | ❌ Missing from catalog | 4.0L flat-6 | Manual or PDK | RWD | 2025– | Confirmed for 992.2 |

**Proposed additions for 992.2:**
- `'Targa 4 GTS'` — confirmed at launch
- `'Carrera T'` — confirmed continuation from 992.1
- `'GT3 Touring'` — confirmed continuation

---

### 3.10 Boxster (All Generations)

#### 986 Boxster (1997–2004)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.5L/2.7L flat-6, 201–228hp | 5-speed manual or Tiptronic | RWD | 1997–2004 | |
| S | ✅ Confirmed in catalog | 2.7L/3.2L flat-6, 252–260hp | 6-speed manual or Tiptronic | RWD | 2000–2004 | S added for MY2000 |

**No additions needed.** The 986 Boxster had only two factory production trims (Base and S). Special editions (e.g. the "Black Edition") used base trim designations.

#### 987.1 Boxster (2005–2008)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.7L flat-6, 245hp | 6-speed manual or Tiptronic | RWD | 2005–2008 | |
| S | ✅ Confirmed in catalog | 3.4L flat-6, 295hp | 6-speed manual or Tiptronic | RWD | 2005–2008 | |
| RS 60 Spyder Edition | ❌ Missing from catalog | 3.4L flat-6, 303hp | 6-speed manual | RWD | 2008 MY | 1,960 units; Boxster S basis; special edition trim |

**Proposed addition:**
- `'RS 60 Spyder'` — factory special edition, 2008 MY, 1,960 units, based on Boxster S. Commemorates 1960 Sebring win. Sold as a distinct trim designation in factory literature.

#### 987.2 Boxster (2009–2011)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.9L flat-6, 255hp | 6-speed manual or PDK | RWD | 2009–2011 | |
| S | ✅ Confirmed in catalog | 3.4L flat-6, 310hp | 6-speed or PDK | RWD | 2009–2011 | |
| Spyder | ✅ Confirmed in catalog | 3.4L flat-6, 320hp | 6-speed manual only | RWD | 2010–2011 | ~1,200 units; no soft top; targa-like cover |

**No changes needed.**

#### 981 Boxster (2012–2016)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.7L flat-6, 265hp | 6-speed or PDK | RWD | 2012–2016 | |
| S | ✅ Confirmed in catalog | 3.4L flat-6, 315hp | 6-speed or PDK | RWD | 2012–2016 | |
| GTS | ✅ Confirmed in catalog | 3.4L flat-6, 330hp | 6-speed or PDK | RWD | 2014–2016 | |
| Spyder | ✅ Confirmed in catalog | 3.8L flat-6, 375hp (from 911 Carrera S) | 6-speed manual only | RWD | 2015–2016 | GT4 engine; very collectible |

**No changes needed.**

#### 982 / 718 Boxster (2017–present)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.0L flat-4 turbo, 300hp | 6-speed or PDK | RWD | 2017– | |
| S | ✅ Confirmed in catalog | 2.5L flat-4 turbo, 350hp | 6-speed or PDK | RWD | 2017– | |
| GTS 4.0 | ✅ Confirmed in catalog | 4.0L flat-6 NA, 394hp | 6-speed or PDK | RWD | 2020– | Reverted to NA flat-six |
| Spyder | ✅ Confirmed in catalog | 4.0L flat-6 NA, 414hp | 6-speed manual | RWD | 2019–2023 | GT4 engine |
| Spyder RS | ❌ Missing from catalog | 4.0L flat-6 NA, 500hp | PDK | RWD | 2024– | Open-top counterpart to 718 GT4 RS; launched 2023 for 2024 MY |
| T | ❌ Missing from catalog | 2.0L flat-4 turbo, 300hp | 6-speed manual (standard) | RWD | [VERIFY: did a 718 T exist?] | [VERIFY] — Carrera T exists for 911; unclear if 718 had a T variant |

**Proposed addition:**
- `'Spyder RS'` — 4.0L NA, 500hp, PDK, RWD, 2024 MY launch; confirmed production model

---

### 3.11 Cayman (All Generations)

#### 987.1 Cayman (2006–2008)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.7L flat-6, 245hp | 6-speed or Tiptronic | RWD | 2006–2008 | |
| S | ✅ Confirmed in catalog | 3.4L flat-6, 295hp | 6-speed or Tiptronic | RWD | 2006–2008 | |

**No changes needed.**

#### 987.2 Cayman (2009–2012)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.9L flat-6, 265hp | 6-speed or PDK | RWD | 2009–2012 | |
| S | ✅ Confirmed in catalog | 3.4L flat-6, 320hp | 6-speed or PDK | RWD | 2009–2012 | |
| R | ✅ Confirmed in catalog | 3.4L flat-6, 330hp | 6-speed or PDK | RWD | 2011–2012 | Lightweight; deleted sound insulation, AC opt. |

**No changes needed.**

#### 981 Cayman (2013–2016)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.7L flat-6, 275hp | 6-speed or PDK | RWD | 2013–2016 | |
| S | ✅ Confirmed in catalog | 3.4L flat-6, 325hp | 6-speed or PDK | RWD | 2013–2016 | |
| GTS | ✅ Confirmed in catalog | 3.4L flat-6, 340hp | 6-speed or PDK | RWD | 2015–2016 | |
| GT4 | ✅ Confirmed in catalog | 3.8L flat-6, 385hp | 6-speed manual only | RWD | 2015–2016 | First mid-engine Porsche with GT4 name |
| GT4 RS | ⚠️ Present but needs review | — | — | — | **Did NOT exist for 981** | The GT4 RS was only produced for the 982/718 generation. **Remove from 981-cayman**. |

**Removal required:**
- `'GT4 RS'` from the 981-cayman generation. No factory 981 GT4 RS was ever produced. The model was confirmed by research to be 982-only.

#### 982 / 718 Cayman (2017–present)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.0L flat-4 turbo, 300hp | 6-speed or PDK | RWD | 2017– | |
| S | ✅ Confirmed in catalog | 2.5L flat-4 turbo, 350hp | 6-speed or PDK | RWD | 2017– | |
| GTS 4.0 | ✅ Confirmed in catalog | 4.0L flat-6 NA, 394hp | 6-speed or PDK | RWD | 2020– | |
| GT4 | ✅ Confirmed in catalog | 4.0L flat-6 NA, 414hp | PDK (2020+) | RWD | 2020– | Reverted to PDK; earlier 982 GT4 used 6-speed [VERIFY exact year] |
| GT4 RS | ✅ Confirmed in catalog | 4.0L flat-6 NA (GT3-derived), 493hp | PDK | RWD | 2022– | 982-only; confirmed factory production |
| T | ❌ Missing from catalog | [VERIFY: did 718 have a T?] | — | — | — | [VERIFY] |

---

### 3.12 Cayenne (All Generations)

#### cayenne-i (2003–2010) — internal codes 955 and 957

> **Note:** models.ts groups 955 (2003–2006) and 957 (2007–2010) together as `cayenne-i`. The 957 introduced the GTS and the Diesel. The catalog does not distinguish 955 from 957.

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 3.2L V6, 247hp | Tiptronic | AWD | 2003–2006 (955 only) | 955 era only; discontinued for 957 |
| S | ✅ Confirmed in catalog | 4.5L V8, 340hp (955) / 385hp (957) | Tiptronic | AWD | 2003–2010 | |
| GTS | ✅ Confirmed in catalog | 4.8L V8, 405hp | Tiptronic | AWD | 2008–2010 (957 only) | Introduced with 957 facelift; not available 2003–2007 |
| Turbo | ✅ Confirmed in catalog | 4.5L twin-turbo, 450hp (955) / 500hp (957) | Tiptronic | AWD | 2003–2010 | |
| Turbo S | ✅ Confirmed in catalog | 4.5L twin-turbo, 521hp | Tiptronic | AWD | 2006 MY (955 only) | 3,900 units; first-year Turbo S was 955-era |
| Diesel | ❌ Missing from catalog | 3.0L V6 TDI, 240hp | Tiptronic | AWD | 2009–2010 (957 only) | Not available in North America; EU market only |

**Proposed addition:**
- `'Diesel'` — 957 era (2009–2010), EU market only. Flag as non-US market if desired, but it trades on auction platforms.

**Hybrid note:** There was NO hybrid in cayenne-i (955 or 957). The hybrid was planned for the 957 but delayed; it debuted with the cayenne-ii (958). No action needed.

#### cayenne-ii (2011–2017) — internal code 958

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 3.6L V6, 300hp | Tiptronic | AWD | 2011–2017 | |
| S | ✅ Confirmed in catalog | 4.8L V8, 400hp (958.1) / 3.6L twin-turbo V6, 420hp (958.2) | Tiptronic | AWD | 2011–2017 | Engine changed at 958.2 facelift ~2015 |
| GTS | ✅ Confirmed in catalog | 4.8L V8, 420hp (958.1) / 3.6L twin-turbo V6, 440hp (958.2) | Tiptronic | AWD | 2013–2017 | Not available at 2011 launch; added 2013 MY |
| Turbo | ✅ Confirmed in catalog | 4.8L twin-turbo V8, 500hp | Tiptronic | AWD | 2011–2017 | |
| Turbo S | ✅ Confirmed in catalog | 4.8L twin-turbo V8, 550hp | Tiptronic | AWD | 2014–2017 | |
| E-Hybrid | ✅ Confirmed in catalog | 3.0L supercharged V6 + electric, 416hp combined | Tiptronic | AWD | 2014–2017 | First Cayenne hybrid; 958.2 era only |
| Turbo S E-Hybrid | ⚠️ Present but needs review | — | — | — | [VERIFY: Turbo S E-Hybrid was 958 era?] | Turbo S E-Hybrid may be cayenne-iii only; [VERIFY] |
| Diesel | ❌ Missing from catalog | 3.0L V6 TDI, 245hp (base Diesel) / 4.2L V8 TDI, 385hp (S Diesel) | Tiptronic | AWD | 2011–2017 | Available in EU markets; significant auction presence |
| S Diesel | ❌ Missing from catalog | 4.2L V8 TDI, 385hp | Tiptronic | AWD | 2012–2017 | Higher-performance diesel variant |

**Proposed additions:**
- `'Diesel'` — 958 era; EU market
- `'S Diesel'` — 958 era; distinct high-performance diesel

#### cayenne-iii (2018–present) — internal code 9YA / 9YB (Coupé)

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 3.0L V6 turbo, 340hp | Tiptronic | AWD | 2018– | |
| S | ✅ Confirmed in catalog | 2.9L V6 biturbo, 440hp | Tiptronic | AWD | 2018– | |
| GTS | ✅ Confirmed in catalog | 4.0L V8 biturbo, 460hp | Tiptronic | AWD | 2021– | Not available at 2018 launch; returned 2021 MY |
| Turbo | ✅ Confirmed in catalog | 4.0L V8 biturbo, 541hp | Tiptronic | AWD | 2018– | |
| Turbo S | ⚠️ Present but needs review | 4.0L V8 biturbo, 550hp | Tiptronic | AWD | [VERIFY: was there a non-E-Hybrid Turbo S in 9YA?] | [VERIFY] — The flagship may be Turbo S E-Hybrid only in 9YA; standalone Turbo S may not exist |
| E-Hybrid | ✅ Confirmed in catalog | 3.0L V6 + electric, 462hp | Tiptronic | AWD | 2018– | |
| Turbo S E-Hybrid | ✅ Confirmed in catalog | 4.0L V8 biturbo + electric, 680hp | Tiptronic | AWD | 2018– | |
| Coupé | ✅ Confirmed in catalog | 3.0L V6 turbo, 340hp | Tiptronic | AWD | 2020– | Fastback body style; added 2020 |
| Turbo Coupé | ✅ Confirmed in catalog | 4.0L V8 biturbo, 541hp | Tiptronic | AWD | 2020– | |
| S Coupé | ❌ Missing from catalog | 2.9L V6 biturbo, 440hp | Tiptronic | AWD | 2020– | Coupé variant of the S; [VERIFY production confirmation] |
| GTS Coupé | ❌ Missing from catalog | 4.0L V8 biturbo, 460hp | Tiptronic | AWD | 2021– | Coupé variant of GTS; launched alongside GTS return |
| E-Hybrid Coupé | ❌ Missing from catalog | 3.0L V6 + electric | Tiptronic | AWD | 2020– | [VERIFY availability] |
| Turbo S E-Hybrid Coupé | ❌ Missing from catalog | 4.0L V8 + electric, 680hp | Tiptronic | AWD | 2020– | [VERIFY] |

**Structural note on Coupé variants:** The catalog has `'Coupé'` and `'Turbo Coupé'` but omits the Coupé variants of S, GTS, and E-Hybrid. Whether these warrant separate trim entries depends on whether the comp engine needs to separate Coupé from standard body. Recommend adding the missing Coupé variants.

---

### 3.13 Macan (All Generations)

#### macan-i (2014–2021) — internal code 95B

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 2.0L 4-cyl turbo, 252hp | PDK | AWD | 2014–2021 | Sometimes listed as "Macan" without further designation |
| S | ✅ Confirmed in catalog | 3.0L V6 biturbo, 340hp | PDK | AWD | 2014–2021 | |
| GTS | ✅ Confirmed in catalog | 3.0L V6 biturbo, 360hp | PDK | AWD | 2016–2021 | Not at launch; added 2016 MY |
| Turbo | ✅ Confirmed in catalog | 3.6L V6 biturbo, 400hp | PDK | AWD | 2014–2021 | |
| Turbo with Performance Package | ❌ Missing from catalog | 3.6L V6 biturbo, 440hp | PDK | AWD | 2016–2021 | Factory-optional PP; often listed as a distinct spec |

**Note on Turbo Performance Package:** [VERIFY] whether this warrants its own trim entry or is treated as an option on the Turbo trim.

#### macan-ii (2022–present) — internal code J1 / EV platform

> **Critical structural note:** The macan-ii is the all-electric second-generation Macan. The current catalog trim list `['Base', 'S', 'GTS', 'Turbo']` is **entirely wrong** — these are the first-gen ICE trim names. The EV Macan uses completely different naming conventions.

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base ('Macan 4') | ❌ Missing from catalog | Dual-motor electric, 402hp | Single-speed | AWD | 2024– | "Macan 4" is the actual factory designation (not "Base") |
| Macan Electric | ❌ Missing from catalog | Single-motor electric (RWD), ~355hp | Single-speed | RWD | 2025– | Entry-level RWD; added for MY2025 |
| Macan 4S | ❌ Missing from catalog | Dual-motor electric, 442–509hp (overboost) | Single-speed | AWD | 2025– | Slots between Macan 4 and Turbo; added MY2025 |
| Macan Turbo | ❌ Missing from catalog | Dual-motor electric, 630hp | Single-speed | AWD | 2024– | Top-spec EV Macan |
| S | ⚠️ Present but wrong generation | — | — | — | ICE-era trim; does not apply to EV Macan |
| GTS | ⚠️ Present but wrong generation | — | — | — | [VERIFY: will there be a GTS for EV Macan?] |
| Turbo | ⚠️ Present but wrong generation | Named "Macan Turbo" not just "Turbo" | — | — | — | Naming convention changed |

**Required correction for macan-ii:** Replace the current `['Base', 'S', 'GTS', 'Turbo']` with `['Macan 4', 'Macan Turbo']` for the initial launch spec, and note that `'Macan Electric'` and `'Macan 4S'` were added for MY2025.

---

### 3.14 Panamera (All Generations)

#### panamera-i (2010–2016) — internal code 970

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 3.6L V6, 300hp | PDK | RWD | 2010–2016 | |
| 4 | ✅ Confirmed in catalog | 3.6L V6, 300hp | PDK | AWD | 2011–2016 | |
| 4S | ✅ Confirmed in catalog | 4.8L V8, 400hp (2010–2013) / 3.0L V6 biturbo, 420hp (2014–2016) | PDK | AWD | 2010–2016 | Engine changed mid-generation |
| GTS | ✅ Confirmed in catalog | 4.8L V8, 430hp | PDK | AWD | 2012–2016 | Added for MY2012 |
| Turbo | ✅ Confirmed in catalog | 4.8L twin-turbo V8, 500hp | PDK | AWD | 2010–2016 | |
| Turbo S | ✅ Confirmed in catalog | 4.8L twin-turbo V8, 570hp | PDK | AWD | 2012–2016 | Added MY2012 |
| 4 E-Hybrid | ✅ Confirmed in catalog | 3.0L supercharged V6 + electric, 416hp | PDK | AWD | 2014–2016 | Plug-in hybrid; added MY2014 |
| Turbo S E-Hybrid | ✅ Confirmed in catalog | 4.8L twin-turbo V8 + electric, 680hp | PDK | AWD | 2014–2016 | Added MY2014 |
| Executive | ❌ Missing from catalog | Same engines; long-wheelbase | PDK | Various | 2014–2016 | Extended WB; added MY2014; 4S, Turbo, Turbo S Executive |

**Proposed addition:**
- `'Executive'` — long-wheelbase variant; available as 4S Executive, Turbo Executive, Turbo S Executive. If a single trim entry is used, flag it as LWB.

#### panamera-ii (2017–present) — internal code 971

> **Year boundary note:** The catalog marks panamera-i ending 2016 and panamera-ii starting 2017. The 971-generation launched for MY2017. This is correct.

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base | ✅ Confirmed in catalog | 3.0L V6 turbo, 330hp | PDK | RWD | 2017– | |
| 4 | ✅ Confirmed in catalog | 3.0L V6 turbo, 330hp | PDK | AWD | 2017– | |
| 4S | ✅ Confirmed in catalog | 2.9L V6 biturbo, 440hp | PDK | AWD | 2017– | |
| GTS | ✅ Confirmed in catalog | 4.0L V8 biturbo, 460hp | PDK | AWD | 2019– | Added 2019 |
| Turbo | ✅ Confirmed in catalog | 4.0L V8 biturbo, 550hp | PDK | AWD | 2017– | |
| Turbo S | ✅ Confirmed in catalog | 4.0L V8 biturbo, 620hp | PDK | AWD | 2019– | |
| 4 E-Hybrid | ✅ Confirmed in catalog | 2.9L V6 + electric, 462hp | PDK | AWD | 2017– | |
| Turbo S E-Hybrid | ✅ Confirmed in catalog | 4.0L V8 + electric, 680hp | PDK | AWD | 2018– | |
| Sport Turismo | ❌ Missing from catalog | Multiple engines (same as sedan) | PDK | Various | 2018– | Wagon body style; available in 4, 4S, GTS, 4 E-Hybrid, Turbo S E-Hybrid |
| Executive | ❌ Missing from catalog | Long-wheelbase; same engines | PDK | Various | 2017– | LWB variant continuation |

**Proposed additions:**
- `'Sport Turismo'` — wagon body style, 2018+ (debuted Geneva 2017 for 2018 MY); available across multiple powertrains
- `'Executive'` — LWB continuation

---

### 3.15 Taycan (2020–present)

#### taycan-i (2020–present)

> **Note:** The catalog uses a single `taycan-i` generation for 2020–present, which may eventually need splitting. Current trim list is missing the `Taycan 4` and multiple body-style variants of each trim.

| Trim | Status | Engine | Transmission | Drivetrain | Years Produced | Notes |
|---|---|---|---|---|---|---|
| Base (Taycan RWD) | ✅ Confirmed in catalog | Dual-layer battery, single or dual motor, 402–469hp | Single-speed (rear) / 2-speed (front opt.) | RWD | 2021– | Added MY2021; RWD, smaller battery |
| 4 | ❌ Missing from catalog | Dual-motor, 469hp | 2-speed front + single-speed rear | AWD | 2021– | Slots between Base (RWD) and 4S; AWD base tier |
| 4S | ✅ Confirmed in catalog | Dual-motor, 530–571hp | 2-speed front + 1-speed rear | AWD | 2020– | Available at launch |
| GTS | ✅ Confirmed in catalog | Dual-motor, 590hp | PDU transmission | AWD | 2022– | Added MY2022 |
| Turbo | ✅ Confirmed in catalog | Dual-motor, 670hp | PDU | AWD | 2020– | Available at launch |
| Turbo S | ✅ Confirmed in catalog | Dual-motor, 750hp (overboost) | PDU | AWD | 2020– | Available at launch |
| Cross Turismo | ✅ Confirmed in catalog | Multiple (same as sedan) | PDU | AWD | 2021– | Raised-ride-height wagon; available in 4, 4S, Turbo, Turbo S |
| Sport Turismo | ✅ Confirmed in catalog | Multiple | PDU | AWD | 2022– | Low wagon; added MY2022; available in same trims as sedan |

**Proposed addition:**
- `'4'` — Taycan 4 (AWD, ~469hp, between Base and 4S). Introduced MY2021 alongside the base RWD model. Currently absent from catalog.

**Structural note on body variants:** The catalog has `'Cross Turismo'` and `'Sport Turismo'` as top-level trim entries, which is one valid approach (treating body style as a trim differentiator). The alternative is to combine `'Turbo Cross Turismo'`, `'4S Cross Turismo'`, etc. as distinct entries. Current approach is acceptable but may cause comp query ambiguity (a Taycan 4S sedan and a Taycan 4S Cross Turismo are different cars with different values). Flag for comp engine team review.

---

## 4. Consolidated Sort Order Corrections

No sort order issues exist in `lib/porsche/models.ts` itself. The array order is correct.

The DB taxonomy seed (in `supabase/migrations/`) has `carrera_2_narrow` before `carrera_4_narrow` for the 964 generation — this ordering is correct and consistent with models.ts.

No sort order changes required.

---

## 5. Structural Gaps

These issues require new generation entries in `GENERATION_DEFS`, not just trim additions:

| Gap | Action Required | Files Affected |
|---|---|---|
| **356 entirely absent** | Add 4 generation entries (pre-A, A, B, C) to models.ts; add trim-category derivation to index.ts; verify DB seed already has generation rows | `lib/porsche/models.ts`, `lib/trim-category/index.ts` |
| **912 entirely absent** | Add 1 generation entry ('912') to models.ts; add `derive912()` or null handler to index.ts; verify DB seed | `lib/porsche/models.ts`, `lib/trim-category/index.ts` |
| **930 derivation orphan** | Either add a '930' gen entry OR merge derive930() into the pre-964 handler | `lib/porsche/models.ts`, `lib/trim-category/index.ts` |
| **pre-964 compresses F-series trims** | Add 911T, 911E, 911S to the pre-964 trims array | `lib/porsche/models.ts` |
| **Macan Gen II names are wrong** | Replace `['Base', 'S', 'GTS', 'Turbo']` with EV-accurate names | `lib/porsche/models.ts` |

---

## 6. Implementation Notes

All changes are limited to these files unless otherwise noted:

### `lib/porsche/models.ts`

1. **964 — remove `'Carrera 4S'`**, add `'Turbo 3.6'`, `'Turbo S'` (Leichtbau), `'America Roadster'`
2. **993 — remove `'Speedster'`** (not a production trim); add year note on C4S (1996+ only)
3. **996.1 — remove `'Carrera 4S'` and `'Targa'`** (neither existed in 1999–2001)
4. **996.2 — add `'Targa'`** (migrated from 996.1)
5. **997.1 — remove `'Turbo S'`** (997.1 Turbo S never existed)
6. **997.2 — add `'Sport Classic'`, `'Speedster'`**
7. **991.1 — add `'Targa 4 GTS'`**
8. **991.2 — change `yearEnd: 2018` → `yearEnd: 2019`; add `'Targa 4 GTS'`, `'Speedster'`; verify Sport Classic**
9. **992.1 — add `'Targa 4 GTS'`, `'Carrera T'`, `'Sport Classic'`, `'Dakar'`, `'S/T'`, `'GT3 Touring'`**
10. **992.2 — add `'Targa 4 GTS'`, `'Carrera T'`, `'GT3 Touring'`**
11. **987.1-boxster — add `'RS 60 Spyder'`**
12. **982-boxster — add `'Spyder RS'`**
13. **981-cayman — remove `'GT4 RS'`**
14. **cayenne-i — add `'Diesel'`**
15. **cayenne-ii — add `'Diesel'`, `'S Diesel'`; verify `'Turbo S E-Hybrid'` belongs here or only cayenne-iii**
16. **cayenne-iii — add `'S Coupé'`, `'GTS Coupé'`, verify other Coupé variants**
17. **macan-ii — replace entire trim list** with `['Macan 4', 'Macan Turbo']` for 2024 launch (add `'Macan Electric'`, `'Macan 4S'` as MY2025 additions or keep in same gen)
18. **panamera-ii — add `'Sport Turismo'`**; consider `'Executive'` for both gens
19. **taycan-i — add `'4'`**
20. **pre-964 — add `'911T'`, `'911E'`, `'911S'`**
21. **New entries — add `'912'` model generation**
22. **New entries — decide on 356 (4 gens) and 930 structural treatment**

### `lib/trim-category/index.ts`

1. **If 930 gen added:** no change needed; `derive930()` already exists
2. **If 930 merged into pre-964:** replace `case '930'` with `case 'pre-964'` routing and merge logic
3. **New trims in 997.2:** add `'sport_classic'` and `'speedster'` routing (already present in derive997 — check that these keywords are already handled: yes, `t.includes('sport classic')` → `'sport_classic'` and `t.includes('speedster')` → `'speedster'` are already in derive997)
4. **New trims in 991.2/992.1:** `derive991()` and `derive992()` need routing for `'speedster'`, `'sport_classic'`, `'dakar'`, `'s/t'`, `'carrera t'`, `'gt3 touring'`
5. **Macan ii trims:** the current derivation falls through to `default: return null` for cayenne/macan — this is acceptable behavior; no change needed unless you add explicit Macan routing
6. **912 trims if added:** add `derive912()` returning `null` (no comp isolation needed for coupe vs. targa at this stage)

### `supabase/migrations/`

1. **Verify** that the 964 Carrera 4S seed row exists and remove it
2. **Verify** that 912 and 356 generation rows in the DB seed match whatever is added to models.ts
3. **Macan ii DB seed:** update generation trim data to reflect EV names if stored

---

## 7. Items Requiring Further Verification

These items are marked `[VERIFY]` in the tables above and require a human to confirm before implementation:

| # | Item | Why Unresolved |
|---|---|---|
| 1 | 991.2 Sport Classic — does it exist? | Research found a 997 Sport Classic (2010) and a 992 Sport Classic (2022–2023) but could not confirm a 991.2 Sport Classic variant |
| 2 | 718 Boxster T / 718 Cayman T — do they exist? | The 911 Carrera T is confirmed; unclear if the T designation extended to the 718 platform |
| 3 | Cayenne III Turbo S (non-hybrid) — does it exist? | The flagship may be Turbo S E-Hybrid only in the 9YA generation |
| 4 | Cayenne III Coupé variants — S Coupé, GTS Coupé, E-Hybrid Coupé, Turbo S E-Hybrid Coupé | Need confirmation which Coupé body variants were factory-produced |
| 5 | Cayenne ii Turbo S E-Hybrid — was it offered in the 958 era? | Confirmed for 9YA (cayenne-iii); unclear if it was also a 958 (cayenne-ii) trim |
| 6 | Macan i Turbo Performance Package — separate trim or option? | Factory option, not a distinct nameplate; likely should not be a separate trim entry |
| 7 | 912E (1976 US-market only, ~2,099 units) — add to catalog? | Very low production, US-only; borderline for inclusion |
| 8 | 996 Turbo S first model year — 2004 or 2005? | Sources conflict slightly |
| 9 | Taycan 4 Cross Turismo vs. Taycan Cross Turismo — is there a base Cross Turismo without "4"? | Taycan Cross Turismo lineup started with "4" as the base; a non-4 Cross Turismo may not exist |
| 10 | Panamera Executive — single trim or multiple (4S Executive, Turbo Executive, etc.)? | Confirm whether single `'Executive'` trim suffices or if separate entries are needed |
