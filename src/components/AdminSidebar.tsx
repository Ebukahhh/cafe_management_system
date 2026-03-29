"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────
   Admin Sidebar + Top AppBar — Shared Shell
   Fixed 240px sidebar on desktop, hidden mobile.
   Active state: amber left border + bg tint
   ───────────────────────────────────────────── */

const navItems = [
  { icon: "dashboard",       label: "Dashboard",     href: "/admin" },
  { icon: "shopping_bag",    label: "Orders",        href: "/admin/orders" },
  { icon: "event",           label: "Reservations",  href: "/admin/reservations" },
  { icon: "restaurant_menu", label: "Menu",          href: "/admin/menu" },
  { icon: "group",           label: "Customers",     href: "/admin/customers" },
  { icon: "loyalty",         label: "Subscriptions", href: "/admin/subscriptions" },
  { icon: "campaign",        label: "Promotions",    href: "/admin/promotions" },
  { icon: "bar_chart",       label: "Analytics",     href: "/admin/analytics" },
  { icon: "settings",        label: "Settings",      href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 w-[240px] bg-[#1A1208]">
      {/* Brand */}
      <div className="p-8">
        <Link href="/admin" className="block">
          <h1 className="font-headline text-xl font-bold text-primary-container">Jennifer&apos;s Café</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface/30 mt-1 font-label">Management System</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                active
                  ? "text-primary bg-primary/10 border-l-4 border-primary font-bold"
                  : "text-on-surface/40 hover:text-on-surface/70 hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto" style={{ borderTop: "1px solid rgba(82,68,57,0.1)" }}>
        <div className="flex items-center gap-3 px-3 py-3 bg-surface-container-low rounded-xl">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-xs">JA</div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-on-surface truncate">Jennifer A.</p>
            <p className="text-[10px] text-on-surface/30 truncate font-label">Administrator</p>
          </div>
        </div>
      </div>

      {/* Google Material Icons link */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    </aside>
  );
}
