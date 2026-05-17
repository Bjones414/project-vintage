import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── vi.hoisted: values available inside vi.mock factories ──────────────────

const { mockGetUser, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom:    vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}))

// parseListing and shouldRefetch are not under test here — stub them out
vi.mock('@/lib/listing-parser', () => ({ parseListing: vi.fn() }))
vi.mock('@/lib/listing-cache', () => ({
  shouldRefetch:       vi.fn().mockReturnValue(false),
  toCacheStatus:       vi.fn().mockReturnValue('live'),
  batchRefreshDelayMs: vi.fn().mockReturnValue(0),
}))
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      in:     vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      data:   [],
      error:  null,
    }),
  })),
}))

const { POST } = await import('@/app/api/watchlist/refresh/route')

// ── helpers ────────────────────────────────────────────────────────────────

function authedUser(userId = 'user-123') {
  mockGetUser.mockResolvedValue({ data: { user: { id: userId } }, error: null })
}

function noUser() {
  mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
}

function makeRequest(body?: unknown) {
  return new NextRequest('http://localhost/api/watchlist/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

// ── POST /api/watchlist/refresh ─────────────────────────────────────────────

describe('POST /api/watchlist/refresh', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when unauthenticated', async () => {
    noUser()
    const res = await POST(makeRequest({ listing_ids: ['lst-1'] }))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Authentication required')
  })

  it('returns 200 with zero counts when listing_ids is empty', async () => {
    authedUser()
    mockFrom.mockReturnValue({
      select: () => ({ in: () => ({ data: [], error: null }) }),
    })
    const res = await POST(makeRequest({ listing_ids: [] }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.refreshed).toBe(0)
  })

  it('returns 200 with zero counts when listing_ids is missing', async () => {
    authedUser()
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.refreshed).toBe(0)
  })

  it('returns 400 when body is not JSON', async () => {
    authedUser()
    const res = await POST(
      new NextRequest('http://localhost/api/watchlist/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      }),
    )
    expect(res.status).toBe(400)
  })
})
