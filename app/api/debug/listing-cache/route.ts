// GET /api/debug/listing-cache?id=xxx
//
// DEV ONLY — returns cache metadata for a listing. Returns 404 in production.
// Used by CacheStatusBadge (components/debug/CacheStatusBadge.tsx) to display
// a floating cache state indicator on the analyze page during local development.
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 })
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data, error } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabaseAdmin as any)
      .from('listings')
      .select('id, cache_status, last_fetched_at, listing_status')
      .eq('id', id)
      .maybeSingle() as unknown as Promise<{
        data: {
          id: string
          cache_status: string
          last_fetched_at: string | null
          listing_status: string | null
        } | null
        error: { message: string } | null
      }>
  )

  if (error || !data) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  return NextResponse.json(data, { status: 200 })
}
