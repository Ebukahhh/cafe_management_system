'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { formatUsd, initialsFromName } from '@/lib/customer-display'
import { updateOrderStatusAction } from './actions'
import type { AdminOrderCard, AdminOrdersBoardStats } from '@/lib/supabase/queries/admin-orders'
import type { OrderType } from '@/lib/supabase/types/database.types'

type TabId = 'All' | 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled'

const TABS: TabId[] = ['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled']

function orderMatchesTab(tab: TabId, o: AdminOrderCard): boolean {
  if (tab === 'All') return true
  if (tab === 'Pending') return o.status === 'pending' || o.status === 'confirmed'
  if (tab === 'Preparing') return o.status === 'preparing'
  if (tab === 'Ready') return o.status === 'ready'
  if (tab === 'Delivered') return o.status === 'delivered'
  if (tab === 'Cancelled') return o.status === 'cancelled'
  return false
}

function tabBadgeCount(tab: TabId, s: AdminOrdersBoardStats['tabCounts']): number | null {
  if (tab === 'Pending') return s.pending
  if (tab === 'Preparing') return s.preparing
  if (tab === 'Ready') return s.ready
  if (tab === 'Delivered') return s.delivered
  if (tab === 'Cancelled') return s.cancelled
  return null
}

function orderTypeLabel(t: OrderType): string {
  if (t === 'pickup') return 'Pickup'
  if (t === 'delivery') return 'Delivery'
  return 'Dine In'
}

function formatShortTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function prepProgressFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) % 97
  return 35 + (h % 60)
}

function badgeClass(tab: TabId): string {
  if (tab === 'Pending') return 'bg-amber-500/20 text-amber-500'
  if (tab === 'Preparing') return 'bg-orange-500/20 text-orange-500'
  if (tab === 'Ready') return 'bg-emerald-500/20 text-emerald-500'
  if (tab === 'Delivered') return 'bg-stone-500/20 text-stone-400'
  if (tab === 'Cancelled') return 'bg-red-500/20 text-red-400'
  return 'bg-surface-container-highest text-on-surface-variant'
}

type Props = {
  initialOrders: AdminOrderCard[]
  stats: AdminOrdersBoardStats
}

export default function AdminOrdersClient({ initialOrders, stats }: Props) {
  const [orders, setOrders] = useState<AdminOrderCard[]>(initialOrders)
  const [activeTab, setActiveTab] = useState<TabId>('All')
  const [selectedId, setSelectedId] = useState<string | null>(initialOrders[0]?.id ?? null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const filtered = useMemo(
    () => orders.filter((o) => orderMatchesTab(activeTab, o)),
    [orders, activeTab]
  )

  useEffect(() => {
    setSelectedId((prev) => {
      const ids = filtered.map((o) => o.id)
      if (prev && ids.includes(prev)) return prev
      return filtered[0]?.id ?? null
    })
  }, [activeTab, filtered])

  const selected = useMemo(
    () => orders.find((o) => o.id === selectedId) ?? null,
    [orders, selectedId]
  )

  const liveStats = useMemo(() => {
    const tabCounts = {
      pending: orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    }

    return {
      ...stats,
      tabCounts,
    }
  }, [orders, stats])

  const newOrdersCount = liveStats.tabCounts.pending

  async function handleAdvance(orderId: string, nextStatus: AdminOrderCard['status']) {
    setActionError(null)
    setBusyId(orderId)
    try {
      await updateOrderStatusAction(orderId, nextStatus)
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: nextStatus,
                updated_at: new Date().toISOString(),
              }
            : order
        )
      )
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update order.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <main className="flex-1 pt-12 pb-20 md:pb-8 pl-4 md:pl-8 pr-4 md:pr-[26rem] transition-all min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-4xl font-headline italic text-on-surface">Live Orders</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <p className="text-xs font-mono text-on-surface-variant/70 tracking-tight">{liveStats.headerDateLine}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline/30 bg-transparent whitespace-nowrap">
              <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Active</span>
              <span className="text-on-surface-variant/40 text-[10px]">·</span>
              <span className="text-sm font-headline font-bold text-on-surface tabular-nums">
                {liveStats.activePipelineToday} orders today
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg amber-glow shadow-lg shadow-primary/10 whitespace-nowrap">
              <span className="text-[10px] font-mono uppercase tracking-widest text-on-primary-container">Total</span>
              <span className="text-on-primary-container/80 text-[10px]">·</span>
              <span className="text-sm font-headline font-bold text-on-primary-container tabular-nums">
                {formatUsd(liveStats.todayRevenue)} revenue
              </span>
            </div>
          </div>
        </div>

        {actionError ? (
          <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {actionError}
          </p>
        ) : null}

        <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-2xl w-max md:w-full min-w-0">
            {TABS.map((tab) => {
              const n = tabBadgeCount(tab, liveStats.tabCounts)
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2 shrink-0 ${
                    activeTab === tab
                      ? 'bg-surface-container-highest text-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {tab}
                  {n != null && n > 0 && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${badgeClass(tab)}`}>{n}</span>
                  )}
                </button>
              )
            })}
            <div className="ml-auto flex items-center gap-2 pr-2 shrink-0">
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">calendar_month</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-on-surface-variant col-span-full py-12 text-center">
              No {activeTab === 'All' ? 'orders' : `${activeTab.toLowerCase()} orders`} to show.
            </p>
          ) : (
            filtered.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                onSelect={() => setSelectedId(o.id)}
                onAdvance={handleAdvance}
                busy={busyId === o.id}
              />
            ))
          )}
        </div>
      </main>

      <aside className="fixed right-0 top-0 bottom-0 w-[24rem] bg-surface-container border-l border-white/5 z-40 hidden md:flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 pt-14">
          <div className="flex items-center justify-between mb-6">
            <button type="button" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <div className="flex items-center gap-2">
              <button type="button" className="text-primary-container hover:text-primary transition-colors">
                <span className="material-symbols-outlined">print</span>
              </button>
              <button type="button" className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          {selected ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container-highest relative shrink-0">
                {selected.avatar_url ? (
                  <Image
                    src={selected.avatar_url}
                    alt={selected.guest_name ?? 'Guest'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
                    {initialsFromName(selected.guest_name)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-headline italic truncate">{selected.guest_name ?? 'Guest'}</h2>
                <p className="text-xs font-mono text-primary uppercase tracking-widest mt-1 truncate">
                  {selected.displayId} • {orderTypeLabel(selected.order_type)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Select an order</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 scrollbar-hide">
          {selected ? (
            <>
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/50 mb-4">Order Items</h3>
                <div className="flex flex-col gap-4">
                  {selected.items.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">No line items</p>
                  ) : (
                    selected.items.map((it, idx) => (
                      <div key={`${it.product_name}-${idx}`} className="flex justify-between items-start gap-2">
                        <div className="flex gap-3 min-w-0">
                          <span className="font-mono text-primary shrink-0">{it.quantity}×</span>
                          <p className="text-sm font-bold truncate">{it.product_name}</p>
                        </div>
                        <span className="text-sm font-mono shrink-0">{formatUsd(it.line_total)}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-headline italic opacity-70">Subtotal</span>
                  <span className="text-xl font-headline font-bold">{formatUsd(selected.subtotal)}</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-2xl p-5 border border-white/5">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/50 mb-2">Status</h3>
                <p className="text-sm font-mono uppercase text-primary">{selected.status}</p>
                {selected.guest_phone ? (
                  <p className="text-xs text-on-surface-variant mt-2">{selected.guest_phone}</p>
                ) : null}
              </div>

              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/50 mb-6">Timeline</h3>
                <div className="flex flex-col gap-6 relative before:content-[''] before:absolute before:left-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/5">
                  <div className="flex gap-6 relative">
                    <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-500/10 z-10 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">Placed</p>
                      <p className="text-xs text-on-surface-variant">{formatShortTime(selected.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 relative">
                    <div className="w-4 h-4 rounded-full bg-surface-container-highest ring-4 ring-white/5 z-10 shrink-0" />
                    <div className="opacity-90">
                      <p className="text-sm font-bold">Last update</p>
                      <p className="text-xs text-on-surface-variant">{formatShortTime(selected.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-on-surface-variant text-center py-8">No order selected</p>
          )}
        </div>

        <div className="p-8 bg-surface-container-high">
          <button
            type="button"
            className="w-full amber-glow text-on-primary-container font-bold py-4 rounded-2xl shadow-xl shadow-amber-900/10 active:scale-[0.98] transition-all opacity-80"
            disabled
          >
            Actions (coming soon)
          </button>
        </div>
      </aside>

      <div className="fixed bottom-24 right-4 z-50 md:hidden">
        {newOrdersCount > 0 && (
          <button
            type="button"
            className="bg-amber-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold animate-bounce"
          >
            <span className="material-symbols-outlined text-sm">notifications_active</span>
            {newOrdersCount} new {newOrdersCount === 1 ? 'order' : 'orders'}
          </button>
        )}
      </div>
    </div>
  )
}

function nextActionForStatus(status: AdminOrderCard['status']): { label: string; next: AdminOrderCard['status'] } | null {
  if (status === 'pending' || status === 'confirmed') return { label: 'Confirm', next: 'preparing' }
  if (status === 'preparing') return { label: 'Mark Ready', next: 'ready' }
  if (status === 'ready') return { label: 'Mark Delivered', next: 'delivered' }
  return null
}

function OrderCard({
  order,
  onSelect,
  onAdvance,
  busy,
}: {
  order: AdminOrderCard
  onSelect: () => void
  onAdvance: (orderId: string, next: AdminOrderCard['status']) => void
  busy: boolean
}) {
  const meta = `${order.displayId} • ${orderTypeLabel(order.order_type)}`
  const name = order.guest_name ?? 'Guest'
  const isPipeline = order.status === 'pending' || order.status === 'confirmed'
  const isPreparing = order.status === 'preparing'
  const isReady = order.status === 'ready'
  const isDelivered = order.status === 'delivered'
  const isCancelled = order.status === 'cancelled'

  if (isDelivered) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="text-left bg-surface-container-low/50 rounded-xl p-3 border-l-4 border-stone-600 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors w-full"
      >
        <div>
          <p className="text-xs font-mono text-stone-500 uppercase">{order.displayId}</p>
          <p className="font-headline text-on-surface text-sm truncate">{name}</p>
        </div>
        <span className="text-xs font-mono text-on-surface-variant shrink-0">{formatUsd(order.total)}</span>
      </button>
    )
  }

  if (isCancelled) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="text-left bg-surface-container-low/50 rounded-xl p-3 border-l-4 border-red-900/60 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors w-full"
      >
        <div>
          <p className="text-xs font-mono text-red-400/80 uppercase">{order.displayId}</p>
          <p className="font-headline text-on-surface text-sm truncate">{name}</p>
        </div>
        <span className="text-xs font-mono text-on-surface-variant shrink-0">{formatUsd(order.total)}</span>
      </button>
    )
  }

  if (isReady) {
    const action = nextActionForStatus(order.status)
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        className="bg-surface-container-low rounded-xl p-4 border-t-4 border-emerald-500 shadow-xl shadow-black/20 cursor-pointer"
      >
        <div className="mb-4 bg-emerald-500/10 text-emerald-400 py-1.5 px-3 rounded-lg text-center text-[10px] font-bold tracking-widest uppercase">
          Ready for Pickup
        </div>
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-emerald-500/80 uppercase block truncate">{meta}</span>
            <h4 className="text-lg font-headline font-bold text-on-surface mt-1 truncate">{name}</h4>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{order.items_summary}</p>
        <div className="flex flex-col gap-2">
          {action ? (
            <button
              type="button"
              className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation()
                void onAdvance(order.id, action.next)
              }}
              disabled={busy}
            >
              {busy ? 'Updating...' : action.label}
            </button>
          ) : null}
          <button type="button" className="w-full py-2 bg-surface-container-highest text-on-surface-variant font-bold text-xs rounded-lg hover:bg-surface-container-high transition-colors">
            Notify Customer
          </button>
        </div>
      </div>
    )
  }

  if (isPreparing) {
    const pct = prepProgressFromId(order.id)
    const action = nextActionForStatus(order.status)
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        className="bg-surface-container-low rounded-xl p-4 border-t-4 border-orange-500 shadow-xl shadow-black/20 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-orange-500/80 uppercase block truncate">{meta}</span>
            <h4 className="text-lg font-headline font-bold text-on-surface mt-1 truncate">{name}</h4>
          </div>
          <div className="flex items-center gap-1 text-orange-500 font-mono text-xs shrink-0">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {formatShortTime(order.updated_at)}
          </div>
        </div>
        <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{order.items_summary}</p>
        <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
          <div className="bg-orange-500 h-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        {action ? (
          <button
            type="button"
            className="mt-4 w-full py-2 bg-orange-500 text-white font-bold text-xs rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation()
              void onAdvance(order.id, action.next)
            }}
            disabled={busy}
          >
            {busy ? 'Updating...' : action.label}
          </button>
        ) : null}
      </div>
    )
  }

  if (isPipeline) {
    const action = nextActionForStatus(order.status)
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        className="bg-surface-container-low rounded-xl p-4 border-t-4 border-amber-500 shadow-xl shadow-black/20 hover:scale-[1.01] transition-transform cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-amber-500/80 uppercase block truncate">{meta}</span>
            <h4 className="text-lg font-headline font-bold text-on-surface mt-1 truncate">{name}</h4>
          </div>
          <span className="bg-surface-container-highest px-2 py-1 rounded text-[10px] font-mono text-on-surface shrink-0">
            {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{order.items_summary}</p>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="font-mono text-primary">{formatUsd(order.total)}</span>
          {action ? (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation()
                void onAdvance(order.id, action.next)
              }}
              disabled={busy}
            >
              {busy ? 'Updating...' : action.label}
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left bg-surface-container-low rounded-xl p-4 border border-white/10 w-full hover:bg-surface-container-high transition-colors"
    >
      <span className="text-[10px] font-mono text-on-surface-variant uppercase">{order.displayId}</span>
      <p className="font-headline font-bold mt-1">{name}</p>
      <p className="text-xs text-on-surface-variant mt-1">{order.status}</p>
    </button>
  )
}
