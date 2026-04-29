import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/nav/TopNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <TopNav userEmail={user?.email ?? null} />
      {children}
    </>
  )
}
