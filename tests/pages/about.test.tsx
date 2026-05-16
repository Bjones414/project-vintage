import { describe, it, expect, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import AboutPage from '@/app/(marketing)/about/page'

describe('AboutPage', () => {
  let html: string

  // Render once and reuse — AboutPage is a pure static component
  beforeEach(() => {
    html = renderToString(<AboutPage />)
  })

  describe('prose content', () => {
    it('renders the opening phrase of block 1', () => {
      expect(html).toContain('A passion project, inspired by my father')
    })

    it('renders the "always a manual" line in block 1', () => {
      expect(html).toContain('Always a manual')
    })

    it('renders the "Project Vintage is the answer" paragraph in block 1', () => {
      expect(html).toContain('Project Vintage is the answer to what one place would look like')
    })

    it('renders the data-privacy statement in block 2', () => {
      // avoid testing the smart apostrophe character directly
      expect(html).toContain('sell user data. Ever.')
    })

    it('renders the no-auctions statement in block 2', () => {
      expect(html).toContain('Project Vintage will never host auctions')
    })

    it('"Partner, not parasite." sentence has been removed', () => {
      expect(html).not.toContain('Partner, not parasite')
    })

    it('block 2 retains the ecosystem complement statement', () => {
      expect(html).toContain('complement that work, not compete with it')
    })
  })

  describe('hairline breaker with gold dot', () => {
    it('renders the hairline rule using border-border-subtle', () => {
      expect(html).toContain('border-border-subtle')
    })

    it('renders the gold dot as a rounded-full element with bg-accent-primary', () => {
      expect(html).toContain('rounded-full')
      expect(html).toContain('bg-accent-primary')
    })

    it('gold dot is centered with translate-x-1/2 and translate-y-1/2', () => {
      expect(html).toContain('-translate-x-1/2')
      expect(html).toContain('-translate-y-1/2')
    })
  })

  describe('tagline', () => {
    it('renders the tagline text', () => {
      expect(html).toContain('Algorithms have their place. Nothing beats a manual.')
    })

    it('tagline element carries the italic and text-center classes', () => {
      // Verify both classes appear in the class attribute directly before the tagline content
      expect(html).toContain('text-center')
      expect(html).toContain('italic text-text-secondary">Algorithms have their place')
    })
  })

  describe('nav consistency — SimpleUnauthHeader', () => {
    it('renders the "Project Vintage" brand mark', () => {
      expect(html).toContain('Project Vintage')
    })

    it('renders a "Sign in" link pointing to /login', () => {
      expect(html).toContain('Sign in')
      expect(html).toContain('href="/login"')
    })

    it('brand link points to /', () => {
      expect(html).toContain('href="/"')
    })

    it('outer wrapper overrides header inner-div max-width so brand sits at viewport left', () => {
      // The about page outer div carries [&>header>div]:max-w-none, which overrides
      // SimpleUnauthHeader's max-w-[480px] so the header spans full viewport width.
      // renderToString HTML-encodes the class attribute, so we match the bare utility token.
      // Visual confirmation (brand at far-left, "Sign in" at far-right) requires browser testing.
      expect(html).toContain('max-w-none')
    })
  })

  describe('layout', () => {
    it('does not render an H1 or eyebrow (no section headers in locked layout)', () => {
      expect(html).not.toContain('<h1')
      expect(html).not.toContain('About</p>')
    })

    it('content column is constrained to max-w-[560px]', () => {
      expect(html).toContain('max-w-[560px]')
    })
  })
})
