'use client'

import { Fragment, useMemo, useState } from 'react'
import Image from 'next/image'
import type { AdminCustomerRow } from '@/lib/supabase/queries/admin-customers'
import type { SubscriptionStatus } from '@/lib/supabase/types/database.types'
import { formatRelativeSubmitted } from '@/lib/format-datetime'
import { formatUsd, initialsFromName } from '@/lib/customer-display'

const FILTERS = ['All', 'Has Subscription', 'Loyalty Member', 'Inactive'] as const
type FilterId = (typeof FILTERS)[number]

function subscriptionLabel(status: SubscriptionStatus | 'none'): string {
  if (status === 'none') return 'None'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function subscriptionBadgeClass(status: SubscriptionStatus | 'none'): string {
  switch (status) {
    case 'active':
      return 'bg-green-950 text-green-400'
    case 'paused':
      return 'bg-amber-950 text-amber-500'
    case 'cancelled':
      return 'bg-red-950 text-red-500'
    case 'completed':
      return 'bg-surface-container-highest text-on-surface/30'
    default:
      return 'bg-surface-container-highest text-on-surface/30'
  }
}

function isInactive(row: AdminCustomerRow): boolean {
  if (!row.lastOrderAt) return row.orderCount === 0
  const days = (Date.now() - new Date(row.lastOrderAt).getTime()) / (86400 * 1000)
  return days > 90
}

function matchesFilter(row: AdminCustomerRow, f: FilterId): boolean {
  if (f === 'All') return true
  if (f === 'Has Subscription') return row.subscriptionStatus === 'active'
  if (f === 'Loyalty Member') return row.loyaltyPoints > 0
  if (f === 'Inactive') return isInactive(row)
  return true
}

function matchesSearch(row: AdminCustomerRow, q: string): boolean {
  if (!q.trim()) return true
  const s = q.trim().toLowerCase()
  const name = row.profile.full_name?.toLowerCase() ?? ''
  const email = row.email?.toLowerCase() ?? ''
  const phone = row.profile.phone?.toLowerCase() ?? ''
  return name.includes(s) || email.includes(s) || phone.includes(s)
}

const LOYALTY_GOAL = 2000

type Props = {
  initialRows: AdminCustomerRow[]
}

export default function CustomersAdminClient({ initialRows }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterId>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const visibleRows = useMemo(() => {
    return initialRows.filter((r) => matchesFilter(r, filter) && matchesSearch(r, search))
  }, [initialRows, filter, search])

  const stats = useMemo(() => {
    const total = initialRows.length
    const activeSubs = initialRows.filter((r) => r.subscriptionStatus === 'active').length
    const totalOrders = initialRows.reduce((s, r) => s + r.orderCount, 0)
    const avgOrders = total > 0 ? (totalOrders / total).toFixed(1) : '0.0'
    return { total, activeSubs, avgOrders }
  }, [initialRows])

  const statCards = [
    { label: 'Total Customers', value: String(stats.total), change: '—', border: 'border-primary/30' },
    { label: 'Active Subscribers', value: String(stats.activeSubs), change: 'Active subs', border: 'border-purple-400/30' },
    { label: 'Avg Orders per Customer', value: stats.avgOrders, change: 'LIFETIME', border: 'border-on-surface/10' },
  ]

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <>
      <header className="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-40 bg-deep-espresso/80 backdrop-blur-xl">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/30 text-sm">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/40 outline-none placeholder:text-on-surface/20 text-on-surface"
            placeholder="Search by name or email..."
          />
        </div>
      </header>

      <section className="max-w-[1280px] mx-auto p-8 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-headline font-bold tracking-tight text-on-surface">Customers</h2>
            <p className="text-on-surface/30 max-w-lg">
              Manage your specialty coffee community, track loyalty progress, and handle subscription tiers.
            </p>
          </div>
          <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl flex-wrap justify-end">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  filter === f ? 'bg-primary text-on-primary' : 'text-on-surface/30 hover:text-on-surface'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((s) => (
            <div key={s.label} className={`bg-surface-container-low p-6 rounded-xl border-l-4 ${s.border}`}>
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30 mb-2">{s.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-headline font-bold text-on-surface">{s.value}</span>
                <span className="text-xs font-bold text-primary">{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container">
                {['Customer', 'Email', 'Orders', 'Total Spent', 'Loyalty Points', 'Subscriptions', 'Last Order', ''].map(
                  (h) => (
                    <th
                      key={h || 'actions'}
                      className={`px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-on-surface/30 ${
                        h === '' ? 'text-right' : h === 'Orders' ? 'text-center' : ''
                      }`}
                    >
                      {h || 'Actions'}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/10">
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-on-surface/40 text-sm">
                    {initialRows.length === 0
                      ? "No profiles yet."
                      : "No customers match your search or filters."}
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
                const { profile } = row
                const name = profile.full_name?.trim() || 'Unnamed'
                const expanded = expandedId === profile.id
                const lastOrderLabel = row.lastOrderAt ? formatRelativeSubmitted(row.lastOrderAt) : '—'
                const avatarUrl = profile.avatar_url?.startsWith('http') ? profile.avatar_url : null

                return (
                  <Fragment key={profile.id}>
                    <tr
                      className={`hover:bg-surface-bright/20 transition-colors cursor-pointer ${
                        expanded ? 'bg-surface-container-highest/20 border-l-4 border-primary' : ''
                      }`}
                      onClick={() => toggleExpand(profile.id)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt=""
                              width={32}
                              height={32}
                              className="rounded-full object-cover w-8 h-8"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-primary shrink-0">
                              {initialsFromName(profile.full_name)}
                            </div>
                          )}
                          <span className="font-bold text-sm">{name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface/30">{row.email ?? '—'}</td>
                      <td className="px-6 py-5 text-sm text-center font-mono">{row.orderCount}</td>
                      <td className="px-6 py-5 text-sm font-mono tracking-tight">{formatUsd(row.totalSpent)}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className="material-symbols-outlined text-sm text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className={`text-sm font-mono ${expanded ? 'font-bold text-primary' : ''}`}>
                            {row.loyaltyPoints.toLocaleString('en-US')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-tight ${subscriptionBadgeClass(
                            row.subscriptionStatus
                          )}`}
                        >
                          {subscriptionLabel(row.subscriptionStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface/30">{lastOrderLabel}</td>
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="text-on-surface/30 hover:text-on-surface cursor-pointer">
                          <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="bg-surface-container-highest/10">
                        <td className="px-12 py-8" colSpan={8}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30">
                                Profile
                              </h4>
                              <dl className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                  <dt className="text-on-surface/30">Phone</dt>
                                  <dd className="font-mono text-on-surface/80">{profile.phone ?? '—'}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-on-surface/30">Role</dt>
                                  <dd className="capitalize">{profile.role}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-on-surface/30">Member since</dt>
                                  <dd className="text-on-surface/60">
                                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            <div className="space-y-8">
                              <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30">
                                    Loyalty Progress
                                  </h4>
                                  <span className="text-xs text-on-surface/30">
                                    <span className="text-primary font-bold">{row.loyaltyPoints.toLocaleString()}</span> /{' '}
                                    {LOYALTY_GOAL.toLocaleString()} pts
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(100, (row.loyaltyPoints / LOYALTY_GOAL) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-4 flex-wrap">
                                {row.email ? (
                                  <a
                                    href={`mailto:${row.email}`}
                                    className="flex-1 min-w-[140px] px-4 py-3 bg-secondary-container text-on-surface rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                  >
                                    <span className="material-symbols-outlined text-sm">mail</span> Contact
                                  </a>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })
              )}
            </tbody>
          </table>
          <div
            className="px-6 py-4 flex items-center justify-between bg-surface-container"
            style={{ borderTop: '1px solid rgba(61,51,39,0.1)' }}
          >
            <span className="text-xs text-on-surface/30">
              Showing {visibleRows.length === 0 ? 0 : 1}-{visibleRows.length} of {visibleRows.length} customers
              {visibleRows.length !== initialRows.length ? ` (filtered from ${initialRows.length})` : ''}
            </span>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-8 right-8 w-16 h-16 amber-glow text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 cursor-pointer"
        aria-label="Add customer"
      >
        <span className="material-symbols-outlined text-3xl">person_add</span>
      </button>
    </>
  )
}
