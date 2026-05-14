# Ingestion Pipeline Investigation — 2026-05-14

## Entry Point

`POST /api/analyze` in `app/api/analyze/route.ts` is the sole user-triggered ingestion entry.

Pipeline sequence:
1. URL cache check (listings table, source_url)
2. `parseListing(url)` → `parseBaTListing` → `parseBatHtml`
3. Required-field guard (`make`, `model`, `year`)
4. `decodeVin(listing.vin)` → NHTSA (returns null for pre-1981)
5. `matchGeneration(...)` + recall lookup (parallel)
6. DB upsert
7. `computeCompsV2(listingId)`

---

## Root Cause: 1975 Porsche 911S Targa

**Failing URL:** `https://bringatrailer.com/listing/1975-porsche-911s-targa-8/`

### Layer 1 (Primary failure) — `splitModelTrim` in `lib/listing-parser/bring-a-trailer.ts:42`

BaT JSON-LD title: `"1975 Porsche 911S Targa"`

Title regex extracts: `year=1975`, `make="Porsche"`, `postMake="911S Targa"`

`splitModelTrim("911S Targa")` iterates `PORSCHE_MODEL_PREFIXES` with this check:
```ts
if (postMake === prefix || postMake.startsWith(prefix + ' ')) {
```
For prefix `"911"`:
- `"911S Targa" === "911"` → false
- `"911S Targa".startsWith("911 ")` → **false** (next char is `'S'`, not `' '`)

No prefix matches → returns `{ model: null, trim: null }` + `console.warn`.

Back in `route.ts:116`:
```ts
if (!listing.make || !listing.model || listing.year === null) {
  return NextResponse.json({ error: 'Could not extract required fields...' }, { status: 422 })
}
```
`listing.model === null` → **422 response** → UI shows "We couldn't analyze that URL".

### Layer 2 (Secondary, masked by L1) — `resolveModelFamily` in `lib/generation-match.ts:44`

Even if `model` were non-null, `matchGeneration` would also fail for "1975 Porsche 911S Targa":

```ts
const FAMILY_PATTERNS = [
  [/\b911\b/, '911'],
  ...
]
```

In `"1975 Porsche 911S Targa"`:
- "911S" — `\b` matches before '9' (space → digit), but requires another `\b` after '1'
- '1' is followed by 'S' (both `\w`) → **no word boundary** → `/\b911\b/` does not match "911S"

Result: `resolveModelFamily` returns `null` → `generation_id: null, reason: 'Model family unresolved'`.

This is non-fatal (listing still caches without a generation), but the EraCard would show a generic fallback rather than the correct G-series era content. Generation matching must also be fixed.

---

## Behavior for Other Porsche Models (912, 914, 924, 944, 968, 928)

These models are all in `PORSCHE_MODEL_PREFIXES` and use standard prefix + space matching, so they parse correctly already:
- "944 Turbo S" → model "944", trim "Turbo S" ✓
- "928 GTS" → model "928", trim "GTS" ✓
- "912 Coupe" → model "912", trim "Coupe" ✓
- "912E" → exact match → model "912E", trim null ✓

**However:** "914-6 Coupe" → prefix "914" → `"914-6 Coupe".startsWith("914 ")` → false (hyphen, not space) → **parse failure**. Needs the same fix.

These models have no rows in `porsche_generations` → `generation_id` remains null. Listing caches fine; EraCard shows generic "Era guide for this generation coming soon." — needs a model-specific message per task spec.

---

## Current Brand Detection Logic

**None exists.** There is no brand detection layer. `parseBaTListing` calls `parseBatHtml`, which calls `splitModelTrim` unconditionally on all `postMake` strings. This means:

- A non-Porsche BaT listing "1970 Mercedes-Benz 280SL" → `postMake = "280SL"` → no prefix match → `model: null` → 422 → "We couldn't analyze that URL"
- A non-Porsche listing fails at exactly the same point as the 1975 911S Targa

---

## Current Non-Porsche Behavior

1. `parseBatHtml` tries `splitModelTrim` on the non-Porsche postMake
2. No Porsche prefix matches → `{ model: null, trim: null }`
3. Route hits the required-field guard → 422
4. User sees the error message; nothing is cached

---

## Comp Engine Cross-Brand Isolation

The comp pool is fetched in `lib/comp-engine-v2/index.ts:fetchV2Pool`:
```ts
.eq('generation_id', generationId)
```

Where `generationId = subject.generation_id ?? 'default'`.

In SQL, `WHERE generation_id = 'default'` does **not** match rows with `generation_id IS NULL`. Therefore:
- In-scope Porsche subjects (generation_id set) → pool is their specific generation only
- Out-of-scope Porsche / non-Porsche subjects (generation_id null → 'default') → pool is empty (no listings have `generation_id = 'default'` as a stored value)

**Cross-brand isolation is already guaranteed by the SQL filter.** No code change needed in the comp engine.

---

## Edge Cases Tested (Static Analysis — No Live Fetch)

| Title | splitModelTrim result | matchGeneration | Route outcome |
|---|---|---|---|
| 1975 Porsche 911S Targa | `model: null` (BUG) | not reached | 422 ❌ |
| 1969 Porsche 911 T Coupe | `model: "911"` ✓ | family '911' resolved ✓ | 200 ✓ |
| 1983 Porsche 911SC Cabriolet | `model: null` (BUG — "SC" not spaced) | not reached | 422 ❌ |
| 1975 Porsche 930 Turbo | `model: null` (BUG — "930" not in prefix list) | not reached | 422 ❌ |
| 1970 Porsche 914-6 Coupe | `model: null` (BUG — hyphen) | not reached | 422 ❌ |
| 1985 Porsche 944 Turbo | `model: "944"` ✓ | family unresolved (no 944 pattern) | 200 ✓ (no gen_id) |
| 1989 Porsche 928 S4 | `model: "928"` ✓ | family unresolved (no 928 pattern) | 200 ✓ (no gen_id) |
| 1970 Mercedes-Benz 280SL | `model: null` (no non-Porsche fallback) | not reached | 422 ❌ |
| 1972 BMW 2002 | `model: null` | not reached | 422 ❌ |

Note: "930" not in PORSCHE_MODEL_PREFIXES — a standalone 930-named BaT listing would also fail (though BaT often titles these as "1988 Porsche 911 Turbo"). This is outside the stated scope but documented for completeness.

---

## Proposed Fix Architecture

### 1. `lib/listing-parser/bring-a-trailer.ts` — `splitModelTrim` (primary fix)

**Change:** Replace the prefix check to also match when the next character after the prefix is an uppercase letter (variant designator like S, T, E, L, R, SC) or a hyphen (for "914-6"):

```ts
// Before:
if (postMake === prefix || postMake.startsWith(prefix + ' ')) {

// After:
if (postMake === prefix || (postMake.startsWith(prefix) && isValidSeparator(postMake[prefix.length]))) {
// where isValidSeparator(c) = c === ' ' || c === '-' || /^[A-Z]/.test(c)
```

Strip leading hyphen from remainder so "914-6" → trim "6", not "-6".

**Change:** Add a generic non-Porsche fallback in `parseBatHtml` step 5:
```ts
if (make?.toLowerCase() === 'porsche') {
  // existing splitModelTrim logic
} else {
  // Generic: first token = model, rest = trim
  const parts = postMake.split(/\s+/)
  model = parts[0] ?? null
  trim = parts.slice(1).join(' ') || null
}
```

### 2. `lib/generation-match.ts` — `FAMILY_PATTERNS` (secondary fix)

**Change:** `[/\b911\b/, '911']` → `[/\b911(?!\d)/, '911']`

Negative lookahead `(?!\d)` allows "911S", "911T", "911SC" etc. to match the '911' family, while "9110" (hypothetical) still fails (digit follows).

### 3. `components/analyze/EraCard.tsx` — fallback rendering (UI fix)

**Change:** Accept optional `make` and `model` props. When `generation === null`:
- If `make !== 'Porsche'` → render "We don't currently support [brand] for full analysis. Cached as comparable sale data."
- If `make === 'Porsche'` and `model` is in the out-of-scope set (912, 912E, 914, 924, 928, 944, 959, 968) → render "Porsche [model] — not yet in V1 catalog. Cached as comparable sale."
- All other null-generation cases → existing fallback logic (decade content, "Era guide coming soon")

### 4. `app/(app)/analyze/[id]/page.tsx`

**Change:** Pass `listing.make` and `listing.model` to `EraCard`.

---

## What Does NOT Change

- Comp engine code (`lib/comp-engine-v2/*`) — isolation already correct
- Watch-for catalog (`lib/watch-for/*`)
- Era-content files (`lib/era-content/*`)
- Any background jobs — none exist; safety posture unchanged
