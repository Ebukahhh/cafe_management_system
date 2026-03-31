"use client"

import { useState, useMemo } from "react";
import type { ProductWithOptions } from "@/lib/supabase/types/app.types";
import type { Category } from "@/lib/supabase/types/database.types";
import MenuProductCard from "@/components/MenuProductCard";

/* ─────────────────────────────────────────────
   MenuClient
   Handles state for the category filter bar
   and dynamically filters the products.
   ───────────────────────────────────────────── */

interface Props {
  initialProducts: ProductWithOptions[];
  categories: Category[];
}

export default function MenuClient({ initialProducts, categories }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) return initialProducts;
    return initialProducts.filter(p => p.category_id === activeCategoryId);
  }, [initialProducts, activeCategoryId]);

  return (
    <>
      {/* Header Section */}
      <header className="mb-16">
        <h1 className="text-6xl md:text-7xl font-headline text-on-background mb-4 tracking-tight">
          Our Menu
        </h1>
        <p className="text-xl text-on-surface-variant max-w-xl font-body leading-relaxed">
          Curated blends and artisanal pastries, prepared daily. Experience the ritual of fine specialty coffee.
        </p>
      </header>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {/* 'All' Button */}
        <button
          onClick={() => setActiveCategoryId(null)}
          className={`px-6 py-2 rounded-full transition-all duration-300 whitespace-nowrap relative ${
            activeCategoryId === null
              ? "font-bold text-primary bg-primary/10"
              : "font-medium text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          All
          {activeCategoryId === null && (
            <div className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full hidden"></div>
          )}
        </button>

        {/* Dynamic Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategoryId(category.id)}
            className={`px-6 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
              activeCategoryId === category.id
                ? "font-bold text-primary bg-primary/10"
                : "font-medium text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map(product => (
          <MenuProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-on-surface-variant font-medium">No items available in this category.</p>
        </div>
      )}
    </>
  );
}
