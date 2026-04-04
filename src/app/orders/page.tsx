import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────
   Order History Page
   Editorial header + filter tabs → Active order highlight card
   → Recent history table rows + pagination
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Your Orders | Jennifer's Café",
  description: "Track your current orders and revisit past favorites at Jennifer's Café.",
};

/* ── Icon Components ── */
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CafeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-60 transition-opacity duration-500">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

/* ── Static data ── */
const filters = ["All", "Active", "Completed", "Cancelled"];

const pastOrders = [
  {
    date: "Oct 12, 2023",
    number: "#0039",
    items: "Avocado Toast, Flat White (x2)",
    total: "$24.50",
    status: "completed" as const,
  },
  {
    date: "Oct 10, 2023",
    number: "#0035",
    items: "Cortado, Cinnamon Roll",
    total: "$12.00",
    status: "cancelled" as const,
  },
  {
    date: "Oct 08, 2023",
    number: "#0028",
    items: "V60 Ethiopian, Almond Croissant",
    total: "$16.75",
    status: "completed" as const,
  },
];

export default function OrderHistoryPage() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-40 md:pb-20">
        {/* ── Editorial Header + Filters ── */}
        <section className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl md:text-7xl font-light italic mb-4 text-on-surface">
              Your Orders
            </h1>
            <p className="text-on-surface/40 text-lg max-w-md leading-relaxed">
              From freshly roasted beans to artisan pastries, track your current cravings and revisit past favorites.
            </p>
          </div>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {filters.map((f) => (
              <button
                key={f}
                className={`px-6 py-2 whitespace-nowrap transition-all cursor-pointer ${
                  f === "Active"
                    ? "text-primary font-bold"
                    : "text-on-surface/30 font-medium hover:text-primary"
                }`}
                style={f === "Active" ? { borderBottom: "2px solid var(--color-primary, #C8864A)" } : undefined}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* ── Active Orders: Bento Highlight ── */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-outline-variant/20" />
            <h2 className="font-headline text-2xl italic text-primary">In Progress</h2>
            <div className="h-px w-12 bg-outline-variant/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Highlight card */}
            <div className="lg:col-span-7 bg-surface-container-low rounded-xl overflow-hidden group hover:bg-surface-container transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/pour-over.png"
                  alt="Active order"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                  <span className="bg-primary/20 backdrop-blur-md text-primary px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase">
                    Order #0047
                  </span>
                  <span className="text-on-surface/40 font-mono text-xs italic">5 mins ago</span>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                    </span>
                    <h3 className="font-headline text-2xl text-on-surface italic">Being Prepared</h3>
                  </div>
                  <p className="text-on-surface/40 text-lg">Pour Over (Oat) + Battenberg Cake</p>
                </div>
                <Link
                  href="/order-tracking"
                  className="amber-glow px-8 py-3 rounded-xl text-on-primary font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  Track Order
                </Link>
              </div>
            </div>

            {/* Empty state / upsell */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl flex flex-col items-center justify-center p-10 md:p-12 text-center group">
              <div className="mb-6 relative text-on-surface/20">
                <CafeIcon />
              </div>
              <h4 className="font-headline text-xl text-on-surface italic mb-2">Expecting more?</h4>
              <p className="text-on-surface/30 text-sm mb-6 max-w-xs">
                Discover our seasonal roasts and new arrivals for your next ritual.
              </p>
              <Link href="/" className="text-primary font-bold hover:underline underline-offset-4">
                Browse Menu
              </Link>
            </div>
          </div>
        </section>

        {/* ── Recent History ── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-2xl italic text-on-surface">Recent History</h2>
            <div className="text-on-surface/30 font-mono text-xs">Page 1–4 of 12</div>
          </div>

          <div className="space-y-4">
            {pastOrders.map((order) => (
              <div
                key={order.number}
                className="group bg-surface-container-low hover:bg-surface-container-high rounded-xl p-5 md:p-6 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
              >
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-xs font-mono text-on-surface/20 uppercase tracking-tighter mb-1">Date</p>
                    <p className="text-on-surface font-medium">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-on-surface/20 uppercase tracking-tighter mb-1">Order #</p>
                    <p className="text-on-surface font-mono">{order.number}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs font-mono text-on-surface/20 uppercase tracking-tighter mb-1">Items</p>
                    <p className="text-on-surface truncate">{order.items}</p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-xs font-mono text-on-surface/20 uppercase tracking-tighter mb-1">Total</p>
                    <p className="text-primary font-bold">{order.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      order.status === "completed"
                        ? "bg-surface-bright text-on-surface/50"
                        : "bg-red-900/20 text-red-400"
                    }`}
                  >
                    {order.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-on-surface/30 hover:text-primary transition-colors cursor-pointer">
                      <EyeIcon />
                    </button>
                    <button className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg text-sm font-bold hover:bg-surface-bright transition-all cursor-pointer">
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface/30 hover:bg-surface-container transition-all cursor-pointer">
              <ChevronLeftIcon />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-primary text-deep-espresso font-bold cursor-pointer">1</button>
              <button className="w-10 h-10 rounded-full text-on-surface/30 hover:bg-surface-container cursor-pointer">2</button>
              <button className="w-10 h-10 rounded-full text-on-surface/30 hover:bg-surface-container cursor-pointer">3</button>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface/30 hover:bg-surface-container transition-all cursor-pointer">
              <ChevronRightIcon />
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
