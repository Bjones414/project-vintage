import Link from 'next/link'

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
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
      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-[480px] px-8 pb-20 pt-24">
          {children}
        </div>
      </div>
    </div>
  )
}
