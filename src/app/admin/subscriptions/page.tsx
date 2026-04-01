import type { Metadata } from "next";
import { formatUsd } from "@/lib/customer-display";
import { getAdminSubscriptionsDashboard } from "@/lib/supabase/queries/admin-subscriptions";

export const metadata: Metadata = {
  title: "Subscriptions | Jennifer's Café Admin",
  description: "Manage subscription plans, track active subscribers, and monitor revenue.",
};

export const dynamic = "force-dynamic";

export default async function SubscriptionsAdminPage() {
  const d = await getAdminSubscriptionsDashboard();

  const stats = [
    {
      icon: "group",
      label: "Active Subscriptions",
      value: String(d.activeCount),
      badge: "",
      badgeColor: "",
    },
    {
      icon: "payments",
      label: "Revenue (This Month)",
      value: formatUsd(d.revenueThisMonth),
      badge: "",
      badgeColor: "",
    },
    {
      icon: "error",
      label: "Failed charges (accounts)",
      value: String(d.failedSubscriptionsCount),
      badge: d.failedSubscriptionsCount > 0 ? "Review" : "",
      badgeColor: d.failedSubscriptionsCount > 0 ? "bg-red-400/20 text-red-400 border-red-400/30" : "",
    },
  ];

  return (
    <>
      <header
        className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 z-50 bg-deep-espresso/80 backdrop-blur-md flex justify-between items-center px-8"
        style={{ borderBottom: "1px solid rgba(82,68,57,0.08)" }}
      >
        <div className="flex items-center gap-8">
          <h1 className="font-headline text-xl font-semibold text-on-surface">Subscription Management</h1>
          <nav className="hidden md:flex gap-6">
            {["Overview", "Plans", "Customers", "Revenue"].map((t) => (
              <button
                key={t}
                type="button"
                className={`font-headline text-sm cursor-pointer ${
                  t === "Overview" ? "text-amber-500 border-b-2 border-amber-600 pb-1" : "text-on-surface/30 hover:text-amber-400 transition-all"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
        <button
          type="button"
          className="px-4 py-1.5 rounded-full text-sm font-medium text-on-surface hover:bg-surface-container transition-all cursor-pointer"
          style={{ border: "1px solid rgba(82,68,57,0.15)" }}
        >
          Export Data
        </button>
      </header>

      <div className="pt-24 pb-12 px-8 max-w-[1280px] mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface-container-low p-6 rounded-2xl hover:translate-y-[-2px] transition-transform"
              style={{ border: "1px solid rgba(82,68,57,0.1)" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">{s.icon}</span>
                </div>
                {s.badge ? (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badgeColor}`} style={{ border: "1px solid" }}>
                    {s.badge}
                  </span>
                ) : null}
              </div>
              <p className="text-on-surface/40 text-sm font-medium mb-1 uppercase tracking-wider">{s.label}</p>
              <h3 className={`font-headline text-4xl font-bold ${s.label.includes("Revenue") ? "text-primary" : "text-on-surface"}`}>
                {s.value}
              </h3>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-bold text-on-surface">Subscriptions</h2>
            <div className="flex gap-2">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface/40 cursor-pointer"
              >
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface/40 cursor-pointer"
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xl" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
            {d.tableRows.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-on-surface/40">No subscriptions yet.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high">
                    {["Customer", "Items", "Schedule", "Next run", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface/40 ${h === "Actions" ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest/10">
                  {d.tableRows.map((s) => (
                    <tr
                      key={s.id}
                      className={`transition-colors group ${
                        s.statusFailed ? "bg-red-900/5 hover:bg-red-900/10" : "hover:bg-surface-container-low"
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              s.statusFailed ? "bg-red-400/20 text-red-400" : "bg-primary/20 text-primary"
                            }`}
                          >
                            {s.initials}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{s.name}</p>
                            <p className={`text-xs ${s.statusFailed ? "text-red-400" : "text-on-surface/30"}`}>
                              {s.email ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium max-w-[220px]">
                        <span className="line-clamp-2">{s.itemsLine}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-xs font-mono px-2 py-1 rounded ${
                            s.statusFailed ? "bg-red-900/20 text-red-400" : "bg-surface-container-high"
                          }`}
                        >
                          {s.schedule}
                        </span>
                        <p className="text-[10px] text-on-surface/30 mt-1 font-mono">{s.timeHint}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className={`text-sm ${s.overdue ? "text-red-400 font-bold italic" : ""}`}>{s.next}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold ${
                            s.statusFailed
                              ? "text-red-400"
                              : s.statusLabel === "Paused"
                                ? "text-amber-500"
                                : s.statusLabel === "Cancelled" || s.statusLabel === "Completed"
                                  ? "text-on-surface/40"
                                  : "text-emerald-500"
                          }`}
                        >
                          {s.statusFailed ? (
                            <span className="material-symbols-outlined text-[14px]">warning</span>
                          ) : (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                s.statusLabel === "Paused"
                                  ? "bg-amber-500"
                                  : s.statusLabel === "Cancelled" || s.statusLabel === "Completed"
                                    ? "bg-on-surface/30"
                                    : "bg-emerald-500"
                              }`}
                            />
                          )}
                          {s.statusLabel}
                          {s.failedCount > 0 ? ` (${s.failedCount})` : ""}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {s.statusFailed ? (
                          <button
                            type="button"
                            className="bg-red-400 text-on-primary px-3 py-1 rounded text-xs font-bold hover:scale-105 transition-transform cursor-pointer opacity-60"
                            disabled
                            title="Coming soon"
                          >
                            Retry
                          </button>
                        ) : (
                          <button type="button" className="text-on-surface/30 hover:text-primary transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-2xl font-bold text-on-surface">Run log — last 7 days</h2>
              <span className="bg-surface-container-highest text-on-surface/40 text-[10px] font-mono px-2 py-0.5 rounded">LIVE</span>
            </div>
            <span className="material-symbols-outlined text-on-surface/30 cursor-pointer hover:text-on-surface transition-colors">
              expand_more
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(82,68,57,0.05)" }}>
            {d.runLog.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-on-surface/40">No subscription runs in the last 7 days.</p>
            ) : (
              <div className="divide-y divide-surface-container-highest/10">
                {d.runLog.map((log) => (
                  <div key={log.id} className="flex items-center px-6 py-4 hover:bg-surface-container-low transition-colors">
                    <div className={`w-2 h-10 ${log.accentClass} rounded-full mr-6`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-4">
                        <p className="font-bold truncate">
                          Run <span className="font-mono text-xs text-on-surface/50">{log.id.slice(0, 8)}…</span>
                        </p>
                        <span className="text-[10px] font-mono text-on-surface/30 shrink-0">{log.runAtDisplay}</span>
                      </div>
                      <p className="text-sm text-on-surface/40">
                        <span className="uppercase text-[10px] font-mono text-on-surface/30">{log.status}</span> — {log.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              className="w-full py-4 text-center text-primary text-sm font-bold hover:bg-primary/5 transition-colors cursor-pointer"
              style={{ borderTop: "1px solid rgba(82,68,57,0.1)" }}
            >
              View detailed history
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
