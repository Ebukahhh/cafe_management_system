import Link from "next/link";

/* ─────────────────────────────────────────────
   BottomNav — Mobile bottom navigation bar
   Design: Glassmorphism bg, backdrop-blur, no hard borders.
   Active item gets primary tint bg + primary color.
   Hidden on md+ breakpoints.
   ───────────────────────────────────────────── */

/* SVG icon components */
function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

interface BottomNavProps {
  activeTab?: "home" | "menu" | "orders" | "reservations" | "profile";
}

const tabs = [
  { key: "home", label: "Home", icon: HomeIcon, href: "/" },
  { key: "menu", label: "Menu", icon: MenuIcon, href: "/menu" },
  { key: "orders", label: "Orders", icon: OrdersIcon, href: "/orders" },
  { key: "reservations", label: "Reservations", icon: CalendarIcon, href: "/reservations" },
  { key: "profile", label: "Profile", icon: ProfileIcon, href: "/profile" },
] as const;

export default function BottomNav({ activeTab = "home" }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-deep-espresso/90 backdrop-blur-xl z-50 rounded-t-2xl"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {tabs.map(({ key, label, icon: Icon, href }) => {
        const isActive = key === activeTab;
        return (
          <Link
            key={key}
            href={href}
            className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
              isActive
                ? "bg-primary/10 text-primary rounded-xl px-3 py-1"
                : "text-on-surface/30"
            }`}
          >
            <Icon />
            <span className="font-body text-[10px] tracking-tight mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
