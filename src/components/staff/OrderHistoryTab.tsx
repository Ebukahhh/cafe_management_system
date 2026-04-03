'use client'

import { createClient } from '@/lib/supabase/client'
import { formatUsd } from '@/lib/customer-display'
import {
  formatOrderTypeLabel,
  staffOrderDisplayId,
  summarizeStaffItems,
  startEndOfDayFromYmd,
} from '@/lib/staff/order-display'
import type { OrderStatus, OrderType } from '@/lib/supabase/types/database.types'
import { toLocalYmd } from '@/lib/format-datetime'
import { useCallback, useEffect, useMemo, useState } from 'react'

type HistoryRow = {
  id: string
  status: OrderStatus
  order_type: OrderType
  total: number
  created_at: string
  updated_at: string
  guest_name: string | null
  order_items: { product_name: string; quantity: number }[]
}

type TypeFilter = 'all' | OrderType

export function OrderHistoryTab() {
  const supabase = useMemo(() => createClient(), [])
  const [dateYmd, setDateYmd] = useState(() => toLocalYmd(new Date()))
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [rows, setRows] = useState<HistoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    const { start, end } = startEndOfDayFromYmd(dateYmd)
    const { data, error: qErr } = await supabase
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
        order_items (product_name, quantity)
      `
      )
      .in('status', ['delivered', 'cancelled'])
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false })

    if (qErr) {
      setError(qErr.message)
      setRows([])
      setLoading(false)
      return
    }

    const mapped: HistoryRow[] = (data ?? []).map((raw: Record<string, unknown>) => {
      const guest = raw.guest as { full_name: string | null } | { full_name: string | null }[] | null
      const g = Array.isArray(guest) ? guest[0] : guest
      const oi = (raw.order_items ?? []) as { product_name: string; quantity: number }[]
      return {
        id: raw.id as string,
        status: raw.status as OrderStatus,
        order_type: raw.order_type as OrderType,
        total: Number(raw.total) || 0,
        created_at: raw.created_at as string,
        updated_at: raw.updated_at as string,
        guest_name: g?.full_name?.trim() ?? null,
        order_items: oi,
      }
    })
    setRows(mapped)
    setLoading(false)
  }, [supabase, dateYmd])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (typeFilter !== 'all' && r.order_type !== typeFilter) return false
      if (!q) return true
      const idPart = r.id.replace(/-/g, '').toLowerCase()
      const display = staffOrderDisplayId(r.id).toLowerCase()
      const name = (r.guest_name ?? '').toLowerCase()
      return idPart.includes(q) || display.includes(q) || name.includes(q)
    })
  }, [rows, search, typeFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 font-headline text-3xl text-on-surface md:text-4xl">Order History</h1>
        <p className="max-w-lg text-sm text-stone-400">Read-only record of completed and cancelled orders.</p>
      </div>

      <div className="flex flex-col flex-wrap gap-4 md:flex-row md:items-end">
        <label className="flex flex-col gap-1 text-xs font-label uppercase tracking-wider text-stone-500">
          Date
          <input
            type="date"
            value={dateYmd}
            max={toLocalYmd(new Date())}
            onChange={(e) => setDateYmd(e.target.value)}
            className="rounded-xl border border-outline-variant/30 bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>
        <label className="min-w-[200px] flex flex-col gap-1 text-xs font-label uppercase tracking-wider text-stone-500">
          Search
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order # or name…"
            className="rounded-xl border border-outline-variant/30 bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>
        <div className="flex flex-col gap-1 text-xs font-label uppercase tracking-wider text-stone-500">
          Order type
          <div className="flex flex-wrap gap-2">
            {(['all', 'pickup', 'delivery', 'dine_in'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  typeFilter === t
                    ? 'bg-primary text-[#482400]'
                    : 'bg-surface-container-high text-stone-400 hover:text-on-surface'
                }`}
              >
                {t === 'all' ? 'All' : formatOrderTypeLabel(t)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-900/20 px-3 py-2 text-sm text-red-300">{error}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#1A1612]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Placed</th>
              <th className="px-4 py-3 font-medium">Completed</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-stone-500">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-stone-500">
                  No orders for this filter.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/5 text-on-surface/90">
                  <td className="px-4 py-3 font-mono text-primary">{staffOrderDisplayId(r.id)}</td>
                  <td className="px-4 py-3">{r.guest_name || 'Guest'}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-xs text-stone-400">
                    {summarizeStaffItems(r.order_items)}
                  </td>
                  <td className="px-4 py-3">{formatOrderTypeLabel(r.order_type)}</td>
                  <td className="px-4 py-3 font-mono">{formatUsd(r.total)}</td>
                  <td className="px-4 py-3 text-xs text-stone-400">{formatDt(r.created_at)}</td>
                  <td className="px-4 py-3 text-xs text-stone-400">{formatDt(r.updated_at)}</td>
                  <td className="px-4 py-3 capitalize">{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatDt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}
