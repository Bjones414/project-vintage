import type { TimeOfDayBucket, NotifBucket } from './types'

// ─── Salutations ─────────────────────────────────────────────────────────────
// 4 options per time-of-day bucket. Used as the opening phrase before
// ", {firstName}." in the greeting headline.

export const SALUTATIONS: Record<TimeOfDayBucket, string[]> = {
  predawn: [
    'An early start',
    'Up before the rest',
    'The early watch',
    'Before the rest wakes',
  ],
  morning: [
    'Good morning',
    'A fine morning',
    'Morning, then',
    'A good morning to you',
  ],
  midmorning: [
    'Good late morning',
    'Still the morning hours',
    'Late morning, then',
    'The late side of morning',
  ],
  afternoon: [
    'Good afternoon',
    'A fine afternoon',
    'Afternoon, then',
    'Good afternoon to you',
  ],
  evening: [
    'Good evening',
    'A fine evening',
    'Evening, then',
    'An evening, then',
  ],
  night: [
    'Good evening',
    'A late evening',
    'Still at it',
    'The late hours',
  ],
}

// ─── Headline bodies ──────────────────────────────────────────────────────────
// 5 options per notification-activity bucket. Completes the greeting headline:
// "{salutation}, {firstName}. {headlineBody}"
// May contain {name}, {city}, {season} tokens.

export const HEADLINE_BODIES: Record<NotifBucket, string[]> = {
  quiet: [
    'a quiet stretch ahead — the garage is steady and the wire is calm.',
    'nothing pressing this side of the week. The market is measured and the cars are settled.',
    'a calm passage — nothing on the wire, nothing in the hunts that needs your attention.',
    'the week has been unhurried. The garage is unchanged and there is nothing calling.',
    'a quiet one. The cars are holding, the alerts are clear, and the market is composed.',
  ],
  light: [
    'a few things worth a glance.',
    'mostly quiet, but a couple of things have surfaced worth knowing.',
    'light activity — one or two things have moved on the wire.',
    'a measured week, with a couple of exceptions worth a few minutes.',
    'little has changed, but there are one or two things worth your attention.',
  ],
  active: [
    'there is some movement worth your attention.',
    'a few things have moved — on the hunts, on the wire, and in the garage.',
    'some activity this week. Worth working through the sections.',
    'the week brought some movement. A bit to work through.',
    'things are stirring on the hunts and the garage. Worth a look.',
  ],
  busy: [
    'the wire is lively. Plenty has moved.',
    'a busy stretch — price drops, new matches, and some news worth reading.',
    'things are moving. There is a fair amount to work through today.',
    'several things need your attention. The market has been active.',
    'an active week. The hunts have turned up, the garage has moved, and the wire is full.',
  ],
}

// ─── Standfirsts ─────────────────────────────────────────────────────────────
// 8 options. Italic editorial sentence below the headline. May contain
// {name}, {city}, {season} tokens.

export const STANDFIRSTS: string[] = [
  'There is an event near {city} this {season} that suits what you own, a new specialist worth knowing about in the area, and the reading section has something on your generation.',
  'The garage is steady. But {city} has an event this {season} worth considering, and the hunts have some movement that merits a few minutes.',
  'A few things surfaced this week — something on the wire, an event near {city}, and a piece or two in the reading section worth the time.',
  'The market is measured and the garage is holding. What is worth your attention is the events near {city} and one dispatch from the newsroom.',
  'Things are mostly settled. The cars are unchanged, but there is an event near {city} this {season} and a couple of reads that align with what you own.',
  'Between the events near {city} and the movement on the hunts, the week has a few things worth ten minutes of your time.',
  'The wire is quiet and the garage is steady. But the calendar near {city} has something worth the drive this {season}, and the reading section has something that touches on your cars.',
  'A mixed week — some movement on the hunts, a piece worth reading, and an event this {season} near {city} that suits what you own.',
]
