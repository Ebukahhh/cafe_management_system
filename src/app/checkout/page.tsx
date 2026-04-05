import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Jennifer's Cafe",
  description: "Review your order and complete checkout at Jennifer's Cafe.",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/checkout");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: slots } = await supabase
    .from("slot_capacity")
    .select("time_slot")
    .order("time_slot", { ascending: true });

  const dynamicSlots = slots ? slots.map((slot) => slot.time_slot) : [];
  const userProfile = {
    ...profile,
    email: user.email ?? "",
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20">
        <CheckoutClient dynamicSlots={dynamicSlots} userProfile={userProfile} />
      </main>
    </>
  )
}
