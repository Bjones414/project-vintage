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
    expect(screen.getByPlaceholderText(/paste an auction url/i)).toBeTruthy()
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
    expect(screen.getByPlaceholderText(/paste an auction url/i)).toBeTruthy()
  })

  it('success path — submits to /api/analyze and pushes to /analyze/[id]', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listingId: 'listing-abc-123' }),
    }))

    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)

    await user.type(
      screen.getByPlaceholderText(/paste an auction url/i),
      'https://bringatrailer.com/listing/test',
    )
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith('/analyze/listing-abc-123')
    })
  })

  it('error path — shows inline error message on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unsupported platform' }),
    }))

    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)

    await user.type(
      screen.getByPlaceholderText(/paste an auction url/i),
      'https://ebay.com/item/123',
    )
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Unsupported platform')).toBeTruthy()
    })
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('disables input while fetch is in-flight', async () => {
    let resolveFetch!: (v: unknown) => void
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValueOnce(new Promise((resolve) => { resolveFetch = resolve })),
    )

    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)

    await user.type(
      screen.getByPlaceholderText(/paste an auction url/i),
      'https://bringatrailer.com/listing/test',
    )
    await user.keyboard('{Enter}')

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/paste an auction url/i) as HTMLInputElement
      expect(input.disabled).toBe(true)
    })

    resolveFetch({ ok: true, json: async () => ({ listingId: 'x' }) })
    await waitFor(() => expect(pushSpy).toHaveBeenCalled())
  })
})
