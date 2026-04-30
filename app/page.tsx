import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/nav/TopNav'
import { HeroForm } from '@/components/home/HeroForm'

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav userEmail={user?.email ?? null} />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-[640px]">
          <h1 className="mb-4 text-center font-serif text-h1 text-text-primary">
            Know what you&apos;re bidding on.
          </h1>
          <p className="mx-auto mb-8 max-w-[580px] text-balance text-center font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
            A deep read on any auction listing — comparable sales, generation-level watch-outs, and the questions to ask the seller, in seconds.
          </p>
          <HeroForm />
        </div>
      </main>
    </div>
  )
}
