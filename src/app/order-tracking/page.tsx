import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────
   Live Order Tracking Page
   Desktop: 60/40 — status + timeline left, order summary + map right
   Mobile: status hero → vertical timeline → order details → sticky bar
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Order #0047 • Tracking | Jennifer's Café",
  description: "Track your order in real-time as our baristas prepare your brew.",
};

/* ── Icon Components ── */
function ArrowBackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function CheckCircleFillIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function DirectionsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

/* ── Timeline data ── */
const timeline = [
  { label: "Order Placed", time: "9:02 AM", status: "done" as const, badge: "Completed" },
  { label: "Confirmed by Café", time: "9:03 AM", status: "done" as const, badge: "Completed" },
  {
    label: "Being Prepared",
    time: "9:05 AM",
    status: "active" as const,
    badge: "In progress",
    detail: "Our baristas are carefully crafting your specialty pour-over and warming your pastries.",
  },
  { label: "Ready for Pickup", time: "Upcoming", status: "upcoming" as const },
  { label: "Collected", time: "Upcoming", status: "upcoming" as const },
];

const orderItems = [
  { name: "Ethiopia Yirgacheffe", detail: "Pour Over • Large", qty: "2x", image: "/images/pour-over.png" },
  { name: "Almond Croissant", detail: "Warmed", qty: "1x", image: "/images/croissant.png" },
];

export default function OrderTrackingPage() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20">
        {/* Back link + header */}
        <header className="mb-8 md:mb-12 flex flex-col gap-2">
          <Link
            href="/order-confirmation"
            className="group flex items-center gap-2 text-primary hover:text-on-surface transition-colors"
          >
            <ArrowBackIcon />
            <span className="font-label text-sm uppercase tracking-widest">Back to Orders</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-headline text-on-surface font-black tracking-tight">
            Order #0047
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-start">

          {/* ════════════════════════════════════════
              LEFT COLUMN: Status + Timeline (60%)
              ════════════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-8 lg:space-y-12">

            {/* ── Large Status Card ── */}
            <section className="bg-surface-container-low rounded-xl p-8 md:p-10 relative overflow-hidden" style={{ boxShadow: "0 0 20px rgba(200,134,74,0.3)" }}>
              {/* Background glow */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-10">
                {/* Coffee icon with steam */}
                <div className="relative bg-surface-container-highest p-6 md:p-8 rounded-full">
                  <span className="text-primary">
                    <CoffeeIcon />
                  </span>
                  {/* Steam wisps */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2 text-primary/40">
                    <span className="text-lg animate-pulse">~</span>
                    <span className="text-xl animate-pulse" style={{ animationDelay: "0.3s" }}>~</span>
                    <span className="text-lg animate-pulse" style={{ animationDelay: "0.6s" }}>~</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-4xl font-headline text-on-surface mb-3">
                    Your order is being prepared
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="text-primary font-headline text-lg md:text-2xl italic">
                      Ready in approximately 8 minutes
                    </span>
                    <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full font-mono text-lg md:text-xl font-bold tracking-tighter">
                      08:24
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Vertical Timeline ── */}
            <section className="bg-surface-container-lowest rounded-xl p-8 md:p-10">
              <h3 className="font-headline text-2xl text-on-surface mb-8 md:mb-10">Tracking History</h3>
              <div className="relative space-y-0">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-outline-variant/30" />

                {timeline.map((step, i) => (
                  <div
                    key={step.label}
                    className={`relative flex gap-6 md:gap-8 ${i < timeline.length - 1 ? "pb-8 md:pb-10" : ""} ${
                      step.status === "upcoming" ? "opacity-40" : ""
                    }`}
                  >
                    {/* Node */}
                    <div
                      className={`z-10 flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
                        step.status === "done"
                          ? "bg-primary/20 text-primary"
                          : step.status === "active"
                          ? "bg-primary animate-pulse"
                          : "bg-surface-container-highest"
                      }`}
                      style={step.status === "active" ? { boxShadow: "0 0 15px rgba(200,134,74,0.6)" } : undefined}
                    >
                      {step.status === "done" ? (
                        <CheckCircleFillIcon />
                      ) : step.status === "active" ? (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      ) : (
                        <div className="w-3 h-3 bg-on-surface/20 rounded-full" />
                      )}
                    </div>

                    {/* Content */}
                    {step.status === "active" && step.detail ? (
                      <div className="flex flex-col p-5 md:p-6 rounded-xl bg-surface-container-high ring-1 ring-primary/30">
                        <p className="font-headline text-lg md:text-xl text-primary font-bold">{step.label}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-label text-on-surface/50 uppercase tracking-tighter">{step.time}</span>
                          <span className="text-[10px] text-on-surface/20">•</span>
                          <span className="text-xs text-primary font-label uppercase font-bold">{step.badge}</span>
                        </div>
                        <p className="text-on-surface/50 text-sm max-w-xs">{step.detail}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col pt-1">
                        <p className="font-headline text-lg text-on-surface">{step.label}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-label text-on-surface/30 uppercase tracking-tighter">{step.time}</span>
                          {step.badge && (
                            <>
                              <span className="text-[10px] text-on-surface/20">•</span>
                              <span className="text-xs text-primary font-label uppercase font-bold">{step.badge}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN: Summary + Map (40%, sticky)
              ════════════════════════════════════════ */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">

            {/* ── Order Summary ── */}
            <section className="bg-surface-container-low rounded-xl overflow-hidden">
              <div className="p-5 md:p-6 bg-surface-container-highest/50">
                <h3 className="font-headline text-xl text-on-surface">Order Summary</h3>
              </div>
              <div className="p-5 md:p-6 space-y-6">
                {orderItems.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <p className="font-headline text-on-surface">{item.name}</p>
                      <p className="text-sm text-on-surface/30 font-label uppercase tracking-widest">{item.detail}</p>
                    </div>
                    <p className="font-mono text-primary">{item.qty}</p>
                  </div>
                ))}

                <div className="pt-6 space-y-3" style={{ borderTop: "1px solid rgba(82,68,57,0.3)" }}>
                  <div className="flex justify-between text-on-surface/40 font-label text-sm uppercase">
                    <span>Subtotal</span>
                    <span>$24.50</span>
                  </div>
                  <div className="flex justify-between text-on-surface/40 font-label text-sm uppercase">
                    <span>Tax (8%)</span>
                    <span>$1.96</span>
                  </div>
                  <div className="flex justify-between text-on-surface font-headline text-2xl pt-2">
                    <span>Total</span>
                    <span className="text-primary">$26.46</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Café Info & Map ── */}
            <section className="bg-surface-container-low rounded-xl overflow-hidden">
              <div className="h-40 relative group">
                <Image
                  src="/images/cafe-map.png"
                  alt="Café location map"
                  fill
                  className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <LocationPinIcon />
                </div>
              </div>
              <div className="p-5 md:p-6">
                <h4 className="font-headline text-lg text-on-surface mb-2">Jennifer&apos;s Café • Downtown</h4>
                <p className="text-on-surface/40 text-sm mb-4 leading-relaxed">
                  124 Espresso Boulevard, Suite 200<br />
                  Coffee District, NY 10012
                </p>
                <div className="flex items-center gap-3">
                  <button className="flex-1 bg-surface-variant text-on-surface px-4 py-2.5 rounded-xl font-label text-xs uppercase tracking-widest font-bold hover:bg-surface-bright transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <PhoneIcon />
                    Call Café
                  </button>
                  <button className="flex-1 bg-surface-variant text-on-surface px-4 py-2.5 rounded-xl font-label text-xs uppercase tracking-widest font-bold hover:bg-surface-bright transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <DirectionsIcon />
                    Directions
                  </button>
                </div>
              </div>
            </section>

            {/* Cancel info */}
            <div className="px-2 space-y-1">
              <p className="text-on-surface/20 font-label text-[10px] uppercase tracking-[0.2em]">
                ⓘ Preparation in progress
              </p>
              <p className="text-on-surface/20 font-label text-sm italic">
                Can&apos;t cancel once preparation has started.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky status bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="amber-glow rounded-2xl px-6 py-4 flex justify-between items-center" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
          <div className="flex items-center gap-3 text-on-primary">
            <span className="font-mono text-lg font-bold">08:24</span>
            <span className="w-[1px] h-4 bg-on-primary/30" />
            <span className="font-label text-xs uppercase tracking-widest">Preparing</span>
          </div>
          <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs text-on-primary backdrop-blur-md transition-all cursor-pointer">
            View Receipt
          </button>
        </div>
      </div>
    </>
  );
}
