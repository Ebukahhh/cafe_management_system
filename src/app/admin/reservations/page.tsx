import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservations | Jennifer's Café Admin",
  description: "Manage daily reservations, confirm or decline guest requests.",
};

const summaryCards = [
  { label: "Today", value: "8", sub: "reservations", color: "" },
  { label: "Confirmed", value: "5", sub: "✓", color: "text-emerald-500" },
  { label: "Pending", value: "2", sub: "⏳", color: "text-amber-500", highlight: true },
  { label: "Declined", value: "1", sub: "", color: "text-on-surface/30" },
];

const pendingCards = [
  { time: "11:00am", guests: 4, name: "Marco Rossi", phone: "+39 345 123 4567", note: "Window seat if possible", noteIcon: "chat_bubble", submitted: "2 hours ago" },
  { time: "12:30pm", guests: 2, name: "Elena Gilbert", phone: "+1 202 555 0199", note: "Birthday celebration", noteIcon: "cake", submitted: "45 mins ago" },
];

const confirmedRows = [
  { time: "8:30am", name: "Sarah Jenkins", party: 2 },
  { time: "9:15am", name: "David Chen", party: 5 },
  { time: "10:00am", name: "Anna Varkis", party: 1 },
];

const slots = [
  { time: "8:00am", covers: 2 }, { time: "9:00am", covers: 8 }, { time: "10:00am", covers: 8 }, { time: "11:00am", covers: 4 },
];

export default function ReservationManagerPage() {
  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 right-0 left-0 lg:left-[240px] h-16 z-30 bg-deep-espresso/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-8">
        <h2 className="font-headline text-xl font-bold text-on-surface">Reservations</h2>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-surface-container px-3 py-1.5 rounded-full" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
            <span className="material-symbols-outlined text-on-surface/30 text-sm mr-2">search</span>
            <input className="bg-transparent border-none text-xs focus:ring-0 w-32 md:w-48 text-on-surface outline-none placeholder:text-on-surface/20" placeholder="Search guests..." />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-16 max-w-[1280px] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Center Canvas */}
        <div className="flex-1 space-y-8">
          {/* Date Navigator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
              <button className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface/30 cursor-pointer"><span className="material-symbols-outlined">chevron_left</span></button>
              <span className="px-4 font-headline font-semibold text-on-surface">Tuesday, 8 April 2025</span>
              <button className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface/30 cursor-pointer"><span className="material-symbols-outlined">chevron_right</span></button>
              <div className="h-6 w-px bg-on-surface/10 mx-1" />
              <button className="px-4 py-1.5 text-xs font-bold text-amber-500 hover:bg-amber-900/20 rounded-lg cursor-pointer">Today</button>
            </div>
            <div className="flex items-center bg-surface-container-highest p-1 rounded-xl w-fit">
              <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-surface-container-low text-on-surface shadow-sm">List</button>
              <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-on-surface/30 hover:text-on-surface cursor-pointer">Calendar</button>
            </div>
          </div>

          {/* Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map((c) => (
              <div key={c.label} className={`p-4 rounded-xl flex flex-col ${c.highlight ? "bg-amber-900/20" : "bg-surface-container"}`} style={c.highlight ? { border: "1px solid rgba(217,119,6,0.15)" } : { border: "1px solid rgba(82,68,57,0.08)" }}>
                <span className={`text-[10px] font-label uppercase tracking-widest mb-1 ${c.highlight ? "text-amber-400" : "text-on-surface/30"}`}>{c.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-headline font-bold ${c.color || "text-on-surface"}`}>{c.value}</span>
                  {c.sub && <span className="text-xs">{c.sub}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-6" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
            {["All", "Pending", "Confirmed", "Declined", "Completed"].map((t) => (
              <button key={t} className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${t === "Pending" ? "text-amber-500 border-b-2 border-amber-600" : "text-on-surface/30 hover:text-on-surface"}`}>
                {t}
                {t === "Pending" && <span className="ml-2 bg-amber-900/40 text-[10px] px-1.5 py-0.5 rounded-full">2</span>}
              </button>
            ))}
          </div>

          {/* Pending Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-label uppercase tracking-tighter text-on-surface/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Action Required
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingCards.map((p) => (
                <div key={p.name} className="bg-surface-container rounded-xl p-5 hover:shadow-md transition-shadow" style={{ borderLeft: "4px solid #f59e0b" }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xl font-mono font-bold text-on-surface">{p.time}</p>
                      <p className="text-xs text-on-surface/30 flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-sm">group</span>{p.guests} Guests</p>
                    </div>
                    <span className="bg-amber-900/30 text-amber-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Pending</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <h4 className="font-headline text-lg text-on-surface">{p.name}</h4>
                    <p className="text-sm text-on-surface/30 font-mono">{p.phone}</p>
                    <div className="bg-surface-container-low p-3 rounded-lg flex items-start gap-2" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
                      <span className="material-symbols-outlined text-on-surface/30 text-sm mt-0.5">{p.noteIcon}</span>
                      <p className="text-xs italic text-on-surface/60">&ldquo;{p.note}&rdquo;</p>
                    </div>
                    <p className="text-[10px] text-on-surface/20 mt-2">Submitted: {p.submitted}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer">Confirm</button>
                    <button className="flex-1 text-red-400 font-bold py-2 rounded-lg text-xs hover:bg-red-900/10 transition-colors cursor-pointer" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Confirmed Section */}
          <section className="space-y-3">
            <h3 className="text-xs font-label uppercase tracking-tighter text-on-surface/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmed Today
            </h3>
            <div className="space-y-2">
              {confirmedRows.map((r) => (
                <div key={r.name} className="bg-surface-container rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderLeft: "4px solid #10b981" }}>
                  <div className="flex items-center gap-6">
                    <span className="font-mono font-bold text-on-surface w-16">{r.time}</span>
                    <div>
                      <p className="font-bold text-sm">{r.name}</p>
                      <p className="text-xs text-on-surface/30">Party of {r.party}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-900/20 px-2 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span> Confirmed
                    </span>
                    <button className="text-xs font-bold text-amber-500 hover:underline cursor-pointer">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side Panel */}
        <aside className="w-full lg:w-[320px] space-y-6">
          <div className="bg-surface-container rounded-2xl p-6" style={{ border: "1px solid rgba(82,68,57,0.08)" }}>
            <h3 className="font-headline text-lg font-bold text-on-surface mb-6">Slot Capacity Settings</h3>
            <div className="space-y-6">
              {slots.map((s) => (
                <div key={s.time} className="flex items-center justify-between">
                  <span className="font-mono text-sm text-on-surface/40">{s.time}</span>
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface/30 hover:bg-surface-container-low cursor-pointer" style={{ border: "1px solid rgba(82,68,57,0.2)" }}><span className="material-symbols-outlined text-lg">remove</span></button>
                    <span className="font-bold w-4 text-center">{s.covers}</span>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface/30 hover:bg-surface-container-low cursor-pointer" style={{ border: "1px solid rgba(82,68,57,0.2)" }}><span className="material-symbols-outlined text-lg">add</span></button>
                    <span className="text-[10px] text-on-surface/20 w-10">covers</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-amber-900/20 cursor-pointer">Save Capacity Settings</button>
            <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid rgba(82,68,57,0.08)" }}>
              <button className="text-xs font-bold text-amber-500 flex items-center justify-center gap-2 hover:underline cursor-pointer mx-auto"><span className="material-symbols-outlined text-sm">block</span> Block a date or slot</button>
            </div>
          </div>
          {/* Peak Hour */}
          <div className="amber-glow p-6 rounded-2xl text-on-primary">
            <p className="text-[10px] font-label uppercase tracking-widest opacity-80 mb-1">Peak Hour Today</p>
            <h4 className="font-headline text-2xl font-bold mb-4">9:00am - 10:30am</h4>
            <p className="text-xs opacity-90 leading-relaxed">95% capacity reach predicted based on confirmed reservations and historical trends.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
