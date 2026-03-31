/**
 * Admin: accept or decline a reservation — updates status, reviewed_by, reviewed_at.
 */
import { createClient } from '../client'
import type { ReservationStatus } from '../types/database.types'

export async function updateReservationReview(
  reservationId: string,
  status: Extract<ReservationStatus, 'confirmed' | 'declined'>,
  reviewerId: string
) {
  const supabase = createClient()
  const reviewedAt = new Date().toISOString()

  const { error } = await supabase
    .from('reservations')
    .update({
      status,
      reviewed_by: reviewerId,
      reviewed_at: reviewedAt,
    })
    .eq('id', reservationId)

  if (error) {
    console.error('Failed to update reservation review:', error.message)
    throw new Error(error.message)
  }
}
