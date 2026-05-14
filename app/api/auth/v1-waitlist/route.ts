// POST /api/auth/v1-waitlist
//
// Idempotent waitlist capture for when alpha is at capacity.
// Duplicate emails return { status: 'already_listed' } rather than an error.
//
// Responses:
//   201 { status: 'added' }
//   200 { status: 'already_listed' }
//   400 { error: 'validation_failed', fields: { email: string } }
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'validation_failed', fields: { email: "An email address — we'll write you when V1 opens." } },
      { status: 400 },
    )
  }

  const { email } = (body ?? {}) as Record<string, unknown>
  const emailStr = typeof email === 'string' ? email.trim() : ''

  if (!emailStr) {
    return NextResponse.json(
      { error: 'validation_failed', fields: { email: "An email address — we'll write you when V1 opens." } },
      { status: 400 },
    )
  }

  if (!EMAIL_RE.test(emailStr)) {
    return NextResponse.json(
      { error: 'validation_failed', fields: { email: "That doesn't look like an email address." } },
      { status: 400 },
    )
  }

  const supabase = createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { error } = await supabase
    .from('v1_waitlist')
    .insert({ email: emailStr })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ status: 'already_listed' }, { status: 200 })
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }

  return NextResponse.json({ status: 'added' }, { status: 201 })
}
