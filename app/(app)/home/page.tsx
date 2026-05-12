import Link from 'next/link'

export const metadata = {
  title: 'Home — Project Vintage',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-canvas">
      <div className="mx-auto max-w-[720px] px-7 pb-20 pt-24">

        <p className="mb-[18px] font-serif text-[11px] font-medium uppercase tracking-[0.18em] text-accent-primary">
          Home
        </p>

        <h1 className="mb-[14px] font-serif text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-text-primary">
          Coming soon — this will be your member dashboard.
        </h1>

        <p className="mb-[44px] max-w-[560px] font-serif text-[16px] italic leading-[1.55] text-text-tertiary">
          Logged-in members will land here. For now, paste a listing URL above or browse generations to get started.
        </p>

        <div className="flex items-center gap-8">
          <Link
            href="/generations"
            className="font-serif text-[15px] italic text-accent-primary"
          >
            Browse Generations →
          </Link>
          <Link
            href="/watchlist"
            className="font-serif text-[15px] italic text-accent-primary"
          >
            Watchlist →
          </Link>
        </div>

      </div>
    </main>
  )
}
