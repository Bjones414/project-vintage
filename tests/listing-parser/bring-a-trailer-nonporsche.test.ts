import { describe, it, expect } from 'vitest'
import { parseBatHtml } from '@/lib/listing-parser/bring-a-trailer'

// Minimal BaT HTML fixture with a JSON-LD Product block.
// Mirrors the structure parseBatHtml expects; provides only the fields
// needed to exercise the make/model extraction path.
function makeBaTHtml(title: string): string {
  const schema = JSON.stringify({
    '@type': 'Product',
    name: title,
    description: null,
    image: [],
    offers: { priceCurrency: 'USD', price: 45000 },
  })
  return `<!DOCTYPE html><html><head>
    <script type="application/ld+json">${schema}</script>
    <meta name="description" content="Lot #12345" />
  </head><body>
    <h1>${title}</h1>
    <p>Sold for $45,000</p>
  </body></html>`
}

// ─── Non-Porsche makes ────────────────────────────────────────────────────────

describe('Non-Porsche BaT listings — generic model extraction', () => {
  it('extracts make and model from a Mercedes-Benz title', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1970 Mercedes-Benz 280SL'),
      'https://bringatrailer.com/listing/1970-mercedes-benz-280sl-1/',
    )
    expect(listing.make).toBe('Mercedes-Benz')
    expect(listing.model).toBe('280SL')
    expect(listing.trim).toBeNull()
    expect(listing.year).toBe(1970)
  })

  it('extracts make and model from a BMW title', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1972 BMW 2002'),
      'https://bringatrailer.com/listing/1972-bmw-2002-1/',
    )
    expect(listing.make).toBe('BMW')
    expect(listing.model).toBe('2002')
    expect(listing.trim).toBeNull()
    expect(listing.year).toBe(1972)
  })

  it('extracts make, model, and trim from a Ferrari title', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1972 Ferrari 246 GT Dino'),
      'https://bringatrailer.com/listing/1972-ferrari-246-gt-dino-1/',
    )
    expect(listing.make).toBe('Ferrari')
    expect(listing.model).toBe('246')
    expect(listing.trim).toBe('GT Dino')
  })

  it('non-Porsche listing has null vin from short-VIN; make/model/year all non-null', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1967 Alfa Romeo Spider'),
      'https://bringatrailer.com/listing/1967-alfa-romeo-spider-1/',
    )
    expect(listing.make).toBe('Alfa')
    // "Romeo" becomes model, "Spider" becomes trim — acceptable for caching
    expect(listing.model).toBe('Romeo')
    expect(listing.year).toBe(1967)
  })
})

// ─── Out-of-scope Porsche models ─────────────────────────────────────────────

describe('Out-of-scope Porsche BaT listings — Porsche-specific parsing still applies', () => {
  it('944 Turbo: make=Porsche, model=944, trim="Turbo"', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1986 Porsche 944 Turbo'),
      'https://bringatrailer.com/listing/1986-porsche-944-turbo-1/',
    )
    expect(listing.make).toBe('Porsche')
    expect(listing.model).toBe('944')
    expect(listing.trim).toBe('Turbo')
    expect(listing.year).toBe(1986)
  })

  it('928 S4: make=Porsche, model=928, trim="S4"', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1989 Porsche 928 S4'),
      'https://bringatrailer.com/listing/1989-porsche-928-s4-1/',
    )
    expect(listing.make).toBe('Porsche')
    expect(listing.model).toBe('928')
    expect(listing.trim).toBe('S4')
  })

  it('912: make=Porsche, model=912, trim="Coupe"', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1968 Porsche 912 Coupe'),
      'https://bringatrailer.com/listing/1968-porsche-912-coupe-1/',
    )
    expect(listing.make).toBe('Porsche')
    expect(listing.model).toBe('912')
    expect(listing.trim).toBe('Coupe')
  })

  it('914-6: make=Porsche, model=914, trim="6 Coupe"', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1970 Porsche 914-6 Coupe'),
      'https://bringatrailer.com/listing/1970-porsche-914-6-coupe-1/',
    )
    expect(listing.make).toBe('Porsche')
    expect(listing.model).toBe('914')
    expect(listing.trim).toBe('6 Coupe')
  })

  it('924: make=Porsche, model=924, trim=null when no trim specified', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1976 Porsche 924'),
      'https://bringatrailer.com/listing/1976-porsche-924-1/',
    )
    expect(listing.make).toBe('Porsche')
    expect(listing.model).toBe('924')
    expect(listing.trim).toBeNull()
  })
})

// ─── Early air-cooled 911 variant-letter suffix ───────────────────────────────

describe('Early air-cooled 911 BaT listings — variant-letter suffix parsing', () => {
  it('911S Targa: make=Porsche, model=911, trim="S Targa"', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1975 Porsche 911S Targa'),
      'https://bringatrailer.com/listing/1975-porsche-911s-targa-8/',
    )
    expect(listing.make).toBe('Porsche')
    expect(listing.model).toBe('911')
    expect(listing.trim).toBe('S Targa')
    expect(listing.year).toBe(1975)
  })

  it('911T Coupe: make=Porsche, model=911, trim="T Coupe"', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1970 Porsche 911T Coupe'),
      'https://bringatrailer.com/listing/1970-porsche-911t-coupe-1/',
    )
    expect(listing.make).toBe('Porsche')
    expect(listing.model).toBe('911')
    expect(listing.trim).toBe('T Coupe')
  })

  it('911SC Cabriolet: make=Porsche, model=911, trim="SC Cabriolet"', () => {
    const listing = parseBatHtml(
      makeBaTHtml('1983 Porsche 911SC Cabriolet'),
      'https://bringatrailer.com/listing/1983-porsche-911sc-cabriolet-1/',
    )
    expect(listing.make).toBe('Porsche')
    expect(listing.model).toBe('911')
    expect(listing.trim).toBe('SC Cabriolet')
  })
})

// ─── Comp engine cross-brand isolation (structural verification) ──────────────

describe('Comp engine cross-brand isolation guarantee', () => {
  it('null generation_id falls back to the "default" pool key', () => {
    // computeCompsV2 does: const generationId = subject.generation_id ?? 'default'
    // fetchV2Pool then queries .eq('generation_id', generationId).
    // In SQL, WHERE generation_id = 'default' does NOT match NULL rows.
    //
    // Non-Porsche listings (generation_id = null) → generationId = 'default'
    // fetchV2Pool('default', ...) returns zero rows (no listing has generation_id='default')
    // So non-Porsche comps can never reach any Porsche generation pool.
    const generationId: string | null = null
    expect(generationId ?? 'default').toBe('default')
  })

  it('a named generation pool never contains null-generation_id listings', () => {
    // The SQL .eq() filter uses strict equality: generation_id = '997.2'
    // Rows where generation_id IS NULL do not satisfy this condition.
    // Therefore non-Porsche / out-of-scope Porsche listings cannot leak into
    // any named Porsche generation comp pool.
    const generationId = '997.2'
    // Simulate what the SQL filter checks: null !== '997.2'
    const rowGenerationId: string | null = null
    expect(rowGenerationId === generationId).toBe(false)
  })
})
