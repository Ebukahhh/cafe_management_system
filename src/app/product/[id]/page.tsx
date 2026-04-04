import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getProductById, getProductIds } from "@/data/products";

/* ─────────────────────────────────────────────
   Product Detail Page (Dynamic)
   Reads product data from the shared catalog via [id] param.
   Desktop: 60/40 split — images+reviews left, sticky product info right
   Mobile: full-width hero → info → customization → sticky bottom CTA
   ───────────────────────────────────────────── */

/* ── Static params for build-time generation ── */
export async function generateStaticParams() {
  return getProductIds().map((id) => ({ id }));
}

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Jennifer's Café`,
    description: product.description,
  };
}

/* ── Icon Components ── */
function StarIcon({ filled = true }: { filled?: boolean }) {
  return filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ThermometerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

function SnowflakeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M20 16l-4-4 4-4" />
      <path d="M4 8l4 4-4 4" />
      <path d="M16 4l-4 4-4-4" />
      <path d="M8 20l4-4 4 4" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const fullStars = Math.floor(product.rating);
  const hasHalf = product.rating % 1 >= 0.3;

  return (
    <>
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 lg:py-20 pb-40 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* ════════════════════════════════════════
              LEFT COLUMN: Images + Reviews (60%)
              ════════════════════════════════════════ */}
          <div className="w-full lg:w-[60%] space-y-8 lg:space-y-12">
            {/* Hero image */}
            <div className="space-y-4 md:space-y-6">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface-container-low relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              {/* Thumbnail gallery */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {product.thumbnails.map((thumb, i) => (
                  <div
                    key={thumb.alt}
                    className={`aspect-square rounded-xl overflow-hidden relative cursor-pointer transition-all ${
                      i === 0
                        ? "ring-2 ring-primary"
                        : "hover:ring-2 hover:ring-outline-variant"
                    }`}
                  >
                    <Image
                      src={thumb.src}
                      alt={thumb.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Reviews section ── */}
            <section className="space-y-8 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline text-2xl md:text-3xl text-on-surface">Community Notes</h3>
                  <div className="flex items-center mt-2 gap-2">
                    <div className="flex text-primary gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} filled={i < fullStars || (i === fullStars && hasHalf)} />
                      ))}
                    </div>
                    <span className="text-lg font-mono font-medium text-on-surface/60">
                      {product.rating.toFixed(1)} / 5.0
                    </span>
                    <span className="text-sm text-on-surface/30 ml-1">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline underline-offset-4 cursor-pointer">
                  Write a review
                </button>
              </div>

              {/* Review cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {product.reviews.map((review) => (
                  <div key={review.name} className="bg-surface-container-low p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-on-surface">{review.name}</span>
                      <span className="text-xs font-mono text-on-surface/30">{review.time}</span>
                    </div>
                    <div className="flex text-primary gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} filled={i < review.stars} />
                      ))}
                    </div>
                    <p className="text-on-surface/50 text-sm leading-relaxed italic font-body">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN: Product Info (40%, sticky)
              ════════════════════════════════════════ */}
          <aside className="w-full lg:w-[40%] lg:sticky lg:top-32 space-y-8 lg:space-y-10">
            {/* Product header */}
            <div className="space-y-4">
              <span className="text-primary font-mono text-[10px] tracking-widest uppercase block">
                {product.origin}
              </span>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-headline font-bold text-on-surface leading-tight">
                {product.name}
              </h1>
              <p className="text-base lg:text-lg text-on-surface/50 leading-relaxed font-body font-light">
                {product.longDescription}
              </p>
              <div className="text-3xl font-mono text-primary font-bold">{product.price}</div>
            </div>

            {/* ── Customization options ── */}
            <div className="space-y-8">
              {/* Cup Size */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-bold text-on-surface/30 font-label block">
                  Cup Size
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className="px-6 py-2 rounded-full bg-surface-container-highest text-on-surface font-medium text-sm transition-all hover:bg-surface-bright cursor-pointer">
                    Small
                  </button>
                  <button className="px-6 py-2 rounded-full amber-glow text-on-primary font-bold text-sm cursor-pointer">
                    Medium
                  </button>
                  <button className="px-6 py-2 rounded-full bg-surface-container text-on-surface/50 text-sm transition-all hover:bg-surface-container-high cursor-pointer">
                    Large
                  </button>
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-bold text-on-surface/30 font-label block">
                  Temperature
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-high text-on-surface transition-all ring-2 ring-primary cursor-pointer">
                    <ThermometerIcon />
                    <span className="font-medium">Hot</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-low text-on-surface/50 transition-all hover:bg-surface-container cursor-pointer">
                    <SnowflakeIcon />
                    <span className="font-medium">Iced</span>
                  </button>
                </div>
              </div>

              {/* Milk Selection */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-bold text-on-surface/30 font-label block">
                  Milk Selection
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-4 py-2.5 rounded-lg bg-surface-container-low text-sm text-left hover:bg-surface-container transition-all cursor-pointer">
                    Regular
                  </button>
                  <button className="px-4 py-2.5 rounded-lg bg-surface-container-high ring-2 ring-primary text-sm text-left font-bold cursor-pointer">
                    Oat <span className="text-xs font-normal text-on-surface/30 ml-1">+$0.80</span>
                  </button>
                  <button className="px-4 py-2.5 rounded-lg bg-surface-container-low text-sm text-left hover:bg-surface-container transition-all cursor-pointer">
                    Almond
                  </button>
                  <button className="px-4 py-2.5 rounded-lg bg-surface-container-low text-sm text-left hover:bg-surface-container transition-all cursor-pointer">
                    Soy
                  </button>
                </div>
              </div>

              {/* Enhancements */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-bold text-on-surface/30 font-label block">
                  Enhancements
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-on-primary">
                        <CheckIcon />
                      </div>
                      <span className="text-sm">Extra Espresso Shot</span>
                    </div>
                    <span className="text-xs font-mono text-on-surface/30">+$1.50</span>
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-surface-variant" />
                      <span className="text-sm">Vanilla Syrup</span>
                    </div>
                    <span className="text-xs font-mono text-on-surface/30">+$0.50</span>
                  </label>
                </div>
              </div>
            </div>

            {/* ── Cart section ── */}
            <div className="pt-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-surface-container-high rounded-full p-1">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors cursor-pointer">
                    <MinusIcon />
                  </button>
                  <span className="px-4 font-mono font-bold">01</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors cursor-pointer">
                    <PlusIcon />
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-xs text-on-surface/30 uppercase font-bold tracking-widest font-label">Total Order</div>
                  <div className="text-3xl font-mono text-on-surface font-bold">{product.price}</div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/checkout" className="w-full py-5 rounded-xl amber-glow text-on-primary font-headline text-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center">
                  Add to Cart
                </Link>
                <Link
                  href="/subscription"
                  className="flex items-center justify-center gap-2 text-primary text-sm font-medium hover:underline underline-offset-4"
                >
                  <RepeatIcon />
                  Subscribe to this order
                </Link>
              </div>
            </div>

            {/* Allergen strip */}
            <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-6 justify-center">
              <div className="flex items-center gap-2 grayscale opacity-50">
                <span className="text-sm">🥛</span>
                <span className="text-[10px] font-mono uppercase tracking-tighter">Dairy</span>
              </div>
              <div className="flex items-center gap-2 grayscale opacity-50">
                <span className="text-sm">🌾</span>
                <span className="text-[10px] font-mono uppercase tracking-tighter">Gluten</span>
              </div>
              <div className="flex items-center gap-2 grayscale opacity-50">
                <span className="text-sm">🌱</span>
                <span className="text-[10px] font-mono uppercase tracking-tighter">Vegan Opt</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky cart button */}
      <div className="fixed bottom-[72px] left-0 w-full z-40 px-4 py-3 bg-deep-espresso/80 backdrop-blur-xl md:hidden">
        <Link href="/checkout" className="flex w-full amber-glow text-on-primary py-4 rounded-xl font-headline text-lg font-bold active:scale-[0.98] transition-all items-center justify-center">
          Add to Cart — {product.price}
        </Link>
      </div>
    </>
  );
}
