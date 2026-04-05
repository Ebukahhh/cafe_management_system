import { finalizeSuccessfulCheckoutPayment, markCheckoutPaymentFailed } from '@/lib/payments/checkout'
import { getStripeServer } from '@/lib/stripe/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return new Response('Missing Stripe webhook secret.', { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing Stripe signature header.', { status: 400 })
  }

  const body = await request.text()
  const stripe = getStripeServer()

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature.'
    return new Response(message, { status: 400 })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      const localPaymentId = paymentIntent.metadata.local_payment_id

      if (!localPaymentId) {
        return new Response('Missing local payment reference.', { status: 400 })
      }

      await finalizeSuccessfulCheckoutPayment(localPaymentId, paymentIntent)
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object
      const localPaymentId = paymentIntent.metadata.local_payment_id

      if (!localPaymentId) {
        return new Response('Missing local payment reference.', { status: 400 })
      }

      await markCheckoutPaymentFailed({
        localPaymentId,
        paymentIntentId: paymentIntent.id,
        errorMessage: paymentIntent.last_payment_error?.message ?? 'Payment failed.',
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed.'
    return new Response(message, { status: 500 })
  }

  return Response.json({ received: true })
}
