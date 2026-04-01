/**
 * Admin Analytics — KPIs, trends, order mix, top products, heatmap (last 7 days vs prior 7).
 * Server-only; uses service role when configured.
 */
import { addDaysYmd, todayYmdInTimezone, toLocalYmd } from '@/lib/format-datetime'
import { getSupabaseForAdmin } from '../admin-supabase'
import type { OrderStatus, OrderType } from '../types/database.types'

const HEAT_COLORS = ['#231a0f', '#4a4640', '#c8864a', '#ffb779'] as const

function todayYmdForAnalytics(): string {
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
    const m = parts.find((p) => p.type === 'month')?.value
    const d = parts.find((p) => p.type === 'day')?.value
    if (y && m && d) return `${y}-${m}-${d}`
  }
  return toLocalYmd(new Date(iso))
}

function dowMondayFirst(iso: string): number {
  const tz = process.env.CAFE_TIMEZONE
  const d = new Date(iso)
  const short = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    ...(tz && tz.length > 0 ? { timeZone: tz } : {}),
  })
    .format(d)
    .slice(0, 3)
  const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }
  return map[short] ?? 0
}

function hourInCafeTz(iso: string): number {
  const tz = process.env.CAFE_TIMEZONE
  const d = new Date(iso)
  if (tz && tz.length > 0) {
    const h = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false,
    }).format(d)
    const n = parseInt(h, 10)
    return Number.isNaN(n) ? d.getHours() : n % 24
  }
  return d.getHours()
}

function pctChange(current: number, previous: number): number | null {
  if (previous <= 0 && current <= 0) return null
  if (previous <= 0) return 100
  return Math.round(((current - previous) / previous) * 1000) / 10
}

/** SVG path for sparkline, viewBox 0 0 100 40 */
export function buildSparkPath(values: number[]): string {
  if (values.length === 0) return 'M0 35 Q25 35 50 35 T100 35'
  const w = 100
  const h = 40
  const max = Math.max(...values, 1e-9)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1e-9)
  const step = values.length > 1 ? w / (values.length - 1) : w
  return values
    .map((v, i) => {
      const x = i * step
      const y = h - 4 - ((v - min) / range) * (h - 8)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

/** Revenue area chart paths for viewBox 0 0 700 300 */
export function buildRevenueChartPaths(daily: number[], maxValue?: number): { line: string; area: string } {
  const w = 700
  const h = 300
  const pad = 40
  const chartH = h - pad
  const max = maxValue ?? Math.max(...daily, 1e-9)
  const min = 0
  const range = max - min || 1
  const n = daily.length
  const step = n > 1 ? (w - 20) / (n - 1) : w - 20
  const points = daily.map((v, i) => {
    const x = 10 + i * step
    const y = pad + chartH - ((v - min) / range) * (chartH - 20)
    return { x, y }
  })
  if (!points.length) {
    const flat = `M0 ${h} L${w} ${h} L${w} 0 L0 0 Z`
    return { line: `M0 ${h - 20} L${w} ${h - 20}`, area: flat }
  }
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${points[points.length - 1].x.toFixed(1)} ${h} L${points[0].x.toFixed(1)} ${h} Z`
  return { line, area }
}

function heatColor(t: number): string {
  const x = Math.max(0, Math.min(1, t))
  const i = Math.min(HEAT_COLORS.length - 2, Math.floor(x * (HEAT_COLORS.length - 1)))
  const f = x * (HEAT_COLORS.length - 1) - i
  const a = HEAT_COLORS[i]
  const b = HEAT_COLORS[i + 1]
  return mixHex(a, b, f)
}

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ra = (pa >> 16) & 255
  const ga = (pa >> 8) & 255
  const ba = pa & 255
  const rb = (pb >> 16) & 255
  const gb = (pb >> 8) & 255
  const bb = pb & 255
  const r = Math.round(ra + (rb - ra) * t)
  const g = Math.round(ga + (gb - ga) * t)
  const bl = Math.round(ba + (bb - ba) * t)
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`
}

export type AdminAnalyticsKpi = {
  label: string
  valueDisplay: string
  changePct: number | null
  sparkPath: string
  colorClass: string
}

export type AdminAnalyticsData = {
  periodLabel: string
  kpis: AdminAnalyticsKpi[]
  revenueByDay: { ymd: string; dayLabel: string; revenue: number }[]
  prevRevenueByDay: number[]
  revenueLinePath: string
  revenueAreaPath: string
  prevRevenueLinePath: string
  totalOrdersPeriod: number
  ordersByType: { pickup: number; delivery: number; dine_in: number }
  topProducts: { name: string; count: number; barPct: number }[]
  heatmapCells: string[]
  heatmapMax: number
  insightText: string
}

type OrderRow = {
  created_at: string
  total: number
  status: OrderStatus
  order_type: OrderType
  order_items: { product_name: string; quantity: number }[] | null
}

export async function getAdminAnalyticsData(): Promise<AdminAnalyticsData> {
  const supabase = await getSupabaseForAdmin()
  const today = todayYmdForAnalytics()

  const current7: string[] = []
  for (let i = 6; i >= 0; i--) {
    current7.push(addDaysYmd(today, -i))
  }
  const prev7: string[] = []
  for (let i = 13; i >= 7; i--) {
    prev7.push(addDaysYmd(today, -i))
  }

  const currentSet = new Set(current7)
  const prevSet = new Set(prev7)

  const since = new Date(addDaysYmd(today, -20) + 'T00:00:00').getTime()
  const { data: orderRows, error } = await supabase
    .from('orders')
    .select('created_at, total, status, order_type, order_items(product_name, quantity)')
    .gte('created_at', new Date(since).toISOString())

  if (error) {
    console.error('[admin-analytics] orders:', error.message)
    throw new Error(error.message)
  }

  const orders = (orderRows ?? []) as OrderRow[]

  const revenueByYmd = (set: Set<string>) => {
    const m = new Map<string, number>()
    for (const y of set) m.set(y, 0)
    for (const o of orders) {
      if (o.status === 'cancelled') continue
      const ymd = ymdFromIso(o.created_at)
      if (!set.has(ymd)) continue
      m.set(ymd, (m.get(ymd) ?? 0) + (Number(o.total) || 0))
    }
    return m
  }

  const ordersByYmd = (set: Set<string>) => {
    const m = new Map<string, number>()
    for (const y of set) m.set(y, 0)
    for (const o of orders) {
      if (o.status === 'cancelled') continue
      const ymd = ymdFromIso(o.created_at)
      if (!set.has(ymd)) continue
      m.set(ymd, (m.get(ymd) ?? 0) + 1)
    }
    return m
  }

  const revCur = revenueByYmd(currentSet)
  const revPrev = revenueByYmd(prevSet)
  const ordCur = ordersByYmd(currentSet)
  const ordPrev = ordersByYmd(prevSet)

  const dailyRevenue = current7.map((ymd) => revCur.get(ymd) ?? 0)
  const prevDailyRevenue = prev7.map((ymd) => revPrev.get(ymd) ?? 0)
  const dailyOrders = current7.map((ymd) => ordCur.get(ymd) ?? 0)
  const prevDailyOrders = prev7.map((ymd) => ordPrev.get(ymd) ?? 0)

  const dailyAov = current7.map((ymd, i) => {
    const r = dailyRevenue[i]
    const c = dailyOrders[i]
    return c > 0 ? r / c : 0
  })
  const prevAov = prev7.map((ymd, i) => {
    const r = prevDailyRevenue[i]
    const c = prevDailyOrders[i]
    return c > 0 ? r / c : 0
  })

  let totalRevCur = 0
  let totalRevPrev = 0
  let totalOrdCur = 0
  let totalOrdPrev = 0
  for (const v of dailyRevenue) totalRevCur += v
  for (const v of prevDailyRevenue) totalRevPrev += v
  for (const v of dailyOrders) totalOrdCur += v
  for (const v of prevDailyOrders) totalOrdPrev += v

  const aovCur = totalOrdCur > 0 ? totalRevCur / totalOrdCur : 0
  const aovPrev = totalOrdPrev > 0 ? totalRevPrev / totalOrdPrev : 0

  const { data: runRows } = await supabase
    .from('subscription_runs')
    .select('run_at, status, order_id')
    .eq('status', 'success')
    .not('order_id', 'is', null)
    .gte('run_at', new Date(since).toISOString())

  const runs = runRows ?? []
  const orderIds = [...new Set(runs.map((r) => r.order_id as string).filter(Boolean))]
  let orderTotals = new Map<string, number>()
  if (orderIds.length > 0) {
    const { data: ords } = await supabase.from('orders').select('id, total').in('id', orderIds)
    orderTotals = new Map((ords ?? []).map((o) => [o.id as string, Number(o.total) || 0]))
  }

  let subRevCur = 0
  let subRevPrev = 0
  const subDailyCur = current7.map(() => 0)
  const subDailyPrev = prev7.map(() => 0)

  for (const r of runs) {
    const ymd = ymdFromIso(r.run_at as string)
    const amt = orderTotals.get(r.order_id as string) ?? 0
    const idxC = current7.indexOf(ymd)
    if (idxC >= 0) {
      subRevCur += amt
      subDailyCur[idxC] += amt
    }
    const idxP = prev7.indexOf(ymd)
    if (idxP >= 0) {
      subRevPrev += amt
      subDailyPrev[idxP] += amt
    }
  }

  const chartMax = Math.max(...dailyRevenue, ...prevDailyRevenue, 1e-9)
  const { line: revenueLinePath, area: revenueAreaPath } = buildRevenueChartPaths(dailyRevenue, chartMax)
  const prevPaths = buildRevenueChartPaths(prevDailyRevenue, chartMax)
  const prevRevenueLinePath = prevPaths.line

  const productQty = new Map<string, number>()
  for (const o of orders) {
    if (o.status === 'cancelled') continue
    const ymd = ymdFromIso(o.created_at)
    if (!currentSet.has(ymd)) continue
    for (const it of o.order_items ?? []) {
      const name = it.product_name?.trim() || 'Item'
      productQty.set(name, (productQty.get(name) ?? 0) + (Number(it.quantity) || 0))
    }
  }

  const topSorted = [...productQty.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxQty = topSorted[0]?.[1] ?? 1
  const topProducts = topSorted.map(([name, count]) => ({
    name,
    count,
    barPct: Math.round((count / maxQty) * 100),
  }))

  const typeCount = { pickup: 0, delivery: 0, dine_in: 0 }
  for (const o of orders) {
    if (o.status === 'cancelled') continue
    const ymd = ymdFromIso(o.created_at)
    if (!currentSet.has(ymd)) continue
    const t = o.order_type
    if (t === 'pickup') typeCount.pickup += 1
    else if (t === 'delivery') typeCount.delivery += 1
    else if (t === 'dine_in') typeCount.dine_in += 1
  }

  const heatRaw = new Array(84).fill(0)
  for (const o of orders) {
    if (o.status === 'cancelled') continue
    const ymd = ymdFromIso(o.created_at)
    if (!currentSet.has(ymd)) continue
    const row = dowMondayFirst(o.created_at)
    let hour = hourInCafeTz(o.created_at)
    let col = hour - 6
    if (col < 0) col = 0
    if (col > 11) col = 11
    const idx = row * 12 + col
    if (idx >= 0 && idx < 84) heatRaw[idx] += 1
  }

  const heatmapMax = Math.max(...heatRaw, 1)
  const heatmapCells = heatRaw.map((v) => heatColor(v / heatmapMax))

  let peakNote = ''
  let maxCell = 0
  let maxIdx = 0
  for (let i = 0; i < heatRaw.length; i++) {
    if (heatRaw[i] > maxCell) {
      maxCell = heatRaw[i]
      maxIdx = i
    }
  }
  if (maxCell > 0) {
    const pr = Math.floor(maxIdx / 12)
    const pc = maxIdx % 12
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const hStart = 6 + pc
    peakNote = `Peak activity in the last 7 days: ${dayNames[pr] ?? '—'} around ${hStart}:00–${hStart + 1}:00 (${maxCell} orders).`
  } else {
    peakNote = 'Not enough order data in the last 7 days to highlight peak hours.'
  }

  const revenueByDay = current7.map((ymd, i) => {
    const [y, m, d] = ymd.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    const dayLabel = dt.toLocaleDateString('en-US', { weekday: 'short' })
    return { ymd, dayLabel, revenue: dailyRevenue[i] }
  })

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const kpis: AdminAnalyticsKpi[] = [
    {
      label: 'Total Revenue',
      valueDisplay: formatMoney(totalRevCur),
      changePct: pctChange(totalRevCur, totalRevPrev),
      sparkPath: buildSparkPath(dailyRevenue),
      colorClass: 'text-primary',
    },
    {
      label: 'Total Orders',
      valueDisplay: String(totalOrdCur),
      changePct: pctChange(totalOrdCur, totalOrdPrev),
      sparkPath: buildSparkPath(dailyOrders.map(Number)),
      colorClass: 'text-on-surface',
    },
    {
      label: 'Avg. Order Value',
      valueDisplay: formatMoney(aovCur),
      changePct: pctChange(aovCur, aovPrev),
      sparkPath: buildSparkPath(dailyAov),
      colorClass: 'text-on-surface',
    },
    {
      label: 'Subscription Rev.',
      valueDisplay: formatMoney(subRevCur),
      changePct: pctChange(subRevCur, subRevPrev),
      sparkPath: buildSparkPath(subDailyCur),
      colorClass: 'text-on-surface',
    },
  ]

  return {
    periodLabel: 'Last 7 days',
    kpis,
    revenueByDay,
    prevRevenueByDay: prevDailyRevenue,
    revenueLinePath,
    revenueAreaPath,
    prevRevenueLinePath,
    totalOrdersPeriod: totalOrdCur,
    ordersByType: typeCount,
    topProducts,
    heatmapCells,
    heatmapMax,
    insightText: peakNote,
  }
}
