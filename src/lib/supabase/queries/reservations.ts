/**
 * Reservation Queries — All reservation-related database reads
 */
import { createClient } from '../client'
import type { Reservation } from '../types/database.types'

/** Fetch a user's reservations */
export async function getUserReservations(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })

  if (error) {
    console.error('Failed to fetch reservations:', error.message)
    throw new Error(error.message)
  }

  return data as Reservation[]
}

/** Check if a slot has availability (RPC) */
export async function checkSlotAvailability(
  date: string,
  timeSlot: string,
  partySize: number
): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('check_slot_availability', {
    p_date: date,
    p_time_slot: timeSlot,
    p_party_size: partySize,
  })

  if (error) {
    console.error('Failed to check slot availability:', error.message)
    throw new Error(error.message)
  }

  return data as boolean
}
