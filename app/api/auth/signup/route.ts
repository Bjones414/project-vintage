// POST /api/auth/signup
//
// Alpha account signup. Accepts six fields: email, password, firstName, lastName,
// city, state. Geocodes home location via Nominatim, then atomically checks
// the 5-account alpha cap and inserts the user row via RPC.
//
// Atomic user creation:
//   1. Validate inputs (fail fast — no auth user created yet)
//   2. Geocode city+state — soft-fail: null lat/lng if unreachable or not found
//   3. Create Supabase auth user (service role admin API)
//   4. Call RPC create_alpha_user: advisory-lock → cap check → INSERT
//   5. On any failure after step 3: delete the orphaned auth user
//
// Cap-reached response: 403 { error: 'alpha_capacity_reached', message: '...' }
// Validation errors:  400 { error: 'validation_failed', fields: { ... } }
// Success:           201 { id, account_type, alpha_expires_at }
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { geocodeUsAddress } from '@/lib/geocode/census'
import type { Database } from '@/lib/supabase/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STATE_RE = /^[A-Za-z]{2}$/

function adminClient() {
  return createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'bad_request', message: 'Request body must be JSON' },
      { status: 400 },
    )
  }

  const {
    email,
    password,
    firstName,
    lastName,
    city,
    state,
  } = (body ?? {}) as Record<string, unknown>

  // --- Server-side validation ---
  const fields: Record<string, string> = {}
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    fields.email = 'Valid email address required'
  }
  if (typeof password !== 'string' || password.length < 8) {
    fields.password = 'Password must be at least 8 characters'
  }
  if (typeof firstName !== 'string' || !firstName.trim()) {
    fields.firstName = 'First name is required'
  }
  if (typeof lastName !== 'string' || !lastName.trim()) {
    fields.lastName = 'Last name is required'
  }
  if (typeof city !== 'string' || !city.trim()) {
    fields.city = 'City is required'
  }
  if (typeof state !== 'string' || !STATE_RE.test(state.trim())) {
    fields.state = 'Valid 2-letter US state code required (e.g. AZ)'
  }

  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: 'validation_failed', fields },
      { status: 400 },
    )
  }

  // --- Geocode city + state — soft-fail so geocoding never blocks signup ---
  const coords = await geocodeUsAddress(city as string, state as string)
  if (!coords) {
    console.warn('[signup] Geocoding returned null for', city, state, '— proceeding with null lat/lng')
  }
  const homeLat: number | null = coords?.lat ?? null
  const homeLng: number | null = coords?.lng ?? null

  const supabaseAdmin = adminClient()

  // --- Create Supabase auth user ---
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: (email as string).trim(),
      password: password as string,
      email_confirm: false,
    })

  if (authError || !authData?.user) {
    const msg = authError?.message ?? ''
    const isDuplicate =
      (authError?.status === 422) ||
      msg.toLowerCase().includes('already registered') ||
      msg.toLowerCase().includes('already been registered')
    if (isDuplicate) {
      return NextResponse.json(
        {
          error: 'email_taken',
          message: 'An account with that email already exists.',
        },
        { status: 409 },
      )
    }
    return NextResponse.json(
      { error: 'auth_failed', message: 'Failed to create account. Please try again.' },
      { status: 500 },
    )
  }

  const authUserId = authData.user.id

  // --- Atomic cap check + user row insert via RPC ---
  const { data: rpcResult, error: rpcError } =
    await supabaseAdmin.rpc('create_alpha_user', {
      p_id:         authUserId,
      p_email:      (email as string).trim(),
      p_first_name: (firstName as string).trim(),
      p_last_name:  (lastName as string).trim(),
      p_home_city:  (city as string).trim(),
      p_home_state: (state as string).trim().toUpperCase(),
      p_home_lat:   homeLat,
      p_home_lng:   homeLng,
    })

  if (rpcError) {
    await supabaseAdmin.auth.admin.deleteUser(authUserId)
    return NextResponse.json(
      { error: 'signup_failed', message: 'Failed to create account. Please try again.' },
      { status: 500 },
    )
  }

  const result = rpcResult as { success?: boolean; error?: string } | null

  if (result?.error === 'alpha_capacity_reached') {
    await supabaseAdmin.auth.admin.deleteUser(authUserId)
    return NextResponse.json(
      {
        error: 'alpha_capacity_reached',
        message: 'Alpha is at capacity. Check back soon.',
      },
      { status: 403 },
    )
  }

  if (!result?.success) {
    await supabaseAdmin.auth.admin.deleteUser(authUserId)
    return NextResponse.json(
      { error: 'signup_failed', message: 'Failed to create account. Please try again.' },
      { status: 500 },
    )
  }

  const alphaExpiresAt = new Date()
  alphaExpiresAt.setDate(alphaExpiresAt.getDate() + 45)

  return NextResponse.json(
    {
      id: authUserId,
      account_type: 'alpha',
      alpha_expires_at: alphaExpiresAt.toISOString(),
    },
    { status: 201 },
  )
}
