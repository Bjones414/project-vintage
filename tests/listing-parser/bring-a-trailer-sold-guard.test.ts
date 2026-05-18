import { describe, it, expect } from 'vitest'
import { parseBatHtml } from '@/lib/listing-parser/bring-a-trailer'

// Fixture where "Current Bid $156,885" appears in visible text BEFORE "Sold for $15,500",
// but JSON-LD offers.price authoritatively records the completed sale at $15,500.
// This reproduces the mis-classification bug: the text-order heuristic picks up
// 'live' status from the earlier "Current Bid" string while the take copy reads 'sold'.
function makeSoldWithEarlyCurrentBidHtml(): string {
  const schema = JSON.stringify({
    '@type': 'Product',
    name: '1987 Porsche 911 Carrera',
    description: null,
    image: [],
    offers: { priceCurrency: 'USD', price: 15500 },
  })
  return `<!DOCTYPE html><html><head>
    <script type="application/ld+json">${schema}</script>
    <meta name="description" content="Lot #99999" />
  </head><body>
    <h1>1987 Porsche 911 Carrera</h1>
    <p>CURRENT BID $156,885</p>
    <p>Sold for $15,500</p>
  </body></html>`
}

describe('sold-promotion guard — JSON-LD overrides text-order status heuristic', () => {
  it('classifies listing as sold and clears high_bid_cents when JSON-LD confirms a sale', () => {
    const listing = parseBatHtml(
      makeSoldWithEarlyCurrentBidHtml(),
      'https://bringatrailer.com/listing/1987-porsche-911-carrera-1/',
    )
    expect(listing.listing_status).toBe('sold')
    expect(listing.high_bid_cents).toBeNull()
    expect(listing.sold_price_cents).toBe(1550000)
  })
})
