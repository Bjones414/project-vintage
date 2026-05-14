import type {
  GreetingAccount,
  GreetingNotifications,
  GreetingResult,
  TimeOfDayBucket,
  NotifBucket,
} from './types'
import { SALUTATIONS, HEADLINE_BODIES, STANDFIRSTS } from './pools'

// ─── Time-of-day bucket definitions ──────────────────────────────────────────

const TOD_DEFS: { bucket: TimeOfDayBucket; start: number; end: number }[] = [
  { bucket: 'predawn',    start: 0,  end: 4  },
  { bucket: 'morning',    start: 5,  end: 9  },
  { bucket: 'midmorning', start: 10, end: 11 },
  { bucket: 'afternoon',  start: 12, end: 16 },
  { bucket: 'evening',    start: 17, end: 20 },
  { bucket: 'night',      start: 21, end: 23 },
]

// Human-readable labels for the metaStrip
const TOD_LABELS: Record<TimeOfDayBucket, string> = {
  predawn:    'early hours',
  morning:    'morning',
  midmorning: 'late morning',
  afternoon:  'afternoon',
  evening:    'evening',
  night:      'late evening',
}

const NOTIF_BUCKETS: NotifBucket[] = ['quiet', 'light', 'active', 'busy']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimeOfDayBucket(hour: number): TimeOfDayBucket {
  for (const def of TOD_DEFS) {
    if (hour >= def.start && hour <= def.end) return def.bucket
  }
  return 'night'
}

function getNotifBucket(unread: number): NotifBucket {
  if (unread === 0) return 'quiet'
  if (unread <= 2) return 'light'
  if (unread <= 5) return 'active'
  return 'busy'
}

// 1-indexed day of year (1 = Jan 1, 365/366 = Dec 31)
function getDayOfYear(date: Date): number {
  const jan1 = new Date(date.getFullYear(), 0, 1)
  return Math.floor((date.getTime() - jan1.getTime()) / 86_400_000) + 1
}

function getSeason(month: number): string {
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

// Deterministic selection: same seed → same pool entry across all calls.
// Wang hash breaks the linearity of simple modulo arithmetic so all pool
// positions are reachable even when seeds share a common factor with pool.length.
function pick<T>(pool: T[], seed: number): T {
  let h = (seed + 1) >>> 0
  h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0)
  h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0)
  h = (h ^ (h >>> 16)) >>> 0
  return pool[h % pool.length]
}

function substituteTokens(
  template: string,
  account: GreetingAccount,
  season: string,
): string {
  return template
    .replace(/\{name\}/g, account.firstName)
    .replace(/\{city\}/g, account.city)
    .replace(/\{season\}/g, season)
}

function formatMetaStrip(
  date: Date,
  todBucket: TimeOfDayBucket,
  city: string,
): string {
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayName = DAY_NAMES[date.getDay()]
  const monthName = MONTH_NAMES[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const todLabel = TOD_LABELS[todBucket]
  return `${dayName} ${todLabel} · ${day} ${monthName} ${year} · ${city}`
}

// ─── Engine ───────────────────────────────────────────────────────────────────

// Pure function — no side effects, no randomness.
// Same (account, notifications, date) always returns identical output.
//
// Seed derivation guarantees uniqueness per (dayOfYear, todBucket, notifBucket)
// within a calendar year. Across years the same greeting may recur — acceptable.
export function computeGreeting(
  account: GreetingAccount,
  notifications: GreetingNotifications,
  date: Date,
): GreetingResult {
  const hour = date.getHours()
  const todBucket = getTimeOfDayBucket(hour)
  const notifBucket = getNotifBucket(notifications.unread)
  const dayOfYear = getDayOfYear(date)
  const season = getSeason(date.getMonth())

  const todIdx = TOD_DEFS.findIndex((d) => d.bucket === todBucket)
  const notifIdx = NOTIF_BUCKETS.indexOf(notifBucket)

  // Each seed is unique per (dayOfYear, todIdx, notifIdx) combination so that
  // salutation, headline, and standfirst vary independently as the session advances.
  const salutSeed = dayOfYear * 6 + todIdx
  const headlineSeed = dayOfYear * 4 + notifIdx
  const standfirstSeed = dayOfYear * 24 + todIdx * 4 + notifIdx

  const salutation = pick(SALUTATIONS[todBucket], salutSeed)
  const headlineBodyRaw = pick(HEADLINE_BODIES[notifBucket], headlineSeed)
  const standfirstRaw = pick(STANDFIRSTS, standfirstSeed)

  return {
    metaStrip: formatMetaStrip(date, todBucket, account.city),
    salutation,
    headlineBody: substituteTokens(headlineBodyRaw, account, season),
    standfirst: substituteTokens(standfirstRaw, account, season),
  }
}

export type { GreetingAccount, GreetingNotifications, GreetingResult, TimeOfDayBucket, NotifBucket }
