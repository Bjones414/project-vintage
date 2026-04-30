import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/nav/TopNav'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
      <TopNav userEmail={user?.email ?? null} />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  )
}
