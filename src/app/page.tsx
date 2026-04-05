import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingHero from "@/components/LandingHero";
import ProductCard from "@/components/ProductCard";
import FeatureCard from "@/components/FeatureCard";
import { createClient } from "@/lib/supabase/server";

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

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, is_featured, categories(name)")
    .eq("is_available", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(3);

  type CategoryJoin = { name?: string | null } | Array<{ name?: string | null }> | null;

  const featuredProducts = (products ?? []).map((product) => {
    const categories = product.categories as CategoryJoin;
    const categoryName = Array.isArray(categories)
      ? categories[0]?.name
      : categories?.name;

    return {
      id: product.id,
      name: product.name,
      description: product.description ?? "Freshly prepared every day.",
      price: `$${Number(product.price).toFixed(2)}`,
      image: product.image_url || "/images/coffee-cappuccino.png",
      badge: product.is_featured ? "Popular" : categoryName ?? undefined,
    };
  });

  return (
    <>
      <Navbar />

      <main>
        <section className="relative min-h-0 lg:min-h-[820px] flex items-center overflow-hidden bg-deep-espresso pt-2 pb-10 md:pt-4 md:pb-14 lg:py-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center z-10">
            <div className="order-1 lg:order-none">
              <LandingHero />
            </div>

            <div className="relative group hidden lg:block">
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

        <section id="menu" className="py-20 md:py-32 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 lg:gap-10">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        <section className="w-full bg-primary-container relative overflow-hidden">
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
                Join Jennifer&apos;s Cafe Rewards.
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
