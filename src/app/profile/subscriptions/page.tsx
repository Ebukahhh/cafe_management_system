import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ProfileSidebar from "@/components/ProfileSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubscriptionCard from "./subscription-card";

export const metadata: Metadata = {
  title: "Subscriptions | Jennifer's Café",
  description: "Manage your coffee subscriptions.",
};

export default async function SubscriptionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/profile/subscriptions');
  }

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select(`
      id, 
      status, 
      frequency, 
      next_run_at, 
      created_at,
      subscription_items (
        product_name, 
        quantity
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <>
      {/* Mobile-only top bar */}
      <div className="md:hidden">
        <Navbar />
      </div>

      <div className="flex min-h-screen">
        <ProfileSidebar />

        {/* ── Main Content ── */}
        <main className="flex-1 md:ml-72 bg-deep-espresso min-h-screen">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-40 md:py-16">
            <div className="mb-10 md:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Subscriptions</h1>
                <p className="text-on-surface/40 max-w-lg">
                  Manage your recurring orders and keep your daily ritual uninterrupted.
                </p>
              </div>
              <Link 
                href="/subscription" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full amber-glow text-on-primary font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm shrink-0"
                style={{ boxShadow: "0 4px 14px rgba(200,134,74,0.2)" }}
              >
                Create New Subscription
              </Link>
            </div>

            <div className="space-y-6">
              {!subscriptions || subscriptions.length === 0 ? (
                <div className="bg-surface-container rounded-2xl p-10 text-center border border-white/5">
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface/20">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                  </div>
                  <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No Active Subscriptions</h3>
                  <p className="text-on-surface/40 max-w-sm mx-auto mb-6">
                    You haven&apos;t set up any recurring coffee deliveries yet. Start your daily ritual today!
                  </p>
                  <Link href="/subscription" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-surface-container-high text-primary font-bold hover:bg-surface-bright transition-all text-sm ring-1 ring-primary/20">
                    Browse Plans
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {subscriptions.map((sub: any) => (
                    <SubscriptionCard key={sub.id} sub={sub} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav activeTab="home" />
        <div className="h-24" />
      </div>
    </>
  );
}
