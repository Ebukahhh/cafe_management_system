import type Stripe from 'stripe'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getStripeServer } from '@/lib/stripe/server'
import type { CartItem } from '@/lib/supabase/types/app.types'
import type { OrderType } from '@/lib/supabase/types/database.types'

export type CheckoutDetailsInput = {
  orderType: OrderType
  pickupTime: string
  fullName: string
  email: string
  phone: string
  note: string
  deliveryAddress: string
  savePaymentMethod: boolean
}

export type CheckoutCartInput = {
  items: CartItem[]
  promoCode: string | null
  loyaltyRedeemed?: number
  requestedDiscountAmount?: number
}

type PersistedCheckoutSnapshot = {
  details: CheckoutDetailsInput
  items: Array<{
    productId: string
    productName: string
    imageUrl: string | null
    quantity: number
    unitPrice: number
    selectedOptions: Record<string, string>
    lineTotal: number
  }>
  pricing: {
    subtotal: number
    deliveryFee: number
    discountAmount: number
    total: number
    currency: string
  }
  promoCode: string | null
  loyaltyRedeemed: number
  scheduledFor: string | null
}

type PaymentMetadata = {
  checkout?: PersistedCheckoutSnapshot
  lastError?: string | null
  stripeCustomerId?: string | null
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
    nameOnCard: string | null
  }
}

function getServiceSupabase() {
  const supabase = createServiceRoleClient()

  if (!supabase) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.')
  }

  return supabase
}

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function toStripeAmount(amount: number) {
  return Math.round(roundCurrency(amount) * 100)
}

function normalizeItems(items: CartItem[]) {
  return items.map((item) => {
    const quantity = Number(item.quantity)
    const unitPrice = roundCurrency(Number(item.unitPrice))
    const lineTotal = roundCurrency(quantity * unitPrice)

    if (!item.productId || !item.productName || !Number.isFinite(quantity) || quantity <= 0) {
      throw new Error('Your cart contains an invalid item.')
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error('Your cart contains an invalid price.')
    }

    return {
      productId: item.productId,
      productName: item.productName,
      imageUrl: item.imageUrl ?? null,
      quantity,
      unitPrice,
      selectedOptions: item.selectedOptions ?? {},
      lineTotal,
    }
  })
}

function calculateDeliveryFee(orderType: OrderType) {
  return orderType === 'delivery' ? 0 : 0
}

function parseScheduledForIso(pickupTime: string) {
  const trimmed = pickupTime.trim()

  if (!trimmed || trimmed.toUpperCase() === 'ASAP') {
    return null
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i)

  if (!match) {
    return null
  }

  const [, rawHour, rawMinute, period] = match
  let hour = Number(rawHour) % 12
  const minute = Number(rawMinute)

  if (period.toLowerCase() === 'pm') {
    hour += 12
  }

  const scheduledFor = new Date()
  scheduledFor.setSeconds(0, 0)
  scheduledFor.setHours(hour, minute, 0, 0)

  return scheduledFor.toISOString()
}

function sanitizeRequestedDiscount(subtotal: number, requestedDiscountAmount?: number) {
  const discount = roundCurrency(Number(requestedDiscountAmount ?? 0))

  if (!Number.isFinite(discount) || discount < 0) {
    return 0
  }

  return Math.min(discount, subtotal)
}

export function buildCheckoutSnapshot(details: CheckoutDetailsInput, cart: CheckoutCartInput) {
  if (!details.fullName.trim()) {
    throw new Error('Full name is required.')
  }

  if (!details.email.trim()) {
    throw new Error('Email is required.')
  }

  if (details.orderType === 'delivery' && !details.deliveryAddress.trim()) {
    throw new Error('Delivery address is required for delivery orders.')
  }

  const items = normalizeItems(cart.items)

  if (items.length === 0) {
    throw new Error('Your cart is empty.')
  }

  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.lineTotal, 0))
  const deliveryFee = calculateDeliveryFee(details.orderType)
  const discountAmount = sanitizeRequestedDiscount(subtotal, cart.requestedDiscountAmount)
  const total = roundCurrency(subtotal + deliveryFee - discountAmount)

  return {
    details: {
      ...details,
      fullName: details.fullName.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      note: details.note.trim(),
      deliveryAddress: details.deliveryAddress.trim(),
    },
    items,
    pricing: {
      subtotal,
      deliveryFee,
      discountAmount,
      total,
      currency: 'USD',
    },
    promoCode: cart.promoCode ?? null,
    loyaltyRedeemed: Number(cart.loyaltyRedeemed ?? 0) || 0,
    scheduledFor: parseScheduledForIso(details.pickupTime),
  } satisfies PersistedCheckoutSnapshot
}

async function ensureStripeCustomer(params: {
  userId: string
  email: string
  fullName: string
}) {
  const supabase = getServiceSupabase()
  const stripe = getStripeServer()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, stripe_customer_id')
    .eq('id', params.userId)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  const existingCustomerId =
    profile && 'stripe_customer_id' in profile ? (profile.stripe_customer_id as string | null) : null

  if (existingCustomerId) {
    return existingCustomerId
  }

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.fullName,
    metadata: {
      supabase_user_id: params.userId,
    },
  })

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id } as never)
    .eq('id', params.userId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  return customer.id
}

async function upsertStripeIntent(params: {
  paymentId: string
  stripeCustomerId: string
  snapshot: PersistedCheckoutSnapshot
  existingProviderRef?: string | null
  receiptEmail: string
}) {
  const stripe = getStripeServer()
  const amount = toStripeAmount(params.snapshot.pricing.total)
  const common = {
    amount,
    currency: params.snapshot.pricing.currency.toLowerCase(),
    customer: params.stripeCustomerId,
    receipt_email: params.receiptEmail,
    automatic_payment_methods: { enabled: true },
    setup_future_usage: params.snapshot.details.savePaymentMethod ? 'off_session' : undefined,
    metadata: {
      local_payment_id: params.paymentId,
      order_type: params.snapshot.details.orderType,
    },
  } satisfies Stripe.PaymentIntentCreateParams

  if (params.existingProviderRef) {
    const existingIntent = await stripe.paymentIntents.retrieve(params.existingProviderRef)

    if (existingIntent.status === 'requires_payment_method' || existingIntent.status === 'requires_confirmation') {
      return stripe.paymentIntents.update(params.existingProviderRef, common)
    }
  }

  return stripe.paymentIntents.create(common)
}

export async function prepareCheckoutPayment(params: {
  userId: string
  details: CheckoutDetailsInput
  cart: CheckoutCartInput
  localPaymentId?: string | null
}) {
  const supabase = getServiceSupabase()
  const snapshot = buildCheckoutSnapshot(params.details, params.cart)
  const stripeCustomerId = await ensureStripeCustomer({
    userId: params.userId,
    email: snapshot.details.email,
    fullName: snapshot.details.fullName,
  })

  let paymentId = params.localPaymentId ?? null
  let providerRef: string | null = null

  if (paymentId) {
    const { data: existingPayment, error: existingError } = await supabase
      .from('payments')
      .select('id, user_id, status, provider_ref')
      .eq('id', paymentId)
      .single()

    if (existingError || !existingPayment || existingPayment.user_id !== params.userId) {
      throw new Error('Checkout payment session not found.')
    }

    if (existingPayment.status !== 'pending') {
      throw new Error('This checkout payment session can no longer be updated.')
    }

    providerRef = existingPayment.provider_ref
  } else {
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: params.userId,
        provider: 'stripe',
        status: 'pending',
        amount: snapshot.pricing.total,
        currency: snapshot.pricing.currency,
        method: 'card',
        metadata: {
          checkout: snapshot,
          stripeCustomerId,
        } satisfies PaymentMetadata,
      })
      .select('id')
      .single()

    if (paymentError || !payment) {
      throw new Error(paymentError?.message ?? 'Could not create a payment record.')
    }

    paymentId = payment.id
  }

  const paymentIntent = await upsertStripeIntent({
    paymentId: paymentId!,
    stripeCustomerId,
    snapshot,
    existingProviderRef: providerRef,
    receiptEmail: snapshot.details.email,
  })

  const { error: updateError } = await supabase
    .from('payments')
    .update({
      amount: snapshot.pricing.total,
      currency: snapshot.pricing.currency,
      provider_ref: paymentIntent.id,
      method: 'card',
      metadata: {
        checkout: snapshot,
        stripeCustomerId,
      } satisfies PaymentMetadata,
    })
    .eq('id', paymentId!)

  if (updateError) {
    throw new Error(updateError.message)
  }

  if (!paymentIntent.client_secret) {
    throw new Error('Stripe did not return a client secret.')
  }

  return {
    localPaymentId: paymentId!,
    clientSecret: paymentIntent.client_secret,
    amount: snapshot.pricing.total,
    currency: snapshot.pricing.currency,
  }
}

async function saveReusablePaymentMethod(params: {
  userId: string
  savePaymentMethod: boolean
  paymentIntent: Stripe.PaymentIntent
}) {
  if (!params.savePaymentMethod) {
    return
  }

  const paymentMethodId =
    typeof params.paymentIntent.payment_method === 'string'
      ? params.paymentIntent.payment_method
      : params.paymentIntent.payment_method?.id

  if (!paymentMethodId) {
    return
  }

  const stripe = getStripeServer()
  const supabase = getServiceSupabase()
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

  if (paymentMethod.type !== 'card' || !paymentMethod.card) {
    return
  }

  const { data: existingDefault } = await supabase
    .from('user_payment_methods')
    .select('id')
    .eq('user_id', params.userId)
    .eq('is_default', true)
    .maybeSingle()

  await supabase.from('user_payment_methods').upsert(
    {
      user_id: params.userId,
      stripe_payment_method_id: paymentMethod.id,
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      exp_month: paymentMethod.card.exp_month,
      exp_year: paymentMethod.card.exp_year,
      name_on_card: paymentMethod.billing_details.name ?? null,
      is_default: existingDefault ? false : true,
    },
    { onConflict: 'stripe_payment_method_id' }
  )
}

export async function finalizeSuccessfulCheckoutPayment(localPaymentId: string, paymentIntent: Stripe.PaymentIntent) {
  const supabase = getServiceSupabase()

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', localPaymentId)
    .single()

  if (paymentError || !payment) {
    throw new Error(paymentError?.message ?? 'Payment record not found.')
  }

  const metadata = (payment.metadata ?? {}) as PaymentMetadata
  const snapshot = metadata.checkout

  if (!snapshot) {
    throw new Error('Checkout snapshot metadata is missing from the payment record.')
  }

  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('payment_id', localPaymentId)
    .maybeSingle()

  let orderId = existingOrder?.id ?? null

  if (!orderId) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: payment.user_id,
        payment_id: localPaymentId,
        status: 'pending',
        order_type: snapshot.details.orderType,
        delivery_address: snapshot.details.deliveryAddress || null,
        special_note: snapshot.details.note || null,
        subtotal: snapshot.pricing.subtotal,
        delivery_fee: snapshot.pricing.deliveryFee,
        discount_amount: snapshot.pricing.discountAmount,
        total: snapshot.pricing.total,
        promo_code: snapshot.promoCode,
        loyalty_redeemed: snapshot.loyaltyRedeemed,
        scheduled_for: snapshot.scheduledFor,
        is_subscription_run: false,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      throw new Error(orderError?.message ?? 'Could not create the order after payment.')
    }

    orderId = order.id

    const { error: itemsError } = await supabase.from('order_items').insert(
      snapshot.items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        selected_options: item.selectedOptions,
        line_total: item.lineTotal,
      }))
    )

    if (itemsError) {
      throw new Error(itemsError.message)
    }
  }

  let cardMetadata = metadata.card
  const paymentMethodId =
    typeof paymentIntent.payment_method === 'string'
      ? paymentIntent.payment_method
      : paymentIntent.payment_method?.id

  if (paymentMethodId) {
    const stripe = getStripeServer()
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

    if (paymentMethod.type === 'card' && paymentMethod.card) {
      cardMetadata = {
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
        nameOnCard: paymentMethod.billing_details.name ?? null,
      }
    }
  }

  await supabase
    .from('payments')
    .update({
      status: 'succeeded',
      provider_ref: paymentIntent.id,
      method: paymentIntent.payment_method_types[0] ?? 'card',
      metadata: {
        ...metadata,
        card: cardMetadata,
      } satisfies PaymentMetadata,
    })
    .eq('id', localPaymentId)

  await saveReusablePaymentMethod({
    userId: payment.user_id,
    savePaymentMethod: snapshot.details.savePaymentMethod,
    paymentIntent,
  })

  return { orderId }
}

export async function markCheckoutPaymentFailed(params: {
  localPaymentId: string
  paymentIntentId: string
  errorMessage: string | null
}) {
  const supabase = getServiceSupabase()

  const { data: payment } = await supabase
    .from('payments')
    .select('metadata')
    .eq('id', params.localPaymentId)
    .maybeSingle()

  const metadata = (payment?.metadata ?? {}) as PaymentMetadata

  await supabase
    .from('payments')
    .update({
      status: 'failed',
      provider_ref: params.paymentIntentId,
      metadata: {
        ...metadata,
        lastError: params.errorMessage,
      } satisfies PaymentMetadata,
    })
    .eq('id', params.localPaymentId)
}
