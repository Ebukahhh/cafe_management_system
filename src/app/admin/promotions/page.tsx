import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions | Jennifer's Café Admin",
  description: "Manage discount strategies, loyalty rewards, and coupon codes.",
};

const statsGrid = [
  { label: "Total Redemption", value: "1,402", change: "+12%", span: "" },
  { label: "Active Campaigns", value: "08", change: "", span: "" },
  { label: "Revenue Impact", value: "$12,480.00", change: "Estimated lift this month", span: "lg:col-span-2" },
];

const promos = [
  { code: "WELCOME10", type: "Percentage", value: "10% off", min: "$5.00", used: 24, total: 100, expires: "30 Apr" },
  { code: "WEEKEND20", type: "Percentage", value: "20% off", min: "$10.00", used: 8, total: 50, expires: "14 Apr" },
  { code: "FLAT5", type: "Flat", value: "$5 off", min: "$15.00", used: 3, total: 20, expires: "30 Apr" },
];

export default function PromotionsPage() {
  return (
    <div className="lg:p-12 p-6 pt-24 lg:pt-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-xs font-mono text-on-surface/30 uppercase tracking-widest mb-4">
            <span>Marketing</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary">Campaigns</span>
          </nav>
          <h2 className="text-5xl font-headline text-on-surface">Promotions</h2>
          <p className="text-on-surface/40 max-w-md">Manage your discount strategies, loyalty rewards, and active coupon codes across the network.</p>
        </div>
        <button className="amber-glow text-on-primary font-bold px-8 py-4 rounded-xl flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
          <span className="material-symbols-outlined">add_circle</span> Create New Promotion
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {statsGrid.map((s) => (
          <div key={s.label} className={`bg-surface-container p-6 rounded-xl space-y-2 ${s.span}`}>
            <p className="text-xs font-mono text-on-surface/30 uppercase tracking-widest">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline text-primary">{s.value}</span>
              {s.change && <span className={`text-xs ${s.change.startsWith("+") ? "text-green-500 font-bold" : "text-on-surface/30 italic"}`}>{s.change}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Promotions Table */}
      <div className="bg-surface-container-low rounded-2xl overflow-hidden">
        <div className="p-8" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
          <h3 className="text-xl font-headline mb-6 text-on-surface">Active Promotions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-mono text-on-surface/30 uppercase tracking-[0.2em]" style={{ borderBottom: "1px solid rgba(82,68,57,0.2)" }}>
                  {["Code", "Type", "Value", "Min Order", "Uses", "Expires", "Status", "Actions"].map((h) => (
                    <th key={h} className={`pb-4 font-normal ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {promos.map((p) => (
                  <tr key={p.code} className="group hover:bg-surface-bright/50 transition-colors" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                    <td className="py-5 font-mono text-primary font-bold">{p.code}</td>
                    <td className="py-5 text-on-surface/40">{p.type}</td>
                    <td className="py-5 font-bold">{p.value}</td>
                    <td className="py-5 text-on-surface/40">{p.min}</td>
                    <td className="py-5">
                      <div className="flex flex-col gap-1 w-24">
                        <div className="flex justify-between text-[10px] text-on-surface/30">
                          <span>{p.used}/{p.total}</span>
                          <span>{Math.round((p.used / p.total) * 100)}%</span>
                        </div>
                        <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(p.used / p.total) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-on-surface/40">{p.expires}</td>
                    <td className="py-5">
                      <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">Active</span>
                    </td>
                    <td className="py-5 text-right space-x-2">
                      <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface/30 hover:text-primary cursor-pointer"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface/30 hover:text-red-400 cursor-pointer"><span className="material-symbols-outlined text-[18px]">pause_circle</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Expired */}
        <div className="p-8 bg-surface-container-lowest/30">
          <button className="flex items-center gap-2 text-on-surface/30 hover:text-on-surface transition-colors group cursor-pointer">
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">chevron_right</span>
            <span className="text-sm font-medium">Show 4 expired promotions</span>
          </button>
        </div>
      </div>

      {/* Create New Promotion Panel (inline form) */}
      <div className="mt-12 max-w-lg mx-auto bg-deep-espresso/70 backdrop-blur-2xl rounded-2xl p-10 lg:p-12 shadow-2xl" style={{ border: "1px solid rgba(82,68,57,0.15)" }}>
        <header className="mb-10">
          <h2 className="text-3xl font-headline text-primary">Create New Promotion</h2>
          <p className="text-sm text-on-surface/40 mt-1">Configure your new discount offer</p>
        </header>
        <form className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface/30">Promo code</label>
              <button type="button" className="text-xs text-primary underline hover:text-primary-container transition-colors cursor-pointer">Generate code</button>
            </div>
            <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-on-surface/20 focus:ring-1 focus:ring-primary/40 outline-none" placeholder="e.g. SUMMER25" />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-on-surface/30">Discount type</label>
            <div className="grid grid-cols-2 p-1 bg-surface-container-highest rounded-xl">
              <button type="button" className="py-3 px-4 rounded-lg bg-primary-container text-on-primary font-bold text-sm">Percentage</button>
              <button type="button" className="py-3 px-4 rounded-lg text-on-surface/40 font-medium text-sm hover:text-on-surface cursor-pointer">Flat Amount</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface/30">Value (%)</label>
              <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" placeholder="10" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface/30">Min order ($)</label>
              <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface/30">Max uses</label>
              <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" placeholder="No limit" type="number" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface/30">Expiry date</label>
              <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" type="date" />
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-bold text-sm">Active immediately</p>
              <p className="text-xs text-on-surface/30">Promotion will go live as soon as it&apos;s created</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-on-primary rounded-full shadow-sm" /></div>
          </div>
          <div className="pt-6 flex flex-col gap-4">
            <button type="button" className="amber-glow w-full py-5 rounded-xl font-bold text-on-primary shadow-xl cursor-pointer hover:scale-[1.01] transition-transform">Create Promotion</button>
            <button type="button" className="w-full py-4 text-on-surface/30 hover:text-on-surface transition-colors font-medium cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
