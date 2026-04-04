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
    <article className="group bg-surface-container-low rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
      {/* Image area */}
      <div className="aspect-[4/5] overflow-hidden relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {badge && (
          <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest text-on-surface">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-headline text-2xl group-hover:text-primary transition-colors">
            {name}
          </h3>
          <span className="font-mono text-primary shrink-0 ml-4 text-xl">
            {price}
          </span>
        </div>

        <p className="text-on-surface/50 text-sm mb-8 leading-relaxed font-body">
          {description}
        </p>

        <button 
          onClick={handleAdd}
          className="w-full py-4 rounded-xl bg-surface-container-high font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 text-on-surface cursor-pointer"
        >
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
