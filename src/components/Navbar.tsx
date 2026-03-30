import Link from "next/link";

/* ─────────────────────────────────────────────
   Navbar — Sticky top navigation
   Design: No borders/shadows. Deep espresso bg.
   Fraunces italic logo, DM Sans nav links.
   ───────────────────────────────────────────── */

const navLinks = [
  { label: "Menu", href: "/#menu", active: true },
  { label: "Reservations", href: "/reservations" },
  { label: "Subscribe", href: "/subscription" },
];

export default function Navbar() {
  return (
    <nav className="w-full top-0 sticky z-50 bg-deep-espresso" role="navigation" aria-label="Main navigation">
      <div className="flex justify-between items-center px-4 py-5 md:px-8 md:py-6 max-w-7xl mx-auto">
        {/* Logo — Fraunces italic */}
        <Link href="/" className="text-primary font-headline text-xl md:text-2xl italic font-bold tracking-tight">
          Jennifer&apos;s Café
        </Link>

        {/* Desktop Nav Links — DM Sans */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-body font-medium transition-colors duration-300 ${
                link.active
                  ? "text-primary decoration-primary decoration-2 underline underline-offset-8"
                  : "text-on-surface/50 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side — Auth actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/login" className="hidden md:block text-on-surface/50 font-body font-medium hover:text-on-surface transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="amber-glow text-on-primary px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider active:scale-95 transition-all duration-200">
            Get Started
          </Link>

          {/* Mobile hamburger */}
          <button className="md:hidden text-primary cursor-pointer" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
