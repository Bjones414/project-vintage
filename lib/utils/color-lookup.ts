import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables } from '@/lib/supabase/types'

type ColorRow = Tables<'porsche_color_codes'>

export async function resolveColorData(
  supabase: SupabaseClient<Database>,
  opts: {
    paintCode: string | null
    colorName: string | null
    generationId: string | null
  },
): Promise<ColorRow | null> {
  const { paintCode, colorName, generationId } = opts

  // Primary: exact paint code match
  if (paintCode) {
    const { data } = await supabase
      .from('porsche_color_codes')
      .select('*')
      .eq('paint_code', paintCode)
      .maybeSingle()
    if (data) return data
  }

  // Fallback: case-insensitive name match, scoped to generation when known
  if (colorName) {
    let query = supabase
      .from('porsche_color_codes')
      .select('*')
      .ilike('color_name', colorName)
    if (generationId) {
      query = query.contains('generation_applicability', [generationId])
    }
    const { data } = await query.maybeSingle()
    if (data) return data
  }

  return null
}
