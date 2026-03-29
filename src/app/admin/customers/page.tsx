import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers | Jennifer's Café Admin",
  description: "Manage your specialty coffee community, track loyalty progress, and handle subscription tiers.",
};

const filters = ["All", "Has Subscription", "Loyalty Member", "Inactive"];

const stats = [
  { label: "Total Customers", value: "184", change: "+12%", border: "border-primary/30" },
  { label: "Active Subscribers", value: "18", change: "Gold Tier", border: "border-purple-400/30" },
  { label: "Avg Orders per Customer", value: "6.2", change: "LIFETIME", border: "border-on-surface/10" },
];

const customers = [
  { name: "Abena Mensah", initials: "AM", email: "abena.m@example.com", orders: 14, spent: "$412.50", points: "820", sub: "Active", subColor: "bg-green-950 text-green-400", lastOrder: "2h ago", expanded: false },
  { name: "Kofi Asante", initials: "KA", email: "kofi.a@ghana.net", orders: 5, spent: "$124.00", points: "245", sub: "None", subColor: "bg-surface-container-highest text-on-surface/30", lastOrder: "Yesterday", expanded: false },
  { name: "James Owusu", initials: "JO", email: "jameso@corp.com", orders: 28, spent: "$892.20", points: "1,450", sub: "Paused", subColor: "bg-amber-950 text-amber-500", lastOrder: "14 min ago", expanded: true },
  { name: "Efua Darko", initials: "ED", email: "efua.d@ghana.com", orders: 8, spent: "$192.00", points: "410", sub: "Failed", subColor: "bg-red-950 text-red-500", lastOrder: "3 days ago", expanded: false },
  { name: "Ama Boateng", initials: "AB", email: "ama.b@ghana.net", orders: 19, spent: "$548.00", points: "920", sub: "Active", subColor: "bg-green-950 text-green-400", lastOrder: "5 days ago", expanded: false },
  { name: "Kweku Asare", initials: "KA", email: "kweku.a@example.com", orders: 2, spent: "$34.50", points: "65", sub: "None", subColor: "bg-surface-container-highest text-on-surface/30", lastOrder: "2 weeks ago", expanded: false },
];

export default function CustomersPage() {
  return (
    <>
      {/* Top Bar */}
      <header className="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-40 bg-deep-espresso/80 backdrop-blur-xl">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/30 text-sm">search</span>
          <input className="w-full bg-surface-container-highest border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/40 outline-none placeholder:text-on-surface/20 text-on-surface" placeholder="Search by name or email..." />
        </div>
      </header>

      <section className="max-w-[1280px] mx-auto p-8 space-y-10">
        {/* Heading + Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-headline font-bold tracking-tight text-on-surface">Customers</h2>
            <p className="text-on-surface/30 max-w-lg">Manage your specialty coffee community, track loyalty progress, and handle subscription tiers.</p>
          </div>
          <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
            {filters.map((f) => (
              <button key={f} className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${f === "All" ? "bg-primary text-on-primary" : "text-on-surface/30 hover:text-on-surface"}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className={`bg-surface-container-low p-6 rounded-xl border-l-4 ${s.border}`}>
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30 mb-2">{s.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-headline font-bold text-on-surface">{s.value}</span>
                <span className={`text-xs font-bold ${s.change.startsWith("+") ? "text-green-500" : "text-primary"}`}>{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Table */}
        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container">
                {["Customer", "Email", "Orders", "Total Spent", "Loyalty Points", "Subscriptions", "Last Order", ""].map((h) => (
                  <th key={h} className={`px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-on-surface/30 ${h === "" ? "text-right" : h === "Orders" ? "text-center" : ""}`}>{h || "Actions"}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/10">
              {customers.map((c) => (
                <>
                  <tr key={c.name} className={`hover:bg-surface-bright/20 transition-colors ${c.expanded ? "bg-surface-container-highest/20 border-l-4 border-primary" : ""}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-primary">{c.initials}</div>
                        <span className="font-bold text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface/30">{c.email}</td>
                    <td className="px-6 py-5 text-sm text-center font-mono">{c.orders}</td>
                    <td className="px-6 py-5 text-sm font-mono tracking-tight">{c.spent}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className={`text-sm font-mono ${c.expanded ? "font-bold text-primary" : ""}`}>{c.points}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5"><span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-tight ${c.subColor}`}>{c.sub}</span></td>
                    <td className="px-6 py-5 text-sm text-on-surface/30">{c.lastOrder}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-on-surface/30 hover:text-on-surface cursor-pointer">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {c.expanded && (
                    <tr key={`${c.name}-detail`} className="bg-surface-container-highest/10">
                      <td className="px-12 py-8" colSpan={8}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-6">
                            <h4 className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30">Recent Activity</h4>
                            <div className="space-y-4">
                              {[
                                { icon: "local_cafe", name: "Cold Brew Subscription", id: "ORD-9421 • 14 min ago", price: "$12.50" },
                                { icon: "shopping_basket", name: "Pastry Box & Coffee", id: "ORD-8312 • 2 days ago", price: "$24.00" },
                                { icon: "local_cafe", name: "Double Espresso", id: "ORD-7910 • 4 days ago", price: "$4.50" },
                              ].map((a) => (
                                <div key={a.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                                  <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-primary">{a.icon}</span>
                                    <div>
                                      <p className="text-sm font-bold">{a.name}</p>
                                      <p className="text-[10px] text-on-surface/30 font-mono">{a.id}</p>
                                    </div>
                                  </div>
                                  <span className="text-sm font-mono font-bold">{a.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-8">
                            <div className="space-y-4">
                              <div className="flex justify-between items-end">
                                <h4 className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30">Loyalty Progress</h4>
                                <span className="text-xs text-on-surface/30"><span className="text-primary font-bold">1,450</span> / 2,000 pts</span>
                              </div>
                              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: "72%" }} />
                              </div>
                              <p className="text-[10px] text-on-surface/30 italic">550 points until Platinum Tier upgrade.</p>
                            </div>
                            <div className="flex gap-4">
                              <button className="flex-1 px-4 py-3 bg-primary-container text-on-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
                                <span className="material-symbols-outlined text-sm">person</span> View Full Profile
                              </button>
                              <button className="flex-1 px-4 py-3 bg-secondary-container text-on-surface rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
                                <span className="material-symbols-outlined text-sm">mail</span> Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between bg-surface-container" style={{ borderTop: "1px solid rgba(61,51,39,0.1)" }}>
            <span className="text-xs text-on-surface/30">Showing 1-6 of 184 customers</span>
            <div className="flex gap-2">
              <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high text-on-surface/30 cursor-pointer"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <button className="p-2 bg-surface-container-high rounded-lg text-primary font-bold px-4 text-sm">1</button>
              <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high text-on-surface/30 px-4 text-sm cursor-pointer">2</button>
              <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high text-on-surface/30 px-4 text-sm cursor-pointer">3</button>
              <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high text-on-surface/30 cursor-pointer"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>
      </section>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-16 h-16 amber-glow text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 cursor-pointer">
        <span className="material-symbols-outlined text-3xl">person_add</span>
      </button>
    </>
  );
}
