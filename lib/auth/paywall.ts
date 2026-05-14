import type { Tables } from '@/lib/supabase/types'

type PaywallProfile = Pick<
  Tables<'users'>,
  'account_type' | 'role'
>

// Returns true if the user bypasses all paywall gates unconditionally.
// Call this at the top of any gate check — if true, skip the gate entirely.
//
// Bypass rules (additive — either condition is sufficient):
//   account_type IN ('alpha', 'admin')  — new alpha account system
//   role IN ('admin', 'beta')           — legacy role-based bypass
export function canBypassPaywall(profile: PaywallProfile): boolean {
  if (profile.account_type === 'alpha' || profile.account_type === 'admin') {
    return true
  }
  if (profile.role === 'admin' || profile.role === 'beta') {
    return true
  }
  return false
}
