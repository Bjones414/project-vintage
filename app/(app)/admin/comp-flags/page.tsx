'use client'

import { useEffect, useState, useCallback } from 'react'

interface FlaggedListing {
  id: string
  source_url: string
  year: number
  make: string
  model: string
  trim: string | null
  mileage: number | null
  final_price: number | null
  is_comp_resistant: boolean
  cross_listing_group_id: string | null
  auction_ends_at: string | null
}

function fmtUsd(cents: number | null): string {
  if (cents === null) return '—'
  return '$' + (cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function CompFlagsPage() {
  const [listings, setListings] = useState<FlaggedListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null) // listing id currently saving

  // Search state for adding a listing by URL or ID
  const [searchId, setSearchId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/comp-flags')
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(j.error ?? `HTTP ${res.status}`)
      }
      const j = await res.json() as { listings: FlaggedListing[] }
      setListings(j.listings)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function patch(
    listingId: string,
    fields: { is_comp_resistant?: boolean; cross_listing_group_id?: string | null },
  ) {
    setSaving(listingId)
    try {
      const res = await fetch('/api/admin/comp-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, ...fields }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(j.error ?? `HTTP ${res.status}`)
      }
      const j = await res.json() as { listing: FlaggedListing }
      setListings(prev => prev.map(l => l.id === listingId ? { ...l, ...j.listing } : l))
    } catch (e) {
      alert(`Save failed: ${String(e)}`)
    } finally {
      setSaving(null)
    }
  }

  async function addById() {
    const id = searchId.trim()
    if (!id) return
    await patch(id, { is_comp_resistant: true })
    setSearchId('')
    await load()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <h1 className="text-2xl font-semibold mb-1">Comp Flags</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Admin-only. Set <code className="text-amber-400">is_comp_resistant</code> to exclude listings from all comp pools,
        or assign a <code className="text-amber-400">cross_listing_group_id</code> to link the same car across platforms.
      </p>

      {/* Add by listing ID */}
      <div className="flex gap-2 mb-8 max-w-xl">
        <input
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400"
          placeholder="Paste listing UUID to flag as comp_resistant…"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') void addById() }}
        />
        <button
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium disabled:opacity-40"
          onClick={() => void addById()}
          disabled={!searchId.trim()}
        >
          Flag
        </button>
      </div>

      {loading && <p className="text-zinc-400 text-sm">Loading…</p>}
      {error && <p className="text-red-400 text-sm">Error: {error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p className="text-zinc-500 text-sm">No flagged listings yet.</p>
      )}

      {listings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-zinc-400 border-b border-zinc-800">
                <th className="pb-3 pr-4 font-medium">Listing</th>
                <th className="pb-3 pr-4 font-medium w-32">Price</th>
                <th className="pb-3 pr-4 font-medium w-24">Mileage</th>
                <th className="pb-3 pr-4 font-medium w-36">comp_resistant</th>
                <th className="pb-3 font-medium w-52">cross_listing_group_id</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40">
                  <td className="py-3 pr-4">
                    <a
                      href={l.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-200 hover:text-white underline underline-offset-2"
                    >
                      {l.year} {l.make} {l.model}{l.trim ? ` ${l.trim}` : ''}
                    </a>
                    <div className="text-zinc-500 text-xs mt-0.5 font-mono">{l.id.slice(0, 8)}…</div>
                  </td>
                  <td className="py-3 pr-4 text-zinc-300">{fmtUsd(l.final_price)}</td>
                  <td className="py-3 pr-4 text-zinc-300">
                    {l.mileage !== null ? l.mileage.toLocaleString() : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        l.is_comp_resistant
                          ? 'bg-red-900/60 text-red-300 hover:bg-red-800/60'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      } disabled:opacity-40`}
                      disabled={saving === l.id}
                      onClick={() => void patch(l.id, { is_comp_resistant: !l.is_comp_resistant })}
                    >
                      {saving === l.id ? '…' : l.is_comp_resistant ? 'resistant ✓' : 'normal'}
                    </button>
                  </td>
                  <td className="py-3">
                    <input
                      className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs w-full font-mono placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400"
                      placeholder="group id or blank"
                      defaultValue={l.cross_listing_group_id ?? ''}
                      onBlur={e => {
                        const val = e.target.value.trim() || null
                        if (val !== l.cross_listing_group_id) {
                          void patch(l.id, { cross_listing_group_id: val })
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
