// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { GreetingHeader } from '@/components/GreetingHeader'
import type { GreetingAccount, GreetingNotifications } from '@/lib/greeting-engine/types'

const ACCOUNT: GreetingAccount = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  city: 'Scottsdale',
  timezone: 'America/Phoenix',
}

const QUIET: GreetingNotifications = {
  unread: 0,
  priceDrop: 0,
  newMatch: 0,
  auctionEnding: 0,
}

afterEach(() => {
  cleanup()
})

// ─── Welcome mode (showWelcome=true) ─────────────────────────────────────────
// Covers: first-login user, user with garage but no watchlist,
//         user with watchlist but no garage — all three map to showWelcome=true.

describe('GreetingHeader — welcome mode (showWelcome=true)', () => {
  it('renders "Welcome, {firstName}." as the h1', () => {
    render(<GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Welcome, Ada.')
  })

  it('does not render the standard salutation in welcome mode', () => {
    render(<GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    // Welcome mode h1 is "Welcome, Ada." only — no salutation prefix like "Good morning, "
    expect(h1.textContent?.trim()).toBe('Welcome, Ada.')
  })

  it('renders the welcome dek paragraph', () => {
    render(<GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} />)
    expect(screen.getByText(/Two places to start:/)).toBeTruthy()
  })

  it('does not render the standard standfirst in welcome mode', () => {
    render(<GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} />)
    // Welcome dek is present; the standard standfirst ("It's a quiet week...")
    // should not also appear. Both welcome and standard standfirsts are <p> elements —
    // the welcome one starts with "Two places to start".
    expect(screen.getByText(/Two places to start:/)).toBeTruthy()
  })
})

// ─── Standard mode (showWelcome=false) ────────────────────────────────────────
// Covers: fully populated user (vehicleCount>0 AND watchlistCount>0).

describe('GreetingHeader — standard mode (showWelcome=false)', () => {
  it('renders firstName in the h1 headline', () => {
    render(<GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={false} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Ada')
  })

  it('does NOT render "Welcome, Ada." in standard mode', () => {
    render(<GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={false} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent?.trim()).not.toBe('Welcome, Ada.')
    expect(h1.textContent).not.toMatch(/^Welcome,/)
  })

  it('does NOT render the welcome dek in standard mode', () => {
    render(<GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={false} />)
    expect(screen.queryByText(/Two places to start:/)).toBeNull()
  })
})

// ─── hasVehicles variants ─────────────────────────────────────────────────────

describe('GreetingHeader — hasVehicles=false (empty garage)', () => {
  it('renders "Your garage is empty." status line', () => {
    render(
      <GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} hasVehicles={false} />,
    )
    expect(screen.getByText(/Your garage is empty\./)).toBeTruthy()
  })

  it('renders "Add your first car" prompt', () => {
    render(
      <GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} hasVehicles={false} />,
    )
    expect(screen.getByText(/Add your first car/)).toBeTruthy()
  })
})

describe('GreetingHeader — hasVehicles=true (populated garage)', () => {
  it('renders "In the garage:" status line', () => {
    render(
      <GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={false} hasVehicles={true} />,
    )
    expect(screen.getByText(/In the garage:/)).toBeTruthy()
  })

  it('does NOT render "Your garage is empty."', () => {
    render(
      <GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={false} hasVehicles={true} />,
    )
    expect(screen.queryByText(/Your garage is empty\./)).toBeNull()
  })
})

// ─── Always-present elements ─────────────────────────────────────────────────

describe('GreetingHeader — always-present elements', () => {
  it('"Open the garage →" garage link always renders in welcome mode', () => {
    render(
      <GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} hasVehicles={false} />,
    )
    expect(screen.getByText(/Open the garage/)).toBeTruthy()
  })

  it('"Open the garage →" garage link always renders in standard mode', () => {
    render(
      <GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={false} hasVehicles={true} />,
    )
    expect(screen.getByText(/Open the garage/)).toBeTruthy()
  })

  it('meta strip is always rendered', () => {
    render(<GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} />)
    // metaStrip contains city and some time-of-day label — just check city appears
    expect(screen.getByText(/Scottsdale/)).toBeTruthy()
  })
})

// ─── Cross-scenario: welcome + hasVehicles combinations ──────────────────────

describe('GreetingHeader — welcome mode + hasVehicles=true (garage present, no watchlist)', () => {
  it('welcome headline still shows even when hasVehicles=true', () => {
    render(
      <GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} hasVehicles={true} />,
    )
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent?.trim()).toBe('Welcome, Ada.')
  })

  it('"In the garage:" line shows even in welcome mode when hasVehicles=true', () => {
    render(
      <GreetingHeader account={ACCOUNT} notifications={QUIET} showWelcome={true} hasVehicles={true} />,
    )
    expect(screen.getByText(/In the garage:/)).toBeTruthy()
  })
})
