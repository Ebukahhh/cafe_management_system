/**
 * Update Order Status Mutation — Admin use
 */
import { createClient } from '../client'
import type { OrderStatus } from '../types/database.types'

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Failed to update order status:', error.message)
    throw new Error(error.message)
  }
}
