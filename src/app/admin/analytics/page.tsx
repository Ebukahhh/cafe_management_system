import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | Jennifer's Café Admin",
  description: "Sales analytics dashboard with revenue, orders, and product performance.",
};

const kpis = [
  { label: "Total Revenue", value: "$2,840.00", change: "12%", spark: "M0 35 Q10 32 20 25 T40 28 T60 15 T80 10 T100 5", color: "text-primary" },
  { label: "Total Orders", value: "241", change: "8%", spark: "M0 30 Q15 25 30 35 T60 20 T90 25 T100 15", color: "text-on-surface" },
  { label: "Avg. Order Value", value: "$11.78", change: "3%", spark: "M0 25 Q20 25 40 20 T60 18 T80 15 T100 12", color: "text-on-surface" },
  { label: "Subscription Rev.", value: "$820.00", change: "5%", spark: "M0 35 L20 30 L40 32 L60 20 L80 15 L100 5", color: "text-on-surface" },
];

const topProducts = [
  { name: "Pour Over", count: 68, pct: 100, color: "bg-primary" },
  { name: "Iced Latte", count: 52, pct: 76, color: "bg-primary-container" },
  { name: "Croissant", count: 41, pct: 60, color: "bg-[#885119]" },
  { name: "Matcha Latte", count: 29, pct: 42, color: "bg-[#6c3a02]" },
  { name: "Cold Brew", count: 24, pct: 35, color: "bg-[#482400]" },
];

const heatmapRows = [
  ["#231a0f","#231a0f","#4a4640","#ffb779","#c8864a","#4a4640","#231a0f","#4a4640","#c8864a","#c8864a","#4a4640","#231a0f"],
  ["#231a0f","#4a4640","#ffb779","#ffb779","#c8864a","#4a4640","#231a0f","#4a4640","#ffb779","#c8864a","#231a0f","#231a0f"],
  ["#231a0f","#231a0f","#c8864a","#ffb779","#ffb779","#c8864a","#4a4640","#231a0f","#4a4640","#c8864a","#231a0f","#231a0f"],
  ["#231a0f","#4a4640","#ffb779","#ffb779","#c8864a","#4a4640","#231a0f","#4a4640","#ffb779","#c8864a","#4a4640","#231a0f"],
  ["#4a4640","#c8864a","#ffb779","#ffb779","#ffb779","#c8864a","#4a4640","#c8864a","#ffb779","#ffb779","#c8864a","#4a4640"],
  ["#231a0f","#231a0f","#4a4640","#c8864a","#ffb779","#ffb779","#ffb779","#ffb779","#c8864a","#4a4640","#231a0f","#231a0f"],
  ["#231a0f","#231a0f","#231a0f","#4a4640","#c8864a","#ffb779","#ffb779","#ffb779","#c8864a","#231a0f","#231a0f","#231a0f"],
];
const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const hours = ["6am","8am","10am","12pm","2pm","4pm","6pm","8pm","10pm"];

export default function AnalyticsPage() {
  return (
    <>
      {/* Top Bar */}
      <header className="flex justify-between items-center px-8 h-20 fixed top-0 right-0 w-full lg:w-[calc(100%-240px)] z-40 bg-deep-espresso/80 backdrop-blur-xl">
        <h2 className="font-headline text-3xl font-bold text-on-surface">Analytics</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">calendar_today</span> Last 7 days
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
        </div>
      </header>

      <div className="pt-28 px-8 space-y-8 pb-12 max-w-[1280px]">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((k) => (
            <div key={k.label} className="bg-surface-container-low p-6 rounded-2xl relative overflow-hidden group hover:bg-surface-container-high transition-all duration-300">
              <p className="text-xs font-label text-on-surface/30 uppercase tracking-wider mb-2">{k.label}</p>
              <h3 className={`text-2xl font-bold font-headline ${k.color}`}>{k.value}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500 font-medium">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> {k.change} vs last period
              </div>
              <div className="absolute bottom-2 right-4 w-24 h-12 opacity-50">
                <svg className="w-full h-full stroke-primary fill-none" viewBox="0 0 100 40" strokeWidth="2"><path d={k.spark} strokeLinecap="round" /></svg>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-3 bg-surface-container-low p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline text-xl">Revenue Over Time</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-label"><span className="w-3 h-3 rounded-full bg-primary" /> Current Week</div>
                <div className="flex items-center gap-2 text-xs font-label text-on-surface/30"><span className="w-3 h-3 rounded-full bg-on-surface/10" /> Previous Week</div>
              </div>
            </div>
            <div className="relative h-[300px] w-full mt-4">
              <svg className="w-full h-full" viewBox="0 0 700 300">
                <line stroke="rgba(82,68,57,0.1)" strokeDasharray="4" x1="0" x2="700" y1="75" y2="75" />
                <line stroke="rgba(82,68,57,0.1)" strokeDasharray="4" x1="0" x2="700" y1="150" y2="150" />
                <line stroke="rgba(82,68,57,0.1)" strokeDasharray="4" x1="0" x2="700" y1="225" y2="225" />
                <defs><linearGradient id="amberGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ffb779" /><stop offset="100%" stopColor="#ffb779" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 280 L100 240 L200 250 L300 180 L400 120 L500 80 L600 90 L700 50 L700 300 L0 300 Z" fill="url(#amberGrad)" opacity="0.1" />
                <path d="M0 280 L100 240 L200 250 L300 180 L400 120 L500 80 L600 90 L700 50" fill="none" stroke="#ffb779" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex justify-between mt-4 px-2 text-[10px] font-label text-on-surface/30 uppercase tracking-tighter">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>
          {/* Donut Chart */}
          <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-2xl flex flex-col items-center justify-center text-center">
            <h4 className="font-headline text-xl self-start mb-8">Orders by Type</h4>
            <div className="relative w-56 h-56 mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="none" r="15.915" stroke="#ffb779" strokeDasharray="45 55" strokeDashoffset="0" strokeWidth="4" />
                <circle cx="18" cy="18" fill="none" r="15.915" stroke="#c8864a" strokeDasharray="32 68" strokeDashoffset="-45" strokeWidth="4" />
                <circle cx="18" cy="18" fill="none" r="15.915" stroke="#f1e0ce" strokeDasharray="23 77" strokeDashoffset="-77" strokeWidth="4" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-headline text-on-surface">241</span>
                <span className="text-[10px] text-on-surface/30 uppercase tracking-widest font-label">Total Orders</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-3 gap-2">
              {[{ label: "Pickup", pct: "45%", color: "bg-primary" }, { label: "Delivery", pct: "32%", color: "bg-primary-container" }, { label: "Dine In", pct: "23%", color: "bg-on-surface" }].map((t) => (
                <div key={t.label} className="flex flex-col items-center">
                  <span className={`w-2 h-2 rounded-full ${t.color} mb-1`} />
                  <span className="text-[10px] font-label text-on-surface/30">{t.label}</span>
                  <span className="text-sm font-bold">{t.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          {/* Top Products */}
          <div className="bg-surface-container-low p-8 rounded-2xl">
            <h4 className="font-headline text-xl mb-8">Top Products This Week</h4>
            <div className="space-y-6">
              {topProducts.map((p) => (
                <div key={p.name} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{p.name}</span>
                    <span className="font-mono">{p.count}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Heatmap */}
          <div className="bg-surface-container-low p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline text-xl">Peak Hours Heatmap</h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-label text-on-surface/30">Low</span>
                <div className="flex gap-1">{["#231a0f","#4a4640","#c8864a","#ffb779"].map((c) => <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />)}</div>
                <span className="text-[10px] font-label text-on-surface/30">High</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col justify-between py-1 h-[200px] text-[9px] font-label text-on-surface/30 uppercase">
                {days.map((d) => <span key={d}>{d}</span>)}
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-12 grid-rows-7 gap-1 h-[200px]">
                  {heatmapRows.flat().map((color, i) => <div key={i} className="rounded-sm" style={{ backgroundColor: color }} />)}
                </div>
                <div className="flex justify-between mt-3 text-[9px] font-label text-on-surface/30 uppercase">
                  {hours.map((h) => <span key={h}>{h}</span>)}
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs text-on-surface/30 leading-relaxed italic border-l-2 border-primary pl-4">
              Observation: Morning rush peak occurs between 8-9am on weekdays, while weekends show sustained traffic from 10am to 2pm.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
