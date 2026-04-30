// ============================================================
// Comp Engine V2 — Logger
// Writes every prediction to comp_engine_runs. No exceptions.
// ============================================================

import { createClient } from '@supabase/supabase-js'
import type { V2CompsResult, V2Subject } from './types'
import { MODEL_VERSION } from './types'

function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function logCompRun(
  result: V2CompsResult,
  subject: V2Subject,
  options: { wasBacktest?: boolean; actualPrice?: number | null } = {},
): Promise<string | null> {
  const admin = makeAdmin()

  const compsUsedJson = result.comps_used.map(c => ({
    listing_id: c.listing_id,
    similarity_score: c.similarity_score,
    recency_weight: c.recency_weight,
    final_weight: c.final_weight,
    price_cents: c.price_cents,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('comp_engine_runs')
    .insert({
      subject_listing_id: subject.id,
      model_version: MODEL_VERSION,
      generation_used: result.generation_used,
      weights_json: result.weights_used,
      comps_used_json: compsUsedJson,
      predicted_median: result.predicted_median,
      predicted_p25: result.predicted_p25,
      predicted_p75: result.predicted_p75,
      confidence_score: result.confidence_score,
      methodology_text: result.methodology_text,
      actual_price: options.actualPrice ?? null,
      was_backtest: options.wasBacktest ?? false,
      verdict: result.verdict,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[comp-engine-v2] failed to log run', {
      subject_id: subject.id,
      error: error.message,
    })
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any)?.id ?? null
}
