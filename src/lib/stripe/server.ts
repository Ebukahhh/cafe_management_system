import Stripe from 'stripe'

declare global {
  var __jennifersCafeStripe: Stripe | undefined
}

export function getStripeServer() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable.')
  }

  if (!globalThis.__jennifersCafeStripe) {
    globalThis.__jennifersCafeStripe = new Stripe(secretKey)
  }

  return globalThis.__jennifersCafeStripe
}

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    throw new Error('Missing NEXT_PUBLIC_SITE_URL environment variable.')
  }

  return siteUrl.replace(/\/$/, '')
}
