import type { Metadata } from "next";
import { getAdminAnalyticsData } from "@/lib/supabase/queries/admin-analytics";

export const metadata: Metadata = {
  title: "Analytics | Jennifer's Café Admin",
  description: "Sales analytics dashboard with revenue, orders, and product performance.",
};

export const dynamic = "force-dynamic";

const PRODUCT_BAR_COLORS = ["bg-primary", "bg-primary-container", "bg-[#885119]", "bg-[#6c3a02]", "bg-[#482400]"];

export default async function AnalyticsPage() {
  const d = await getAdminAnalyticsData();

  const typeTotal = d.ordersByType.pickup + d.ordersByType.delivery + d.ordersByType.dine_in;
  const pPct = typeTotal > 0 ? (d.ordersByType.pickup / typeTotal) * 100 : 0;
  const dPct = typeTotal > 0 ? (d.ordersByType.delivery / typeTotal) * 100 : 0;
  const diPct = typeTotal > 0 ? (d.ordersByType.dine_in / typeTotal) * 100 : 0;

  return (
    <>
      <header className="flex justify-between items-center px-8 h-20 fixed top-0 right-0 w-full lg:w-[calc(100%-240px)] z-40 bg-deep-espresso/80 backdrop-blur-xl">
        <h2 className="font-headline text-3xl font-bold text-on-surface">Analytics</h2>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-sm font-medium text-on-surface/60">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            {d.periodLabel}
          </span>
        </div>
      </header>

      <div className="pt-28 px-8 space-y-8 pb-12 max-w-[1280px]">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {d.kpis.map((k) => (
            <div
              key={k.label}
              className="bg-surface-container-low p-6 rounded-2xl relative overflow-hidden group hover:bg-surface-container-high transition-all duration-300"
            >
              <p className="text-xs font-label text-on-surface/30 uppercase tracking-wider mb-2">{k.label}</p>
              <h3 className={`text-2xl font-bold font-headline ${k.colorClass}`}>{k.valueDisplay}</h3>
              {k.changePct != null ? (
                <div
                  className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                    k.changePct >= 0 ? "text-green-500" : "text-red-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {k.changePct >= 0 ? "arrow_upward" : "arrow_downward"}
                  </span>
                  {k.changePct >= 0 ? "+" : ""}
                  {k.changePct}% vs prior 7 days
                </div>
              ) : (
                <p className="mt-2 text-xs text-on-surface/30">No comparison data</p>
              )}
              <div className="absolute bottom-2 right-4 w-24 h-12 opacity-50">
                <svg className="w-full h-full stroke-primary fill-none" viewBox="0 0 100 40" strokeWidth="2">
                  <path d={k.sparkPath} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-surface-container-low p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline text-xl">Revenue Over Time</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-label">
                  <span className="w-3 h-3 rounded-full bg-primary" /> Current 7 days
                </div>
                <div className="flex items-center gap-2 text-xs font-label text-on-surface/30">
                  <span className="w-3 h-3 rounded-full bg-on-surface/30" /> Prior 7 days
                </div>
              </div>
            </div>
            <div className="relative h-[300px] w-full mt-4">
              <svg className="w-full h-full" viewBox="0 0 700 300" preserveAspectRatio="xMidYMid meet">
                <line stroke="rgba(82,68,57,0.1)" strokeDasharray="4" x1="0" x2="700" y1="75" y2="75" />
                <line stroke="rgba(82,68,57,0.1)" strokeDasharray="4" x1="0" x2="700" y1="150" y2="150" />
                <line stroke="rgba(82,68,57,0.1)" strokeDasharray="4" x1="0" x2="700" y1="225" y2="225" />
                <defs>
                  <linearGradient id="amberGradAnalytics" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffb779" />
                    <stop offset="100%" stopColor="#ffb779" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={d.revenueAreaPath} fill="url(#amberGradAnalytics)" opacity="0.15" />
                <path
                  d={d.prevRevenueLinePath}
                  fill="none"
                  stroke="rgba(241,224,206,0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={d.revenueLinePath}
                  fill="none"
                  stroke="#ffb779"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex justify-between mt-4 px-2 text-[10px] font-label text-on-surface/30 uppercase tracking-tighter">
                {d.revenueByDay.map((x) => (
                  <span key={x.ymd}>{x.dayLabel}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-2xl flex flex-col items-center justify-center text-center">
            <h4 className="font-headline text-xl self-start mb-8 w-full text-left">Orders by Type</h4>
            {typeTotal === 0 ? (
              <p className="text-sm text-on-surface/40 py-12">No orders in the last 7 days.</p>
            ) : (
              <>
                <div className="relative w-56 h-56 mb-8">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ffb779" strokeWidth="4" strokeDasharray={`${pPct} ${100 - pPct}`} strokeDashoffset="0" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#c8864a"
                      strokeWidth="4"
                      strokeDasharray={`${dPct} ${100 - dPct}`}
                      strokeDashoffset={-pPct}
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#f1e0ce"
                      strokeWidth="4"
                      strokeDasharray={`${diPct} ${100 - diPct}`}
                      strokeDashoffset={-(pPct + dPct)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-headline text-on-surface">{d.totalOrdersPeriod}</span>
                    <span className="text-[10px] text-on-surface/30 uppercase tracking-widest font-label">Total Orders</span>
                  </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-2">
                  {[
                    { label: "Pickup", pct: pPct, color: "bg-primary" },
                    { label: "Delivery", pct: dPct, color: "bg-primary-container" },
                    { label: "Dine In", pct: diPct, color: "bg-on-surface" },
                  ].map((t) => (
                    <div key={t.label} className="flex flex-col items-center">
                      <span className={`w-2 h-2 rounded-full ${t.color} mb-1`} />
                      <span className="text-[10px] font-label text-on-surface/30">{t.label}</span>
                      <span className="text-sm font-bold">{Math.round(t.pct)}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          <div className="bg-surface-container-low p-8 rounded-2xl">
            <h4 className="font-headline text-xl mb-8">Top Products (last 7 days)</h4>
            {d.topProducts.length === 0 ? (
              <p className="text-sm text-on-surface/40">No line items in this period.</p>
            ) : (
              <div className="space-y-6">
                {d.topProducts.map((p, i) => (
                  <div key={p.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="truncate pr-2">{p.name}</span>
                      <span className="font-mono shrink-0">{p.count}</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${PRODUCT_BAR_COLORS[i % PRODUCT_BAR_COLORS.length]}`} style={{ width: `${p.barPct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-surface-container-low p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline text-xl">Peak Hours Heatmap</h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-label text-on-surface/30">Low</span>
                <div className="flex gap-1">
                  {["#231a0f", "#4a4640", "#c8864a", "#ffb779"].map((c) => (
                    <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-[10px] font-label text-on-surface/30">High</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col justify-between py-1 h-[200px] text-[9px] font-label text-on-surface/30 uppercase">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-12 grid-rows-7 gap-1 h-[200px]">
                  {d.heatmapCells.map((color, i) => (
                    <div key={i} className="rounded-sm min-h-0" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[9px] font-label text-on-surface/30 uppercase gap-0.5 overflow-x-auto">
                  {["6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"].map((h) => (
                    <span key={h} className="shrink-0">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs text-on-surface/30 leading-relaxed border-l-2 border-primary pl-4">{d.insightText}</p>
          </div>
        </section>
      </div>
    </>
  );
}
