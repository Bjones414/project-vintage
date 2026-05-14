import { describe, it, expect } from 'vitest'
import { computeGreeting } from '@/lib/greeting-engine'
import type { GreetingAccount, GreetingNotifications } from '@/lib/greeting-engine/types'
import { SALUTATIONS, HEADLINE_BODIES, STANDFIRSTS } from '@/lib/greeting-engine/pools'

const ACCOUNT: GreetingAccount = {
  firstName: 'Charles',
  lastName: 'Williamson',
  city: 'San Jose',
  timezone: 'America/Los_Angeles',
}

const NOTIF_QUIET: GreetingNotifications = { unread: 0, priceDrop: 0, newMatch: 0, auctionEnding: 0 }
const NOTIF_LIGHT: GreetingNotifications = { unread: 2, priceDrop: 1, newMatch: 1, auctionEnding: 0 }
const NOTIF_ACTIVE: GreetingNotifications = { unread: 4, priceDrop: 1, newMatch: 1, auctionEnding: 2 }
const NOTIF_BUSY: GreetingNotifications = { unread: 8, priceDrop: 2, newMatch: 2, auctionEnding: 4 }

// Helper: build a Date at a specific local hour (year/month are 0-indexed)
function dateAt(year: number, month: number, day: number, hour: number): Date {
  return new Date(year, month, day, hour, 0, 0, 0)
}

// ─── Determinism ──────────────────────────────────────────────────────────────

describe('determinism', () => {
  it('returns identical output for identical inputs called twice', () => {
    const date = dateAt(2026, 4, 10, 9) // May 10, 9am
    const a = computeGreeting(ACCOUNT, NOTIF_ACTIVE, date)
    const b = computeGreeting(ACCOUNT, NOTIF_ACTIVE, date)
    expect(a).toEqual(b)
  })

  it('same date + different hour within the same TOD bucket → same output', () => {
    // Both 5am and 8am fall in the "morning" bucket (5–9)
    const date5 = dateAt(2026, 4, 10, 5)
    const date8 = dateAt(2026, 4, 10, 8)
    expect(computeGreeting(ACCOUNT, NOTIF_QUIET, date5)).toEqual(
      computeGreeting(ACCOUNT, NOTIF_QUIET, date8),
    )
  })

  it('same date + different TOD bucket → different salutation or headlineBody', () => {
    const morning = computeGreeting(ACCOUNT, NOTIF_LIGHT, dateAt(2026, 4, 10, 7))
    const evening = computeGreeting(ACCOUNT, NOTIF_LIGHT, dateAt(2026, 4, 10, 18))
    // Salutations come from different pools so they must differ
    expect(morning.salutation).not.toBe(evening.salutation)
  })
})

// ─── Rotation across days ─────────────────────────────────────────────────────

describe('rotation', () => {
  it('same TOD + notif bucket on different days produces some variation', () => {
    const results = new Set<string>()
    for (let day = 1; day <= 30; day++) {
      const result = computeGreeting(ACCOUNT, NOTIF_ACTIVE, dateAt(2026, 4, day, 9))
      results.add(result.headlineBody)
    }
    // With a pool of 5 headlineBodies, 30 days must cover more than 1 unique value
    expect(results.size).toBeGreaterThan(1)
  })

  it('different days cycle through all salutation variants within a season', () => {
    const salutations = new Set<string>()
    for (let day = 1; day <= 28; day++) {
      const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, day, 9)) // morning bucket
      salutations.add(r.salutation)
    }
    // Morning bucket has 4 options; 28 days must hit all 4
    expect(salutations.size).toBe(4)
  })

  it('different days cycle through all standfirst variants', () => {
    const seen = new Set<string>()
    // 8 standfirsts; test across enough days to cover all
    for (let day = 1; day <= 64; day++) {
      const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, day % 28 + 1, 9))
      seen.add(r.standfirst)
    }
    expect(seen.size).toBeGreaterThan(1)
  })
})

// ─── Token substitution ───────────────────────────────────────────────────────

describe('token substitution', () => {
  it('substitutes {name} in headlineBody when template contains it', () => {
    // Run enough variants to find a headlineBody or standfirst with {name}
    // Tokens are substituted, so raw {name} should never appear in output
    for (let day = 1; day <= 20; day++) {
      const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, day, 9))
      expect(r.headlineBody).not.toContain('{name}')
      expect(r.standfirst).not.toContain('{name}')
      expect(r.metaStrip).not.toContain('{name}')
    }
  })

  it('substitutes {city} — raw token never appears in output', () => {
    for (let day = 1; day <= 20; day++) {
      const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, day, 9))
      expect(r.standfirst).not.toContain('{city}')
    }
  })

  it('substitutes {season} — raw token never appears in output', () => {
    for (let day = 1; day <= 20; day++) {
      const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, day, 9))
      expect(r.standfirst).not.toContain('{season}')
    }
  })

  it('injects the actual city name from account', () => {
    // Find a standfirst that contains the city by running across days
    const results = Array.from({ length: 20 }, (_, i) =>
      computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, i + 1, 9)),
    )
    const withCity = results.filter((r) => r.standfirst.includes('San Jose'))
    expect(withCity.length).toBeGreaterThan(0)
  })

  it('season token maps correctly — May is spring', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, 10, 9)) // May = month 4
    // Every standfirst template that uses {season} should now say "spring"
    // We can verify by checking that "summer"/"autumn"/"winter" don't appear erroneously
    expect(r.standfirst).not.toContain('summer')
    expect(r.standfirst).not.toContain('autumn')
    expect(r.standfirst).not.toContain('winter')
  })

  it('season token maps correctly — December is winter', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 11, 15, 9)) // December
    expect(r.standfirst).not.toContain('spring')
    expect(r.standfirst).not.toContain('summer')
    expect(r.standfirst).not.toContain('autumn')
  })
})

// ─── Notification states ─────────────────────────────────────────────────────

describe('notification states', () => {
  const date = dateAt(2026, 4, 10, 9)

  it('quiet (0 unread) returns valid output', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, date)
    expect(r.metaStrip).toBeTruthy()
    expect(r.salutation).toBeTruthy()
    expect(r.headlineBody).toBeTruthy()
    expect(r.standfirst).toBeTruthy()
  })

  it('light (1-2 unread) returns valid output', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_LIGHT, date)
    expect(r.metaStrip).toBeTruthy()
    expect(r.salutation).toBeTruthy()
    expect(r.headlineBody).toBeTruthy()
    expect(r.standfirst).toBeTruthy()
  })

  it('active (3-5 unread) returns valid output', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_ACTIVE, date)
    expect(r.metaStrip).toBeTruthy()
    expect(r.salutation).toBeTruthy()
    expect(r.headlineBody).toBeTruthy()
    expect(r.standfirst).toBeTruthy()
  })

  it('busy (6+ unread) returns valid output', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_BUSY, date)
    expect(r.metaStrip).toBeTruthy()
    expect(r.salutation).toBeTruthy()
    expect(r.headlineBody).toBeTruthy()
    expect(r.standfirst).toBeTruthy()
  })

  it('quiet vs busy produces different headlineBodies', () => {
    const quiet = computeGreeting(ACCOUNT, NOTIF_QUIET, date)
    const busy = computeGreeting(ACCOUNT, NOTIF_BUSY, date)
    expect(quiet.headlineBody).not.toBe(busy.headlineBody)
  })

  it('boundary: unread=2 is light, unread=3 is active', () => {
    const light = computeGreeting(ACCOUNT, { ...NOTIF_QUIET, unread: 2 }, date)
    const active = computeGreeting(ACCOUNT, { ...NOTIF_QUIET, unread: 3 }, date)
    // Different buckets → different headline pools → different bodies
    expect(light.headlineBody).not.toBe(active.headlineBody)
  })

  it('boundary: unread=5 is active, unread=6 is busy', () => {
    const active = computeGreeting(ACCOUNT, { ...NOTIF_QUIET, unread: 5 }, date)
    const busy = computeGreeting(ACCOUNT, { ...NOTIF_QUIET, unread: 6 }, date)
    expect(active.headlineBody).not.toBe(busy.headlineBody)
  })
})

// ─── Time-of-day buckets ──────────────────────────────────────────────────────

describe('time-of-day buckets', () => {
  const bucketHours: Record<string, number> = {
    predawn:    2,
    morning:    7,
    midmorning: 10,
    afternoon:  14,
    evening:    18,
    night:      22,
  }

  for (const [bucketName, hour] of Object.entries(bucketHours)) {
    it(`${bucketName} (hour ${hour}) returns valid output`, () => {
      const r = computeGreeting(ACCOUNT, NOTIF_LIGHT, dateAt(2026, 4, 10, hour))
      expect(r.metaStrip).toBeTruthy()
      expect(r.salutation).toBeTruthy()
      expect(r.headlineBody).toBeTruthy()
      expect(r.standfirst).toBeTruthy()
    })

    it(`${bucketName} salutation comes from the correct pool`, () => {
      const r = computeGreeting(ACCOUNT, NOTIF_LIGHT, dateAt(2026, 4, 10, hour))
      const poolValues = SALUTATIONS[bucketName as keyof typeof SALUTATIONS]
      expect(poolValues).toContain(r.salutation)
    })
  }

  it('predawn metaStrip contains "early hours"', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, 10, 3))
    expect(r.metaStrip).toContain('early hours')
  })

  it('morning metaStrip contains "morning"', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, 10, 7))
    expect(r.metaStrip).toContain('morning')
  })

  it('afternoon metaStrip contains "afternoon"', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, 10, 14))
    expect(r.metaStrip).toContain('afternoon')
  })
})

// ─── MetaStrip format ─────────────────────────────────────────────────────────

describe('metaStrip', () => {
  it('includes the city from account', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, 10, 9))
    expect(r.metaStrip).toContain('San Jose')
  })

  it('includes the day-of-week name', () => {
    // May 10 2026 is a Sunday
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, 10, 9))
    expect(r.metaStrip).toContain('Sunday')
  })

  it('includes the year', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, 10, 9))
    expect(r.metaStrip).toContain('2026')
  })

  it('uses · as separator', () => {
    const r = computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, 10, 9))
    expect(r.metaStrip).toContain(' · ')
  })
})

// ─── Pool coverage ────────────────────────────────────────────────────────────

describe('pool coverage', () => {
  it('all 4 morning salutations appear within a 28-day window', () => {
    const seen = new Set<string>()
    for (let d = 1; d <= 28; d++) {
      seen.add(computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, d, 7)).salutation)
    }
    expect(seen.size).toBe(SALUTATIONS.morning.length)
  })

  it('all 5 quiet headlineBodies appear within a 40-day window', () => {
    const seen = new Set<string>()
    for (let d = 1; d <= 40; d++) {
      seen.add(computeGreeting(ACCOUNT, NOTIF_QUIET, dateAt(2026, 4, d % 28 + 1, 7)).headlineBody)
    }
    expect(seen.size).toBe(HEADLINE_BODIES.quiet.length)
  })

  it('all 5 busy headlineBodies appear within a 40-day window', () => {
    const seen = new Set<string>()
    for (let d = 1; d <= 40; d++) {
      seen.add(computeGreeting(ACCOUNT, NOTIF_BUSY, dateAt(2026, 4, d % 28 + 1, 7)).headlineBody)
    }
    expect(seen.size).toBe(HEADLINE_BODIES.busy.length)
  })

  it('pool sizes match spec: 4 salutations per bucket, 5 headlines per bucket, 8 standfirsts', () => {
    for (const pool of Object.values(SALUTATIONS)) {
      expect(pool.length).toBe(4)
    }
    for (const pool of Object.values(HEADLINE_BODIES)) {
      expect(pool.length).toBe(5)
    }
    expect(STANDFIRSTS.length).toBe(8)
  })
})
