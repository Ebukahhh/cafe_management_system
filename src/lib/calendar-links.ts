import type { Reservation } from '@/lib/supabase/types/database.types'

/** Google Calendar “create event” URL for a reservation (approx. 2-hour block, UTC in `dates`). */
export function googleCalendarEventUrlForReservation(r: Reservation): string {
  const start = new Date(`${r.date}T${r.time_slot.slice(0, 8)}`)
  if (Number.isNaN(start.getTime())) {
    return 'https://calendar.google.com/calendar'
  }
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: "Jennifer's Café — Table reservation",
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Party of ${r.party_size}. ID: ${r.id}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
