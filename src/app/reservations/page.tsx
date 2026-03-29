import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

/* ─────────────────────────────────────────────
   My Reservations Page
   Tab filters → Upcoming (confirmed card) → Pending →
   Past rows → Sidebar (event CTA + empty state + policy)
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "My Reservations | Jennifer's Café",
  description: "Manage your upcoming visits and view your reservation history.",
};

/* ── Icon helpers ── */
function CheckCircleSmall() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}
function HourglassIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function CalendarAddIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const tabs = ["Upcoming", "Pending", "Past", "Cancelled"];
const pastReservations = [
  { month: "MAR", day: "22", title: "Table for 2 • Dinner", ref: "#RES-7104" },
  { month: "FEB", day: "14", title: "Valentine's Special • 2 Guests", ref: "#RES-6502" },
];

export default function MyReservationsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-40 md:pb-20">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-primary mb-4 tracking-tight">My Reservations</h1>
          <p className="text-on-surface/40 max-w-xl text-lg">Manage your upcoming visits and view your history with us. We look forward to hosting you.</p>
        </div>

        {/* Tab Filters */}
        <div className="flex overflow-x-auto gap-6 md:gap-10 mb-10 md:mb-12 py-2 sticky top-[72px] bg-deep-espresso/95 backdrop-blur-md z-40" style={{ borderBottom: "1px solid rgba(61,51,39,0.5)" }}>
          {tabs.map((t) => (
            <button key={t} className={`pb-4 whitespace-nowrap transition-all cursor-pointer ${t === "Upcoming" ? "text-primary font-bold" : "text-on-surface/20 font-medium hover:text-primary"}`} style={t === "Upcoming" ? { borderBottom: "2px solid var(--color-primary, #C8864A)" } : undefined}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── Main Content ── */}
          <div className="lg:col-span-8 space-y-10 md:space-y-12">

            {/* Upcoming — Confirmed Card (cream) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl text-on-surface">Upcoming</h2>
                <span className="font-mono text-xs text-on-surface/20 bg-surface-container px-3 py-1 rounded-full">1 TOTAL</span>
              </div>
              <div className="relative bg-[#FDFBF7] rounded-xl overflow-hidden flex flex-col md:flex-row items-stretch hover:-translate-y-1 transition-transform" style={{ borderLeft: "8px solid #C8864A" }}>
                <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden relative">
                  <Image src="/images/cafe-interior.png" alt="Café interior" fill className="object-cover" sizes="(max-width:768px) 100vw, 192px" />
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircleSmall /> Confirmed
                      </div>
                      <div className="text-[#1A1208] font-mono text-sm font-bold">#RES-8821</div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-headline text-[#1A1208] mb-2 leading-tight">Saturday 5 April</h3>
                    <div className="flex flex-wrap gap-4 text-stone-600 mb-6">
                      <div className="flex items-center gap-1.5 text-sm"><ClockIcon /> 11:00 AM</div>
                      <div className="flex items-center gap-1.5 text-sm"><PeopleIcon /> 4 Guests</div>
                      <div className="flex items-center gap-1.5 text-sm"><MapPinIcon /> Window Table</div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 pt-6" style={{ borderTop: "1px solid #e5e0d8" }}>
                    <button className="flex-1 py-3 px-6 rounded-xl text-stone-700 font-bold text-sm hover:bg-stone-100 transition-colors uppercase tracking-wider cursor-pointer" style={{ border: "1px solid #d1ccc4" }}>Cancel</button>
                    <button className="flex-1 py-3 px-6 rounded-xl amber-glow text-on-primary font-bold text-sm hover:brightness-110 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                      <CalendarAddIcon /> Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Pending */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl text-on-surface">Pending</h2>
              </div>
              <div className="bg-surface-container-low rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-6">
                    <HourglassIcon /> Awaiting Confirmation
                  </div>
                  <h3 className="text-2xl font-headline text-on-surface mb-2">Friday 11 April</h3>
                  <p className="text-on-surface/30 font-mono text-xs mb-4 uppercase tracking-widest">Requested: 7:00 PM • 2 Guests</p>
                  <p className="text-sm text-on-surface/40 italic">&quot;Our team is currently reviewing your request. You&apos;ll receive a notification within 2 hours.&quot;</p>
                </div>
                <div className="flex flex-col w-full md:w-auto gap-3">
                  <button className="w-full md:w-48 py-3 rounded-xl bg-surface-container-highest text-on-surface font-medium text-sm hover:bg-surface-bright transition-all cursor-pointer">Edit Request</button>
                  <button className="w-full md:w-48 py-3 rounded-xl text-on-surface/30 font-medium text-sm hover:text-red-400 transition-all cursor-pointer" style={{ border: "1px solid rgba(82,68,57,0.3)" }}>Withdraw</button>
                </div>
              </div>
            </section>

            {/* Past Reservations */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl text-on-surface">Past Reservations</h2>
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">View All <ArrowRightIcon /></button>
              </div>
              <div className="space-y-4">
                {pastReservations.map((r) => (
                  <div key={r.ref} className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex flex-col items-center justify-center text-on-surface/40">
                        <span className="text-[10px] font-mono leading-none">{r.month}</span>
                        <span className="text-lg font-bold leading-none">{r.day}</span>
                      </div>
                      <div>
                        <div className="font-headline text-lg">{r.title}</div>
                        <div className="text-xs text-on-surface/30 font-mono">COMPLETED • {r.ref}</div>
                      </div>
                    </div>
                    <div className="text-on-surface/20 group-hover:text-primary transition-colors">
                      <ChevronDownIcon />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Event CTA */}
            <div className="bg-surface-container-high rounded-2xl p-8 overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-headline text-2xl text-primary mb-2">Host an Event?</h4>
                <p className="text-on-surface/40 text-sm mb-6 leading-relaxed">Planning a birthday or corporate gathering? Our private lounge is available for booking.</p>
                <button className="w-full py-4 px-6 rounded-xl amber-glow text-on-primary font-bold text-sm hover:scale-[1.02] transition-transform uppercase tracking-widest cursor-pointer">Inquire Now</button>
              </div>
            </div>
            {/* Empty State */}
            <div className="bg-surface-container-low rounded-2xl p-10 flex flex-col items-center text-center" style={{ border: "2px dashed rgba(82,68,57,0.2)" }}>
              <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-6 text-on-surface/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="9" y1="16" x2="15" y2="16" /></svg>
              </div>
              <h5 className="font-headline text-xl mb-2">No more upcoming?</h5>
              <p className="text-on-surface/30 text-sm mb-8">It&apos;s quiet in here. Why not secure your next coffee experience today?</p>
              <Link href="/reserve" className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">Book a Table <ArrowRightIcon /></Link>
            </div>
            {/* Policy */}
            <div className="p-6 bg-surface-container rounded-xl">
              <h6 className="text-xs font-mono text-on-surface/20 uppercase tracking-widest mb-4">Reservation Policy</h6>
              <ul className="space-y-3 text-xs text-on-surface/40 leading-relaxed">
                <li className="flex gap-2"><span className="text-primary">•</span> Cancellations must be made 24 hours in advance to avoid a service fee.</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Tables will be held for a maximum of 15 minutes past reservation time.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <BottomNav activeTab="reservations" />
      <div className="h-24 md:hidden" />
    </>
  );
}
