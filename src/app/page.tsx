import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FeatureCard from "@/components/FeatureCard";
import HeroButtons from "@/components/HeroButtons";
import { getAllProducts } from "@/data/products";

/* ─────────────────────────────────────────────
   Landing Page
   Structure follows landing-page-desktop.html:
   Nav → Hero → Features Strip → Popular Items → Loyalty → Footer

   Design rules applied:
   • No-Line Rule: bg color shifts only, zero borders
   • Glass & Gradient: amber-glow CTAs, glassmorphism badge
   • Typography: Fraunces (headlines), DM Sans (body), mono (metadata)
   • Tonal Layering: surface tiers for depth
   • Editorial Asymmetry: offset headlines, wide editorial gutters
   ───────────────────────────────────────────── */

/* ── Icon SVGs ── */
function CoffeeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1l3.09 4.26L20 6.27l-2.18 4.55L19.09 16 12 14.14 4.91 16l1.27-5.18L4 6.27l4.91-1.01L12 1z" />
    </svg>
  );
}

/* ── Product data (from shared catalog) ── */
const products = getAllProducts().filter((p) => p.id !== "single-origin-pour-over");

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ════════════════════════════════════════════
            HERO SECTION
            Editorial asymmetry: text left, image right
            bg: surface (deep espresso)
            ════════════════════════════════════════════ */}
        <section className="relative min-h-[700px] lg:min-h-[870px] flex items-center overflow-hidden bg-deep-espresso">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center z-10">
            {/* Text column */}
            <div className="space-y-8 py-12 lg:py-16">
              <h1 className="font-headline font-black text-5xl md:text-7xl lg:text-8xl text-on-surface leading-[0.9] tracking-tight">
                Your café, <br />
                <span className="text-primary italic font-light">reimagined.</span>
              </h1>

              <p className="text-on-surface/50 text-lg md:text-xl lg:text-2xl max-w-lg leading-relaxed font-body">
                Order ahead, book a table, set up your daily coffee — all in one place.
              </p>

              <HeroButtons />
            </div>

            {/* Image column */}
            <div className="relative group">
              {/* Ambient glow behind image */}
              <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

              <div className="relative rounded-[32px] overflow-hidden aspect-square shadow-2xl">
                <Image
                  src="/images/hero-coffee.png"
                  alt="Artisan latte art in a textured ceramic cup"
                  fill
                  priority
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Floating glass badge — glassmorphism */}
              <div className="absolute -bottom-6 -left-6 glass-card p-5 md:p-6 rounded-2xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <VerifiedIcon />
                  </div>
                  <div>
                    <p className="text-on-surface font-headline italic text-sm md:text-base">
                      The Sommelier&apos;s Choice
                    </p>
                    <p className="text-on-surface/40 text-xs font-mono uppercase tracking-tight">
                      Ethiopian Yirgacheffe • 94 pts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURES STRIP
            bg shift: on-surface (cream/warm) — inverted palette
            No borders, tonal icon circles
            ════════════════════════════════════════════ */}
        <section className="bg-on-surface text-deep-espresso py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              <FeatureCard
                icon={<CoffeeIcon />}
                title="Order & Track"
                description="Skip the line and watch your brew come to life in real-time with our precision tracker."
              />
              <FeatureCard
                icon={<CalendarIcon />}
                title="Reserve a Table"
                description="Guarantee your favorite corner for meetings or slow mornings with effortless booking."
              />
              <FeatureCard
                icon={<RepeatIcon />}
                title="Subscribe & Save"
                description="Never run out of energy. Set up recurring orders and enjoy exclusive member pricing."
              />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            POPULAR ITEMS
            bg shift: surface-container-lowest (darkest)
            Editorial header with asymmetric "Curated Selection" mono label
            ════════════════════════════════════════════ */}
        <section id="menu" className="py-20 md:py-32 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Section header — editorial asymmetry */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
              <div>
                <span className="text-primary font-mono text-sm uppercase tracking-[0.3em] block mb-4">
                  Curated Selection
                </span>
                <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-on-surface">
                  Most loved this week
                </h2>
              </div>
              <Link
                href="/menu"
                className="text-on-surface font-bold text-lg flex items-center gap-2 group shrink-0"
              >
                View Menu
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  <ArrowRightIcon />
                </span>
              </Link>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {products.map((product) => (
                <ProductCard key={product.name} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            LOYALTY BANNER
            bg shift: primary-container (warm amber)
            Subtle dot pattern texture overlay
            ════════════════════════════════════════════ */}
        <section className="w-full bg-primary-container relative overflow-hidden">
          {/* Subtle dot pattern texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20 relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-on-primary">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-4 italic">
                Join Jennifer&apos;s Café Rewards.
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl font-body opacity-90">
                Earn points on every order, unlock private tastings, and enjoy a coffee on us for your birthday.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button className="bg-deep-espresso text-on-surface w-full md:w-auto px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-deep-espresso/90 transition-all cursor-pointer">
                Join the Inner Circle
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
