import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllProductsForAdmin, getCategories } from "@/lib/supabase/queries/products";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Our Menu | Jennifer's Café",
  description: "Curated blends and artisanal pastries, prepared daily. Experience the ritual of fine specialty coffee.",
};

// Next.js 15+ allows dynamic rendering but this page can be partially statically generated
// Actually, since pricing/availability changes often, dynamic is preferred.
export const revalidate = 60; // SSR with 60 sec ISR cache

export default async function MenuPage() {
  // Fetch from our data layer
  // We use getAllProductsForAdmin to retrieve items including those 
  // marked is_available=false, so we can display them as Out of Stock
  const [products, categories] = await Promise.all([
    getAllProductsForAdmin(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />

      <main className="pt-5 md:pt-28 pb-12 md:pb-16 max-w-7xl mx-auto px-4 md:px-8 min-h-screen">
        <MenuClient initialProducts={products} categories={categories} />
      </main>

      <Footer />
    </>
  );
}
