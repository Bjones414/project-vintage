import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav'

function computeInitials(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
): string {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase()
  if (email) return email[0].toUpperCase()
  return '?'
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let initials = '?'
  if (user) {
    const supabaseAdmin = createAdminClient()
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    console.log('[DEBUG layout profile]', { userId: user.id, data: profile, error })

    initials = computeInitials(
      profile?.first_name ?? null,
      profile?.last_name ?? null,
      user.email ?? null,
    )
  }

  return (
    <>
      <Nav initials={initials} />
      {children}
    </>
  )
}
