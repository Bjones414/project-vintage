// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ComingSoon } from '@/components/ComingSoon'

afterEach(cleanup)

describe('ComingSoon', () => {
  it('renders the surface prop in the heading', () => {
    render(<ComingSoon surface="Events" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('Events')
  })

  it('heading contains "Coming soon."', () => {
    render(<ComingSoon surface="Library" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('Coming')
    expect(heading.textContent).toContain('soon')
  })

  it('renders the default fallback description when none is provided', () => {
    render(<ComingSoon surface="Shops" />)
    expect(
      screen.getByText(/this section is in development/i),
    ).toBeTruthy()
  })

  it('renders a custom description when provided', () => {
    render(<ComingSoon surface="Events" description="Local car events are coming." />)
    expect(screen.getByText('Local car events are coming.')).toBeTruthy()
  })

  it('renders a link back to /home', () => {
    render(<ComingSoon surface="Events" />)
    const link = screen.getByRole('link', { name: /return to home/i })
    expect((link as HTMLAnchorElement).getAttribute('href')).toBe('/home')
  })

  it('renders the "In development" section label', () => {
    render(<ComingSoon surface="Library" />)
    expect(screen.getByText('In development')).toBeTruthy()
  })
})
