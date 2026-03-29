import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

/* ─────────────────────────────────────────────
   Reserve a Table Page
   Desktop: 60/40 — form left, sticky summary right
   Form: Calendar → Time slots → Party size → Special requests
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Reserve a Table | Jennifer's Café",
  description: "Book your spot at Jennifer's Café. Select your date, time, and party size.",
};

/* ── Icon Components ── */
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

function MinusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/* ── Static data ── */
const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];
const calendarDays = [
  { day: 28, disabled: true },
  { day: 29, disabled: true },
  { day: 30, disabled: true },
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6, today: true },
  { day: 7 },
  { day: 8 },
  { day: 9 },
  { day: 10, selected: true },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16 },
  { day: 17 },
  { day: 18 },
  { day: 19 },
];

const timeSlots = [
  { time: "08:00 AM", status: "available" as const },
  { time: "09:30 AM", status: "selected" as const },
  { time: "11:00 AM", status: "limited" as const },
  { time: "12:30 PM", status: "full" as const },
  { time: "01:15 PM", status: "available" as const },
  { time: "02:00 PM", status: "available" as const },
];

export default function ReserveTablePage() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">

          {/* ════════════════════════════════════════
              LEFT COLUMN: Booking Form (60%)
              ════════════════════════════════════════ */}
          <section className="w-full md:w-[60%] space-y-10 md:space-y-12">
            {/* Header */}
            <header>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline text-on-surface leading-tight tracking-tight">
                Reserve a Table
              </h1>
              <p className="text-on-surface/40 mt-4 text-lg max-w-xl">
                Join us for an exceptional coffee experience. Select your preferred date and time to secure your spot at the bar or a cozy corner.
              </p>
            </header>

            {/* ── Step 1: Date Selection ── */}
            <div className="bg-surface-container-low p-6 md:p-8 rounded-xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-headline text-primary">Select Date</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-surface-bright rounded-lg transition-colors cursor-pointer">
                    <ChevronLeftIcon />
                  </button>
                  <button className="p-2 hover:bg-surface-bright rounded-lg transition-colors cursor-pointer">
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm font-label">
                {dayHeaders.map((d, i) => (
                  <div key={`h-${i}`} className="text-on-surface/20 py-2">{d}</div>
                ))}
                {calendarDays.map((d) => (
                  <div
                    key={`d-${d.day}-${d.disabled ? "dis" : ""}`}
                    className={`py-3 rounded-lg text-sm cursor-pointer transition-colors ${
                      d.disabled
                        ? "text-on-surface/10 cursor-default"
                        : d.selected
                        ? "bg-primary text-deep-espresso font-bold"
                        : d.today
                        ? "ring-2 ring-primary"
                        : "hover:bg-surface-bright"
                    }`}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Step 2: Time Selection ── */}
            <div className="space-y-6">
              <h2 className="text-xl font-headline text-primary">Choose Time</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={slot.status === "full"}
                    className={`flex flex-col items-center py-4 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                      slot.status === "selected"
                        ? "bg-primary-container text-deep-espresso ring-2 ring-primary font-bold"
                        : slot.status === "full"
                        ? "bg-surface-container-lowest/50 opacity-40 cursor-not-allowed"
                        : "bg-surface-container-high hover:bg-surface-bright"
                    }`}
                  >
                    <span className="text-lg font-bold">{slot.time}</span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest mt-1 ${
                        slot.status === "selected"
                          ? "opacity-80"
                          : slot.status === "full"
                          ? "text-red-400"
                          : slot.status === "limited"
                          ? "text-yellow-400"
                          : "text-on-surface/20"
                      }`}
                    >
                      {slot.status === "selected" ? "Selected" : slot.status === "full" ? "Full" : slot.status === "limited" ? "Limited" : "Available"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Step 3: Party Size & Special Requests ── */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-headline text-primary">Party Size</h2>
                <div className="flex items-center justify-between bg-surface-container-highest p-4 rounded-xl">
                  <button className="w-12 h-12 flex items-center justify-center bg-surface-bright hover:bg-primary-container hover:text-deep-espresso rounded-full transition-colors cursor-pointer">
                    <MinusIcon />
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-bold font-headline">4</span>
                    <p className="text-[10px] uppercase tracking-tighter text-on-surface/20 font-label">
                      Guests
                    </p>
                  </div>
                  <button className="w-12 h-12 flex items-center justify-center bg-surface-bright hover:bg-primary-container hover:text-deep-espresso rounded-full transition-colors cursor-pointer">
                    <PlusIcon />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-headline text-primary">Special Requests</h2>
                <textarea
                  className="w-full bg-surface-container-highest rounded-xl h-[84px] p-4 text-sm text-on-surface placeholder:text-on-surface/20 outline-none ring-1 ring-transparent focus:ring-primary/30 transition-all resize-none"
                  placeholder="Allergies, seating preference, or special occasions..."
                />
              </div>
            </div>

            {/* CTA */}
            <button className="w-full amber-glow text-on-primary font-bold py-5 rounded-xl text-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer">
              Request Reservation
            </button>
          </section>

          {/* ════════════════════════════════════════
              RIGHT COLUMN: Reservation Summary (40%, sticky)
              ════════════════════════════════════════ */}
          <aside className="w-full md:w-[40%] md:sticky md:top-28 space-y-6">
            <div className="bg-surface-container-high rounded-xl overflow-hidden">
              {/* Café photo */}
              <div className="h-48 w-full overflow-hidden relative">
                <Image
                  src="/images/cafe-interior.png"
                  alt="Jennifer's Café interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent" />
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Summary details */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-headline text-on-surface">Reservation Summary</h3>
                  <div className="space-y-0">
                    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(82,68,57,0.3)" }}>
                      <span className="text-on-surface/30 text-sm">Date</span>
                      <span className="font-medium text-primary">Friday, May 10th</span>
                    </div>
                    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(82,68,57,0.3)" }}>
                      <span className="text-on-surface/30 text-sm">Time</span>
                      <span className="font-medium text-primary">09:30 AM</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-on-surface/30 text-sm">Party Size</span>
                      <span className="font-medium text-primary">4 People</span>
                    </div>
                  </div>
                </div>

                {/* Opening hours */}
                <div className="bg-surface-container p-5 md:p-6 rounded-lg space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface/20 flex items-center gap-2">
                    <ClockIcon />
                    Opening Hours
                  </h4>
                  <ul className="text-sm space-y-2 font-label">
                    <li className="flex justify-between">
                      <span className="text-on-surface/30">Mon — Fri</span>
                      <span>07:00 — 16:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-on-surface/30">Sat — Sun</span>
                      <span>08:00 — 18:00</span>
                    </li>
                  </ul>
                </div>

                {/* Info note */}
                <div className="flex items-center gap-3 text-on-surface/20 text-xs italic">
                  <InfoIcon />
                  <p>Tables are held for 15 minutes past reservation time.</p>
                </div>
              </div>
            </div>

            {/* Location card */}
            <div className="flex gap-4 p-4 bg-surface-container-low rounded-xl items-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <LocationIcon />
              </div>
              <div>
                <p className="text-sm font-bold">124 Espresso Way</p>
                <p className="text-xs text-on-surface/30">Coffee District, Metropolis</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BottomNav activeTab="reservations" />
      <div className="h-24 md:hidden" />
    </>
  );
}
