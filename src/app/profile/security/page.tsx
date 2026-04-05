import type { Metadata } from "next";
import ProfileMobileHeader from "@/components/ProfileMobileHeader";
import ProfileSidebar from "@/components/ProfileSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SecurityClient from "./security-client";

export const metadata: Metadata = {
  title: "Security Settings | Jennifer's Café",
  description: "Manage your account security and authentication settings.",
};

export default async function SecurityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/profile/security');
  }

  return (
    <>
      <ProfileMobileHeader title="Security" />

      <div className="flex min-h-screen">
        <ProfileSidebar />

        <main className="flex-1 md:ml-72 bg-deep-espresso min-h-screen">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-40 md:py-16">
            <div className="mb-10 md:mb-12">
              <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Security</h1>
              <p className="text-on-surface/40 max-w-lg">
                Update your password and secure your account with 2-Factor Authentication.
              </p>
            </div>

            <SecurityClient />
          </div>
        </main>
      </div>


    </>
  );
}
