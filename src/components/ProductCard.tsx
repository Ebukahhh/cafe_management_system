'use client'

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";

/* ─────────────────────────────────────────────
   ProductCard — Reusable menu item card
   Design: No borders. Tonal bg (surface-container-low).
   Rounded 3xl. Hover lifts card + scales image.
   Fraunces for title, Berkeley Mono for price/badge.
   ───────────────────────────────────────────── */

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
}

export default function ProductCard({ id, name, description, price, image, badge }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // prevents Link navigation
    const numPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    addItem({
      productId: id,
      productName: name,
      imageUrl: image,
      unitPrice: numPrice,
      quantity: 1,
      selectedOptions: {},
    });
    openCart();
  };

  return (
    <Link href={`/product/${id}`} className="block">
      <article className="group bg-surface-container-low rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 md:hover:-translate-y-2">
        {/* Image area — shorter on mobile */}
        <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden relative max-h-[280px] md:max-h-none">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {badge && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-surface/80 backdrop-blur-sm px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest text-on-surface">
              {badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-start gap-2 mb-2 md:mb-4">
            <h3 className="font-headline text-lg md:text-2xl group-hover:text-primary transition-colors leading-tight">
              {name}
            </h3>
            <span className="font-mono text-primary shrink-0 ml-2 text-base md:text-xl">
              {price}
            </span>
          </div>

          <p className="text-on-surface/50 text-xs md:text-sm mb-4 md:mb-8 leading-relaxed font-body line-clamp-3 md:line-clamp-none">
            {description}
          </p>

          <button className="w-full py-2.5 md:py-4 rounded-lg md:rounded-xl bg-surface-container-high text-sm md:text-base font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 text-on-surface cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add to Cart
          </button>
        </div>
      </article>
    </Link>
  );
}
