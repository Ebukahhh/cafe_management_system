'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function togglePauseSubscription(subscriptionId: string, currentStatus: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not signed in')
  }

  // Only allow toggling if active or paused
  if (currentStatus !== 'active' && currentStatus !== 'paused') {
    throw new Error('Cannot pause or resume this subscription.')
  }

  const newStatus = currentStatus === 'active' ? 'paused' : 'active'

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: newStatus })
    .match({ id: subscriptionId, user_id: user.id }) // ensures user ownership

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/profile/subscriptions')
}

export async function cancelSubscription(subscriptionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not signed in')
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .match({ id: subscriptionId, user_id: user.id })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/profile/subscriptions')
}
