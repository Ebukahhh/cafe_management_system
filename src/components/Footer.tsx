import Link from "next/link";

const footerLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Reservations", href: "/reservations" },
  { label: "Subscribe", href: "/subscription" },
  { label: "Privacy Policy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-deep-espresso" role="contentinfo">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-12 md:py-16 gap-8 w-full max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="text-primary font-headline text-xl md:text-xl italic font-bold">
            Jennifer&apos;s Café
          </Link>
          <p className="text-on-surface/30 font-body text-xs uppercase tracking-widest text-center md:text-left">
            © 2026 Jennifer&apos;s Café. All rights reserved.
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-8 md:gap-12" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-sm uppercase tracking-widest text-on-surface/30 hover:text-on-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social icons */}
        <div className="flex gap-6">
          <a href="#" aria-label="Instagram" className="text-on-surface/30 hover:text-primary transition-colors">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.063-1.366.333-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a href="#" aria-label="Twitter" className="text-on-surface/30 hover:text-primary transition-colors">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
