import Link from 'next/link'

interface Props {
  surface: string
  description?: string
}

export function ComingSoon({ surface, description }: Props) {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: '80px auto',
        padding: '0 24px',
      }}
    >
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
        {surface}. Coming{' '}
        <em className="not-italic text-accent-primary">soon</em>.
      </h1>

      <p
        className="font-serif italic text-text-secondary"
        style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}
      >
        {description ?? 'This section is in development and will be available shortly.'}
      </p>

      <Link
        href="/home"
        className="font-sans text-[13px] font-medium text-accent-primary"
        style={{ letterSpacing: '0.02em' }}
      >
        Return to home &rarr;
      </Link>
    </main>
  )
}
