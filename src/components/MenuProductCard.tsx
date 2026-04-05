'use client'

import Image from "next/image";
import Link from "next/link";
import type { ProductWithOptions } from "@/lib/supabase/types/app.types";

/* ─────────────────────────────────────────────
   MenuProductCard
   Specific to the Customer Menu page (/menu).
   Features amber inline Add to Cart button,
   Popular badge, and Out of Stock states.
   ───────────────────────────────────────────── */

interface Props {
  product: ProductWithOptions;
}

function AddShoppingCartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  return (
    <article
      className={`group relative bg-surface-container-lowest rounded-lg md:rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 h-full flex flex-col ${isOutOfStock
          ? "opacity-80"
          : "hover:shadow-[0_20px_40px_rgba(200,134,74,0.08)]"
        }`}
    >
      {/* Popular Badge overlay */}
      {product.is_featured && !isOutOfStock && (
        <div className="absolute top-1.5 left-1.5 md:top-4 md:left-4 z-10">
          <span className="bg-primary text-on-primary text-[8px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg">
            Popular
          </span>
        </div>
      )}

      {/* Image — shorter aspect on mobile so two cards fit comfortably per row */}
      <Link href={`/product/${product.id}`} className="block w-full min-w-0 shrink-0">
        <div
          className={`relative w-full aspect-[5/4] md:aspect-[4/5] overflow-hidden ${isOutOfStock ? "grayscale-[0.5]" : ""}`}
        >
          <Image
            src={product.image_url || "/images/placeholders/espresso.jpg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${!isOutOfStock ? "group-hover:scale-105" : ""}`}
            sizes="(max-width: 767px) 46vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-1.5 md:p-8 flex flex-col justify-between min-h-0 flex-1 md:min-h-[250px] md:h-[250px]">
        <div className="min-w-0">
          <div className="flex flex-col gap-0 md:flex-row md:justify-between md:items-start md:gap-3 md:mb-4">
            <Link
              href={`/product/${product.id}`}
              className="min-w-0 block hover:underline hover:decoration-primary decoration-2 underline-offset-2 md:underline-offset-4"
            >
              <h3 className="text-[11px] leading-[1.2] md:text-2xl md:leading-snug font-headline text-on-background line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <span
              className={`font-mono text-[10px] md:text-base font-bold shrink-0 md:text-right ${isOutOfStock ? "text-stone-400" : "text-primary"}`}
            >
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          <p className="text-on-surface-variant text-[10px] md:text-sm leading-snug md:leading-relaxed mt-1 md:mt-0 mb-1 md:mb-6 line-clamp-2 md:line-clamp-3 hidden md:block">
            {product.description || "Freshly prepared every day."}
          </p>
        </div>

        {/* Action Button */}
        {isOutOfStock ? (
          <button
            disabled
            className="w-full py-1 md:py-4 text-[9px] md:text-base bg-stone-200 text-stone-500 font-bold rounded sm:rounded-md md:rounded-xl cursor-not-allowed flex items-center justify-center gap-0.5 md:gap-2 mt-auto"
          >
            Out of Stock
          </button>
        ) : (
          <Link
            href={`/checkout`}
            className="w-full py-1 md:py-4 text-[9px] md:text-base amber-glow text-on-primary font-bold rounded sm:rounded-md md:rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-0.5 md:gap-2 mt-auto"
          >
            <AddShoppingCartIcon className="w-3 h-3 md:w-[18px] md:h-[18px] shrink-0" />
            <span className="truncate max-w-[4.5rem] md:max-w-none">Add</span>
            <span className="hidden md:inline"> to Cart</span>
          </Link>
        )}
      </div>
    </article>
  );
}
