-- Add cascade_level to comp_engine_runs.
-- The comp engine V2 logger writes this value (logger.ts line 49) and silently
-- fails if the column is absent. Values 1–6 map to CascadeLevel in types.ts.
ALTER TABLE comp_engine_runs
  ADD COLUMN IF NOT EXISTS cascade_level integer;
