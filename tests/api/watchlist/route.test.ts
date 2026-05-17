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

// Import handlers after mocks are in place
const { GET, POST, DELETE } = await import('@/app/api/watchlist/route')

// ── helpers ────────────────────────────────────────────────────────────────

function authedSession(userId = 'user-123') {
  mockGetUser.mockResolvedValue({
    data: { user: { id: userId } },
    error: null,
  })
}

function noSession() {
  mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
}

function makeRequest(method: string, url = 'http://localhost/api/watchlist', body?: unknown) {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

// ── GET /api/watchlist ──────────────────────────────────────────────────────

describe('GET /api/watchlist', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when unauthenticated', async () => {
    noSession()
    const res = await GET(makeRequest('GET'))
    expect(res.status).toBe(401)
  })

  it('returns 200 with watchlist array when authenticated', async () => {
    authedSession()
    mockFrom.mockReturnValue({
      select: () => ({ order: () => ({ data: [], error: null }) }),
    })
    const res = await GET(makeRequest('GET'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json.watchlist)).toBe(true)
  })
})

// ── POST /api/watchlist ─────────────────────────────────────────────────────

describe('POST /api/watchlist', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when unauthenticated', async () => {
    noSession()
    const res = await POST(makeRequest('POST', undefined, { listing_id: 'lst-1' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when listing_id is missing', async () => {
    authedSession()
    const res = await POST(makeRequest('POST', undefined, {}))
    expect(res.status).toBe(400)
  })

  it('returns 201 when listing is saved successfully', async () => {
    authedSession()
    mockFrom.mockReturnValue({
      insert: () => ({ error: null }),
    })
    const res = await POST(makeRequest('POST', undefined, { listing_id: 'lst-1' }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.saved).toBe(true)
  })

  it('returns 200 (duplicate: true) when listing already saved (23505)', async () => {
    authedSession()
    mockFrom.mockReturnValue({
      insert: () => ({ error: { code: '23505', message: 'unique violation' } }),
    })
    const res = await POST(makeRequest('POST', undefined, { listing_id: 'lst-1' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.duplicate).toBe(true)
    expect(json.saved).toBe(true)
  })
})

// ── DELETE /api/watchlist ───────────────────────────────────────────────────

describe('DELETE /api/watchlist', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when unauthenticated', async () => {
    noSession()
    const res = await DELETE(makeRequest('DELETE', 'http://localhost/api/watchlist?listing_id=lst-1'))
    expect(res.status).toBe(401)
  })

  it('returns 400 when listing_id query param is missing', async () => {
    authedSession()
    const res = await DELETE(makeRequest('DELETE', 'http://localhost/api/watchlist'))
    expect(res.status).toBe(400)
  })

  it('returns 200 when removed successfully', async () => {
    authedSession()
    mockFrom.mockReturnValue({
      delete: () => ({ eq: () => ({ error: null }) }),
    })
    const res = await DELETE(
      makeRequest('DELETE', 'http://localhost/api/watchlist?listing_id=lst-1'),
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.removed).toBe(true)
  })
})
