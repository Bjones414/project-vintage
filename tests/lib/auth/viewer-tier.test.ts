import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Supabase mock factory — must be declared before vi.mock hoisting
// ---------------------------------------------------------------------------
function makeClient({
  user,
  profile,
}: {
  user: { id: string } | null
  profile: { role: string; subscription_tier: string } | null
}) {
  const builder: Record<string, unknown> = {}
  builder['select'] = vi.fn().mockReturnValue(builder)
  builder['eq'] = vi.fn().mockReturnValue(builder)
  builder['single'] = vi.fn().mockResolvedValue({ data: profile, error: null })

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    from: vi.fn().mockReturnValue(builder),
  }
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { getViewerTier } from '@/lib/auth/viewer-tier'
import { createClient } from '@/lib/supabase/server'

describe('getViewerTier', () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset()
  })

  it('no session → anonymous', async () => {
    vi.mocked(createClient).mockReturnValue(
      makeClient({ user: null, profile: null }) as ReturnType<typeof createClient>,
    )
    expect(await getViewerTier()).toEqual({ tier: 'anonymous', bypass: false })
  })

  it('signed in, free subscription_tier → free', async () => {
    vi.mocked(createClient).mockReturnValue(
      makeClient({
        user: { id: 'user-1' },
        profile: { role: 'member', subscription_tier: 'free' },
      }) as ReturnType<typeof createClient>,
    )
    expect(await getViewerTier()).toEqual({ tier: 'free', bypass: false })
  })

  it('signed in, pro subscription_tier → pro', async () => {
    vi.mocked(createClient).mockReturnValue(
      makeClient({
        user: { id: 'user-1' },
        profile: { role: 'member', subscription_tier: 'pro' },
      }) as ReturnType<typeof createClient>,
    )
    expect(await getViewerTier()).toEqual({ tier: 'pro', bypass: false })
  })

  it('signed in, collector subscription_tier → pro', async () => {
    vi.mocked(createClient).mockReturnValue(
      makeClient({
        user: { id: 'user-1' },
        profile: { role: 'member', subscription_tier: 'collector' },
      }) as ReturnType<typeof createClient>,
    )
    expect(await getViewerTier()).toEqual({ tier: 'pro', bypass: false })
  })

  it('admin role → pro with bypass regardless of subscription_tier', async () => {
    vi.mocked(createClient).mockReturnValue(
      makeClient({
        user: { id: 'user-1' },
        profile: { role: 'admin', subscription_tier: 'free' },
      }) as ReturnType<typeof createClient>,
    )
    expect(await getViewerTier()).toEqual({ tier: 'pro', bypass: true })
  })

  it('beta role → pro with bypass regardless of subscription_tier', async () => {
    vi.mocked(createClient).mockReturnValue(
      makeClient({
        user: { id: 'user-1' },
        profile: { role: 'beta', subscription_tier: 'free' },
      }) as ReturnType<typeof createClient>,
    )
    expect(await getViewerTier()).toEqual({ tier: 'pro', bypass: true })
  })

  it('profile fetch returns null → free (session exists but row missing)', async () => {
    vi.mocked(createClient).mockReturnValue(
      makeClient({ user: { id: 'user-1' }, profile: null }) as ReturnType<typeof createClient>,
    )
    expect(await getViewerTier()).toEqual({ tier: 'free', bypass: false })
  })
})
