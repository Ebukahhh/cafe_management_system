'use client'

import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { OrderStatus, OrderType } from '@/lib/supabase/types/database.types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type StaffTab = 'live' | 'history' | 'report'

export type StaffOrderItem = {
  product_name: string
  quantity: number
  selected_options: Record<string, unknown> | null
}

export type StaffOrder = {
  id: string
  status: OrderStatus
  order_type: OrderType
  total: number
  created_at: string
  updated_at: string
  guest_name: string | null
  order_items: StaffOrderItem[]
}

export type StaffProfile = {
  full_name: string | null
  avatar_url: string | null
  role: string
}

type StaffPortalContextValue = {
  profile: StaffProfile
  activeTab: StaffTab
  setActiveTab: (t: StaffTab) => void
  liveOrders: StaffOrder[]
  liveOrdersLoading: boolean
  liveOrdersError: string | null
  refreshLiveOrders: () => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  /** Orders needing barista action (pending + confirmed). */
  notificationCount: number
  /** All pipeline orders for Live tab badge. */
  activePipelineCount: number
  highlightedOrderIds: Set<string>
}

const StaffPortalContext = createContext<StaffPortalContextValue | null>(null)

function parseGuestName(guest: unknown): string | null {
  if (!guest) return null
  const g = Array.isArray(guest) ? guest[0] : guest
  if (g && typeof g === 'object' && 'full_name' in g) {
    const n = (g as { full_name: string | null }).full_name
    return n?.trim() ?? null
  }
  return null
}

function mapRowToStaffOrder(row: Record<string, unknown>): StaffOrder {
  const oi = (row.order_items ?? []) as StaffOrderItem[]
  return {
    id: row.id as string,
    status: row.status as OrderStatus,
    order_type: row.order_type as OrderType,
    total: Number(row.total) || 0,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    guest_name: parseGuestName(row.guest),
    order_items: oi.map((i) => ({
      product_name: i.product_name,
      quantity: Number(i.quantity) || 0,
      selected_options: i.selected_options ?? null,
    })),
  }
}

const PIPELINE: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready']

export function StaffPortalProvider({
  profile,
  children,
}: {
  profile: StaffProfile
  children: ReactNode
}) {
  const [activeTab, setActiveTab] = useState<StaffTab>('live')
  const [liveOrders, setLiveOrders] = useState<StaffOrder[]>([])
  const [liveOrdersLoading, setLiveOrdersLoading] = useState(true)
  const [liveOrdersError, setLiveOrdersError] = useState<string | null>(null)
  const [highlightedOrderIds, setHighlightedOrderIds] = useState<Set<string>>(() => new Set())
  const highlightTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const supabase = useMemo(() => createClient(), [])

  const refreshLiveOrders = useCallback(async () => {
    setLiveOrdersError(null)
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        status,
        order_type,
        total,
        created_at,
        updated_at,
        guest:profiles!orders_user_id_fkey (full_name),
        order_items (product_name, quantity, selected_options)
      `
      )
      .in('status', PIPELINE)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[staff orders]', error.message)
      setLiveOrdersError(error.message)
      setLiveOrders([])
      return
    }

    const rows = (data ?? []) as Record<string, unknown>[]
    setLiveOrders(rows.map(mapRowToStaffOrder))
  }, [supabase])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLiveOrdersLoading(true)
      await refreshLiveOrders()
      if (!cancelled) setLiveOrdersLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshLiveOrders])

  function flashHighlight(orderId: string) {
    setHighlightedOrderIds((prev) => {
      const next = new Set(prev)
      next.add(orderId)
      return next
    })
    const existing = highlightTimers.current.get(orderId)
    if (existing) clearTimeout(existing)
    const t = setTimeout(() => {
      setHighlightedOrderIds((prev) => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
      highlightTimers.current.delete(orderId)
    }, 4000)
    highlightTimers.current.set(orderId, t)
  }

  useEffect(() => {
    const channel = supabase
      .channel('staff-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload: RealtimePostgresChangesPayload<{ id?: string; status?: OrderStatus }>) => {
          const row = payload.new as { id?: string; status?: OrderStatus }
          if (row?.id && row.status && PIPELINE.includes(row.status)) {
            flashHighlight(row.id)
          }
          void refreshLiveOrders()
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        () => {
          void refreshLiveOrders()
        }
      )
      .subscribe()

    return () => {
      highlightTimers.current.forEach((t) => clearTimeout(t))
      highlightTimers.current.clear()
      void supabase.removeChannel(channel)
    }
  }, [supabase, refreshLiveOrders])

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
      if (error) throw new Error(error.message)
      await refreshLiveOrders()
    },
    [supabase, refreshLiveOrders]
  )

  const notificationCount = useMemo(() => {
    return liveOrders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length
  }, [liveOrders])

  const activePipelineCount = liveOrders.length

  const value: StaffPortalContextValue = {
    profile,
    activeTab,
    setActiveTab,
    liveOrders,
    liveOrdersLoading,
    liveOrdersError,
    refreshLiveOrders,
    updateOrderStatus,
    notificationCount,
    activePipelineCount,
    highlightedOrderIds,
  }

  return <StaffPortalContext.Provider value={value}>{children}</StaffPortalContext.Provider>
}

export function useStaffPortal() {
  const ctx = useContext(StaffPortalContext)
  if (!ctx) throw new Error('useStaffPortal must be used within StaffPortalProvider')
  return ctx
}
