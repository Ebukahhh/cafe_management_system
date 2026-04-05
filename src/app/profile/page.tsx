import type { Metadata } from "next";
import Link from "next/link";
import ProfileMobileHeader from "@/components/ProfileMobileHeader";
import ProfileSidebar from "@/components/ProfileSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";

/* ─────────────────────────────────────────────
   Profile / Account Settings
   Desktop: sidebar nav (fixed) + content area
   Mobile: stacked sections
   Sections: Personal Info form, Photo upload,
   Dietary preferences, Loyalty card, Danger zone
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Profile & Settings | Jennifer's Café",
  description: "Manage your personal details, payment methods, and preferences.",
};

/* ── Icons ── */
function PersonIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function ShieldIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function CameraIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
}
function TrophyIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" /></svg>;
}

function PlusCircleIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
}

const dietaryOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Nut-Free", "Lactose-Free", "Halal"];

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/profile')
  }

  // Fetch from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Assemble full profile data mapping
  const profileData = {
    id: user.id,
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || null,
    dietary_flags: profile?.dietary_flags || [],
    email: user.email || null,
  }

  return (
    <>
      {/* Mobile-only profile header */}
      <ProfileMobileHeader title="Personal Info" />

      <div className="flex min-h-screen">
        {/* ── Desktop Sidebar ── */}
        <ProfileSidebar />

        {/* ── Main Content ── */}
        <main className="flex-1 md:ml-72 bg-deep-espresso min-h-screen pt-0">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-40 md:py-16">
            <div className="mb-10 md:mb-12">
              <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Personal Info</h1>
              <p className="text-on-surface/40 max-w-lg">Manage your personal details and how we can reach you to provide the best café experience.</p>
            </div>

            <ProfileClient profile={profileData} />
          </div>
        </main>
      </div>
    </>
  );
}
