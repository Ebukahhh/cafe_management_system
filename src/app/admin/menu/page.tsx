import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MenuClient } from "./menu-client";
import type { ProductWithOptions, Category } from "@/lib/supabase/types/app.types";

export const metadata: Metadata = {
  title: "Menu Manager | Jennifer's Café Admin",
  description: "Curate your seasonal offerings and manage your menu catalog.",
};

export default async function MenuManagerPage() {
  const supabase = await createClient();

  // Fetch all products (including unavailable ones for the admin panel)
  const { data: products } = await supabase
    .from("products")
    .select("*, product_options(*), categories(name)")
    .order("sort_order", { ascending: true });

  // Fetch active categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <MenuClient 
      initialProducts={(products || []) as ProductWithOptions[]} 
      initialCategories={(categories || []) as Category[]} 
    />
  );
}
