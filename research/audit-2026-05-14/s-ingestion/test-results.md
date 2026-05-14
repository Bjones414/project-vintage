# Ingestion Pipeline Test Results — 2026-05-14

## Test Suite

| | Before | After |
|---|---|---|
| Total tests | 737 | 761 |
| Passed | 737 | 761 |
| Failed | 0 | 0 |
| New tests added | — | 24 |

---

## Test URL Results (Static Analysis)

Live fetches cannot be performed in this environment. Results below are determined
by tracing code paths against the actual source changes. Each "before" is the
production behavior prior to this PR; each "after" is the post-fix behavior.

### 1. `https://bringatrailer.com/listing/1975-porsche-911s-targa-8/`
**Original failure case**

| | Before | After |
|---|---|---|
| Parse result | `model: null` — `splitModelTrim("911S Targa")` found no prefix + space match | `model: "911"`, `trim: "S Targa"` — uppercase letter after prefix is now a valid separator |
| Route response | 422 — "Could not extract required fields (make, model, year)" | 200 — listing cached, `listingId` returned |
| Generation match | Not reached | `matchFromTitle` on "1975 Porsche 911S Targa": `/\b911(?!\d)/` matches → family '911', year 1975, candidates [g-series-2.7, 930], no Turbo → **g-series-2.7** |
| UI | "We couldn't analyze that URL" | Full analyze page with G-series era content |
| Comp engine | Not reached | `insufficient_comps` (expected — few G-body listings in DB) |

### 2. Early 911 (1965–1973 era)
**Representative: 1973 Porsche 911 Carrera RS**

Already handled by existing code (title uses "911 " with space → passes `startsWith(prefix + ' ')`).

| | Before | After |
|---|---|---|
| Parse | `model: "911"`, `trim: "Carrera RS"` ✓ | Same ✓ |
| Generation | `matchFromTitle` on "1973 Porsche 911 Carrera RS" → **911-f-body** | Same ✓ |
| UI | Full analyze page | Full analyze page |

No regression.

### 3. 944 Turbo or 928 S4 from BaT
**Out-of-scope Porsche**

| | Before | After |
|---|---|---|
| Parse | `model: "944"` or `model: "928"` (space-separated trim, already worked) | Same ✓ |
| Route | 200 — listing cached with `generation_id: null` | Same ✓ |
| EraCard | "Era guide for this generation coming soon." (generic) | "Porsche 944 — not yet in V1 catalog. Cached as comparable sale." (model-specific) |
| Comp engine | `insufficient_comps` (no 944/928 comps in pool for 'default' generation) | Same ✓ |

### 4. Non-Porsche URL (e.g., Mercedes or BMW from BaT)
**Non-Porsche graceful degradation**

Example: `https://bringatrailer.com/listing/1970-mercedes-benz-280sl-1/` (hypothetical)

| | Before | After |
|---|---|---|
| Parse | `model: null` — `splitModelTrim("280SL")` found no Porsche prefix | `make: "Mercedes-Benz"`, `model: "280SL"`, `trim: null` — generic non-Porsche extraction |
| Route | 422 — "Could not extract required fields" | 200 — listing cached with `generation_id: null` |
| EraCard | "We couldn't analyze that URL" (error, not shown) | "We don't currently support Mercedes-Benz for full analysis. Cached as comparable sale data." |
| Comp engine | Not reached | `insufficient_comps` (no non-Porsche listings in any named generation pool) |

### 5. Control case: WP0CA299X2S650260 (996.2 Carrera Cabriolet)
**Verify no regression on modern VIN path**

| | Before | After |
|---|---|---|
| Parse | `make: "Porsche"`, `model: "911"`, `trim: "Carrera Cabriolet"` | Same ✓ — non-Porsche path not taken (make = "Porsche") |
| VIN decode | NHTSA decode: year 2002, make PORSCHE, model 911 | Same ✓ |
| Generation | `decoded_year: 2002`, `decoded_model: "911"` → **996.2** | Same ✓ |
| Route | 200 | Same ✓ |
| UI | Full 996.2 analyze page | Same ✓ |

---

## Comp Engine Cross-Brand Isolation

Verified structurally (no code changes were needed):

- `fetchV2Pool(generationId, excludeId)` queries `.eq('generation_id', generationId)`
- Non-Porsche and out-of-scope Porsche listings have `generation_id = NULL` in the DB
- `computeCompsV2` uses `subject.generation_id ?? 'default'` → pool key is `'default'`
- SQL `WHERE generation_id = 'default'` does **not** match `NULL` rows (SQL null semantics)
- No listing is stored with `generation_id = 'default'` as a string value
- Therefore non-Porsche comps cannot appear in any Porsche subject's comp pool ✓

---

## New Tests Added (24 total)

### `tests/listing-parser/bring-a-trailer-model-trim.test.ts` (+7)
1. "911S Targa" → model "911", trim "S Targa"
2. "911T Coupe" → model "911", trim "T Coupe"
3. "911E" → model "911", trim "E"
4. "911SC Cabriolet" → model "911", trim "SC Cabriolet"
5. "911L" → model "911", trim "L"
6. "914-6 Coupe" → model "914", trim "6 Coupe"
7. "914-6" → model "914", trim "6"

### `tests/generation-match/generation-match.test.ts` (+3)
8. "1975 Porsche 911S Targa" title (no VIN decode) → g-series-2.7, medium confidence
9. "1983 Porsche 911SC Cabriolet" title → 911-sc, medium confidence
10. year 1975 decoded + "1975 Porsche 911S Targa" title → g-series-2.7, high confidence

### `tests/listing-parser/bring-a-trailer-nonporsche.test.ts` (+14, new file)
11. Mercedes-Benz 280SL → make "Mercedes-Benz", model "280SL"
12. BMW 2002 → make "BMW", model "2002"
13. Ferrari 246 GT Dino → make "Ferrari", model "246", trim "GT Dino"
14. Alfa Romeo Spider → make extracted, non-null
15. Porsche 944 Turbo (out-of-scope) → make "Porsche", model "944", trim "Turbo"
16. Porsche 928 S4 (out-of-scope) → make "Porsche", model "928", trim "S4"
17. Porsche 912 Coupe (out-of-scope) → make "Porsche", model "912", trim "Coupe"
18. Porsche 914-6 Coupe (out-of-scope) → make "Porsche", model "914", trim "6 Coupe"
19. Porsche 924 (out-of-scope) → make "Porsche", model "924", trim null
20. Porsche 911S Targa (via parseBatHtml) → make "Porsche", model "911", trim "S Targa"
21. Porsche 911T Coupe (via parseBatHtml) → make "Porsche", model "911", trim "T Coupe"
22. Porsche 911SC Cabriolet (via parseBatHtml) → make "Porsche", model "911", trim "SC Cabriolet"
23. null generation_id falls back to 'default' pool key (structural isolation doc)
24. named generation pool never contains null-generation_id rows (structural isolation doc)
