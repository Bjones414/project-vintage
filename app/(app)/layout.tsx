import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav'
import { computeInitials } from '@/lib/initials'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let initials = '?'
  if (user) {
    const supabaseAdmin = createAdminClient()
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

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
