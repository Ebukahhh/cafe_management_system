import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

/* ─────────────────────────────────────────────
   Subscription Setup Page
   Centered max-width layout: context card →
   5-step form (frequency, time, alerts, end date, payment) → CTA
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Set Up Your Subscription | Jennifer's Café",
  description: "Craft your perfect daily ritual. Set frequency, time, and payment for automatic orders.",
};

/* ── Icons ── */
function CalendarIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function BriefcaseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4z" /></svg>;
}
function EditCalIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M14 14l2 2-4 1 1-4z" /></svg>;
}
function RepeatIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}
function CheckSmallIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
function ChevronUpIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>;
}
function ChevronDnIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
}
function ArrowFwdIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}

const frequencies = [
  { icon: <CalendarIcon />, label: "Every day", desc: "Consistency for the daily grinder.", selected: false },
  { icon: <BriefcaseIcon />, label: "Weekdays only", desc: "Monday through Friday fuel.", selected: true },
  { icon: <EditCalIcon />, label: "Specific days", desc: "You choose your rhythm.", selected: false },
  { icon: <RepeatIcon />, label: "Every week", desc: "A weekly treat to look forward to.", selected: false },
];

export default function SubscriptionSetupPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[760px] mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight">Set up your subscription</h1>
          <p className="text-on-surface/40">Craft your perfect daily ritual at Jennifer&apos;s Café.</p>
        </div>

        {/* Context Card (cream) */}
        <section className="bg-[#F5EDE5] rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
              <Image src="/images/pour-over.png" alt="Pour over coffee" fill className="object-cover" sizes="80px" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-label uppercase tracking-widest text-[#1A1208]/40">You&apos;re subscribing to:</p>
              <h3 className="text-lg md:text-xl font-headline font-bold text-[#1A1208]">Pour Over (Oat Milk, Large) + Croissant</h3>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-[#1A1208]">$11.50 <span className="text-sm font-normal opacity-60">/ per delivery</span></span>
                <button className="text-sm font-medium underline underline-offset-4 text-[#1A1208]/60 hover:text-[#1A1208] transition-colors cursor-pointer">Edit items</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Step 1: Frequency ── */}
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">01</span>
            <h2 className="text-2xl font-headline font-bold">How often?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {frequencies.map((f) => (
              <div key={f.label} className={`p-6 rounded-xl cursor-pointer transition-all ${f.selected ? "bg-surface-container-high ring-2 ring-primary" : "bg-surface-container-low hover:bg-surface-container"}`}>
                <div className="flex justify-between items-start">
                  <span className={f.selected ? "text-primary" : "text-on-surface/30"}>{f.icon}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${f.selected ? "bg-primary text-deep-espresso" : "border border-on-surface/20"}`}>
                    {f.selected && <CheckSmallIcon />}
                  </div>
                </div>
                <h4 className={`mt-4 font-bold text-lg ${f.selected ? "text-primary" : ""}`}>{f.label}</h4>
                <p className="text-sm text-on-surface/30 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step 2 & 3: Time + Alerts ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">02</span>
              <h2 className="text-2xl font-headline font-bold">What time?</h2>
            </div>
            <div className="bg-surface-container-highest rounded-xl p-4 flex items-center justify-between">
              <span className="text-3xl font-headline font-bold px-4">07:30</span>
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-sm font-bold text-primary uppercase">AM</span>
                <span className="text-xs text-on-surface/20">PM</span>
              </div>
              <div className="flex flex-col gap-2">
                <button className="p-1 hover:bg-surface-bright rounded cursor-pointer"><ChevronUpIcon /></button>
                <button className="p-1 hover:bg-surface-bright rounded cursor-pointer"><ChevronDnIcon /></button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">03</span>
              <h2 className="text-2xl font-headline font-bold">Alerts</h2>
            </div>
            <div className="bg-surface-container rounded-xl p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold">Advance notice</p>
                <p className="text-sm text-on-surface/30">Notify me 30 minutes before</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer" style={{ boxShadow: "0 0 8px rgba(200,134,74,0.2)" }}>
                <div className="absolute right-1 top-1 w-4 h-4 bg-deep-espresso rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Step 4: End Date ── */}
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">04</span>
            <h2 className="text-2xl font-headline font-bold">End date</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-4 p-5 bg-surface-container-high rounded-xl cursor-pointer ring-2 ring-primary/20">
              <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full" />
              </div>
              <span className="font-medium text-lg">Keep going until I cancel</span>
            </label>
            <label className="flex items-center gap-4 p-5 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
              <div className="w-6 h-6 rounded-full border-2 border-on-surface/20" />
              <span className="font-medium text-lg text-on-surface/30">End on a date</span>
            </label>
          </div>
        </div>

        {/* ── Step 5: Payment ── */}
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">05</span>
            <h2 className="text-2xl font-headline font-bold">Payment method</h2>
          </div>
          <div className="bg-surface-container-highest rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-deep-espresso rounded flex items-center justify-center text-blue-400 font-bold italic text-[10px]">VISA</div>
              <div>
                <p className="font-bold">Visa ending in 4747</p>
                <p className="text-sm text-on-surface/30">Expires 12/26</p>
              </div>
            </div>
            <button className="text-sm font-label text-primary hover:underline underline-offset-4 cursor-pointer">Change</button>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8 space-y-4">
          <button className="w-full h-16 amber-glow rounded-full text-on-primary font-bold text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group" style={{ boxShadow: "0 10px 30px rgba(200,134,74,0.3)" }}>
            Start Subscription
            <span className="group-hover:translate-x-1 transition-transform"><ArrowFwdIcon /></span>
          </button>
          <p className="text-center text-sm text-on-surface/20 max-w-md mx-auto">
            By starting your subscription, you agree to our Terms of Service. You can pause or cancel anytime from your profile.
          </p>
        </div>
      </main>
      <BottomNav activeTab="home" />
      <div className="h-24 md:hidden" />
    </>
  );
}
