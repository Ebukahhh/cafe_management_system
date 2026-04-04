import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ProfileSidebar from "@/components/ProfileSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PaymentClient from "./payment-client";

export const metadata: Metadata = {
  title: "Payment Methods | Jennifer's Café",
  description: "Manage your saved payment methods.",
};

function PlusCircleIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
}

export default async function PaymentMethodsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/profile/payment-methods');
  }

  return (
    <>
      <div className="md:hidden">
        <Navbar />
      </div>

      <div className="flex min-h-screen">
        <ProfileSidebar />

        <main className="flex-1 md:ml-72 bg-deep-espresso min-h-screen">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-40 md:py-16">
            <PaymentClient />
          </div>
        </main>
      </div>

      <div className="md:hidden">
        <BottomNav activeTab="home" />
        <div className="h-24" />
      </div>
    </>
  );
}
