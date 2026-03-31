import { createClient } from "@/lib/supabase/server";
import { EditClient } from "./edit-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product | Jennifer's Café Admin",
  description: "Edit product details, options, and availability.",
};

// Next 15 expects searchParams to be a Promise, but sometimes it's synchronous depending on config.
// The safest way is to await it if it's treated as a Promise.
export default async function EditProductPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const supabase = await createClient();
  const { id } = await searchParams;

  // Fetch active categories
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (catError) {
    console.error("Failed to fetch categories:", catError.message);
  }
  console.log("Categories fetched:", categories?.length, categories);

  let product = null;

  if (id) {
    const { data } = await supabase
      .from("products")
      .select("*, product_options(*), categories(name)")
      .eq("id", id)
      .single();
    
    product = data;
  }

  return (
    <EditClient 
      initialProduct={product} 
      categories={categories || []} 
    />
  );
}
