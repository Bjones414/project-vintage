import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// vi.hoisted — mock factories run before vi.mock hoisting
// ---------------------------------------------------------------------------
const { mockInsert } = vi.hoisted(() => ({
  mockInsert: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: mockInsert,
    }),
  }),
}))

import { POST } from '@/app/api/auth/v1-waitlist/route'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/auth/v1-waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockInsert.mockResolvedValue({ error: null })
})

describe('POST /api/auth/v1-waitlist', () => {
  // -------------------------------------------------------------------------
  // Happy path
  // -------------------------------------------------------------------------
  it('adds new email → 201 { status: "added" }', async () => {
    const res = await POST(makeRequest({ email: 'collector@example.com' }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.status).toBe('added')
  })

  it('trims whitespace before insert and validation', async () => {
    const res = await POST(makeRequest({ email: '  collector@example.com  ' }))
    expect(res.status).toBe(201)
    expect((await res.json()).status).toBe('added')
  })

  // -------------------------------------------------------------------------
  // Duplicate email — idempotent, not an error
  // -------------------------------------------------------------------------
  it('duplicate email → 200 { status: "already_listed" } not an error', async () => {
    mockInsert.mockResolvedValue({ error: { code: '23505', message: 'duplicate key value' } })
    const res = await POST(makeRequest({ email: 'collector@example.com' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.status).toBe('already_listed')
    expect(json.error).toBeUndefined()
  })

  // -------------------------------------------------------------------------
  // Validation — 400
  // -------------------------------------------------------------------------
  it('missing email → 400 validation_failed with email field', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('validation_failed')
    expect(json.fields.email).toBeTruthy()
  })

  it('empty string email → 400 validation_failed', async () => {
    const res = await POST(makeRequest({ email: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('validation_failed')
    expect(json.fields.email).toBeTruthy()
  })

  it('invalid email format → 400 validation_failed', async () => {
    const res = await POST(makeRequest({ email: 'notanemail' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('validation_failed')
    expect(json.fields.email).toBeTruthy()
  })

  // -------------------------------------------------------------------------
  // Malformed body
  // -------------------------------------------------------------------------
  it('non-JSON body → 400 validation_failed', async () => {
    const req = new NextRequest('http://localhost/api/auth/v1-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('validation_failed')
  })
})
