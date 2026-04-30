// GET  /api/admin/comp-flags          — list all flagged or cross-grouped listings
// PATCH /api/admin/comp-flags          — set is_comp_resistant and/or cross_listing_group_id
// Admin-only: requires users.role = 'admin'

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

function makeAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function requireAdmin(): Promise<{ userId: string } | NextResponse> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const admin = makeAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: user } = await (admin as any)
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single() as { data: { role: string } | null; error: unknown }

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return { userId: session.user.id }
}

export async function GET() {
  const check = await requireAdmin()
  if (check instanceof NextResponse) return check

  const admin = makeAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('listings')
    .select('id, source_url, year, make, model, trim, mileage, final_price, is_comp_resistant, cross_listing_group_id, auction_ends_at')
    .or('is_comp_resistant.eq.true,cross_listing_group_id.not.is.null')
    .order('auction_ends_at', { ascending: false })
    .limit(500) as { data: unknown[] | null; error: { message: string } | null }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ listings: data ?? [] })
}

export async function PATCH(request: NextRequest) {
  const check = await requireAdmin()
  if (check instanceof NextResponse) return check

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || !('listing_id' in body)) {
    return NextResponse.json({ error: 'Missing required field: listing_id' }, { status: 400 })
  }

  const {
    listing_id,
    is_comp_resistant,
    cross_listing_group_id,
  } = body as Record<string, unknown>

  if (typeof listing_id !== 'string' || listing_id.trim() === '') {
    return NextResponse.json({ error: 'listing_id must be a non-empty string' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {}

  if (typeof is_comp_resistant === 'boolean') {
    patch.is_comp_resistant = is_comp_resistant
  }
  if (cross_listing_group_id === null || typeof cross_listing_group_id === 'string') {
    patch.cross_listing_group_id = cross_listing_group_id
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update (is_comp_resistant, cross_listing_group_id)' }, { status: 400 })
  }

  const admin = makeAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('listings')
    .update(patch)
    .eq('id', listing_id)
    .select('id, is_comp_resistant, cross_listing_group_id')
    .single() as { data: unknown | null; error: { message: string } | null }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ listing: data })
}
