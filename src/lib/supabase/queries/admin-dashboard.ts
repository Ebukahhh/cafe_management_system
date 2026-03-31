/**
 * Admin dashboard aggregates — Server Components only.
 */
import { getSupabaseForAdmin } from '../admin-supabase'
import { todayYmdInTimezone, toLocalYmd } from '@/lib/format-datetime'
import type { OrderStatus } from '../types/database.types'

function startEndOfDayFromYmd(ymd: string): { start: Date; end: Date } {
  const [y, m, d] = ymd.split('-').map(Number)
  const start = new Date(y, m - 1, d, 0, 0, 0, 0)
  const end = new Date(y, m - 1, d, 23, 59, 59, 999)
  return { start, end }
}

function todayYmdForDashboard(): string {
  return process.env.CAFE_TIMEZONE && process.env.CAFE_TIMEZONE.length > 0
    ? todayYmdInTimezone(process.env.CAFE_TIMEZONE)
    : toLocalYmd(new Date())
}

export type DashboardRecentOrder = {
  id: string
  displayId: string
  customerName: string
  itemsSummary: string
  total: number
  createdAt: string
  status: OrderStatus
}

export type AdminDashboardData = {
  todayYmd: string
  todayRevenue: number
  /** Orders not yet delivered (kitchen pipeline). */
  activeOrdersCount: number
  awaitingConfirmationCount: number
  preparingCount: number
  reservationsTodayCount: number
  reservationsPendingTodayCount: number
  activeSubscribersCount: number
  customerRoleCount: number
  activePromotionsCount: number
  recentOrders: DashboardRecentOrder[]
}

function summarizeOrderItems(
  items: { product_name: string; quantity: number }[] | null | undefined
): string {
  if (!items?.length) return '—'
  return items
    .slice(0, 4)
    .map((i) => `${i.product_name}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`)
    .join(', ')
}

function orderDisplayId(id: string): string {
  return `#ORD-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = await getSupabaseForAdmin()
  const todayYmd = todayYmdForDashboard()
  const { start, end } = startEndOfDayFromYmd(todayYmd)

  const { data: todayOrderRows } = await supabase
    .from('orders')
    .select('total, status, created_at')
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())

  const todayRevenue = (todayOrderRows ?? [])
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0)

  const { data: pipelineRows } = await supabase
    .from('orders')
    .select('status')
    .in('status', ['pending', 'confirmed', 'preparing', 'ready'])

  const activeOrdersCount = pipelineRows?.length ?? 0
  const awaitingConfirmationCount = (pipelineRows ?? []).filter((o) => o.status === 'pending').length
  const preparingCount = (pipelineRows ?? []).filter((o) => o.status === 'preparing').length

  const { data: resToday } = await supabase.from('reservations').select('status').eq('date', todayYmd)

  const reservationsTodayCount = resToday?.length ?? 0
  const reservationsPendingTodayCount = (resToday ?? []).filter((r) => r.status === 'pending').length

  const { count: subActive } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: custCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer')

  const { count: promoCount } = await supabase
    .from('promotions')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  let recentOrders: DashboardRecentOrder[] = []

  const { data: recentRaw, error: recentErr } = await supabase
    .from('orders')
    .select(
      `
      id,
      total,
      status,
      created_at,
      guest:profiles!orders_user_id_fkey (full_name),
      order_items (product_name, quantity)
    `
    )
    .order('created_at', { ascending: false })
    .limit(5)

  if (!recentErr && recentRaw?.length) {
    type RawRow = {
      id: string
      total: number
      status: OrderStatus
      created_at: string
      guest: { full_name: string | null } | { full_name: string | null }[] | null
      order_items: { product_name: string; quantity: number }[] | null
    }
    recentOrders = (recentRaw as RawRow[]).map((row) => {
      const g = row.guest
      const guestName = Array.isArray(g) ? g[0]?.full_name : g?.full_name
      return {
        id: row.id,
        displayId: orderDisplayId(row.id),
        customerName: guestName?.trim() || 'Guest',
        itemsSummary: summarizeOrderItems(row.order_items ?? undefined),
        total: Number(row.total) || 0,
        createdAt: row.created_at,
        status: row.status,
      }
    })
  } else {
    if (recentErr) {
      console.warn('[admin-dashboard] recent orders join failed, retrying minimal select:', recentErr.message)
    }
    const { data: minimal } = await supabase
      .from('orders')
      .select('id, total, status, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(5)

    if (minimal?.length) {
      const ids = [...new Set(minimal.map((o) => o.user_id))]
      const { data: profs } = await supabase.from('profiles').select('id, full_name').in('id', ids)
      const nameById = new Map((profs ?? []).map((p) => [p.id, p.full_name]))
      recentOrders = minimal.map((o) => ({
        id: o.id,
        displayId: orderDisplayId(o.id),
        customerName: nameById.get(o.user_id)?.trim() || 'Guest',
        itemsSummary: '—',
        total: Number(o.total) || 0,
        createdAt: o.created_at,
        status: o.status as OrderStatus,
      }))
    }
  }

  return {
    todayYmd,
    todayRevenue,
    activeOrdersCount,
    awaitingConfirmationCount,
    preparingCount,
    reservationsTodayCount,
    reservationsPendingTodayCount,
    activeSubscribersCount: subActive ?? 0,
    customerRoleCount: custCount ?? 0,
    activePromotionsCount: promoCount ?? 0,
    recentOrders,
  }
}
