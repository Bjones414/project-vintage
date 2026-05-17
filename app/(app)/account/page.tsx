import Link from 'next/link'

export const metadata = { title: 'Account — Project Vintage' }

export default function AccountPage() {
  return (
    <main style={{ maxWidth: 640, margin: '80px auto', padding: '0 24px' }}>
      <p
        className="font-serif text-[12px] font-medium uppercase tracking-[0.18em] text-accent-primary"
        style={{ marginBottom: 20 }}
      >
        In development
      </p>

      <h1
        className="font-serif font-normal text-text-primary"
        style={{ fontSize: 38, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 16 }}
      >
        Account. Coming{' '}
        <em className="not-italic text-accent-primary">soon</em>.
      </h1>

      <p
        className="font-serif italic text-text-secondary"
        style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}
      >
        Settings, subscription, and profile management — coming in the next build.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link
          href="/watchlist"
          className="font-sans text-[13px] font-medium text-accent-primary"
          style={{ letterSpacing: '0.02em' }}
        >
          Watchlist &rarr;
        </Link>
        <Link
          href="/analyze"
          className="font-sans text-[13px] font-medium text-accent-primary"
          style={{ letterSpacing: '0.02em' }}
        >
          Analyze a listing &rarr;
        </Link>
        <Link
          href="/generations"
          className="font-sans text-[13px] font-medium text-accent-primary"
          style={{ letterSpacing: '0.02em' }}
        >
          Browse generations &rarr;
        </Link>
      </div>
    </main>
  )
}
