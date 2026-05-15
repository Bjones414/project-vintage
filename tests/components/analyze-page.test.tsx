// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/analyze',
  notFound: () => { throw new Error('NEXT_NOT_FOUND') },
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/components/analyze/AnalyzeLoadingState', () => ({
  AnalyzeLoadingState: () => null,
}))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
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
