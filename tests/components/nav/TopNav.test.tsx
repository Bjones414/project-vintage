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

  it('renders logo and both auth links on home — URL field absent', () => {
    // pathname = '/' — hero has the paste field, TopNav omits it
    render(<TopNav userEmail={null} />)
    expect(screen.getByRole('link', { name: /vintage/i })).toBeTruthy()
    expect(screen.queryByPlaceholderText(/paste a listing url/i)).toBeNull()
    expect(screen.getByRole('link', { name: /^sign in$/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /^sign up$/i })).toBeTruthy()
  })

  it('anonymous auth links on home (/) have no next-param', () => {
    pathnameMock.mockReturnValue('/')
    render(<TopNav userEmail={null} />)
    const signInLink = screen.getByRole('link', { name: /^sign in$/i })
    const signUpLink = screen.getByRole('link', { name: /^sign up$/i })
    expect(signInLink.getAttribute('href')).toBe('/login')
    expect(signUpLink.getAttribute('href')).toBe('/signup')
  })

  it('anonymous auth links on non-home page include encoded next-param', () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    render(<TopNav userEmail={null} />)
    const signInLink = screen.getByRole('link', { name: /^sign in$/i })
    const signUpLink = screen.getByRole('link', { name: /^sign up$/i })
    expect(signInLink.getAttribute('href')).toBe('/login?next=%2Fanalyze%2Fsome-listing-id')
    expect(signUpLink.getAttribute('href')).toBe('/signup?next=%2Fanalyze%2Fsome-listing-id')
  })

  it('renders URL paste field on non-home pages', () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    render(<TopNav userEmail={null} />)
    expect(screen.getByPlaceholderText(/paste a listing url/i)).toBeTruthy()
  })

  it('hides URL field on /login', () => {
    pathnameMock.mockReturnValue('/login')
    render(<TopNav userEmail={null} />)
    expect(screen.queryByPlaceholderText(/paste a listing url/i)).toBeNull()
  })

  it('hides URL field on /signup', () => {
    pathnameMock.mockReturnValue('/signup')
    render(<TopNav userEmail={null} />)
    expect(screen.queryByPlaceholderText(/paste a listing url/i)).toBeNull()
  })

  it('renders initials avatar for signed-in user, no auth links', () => {
    render(<TopNav userEmail="blake@example.com" />)
    expect(screen.getByRole('button', { name: /open account menu/i })).toBeTruthy()
    expect(screen.queryByRole('link', { name: /^sign in$/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /^sign up$/i })).toBeNull()
  })

  it('uses computeInitials — email-only shows single char, not email.slice(0,2)', () => {
    render(<TopNav userEmail="blake@example.com" />)
    const btn = screen.getByRole('button', { name: /open account menu/i })
    // computeInitials(null, null, 'blake@example.com') → 'B'
    // email.slice(0, 2).toUpperCase() would produce 'BL'
    expect(btn.textContent).toBe('B')
  })

  it('uses firstName + lastName props via computeInitials', () => {
    render(<TopNav userEmail="blake@example.com" firstName="Blake" lastName="Jones" />)
    const btn = screen.getByRole('button', { name: /open account menu/i })
    expect(btn.textContent).toBe('BJ')
  })

  it('renders on /analyze/[id] result page with URL field', () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    render(<TopNav userEmail={null} />)
    expect(screen.getByPlaceholderText(/paste a listing url/i)).toBeTruthy()
  })

  it('success path — shows loading state with all four steps on submit', async () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
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
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
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

  it('renders a submit button when URL field is present', () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    render(<TopNav userEmail={null} />)
    expect(screen.getByRole('button', { name: /analyze listing/i })).toBeTruthy()
  })

  it('submit button is disabled when input is empty', () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    render(<TopNav userEmail={null} />)
    const btn = screen.getByRole('button', { name: /analyze listing/i }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('submit button click triggers the same submit as Enter key', async () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listingId: 'listing-btn-123' }),
    }))

    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)

    await user.type(
      screen.getByPlaceholderText(/paste a listing url/i),
      'https://bringatrailer.com/listing/test',
    )
    await user.click(screen.getByRole('button', { name: /analyze listing/i }))

    await waitFor(() => {
      expect(screen.getByText('Identifying the listing')).toBeTruthy()
    })
  })

  it('submit button has bg-transparent and border-border-default when input is empty', () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    render(<TopNav userEmail={null} />)
    const btn = screen.getByRole('button', { name: /analyze listing/i })
    expect(btn.className).toContain('bg-transparent')
    expect(btn.className).toContain('border-border-default')
    expect(btn.className).not.toContain('border-transparent')
  })

  it('submit button has bg-accent-primary and border-transparent when input has content', async () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)
    await user.type(screen.getByPlaceholderText(/paste a listing url/i), 'https://bringatrailer.com/listing/test')
    const btn = screen.getByRole('button', { name: /analyze listing/i })
    expect(btn.className).toContain('bg-accent-primary')
    expect(btn.className).toContain('border-transparent')
    expect(btn.className).not.toContain('bg-transparent')
  })

  it('aria-disabled is true when empty, false when input has content', async () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)
    const btn = screen.getByRole('button', { name: /analyze listing/i })
    expect(btn.getAttribute('aria-disabled')).toBe('true')
    await user.type(screen.getByPlaceholderText(/paste a listing url/i), 'https://bringatrailer.com/listing/test')
    expect(btn.getAttribute('aria-disabled')).toBe('false')
  })

  it('shows loading state (not the nav form) while fetch is in-flight', async () => {
    pathnameMock.mockReturnValue('/analyze/some-listing-id')
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
