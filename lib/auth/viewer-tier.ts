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
    .select('role, subscription_tier')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { tier: 'free', bypass: false }
  }

  // admin/beta role → pro tier via bypass
  // TODO: bypass mechanism is provisional — when real Pro entitlements ship, this needs
  // to read from a subscriptions table or equivalent.
  if (['admin', 'beta'].includes(profile.role)) {
    return { tier: 'pro', bypass: true }
  }

  // subscription_tier is the source of truth for pro entitlements; no separate
  // is_pro flag exists on the users table.
  // TODO: until a subscriptions table ships, manually setting subscription_tier is
  // the only way to grant pro access outside admin/beta bypass.
  if (['pro', 'collector'].includes(profile.subscription_tier)) {
    return { tier: 'pro', bypass: false }
  }

  return { tier: 'free', bypass: false }
}
