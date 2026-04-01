/**
 * Admin Live Orders — orders with guest profile and line items for the board UI.
 */
import { todayYmdInTimezone, toLocalYmd } from '@/lib/format-datetime'
import { getSupabaseForAdmin } from '../admin-supabase'
import type { OrderStatus, OrderType } from '../types/database.types'

function todayYmd(): string {
  return process.env.CAFE_TIMEZONE && process.env.CAFE_TIMEZONE.length > 0
    ? todayYmdInTimezone(process.env.CAFE_TIMEZONE)
    : toLocalYmd(new Date())
}

function ymdFromIso(iso: string): string {
  const tz = process.env.CAFE_TIMEZONE
  if (tz && tz.length > 0) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(iso))
    const y = parts.find((p) => p.type === 'year')?.value
    const mo = parts.find((p) => p.type === 'month')?.value
    const d = parts.find((p) => p.type === 'day')?.value
    if (y && mo && d) return `${y}-${mo}-${d}`
  }
  return toLocalYmd(new Date(iso))
}

export type AdminOrderLine = {
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
}

export type AdminOrderCard = {
  id: string
  displayId: string
  status: OrderStatus
  order_type: OrderType
  subtotal: number
  total: number
  created_at: string
  updated_at: string
  guest_name: string | null
  guest_phone: string | null
  avatar_url: string | null
  items: AdminOrderLine[]
  items_summary: string
  item_count: number
}

export type AdminOrdersBoardStats = {
  /** Orders today still in pipeline (pending → ready). */
  activePipelineToday: number
  /** Gross revenue from non-cancelled orders placed today. */
  todayRevenue: number
  /** Per-tab counts for badges (Pending = pending + confirmed). */
  tabCounts: {
    pending: number
    preparing: number
    ready: number
    delivered: number
    cancelled: number
  }
  headerDateLine: string
}

function orderDisplayId(id: string): string {
  return `#ORD-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

function summarizeItems(items: AdminOrderLine[]): string {
  if (!items.length) return '—'
  return items
    .slice(0, 4)
    .map((i) => `${i.quantity}× ${i.product_name}`)
    .join(', ')
}

type RawGuest = { full_name: string | null; phone: string | null; avatar_url: string | null } | null

export async function getAdminOrdersBoard(): Promise<{
  orders: AdminOrderCard[]
  stats: AdminOrdersBoardStats
}> {
  const supabase = await getSupabaseForAdmin()

  const { data: raw, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      status,
      order_type,
      subtotal,
      total,
      created_at,
      updated_at,
      guest:profiles!orders_user_id_fkey (full_name, phone, avatar_url),
      order_items (product_name, quantity, unit_price, line_total)
    `
    )
    .order('created_at', { ascending: false })
    .limit(400)

  if (error) {
    console.error('[admin-orders]', error.message)
    throw new Error(error.message)
  }

  const todayY = todayYmd()

  const orders: AdminOrderCard[] = (raw ?? []).map((row: Record<string, unknown>) => {
    const id = row.id as string
    const guest = row.guest as RawGuest | RawGuest[]
    const g = Array.isArray(guest) ? guest[0] : guest
    const oi = (row.order_items ?? []) as {
      product_name: string
      quantity: number
      unit_price: number
      line_total: number
    }[]
    const lines: AdminOrderLine[] = oi.map((i) => ({
      product_name: i.product_name,
      quantity: Number(i.quantity) || 0,
      unit_price: Number(i.unit_price) || 0,
      line_total: Number(i.line_total) || 0,
    }))
    const item_count = lines.reduce((s, i) => s + i.quantity, 0)

    return {
      id,
      displayId: orderDisplayId(id),
      status: row.status as OrderStatus,
      order_type: row.order_type as OrderType,
      subtotal: Number(row.subtotal) || 0,
      total: Number(row.total) || 0,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      guest_name: g?.full_name?.trim() ?? null,
      guest_phone: g?.phone?.trim() ?? null,
      avatar_url: g?.avatar_url ?? null,
      items: lines,
      items_summary: summarizeItems(lines),
      item_count,
    }
  })

  const todayRevenue = orders
    .filter((o) => {
      if (o.status === 'cancelled') return false
      const ymd = ymdFromIso(o.created_at)
      return ymd === todayY
    })
    .reduce((s, o) => s + o.total, 0)

  const activePipelineToday = orders.filter((o) => {
    const ymd = ymdFromIso(o.created_at)
    if (ymd !== todayY) return false
    return ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
  }).length

  const tabCounts = {
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  const headerDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(process.env.CAFE_TIMEZONE ? { timeZone: process.env.CAFE_TIMEZONE } : {}),
  }).format(new Date())

  const stats: AdminOrdersBoardStats = {
    activePipelineToday,
    todayRevenue,
    tabCounts,
    headerDateLine: `${headerDate} — updated just now`,
  }

  return { orders, stats }
}
