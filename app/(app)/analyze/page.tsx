'use client'

import { useState } from 'react'
import type { CanonicalListing } from '@/lib/listing-parser/types'

function priceLabel(status: CanonicalListing['listing_status'] | undefined): string {
  switch (status) {
    case 'live':    return 'Current Bid'
    case 'sold':    return 'Sold Price'
    case 'no-sale': return 'High Bid (Reserve Not Met)'
    default:        return 'Price'
  }
}

function formatPrice(cents: number | null): string {
  if (cents === null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function vinLabel(vin: string | null): string {
  if (vin && vin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return 'VIN'
  return 'Chassis'
}

function formatMileage(miles: number | null): string {
  if (miles === null) return 'N/A'
  return new Intl.NumberFormat('en-US').format(miles) + ' mi'
}

function truncate(text: string | null, limit: number): string {
  if (!text) return 'N/A'
  return text.length <= limit ? text : text.slice(0, limit) + '…'
}

export default function AnalyzePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState<CanonicalListing | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setListing(null)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = (await response.json()) as { listing?: CanonicalListing; error?: string }
      if (!response.ok) {
        setError(data.error ?? `Request failed with status ${response.status}`)
      } else if (data.listing) {
        setListing(data.listing)
      }
    } catch {
      setError('Network error — check your connection and try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Analyze a Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="listing-url" className="text-sm font-medium text-gray-700">
            Paste an auction URL
          </label>
          <input
            id="listing-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://bringatrailer.com/listing/..."
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="mt-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {listing && (
        <div className="mt-8 rounded-md border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">{listing.title}</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Year</dt>
              <dd className="font-medium">{listing.year ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Make</dt>
              <dd className="font-medium">{listing.make ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Model</dt>
              <dd className="font-medium">{listing.model ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Mileage</dt>
              <dd className="font-medium">{formatMileage(listing.mileage)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{priceLabel(listing.listing_status)}</dt>
              <dd className="font-medium">{formatPrice(listing.sold_price_cents)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{vinLabel(listing.vin)}</dt>
              <dd className="font-mono text-xs">{listing.vin ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Transmission</dt>
              <dd className="font-medium">{listing.transmission ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Exterior Color</dt>
              <dd className="font-medium">{listing.exterior_color ?? 'N/A'}</dd>
            </div>
          </dl>
          {listing.description && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Description</p>
              <p className="mt-1 text-sm text-gray-700">{truncate(listing.description, 300)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
