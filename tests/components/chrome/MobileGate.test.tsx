// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import { MobileGate } from '@/components/chrome/MobileGate'

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', (_query: string) => ({
    matches,
    media: _query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('MobileGate', () => {
  it('renders gate when viewport is below 768px', () => {
    mockMatchMedia(true)
    render(<MobileGate />)
    expect(screen.getByText('Best experienced on desktop.')).toBeTruthy()
    expect(screen.getByText('Mobile coming soon.')).toBeTruthy()
  })

  it('renders nothing when viewport is 768px or wider', () => {
    mockMatchMedia(false)
    render(<MobileGate />)
    expect(screen.queryByText('Best experienced on desktop.')).toBeNull()
    expect(screen.queryByText('Mobile coming soon.')).toBeNull()
  })

  it('headline is an h1', () => {
    mockMatchMedia(true)
    render(<MobileGate />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('Best experienced on desktop.')
  })
})

// ─── Breakpoint boundary and event lifecycle ──────────────────────────────────
// Captures the matchMedia listener to test resize and cleanup behavior.

function makeMqCapture(initialMatches: boolean) {
  let changeHandler: ((e: { matches: boolean }) => void) | null = null
  const mq = {
    matches: initialMatches,
    addEventListener: vi.fn((event: string, handler: (e: { matches: boolean }) => void) => {
      if (event === 'change') changeHandler = handler
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
  vi.stubGlobal('matchMedia', () => mq)
  return {
    mq,
    fire: (matches: boolean) => changeHandler?.({ matches } as MediaQueryListEvent),
  }
}

describe('MobileGate — breakpoint boundary', () => {
  it('queries matchMedia with exactly "(max-width: 767px)" — 767 is gate threshold', () => {
    const querySpy = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    vi.stubGlobal('matchMedia', querySpy)
    render(<MobileGate />)
    expect(querySpy).toHaveBeenCalledWith('(max-width: 767px)')
  })
})

describe('MobileGate — event listener lifecycle', () => {
  it('registers a change listener via addEventListener on mount', () => {
    const { mq } = makeMqCapture(false)
    render(<MobileGate />)
    expect(mq.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes the change listener via removeEventListener on unmount', () => {
    const { mq } = makeMqCapture(false)
    const { unmount } = render(<MobileGate />)
    unmount()
    expect(mq.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})

describe('MobileGate — resize behavior', () => {
  it('gate appears when viewport resizes from desktop to mobile', async () => {
    const { fire } = makeMqCapture(false) // start at desktop
    render(<MobileGate />)
    expect(screen.queryByText('Best experienced on desktop.')).toBeNull()

    await act(async () => { fire(true) })
    expect(screen.getByText('Best experienced on desktop.')).toBeTruthy()
  })

  it('gate disappears when viewport resizes from mobile to desktop', async () => {
    const { fire } = makeMqCapture(true) // start at mobile
    render(<MobileGate />)
    expect(screen.getByText('Best experienced on desktop.')).toBeTruthy()

    await act(async () => { fire(false) })
    expect(screen.queryByText('Best experienced on desktop.')).toBeNull()
  })
})
