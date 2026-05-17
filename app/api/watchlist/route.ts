// GET  /api/watchlist — returns the authenticated user's saved listings
// POST /api/watchlist — adds { listing_id } to the user's watchlist
// DELETE /api/watchlist?listing_id=xxx — removes a listing from the user's watchlist
//
// RLS on the watchlist table enforces user_id = auth.uid() for all operations.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type WatchlistItem = {
  id: string
  created_at: string
  listing_id: string
  listings: {
    id: string
    year: number | null
    make: string | null
    model: string | null
    trim: string | null
    mileage: number | null
    final_price: number | null
    high_bid: number | null
    listing_status: string | null
    cache_status: string
    last_fetched_at: string | null
    source_platform: string
    source_url: string
  }
}

export async function GET(_request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { data, error } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('watchlist')
      .select(`
        id,
        created_at,
        listing_id,
        listings (
          id, year, make, model, trim, mileage,
          final_price, high_bid, listing_status,
          cache_status, last_fetched_at,
          source_platform, source_url
        )
      `)
      .order('created_at', { ascending: false }) as unknown as Promise<{
        data: WatchlistItem[] | null
        error: { message: string } | null
      }>
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ watchlist: data ?? [] }, { status: 200 })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 })
  }
  const { listing_id } = (body ?? {}) as Record<string, unknown>
  if (typeof listing_id !== 'string' || !listing_id.trim()) {
    return NextResponse.json({ error: 'Missing required field: listing_id' }, { status: 400 })
  }

  const { error } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('watchlist')
      .insert({ user_id: user.id, listing_id }) as unknown as Promise<{
        error: { code?: string; message: string } | null
      }>
  )

  if (error) {
    if (error.code === '23505') {
      // unique_violation — already saved, treat as success
      return NextResponse.json({ saved: true, duplicate: true }, { status: 200 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ saved: true }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const listing_id = searchParams.get('listing_id')
  if (!listing_id) {
    return NextResponse.json({ error: 'Missing required query param: listing_id' }, { status: 400 })
  }

  // RLS enforces user_id = auth.uid() — users can only delete their own rows
  const { error } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('watchlist')
      .delete()
      .eq('listing_id', listing_id) as unknown as Promise<{
        error: { message: string } | null
      }>
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ removed: true }, { status: 200 })
}
