// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SimpleUnauthHeader } from '@/components/chrome/SimpleUnauthHeader'

afterEach(() => {
  cleanup()
})

describe('SimpleUnauthHeader', () => {
  it('renders the brand mark', () => {
    render(<SimpleUnauthHeader />)
    expect(screen.getByText('Project Vintage')).toBeTruthy()
  })

  it('renders "Sign in" link pointing to /login', () => {
    render(<SimpleUnauthHeader />)
    const link = screen.getByRole('link', { name: 'Sign in' })
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe('/login')
  })

  it('brand mark links to /', () => {
    render(<SimpleUnauthHeader />)
    const brandLink = screen.getByRole('link', { name: 'Project Vintage' })
    expect(brandLink.getAttribute('href')).toBe('/')
  })
})
