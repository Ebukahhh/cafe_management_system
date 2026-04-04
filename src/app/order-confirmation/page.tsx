import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────
   Order Confirmation Page
   Centered layout: success animation → status timeline →
   cream order summary card → action buttons → subscription upsell
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Order Confirmed | Jennifer's Café",
  description: "Your order has been placed. Track your brew in real-time.",
};

/* ── Icon Components ── */
function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CreditCardSmallIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
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

/* ── Status timeline steps ── */
const timelineSteps = [
  { label: "Order Placed", time: "8:42 AM", status: "done" as const },
  { label: "Preparing", time: "Barista is crafting your brew", status: "active" as const },
  { label: "Ready for Pickup", time: "Expected at 8:55 AM", status: "upcoming" as const },
  { label: "Collected", time: "Hand-off at counter", status: "upcoming" as const },
];

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />

      <main className="max-w-[640px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24 flex flex-col items-center">

        {/* ── Success header ── */}
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
            {/* Ping animation ring */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
            <span className="text-primary relative">
              <CheckCircleIcon />
            </span>
          </div>
          <h1 className="font-headline text-4xl mb-3 text-on-surface tracking-tight">Order placed!</h1>
          <p className="text-on-surface/50 text-lg">
            We&apos;ve got your order. See you soon.
          </p>
        </div>

        {/* ── Status Timeline (Horizontal on desktop, vertical on mobile) ── */}
        {/* Desktop: horizontal */}
        <div className="w-full mb-12 px-4 hidden md:block">
          <div className="relative flex justify-between items-start w-full">
            {/* Background line */}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-surface-container-highest z-0" />
            {/* Active progress line — 50% */}
            <div className="absolute top-4 left-0 w-[50%] h-0.5 bg-primary z-0" />

            {timelineSteps.map((step) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === "done"
                      ? "bg-primary text-deep-espresso"
                      : step.status === "active"
                      ? "bg-primary"
                      : "bg-surface-container-highest"
                  }`}
                >
                  {step.status === "done" ? (
                    <CheckIcon />
                  ) : step.status === "active" ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-deep-espresso animate-pulse" />
                  ) : null}
                </div>
                <span
                  className={`font-label text-[10px] uppercase tracking-wider text-center ${
                    step.status === "done"
                      ? "text-primary"
                      : step.status === "active"
                      ? "text-on-surface"
                      : "text-on-surface/30"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="w-full text-left px-4 mb-12 md:hidden">
          <div className="relative flex flex-col gap-8">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-surface-container-highest" />

            {timelineSteps.map((step) => (
              <div key={step.label} className="relative flex items-center gap-6">
                <div
                  className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                    step.status === "done"
                      ? "bg-primary text-deep-espresso"
                      : step.status === "active"
                      ? "bg-primary ring-4 ring-primary/20"
                      : "bg-surface-container-highest"
                  }`}
                >
                  {step.status === "done" ? (
                    <CheckIcon />
                  ) : step.status === "active" ? (
                    <div className="w-2 h-2 rounded-full bg-deep-espresso" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-on-surface/20" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-bold ${
                      step.status === "active"
                        ? "text-primary"
                        : step.status === "done"
                        ? "text-on-surface"
                        : "text-on-surface/30"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`text-xs ${
                      step.status === "done"
                        ? "font-mono text-on-surface/40"
                        : "text-on-surface/30"
                    }`}
                  >
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Order Summary Card (Cream/warm) ── */}
        <div className="w-full bg-[#F5EDE5] rounded-xl p-6 md:p-8 mb-8 text-[#1A1208] overflow-hidden relative">
          <div className="flex justify-between items-start mb-8 pb-6" style={{ borderBottom: "1px solid rgba(26,18,8,0.08)" }}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#1A1208]/40 mb-1">Order Number</p>
              <p className="font-mono text-xl font-bold">#0047</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#1A1208]/40 mb-1">Pickup Time</p>
              <p className="font-body font-semibold">Today at 9:00am</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-bold">2x Pour Over</span>
                <span className="text-sm text-[#1A1208]/60 italic">Oat, Large</span>
              </div>
              <span className="font-mono text-[#1A1208]/60">$13.00</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-bold">1x Almond Croissant</span>
                <span className="text-sm text-[#1A1208]/60 italic">Warmed</span>
              </div>
              <span className="font-mono text-[#1A1208]/60">$5.50</span>
            </div>
          </div>

          {/* Totals */}
          <div className="pt-6 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(26,18,8,0.12)" }}>
            <div className="flex justify-between items-center text-[#1A1208]/60">
              <span className="text-sm">Service Fee</span>
              <span className="font-mono text-sm">$0.60</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-headline text-xl">Total paid</span>
              <span className="font-mono text-xl font-bold">$19.10</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="mt-8 flex items-center gap-3 bg-[#1A1208]/5 p-4 rounded-lg">
            <CreditCardSmallIcon />
            <span className="text-sm text-[#1A1208]/60">Visa ending 4747</span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col md:flex-row gap-4 w-full mb-12">
          <Link
            href="/order-tracking"
            className="flex-1 amber-glow text-on-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Track Order
          </Link>
          <Link
            href="/"
            className="flex-1 bg-surface-container-high text-on-surface py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-surface-bright active:scale-[0.98] transition-all"
          >
            Back to Menu
          </Link>
        </div>

        {/* ── Subscription Upsell ── */}
        <div className="w-full bg-surface-container-low rounded-xl overflow-hidden">
          <div className="bg-surface-container-high rounded-lg p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <RepeatIcon />
              </div>
              <div>
                <h3 className="font-headline text-lg md:text-xl text-on-surface">Love this order? Subscribe to it.</h3>
                <p className="text-on-surface/40 text-sm">Get this every weekday at 9am</p>
              </div>
            </div>
            <button className="bg-primary/10 text-primary px-6 py-3 rounded-full font-body font-semibold text-sm hover:bg-primary/20 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1">
              Set Up Subscription
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
