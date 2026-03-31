/** Format a Postgres time string (e.g. "11:00:00") for display. */
export function formatTimeSlotDisplay(timeSlot: string): string {
  const parts = timeSlot.split(':')
  const h = Number(parts[0])
  const m = Number(parts[1] ?? 0)
  if (Number.isNaN(h)) return timeSlot
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(/\s/g, '')
    .toLowerCase()
}

/** e.g. "Wed, Apr 5, 2026" — for admin reservation rows */
export function formatMediumDateFromYmd(ymd: string): string {
  const [y, mo, day] = ymd.split('-').map(Number)
  if (!y || !mo || !day) return ymd
  const d = new Date(y, mo - 1, day)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatLongDateFromYmd(ymd: string): string {
  const [y, mo, day] = ymd.split('-').map(Number)
  if (!y || !mo || !day) return ymd
  const d = new Date(y, mo - 1, day)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function toLocalYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Calendar date (YYYY-MM-DD) for a specific IANA timezone, e.g. `America/New_York`. */
export function todayYmdInTimezone(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const d = parts.find((p) => p.type === 'day')?.value
  if (!y || !m || !d) return toLocalYmd(new Date())
  return `${y}-${m}-${d}`
}

export function addDaysYmd(ymd: string, delta: number): string {
  const [y, mo, day] = ymd.split('-').map(Number)
  const d = new Date(y, mo - 1, day)
  d.setDate(d.getDate() + delta)
  return toLocalYmd(d)
}

/** Short display ref for reservation cards, e.g. `#RES-A1B2C3D4`. */
export function formatReservationRef(id: string): string {
  const compact = id.replace(/-/g, '')
  return `#RES-${compact.slice(0, 8).toUpperCase()}`
}

export function formatRelativeSubmitted(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffSec = Math.floor((now - then) / 1000)
  if (diffSec < 45) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? '' : 's'} ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
}
