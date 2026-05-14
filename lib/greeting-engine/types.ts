export type TimeOfDayBucket =
  | 'predawn'
  | 'morning'
  | 'midmorning'
  | 'afternoon'
  | 'evening'
  | 'night'

export type NotifBucket = 'quiet' | 'light' | 'active' | 'busy'

export interface GreetingAccount {
  firstName: string
  lastName: string
  city: string
  timezone: string
}

export interface GreetingNotifications {
  unread: number
  priceDrop: number
  newMatch: number
  auctionEnding: number
}

export interface GreetingResult {
  metaStrip: string
  salutation: string
  headlineBody: string
  standfirst: string
}
