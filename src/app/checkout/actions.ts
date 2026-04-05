'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  finalizeSuccessfulCheckoutPayment,
  markCheckoutPaymentFailed,
  prepareCheckoutPayment,
  type CheckoutCartInput,
  type CheckoutDetailsInput,
} from '@/lib/payments/checkout'
import { getStripeServer } from '@/lib/stripe/server'

export async function prepareCheckoutPaymentAction(input: {
  details: CheckoutDetailsInput
  cart: CheckoutCartInput
  localPaymentId?: string | null
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to place an order.')
  }

  return prepareCheckoutPayment({
    userId: user.id,
    details: input.details,
    cart: input.cart,
    localPaymentId: input.localPaymentId ?? null,
  })
}

export async function finalizeCheckoutPaymentAction(input: {
  localPaymentId: string
  paymentIntentId: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to finalize this payment.')
  }

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('id, user_id, provider_ref')
    .eq('id', input.localPaymentId)
    .single()

  if (paymentError || !payment || payment.user_id !== user.id) {
    throw new Error('Payment record not found.')
  }

  if (payment.provider_ref !== input.paymentIntentId) {
    throw new Error('Payment reference mismatch.')
  }

  const stripe = getStripeServer()
  const paymentIntent = await stripe.paymentIntents.retrieve(input.paymentIntentId)

  if (paymentIntent.status === 'succeeded') {
    const result = await finalizeSuccessfulCheckoutPayment(input.localPaymentId, paymentIntent)
    revalidatePath('/orders')
    revalidatePath('/order-confirmation')
    return {
      status: 'succeeded' as const,
      orderId: result.orderId,
    }
  }

  if (paymentIntent.status === 'processing' || paymentIntent.status === 'requires_capture') {
    return {
      status: 'processing' as const,
      orderId: null,
    }
  }

  await markCheckoutPaymentFailed({
    localPaymentId: input.localPaymentId,
    paymentIntentId: input.paymentIntentId,
    errorMessage: paymentIntent.last_payment_error?.message ?? 'Payment was not successful.',
  })

  return {
    status: 'failed' as const,
    orderId: null,
  }
}
