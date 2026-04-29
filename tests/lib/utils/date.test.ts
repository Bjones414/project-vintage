import { describe, it, expect } from 'vitest'
import { formatLivePillDate } from '@/lib/utils/date'

// All `now` values are chosen at noon UTC so calendar-day comparisons are
// unambiguous in any timezone within ±12 hours of UTC.
const NOW = new Date('2026-04-29T12:00:00Z')

describe('formatLivePillDate', () => {
  it('returns "ENDS TODAY [time]" when auction ends same calendar day', () => {
    const result = formatLivePillDate('2026-04-29T18:00:00Z', NOW)
    expect(result).toMatch(/^ENDS TODAY /)
  })

  it('returns "ENDS [WEEKDAY] [time]" when auction ends within 7 days', () => {
    // May 2 is 3 days from April 29 — well within the 7-day window
    const result = formatLivePillDate('2026-05-02T18:00:00Z', NOW)
    expect(result).toMatch(/^ENDS (MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY) /)
  })

  it('returns "ENDS [MON DD]" when auction ends beyond 7 days', () => {
    // May 15 is 16 days out — well beyond 7
    const result = formatLivePillDate('2026-05-15T18:00:00Z', NOW)
    expect(result).toMatch(/^ENDS [A-Z]{3} \d+$/)
  })

  it('day-boundary edge case: exactly 6 days out falls in WEEKDAY branch', () => {
    // May 5 is exactly 6 days from April 29
    const result = formatLivePillDate('2026-05-05T18:00:00Z', NOW)
    expect(result).toMatch(/^ENDS (MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY) /)
  })

  it('day-boundary edge case: exactly 7 days out falls in MON DD branch', () => {
    // May 6 is exactly 7 days from April 29
    const result = formatLivePillDate('2026-05-06T18:00:00Z', NOW)
    expect(result).toMatch(/^ENDS [A-Z]{3} \d+$/)
  })
})
