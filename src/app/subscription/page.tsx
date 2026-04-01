import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAvailableProductsForSubscription } from '@/lib/supabase/queries/products-server'
import SubscriptionSetupClient from './subscription-setup-client'

export const metadata: Metadata = {
  title: 'Set Up Your Subscription | Jennifer\'s Café',
  description: 'Craft your perfect daily ritual. Set frequency, time, and payment for automatic orders.',
}

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ success?: string }>
}

export default async function SubscriptionSetupPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/subscription')
  }

  const params = await searchParams

  const { data: activeSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (activeSub && params.success !== '1') {
    redirect('/profile')
  }

  const products = await getAvailableProductsForSubscription()

  return (
    <SubscriptionSetupClient
      products={products}
      showSuccess={params.success === '1'}
      lockSetup={!!activeSub && params.success === '1'}
    />
  )
}
