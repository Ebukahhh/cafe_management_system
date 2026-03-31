/**
 * Admin reservation reads — Server Components only.
 * Uses SUPABASE_SERVICE_ROLE_KEY when set so RLS cannot hide other users' reservations.
 */
import { getSupabaseForAdmin } from '../admin-supabase'
import type { Reservation } from '../types/database.types'

export type AdminReservationGuest = {
  full_name: string | null
  phone: string | null
}

/** Raw embed from PostgREST when using profiles!reservations_user_id_fkey */
type GuestEmbed = AdminReservationGuest | AdminReservationGuest[] | null

function normalizeGuest(embed: GuestEmbed): AdminReservationGuest | null {
  if (!embed) return null
  return Array.isArray(embed) ? embed[0] ?? null : embed
}

export async function getAdminReservationsForDate(
  date: string
): Promise<(Reservation & { guest: AdminReservationGuest | null })[]> {
  const supabase = await getSupabaseForAdmin()

  const { data, error } = await supabase
    .from('reservations')
    .select(
      `
      *,
      guest:profiles!reservations_user_id_fkey (
        full_name,
        phone
      )
    `
    )
    .eq('date', date)
    .order('time_slot', { ascending: true })

  if (error) {
    console.error('Failed to fetch admin reservations:', error.message)
    throw new Error(error.message)
  }

  type Row = Reservation & { guest: GuestEmbed }

  const rows = (data ?? []) as Row[]

  return rows.map((row) => {
    const { guest: rawGuest, ...rest } = row
    return {
      ...rest,
      guest: normalizeGuest(rawGuest),
    }
  })
}

/** All reservations (any date) for admin list / All tab. */
export async function getAdminReservationsAll(): Promise<
  (Reservation & { guest: AdminReservationGuest | null })[]
> {
  const supabase = await getSupabaseForAdmin()

  const { data, error } = await supabase
    .from('reservations')
    .select(
      `
      *,
      guest:profiles!reservations_user_id_fkey (
        full_name,
        phone
      )
    `
    )
    .order('date', { ascending: true })

  if (error) {
    console.error('Failed to fetch admin reservations:', error.message)
    throw new Error(error.message)
  }

  type Row = Reservation & { guest: GuestEmbed }

  const rows = (data ?? []) as Row[]

  const mapped = rows.map((row) => {
    const { guest: rawGuest, ...rest } = row
    return {
      ...rest,
      guest: normalizeGuest(rawGuest),
    }
  })

  mapped.sort((a, b) => a.date.localeCompare(b.date) || a.time_slot.localeCompare(b.time_slot))
  return mapped
}
