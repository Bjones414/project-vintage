'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { PVMark } from '@/components/brand/PVMark'
import { analyzeUrl, AnalyzeError } from '@/lib/analyze-url'
import { AnalyzeLoadingState } from '@/components/analyze/AnalyzeLoadingState'
import { createClient } from '@/lib/supabase/client'

/*
 * NAV_LINKS drives the section zone.
 * To add a new nav item: append an entry here.
 * Spacing is handled by `gap` on the container — no per-item spacing needed.
 */
const NAV_LINKS = [
  { label: 'Analyze',     href: '/analyze' },
  { label: 'Research',    href: '/research' },
  { label: 'Watchlist',   href: '/watchlist' },
  { label: 'Generations', href: '/generations' },
  { label: 'Garage',      href: '/garage' },
  { label: 'About',       href: '/about' },
] as const

interface NavProps {
  initials: string
}

export function Nav({ initials }: NavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loadingPromise, setLoadingPromise] = useState<Promise<string> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const urlRef = useRef(url)
  urlRef.current = url
  const avatarContainerRef = useRef<HTMLDivElement>(null)

  const isOnHomePage = pathname === '/home'

  // Clear loading overlay once navigation completes (pathname change = route landed)
  useEffect(() => {
    if (loadingPromise) {
      setLoadingPromise(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!dropdownOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (avatarContainerRef.current && !avatarContainerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dropdownOpen])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const trimmed = urlRef.current.trim()
    if (!trimmed) return
    setLoadingPromise(analyzeUrl(trimmed))
  }

  function handleSuccess(listingId: string) {
    router.push(`/analyze/${listingId}`)
    setLoadingPromise(null)
  }

  function handleError(err: Error) {
    setLoadingPromise(null)
    if (err instanceof AnalyzeError && err.status === 422) {
      router.push('/research?parse_failed=1')
    } else {
      setError(err.message || 'Network error — check your connection and try again')
    }
  }

  async function handleSignOut() {
    setDropdownOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <header className="border-b-[0.5px] border-border-default bg-bg-elevated">
        {/*
         * Three-zone flex row:
         *   [Logo — flex-1, left-aligned]  [Nav — content-sized]  [Utility — flex-1, right-aligned]
         *
         * Both outer zones are flex-1 so they consume equal shares of the remaining
         * space, keeping the center nav group pinned to the true horizontal midpoint
         * regardless of whether logo and utility happen to be the same width.
         */}
        <div className="flex items-center px-7 py-[18px]">

          {/* ── Logo zone — flex-1 so it mirrors the utility zone ─────────────── */}
          <div className="flex flex-1 items-center gap-4">
            <div className="text-[#8B6914]">
              <PVMark size={36} />
            </div>
            {/* Wordmark — hover: gold underline + tooltip; active on /home: permanent underline */}
            <div className="group relative">
              <Link
                href="/home"
                className={[
                  'border-b pb-[2px] font-serif text-[22px] leading-none tracking-[-0.01em] text-text-primary transition-colors duration-200',
                  isOnHomePage
                    ? 'border-accent-primary'
                    : 'border-transparent group-hover:border-accent-primary',
                ].join(' ')}
              >
                Project Vintage
              </Link>
              {/* Tooltip: fades in after 500ms delay, fades out immediately on leave */}
              <div
                className="pointer-events-none absolute left-1/2 top-full z-50 mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-500"
                aria-hidden="true"
              >
                {/* Arrow pointing up toward the wordmark */}
                <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-text-primary" />
                {/* Label */}
                <div className="relative whitespace-nowrap rounded-sm bg-text-primary px-[10px] py-[6px] font-sans text-[11px] leading-none text-bg-canvas">
                  Home
                </div>
              </div>
            </div>
          </div>

          {/* ── Nav zone — content-sized, centered by the two flex-1 flanks ─────── */}
          {/*
           * Add new nav items inside NAV_LINKS above — that's the only change needed.
           * gap-10/gap-12 on the inner div handles all item spacing automatically.
           */}
          <nav aria-label="Main navigation">
            {/* Desktop + tablet (md+): full link row */}
            <div className="hidden md:flex items-center gap-10 xl:gap-12 border-x-[0.5px] border-border-default px-6 xl:px-8">
              {NAV_LINKS.map((link) => {
                const active = pathname.startsWith(link.href)
                const label = link.href === '/analyze' && active ? 'Analysis' : link.label
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      active
                        ? "relative py-[6px] font-serif text-[11px] font-medium uppercase tracking-[0.18em] text-text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-accent-primary after:content-['']"
                        : 'relative py-[6px] font-serif text-[11px] font-medium uppercase tracking-[0.18em] text-accent-primary'
                    }
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
            {/* Mobile placeholder — hamburger nav not yet built */}
            <span
              className="flex md:hidden font-sans text-[20px] leading-none tracking-widest text-text-quaternary"
              aria-hidden="true"
            >
              ···
            </span>
          </nav>

          {/* ── Utility zone — flex-1, right-aligned, mirrors logo zone ──────────── */}
          <div className="flex flex-1 items-center justify-end gap-4">
            {/* URL input: full-width on xl, narrower on lg, icon on md, hidden on sm */}
            <form onSubmit={handleSubmit} className="hidden lg:block">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null) }}
                placeholder="Paste a listing URL →"
                className="w-56 xl:w-72 border-[0.5px] border-border-default bg-bg-canvas px-[18px] py-[9px] font-serif text-[13px] italic text-text-tertiary placeholder:text-text-tertiary focus:border-accent-primary focus:outline-none"
              />
              {error && (
                <p className="mt-1 font-sans text-xs text-severity-concern">{error}</p>
              )}
            </form>
            {/* Clipboard icon — md only, collapses input to a compact affordance */}
            <Link
              href="/analyze"
              className="hidden md:flex lg:hidden h-[38px] w-[38px] items-center justify-center border-[0.5px] border-border-default bg-bg-canvas text-text-tertiary hover:text-text-primary"
              aria-label="Paste a listing URL to analyze"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1" />
                <path d="M5 4V3a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1" />
              </svg>
            </Link>
            {/* Avatar — dynamic initials, click to open sign-out dropdown */}
            <div className="relative" ref={avatarContainerRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-text-primary font-sans text-[11px] font-medium uppercase tracking-[0.04em] text-bg-canvas focus:outline-none"
                aria-label="Open account menu"
                aria-expanded={dropdownOpen}
              >
                {initials}
              </button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 min-w-[160px] border-[0.5px] border-border-default bg-bg-surface py-2"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full cursor-pointer px-[14px] py-[10px] text-left font-serif text-[14px] text-text-primary hover:bg-bg-elevated"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>
      {loadingPromise && (
        <AnalyzeLoadingState
          promise={loadingPromise}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  )
}
