'use client'

import type { OrderStatus } from '@/lib/supabase/types/database.types'
import {
  formatOrderTypeLabel,
  staffOrderDisplayId,
  summarizeStaffItems,
} from '@/lib/staff/order-display'
import { formatUsd } from '@/lib/customer-display'
import type { StaffOrder } from './staff-portal-context'
import { PrepTimer } from './PrepTimer'

type Column = 'pending' | 'preparing' | 'ready'

export function OrderCard({
  order,
  column,
  highlight,
  onStatusChange,
  busy,
}: {
  order: StaffOrder
  column: Column
  highlight: boolean
  onStatusChange: (next: OrderStatus) => void
  busy: boolean
}) {
  const name = order.guest_name?.trim() || 'Guest'
  const summary = summarizeStaffItems(order.order_items)
  const typeLine = `${formatOrderTypeLabel(order.order_type)} • ${summary}`

  const borderClass =
    column === 'pending'
      ? 'border-l-stone-800'
      : column === 'preparing'
        ? 'border-l-primary'
        : 'border-l-emerald-500'

  return (
    <div
      className={`space-y-4 rounded-2xl border-l-4 bg-[#1A1612] p-5 transition-shadow ${
        highlight ? 'animate-pulse ring-2 ring-primary/60' : ''
      } ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="mb-1 font-mono text-xs text-primary">{staffOrderDisplayId(order.id)}</div>
          <h3 className="text-lg font-bold text-on-surface">{name}</h3>
          <p className="text-[10px] font-mono uppercase text-stone-500">{typeLine}</p>
          <p className="mt-2 font-mono text-sm text-on-surface/80">{formatUsd(order.total)}</p>
        </div>
        {column === 'preparing' ? <PrepTimer startedAtIso={order.updated_at} /> : null}
      </div>

      {column === 'pending' ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onStatusChange('preparing')}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-[#482400] transition-transform hover:scale-[0.99] disabled:opacity-50"
        >
          Start Preparing
        </button>
      ) : null}

      {column === 'preparing' ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onStatusChange('ready')}
          className="amber-glow w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[0.99] disabled:opacity-50"
        >
          Mark as Ready
        </button>
      ) : null}

      {column === 'ready' ? (
        <>
          <div className="rounded-full bg-emerald-500/10 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-emerald-500">
            Ready for pickup
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatusChange('delivered')}
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            Mark as Delivered
          </button>
        </>
      ) : null}
    </div>
  )
}
