import { createClient } from '@supabase/supabase-js'
import type { ResearchRecord } from './types'

export type ResearchComp = {
  id: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  mileage: number | null
  final_price: number | null
  auction_ends_at: string | null
  source_url: string | null
  source_platform: string
  source_publication: string | null
}

export type ResearchCompResult = {
  allComps: ResearchComp[]
  filteredComps: ResearchComp[]
  p25: number | null
  median: number | null
  p75: number | null
  midpoint: number | null
  count: number
  isMileageFiltered: boolean
  sufficient: boolean
}

const SUFFICIENT_THRESHOLD = 5

function pctile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  return Math.round(sorted[lo] + (idx - lo) * (sorted[hi] - sorted[lo]))
}

function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function fetchResearchComps(record: ResearchRecord): Promise<ResearchCompResult> {
  const admin = makeAdmin()
  const { generation_id: generationId, model, trim, mileage: subjectMileage } = record

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (admin as any)
    .from('listings')
    .select('id, year, make, model, trim, mileage, final_price, auction_ends_at, source_url, source_platform, source_publication')
    .eq('listing_status', 'sold')
    .not('final_price', 'is', null)
    .order('auction_ends_at', { ascending: false })
    .limit(100)

  if (generationId) {
    query = query.eq('generation_id', generationId)
  } else {
    query = query
      .ilike('model', `%${model}%`)
      .gte('year', record.year - 2)
      .lte('year', record.year + 2)
  }

  if (trim) {
    query = query.ilike('trim', `%${trim}%`)
  }

  const { data } = await query
  const allComps = (data ?? []) as ResearchComp[]

  let filteredComps = allComps
  let isMileageFiltered = false

  if (subjectMileage != null && subjectMileage > 0) {
    const lo = subjectMileage * 0.75
    const hi = subjectMileage * 1.25
    const byMileage = allComps.filter(
      (c) => c.mileage != null && c.mileage >= lo && c.mileage <= hi,
    )
    if (byMileage.length >= 3) {
      filteredComps = byMileage
      isMileageFiltered = true
    }
  }

  const prices = filteredComps
    .map((c) => c.final_price)
    .filter((p): p is number => p != null)
    .sort((a, b) => a - b)

  const p25 = prices.length >= 3 ? pctile(prices, 25) : null
  const median = prices.length >= 1 ? pctile(prices, 50) : null
  const p75 = prices.length >= 3 ? pctile(prices, 75) : null
  const midpoint =
    p25 != null && p75 != null ? Math.round((p25 + p75) / 2) : (median ?? null)

  return {
    allComps,
    filteredComps,
    p25,
    median,
    p75,
    midpoint,
    count: prices.length,
    isMileageFiltered,
    sufficient: prices.length >= SUFFICIENT_THRESHOLD,
  }
}
