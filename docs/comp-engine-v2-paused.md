# Comp Engine V2 — Build Paused

**Date:** 2026-04-30  
**Reason:** Build spec was not included in the overnight build message.

## What happened

The overnight build message contained a placeholder:

> `[paste the full Comp Engine V2 build spec doc here, immediately after this line, in the same Claude Code message]`

No spec content followed it. The message ended there.

## What the spec was supposed to provide

The wrapper instructions explicitly deferred all of the following to the spec as "source of truth":

- **Phase 1, Step 1:** "all NEW columns from spec's 'Schema — full column list' section" — without this list, it is unknown which columns to add, what their types are, or which already exist from last night's run.
- **Phase 1, Step 2:** "Seed 993 generation per spec (16 trim_category rows)" — the 16 rows and their values are unknown.
- **Phase 1, Step 3:** "V1 seed weights from spec" for generation_weight_config — the weight values are unknown.
- **Phase 1, Step 4:** "Seed 993 bands (5 rows)" for generation_mileage_bands — the band boundaries are unknown.
- **Phase 1, Step 5:** comp_engine_runs table schema — columns, types, constraints unknown.
- **Phase 2, Step 7:** "all 9 stages per spec" of the V1 model — the stage definitions, thresholds, and logic are unknown.
- **Phase 2, Step 8:** "V1 condition stub per spec" — the formula and regex patterns are unknown.
- **Phase 3:** Backtest harness details that depend on the model spec.

## Why the build did not proceed

Inventing spec details (weights, band boundaries, column names, model logic) would produce a plausible-looking but incorrect implementation that would fail silently or produce wrong valuations. That outcome is worse than stopping.

## What to do

Re-send the overnight build message with the full spec doc pasted after the `---` separator. Everything is set up from last night's schema run — the build can start clean from Phase 1, Step 1.

## Working tree status

Clean. No changes were made. All 346 tests still passing.
