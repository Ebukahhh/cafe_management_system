import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Jennifer's Café",
  description: "Review your order and complete checkout at Jennifer's Café.",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/checkout');
  }

  // Fetch full user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Dynamically fetch pickup capacities
  // We'll map them from the block structure to strings
  const { data: slots } = await supabase
    .from('slot_capacity')
    .select('time_slot')
    .order('time_slot', { ascending: true });

  const dynamicSlots = slots ? slots.map((s) => s.time_slot) : [];

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20">
        <CheckoutClient dynamicSlots={dynamicSlots} userProfile={profile} />
      </main>

      <BottomNav activeTab="orders" />
      <div className="h-24 md:hidden" />
    </>
  );
}
