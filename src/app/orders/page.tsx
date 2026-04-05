import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrdersClient from "./orders-client";
import type { OrderWithItems } from "@/lib/supabase/types/app.types";

export const metadata: Metadata = {
  title: "Your Orders | Jennifer's Café",
  description: "Track your current orders and revisit past favorites at Jennifer's Café.",
};

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/orders");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      order_type,
      subtotal,
      total,
      created_at,
      updated_at,
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        line_total
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[orders page]", error.message);
  }

  const orders = (data ?? []) as OrderWithItems[];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-40 md:pb-20">
        <OrdersClient orders={orders} />
      </main>
    </>
  );
}
