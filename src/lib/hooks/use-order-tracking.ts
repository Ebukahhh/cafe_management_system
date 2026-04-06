/**
 * useOrderTracking — Realtime hook for live order status updates
 *
 * Subscribes to Postgres changes on the orders table for a specific order.
 * Based on integration guide Section 7.1.
 */
'use client'

import { useEffect, useState } from 'react'
import type { RealtimePostgresChangesPayload, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'
import { createClient } from '../supabase/client'
import type { OrderStatus } from '../supabase/types/database.types'

export function useOrderTracking(orderId: string | null) {
  const [status, setStatus] = useState<OrderStatus | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!orderId) return

    const supabase = createClient()

    // Fetch initial status
    supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single()
      .then(({ data }: { data: { status: OrderStatus } | null }) => {
        if (data) setStatus((data as unknown as { status: OrderStatus }).status)
      })

    // Subscribe to changes
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload: RealtimePostgresChangesPayload<{ status: OrderStatus }>) => {
          const nextStatus =
            payload.new && typeof payload.new === 'object' && 'status' in payload.new
              ? (payload.new.status as OrderStatus)
              : null

          if (nextStatus) {
            setStatus(nextStatus)
          }
        }
      )
      .subscribe((status: REALTIME_SUBSCRIBE_STATES) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // IMPORTANT: Always unsubscribe when the component unmounts (Rule 5)
    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId])

  return { status, isConnected }
}
