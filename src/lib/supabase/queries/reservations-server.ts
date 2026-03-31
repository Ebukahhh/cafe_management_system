/**
 * Reservation reads for Server Components (cookie session).
 */
import { createClient } from '../server'
import type { Reservation } from '../types/database.types'

export async function getUserReservationsServer(userId: string): Promise<Reservation[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })

  if (error) {
    console.error('Failed to fetch user reservations:', error.message)
    throw new Error(error.message)
  }

  return (data ?? []) as Reservation[]
}
