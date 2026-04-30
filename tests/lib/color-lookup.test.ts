import { describe, it, expect, vi } from 'vitest'
import { resolveColorData } from '@/lib/utils/color-lookup'
import type { Tables } from '@/lib/supabase/types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ARCTIC_SILVER: Tables<'porsche_color_codes'> = {
  id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
  paint_code: '92U',
  color_name: 'Arctic Silver Metallic',
  color_family: 'Silver',
  finish_type: 'Metallic',
  generation_applicability: ['993'],
  is_special_order: false,
  rarity: 'common',
  notes: null,
  source_note: 'Porsche AG press data; Stuttcars 993 palette reference',
  content_status: 'published',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

const PYTHON_GREEN: Tables<'porsche_color_codes'> = {
  id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
  paint_code: null,
  color_name: 'Python Green',
  color_family: 'Green',
  finish_type: 'Solid',
  generation_applicability: ['992'],
  is_special_order: true,
  rarity: 'rare',
  notes: null,
  source_note: 'Porsche AG press data; PTS colour',
  content_status: 'published',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Mock factory
//
// Each call to .maybeSingle() consumes the next entry from `responses`.
// Chained query builder methods (select, eq, ilike, contains) all return
// the same builder object via mockReturnThis().
// ---------------------------------------------------------------------------

function makeClient(
  responses: Array<{ data: Tables<'porsche_color_codes'> | null; error: null }>,
) {
  let idx = 0
  const maybeSingle = vi.fn().mockImplementation(async () => {
    const r = responses[idx++] ?? { data: null, error: null }
    return r
  })
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    maybeSingle,
  }
  return {
    from: vi.fn().mockReturnValue(builder),
  } as unknown as SupabaseClient<Database>
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('resolveColorData', () => {
  it('returns color by paint_code when provided and found', async () => {
    const client = makeClient([{ data: ARCTIC_SILVER, error: null }])
    const result = await resolveColorData(client, {
      paintCode: '92U',
      colorName: 'Arctic Silver Metallic',
      generationId: '993',
    })
    expect(result).toEqual(ARCTIC_SILVER)
  })

  it('falls back to ILIKE name match when paintCode is null', async () => {
    const client = makeClient([{ data: ARCTIC_SILVER, error: null }])
    const result = await resolveColorData(client, {
      paintCode: null,
      colorName: 'Arctic Silver Metallic',
      generationId: '993',
    })
    expect(result).toEqual(ARCTIC_SILVER)
  })

  it('falls back to ILIKE when paint_code lookup returns null', async () => {
    // First maybeSingle (paint_code) returns null; second (ILIKE) returns the row.
    const client = makeClient([
      { data: null, error: null },
      { data: ARCTIC_SILVER, error: null },
    ])
    const result = await resolveColorData(client, {
      paintCode: '92U',
      colorName: 'Arctic Silver Metallic',
      generationId: '993',
    })
    expect(result).toEqual(ARCTIC_SILVER)
  })

  it('resolves a color with null paint_code via name fallback', async () => {
    const client = makeClient([{ data: PYTHON_GREEN, error: null }])
    const result = await resolveColorData(client, {
      paintCode: null,
      colorName: 'Python Green',
      generationId: '992',
    })
    expect(result).toEqual(PYTHON_GREEN)
  })

  it('returns null when paint_code and name both fail to match', async () => {
    const client = makeClient([
      { data: null, error: null },
      { data: null, error: null },
    ])
    const result = await resolveColorData(client, {
      paintCode: 'ZZZ',
      colorName: 'Unknown Color',
      generationId: '993',
    })
    expect(result).toBeNull()
  })

  it('returns null when both paintCode and colorName are null', async () => {
    const client = makeClient([])
    const result = await resolveColorData(client, {
      paintCode: null,
      colorName: null,
      generationId: '993',
    })
    expect(result).toBeNull()
  })

  it('performs ILIKE lookup without contains when generationId is null', async () => {
    const client = makeClient([{ data: ARCTIC_SILVER, error: null }])
    const result = await resolveColorData(client, {
      paintCode: null,
      colorName: 'Arctic Silver Metallic',
      generationId: null,
    })
    expect(result).toEqual(ARCTIC_SILVER)
    // contains should not have been called since generationId is null
    const builder = (client.from as ReturnType<typeof vi.fn>).mock.results[0].value
    expect(builder.contains).not.toHaveBeenCalled()
  })

  it('calls contains when generationId is provided for name fallback', async () => {
    const client = makeClient([{ data: ARCTIC_SILVER, error: null }])
    await resolveColorData(client, {
      paintCode: null,
      colorName: 'Arctic Silver Metallic',
      generationId: '993',
    })
    const builder = (client.from as ReturnType<typeof vi.fn>).mock.results[0].value
    expect(builder.contains).toHaveBeenCalledWith('generation_applicability', ['993'])
  })
})
