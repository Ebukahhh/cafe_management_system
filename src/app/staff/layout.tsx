import StaffPortalShell from '@/components/staff/staff-portal-shell'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Staff Portal | Jennifer's Café",
  description: 'Live orders, history, and daily shift report for baristas.',
}

/**
 * Staff area — barista-only. No admin sidebar; header + tabs live in StaffPortalShell.
 */
export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/staff')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', user.id)
    .single()

  if (error || !profile || profile.role !== 'barista') redirect('/unauthorised')

  return <StaffPortalShell profile={profile}>{children}</StaffPortalShell>
}
