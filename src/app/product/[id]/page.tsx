import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithOptions } from "@/lib/supabase/types/app.types";
import ProductDetailClient from "./product-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", id)
    .single();

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Jennifer's Cafe`,
    description: product.description ?? "Freshly prepared every day.",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, product_options(*), categories(name)")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product as ProductWithOptions} />
    </>
  );
}
