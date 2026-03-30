import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/AdminSidebar'
import type { User } from '@supabase/supabase-js'

/**
 * Admin Layout — async Server Component.
 *
 * Acts as a second line of defence after middleware.
 * Verifies session + role server-side before rendering any admin UI.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Middleware should have already caught these, but we guard here too.
  if (!user) redirect('/login?next=/admin')
  if (user.user_metadata?.role !== 'admin') redirect('/?error=unauthorized')

  return (
    <>
      <AdminSidebar user={user as User} />
      <div className="lg:ml-[240px] min-h-screen bg-deep-espresso">
        {children}
      </div>
    </>
  )
}
