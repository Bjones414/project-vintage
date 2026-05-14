import Link from 'next/link'

export function SimpleUnauthHeader() {
  return (
    <header className="border-b-[0.5px] border-border-default bg-bg-canvas">
      <div className="mx-auto flex max-w-[480px] items-center justify-between px-8 py-4">
        <Link
          href="/"
          className="font-serif text-[17px] leading-none text-text-primary"
        >
          Project Vintage
        </Link>
        <Link
          href="/login"
          className="font-sans text-[13px] text-text-tertiary hover:text-text-primary"
        >
          Sign in
        </Link>
      </div>
    </header>
  )
}
