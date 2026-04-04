'use client'

import Image from "next/image";
import Link from "next/link";
import type { ProductWithOptions } from "@/lib/supabase/types/app.types";
import { useCartStore } from "@/lib/store/cart";

/* ─────────────────────────────────────────────
   MenuProductCard
   Specific to the Customer Menu page (/menu).
   Features amber inline Add to Cart button,
   Popular badge, and Out of Stock states.
   ───────────────────────────────────────────── */

interface Props {
  product: ProductWithOptions;
}

function AddShoppingCartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      <path d="M11 10h6" />
      <path d="M14 7v6" />
    </svg>
  );
}

export default function MenuProductCard({ product }: Props) {
  // If is_available is false OR stock_count is 0, we consider it out of stock
  // Based on the DB schema, stock_count can be null for infinite stock items,
  // so we only treat it out of stock if it is exactly 0 or marked unavailable.
  const isOutOfStock = !product.is_available || product.stock_count === 0;
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.image_url,
      unitPrice: product.price,
      quantity: 1,
      selectedOptions: {}, // Default options if any, or empty
    });
    openCart();
  };

  return (
    <article
      className={`group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ${
        isOutOfStock
          ? "opacity-80"
          : "hover:shadow-[0_20px_40px_rgba(200,134,74,0.08)]"
      }`}
    >
      {/* Popular Badge overlay */}
      {product.is_featured && !isOutOfStock && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            Popular
          </span>
        </div>
      )}

      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="block">
        <div className={`aspect-[4/5] overflow-hidden relative ${isOutOfStock ? "grayscale-[0.5]" : ""}`}>
          <Image
            src={product.image_url || "/images/placeholders/espresso.jpg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${!isOutOfStock ? "group-hover:scale-105" : ""}`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-8 flex flex-col justify-between h-[250px]">
        <div>
          <div className="flex justify-between items-start mb-4">
            <Link href={`/product/${product.id}`} className="block hover:underline hover:decoration-primary decoration-2 underline-offset-4">
              <h3 className="text-2xl font-headline text-on-background line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <span className={`font-mono font-bold ${isOutOfStock ? "text-stone-400" : "text-primary"}`}>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3">
            {product.description || "Freshly prepared every day."}
          </p>
        </div>

        {/* Action Button */}
        {isOutOfStock ? (
          <button
            disabled
            className="w-full py-4 bg-stone-200 text-stone-500 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 mt-auto"
          >
            Out of Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full py-4 amber-glow text-on-primary font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-auto cursor-pointer"
          >
            <AddShoppingCartIcon />
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}
