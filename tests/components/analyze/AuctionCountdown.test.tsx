// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import React from 'react'
import { AuctionCountdown, buildDisplay } from '@/components/analyze/AuctionCountdown'

// ---------------------------------------------------------------------------
// buildDisplay — pure unit tests (no DOM needed, but collocated for context)
// ---------------------------------------------------------------------------
describe('buildDisplay', () => {
  it('returns verifying when diff <= 0', () => {
    const past = new Date(Date.now() - 5000).toISOString()
    expect(buildDisplay(past, Date.now())).toEqual({ type: 'verifying' })
  })

  it('returns static when diff > 24h', () => {
    const now = Date.now()
    const future = new Date(now + 25 * 3600 * 1000).toISOString()
    const result = buildDisplay(future, now)
    expect(result.type).toBe('static')
    if (result.type === 'static') expect(result.text).toContain('2')
  })

  it('returns live Xh Ym between 1h and 24h', () => {
    const now = Date.now()
    const future = new Date(now + 3 * 3600 * 1000 + 30 * 60 * 1000).toISOString()
    const result = buildDisplay(future, now)
    expect(result).toEqual({ type: 'live', text: 'Ends in 3h 30m', urgent: false })
  })

  it('returns live Xm Ys between 1m and 1h', () => {
    const now = Date.now()
    const future = new Date(now + 30 * 60 * 1000 + 45 * 1000).toISOString()
    const result = buildDisplay(future, now)
    expect(result).toEqual({ type: 'live', text: 'Ends in 30m 45s', urgent: false })
  })

  it('returns live Xs (urgent) under 1m', () => {
    const now = Date.now()
    const future = new Date(now + 45 * 1000).toISOString()
    const result = buildDisplay(future, now)
    expect(result).toEqual({ type: 'live', text: 'Ends in 45s', urgent: true })
  })
})

// ---------------------------------------------------------------------------
// AuctionCountdown component — integration tests with DOM + fake timers
// ---------------------------------------------------------------------------
describe('AuctionCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  // Flush React state updates + async microtasks
  async function flush(times = 3) {
    for (let i = 0; i < times; i++) {
      await act(async () => {
        await Promise.resolve()
      })
    }
  }

  it('null endsAt: renders unavailable, no fetch, no intervals', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')

    await act(async () => {
      render(<AuctionCountdown endsAt={null} listingId="test-123" />)
    })

    expect(screen.getByText('Auction end time unavailable')).toBeTruthy()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('>24h: renders static date, no "Ends in" text, no fetch', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const future = new Date(Date.now() + 48 * 3600 * 1000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={future} listingId="test-123" />)
    })

    const el = document.querySelector('span')!
    expect(el.textContent).not.toMatch(/Ends in/)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('1h–24h: shows Xh Ym, updates every 60s', async () => {
    const now = Date.now()
    const future = new Date(now + 3 * 3600 * 1000 + 30 * 60 * 1000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={future} listingId="test-123" />)
    })

    expect(screen.getByText('Ends in 3h 30m')).toBeTruthy()

    await act(async () => {
      vi.advanceTimersByTime(60_000)
    })

    expect(screen.getByText('Ends in 3h 29m')).toBeTruthy()
  })

  it('1m–1h: shows Xm Ys, updates every 1s', async () => {
    const now = Date.now()
    const future = new Date(now + 30 * 60 * 1000 + 45 * 1000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={future} listingId="test-123" />)
    })

    expect(screen.getByText('Ends in 30m 45s')).toBeTruthy()

    await act(async () => {
      vi.advanceTimersByTime(1_000)
    })

    expect(screen.getByText('Ends in 30m 44s')).toBeTruthy()
  })

  it('under 1m: shows Xs with urgent styling (bold + amber)', async () => {
    const now = Date.now()
    const future = new Date(now + 45 * 1000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={future} listingId="test-123" />)
    })

    const el = screen.getByText('Ends in 45s')
    expect(el).toBeTruthy()
    expect(el.className).toContain('font-bold')
    expect(el.className).toContain('amber')
  })

  it('T-0: fires single fetch, shows verifying state while in-flight', async () => {
    // Use a deferred promise so we can observe the "verifying" state before resolution
    let resolveVerify!: (value: Response) => void
    const verifyPromise = new Promise<Response>((resolve) => {
      resolveVerify = resolve
    })
    const fetchMock = vi.fn().mockReturnValue(verifyPromise)
    vi.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const past = new Date(Date.now() - 5000).toISOString()

    // Render and flush effects — fetch fires but the promise is still pending
    await act(async () => {
      render(<AuctionCountdown endsAt={past} listingId="test-123" />)
      await Promise.resolve()
    })

    expect(screen.getByText('Verifying final result…')).toBeTruthy()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/listings/test-123/refresh-status', {
      method: 'POST',
    })

    // Resolve the fetch and confirm final state
    await act(async () => {
      resolveVerify({
        ok: true,
        json: vi.fn().mockResolvedValue({
          refreshed: true,
          listing: { listing_status: 'sold', auction_ends_at: null },
        }),
      } as unknown as Response)
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(screen.getByText('Auction ended')).toBeTruthy()
  })

  it('T-0: does not fire fetch a second time if T-0 is triggered again', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        refreshed: false,
        reason: 'Auction not yet ended',
      }),
    })
    vi.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const past = new Date(Date.now() - 5000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={past} listingId="test-123" />)
    })

    // Flush promises so the fetch resolves
    await flush()

    // Fetch should only have been called once
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Auction ended')).toBeTruthy()
  })

  it('soft-close extension: re-targets and resumes countdown', async () => {
    const newEndsAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10m from now
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        refreshed: true,
        listing: { listing_status: 'live', auction_ends_at: newEndsAt },
      }),
    })
    vi.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const past = new Date(Date.now() - 5000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={past} listingId="test-123" />)
    })

    expect(fetchMock).toHaveBeenCalledOnce()

    // Flush the fetch promise through the chain
    await flush()

    // Should now show countdown against the extended end time
    expect(screen.getByText(/Ends in \d+m \d+s/)).toBeTruthy()
  })

  it('auction ended: mock returns no extension → shows "Auction ended"', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        refreshed: true,
        listing: { listing_status: 'sold', auction_ends_at: null },
      }),
    })
    vi.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const past = new Date(Date.now() - 5000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={past} listingId="test-123" />)
    })

    await flush()

    expect(screen.getByText('Auction ended')).toBeTruthy()
  })

  it('fetch failure: shows "Auction ended", does not throw', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))

    const past = new Date(Date.now() - 5000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={past} listingId="test-123" />)
    })

    await flush()

    expect(screen.getByText('Auction ended')).toBeTruthy()
  })

  it('fetch non-ok response: shows "Auction ended"', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn(),
    } as unknown as Response)

    const past = new Date(Date.now() - 5000).toISOString()

    await act(async () => {
      render(<AuctionCountdown endsAt={past} listingId="test-123" />)
    })

    await flush()

    expect(screen.getByText('Auction ended')).toBeTruthy()
  })
})
