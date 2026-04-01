/**
 * Admin Subscriptions — list subscriptions with items, guest profile, stats, and recent runs.
 * Server-only; uses service role when configured.
 */
import { initialsFromName } from '@/lib/customer-display'
import { formatTimeSlotDisplay } from '@/lib/format-datetime'
import { getSupabaseForAdmin } from '../admin-supabase'
import { createServiceRoleClient } from '../service-role'
import type {
  Subscription,
  SubscriptionFrequency,
  SubscriptionItem,
  SubscriptionRun,
  SubscriptionRunStatus,
} from '../types/database.types'

type Guest = { full_name: string | null; phone: string | null }

type SubRow = Subscription & {
  subscription_items: SubscriptionItem[] | null
  guest: Guest | null
}

async function fetchAuthEmailsByUserId(): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const service = createServiceRoleClient()
  if (!service) return map
  let page = 1
  const perPage = 1000
  for (;;) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage })
    if (error) break
    const users = data?.users ?? []
    for (const u of users) map.set(u.id, u.email ?? '')
    if (users.length < perPage) break
    page += 1
  }
  return map
}

function scheduleLabel(freq: SubscriptionFrequency): string {
  switch (freq) {
    case 'daily':
      return 'Daily'
    case 'weekdays':
      return 'Weekdays'
    case 'specific_days':
      return 'Specific days'
    case 'weekly':
      return 'Weekly'
    default:
      return freq
  }
}

function itemsSummaryLine(items: SubscriptionItem[]): string {
  if (!items.length) return '—'
  if (items.length === 1) {
    const i = items[0]
    return `${i.quantity}× ${i.product_name}`
  }
  return `${items.length} items`
}

function nextRunDisplay(sub: Subscription): { text: string; overdue: boolean } {
  if (!sub.next_run_at) return { text: '—', overdue: false }
  const t = new Date(sub.next_run_at).getTime()
  const overdue = sub.status === 'active' && t < Date.now()
  const text = overdue
    ? 'Overdue'
    : new Date(sub.next_run_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
  return { text, overdue }
}

function statusDisplay(sub: Subscription, overdue: boolean): { label: string; failed: boolean } {
  if (sub.status === 'paused') return { label: 'Paused', failed: false }
  if (sub.status === 'cancelled') return { label: 'Cancelled', failed: false }
  if (sub.status === 'completed') return { label: 'Completed', failed: false }
  if (sub.status === 'active' && (sub.failed_count > 0 || overdue)) {
    return { label: 'Needs attention', failed: true }
  }
  if (sub.status === 'active') return { label: 'Active', failed: false }
  return { label: sub.status, failed: false }
}

export type AdminSubscriptionTableRow = {
  id: string
  initials: string
  name: string
  email: string | null
  itemsLine: string
  schedule: string
  timeHint: string
  next: string
  overdue: boolean
  statusLabel: string
  statusFailed: boolean
  failedCount: number
}

export type AdminSubscriptionRunLogEntry = {
  id: string
  runAt: string
  runAtDisplay: string
  subscriptionId: string
  status: SubscriptionRunStatus
  message: string
  accentClass: string
}

export type AdminSubscriptionsDashboard = {
  activeCount: number
  revenueThisMonth: number
  failedSubscriptionsCount: number
  tableRows: AdminSubscriptionTableRow[]
  runLog: AdminSubscriptionRunLogEntry[]
}

export async function getAdminSubscriptionsDashboard(): Promise<AdminSubscriptionsDashboard> {
  const supabase = await getSupabaseForAdmin()

  const { data: subData, error: subErr } = await supabase
    .from('subscriptions')
    .select(
      `*,
      subscription_items (*),
      guest:profiles!subscriptions_user_id_fkey (full_name, phone)`
    )
    .order('created_at', { ascending: false })

  if (subErr) {
    console.error('admin-subscriptions:', subErr.message)
    throw new Error(subErr.message)
  }

  const rows = (subData ?? []) as SubRow[]
  const emails = await fetchAuthEmailsByUserId()

  const activeCount = rows.filter((r) => r.status === 'active').length
  const failedSubscriptionsCount = rows.filter((r) => r.failed_count > 0).length

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { data: runRows } = await supabase
    .from('subscription_runs')
    .select('id, subscription_id, order_id, status, error_message, run_at')
    .gte('run_at', monthStart)
    .order('run_at', { ascending: false })

  const runs = (runRows ?? []) as SubscriptionRun[]

  const successOrderIds = [...new Set(runs.filter((r) => r.status === 'success' && r.order_id).map((r) => r.order_id as string))]
  let revenueThisMonth = 0
  if (successOrderIds.length > 0) {
    const { data: orders } = await supabase.from('orders').select('id, total').in('id', successOrderIds)
    for (const o of orders ?? []) {
      revenueThisMonth += Number(o.total) || 0
    }
  }

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const { data: recentRuns } = await supabase
    .from('subscription_runs')
    .select('id, subscription_id, order_id, status, error_message, run_at')
    .gte('run_at', weekAgo)
    .order('run_at', { ascending: false })
    .limit(50)

  const recent = (recentRuns ?? []) as SubscriptionRun[]

  const runLog: AdminSubscriptionRunLogEntry[] = recent.map((r) => {
    const d = new Date(r.run_at)
    const runAtDisplay = d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
    let message = ''
    if (r.status === 'success') {
      message = r.order_id ? 'Payment recorded; order linked.' : 'Run completed successfully.'
    } else if (r.status === 'failed') {
      message = r.error_message || 'Run failed.'
    } else {
      message = 'Run skipped.'
    }
    const accentClass =
      r.status === 'failed' ? 'bg-red-400' : r.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
    return {
      id: r.id,
      runAt: r.run_at,
      runAtDisplay,
      subscriptionId: r.subscription_id,
      status: r.status,
      message,
      accentClass,
    }
  })

  const tableRows: AdminSubscriptionTableRow[] = rows.map((r) => {
    const items = r.subscription_items ?? []
    const guest = r.guest
    const name = guest?.full_name?.trim() || 'Customer'
    const email = emails.get(r.user_id) ?? null
    const { text: next, overdue } = nextRunDisplay(r)
    const st = statusDisplay(r, overdue)

    const initials = name === 'Customer' ? '?' : initialsFromName(guest?.full_name)

    return {
      id: r.id,
      initials,
      name,
      email,
      itemsLine: itemsSummaryLine(items),
      schedule: scheduleLabel(r.frequency),
      timeHint: formatTimeSlotDisplay(r.preferred_time),
      next,
      overdue,
      statusLabel: st.label,
      statusFailed: st.failed,
      failedCount: r.failed_count,
    }
  })

  return {
    activeCount,
    revenueThisMonth,
    failedSubscriptionsCount,
    tableRows,
    runLog,
  }
}
