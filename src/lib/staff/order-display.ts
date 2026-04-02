import type { OrderType } from '@/lib/supabase/types/database.types'

/** Short order ref for staff cards (e.g. `#A1B2`). */
export function staffOrderDisplayId(id: string): string {
  const compact = id.replace(/-/g, '')
  return `#${compact.slice(0, 4).toUpperCase()}`
}

export function summarizeStaffItems(
  items: { product_name: string; quantity: number }[]
): string {
  if (!items.length) return '—'
  return items
    .slice(0, 4)
    .map((i) => `${i.quantity}× ${i.product_name}`)
    .join(', ')
}

export function formatOrderTypeLabel(t: OrderType): string {
  const map: Record<OrderType, string> = {
    pickup: 'Pickup',
    delivery: 'Delivery',
    dine_in: 'Dine In',
  }
  return map[t] ?? t
}

export function startEndOfDayFromYmd(ymd: string): { start: Date; end: Date } {
  const [y, m, d] = ymd.split('-').map(Number)
  const start = new Date(y, m - 1, d, 0, 0, 0, 0)
  const end = new Date(y, m - 1, d, 23, 59, 59, 999)
  return { start, end }
}
