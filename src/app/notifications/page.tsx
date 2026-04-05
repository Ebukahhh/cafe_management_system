import type { Metadata } from "next";
import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileMobileHeader from "@/components/ProfileMobileHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NotificationsClient from "./notifications-client";

/* ─────────────────────────────────────────────
   Notifications Page — Server Component
   Fetches notifications, passes to client for filtering & read actions
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Notifications | Jennifer's Café",
  description: "Stay up to date with your orders, reservations, and promotions.",
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: 'order_update' | 'reservation_update' | 'subscription_alert' | 'promotion' | 'general';
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/notifications');
  }

  const { data } = await supabase
    .from('notifications')
    .select('id, user_id, type, title, body, is_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const notifications: NotificationRow[] = data || [];

  return (
    <>
      {/* Mobile header */}
      <ProfileMobileHeader title="Notifications" />


      <div className="flex min-h-screen">
        <ProfileSidebar />

        <main className="flex-1 md:ml-72 bg-deep-espresso min-h-screen">
          <div className="max-w-3xl mx-auto px-4 md:px-6 pt-6 pb-24 md:py-12">
            <NotificationsClient notifications={notifications} />
          </div>
        </main>
      </div>
    </>
  );
}
