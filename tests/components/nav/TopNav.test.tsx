// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// Module-level spies — must exist before vi.mock so the factory can close over them.
const pushSpy = vi.fn()
const pathnameMock = vi.fn().mockReturnValue('/')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushSpy, replace: vi.fn(), back: vi.fn() }),
  usePathname: () => pathnameMock(),
  notFound: () => { throw new Error('NEXT_NOT_FOUND') },
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { signOut: vi.fn().mockResolvedValue({ error: null }) },
  }),
}))

import { TopNav } from '@/components/nav/TopNav'

describe('TopNav', () => {
  beforeEach(() => {
    pushSpy.mockClear()
    pathnameMock.mockReturnValue('/')
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders logo, URL input, and sign-in link for anonymous user', () => {
    render(<TopNav userEmail={null} />)
    expect(screen.getByRole('link', { name: /vintage/i })).toBeTruthy()
    expect(screen.getByPlaceholderText(/paste a listing url/i)).toBeTruthy()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeTruthy()
  })

  it('renders initials avatar for signed-in user, no sign-in link', () => {
    render(<TopNav userEmail="blake@example.com" />)
    expect(screen.getByRole('button', { name: /open account menu/i })).toBeTruthy()
    expect(screen.queryByRole('link', { name: /sign in/i })).toBeNull()
  })

  it('hides on /analyze landing page', () => {
    pathnameMock.mockReturnValue('/analyze')
    const { container } = render(<TopNav userEmail={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders on /analyze/[id] result page', () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    render(<TopNav userEmail={null} />)
    expect(screen.getByPlaceholderText(/paste a listing url/i)).toBeTruthy()
  })

  it('success path — shows loading state with all four steps on submit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listingId: 'listing-abc-123' }),
    }))

    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)

    await user.type(
      screen.getByPlaceholderText(/paste a listing url/i),
      'https://bringatrailer.com/listing/test',
    )
    await user.keyboard('{Enter}')

    // Loading state replaces the nav — all four steps should be visible
    await waitFor(() => {
      expect(screen.getByText('Identifying the listing')).toBeTruthy()
    })
    expect(screen.getByText('Parsing the details')).toBeTruthy()
    expect(screen.getByText('Pulling comparable sales')).toBeTruthy()
    expect(screen.getByText('Generating your analysis')).toBeTruthy()
  })

  it('error path — shows inline error message on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unsupported platform' }),
    }))

    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)

    await user.type(
      screen.getByPlaceholderText(/paste a listing url/i),
      'https://ebay.com/item/123',
    )
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Unsupported platform')).toBeTruthy()
    })
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('shows loading state (not the nav form) while fetch is in-flight', async () => {
    let resolveFetch!: (v: unknown) => void
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValueOnce(new Promise((resolve) => { resolveFetch = resolve })),
    )

    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)

    await user.type(
      screen.getByPlaceholderText(/paste a listing url/i),
      'https://bringatrailer.com/listing/test',
    )
    await user.keyboard('{Enter}')

    // Loading state is shown; the URL input is no longer in the DOM
    await waitFor(() => {
      expect(screen.getByText('Identifying the listing')).toBeTruthy()
    })
    expect(screen.queryByPlaceholderText(/paste a listing url/i)).toBeNull()

    resolveFetch({ ok: true, json: async () => ({ listingId: 'x' }) })
  })
})
