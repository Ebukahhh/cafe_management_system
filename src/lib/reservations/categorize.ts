import type { Reservation } from '@/lib/supabase/types/database.types'
import { toLocalYmd } from '@/lib/format-datetime'

function isReservationStartInPast(r: Reservation, now: Date): boolean {
  const todayYmd = toLocalYmd(now)
  if (r.date < todayYmd) return true
  if (r.date > todayYmd) return false
  const [h, m] = r.time_slot.split(':').map(Number)
  const slotMins = (h || 0) * 60 + (m || 0)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  return slotMins < nowMins
}

function sortByDateTimeAsc(a: Reservation, b: Reservation): number {
  const c = a.date.localeCompare(b.date)
  if (c !== 0) return c
  return a.time_slot.localeCompare(b.time_slot)
}

function sortByDateTimeDesc(a: Reservation, b: Reservation): number {
  return -sortByDateTimeAsc(a, b)
}

export type CategorizedReservations = {
  upcoming: Reservation[]
  pending: Reservation[]
  past: Reservation[]
  cancelled: Reservation[]
}

/** Split rows for My Reservations tabs. `now` is injectable for tests. */
export function categorizeReservations(
  rows: Reservation[],
  now: Date = new Date()
): CategorizedReservations {
  const upcoming: Reservation[] = []
  const pending: Reservation[] = []
  const past: Reservation[] = []
  const cancelled: Reservation[] = []

  for (const r of rows) {
    if (r.status === 'cancelled') {
      cancelled.push(r)
      continue
    }
    if (r.status === 'pending') {
      pending.push(r)
      continue
    }
    if (r.status === 'declined') {
      past.push(r)
      continue
    }
    if (r.status === 'completed') {
      past.push(r)
      continue
    }
    if (r.status === 'confirmed') {
      if (isReservationStartInPast(r, now)) {
        past.push(r)
      } else {
        upcoming.push(r)
      }
      continue
    }
  }

  upcoming.sort(sortByDateTimeAsc)
  pending.sort(sortByDateTimeAsc)
  past.sort(sortByDateTimeDesc)
  cancelled.sort(sortByDateTimeDesc)

  return { upcoming, pending, past, cancelled }
}
