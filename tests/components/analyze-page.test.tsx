// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'

// Hoist stable mock references so they're accessible inside vi.mock factories.
const mockPush = vi.hoisted(() => vi.fn())
const MockLoadingState = vi.hoisted(() => vi.fn<any>(() => null))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  useRouter: () => ({ replace: vi.fn(), push: mockPush, back: vi.fn() }),
  usePathname: () => '/analyze',
  notFound: () => { throw new Error('NEXT_NOT_FOUND') },
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/components/analyze/AnalyzeLoadingState', () => ({
  AnalyzeLoadingState: MockLoadingState,
}))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  mockPush.mockClear()
  MockLoadingState.mockClear()
  MockLoadingState.mockImplementation(() => null)
})

import AnalyzePage from '@/app/(app)/analyze/page'
import { analyzeUrl } from '@/lib/analyze-url'

// ---------------------------------------------------------------------------
// analyzeUrl — pure function tests
// ---------------------------------------------------------------------------
describe('analyzeUrl', () => {
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
// AnalyzePage — landing page with URL paste form
// ---------------------------------------------------------------------------
describe('AnalyzePage', () => {
  it('renders the page heading', () => {
    render(<AnalyzePage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
  })

  it('renders the URL paste input', () => {
    render(<AnalyzePage />)
    expect(screen.getByPlaceholderText('Paste a listing URL →')).toBeTruthy()
  })

  it('renders the Analyze submit button', () => {
    render(<AnalyzePage />)
    expect(screen.getByRole('button', { name: /analyze/i })).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// AnalyzePage submit → navigation (regression: startTransition broke router.push)
// ---------------------------------------------------------------------------
describe('AnalyzePage submit → navigation', () => {
  it('calls router.push with /analyze/[id] when handleSuccess fires', () => {
    // Stub fetch so analyzeUrl's network call doesn't escape into happy-dom
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

    // Capture the onSuccess callback passed to the loading overlay
    let capturedOnSuccess: ((id: string) => void) | null = null
    MockLoadingState.mockImplementation(
      ({ onSuccess }: { promise: Promise<string>; onSuccess: (id: string) => void; onError: (e: Error) => void }) => {
        capturedOnSuccess = onSuccess
        return null
      },
    )

    render(<AnalyzePage />)

    // Submit a URL to set loadingPromise (renders the overlay mock and captures onSuccess)
    const input = screen.getByPlaceholderText('Paste a listing URL →')
    fireEvent.change(input, { target: { value: 'https://bringatrailer.com/listing/test-car' } })
    fireEvent.submit(input.closest('form')!)

    expect(capturedOnSuccess).not.toBeNull()

    act(() => {
      capturedOnSuccess!('listing-abc-123')
    })

    expect(mockPush).toHaveBeenCalledWith('/analyze/listing-abc-123')
  })

  it('does not call router.push when handleError fires with a non-422 error', () => {
    // Stub fetch so analyzeUrl's network call doesn't escape into happy-dom
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

    let capturedOnError: ((e: Error) => void) | null = null
    MockLoadingState.mockImplementation(
      ({ onError }: { promise: Promise<string>; onSuccess: (id: string) => void; onError: (e: Error) => void }) => {
        capturedOnError = onError
        return null
      },
    )

    render(<AnalyzePage />)

    const input = screen.getByPlaceholderText('Paste a listing URL →')
    fireEvent.change(input, { target: { value: 'https://bringatrailer.com/listing/test-car' } })
    fireEvent.submit(input.closest('form')!)

    act(() => {
      capturedOnError!(new Error('Network error'))
    })

    expect(mockPush).not.toHaveBeenCalled()
  })
})
