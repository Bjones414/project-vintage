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

  // Hide on the /analyze landing page — it has its own paste field
  if (pathname === '/analyze') return null

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
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo wordmark */}
        <Link
          href="/"
          className="shrink-0 font-serif text-lg font-semibold tracking-tight text-gray-900"
        >
          Vintage
        </Link>

        {/*
         * User cluster — ml-auto keeps it right-aligned with the logo on the
         * first row on mobile. sm:order-last + sm:ml-0 moves it after the URL
         * field on desktop without DOM reordering.
         */}
        <div className="ml-auto shrink-0 sm:order-last sm:ml-0">
          {userEmail ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                aria-label="Open account menu"
              >
                {initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
          )}
        </div>

        {/*
         * URL field — w-full wraps it to the second row on mobile (below logo +
         * user cluster). sm:w-auto sm:flex-1 collapses it into the center of the
         * single desktop row between logo and user cluster.
         */}
        <form onSubmit={handleSubmit} className="w-full min-w-0 sm:w-auto sm:flex-1">
          <div className="relative flex items-center">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste an auction URL to analyze"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-600">{error}</p>
          )}
        </form>
      </div>
    </header>
  )
}
