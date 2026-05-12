import type { ResearchInputs } from './types'

export function encodeResearchId(inputs: ResearchInputs): string {
  const json = JSON.stringify(inputs)
  return btoa(encodeURIComponent(json))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function decodeResearchId(id: string): ResearchInputs | null {
  try {
    const base64 = id.replace(/-/g, '+').replace(/_/g, '/')
    // Restore padding
    const padded = base64 + '=='.slice((base64.length * 6) % 8 > 0 ? (8 - ((base64.length * 6) % 8)) / 6 : 0)
    const json = decodeURIComponent(atob(padded.replace(/[^A-Za-z0-9+/=]/g, '')))
    const parsed = JSON.parse(json)
    if (typeof parsed !== 'object' || !parsed || typeof parsed.year !== 'string') return null
    return parsed as ResearchInputs
  } catch {
    return null
  }
}
