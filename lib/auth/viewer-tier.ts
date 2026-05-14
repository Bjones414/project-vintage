import { createClient } from '@/lib/supabase/server'

export type ViewerTier = 'anonymous' | 'free' | 'pro'

export async function getViewerTier(): Promise<{ tier: ViewerTier; bypass: boolean }> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { tier: 'anonymous', bypass: false }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, subscription_tier, account_type')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { tier: 'free', bypass: false }
  }

  // account_type IN ('alpha', 'admin') → full bypass (alpha account system)
  if (profile.account_type === 'alpha' || profile.account_type === 'admin') {
    return { tier: 'pro', bypass: true }
  }

  // Legacy role bypass — preserved for backward compatibility with existing admin/beta rows
  if (profile.role === 'admin' || profile.role === 'beta') {
    return { tier: 'pro', bypass: true }
  }

  // subscription_tier is the source of truth for paid pro entitlements.
  if (profile.subscription_tier === 'pro' || profile.subscription_tier === 'collector') {
    return { tier: 'pro', bypass: false }
  }

  return { tier: 'free', bypass: false }
}
