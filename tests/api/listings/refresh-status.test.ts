import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── vi.hoisted: values available inside vi.mock factories ──────────────────

const { mockGetUser, mockCheckRateLimit, mockAdminFrom } = vi.hoisted(() => ({
  mockGetUser:       vi.fn(),
  mockCheckRateLimit: vi.fn(),
  mockAdminFrom:     vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({ auth: { getUser: mockGetUser } }),
}))

vi.mock('@/lib/api/rate-limit', () => ({
  checkRateLimit: mockCheckRateLimit,
}))

vi.mock('@/lib/listing-parser', () => ({ parseListing: vi.fn() }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockAdminFrom })),
}))

const { POST } = await import('@/app/api/listings/[id]/refresh-status/route')

// ── helpers ────────────────────────────────────────────────────────────────

function authedUser(userId = 'user-abc') {
  mockGetUser.mockResolvedValue({ data: { user: { id: userId } } })
}

function noUser() {
  mockGetUser.mockResolvedValue({ data: { user: null } })
}

function makeRequest(id = 'lst-1') {
  return {
    request: new NextRequest('http://localhost/api/listings/lst-1/refresh-status', {
      method: 'POST',
    }),
    params: { id },
  }
}

function setupAdminListing(listing: Record<string, unknown> | null, error: unknown = null) {
  mockAdminFrom.mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq:     vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: listing, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: listing, error }),
  })
}

// ── tests ──────────────────────────────────────────────────────────────────

describe('POST /api/listings/[id]/refresh-status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCheckRateLimit.mockReturnValue(true)
  })

  it('returns 401 when unauthenticated', async () => {
    noUser()
    const { request, params } = makeRequest()
    const res = await POST(request, { params })
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json).toEqual({ error: 'Authentication required' })
  })

  it('returns 429 when rate limit is exceeded', async () => {
    authedUser()
    mockCheckRateLimit.mockReturnValue(false)
    const { request, params } = makeRequest()
    const res = await POST(request, { params })
    expect(res.status).toBe(429)
    const json = await res.json()
    expect(json).toEqual({ error: 'Rate limit exceeded' })
  })

  it('returns 200 with expected response shape when authed within rate limit', async () => {
    authedUser()
    // Auction ends well in the future — endpoint returns early with refreshed:false
    const futureEnd = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    setupAdminListing({ id: 'lst-1', source_url: 'https://bringatrailer.com/listing/lst-1', auction_ends_at: futureEnd })
    const { request, params } = makeRequest()
    const res = await POST(request, { params })
    expect(res.status).toBe(200)
    const json = await res.json()
    // Response shape: { refreshed: boolean, reason?: string, listing?: object }
    expect(typeof json.refreshed).toBe('boolean')
    expect(json.refreshed).toBe(false)
    expect(typeof json.reason).toBe('string')
  })
})
