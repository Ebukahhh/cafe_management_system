'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function submitOrder(cartData: any, checkoutDetails: any) {
  const supabase = await createClient()

  // 1. Ensure user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to place an order.')
  }

  // 2. Validate cart payload
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    throw new Error('Cart is empty.')
  }

  // 3. Create the Main Order record
  const { subtotal, discount, total } = cartData.totals

  // Extract from checkout details
  const { orderType, pickupTime, note, fullName, phone } = checkoutDetails

  // Combine pickup time and user note into order note
  const finalNote = [
    `Name: ${fullName}`,
    `Phone: ${phone}`,
    `Time: ${pickupTime}`,
    note ? `Note: ${note}` : ''
  ].filter(Boolean).join('\n')

  const { data: orderParams, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      order_type: orderType,
      subtotal: subtotal,
      total: total,
      note: finalNote,
      promo_code: cartData.promoCode || null,
      payment_id: null, // Simulated payment right now
    })
    .select('id')
    .single()

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`)
  }

  const orderId = orderParams.id

  // 4. Create Order Items
  const orderItemsInsert = cartData.items.map((item: any) => ({
    order_id: orderId,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    selected_options: item.selectedOptions,
    line_total: item.lineTotal
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsInsert)

  if (itemsError) {
    // Ideally we would rollback the order here if items fail
    throw new Error(`Failed to save order items: ${itemsError.message}`)
  }

  // Success!
  return { success: true, orderId }
}
