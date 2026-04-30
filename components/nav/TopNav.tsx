'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { analyzeUrl } from '@/lib/analyze-url'
import { createClient } from '@/lib/supabase/client'
import { AnalyzeLoadingState } from '@/components/analyze/AnalyzeLoadingState'

type Props = {
  userEmail: string | null
}

export function TopNav({ userEmail }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loadingPromise, setLoadingPromise] = useState<Promise<string> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const urlRef = useRef(url)
  urlRef.current = url

  const hideUrlField = pathname === '/' || pathname === '/login' || pathname === '/signup'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const promise = analyzeUrl(urlRef.current.trim())
    setLoadingPromise(promise)
  }

  function handleSuccess(listingId: string) {
    setLoadingPromise(null)
    router.push(`/analyze/${listingId}`)
  }

  function handleError(err: Error) {
    setError(err.message || 'Network error — check your connection and try again')
    setLoadingPromise(null)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : null

  if (loadingPromise) {
    return (
      <AnalyzeLoadingState
        promise={loadingPromise}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b-[0.5px] border-border-default bg-bg-elevated">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-7 py-3.5">
        {/* Logo wordmark — serif, regular weight, links home */}
        <Link
          href="/"
          className="shrink-0 font-serif text-[17px] leading-none text-text-primary"
        >
          Project Vintage
        </Link>

        {/*
         * User cluster — ml-auto right-aligns it on all viewports when the URL
         * field is absent (home). sm:order-last + sm:ml-0 moves it after the
         * URL field on desktop when the field is present.
         */}
        <div className={`ml-auto shrink-0 sm:order-last${hideUrlField ? '' : ' sm:ml-0'}`}>
          {userEmail ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-text-primary font-sans text-[11px] font-medium text-bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                aria-label="Open account menu"
              >
                {initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-40 border-[0.5px] border-border-default bg-bg-surface py-1">
                  <Link
                    href="/account"
                    className="block px-4 py-2 font-sans text-sm text-text-secondary hover:bg-bg-elevated"
                    onClick={() => setMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left font-sans text-sm text-text-secondary hover:bg-bg-elevated"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href={`/login${pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : ''}`}
                className="font-sans text-[13px] text-text-tertiary hover:text-text-primary"
              >
                Sign in
              </Link>
              <Link
                href={`/signup${pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : ''}`}
                className="font-sans text-[13px] text-text-tertiary hover:text-text-primary"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/*
         * URL field — hidden on / (hero has its own). On all other pages it
         * wraps to a second row on mobile and fills the center on desktop.
         */}
        {!hideUrlField && (
          <form onSubmit={handleSubmit} className="w-full min-w-0 sm:w-auto sm:flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a listing URL to analyze another…"
              className="w-full rounded-button border-[0.5px] border-border-default bg-bg-surface px-3.5 py-2 font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
            />
            {error && (
              <p className="mt-1 font-sans text-xs text-severity-concern">{error}</p>
            )}
          </form>
        )}
      </div>
    </header>
  )
}
