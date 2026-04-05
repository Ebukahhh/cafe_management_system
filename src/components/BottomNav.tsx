'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────
   BottomNav — Mobile-only sticky bottom navigation
   Shows Home, Menu, Orders, Profile tabs
   ───────────────────────────────────────────── */

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const tabs = [
  { label: "Home", href: "/", icon: HomeIcon, tab: "home" },
  { label: "Menu", href: "/menu", icon: MenuIcon, tab: "menu" },
  { label: "Orders", href: "/orders", icon: OrdersIcon, tab: "orders" },
  { label: "Profile", href: "/profile", icon: ProfileIcon, tab: "profile" },
] as const;

interface BottomNavProps {
  activeTab?: string;
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-deep-espresso/95 backdrop-blur-xl border-t border-white/5 md:hidden"
      role="navigation"
      aria-label="Bottom navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((t) => {
          const isActive = activeTab
            ? t.tab === activeTab
            : pathname === t.href;
          const Icon = t.icon;
          return (
            <Link
              key={t.tab}
              href={t.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-on-surface/40 hover:text-on-surface/60"
              }`}
            >
              <Icon />
              <span className="text-[10px] font-label font-bold uppercase tracking-wider">
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
