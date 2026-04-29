// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Module-level spy — must exist before vi.mock so the factory can close over it.
const replaceSpy = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceSpy, push: vi.fn(), back: vi.fn() }),
  notFound: () => { throw new Error('NEXT_NOT_FOUND') },
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

import AnalyzePage from '@/app/(app)/analyze/page'
import { analyzeUrl } from '@/lib/analyze-url'

// ---------------------------------------------------------------------------
// analyzeUrl — pure function tests (no DOM needed, but run here for colocation)
// ---------------------------------------------------------------------------
describe('analyzeUrl', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns listingId from a successful response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listingId: 'uuid-abc-123', listing: {} }),
    }))
    const id = await analyzeUrl('https://bringatrailer.com/listing/test-car')
    expect(id).toBe('uuid-abc-123')
  })

  it('posts to /api/analyze with the url in the body', async () => {
    const fetchSpy = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listingId: 'uuid-xyz' }),
    })
    vi.stubGlobal('fetch', fetchSpy)
    await analyzeUrl('https://bringatrailer.com/listing/test-car')
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/analyze',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ url: 'https://bringatrailer.com/listing/test-car' }),
      }),
    )
  })

  it('throws with the API error message when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unsupported platform' }),
    }))
    await expect(analyzeUrl('https://ebay.com/item/123')).rejects.toThrow('Unsupported platform')
  })

  it('throws a fallback message when ok but listingId is absent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listing: {} }),
    }))
    await expect(analyzeUrl('https://bat.com/...')).rejects.toThrow(/Request failed/)
  })
})

// ---------------------------------------------------------------------------
// AnalyzePage component — DOM interaction tests
// ---------------------------------------------------------------------------
describe('AnalyzePage', () => {
  beforeEach(() => {
    replaceSpy.mockClear()
  })

  // Explicit cleanup so renders don't accumulate across tests in the same suite.
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders the form in initial state', () => {
    render(<AnalyzePage />)
    expect(screen.getByRole('heading', { name: /Analyze a Listing/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Analyze/i })).toBeTruthy()
    expect(screen.getByPlaceholderText(/bringatrailer/i)).toBeTruthy()
  })

  it('success path — shows loading state with all four steps on submit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listingId: 'listing-uuid-999' }),
    }))

    const user = userEvent.setup()
    render(<AnalyzePage />)

    await user.type(
      screen.getByRole('textbox'),
      'https://bringatrailer.com/listing/test',
    )
    await user.click(screen.getByRole('button', { name: /Analyze/i }))

    // Loading state replaces the form — all four steps should be visible
    await waitFor(() => {
      expect(screen.getByText('Identifying the listing')).toBeTruthy()
    })
    expect(screen.getByText('Parsing the details')).toBeTruthy()
    expect(screen.getByText('Pulling comparable sales')).toBeTruthy()
    expect(screen.getByText('Generating your analysis')).toBeTruthy()
  })

  it('success path — form is replaced by loading state while fetch is in-flight', async () => {
    let resolveFetch!: (v: unknown) => void
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValueOnce(
        new Promise((resolve) => { resolveFetch = resolve }),
      ),
    )

    const user = userEvent.setup()
    render(<AnalyzePage />)

    await user.type(screen.getByRole('textbox'), 'https://bringatrailer.com/listing/test')
    await user.click(screen.getByRole('button', { name: /Analyze/i }))

    // Loading state is visible; the original form button is gone
    await waitFor(() => {
      expect(screen.getByText('Identifying the listing')).toBeTruthy()
    })
    expect(screen.queryByRole('button', { name: /Analyze/i })).toBeNull()

    // Resolve so test teardown is clean
    resolveFetch({ ok: true, json: async () => ({ listingId: 'x' }) })
  })

  it('error path — displays error message and re-enables submit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Could not parse listing' }),
    }))

    const user = userEvent.setup()
    render(<AnalyzePage />)

    await user.type(screen.getByRole('textbox'), 'https://bringatrailer.com/listing/bad')
    await user.click(screen.getByRole('button', { name: /Analyze/i }))

    await waitFor(() => {
      expect(screen.getByText(/Could not parse listing/i)).toBeTruthy()
    })
    expect(screen.getByRole('button', { name: /Analyze/i })).toBeTruthy()
    expect(replaceSpy).not.toHaveBeenCalled()
  })

  it('error path — shows fallback message on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Network failure')))

    const user = userEvent.setup()
    render(<AnalyzePage />)

    await user.type(screen.getByRole('textbox'), 'https://bringatrailer.com/listing/offline')
    await user.click(screen.getByRole('button', { name: /Analyze/i }))

    await waitFor(() => {
      expect(screen.getByText(/Network failure/i)).toBeTruthy()
    })
    expect(replaceSpy).not.toHaveBeenCalled()
  })
})
