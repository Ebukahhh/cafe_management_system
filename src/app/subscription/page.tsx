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
  searchParams: Promise<{ success?: string; edit?: string }>
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
    .neq('status', 'cancelled')
    .limit(1)
    .maybeSingle()

  let editData = null
  if (params.edit) {
    const { data } = await supabase
      .from('subscriptions')
      .select('*, subscription_items(*)')
      .eq('id', params.edit)
      .eq('user_id', user.id)
      .single()
    if (data) {
      editData = data
    }
  }

  const products = await getAvailableProductsForSubscription()

  const lockSetup = !!activeSub && !params.edit

  if (lockSetup) {
    redirect('/profile/subscriptions')
  }

  return (
    <SubscriptionSetupClient
      products={products}
      showSuccess={params.success === '1'}
      lockSetup={false}
      editData={editData}
    />
  )
}
