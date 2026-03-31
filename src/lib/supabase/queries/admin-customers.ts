/**
 * Admin Customers — aggregate profiles with orders, loyalty, subscriptions, and auth emails.
 * Server-only; uses service role for DB and optional auth.admin.listUsers for emails.
 */
import { createServiceRoleClient } from '../service-role'
import { getSupabaseForAdmin } from '../admin-supabase'
import type { Profile, SubscriptionStatus } from '../types/database.types'

export type AdminCustomerRow = {
  profile: Profile
  email: string | null
  orderCount: number
  totalSpent: number
  loyaltyPoints: number
  subscriptionStatus: SubscriptionStatus | 'none'
  lastOrderAt: string | null
}

async function fetchAuthEmailsByUserId(): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const service = createServiceRoleClient()
  if (!service) return map

  let page = 1
  const perPage = 1000
  for (;;) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage })
    if (error) {
      console.warn('[admin-customers] auth.admin.listUsers:', error.message)
      break
    }
    const users = data?.users ?? []
    for (const u of users) {
      map.set(u.id, u.email ?? '')
    }
    if (users.length < perPage) break
    page += 1
  }
  return map
}

export async function getAdminCustomersData(): Promise<AdminCustomerRow[]> {
  const supabase = await getSupabaseForAdmin()

  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  if (pErr) {
    console.error('Failed to fetch profiles:', pErr.message)
    throw new Error(pErr.message)
  }

  const profilesList = (profiles ?? []) as Profile[]

  const { data: orderRows } = await supabase.from('orders').select('user_id, total, created_at')

  type Agg = { count: number; sum: number; lastOrder: string | null }
  const orderAgg = new Map<string, Agg>()
  for (const o of orderRows ?? []) {
    const uid = o.user_id as string
    const total = Number(o.total) || 0
    const created = o.created_at as string
    const cur = orderAgg.get(uid) ?? { count: 0, sum: 0, lastOrder: null }
    cur.count += 1
    cur.sum += total
    if (!cur.lastOrder || created > cur.lastOrder) cur.lastOrder = created
    orderAgg.set(uid, cur)
  }

  const { data: loyaltyRows } = await supabase.from('loyalty_points').select('user_id, points')
  const loyaltyByUser = new Map<string, number>()
  for (const row of loyaltyRows ?? []) {
    const uid = row.user_id as string
    const pts = Number(row.points) || 0
    loyaltyByUser.set(uid, (loyaltyByUser.get(uid) ?? 0) + pts)
  }

  const { data: subRows } = await supabase
    .from('subscriptions')
    .select('user_id, status, updated_at')
    .order('updated_at', { ascending: false })

  const subByUser = new Map<string, SubscriptionStatus>()
  for (const s of subRows ?? []) {
    const uid = s.user_id as string
    if (!subByUser.has(uid)) subByUser.set(uid, s.status as SubscriptionStatus)
  }

  const emails = await fetchAuthEmailsByUserId()

  return profilesList.map((profile) => {
    const o = orderAgg.get(profile.id)
    return {
      profile,
      email: emails.get(profile.id) ?? null,
      orderCount: o?.count ?? 0,
      totalSpent: o?.sum ?? 0,
      loyaltyPoints: loyaltyByUser.get(profile.id) ?? 0,
      subscriptionStatus: subByUser.get(profile.id) ?? 'none',
      lastOrderAt: o?.lastOrder ?? null,
    }
  })
}
