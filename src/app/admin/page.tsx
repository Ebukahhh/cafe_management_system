import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard | Jennifer's Café",
  description: "Overview of café operations, orders, and key metrics.",
};

const quickStats = [
  { icon: "payments", label: "Today's Revenue", value: "$482.00", change: "+18%", color: "text-primary" },
  { icon: "shopping_bag", label: "Pending Orders", value: "12", change: "3 urgent", color: "text-amber-500" },
  { icon: "event_seat", label: "Reservations", value: "8", change: "2 pending", color: "text-on-surface" },
  { icon: "group", label: "Active Subscribers", value: "18", change: "+12%", color: "text-on-surface" },
];

const quickLinks = [
  { icon: "restaurant_menu", label: "Menu Manager", href: "/admin/menu", desc: "Manage products & categories" },
  { icon: "group", label: "Customers", href: "/admin/customers", desc: "184 registered customers" },
  { icon: "event", label: "Reservations", href: "/admin/reservations", desc: "8 bookings today" },
  { icon: "loyalty", label: "Subscriptions", href: "/admin/subscriptions", desc: "18 active plans" },
  { icon: "campaign", label: "Promotions", href: "/admin/promotions", desc: "8 active campaigns" },
  { icon: "bar_chart", label: "Analytics", href: "/admin/analytics", desc: "Sales & performance" },
  { icon: "settings", label: "Settings", href: "/admin/settings", desc: "Café configuration" },
];

const recentOrders = [
  { id: "#ORD-9421", customer: "James Owusu", items: "Cold Brew + Croissant", total: "$12.50", time: "14 min ago", status: "Preparing", statusColor: "text-amber-500 bg-amber-900/20" },
  { id: "#ORD-9420", customer: "Efua Darko", items: "Oat Milk Latte", total: "$4.50", time: "28 min ago", status: "Ready", statusColor: "text-green-500 bg-green-900/20" },
  { id: "#ORD-9419", customer: "Abena Mensah", items: "Pour Over + Pastry Box", total: "$18.00", time: "42 min ago", status: "Completed", statusColor: "text-on-surface/30 bg-surface-container-highest" },
];

export default function AdminDashboard() {
  return (
    <>
      {/* Top Bar */}
      <header className="flex justify-between items-center px-8 h-20 sticky top-0 z-40 bg-deep-espresso/80 backdrop-blur-xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Dashboard</h2>
          <p className="text-xs text-on-surface/30 font-label">Welcome back, Jennifer</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined text-on-surface/30 hover:text-primary cursor-pointer">notifications</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1280px] mx-auto space-y-10">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((s) => (
            <div key={s.label} className="bg-surface-container-low p-6 rounded-2xl hover:translate-y-[-2px] transition-transform" style={{ border: "1px solid rgba(82,68,57,0.08)" }}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-primary">{s.icon}</span></div>
                <span className="text-xs font-bold text-green-500">{s.change}</span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30 mb-1">{s.label}</p>
              <h3 className={`font-headline text-3xl font-bold ${s.color}`}>{s.value}</h3>
            </div>
          ))}
        </section>

        {/* Quick Links Grid */}
        <section>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Quick Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((l) => (
              <Link key={l.href} href={l.href} className="group bg-surface-container p-5 rounded-xl hover:bg-surface-container-high transition-all hover:shadow-md">
                <span className="material-symbols-outlined text-2xl text-primary mb-3 block group-hover:scale-110 transition-transform">{l.icon}</span>
                <h4 className="font-bold text-sm text-on-surface mb-1">{l.label}</h4>
                <p className="text-xs text-on-surface/30">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Orders */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-xl font-bold text-on-surface">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline">View All →</Link>
          </div>
          <div className="bg-surface-container-low rounded-xl overflow-hidden" style={{ border: "1px solid rgba(82,68,57,0.08)" }}>
            <div className="divide-y divide-surface-container-highest/10">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-high/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-primary font-bold">{o.id}</span>
                    <div>
                      <p className="text-sm font-bold">{o.customer}</p>
                      <p className="text-xs text-on-surface/30">{o.items}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-sm font-bold">{o.total}</span>
                    <span className="text-xs text-on-surface/20">{o.time}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-tight ${o.statusColor}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
