import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── vi.hoisted: values available inside vi.mock factories ──────────────────

const { mockGetUser } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
  }),
}))

// Admin client (service-role) — stub the role lookup
const mockAdminFrom = vi.fn()
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockAdminFrom })),
}))

const { GET, PATCH } = await import('@/app/api/admin/comp-flags/route')

// ── helpers ────────────────────────────────────────────────────────────────

function authedUser(userId = 'admin-user') {
  mockGetUser.mockResolvedValue({ data: { user: { id: userId } }, error: null })
}

function noUser() {
  mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
}

function adminRole() {
  mockAdminFrom.mockImplementation((table: string) => {
    if (table === 'users') {
      return {
        select: () => ({ eq: () => ({ single: () => ({ data: { role: 'admin' }, error: null }) }) }),
      }
    }
    // listings table — GET uses .select().or().order().limit(); PATCH uses .update().eq().select().single()
    return {
      select: () => ({
        or: () => ({ order: () => ({ limit: () => ({ data: [], error: null }) }) }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({ single: () => ({ data: { id: 'lst-1', is_comp_resistant: true, cross_listing_group_id: null }, error: null }) }),
        }),
      }),
    }
  })
}

function nonAdminRole() {
  mockAdminFrom.mockImplementation(() => ({
    select: () => ({ eq: () => ({ single: () => ({ data: { role: 'user' }, error: null }) }) }),
  }))
}

function makeRequest(method: string, body?: unknown) {
  return new NextRequest('http://localhost/api/admin/comp-flags', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

// ── GET /api/admin/comp-flags ───────────────────────────────────────────────

describe('GET /api/admin/comp-flags', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when unauthenticated', async () => {
    noUser()
    const res = await GET()
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Authentication required')
  })

  it('returns 403 when user is not admin', async () => {
    authedUser()
    nonAdminRole()
    const res = await GET()
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.error).toBe('Forbidden')
  })

  it('returns 200 with listings array for admin user', async () => {
    authedUser()
    adminRole()
    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json.listings)).toBe(true)
  })
})

// ── PATCH /api/admin/comp-flags ─────────────────────────────────────────────

describe('PATCH /api/admin/comp-flags', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when unauthenticated', async () => {
    noUser()
    const res = await PATCH(makeRequest('PATCH', { listing_id: 'lst-1', is_comp_resistant: true }))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Authentication required')
  })

  it('returns 403 when user is not admin', async () => {
    authedUser()
    nonAdminRole()
    const res = await PATCH(makeRequest('PATCH', { listing_id: 'lst-1', is_comp_resistant: true }))
    expect(res.status).toBe(403)
  })

  it('returns 400 when listing_id is missing', async () => {
    authedUser()
    adminRole()
    const res = await PATCH(makeRequest('PATCH', { is_comp_resistant: true }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when no valid patch fields are provided', async () => {
    authedUser()
    adminRole()
    const res = await PATCH(makeRequest('PATCH', { listing_id: 'lst-1' }))
    expect(res.status).toBe(400)
  })

  it('returns 200 when admin updates is_comp_resistant', async () => {
    authedUser()
    adminRole()
    const res = await PATCH(makeRequest('PATCH', { listing_id: 'lst-1', is_comp_resistant: true }))
    expect(res.status).toBe(200)
  })
})
