export function formatAuctionEndTime(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export function formatDateShort(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Formats the end time for the live status pill in the viewer's local timezone.
 * Returns one of:
 *   "ENDS TODAY [time]"       — ending today
 *   "ENDS [WEEKDAY] [time]"   — ending within 7 days
 *   "ENDS [MON DD]"           — ending beyond 7 days
 *
 * @param isoString - ISO 8601 auction end time
 * @param now - current time (injectable for deterministic tests)
 */
export function formatLivePillDate(isoString: string, now: Date): string {
  const end = new Date(isoString)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endStart = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const daysDiff = Math.round((endStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000))

  const timeStr = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  if (daysDiff === 0) return `ENDS TODAY ${timeStr}`
  if (daysDiff < 7) {
    const dayName = end.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    return `ENDS ${dayName} ${timeStr}`
  }
  const monthDay = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
  return `ENDS ${monthDay}`
}
