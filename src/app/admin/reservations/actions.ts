'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseForAdmin } from '@/lib/supabase/admin-supabase'
import type { ReservationStatus } from '@/lib/supabase/types/database.types'

export async function reviewReservationAction(
  reservationId: string,
  status: Extract<ReservationStatus, 'confirmed' | 'declined'>
) {
  const supabaseAuth = await createClient()
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser()
  if (!user) throw new Error('Not signed in')
  if (user.user_metadata?.role !== 'admin') throw new Error('Not allowed')

  const supabase = await getSupabaseForAdmin()
  const reviewedAt = new Date().toISOString()

  const { error } = await supabase
    .from('reservations')
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: reviewedAt,
    })
    .eq('id', reservationId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/reservations')
}
