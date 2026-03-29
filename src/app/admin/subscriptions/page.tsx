import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions | Jennifer's Café Admin",
  description: "Manage subscription plans, track active subscribers, and monitor revenue.",
};

const stats = [
  { icon: "group", label: "Active Subscriptions", value: "18", badge: "+12%", badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { icon: "payments", label: "Revenue (This Month)", value: "$820.00", badge: "", badgeColor: "" },
  { icon: "error", label: "Failed Charges", value: "1", badge: "Action Required", badgeColor: "bg-red-400/20 text-red-400 border-red-400/30" },
];

const subscribers = [
  { initials: "MB", name: "Marcus Bennett", email: "marcus.b@email.com", item: "Ethiopian Yirgacheffe (250g)", schedule: "Weekly", next: "Oct 24, 2023", status: "Active", statusColor: "text-emerald-500", bgColor: "bg-primary/20 text-primary" },
  { initials: "SL", name: "Sarah Lopez", email: "s.lopez@cloud.com", item: "Cold Brew Bundle (4pk)", schedule: "Bi-Weekly", next: "Oct 26, 2023", status: "Active", statusColor: "text-emerald-500", bgColor: "bg-secondary/20 text-secondary" },
  { initials: "DW", name: "David Wong", email: "dwong@corp.com", item: "House Blend (1kg)", schedule: "Monthly", next: "Nov 02, 2023", status: "Active", statusColor: "text-emerald-500", bgColor: "bg-purple-400/20 text-purple-400" },
  { initials: "JC", name: "Julia Chen", email: "jchen@studio.io", item: "Oat Milk Case (12pk)", schedule: "Monthly", next: "Oct 28, 2023", status: "Paused", statusColor: "text-amber-500", bgColor: "bg-primary/20 text-primary" },
  { initials: "AB", name: "Ama Boateng", email: "ama.b@mail.gh", item: "Artisan Roast (500g)", schedule: "Weekly", next: "Overdue", status: "Failed", statusColor: "text-red-400", bgColor: "bg-red-400/20 text-red-400", failed: true },
];

const runLog = [
  { id: "#SUB-8829", date: "2023-10-23 04:00 AM", result: "Processed 12 subscriptions. All payments succeeded.", color: "bg-emerald-500" },
  { id: "#SUB-8828", date: "2023-10-22 04:00 AM", result: "Processed 4 subscriptions.", failed: "1 failed (Ama Boateng)", color: "bg-red-400" },
  { id: "#SUB-8827", date: "2023-10-21 04:00 AM", result: "Processed 18 subscriptions. All payments succeeded.", color: "bg-emerald-500" },
];

export default function SubscriptionsAdminPage() {
  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 z-50 bg-deep-espresso/80 backdrop-blur-md flex justify-between items-center px-8" style={{ borderBottom: "1px solid rgba(82,68,57,0.08)" }}>
        <div className="flex items-center gap-8">
          <h1 className="font-headline text-xl font-semibold text-on-surface">Subscription Management</h1>
          <nav className="hidden md:flex gap-6">
            {["Overview", "Plans", "Customers", "Revenue"].map((t) => (
              <button key={t} className={`font-headline text-sm cursor-pointer ${t === "Overview" ? "text-amber-500 border-b-2 border-amber-600 pb-1" : "text-on-surface/30 hover:text-amber-400 transition-all"}`}>{t}</button>
            ))}
          </nav>
        </div>
        <button className="px-4 py-1.5 rounded-full text-sm font-medium text-on-surface hover:bg-surface-container transition-all cursor-pointer" style={{ border: "1px solid rgba(82,68,57,0.15)" }}>Export Data</button>
      </header>

      <div className="pt-24 pb-12 px-8 max-w-[1280px] mx-auto">
        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-low p-6 rounded-2xl hover:translate-y-[-2px] transition-transform" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-primary">{s.icon}</span></div>
                {s.badge && <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badgeColor}`} style={{ border: "1px solid" }}>{s.badge}</span>}
              </div>
              <p className="text-on-surface/40 text-sm font-medium mb-1 uppercase tracking-wider">{s.label}</p>
              <h3 className={`font-headline text-4xl font-bold ${s.label.includes("Revenue") ? "text-primary" : "text-on-surface"}`}>{s.value}</h3>
            </div>
          ))}
        </section>

        {/* Table */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-bold text-on-surface">Active Subscriptions</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface/40 cursor-pointer"><span className="material-symbols-outlined">filter_list</span></button>
              <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface/40 cursor-pointer"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xl" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high">
                  {["Customer", "Items", "Schedule", "Next Run", "Status", "Actions"].map((h) => (
                    <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface/40 ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/10">
                {subscribers.map((s) => (
                  <tr key={s.name} className={`transition-colors group ${s.failed ? "bg-red-900/5 hover:bg-red-900/10" : "hover:bg-surface-container-low"}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${s.bgColor}`}>{s.initials}</div>
                        <div>
                          <p className="font-bold text-on-surface">{s.name}</p>
                          <p className={`text-xs ${s.failed ? "text-red-400" : "text-on-surface/30"}`}>{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">{s.item}</td>
                    <td className="px-6 py-5"><span className={`text-xs font-mono px-2 py-1 rounded ${s.failed ? "bg-red-900/20 text-red-400" : "bg-surface-container-high"}`}>{s.schedule}</span></td>
                    <td className="px-6 py-5"><p className={`text-sm ${s.failed ? "text-red-400 font-bold italic" : ""}`}>{s.next}</p></td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${s.statusColor}`}>
                        {s.failed ? <span className="material-symbols-outlined text-[14px]">warning</span> : <span className={`w-2 h-2 rounded-full ${s.statusColor.replace("text-", "bg-")}`} />}
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {s.failed ? (
                        <button className="bg-red-400 text-on-primary px-3 py-1 rounded text-xs font-bold hover:scale-105 transition-transform cursor-pointer">Retry</button>
                      ) : (
                        <button className="text-on-surface/30 hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined">edit</span></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Run Log */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-2xl font-bold text-on-surface">Run Log — Last 7 Days</h2>
              <span className="bg-surface-container-highest text-on-surface/40 text-[10px] font-mono px-2 py-0.5 rounded">AUTO-UPDATED</span>
            </div>
            <span className="material-symbols-outlined text-on-surface/30 cursor-pointer hover:text-on-surface transition-colors">expand_more</span>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(82,68,57,0.05)" }}>
            <div className="divide-y divide-surface-container-highest/10">
              {runLog.map((log) => (
                <div key={log.id} className="flex items-center px-6 py-4 hover:bg-surface-container-low transition-colors">
                  <div className={`w-2 h-10 ${log.color} rounded-full mr-6`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Batch Run: {log.id}</p>
                      <span className="text-[10px] font-mono text-on-surface/30">{log.date}</span>
                    </div>
                    <p className="text-sm text-on-surface/40">{log.result}{log.failed && <span className="text-red-400 font-medium"> {log.failed}</span>}.</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-center text-primary text-sm font-bold hover:bg-primary/5 transition-colors cursor-pointer" style={{ borderTop: "1px solid rgba(82,68,57,0.1)" }}>View Detailed History</button>
          </div>
        </section>
      </div>
    </>
  );
}
