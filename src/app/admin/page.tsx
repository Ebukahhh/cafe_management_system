import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUsd } from "@/lib/customer-display";
import { formatRelativeSubmitted } from "@/lib/format-datetime";
import { getAdminDashboardData } from "@/lib/supabase/queries/admin-dashboard";
import type { OrderStatus } from "@/lib/supabase/types/database.types";

export const metadata: Metadata = {
  title: "Admin Dashboard | Jennifer's Café",
  description: "Overview of café operations, orders, and key metrics.",
};

export const dynamic = "force-dynamic";

function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "pending":
    case "confirmed":
    case "preparing":
      return "text-amber-500 bg-amber-900/20";
    case "ready":
      return "text-green-500 bg-green-900/20";
    case "delivered":
      return "text-on-surface/30 bg-surface-container-highest";
    case "cancelled":
      return "text-red-400 bg-red-900/20";
    default:
      return "text-on-surface/30 bg-surface-container-highest";
  }
}

function statusLabel(status: OrderStatus): string {
  return status.toUpperCase();
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const metaName =
    typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const welcomeName =
    metaName.length > 0 ? metaName.split(/\s+/)[0] : user?.email?.split("@")[0] || "there";

  const d = await getAdminDashboardData();

  const pendingSubtitle =
    d.awaitingConfirmationCount > 0
      ? `${d.awaitingConfirmationCount} awaiting`
      : d.preparingCount > 0
        ? `${d.preparingCount} preparing`
        : "—";

  const reservationsSubtitle =
    d.reservationsPendingTodayCount > 0 ? `${d.reservationsPendingTodayCount} pending` : "—";

  const quickStats = [
    {
      icon: "payments",
      label: "Today's Revenue",
      value: formatUsd(d.todayRevenue),
      change: "Today",
      changeMuted: false,
      color: "text-primary",
    },
    {
      icon: "shopping_bag",
      label: "Pending Orders",
      value: String(d.activeOrdersCount),
      change: pendingSubtitle,
      changeMuted: pendingSubtitle === "—",
      color: "text-amber-500",
    },
    {
      icon: "event_seat",
      label: "Reservations",
      value: String(d.reservationsTodayCount),
      change: reservationsSubtitle,
      changeMuted: reservationsSubtitle === "—",
      color: "text-on-surface",
    },
    {
      icon: "group",
      label: "Active Subscribers",
      value: String(d.activeSubscribersCount),
      change: "Active",
      changeMuted: d.activeSubscribersCount === 0,
      color: "text-on-surface",
    },
  ];

  const quickLinks = [
    { icon: "restaurant_menu", label: "Menu Manager", href: "/admin/menu", desc: "Manage products & categories" },
    {
      icon: "group",
      label: "Customers",
      href: "/admin/customers",
      desc: `${d.customerRoleCount} registered customers`,
    },
    {
      icon: "event",
      label: "Reservations",
      href: "/admin/reservations",
      desc: `${d.reservationsTodayCount} bookings today`,
    },
    {
      icon: "loyalty",
      label: "Subscriptions",
      href: "/admin/subscriptions",
      desc: `${d.activeSubscribersCount} active plans`,
    },
    {
      icon: "campaign",
      label: "Promotions",
      href: "/admin/promotions",
      desc: `${d.activePromotionsCount} active campaigns`,
    },
    { icon: "bar_chart", label: "Analytics", href: "/admin/analytics", desc: "Sales & performance" },
    { icon: "settings", label: "Settings", href: "/admin/settings", desc: "Café configuration" },
  ];

  return (
    <>
      <header className="flex justify-between items-center px-8 h-20 sticky top-0 z-40 bg-deep-espresso/80 backdrop-blur-xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Dashboard</h2>
          <p className="text-xs text-on-surface/30 font-label">Welcome back, {welcomeName}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined text-on-surface/30 hover:text-primary cursor-pointer">
              notifications
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1280px] mx-auto space-y-10">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((s) => (
            <div
              key={s.label}
              className="bg-surface-container-low p-6 rounded-2xl hover:translate-y-[-2px] transition-transform"
              style={{ border: "1px solid rgba(82,68,57,0.08)" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">{s.icon}</span>
                </div>
                <span
                  className={`text-xs font-bold ${s.changeMuted ? "text-on-surface/25" : "text-green-500"}`}
                >
                  {s.change}
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30 mb-1">{s.label}</p>
              <h3 className={`font-headline text-3xl font-bold ${s.color}`}>{s.value}</h3>
            </div>
          ))}
        </section>

        <section>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Quick Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group bg-surface-container p-5 rounded-xl hover:bg-surface-container-high transition-all hover:shadow-md"
              >
                <span className="material-symbols-outlined text-2xl text-primary mb-3 block group-hover:scale-110 transition-transform">
                  {l.icon}
                </span>
                <h4 className="font-bold text-sm text-on-surface mb-1">{l.label}</h4>
                <p className="text-xs text-on-surface/30">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-xl font-bold text-on-surface">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div
            className="bg-surface-container-low rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(82,68,57,0.08)" }}
          >
            {d.recentOrders.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-on-surface/40">
                No order has been created yet. Recent orders will appear here once customers start placing orders.
              </p>
            ) : (
              <div className="divide-y divide-surface-container-highest/10">
                {d.recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-surface-container-high/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono text-xs text-primary font-bold shrink-0">{o.displayId}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{o.customerName}</p>
                        <p className="text-xs text-on-surface/30 truncate">{o.itemsSummary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0 flex-wrap">
                      <span className="font-mono text-sm font-bold">{formatUsd(o.total)}</span>
                      <span className="text-xs text-on-surface/20">{formatRelativeSubmitted(o.createdAt)}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-tight ${statusBadgeClass(o.status)}`}
                      >
                        {statusLabel(o.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
