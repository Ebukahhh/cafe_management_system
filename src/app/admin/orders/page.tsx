import type { Metadata } from 'next'
import { getAdminOrdersBoard } from '@/lib/supabase/queries/admin-orders'
import AdminOrdersClient from './admin-orders-client'

export const metadata: Metadata = {
  title: 'Live Orders | Jennifer\'s Café Admin',
  description: 'Manage active orders, update preparation status, and handle deliveries.',
}

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const { orders, stats } = await getAdminOrdersBoard()
  return <AdminOrdersClient initialOrders={orders} stats={stats} />
}
