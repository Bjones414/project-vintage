import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockGetUser = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockUpdate = vi.fn()
const mockUpdateEq = vi.fn()

// Track which client type called .from() to verify RLS-bypass client is used
// for DB reads, not the anon client.
let anonFromCalled = false
let adminFromCalled = false

// Builder chain returned by .from('users') on the anon client.
// After the service-role fix this should never be reached — anon client is
// used only for auth.getUser().
function makeAnonBuilder() {
  return {
    select: mockSelect.mockReturnValue({
      eq: mockEq.mockReturnValue({
        single: mockSingle,
      }),
    }),
  }
}

// Builder chain returned by .from('users') on the service-role client.
// Handles both the SELECT (alpha expiry check) and the UPDATE (downgrade).
function makeAdminBuilder() {
  return {
    select: mockSelect.mockReturnValue({
      eq: mockEq.mockReturnValue({
        single: mockSingle,
      }),
    }),
    update: mockUpdate.mockReturnValue({
      eq: mockUpdateEq.mockResolvedValue({ error: null }),
    }),
  }
}

// Track which URL/key combination creates which client
let capturedClients: Array<{ url: string; key: string }> = []

vi.mock('@supabase/ssr', () => ({
  createServerClient: (_url: string, key: string) => {
    capturedClients.push({ url: _url, key })
    const isServiceRole = key === 'test-service-role-key'
    return {
      auth: { getUser: mockGetUser },
      from: () => {
        if (isServiceRole) {
          adminFromCalled = true
          return makeAdminBuilder()
        } else {
          anonFromCalled = true
          return makeAnonBuilder()
        }
      },
    }
  },
}))

import { updateSession } from '@/lib/supabase/middleware'

// ---------------------------------------------------------------------------
// Environment variables
// ---------------------------------------------------------------------------
process.env.NEXT_PUBLIC_SUPABASE_URL     = 'http://supabase.test'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY     = 'test-service-role-key'

function makeRequest(path = '/analyze') {
  return new NextRequest(`http://localhost${path}`)
}

// ---------------------------------------------------------------------------
// Helpers for profile data
// ---------------------------------------------------------------------------
const FORTY_SIX_DAYS_AGO = new Date(
  Date.now() - 46 * 24 * 60 * 60 * 1000,
).toISOString()

const FORTY_FOUR_DAYS_FROM_NOW = new Date(
  Date.now() + 44 * 24 * 60 * 60 * 1000,
).toISOString()

beforeEach(() => {
  vi.clearAllMocks()
  capturedClients = []
  anonFromCalled = false
  adminFromCalled = false
})

describe('updateSession — lazy alpha expiration', () => {
  it('does not touch the DB when user is unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    await updateSession(makeRequest())
    expect(mockSingle).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('does not downgrade a free-tier user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockResolvedValue({
      data: { account_type: 'free', alpha_expires_at: null },
    })
    await updateSession(makeRequest())
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('does not downgrade an alpha user whose window has not closed', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockResolvedValue({
      data: {
        account_type: 'alpha',
        alpha_expires_at: FORTY_FOUR_DAYS_FROM_NOW,
      },
    })
    await updateSession(makeRequest())
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('downgrades an expired alpha user to free', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockResolvedValue({
      data: {
        account_type: 'alpha',
        alpha_expires_at: FORTY_SIX_DAYS_AGO,
      },
    })
    await updateSession(makeRequest())
    expect(mockUpdate).toHaveBeenCalledWith({ account_type: 'free' })
    expect(mockUpdateEq).toHaveBeenCalledWith('id', 'user-1')
  })

  it('uses service role client for the alpha expiry SELECT (RLS bypass)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockResolvedValue({
      data: {
        account_type: 'alpha',
        alpha_expires_at: FORTY_FOUR_DAYS_FROM_NOW,
      },
    })
    await updateSession(makeRequest())
    // SELECT must go through the service-role client, never the anon client
    expect(adminFromCalled).toBe(true)
    expect(anonFromCalled).toBe(false)
    expect(mockSingle).toHaveBeenCalled()
  })

  it('uses service role client for the downgrade UPDATE', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockResolvedValue({
      data: {
        account_type: 'alpha',
        alpha_expires_at: FORTY_SIX_DAYS_AGO,
      },
    })
    await updateSession(makeRequest())
    // The service role client should have been created (key = service role key)
    const serviceClients = capturedClients.filter(
      (c) => c.key === 'test-service-role-key',
    )
    expect(serviceClients.length).toBeGreaterThan(0)
    // And the anon client must not have called from()
    expect(anonFromCalled).toBe(false)
  })

  it('does not downgrade an admin account_type', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockResolvedValue({
      data: {
        account_type: 'admin',
        alpha_expires_at: FORTY_SIX_DAYS_AGO,
      },
    })
    await updateSession(makeRequest())
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('allows request through when DB read fails (graceful degradation)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockRejectedValue(new Error('DB connection failed'))
    const response = await updateSession(makeRequest())
    expect(response).toBeDefined()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('does not downgrade alpha when alpha_expires_at is null', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockResolvedValue({
      data: { account_type: 'alpha', alpha_expires_at: null },
    })
    await updateSession(makeRequest())
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})
