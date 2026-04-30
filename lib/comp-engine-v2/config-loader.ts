// ============================================================
// Comp Engine V2 — Config Loader
// Fetches generation weights, mileage bands, and trim taxonomy
// from editorial config tables. Falls back to 'default' if the
// subject's generation_id has no config row.
// ============================================================

import { createClient } from '@supabase/supabase-js'
import type {
  EngineConfig,
  GenerationWeights,
  MileageBand,
  TrimTaxonomyEntry,
  FactorName,
} from './types'
import { ALL_FACTORS as FACTORS } from './types'

function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = ReturnType<typeof createClient<any>>

async function loadWeights(
  client: AnyClient,
  generationId: string,
): Promise<{ weights: GenerationWeights; generationUsed: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client as any)
    .from('generation_weight_config')
    .select('generation, factor_name, weight')
    .eq('generation', generationId) as {
      data: Array<{ generation: string; factor_name: string; weight: string }> | null
      error: { message: string } | null
    }

  if (error) throw new Error(`[comp-engine-v2] loadWeights error: ${error.message}`)

  const rows = data ?? []

  // If no config for this generation, fall back to 'default'
  if (rows.length === 0 && generationId !== 'default') {
    return loadWeights(client, 'default')
  }

  const generationUsed = rows.length > 0 ? rows[0].generation : 'default'
  const weightMap = {} as Record<FactorName, number>

  for (const factor of FACTORS) {
    const row = rows.find(r => r.factor_name === factor)
    weightMap[factor] = row ? parseFloat(row.weight) : 0
  }

  return { weights: { generation: generationUsed, weights: weightMap }, generationUsed }
}

async function loadBands(client: AnyClient, generationId: string): Promise<MileageBand[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client as any)
    .from('generation_mileage_bands')
    .select('band_name, min_miles, max_miles')
    .eq('generation', generationId) as {
      data: Array<{ band_name: string; min_miles: number; max_miles: number | null }> | null
      error: { message: string } | null
    }

  if (error) throw new Error(`[comp-engine-v2] loadBands error: ${error.message}`)

  const rows = data ?? []
  if (rows.length === 0 && generationId !== 'default') {
    return loadBands(client, 'default')
  }

  return rows.map(r => ({
    band_name: r.band_name as MileageBand['band_name'],
    min_miles: r.min_miles,
    max_miles: r.max_miles,
  }))
}

async function loadTaxonomy(client: AnyClient, generationId: string): Promise<TrimTaxonomyEntry[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client as any)
    .from('trim_taxonomy')
    .select('generation, trim_category, is_separate_market')
    .eq('generation', generationId) as {
      data: Array<{ generation: string; trim_category: string; is_separate_market: boolean }> | null
      error: { message: string } | null
    }

  if (error) throw new Error(`[comp-engine-v2] loadTaxonomy error: ${error.message}`)
  return (data ?? []).map(r => ({
    generation: r.generation,
    trim_category: r.trim_category,
    is_separate_market: r.is_separate_market,
  }))
}

export async function loadEngineConfig(generationId: string): Promise<EngineConfig> {
  const client = makeAdmin()

  const [{ weights, generationUsed }, bands, taxonomy] = await Promise.all([
    loadWeights(client, generationId),
    loadBands(client, generationId),
    loadTaxonomy(client, generationId),
  ])

  return { weights, bands, taxonomy, generationUsed }
}

// For backtest: load all configs in one pass. Returns map by generation_id.
export async function loadAllConfigs(
  generationIds: string[],
): Promise<Map<string, EngineConfig>> {
  const client = makeAdmin()
  const result = new Map<string, EngineConfig>()

  await Promise.all(
    generationIds.map(async genId => {
      const [{ weights, generationUsed }, bands, taxonomy] = await Promise.all([
        loadWeights(client, genId),
        loadBands(client, genId),
        loadTaxonomy(client, genId),
      ])
      result.set(genId, { weights, bands, taxonomy, generationUsed })
    }),
  )

  return result
}
