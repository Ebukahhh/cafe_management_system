'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseForAdmin } from '@/lib/supabase/admin-supabase'
import type { OrderStatus } from '@/lib/supabase/types/database.types'

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  const supabaseAuth = await createClient()
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser()

  if (!user) throw new Error('Not signed in')
  if (user.user_metadata?.role !== 'admin') throw new Error('Not allowed')

  const supabase = await getSupabaseForAdmin()

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/orders')
  revalidatePath('/orders')
}
