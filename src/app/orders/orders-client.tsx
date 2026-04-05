'use client'

import Link from "next/link";
import { useState } from "react";
import type { OrderWithItems } from "@/lib/supabase/types/app.types";
import type { OrderStatus } from "@/lib/supabase/types/database.types";

/* ── Icons ── */
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
}
function ChevronRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
}
function CafeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}
function PulsingDot() {
  return (
    <span className="relative flex h-3 w-3 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
    </span>
  );
}

/* ── Helpers ── */
const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready'];
const PAST_STATUSES: OrderStatus[] = ['delivered', 'cancelled'];

function isActive(status: OrderStatus) { return ACTIVE_STATUSES.includes(status); }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatCurrency(amount: number) {
  return `$${(amount / 100).toFixed(2)}`;
}

function orderDisplayId(id: string) {
  return `#${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

function summariseItems(order: OrderWithItems) {
  return order.order_items
    .slice(0, 3)
    .map(i => `${i.quantity}× ${i.product_name}`)
    .join(', ') + (order.order_items.length > 3 ? '…' : '');
}

function statusLabel(status: OrderStatus): { label: string; className: string } {
  switch (status) {
    case 'pending':   return { label: 'Pending',   className: 'bg-yellow-900/30 text-yellow-400' };
    case 'confirmed': return { label: 'Confirmed', className: 'bg-blue-900/30 text-blue-400' };
    case 'preparing': return { label: 'Preparing', className: 'bg-primary/20 text-primary' };
    case 'ready':     return { label: 'Ready!',    className: 'bg-green-900/30 text-green-400' };
    case 'delivered': return { label: 'Delivered', className: 'bg-surface-bright text-on-surface/40' };
    case 'cancelled': return { label: 'Cancelled', className: 'bg-red-900/20 text-red-400' };
    default:          return { label: status,      className: 'bg-surface-bright text-on-surface/40' };
  }
}

type FilterKey = 'All' | 'Active' | 'Completed' | 'Cancelled';
const FILTERS: FilterKey[] = ['All', 'Active', 'Completed', 'Cancelled'];

const PAGE_SIZE = 10;

/* ── Main Component ── */
export default function OrdersClient({ orders }: { orders: OrderWithItems[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [page, setPage] = useState(1);

  const activeOrders = orders.filter(o => isActive(o.status));

  // Filtered past orders (non-active)
  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'All')       return true;
    if (activeFilter === 'Active')    return isActive(o.status);
    if (activeFilter === 'Completed') return o.status === 'delivered';
    if (activeFilter === 'Cancelled') return o.status === 'cancelled';
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginated = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(f: FilterKey) {
    setActiveFilter(f);
    setPage(1);
  }

  return (
    <>
      {/* ── Editorial Header + Filter Tabs ── */}
      <section className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
        <div className="max-w-2xl">
          <h1 className="font-headline text-5xl md:text-7xl font-light italic mb-3 text-on-surface">
            Your Orders
          </h1>
          <p className="text-on-surface/40 text-lg max-w-md leading-relaxed">
            From freshly roasted beans to artisan pastries — track your current cravings and revisit past favorites.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Order filters">
          {FILTERS.map(f => {
            const count = f === 'Active' ? activeOrders.length : undefined;
            const isSelected = f === activeFilter;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleFilterChange(f)}
                className={`relative px-5 py-2 whitespace-nowrap transition-all cursor-pointer font-medium text-sm ${
                  isSelected
                    ? 'text-primary font-bold'
                    : 'text-on-surface/30 hover:text-on-surface/60'
                }`}
                style={isSelected ? { borderBottom: '2px solid var(--color-primary, #C8864A)' } : undefined}
              >
                {f}
                {count !== undefined && count > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-deep-espresso text-[9px] font-bold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Active Orders ── */}
      {(activeFilter === 'All' || activeFilter === 'Active') && activeOrders.length > 0 && (
        <section className="mb-14 md:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="font-headline text-xl italic text-primary flex items-center gap-2">
              <PulsingDot /> In Progress
            </h2>
            <div className="h-px w-10 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map(order => {
              const badge = statusLabel(order.status);
              return (
                <Link
                  key={order.id}
                  href={`/order-tracking`}
                  className="group bg-surface-container-low hover:bg-surface-container rounded-2xl p-5 transition-all flex flex-col gap-4 ring-1 ring-primary/10 hover:ring-primary/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {order.status === 'preparing' || order.status === 'ready' ? <PulsingDot /> : null}
                      <span className="font-mono text-sm text-on-surface/60">{orderDisplayId(order.id)}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-on-surface font-medium leading-snug">{summariseItems(order)}</p>
                  <div className="flex items-center justify-between text-xs text-on-surface/30">
                    <span>{formatDate(order.created_at)}</span>
                    <span className="font-mono font-bold text-primary text-sm">{formatCurrency(order.total)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Order History Table ── */}
      <section>
        {activeFilter !== 'Active' && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl italic text-on-surface">
              {activeFilter === 'All' ? 'All Orders' : activeFilter}
            </h2>
            {filteredOrders.length > 0 && (
              <div className="text-on-surface/30 font-mono text-xs">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {paginated.length === 0 ? (
          /* ── Empty state ── */
          <div className="bg-surface-container-lowest rounded-2xl flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 text-on-surface/20">
              <CafeIcon />
            </div>
            <h4 className="font-headline text-xl text-on-surface/60 italic mb-2">
              {activeFilter === 'Active' ? 'No active orders right now.' : 'No orders yet.'}
            </h4>
            <p className="text-on-surface/30 text-sm mb-6 max-w-xs">
              {activeFilter === 'Active'
                ? 'Once you place an order, you can track it live here.'
                : 'Ready to start your café ritual?'}
            </p>
            <Link href="/menu" className="text-primary font-bold hover:underline underline-offset-4">
              Browse Menu →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map(order => {
              const badge = statusLabel(order.status);
              return (
                <div
                  key={order.id}
                  className="group bg-surface-container-low hover:bg-surface-container-high rounded-2xl p-4 md:p-5 transition-all flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                >
                  {/* Grid of metadata */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-center">
                    <div>
                      <p className="text-[10px] font-mono text-on-surface/20 uppercase tracking-tighter mb-0.5">Date</p>
                      <p className="text-on-surface font-medium text-sm">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-on-surface/20 uppercase tracking-tighter mb-0.5">Order</p>
                      <p className="text-on-surface font-mono text-sm">{orderDisplayId(order.id)}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[10px] font-mono text-on-surface/20 uppercase tracking-tighter mb-0.5">Items</p>
                      <p className="text-on-surface text-sm truncate">{summariseItems(order)}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-[10px] font-mono text-on-surface/20 uppercase tracking-tighter mb-0.5">Total</p>
                      <p className="text-primary font-bold font-mono">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                    <div className="flex gap-2">
                      {isActive(order.status) ? (
                        <Link
                          href="/order-tracking"
                          className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all"
                        >
                          Track
                        </Link>
                      ) : (
                        <>
                          <button
                            aria-label="View order"
                            className="p-2 text-on-surface/30 hover:text-primary transition-colors cursor-pointer"
                          >
                            <EyeIcon />
                          </button>
                          <button className="bg-surface-variant text-on-surface px-4 py-2 rounded-xl text-xs font-bold hover:bg-surface-bright transition-all cursor-pointer">
                            Reorder
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface/30 hover:bg-surface-container disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-bold transition-all cursor-pointer ${
                    p === page
                      ? 'bg-primary text-deep-espresso'
                      : 'text-on-surface/30 hover:bg-surface-container hover:text-on-surface'
                  }`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface/30 hover:bg-surface-container disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
