# 991.1 Credibility Audit — Morning Review Report
**Session:** s05-991-1  
**Generation:** 991.1 (MY2012–2016)  
**Date:** 2026-05-14  
**Auditor:** Claude (claude-sonnet-4-6)

---

## Summary

| Metric | Count |
|---|---|
| Variants audited | 14 |
| HIGH confidence auto-applied | 1 |
| Staged items (user review required) | 10 |
| Prose truncation issues | 0 |
| Comp data gaps (critical) | 42 of 44 variant+year combos |

---

## AUTO-APPLIED CHANGE (HIGH Confidence)

### Turbo S Worldwide Production: `~12,900` → `9,629`

**Field:** `variants[Turbo S].production`  
**Old:** `~12,900 worldwide; ~4,130 North America`  
**New:** `9,629 worldwide (Coupe + Cab; Porsche Newsroom); ~4,130 North America`

**Source:** Porsche Newsroom press kit — "By the time of the model facelift, Porsche had produced 9,629 examples." This is Tier 1 (official Porsche publication), Turbo S coupe + cabriolet combined, 991.1 generation only.

**NA figure note:** The ~4,130 NA figure is retained but **unverified** — no primary or secondary source found. At 43% of worldwide (9,629), this is plausible but high for a halo variant. Flagged in STAGE-001 for follow-up.

---

## TURBO S CONFLICT — FULL ADJUDICATION

**Conflict:** `~12,900` vs `9,629`  
**Resolution:** `9,629` is correct. `~12,900` is almost certainly **Turbo (non-S) + Turbo S combined**.

**Sources consulted (5+):**

| Source | Tier | Figure | Methodology |
|---|---|---|---|
| Porsche Newsroom press kit (Turbo S history) | 1 | **9,629** | Official Porsche publication; "by the time of the model facelift" = 991.1 run; Coupe + Cab combined |
| Stuttcars 991 Turbo S page | 2 | Not stated | Engine specs confirmed (MA1/71); no production figure given |
| Wikipedia 911 (991) | 2 | Not stated | Cites Porsche Newsroom as source for 991 totals; no Turbo S breakdown |
| Rennlist 991 Turbo production thread (Aug 2020) | 2 | No exact figure | Community-compiled; states Turbo S outsells Turbo ~2:1 but no aggregate total |
| Rennlist 991.1+991.2 Turbo production thread (Jul 2023) | 2 | Images only | Per-year US breakdowns in image format; Turbo S dominance over Turbo confirmed |
| Autoevolution Turbo S 991 spec page | 2 | Not stated | Spec-only; confirms 2013–2016 production window |

**Why ~12,900 is wrong:** The ~2:1 Turbo S to Turbo ratio means if Turbo S = 9,629, then Turbo ≈ 3,200–4,800, giving a combined total of ~12,800–14,400 — consistent with ~12,900. Most probable origin: a table where someone added the Turbo and Turbo S rows.

**Adjudication confidence: HIGH**

---

## STAGED ITEMS — USER TO REVIEW

See `staging.json` for full detail. Summary:

| ID | Severity | Item | Recommended Action |
|---|---|---|---|
| STAGE-001 | MEDIUM | Turbo S NA ~4,130 — unverified | Add '(unverified)' or remove |
| STAGE-002 | MEDIUM | Turbo worldwide ~5,350 — unverified | Add '(unverified)' or remove |
| STAGE-003 | MEDIUM | GT3 worldwide ~6,050 → ~6,300 | Update (secondary sources consistent) |
| STAGE-004 | MEDIUM | GT3 RS worldwide ~4,250 → ~4,596 | Update (multiple secondary sources; ~1,530 NA unchanged) |
| STAGE-005 | MEDIUM | 50th Anniversary NA ~750 — unverified | Add '(unverified)' |
| STAGE-006 | MEDIUM | Rod-bolt recall: "785 worldwide (~400 US)" is likely inverted — 785 is the US figure | Correct to 785 US (NHTSA scope); worldwide total undisclosed |
| STAGE-007 | LOW | Carrera 4 / 4S years "2012–2016" → "2013–2016" | Verify then update |
| STAGE-008 | MEDIUM | Carrera GTS production label "RWD GTS" may include AWD Carrera 4 GTS units | Verify scope of 8,634 figure |
| STAGE-009 | LOW | Engine code precision: "9A1" for NA engines is colloquial; Turbo specific code is MA1/71 | No change required — informational |
| STAGE-010 | LOW | 911 R NA ~323 is community-sourced | Retain; optionally add '(unofficial)' |

### Priority for morning review

**Do first:**
1. **STAGE-006** (rod-bolt recall inversion) — most meaningful factual correction; affects both the `engineering` block and the `watch_for` block
2. **STAGE-003 / STAGE-004** (GT3 and GT3 RS worldwide figures) — consistent secondary sources; likely worth updating
3. **STAGE-007** (Carrera 4 / 4S years) — quick Porsche Newsroom press release check will confirm

**Lower priority:**
4–10: unverified NA figures, label ambiguities, engine code precision

---

## PRIOR AUDIT ITEMS — VERIFICATION RESULT

| Item | Status |
|---|---|
| Carrera GTS ~8,634 (5,510 Coupe + 3,124 Cab) | MEDIUM confidence — consistent in secondary sources; primary not found. Label ambiguity: may include AWD Carrera 4 GTS (see STAGE-008) |
| Targa 4 GTS 1,525 worldwide | MEDIUM confidence — consistent in secondary sources; Stuttcars cites official Porsche press material |
| "First-ever 911 Targa GTS" claim | CONFIRMED HIGH — Official Porsche press release explicitly states this |

---

## ENGINEERING/SPEC VERIFICATION — KEY CONFIRMATIONS

All of the following are confirmed accurate in the current content:

- **Turbo/Turbo S engine:** 3.8L 9A1 twin-turbo (NOT Mezger) — confirmed HIGH confidence. Mezger ended with 997.2 GT3 RS 4.0 in 2011.
- **GT3 engine code:** MA175 (3.8L NA, 9A1-derived) — confirmed HIGH by multiple owners' engine lid decal reports and Stuttcars
- **GT3 RS engine code:** MA176 (4.0L NA, 9A1-derived) — confirmed HIGH by Porsche factory documentation and eBay parts listings
- **Total 991 generation: 233,540** — confirmed HIGH by Porsche Newsroom end-of-production announcement
- **GT3 NHTSA recall 14V-090** — confirmed HIGH. **BUT:** 785 is the US figure, not worldwide. The current text has this inverted. See STAGE-006.
- **Targa 4 GTS: first-ever 911 Targa GTS** — confirmed HIGH by official Porsche press release
- **PDK-only on 991.1 GT3** — confirmed HIGH
- **7-speed manual introduction on 991.1 Carrera** — confirmed HIGH
- **EPAS replacement of hydraulic rack** — confirmed HIGH
- **Aluminum-steel hybrid monocoque** — confirmed HIGH
- **100mm longer wheelbase** — confirmed HIGH

---

## PROSE TRUNCATION CHECK

**All 991.1 prose fields verified complete** — no truncation found.

Checked fields:
- `intro` ✓
- `notes[0]`, `notes[1]`, `notes[2]` ✓ (all complete, ending with proper punctuation)
- All 14 `variants[n].description` fields ✓
- All 4 `engineering[n]` fields ✓
- All 4 `watch_for[n].body` and `watch_for[n].buyer_question` fields ✓
- All 3 `service[n]` fields ✓
- All 5 `value_drivers[n].description` fields ✓

---

## WATCH-FOR CONTENT REVIEW

All four watch_for items are accurate and appropriately calibrated:

| Title | Severity | Status |
|---|---|---|
| GT3 rod-bolt recall (MA175) | concern | Accurate — but recall count needs correction per STAGE-006 |
| DFI intake valve carbon buildup (9A1) | caution | Accurate — 60K-80K mile threshold well-sourced |
| EPAS feel — buyer expectation | caution | Accurate — correctly framed as preference not defect |
| Secondary air injection pump failure | caution | Accurate — P0410/P1411 codes correct; cost range reasonable |

**Missing watch-for consideration:** The GT3's finger-follower warranty extension (2017 Porsche campaign, 10yr/120K miles, transferable) is documented in the `service[]` block but not in a dedicated `watch_for` entry. Given that some of these warranties may still be active on low-mileage examples through 2027-2028, this is a buyer-facing value consideration. Optional addition for STAGE review.

---

## COMP DATA GAPS

**Critical finding:** The entire 991.1 generation has zero or near-zero comp data.

- 42 of 44 variant+year combos: 0 comps
- 2013 Carrera and 2013 Carrera S: 1 comp each
- Cabriolet body style combos: not yet modeled in comp engine

**Recommended scraping priority:**
1. GT3 (2014–2016) — recall-awareness drives search volume
2. Carrera GTS (2015–2016) — strongest collector tailwind
3. Turbo S (2014–2016) — 9,629 units, $140K–$200K price range
4. 911 R (2016) — 991 units, extreme comp value at $300K–$450K+
5. GT3 RS (2016) — ~4,596 units, $130K–$200K
6. Carrera S (2012–2016) — high volume, generation anchor
7. Turbo (2014–2016) — needed to establish Turbo/Turbo S premium spread

See `comp-gaps.txt` for full 44-row table.

---

## OTHER NOTES / CONFLICTS

**Turbo S "More common than the base Turbo in North America":** This claim in the Turbo S description is supported by the ~2:1 Turbo S to Turbo ratio documented in Rennlist community data and consistent with the 9,629 Turbo S vs estimated ~4,800 Turbo worldwide. Retain.

**"X51 Power Kit" for Carrera S:** Current text correctly identifies the X51 as an option raising Carrera S from 400 to 430 hp. Research confirms the GTS ships with 430 hp as standard equipment (not an option). No correction needed.

**GT3 RS "4.0L" designation:** The current `engine` field uses "4.0L 9A1 NA (GT3 RS/911 R: 500 hp)". Research confirms the GT3 RS engine is MA176, which produces 500 PS (493 hp SAE). The 500 hp figure in the current file approximates the PS figure — this is consistent with Porsche's own US marketing materials and does not require correction.

---

## OUTPUT FILES

| File | Path |
|---|---|
| diff-log.json | research/audit-2026-05-14/s05-991-1/diff-log.json |
| staging.json | research/audit-2026-05-14/s05-991-1/staging.json |
| REPORT.md | research/audit-2026-05-14/s05-991-1/REPORT.md |
| comp-gaps.txt | research/audit-2026-05-14/s05-991-1/comp-gaps.txt |
| PROGRESS.log | research/audit-2026-05-14/s05-991-1/PROGRESS.log |

Source file modified: `lib/era-content/generation-content.ts` (1 change)
