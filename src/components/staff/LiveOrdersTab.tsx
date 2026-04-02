'use client'

import type { OrderStatus } from '@/lib/supabase/types/database.types'
import { useMemo, useState } from 'react'
import { OrderCard } from './OrderCard'
import { useStaffPortal } from './staff-portal-context'

function isPendingColumn(status: OrderStatus): boolean {
  return status === 'pending' || status === 'confirmed'
}

export function LiveOrdersTab() {
  const {
    liveOrders,
    liveOrdersLoading,
    liveOrdersError,
    updateOrderStatus,
    highlightedOrderIds,
  } = useStaffPortal()

  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const { pending, preparing, ready, counts } = useMemo(() => {
    const pending = liveOrders.filter((o) => isPendingColumn(o.status))
    const preparing = liveOrders.filter((o) => o.status === 'preparing')
    const ready = liveOrders.filter((o) => o.status === 'ready')
    return {
      pending,
      preparing,
      ready,
      counts: {
        active: liveOrders.length,
        pending: pending.length,
        preparing: preparing.length,
        ready: ready.length,
      },
    }
  }, [liveOrders])

  async function handleStatus(orderId: string, next: OrderStatus) {
    setActionError(null)
    setBusyId(orderId)
    try {
      await updateOrderStatus(orderId, next)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not update order.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 font-headline text-3xl text-on-surface md:text-4xl">Live Orders</h1>
          <p className="max-w-md text-sm text-stone-400">
            Real-time beverage queue and fulfillment for active barista stations.
          </p>
        </div>
        <div className="flex shrink-0 gap-1 overflow-x-auto rounded-xl bg-surface-container-high p-1">
          <StatChip label="Active" value={counts.active} active />
          <StatChip label="Pending" value={counts.pending} />
          <StatChip label="Preparing" value={counts.preparing} />
          <StatChip label="Ready" value={counts.ready} />
        </div>
      </div>

      {liveOrdersError ? (
        <p className="rounded-lg bg-red-900/20 px-3 py-2 text-sm text-red-300" role="alert">
          {liveOrdersError}
        </p>
      ) : null}
      {actionError ? (
        <p className="rounded-lg bg-red-900/20 px-3 py-2 text-sm text-red-300" role="alert">
          {actionError}
        </p>
      ) : null}

      {liveOrdersLoading ? (
        <p className="text-sm text-stone-500">Loading orders…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <KanbanColumn
            title="Pending"
            dotClass="bg-stone-700"
            titleClass="text-stone-500"
            count={pending.length}
            orders={pending}
            column="pending"
            highlightedOrderIds={highlightedOrderIds}
            busyId={busyId}
            onStatusChange={handleStatus}
          />
          <KanbanColumn
            title="Preparing"
            dotClass="bg-primary animate-pulse"
            titleClass="text-primary"
            count={preparing.length}
            orders={preparing}
            column="preparing"
            highlightedOrderIds={highlightedOrderIds}
            busyId={busyId}
            onStatusChange={handleStatus}
          />
          <KanbanColumn
            title="Ready"
            dotClass="bg-emerald-500"
            titleClass="text-emerald-500"
            count={ready.length}
            orders={ready}
            column="ready"
            highlightedOrderIds={highlightedOrderIds}
            busyId={busyId}
            onStatusChange={handleStatus}
          />
        </div>
      )}
    </div>
  )
}

function StatChip({
  label,
  value,
  active,
}: {
  label: string
  value: number
  active?: boolean
}) {
  return (
    <div
      className={`min-w-[100px] rounded-lg px-6 py-2 text-center ${
        active ? 'bg-primary text-[#482400]' : 'text-stone-400'
      }`}
    >
      <div className={`font-headline text-xl font-bold ${active ? '' : 'font-normal'}`}>{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-tighter">{label}</div>
    </div>
  )
}

function KanbanColumn({
  title,
  dotClass,
  titleClass,
  count,
  orders,
  column,
  highlightedOrderIds,
  busyId,
  onStatusChange,
}: {
  title: string
  dotClass: string
  titleClass: string
  count: number
  orders: import('./staff-portal-context').StaffOrder[]
  column: 'pending' | 'preparing' | 'ready'
  highlightedOrderIds: Set<string>
  busyId: string | null
  onStatusChange: (id: string, next: OrderStatus) => void
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${titleClass}`}>
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          {title}
        </h2>
        <span className="font-mono text-[10px] text-stone-600">
          {count} {count === 1 ? 'ITEM' : 'ITEMS'}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-stone-600">
            None
          </p>
        ) : (
          orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              column={column}
              highlight={highlightedOrderIds.has(o.id)}
              busy={busyId === o.id}
              onStatusChange={(next) => onStatusChange(o.id, next)}
            />
          ))
        )}
      </div>
    </section>
  )
}
