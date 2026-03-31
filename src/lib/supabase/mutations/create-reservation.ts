/**
 * Create Reservation Mutation
 *
 * Checks slot availability first, then inserts the reservation.
 */
import { createClient } from '../client'
import { checkSlotAvailability } from '../queries/reservations'

interface CreateReservationInput {
  userId: string
  date: string
  timeSlot: string
  partySize: number
  note?: string
}

export async function createReservation(input: CreateReservationInput) {
  // Step 1: Check availability when the RPC exists; otherwise insert still succeeds
  try {
    const isAvailable = await checkSlotAvailability(
      input.date,
      input.timeSlot,
      input.partySize
    )
    if (!isAvailable) {
      throw new Error('This slot is fully booked. Please choose another time.')
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('fully booked')) throw e
    console.warn('[createReservation] Availability check skipped:', msg)
  }

  // Step 2: Insert reservation
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      user_id: input.userId,
      date: input.date,
      time_slot: input.timeSlot,
      party_size: input.partySize,
      status: 'pending',
      note: input.note ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create reservation:', error.message)
    throw new Error(error.message)
  }

  return data
}
