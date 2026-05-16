import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// vi.hoisted — mock factories run before vi.mock hoisting
// ---------------------------------------------------------------------------
const {
  mockGeocode,
  mockCreateUser,
  mockDeleteUser,
  mockRpc,
} = vi.hoisted(() => ({
  mockGeocode:     vi.fn(),
  mockCreateUser:  vi.fn(),
  mockDeleteUser:  vi.fn(),
  mockRpc:         vi.fn(),
}))

vi.mock('@/lib/geocode/census', () => ({
  geocodeUsAddress: mockGeocode,
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      admin: {
        createUser: mockCreateUser,
        deleteUser: mockDeleteUser,
      },
    },
    rpc: mockRpc,
  }),
}))

import { POST } from '@/app/api/auth/signup/route'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const VALID_BODY = {
  email: 'alpha@example.com',
  password: 'password123',
  firstName: 'Ada',
  lastName:  'Lovelace',
  city:      'Scottsdale',
  state:     'AZ',
}

beforeEach(() => {
  vi.clearAllMocks()
  // Default happy-path stubs
  mockGeocode.mockResolvedValue({ lat: 33.4942, lng: -111.9261 })
  mockCreateUser.mockResolvedValue({
    data: { user: { id: 'auth-user-uuid' } },
    error: null,
  })
  mockDeleteUser.mockResolvedValue({ error: null })
  mockRpc.mockResolvedValue({
    data: { success: true },
    error: null,
  })
})

describe('POST /api/auth/signup', () => {
  // -------------------------------------------------------------------------
  // Happy path
  // -------------------------------------------------------------------------
  it('creates alpha account and returns 201 with correct fields', async () => {
    const res = await POST(makeRequest(VALID_BODY))
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.account_type).toBe('alpha')
    expect(json.id).toBe('auth-user-uuid')
    expect(typeof json.alpha_expires_at).toBe('string')
    // alpha_expires_at should be ~45 days in the future
    const expiry = new Date(json.alpha_expires_at)
    const diffDays = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    expect(diffDays).toBeGreaterThan(44)
    expect(diffDays).toBeLessThan(46)
    expect(mockRpc).toHaveBeenCalledTimes(1)
  })

  it('passes all six fields to RPC correctly', async () => {
    await POST(makeRequest(VALID_BODY))
    expect(mockRpc).toHaveBeenCalledTimes(1)
    expect(mockRpc).toHaveBeenCalledWith('create_alpha_user', {
      p_id:         'auth-user-uuid',
      p_email:      'alpha@example.com',
      p_first_name: 'Ada',
      p_last_name:  'Lovelace',
      p_home_city:  'Scottsdale',
      p_home_state: 'AZ',
      p_home_lat:   33.4942,
      p_home_lng:   -111.9261,
    })
  })

  // -------------------------------------------------------------------------
  // Validation errors — 400
  // -------------------------------------------------------------------------
  it('rejects missing email → 400', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, email: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('validation_failed')
    expect(json.fields.email).toBeTruthy()
  })

  it('rejects invalid email format → 400', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, email: 'notanemail' }))
    expect(res.status).toBe(400)
    expect((await res.json()).fields.email).toBeTruthy()
  })

  it('rejects password shorter than 8 chars → 400', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, password: 'short' }))
    expect(res.status).toBe(400)
    expect((await res.json()).fields.password).toBeTruthy()
  })

  it('rejects empty firstName → 400', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, firstName: '   ' }))
    expect(res.status).toBe(400)
    expect((await res.json()).fields.firstName).toBeTruthy()
  })

  it('rejects empty lastName → 400', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, lastName: '' }))
    expect(res.status).toBe(400)
    expect((await res.json()).fields.lastName).toBeTruthy()
  })

  it('rejects empty city → 400', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, city: '' }))
    expect(res.status).toBe(400)
    expect((await res.json()).fields.city).toBeTruthy()
  })

  it('rejects invalid state (non-2-letter) → 400', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, state: 'Arizona' }))
    expect(res.status).toBe(400)
    expect((await res.json()).fields.state).toBeTruthy()
  })

  it('returns all field errors when multiple fields are invalid', async () => {
    const res = await POST(makeRequest({ email: '', password: '1', firstName: '', lastName: '', city: '', state: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(Object.keys(json.fields).length).toBeGreaterThan(1)
  })

  // -------------------------------------------------------------------------
  // Geocode soft-fail — null result never blocks signup
  // -------------------------------------------------------------------------
  it('geocoding null does not block signup — returns 201 with null lat/lng passed to RPC', async () => {
    mockGeocode.mockResolvedValue(null)
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(201)
    expect(mockRpc).toHaveBeenCalledTimes(1)
    const rpcArgs = mockRpc.mock.calls[0]?.[1] as Record<string, unknown>
    expect(rpcArgs.p_home_lat).toBeNull()
    expect(rpcArgs.p_home_lng).toBeNull()
  })

  // -------------------------------------------------------------------------
  // Idempotency — infrastructure double-invocation regression (2026-05-16)
  // -------------------------------------------------------------------------
  it('idempotent double-invocation: success response from RPC does not trigger orphan cleanup', async () => {
    // create_alpha_user now returns { success: true } when the user row already
    // exists (via the EXISTS guard added in the idempotency migration). The route
    // must treat this as success — return 201, do NOT call deleteUser.
    // Guards against any future regression where the route adds a second RPC call
    // or where the RPC error-path is incorrectly triggered on a duplicate row.
    mockRpc.mockResolvedValue({ data: { success: true }, error: null })
    const res = await POST(makeRequest(VALID_BODY))
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.account_type).toBe('alpha')
    expect(mockRpc).toHaveBeenCalledTimes(1) // route calls RPC exactly once per HTTP request
    expect(mockDeleteUser).not.toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // Alpha capacity
  // -------------------------------------------------------------------------
  it('returns 403 alpha_capacity_reached and cleans up auth user', async () => {
    mockRpc.mockResolvedValue({
      data: { error: 'alpha_capacity_reached' },
      error: null,
    })
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.error).toBe('alpha_capacity_reached')
    expect(mockDeleteUser).toHaveBeenCalledWith('auth-user-uuid')
  })

  // -------------------------------------------------------------------------
  // Duplicate email
  // -------------------------------------------------------------------------
  it('returns 409 email_taken on duplicate email', async () => {
    mockCreateUser.mockResolvedValue({
      data: null,
      error: { status: 422, message: 'User already registered' },
    })
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(409)
    expect((await res.json()).error).toBe('email_taken')
  })

  // -------------------------------------------------------------------------
  // Orphan cleanup
  // -------------------------------------------------------------------------
  it('deletes auth user when RPC returns an error', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'database error' },
    })
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(500)
    expect(mockDeleteUser).toHaveBeenCalledWith('auth-user-uuid')
  })

  it('deletes auth user when RPC returns unexpected payload', async () => {
    mockRpc.mockResolvedValue({ data: { unexpected: true }, error: null })
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(500)
    expect(mockDeleteUser).toHaveBeenCalledWith('auth-user-uuid')
  })

  // -------------------------------------------------------------------------
  // Regression — no zip code in signup flow
  // -------------------------------------------------------------------------
  it('accepts city+state with no zip field and succeeds', async () => {
    // VALID_BODY has no zip_code — this is the canonical no-zip happy path
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(201)
  })

  it('ignores any zip_code field in the payload and does not forward it to the RPC', async () => {
    const bodyWithZip = { ...VALID_BODY, zip_code: '85251', zipCode: '85251', postal_code: '85251' }
    const res = await POST(makeRequest(bodyWithZip))
    expect(res.status).toBe(201)
    const rpcArgs = mockRpc.mock.calls[0]?.[1] as Record<string, unknown>
    expect(Object.keys(rpcArgs)).not.toContain('p_zip_code')
    expect(Object.keys(rpcArgs)).not.toContain('p_home_zip')
    expect(Object.keys(rpcArgs)).not.toContain('p_postal_code')
  })

  // -------------------------------------------------------------------------
  // Non-JSON body
  // -------------------------------------------------------------------------
  it('returns 400 for non-JSON body', async () => {
    const req = new NextRequest('http://localhost/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('bad_request')
  })
})
