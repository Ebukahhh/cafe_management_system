'use client'

import { createClient } from '@/lib/supabase/client'
import { formatUsd } from '@/lib/customer-display'
import { formatLongDateFromYmd, toLocalYmd } from '@/lib/format-datetime'
import {
  formatOrderTypeLabel,
  staffOrderDisplayId,
  summarizeStaffItems,
} from '@/lib/staff/order-display'
import type { OrderStatus, OrderType } from '@/lib/supabase/types/database.types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useStaffPortal } from './staff-portal-context'

type OrderRow = {
  id: string
  total: number
  status: OrderStatus
  order_type: OrderType
  created_at: string
  order_items: { product_name: string; quantity: number }[] | null
}

type LogRow = {
  id: string
  displayId: string
  guest_name: string
  total: number
  created_at: string
  items: string
}

export function DailyReportTab() {
  const { profile } = useStaffPortal()
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [logRows, setLogRows] = useState<LogRow[]>([])

  const todayYmd = toLocalYmd(new Date())

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    const start = new Date()
    const [y, m, d] = todayYmd.split('-').map(Number)
    start.setFullYear(y, m - 1, d)
    start.setHours(0, 0, 0, 0)
    const now = new Date()

    const [ordersRes, logRes] = await Promise.all([
      supabase
        .from('orders')
        .select(
          `
          id,
          total,
          status,
          order_type,
          created_at,
          order_items (product_name, quantity)
        `
        )
        .gte('created_at', start.toISOString())
        .lte('created_at', now.toISOString()),
      supabase
        .from('orders')
        .select(
          `
          id,
          total,
          created_at,
          guest:profiles!orders_user_id_fkey (full_name),
          order_items (product_name, quantity)
        `
        )
        .eq('status', 'delivered')
        .gte('created_at', start.toISOString())
        .lte('created_at', now.toISOString())
        .order('created_at', { ascending: false }),
    ])

    if (ordersRes.error) {
      setError(ordersRes.error.message)
      setOrders([])
      setLogRows([])
      setLoading(false)
      return
    }

    const raw = (ordersRes.data ?? []) as Record<string, unknown>[]
    setOrders(
      raw.map((r) => ({
        id: r.id as string,
        total: Number(r.total) || 0,
        status: r.status as OrderStatus,
        order_type: r.order_type as OrderType,
        created_at: r.created_at as string,
        order_items: (r.order_items ?? null) as OrderRow['order_items'],
      }))
    )

    if (logRes.error) {
      setError(logRes.error.message)
    } else {
      const lr = (logRes.data ?? []) as Record<string, unknown>[]
      setLogRows(
        lr.map((r) => {
          const guest = r.guest as { full_name: string | null } | { full_name: string | null }[] | null
          const g = Array.isArray(guest) ? guest[0] : guest
          const oi = (r.order_items ?? []) as { product_name: string; quantity: number }[]
          return {
            id: r.id as string,
            displayId: staffOrderDisplayId(r.id as string),
            guest_name: g?.full_name?.trim() || 'Guest',
            total: Number(r.total) || 0,
            created_at: r.created_at as string,
            items: summarizeStaffItems(oi),
          }
        })
      )
    }

    setGeneratedAt(new Date())
    setLoading(false)
  }, [supabase, todayYmd])

  useEffect(() => {
    void load()
  }, [load])

  const stats = useMemo(() => computeStats(orders), [orders])

  const topItems = useMemo(() => topFiveItems(orders), [orders])

  const timeline = useMemo(() => hourTimeline(orders.filter((o) => o.status === 'delivered')), [orders])

  const typeBars = useMemo(() => typeBreakdown(orders.filter((o) => o.status === 'delivered')), [orders])

  function handlePrint() {
    window.print()
  }

  return (
    <div id="staff-daily-report-print" className="space-y-8">
      <header className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <h2 className="font-headline text-3xl font-bold italic text-on-surface md:text-4xl">
            Daily Shift Report
          </h2>
          <p className="mt-2 flex items-center gap-2 text-stone-400">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            {formatLongDateFromYmd(todayYmd)}
          </p>
          {generatedAt ? (
            <p className="mt-1 text-xs text-stone-500">
              Generated {generatedAt.toLocaleString()} · {profile.full_name?.trim() || 'Staff'}
            </p>
          ) : null}
        </div>
        <div className="staff-no-print flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-outline-variant px-6 py-2.5 text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">print</span>
            Print Report
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="amber-glow flex items-center gap-2 rounded-xl px-8 py-2.5 font-semibold text-white shadow-xl transition-opacity hover:opacity-90"
          >
            <span className="material-symbols-outlined">download</span>
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-xl border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            Refresh
          </button>
        </div>
      </header>

      {error ? <p className="rounded-lg bg-red-900/20 px-3 py-2 text-sm text-red-300">{error}</p> : null}

      {loading ? (
        <p className="text-stone-500">Loading report…</p>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-6">
            <StatBox
              className="md:col-span-2"
              accent="border-l-primary"
              label="Total Orders"
              value={String(stats.deliveredCount)}
            />
            <StatBox
              className="md:col-span-2"
              accent="border-l-[#a37dff]"
              label="Total Revenue"
              value={formatUsd(stats.revenue)}
            />
            <StatBox label="Delivered" value={String(stats.deliveredCount)} valueClass="text-emerald-500" />
            <StatBox label="Cancelled" value={String(stats.cancelledCount)} valueClass="text-red-500" />
            <StatBox className="md:col-span-3" label="Avg Order Value" value={formatUsd(stats.avgOrder)} />
            <StatBox
              className="md:col-span-3"
              label="Peak Hour"
              value={stats.busiestHourLabel}
              icon="query_stats"
              valueSize="lg"
            />
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <section className="rounded-xl bg-surface-container-high p-8 lg:col-span-4">
              <h3 className="mb-6 font-headline text-xl font-semibold">Orders by Type</h3>
              <div className="space-y-6">
                {typeBars.map((row) => (
                  <div key={row.key}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">{row.label}</span>
                      <span className="font-mono">{row.pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
                      <div
                        className={`h-full ${row.barClass}`}
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-high p-8 lg:col-span-8">
              <h3 className="mb-6 font-headline text-xl font-semibold">Top Items Today</h3>
              <ol className="space-y-4">
                {topItems.map((row, i) => (
                  <li key={row.name} className="flex items-center gap-4">
                    <span className="w-6 font-mono text-sm text-stone-500">{String(i + 1).padStart(2, '0')}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 text-sm">
                        <span className="truncate font-medium">{row.name}</span>
                        <span className="shrink-0 font-mono text-stone-400">{row.qty} sold</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-800">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="rounded-xl bg-surface-container-low p-6">
            <h3 className="mb-4 font-headline text-lg font-semibold">Orders per Hour</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeline} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fill: '#a8a29e', fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: '#a8a29e', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1f160a', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: '#f5ecd7' }}
                  />
                  <Bar dataKey="count" fill="#C8864A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <details className="group rounded-xl border border-white/10 bg-[#1A1612]">
            <summary className="cursor-pointer list-none px-6 py-4 font-headline text-lg font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                Completed orders log
                <span className="material-symbols-outlined text-stone-500 transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </span>
            </summary>
            <div className="overflow-x-auto border-t border-white/10 px-4 pb-4">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-stone-500">
                    <th className="py-2 pr-4">Order</th>
                    <th className="py-2 pr-4">Guest</th>
                    <th className="py-2 pr-4">Items</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logRows.map((r) => (
                    <tr key={r.id} className="border-t border-white/5 text-on-surface/90">
                      <td className="py-2 pr-4 font-mono text-primary">{r.displayId}</td>
                      <td className="py-2 pr-4">{r.guest_name}</td>
                      <td className="max-w-[240px] truncate py-2 pr-4 text-xs text-stone-400">{r.items}</td>
                      <td className="py-2 pr-4 font-mono">{formatUsd(r.total)}</td>
                      <td className="py-2 text-xs text-stone-400">
                        {new Date(r.created_at).toLocaleTimeString(undefined, {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logRows.length === 0 ? (
                <p className="py-6 text-center text-sm text-stone-500">No completed orders yet today.</p>
              ) : null}
            </div>
          </details>
        </>
      )}
    </div>
  )
}

function StatBox({
  label,
  value,
  className = '',
  accent = '',
  valueClass = '',
  icon,
  valueSize = 'xl',
}: {
  label: string
  value: string
  className?: string
  accent?: string
  valueClass?: string
  icon?: string
  valueSize?: 'xl' | 'lg'
}) {
  const sizeClass =
    valueSize === 'lg' ? 'text-2xl font-bold md:text-3xl' : 'text-3xl font-bold md:text-4xl'
  return (
    <div
      className={`rounded-xl bg-surface-container-low p-6 ${accent ? `border-l-4 ${accent}` : ''} ${className}`}
    >
      <div className="font-mono text-xs uppercase tracking-tighter text-stone-400">{label}</div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className={`min-w-0 ${sizeClass} text-on-surface ${valueClass}`}>{value}</div>
        {icon ? (
          <span className="material-symbols-outlined shrink-0 text-4xl text-primary/50">{icon}</span>
        ) : null}
      </div>
    </div>
  )
}

function computeStats(orders: OrderRow[]) {
  const delivered = orders.filter((o) => o.status === 'delivered')
  const cancelled = orders.filter((o) => o.status === 'cancelled')
  const revenue = delivered.reduce((s, o) => s + o.total, 0)
  const deliveredCount = delivered.length
  const avgOrder = deliveredCount > 0 ? revenue / deliveredCount : 0

  const hourBuckets = new Map<number, number>()
  for (const o of delivered) {
    const h = new Date(o.created_at).getHours()
    hourBuckets.set(h, (hourBuckets.get(h) ?? 0) + 1)
  }
  let maxH = 8
  let maxC = 0
  for (const [h, c] of hourBuckets) {
    if (c > maxC) {
      maxC = c
      maxH = h
    }
  }
  const start = new Date()
  start.setHours(maxH, 0, 0, 0)
  const end = new Date(start)
  end.setHours(end.getHours() + 1)
  const busiestHourLabel =
    maxC === 0
      ? '—'
      : `${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} – ${end.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`

  return {
    deliveredCount,
    cancelledCount: cancelled.length,
    revenue,
    avgOrder,
    busiestHourLabel,
  }
}

function topFiveItems(orders: OrderRow[]): { name: string; qty: number; pct: number }[] {
  const delivered = orders.filter((o) => o.status === 'delivered')
  const map = new Map<string, number>()
  for (const o of delivered) {
    for (const line of o.order_items ?? []) {
      const q = Number(line.quantity) || 0
      map.set(line.product_name, (map.get(line.product_name) ?? 0) + q)
    }
  }
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxQty = sorted[0]?.[1] ?? 1
  return sorted.map(([name, qty]) => ({
    name,
    qty,
    pct: Math.round((qty / maxQty) * 100),
  }))
}

function hourTimeline(delivered: OrderRow[]): { label: string; count: number }[] {
  const buckets = new Map<number, number>()
  for (let h = 8; h <= 20; h++) buckets.set(h, 0)
  for (const o of delivered) {
    const h = new Date(o.created_at).getHours()
    buckets.set(h, (buckets.get(h) ?? 0) + 1)
  }
  const out: { label: string; count: number }[] = []
  for (const h of [...buckets.keys()].sort((a, b) => a - b)) {
    const d = new Date()
    d.setHours(h, 0, 0, 0)
    out.push({
      label: d.toLocaleTimeString(undefined, { hour: 'numeric' }),
      count: buckets.get(h) ?? 0,
    })
  }
  return out
}

function typeBreakdown(delivered: OrderRow[]): {
  key: string
  label: string
  pct: number
  barClass: string
}[] {
  const n = delivered.length
  if (n === 0) {
    return [
      { key: 'pickup', label: 'Pickup', pct: 0, barClass: 'bg-primary' },
      { key: 'delivery', label: 'Delivery', pct: 0, barClass: 'bg-blue-500' },
      { key: 'dine_in', label: 'Dine In', pct: 0, barClass: 'bg-emerald-500' },
    ]
  }
  const counts: Record<OrderType, number> = {
    pickup: 0,
    delivery: 0,
    dine_in: 0,
  }
  for (const o of delivered) {
    counts[o.order_type] = (counts[o.order_type] ?? 0) + 1
  }
  return (['pickup', 'delivery', 'dine_in'] as const).map((key) => ({
    key,
    label: formatOrderTypeLabel(key),
    pct: Math.round(((counts[key] ?? 0) / n) * 100),
    barClass: key === 'pickup' ? 'bg-primary' : key === 'delivery' ? 'bg-blue-500' : 'bg-emerald-500',
  }))
}
