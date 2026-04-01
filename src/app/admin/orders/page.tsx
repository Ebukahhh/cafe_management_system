import type { Metadata } from 'next'
import AdminOrdersClient from './admin-orders-client'

export const metadata: Metadata = {
  title: 'Live Orders | Jennifer\'s Café Admin',
  description: 'Manage active orders, update preparation status, and handle deliveries.',
}

export default function AdminOrdersPage() {
  return <AdminOrdersClient />
}
