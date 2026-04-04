import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────
   Checkout Page
   Desktop: 60/40 — form left, sticky order summary right
   Mobile: collapsible summary → form → sticky bottom CTA
   4-step form: Order Type → Pickup Time → Your Details → Payment
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Checkout | Jennifer's Café",
  description: "Review your order and complete checkout at Jennifer's Café.",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/checkout');
  }

  // Fetch full user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Dynamically fetch pickup capacities
  // We'll map them from the block structure to strings
  const { data: slots } = await supabase
    .from('slot_capacity')
    .select('time_slot')
    .order('time_slot', { ascending: true });

  const dynamicSlots = slots ? slots.map((s) => s.time_slot) : [];

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* ════════════════════════════════════════
              LEFT COLUMN: Form Steps (60%)
              ════════════════════════════════════════ */}
          <div className="lg:w-[60%] space-y-10">
            {/* Page header */}
            <header>
              <h1 className="font-headline text-3xl md:text-4xl text-on-surface mb-2">Checkout</h1>
              <p className="text-on-surface/50 font-body">Review your selection and complete your order.</p>
            </header>

            {/* ── Step 1: Order Type ── */}
            <section className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
                <h2 className="font-headline text-2xl">Order Type</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {/* Pickup — selected */}
                <button className="cursor-pointer p-4 rounded-xl bg-surface-container-high ring-2 ring-primary transition-all">
                  <div className="flex flex-col items-center text-center gap-2 text-primary">
                    <StorefrontIcon />
                    <span className="font-medium text-sm">Pickup</span>
                  </div>
                </button>
                {/* Delivery */}
                <button className="cursor-pointer p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all">
                  <div className="flex flex-col items-center text-center gap-2 text-on-surface/40">
                    <DeliveryIcon />
                    <span className="font-medium text-sm">Delivery</span>
                  </div>
                </button>
                {/* Dine In */}
                <button className="cursor-pointer p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all">
                  <div className="flex flex-col items-center text-center gap-2 text-on-surface/40">
                    <DineInIcon />
                    <span className="font-medium text-sm">Dine In</span>
                  </div>
                </button>
              </div>
            </section>

            {/* ── Step 2: Pickup Time ── */}
            <section className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
                <h2 className="font-headline text-2xl">Pickup Time</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-surface-container rounded-2xl p-5 md:p-6">
                {/* Mini calendar */}
                <div className="flex-shrink-0 w-full md:w-48 bg-surface-container-lowest rounded-xl p-4">
                  <div className="text-xs font-bold text-primary uppercase mb-3 text-center font-label">October</div>
                  <div className="grid grid-cols-7 gap-1 text-[10px] text-on-surface/30 mb-2 font-mono text-center">
                    {dayLabels.map((d, i) => (
                      <div key={`weekday-label-${i}`}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {calendarDays.map((day) => (
                      <div
                        key={day}
                        className={`p-1 rounded-full ${day === 14
                            ? "bg-primary text-deep-espresso font-bold"
                            : day < 14
                              ? "text-on-surface/20"
                              : "text-on-surface"
                          }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Time slots */}
                <div className="flex-grow">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        className="px-4 py-2.5 rounded-lg bg-surface-container-highest text-on-surface text-sm font-medium hover:bg-surface-bright transition-all cursor-pointer"
                      >
                        {slot}
                      </button>
                    ))}
                    <button className="px-4 py-2.5 rounded-lg bg-primary text-deep-espresso font-bold text-sm cursor-pointer ring-2 ring-primary">
                      ASAP
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Step 3: Your Details ── */}
            <section className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
                <h2 className="font-headline text-2xl">Your Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="checkout-name" className="text-sm font-medium text-on-surface/50 font-body block">Full Name</label>
                  <input
                    id="checkout-name"
                    type="text"
                    defaultValue="Jennifer Sterling"
                    className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface outline-none font-body ring-1 ring-transparent focus:ring-primary/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="checkout-email" className="text-sm font-medium text-on-surface/50 font-body block">Email Address</label>
                  <input
                    id="checkout-email"
                    type="email"
                    defaultValue="jennifer@cafe-admin.com"
                    className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface outline-none font-body ring-1 ring-transparent focus:ring-primary/30 transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="checkout-phone" className="text-sm font-medium text-on-surface/50 font-body block">Phone Number</label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface placeholder:text-on-surface/20 outline-none font-body ring-1 ring-transparent focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* ── Step 4: Payment ── */}
            <section className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</span>
                <h2 className="font-headline text-2xl">Payment</h2>
              </div>

              <div className="space-y-4">
                {/* Saved card — selected */}
                <div className="flex items-center justify-between p-5 rounded-xl bg-surface-container-high ring-2 ring-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-deep-espresso rounded flex items-center justify-center text-blue-400 font-bold italic text-sm">
                      VISA
                    </div>
                    <div>
                      <div className="text-sm font-bold">Visa ending in 4747</div>
                      <div className="text-xs text-on-surface/40">Expires 12/26</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-deep-espresso" />
                  </div>
                </div>

                {/* Add new card (collapsed) */}
                <div className="p-5 rounded-xl bg-surface-container-low space-y-5">
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4 text-on-surface/40">
                      <CreditCardIcon />
                      <span className="text-sm font-medium">Add a new card</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-surface-variant" />
                  </div>
                  {/* Disabled fields */}
                  <div className="space-y-4 pt-4 opacity-40">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-on-surface/30 font-label">Card Number</label>
                      <div className="relative">
                        <input
                          disabled
                          placeholder="0000 0000 0000 0000"
                          className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface cursor-not-allowed outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-on-surface/30 font-label">Expiry</label>
                        <input disabled placeholder="MM/YY" className="w-full h-12 px-4 rounded-lg bg-surface-container-highest cursor-not-allowed outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-on-surface/30 font-label">CVC</label>
                        <input disabled placeholder="***" className="w-full h-12 px-4 rounded-lg bg-surface-container-highest cursor-not-allowed outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo code */}
              <div className="flex gap-3 pt-2">
                <input
                  placeholder="Promo code"
                  className="flex-grow h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface placeholder:text-on-surface/20 outline-none ring-1 ring-transparent focus:ring-primary/30 transition-all"
                />
                <button className="px-8 h-12 rounded-xl bg-surface-variant text-on-surface font-bold hover:bg-surface-bright transition-all cursor-pointer">
                  Apply
                </button>
              </div>
            </section>
          </div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN: Order Summary (40%, sticky)
              ════════════════════════════════════════ */}
          <div className="lg:w-[40%]">
            <div className="sticky top-8 bg-surface-container rounded-2xl p-6 md:p-8">
              <h3 className="font-headline text-2xl mb-8">Order Summary</h3>

              {/* Items */}
              <div className="space-y-6 mb-8">
                {orderItems.map((item) => (
                  <div key={item.name} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm">
                          {item.name} <span className="text-on-surface/40 font-normal">x{item.qty}</span>
                        </h4>
                        <span className="text-sm font-bold font-mono">{item.price}</span>
                      </div>
                      <p className="text-xs text-on-surface/40 mt-1">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 py-6">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface/50">Subtotal</span>
                  <span className="font-mono">$18.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface/50">Delivery fee</span>
                  <span className="font-mono text-green-400">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface/50">Loyalty discount</span>
                  <span className="font-mono text-primary">-$2.00</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-6 mb-6">
                <span className="font-headline text-xl">Total</span>
                <span className="font-headline text-3xl text-primary tracking-tight">$16.50</span>
              </div>

              {/* Place Order CTA — desktop */}
              <Link
                href="/order-confirmation"
                className="hidden lg:flex w-full amber-glow py-4 rounded-full items-center justify-center gap-3 text-on-primary font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <LockIcon />
                Place Order
              </Link>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 mt-5">
                <ShieldIcon />
                <p className="text-[11px] text-on-surface/30 uppercase tracking-widest text-center font-label">
                  Secured by Stripe. Your card details are never stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 w-full z-40 px-4 py-3 bg-deep-espresso/80 backdrop-blur-xl lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link
          href="/order-confirmation"
          className="flex w-full amber-glow text-on-primary py-4 rounded-xl font-headline text-lg font-bold active:scale-[0.98] transition-all items-center justify-center gap-2"
        >
          <LockIcon />
          Place Order — $16.50
        </Link>
      </div>
    </>
  );
}
