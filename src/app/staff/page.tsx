'use client'

import { DailyReportTab } from '@/components/staff/DailyReportTab'
import { LiveOrdersTab } from '@/components/staff/LiveOrdersTab'
import { OrderHistoryTab } from '@/components/staff/OrderHistoryTab'
import { useStaffPortal } from '@/components/staff/staff-portal-context'

export default function StaffPage() {
  const { activeTab } = useStaffPortal()

  return (
    <>
      {activeTab === 'live' ? <LiveOrdersTab /> : null}
      {activeTab === 'history' ? <OrderHistoryTab /> : null}
      {activeTab === 'report' ? <DailyReportTab /> : null}
    </>
  )
}
