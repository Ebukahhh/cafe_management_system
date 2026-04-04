"use client"

import { useState, useMemo } from "react";
import type { ProductWithOptions } from "@/lib/supabase/types/app.types";
import type { Category } from "@/lib/supabase/types/database.types";
import MenuProductCard from "@/components/MenuProductCard";

function CategoryChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

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
      <header className="mb-6 md:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline text-on-background mb-3 md:mb-4 tracking-tight">
          Our Menu
        </h1>
        <p className="text-sm md:text-xl text-on-surface-variant max-w-xl font-body leading-relaxed">
          Curated blends and artisanal pastries, prepared daily. Experience the ritual of fine specialty coffee.
        </p>
      </header>

      {/* Mobile: dropdown — saves horizontal space */}
      <div className="relative mb-6 md:hidden">
        <label htmlFor="menu-category-filter" className="sr-only">
          Filter by category
        </label>
        <select
          id="menu-category-filter"
          value={activeCategoryId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            setActiveCategoryId(v === "" ? null : v);
          }}
          className="w-full appearance-none rounded-xl border border-white/10 bg-surface-container-high px-3 py-2.5 pr-10 font-body text-sm text-on-surface shadow-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-3xl">
          <CategoryChevronDown />
        </span>
      </div>

      {/* Desktop / tablet: horizontal pill filters */}
      <div className="hidden md:flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        <button
          type="button"
          onClick={() => setActiveCategoryId(null)}
          className={`px-6 py-2 rounded-full transition-all duration-300 whitespace-nowrap relative ${
            activeCategoryId === null
              ? "font-bold text-primary bg-primary/10"
              : "font-medium text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
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

      {/* Product Grid — 2 columns on mobile (tight gap), 2–3 on larger screens */}
      <div className="grid p-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1.5 md:gap-8 lg:gap-10 min-w-0">
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
