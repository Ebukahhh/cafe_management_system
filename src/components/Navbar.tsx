'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProtectedLink from "@/components/ProtectedLink";
import type { User } from "@supabase/supabase-js";

/* ─────────────────────────────────────────────
   Navbar — Sticky top navigation
   Design: No borders/shadows. Deep espresso bg.
   Fraunces italic logo, DM Sans nav links.
   Shows avatar + dropdown when authenticated.
   ───────────────────────────────────────────── */

const navLinks = [
  { label: "Menu", href: "/#menu", active: true, protected: false },
  { label: "Reservations", href: "/reservations", protected: true },
  { label: "Subscribe", href: "/subscription", protected: true },
];

function getInitials(user: User): string {
  const meta = user.user_metadata;
  const full: string =
    meta?.full_name || meta?.name || user.email || "?";
  const parts = full.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return full.slice(0, 2).toUpperCase();
}

function getDisplayName(user: User): string {
  const meta = user.user_metadata;
  return meta?.full_name || meta?.name || user.email || "Account";
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Stay in sync with auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setDropdownOpen(false);
    window.location.href = "/";
  }

  return (
    <nav
      className="w-full top-0 sticky z-50 bg-deep-espresso"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center px-4 py-5 md:px-8 md:py-6 max-w-7xl mx-auto">
        {/* Logo — Fraunces italic */}
        <Link
          href="/"
          className="text-primary font-headline text-xl md:text-2xl italic font-bold tracking-tight"
        >
          Jennifer&apos;s Café
        </Link>

        {/* Desktop Nav Links — DM Sans */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) =>
            link.protected ? (
              <ProtectedLink
                key={link.label}
                href={link.href}
                className={`font-body font-medium transition-colors duration-300 ${
                  link.active
                    ? "text-primary decoration-primary decoration-2 underline underline-offset-8"
                    : "text-on-surface/50 hover:text-primary"
                }`}
              >
                {link.label}
              </ProtectedLink>
            ) : (
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
            )
          )}
        </div>

        {/* Right side — Auth actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            /* ── Authenticated: Avatar + dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                aria-label="Open account menu"
                aria-expanded={dropdownOpen}
                className="group flex items-center gap-2.5 cursor-pointer focus:outline-none"
              >
                {/* Avatar circle */}
                <span className="w-9 h-9 rounded-full amber-glow flex items-center justify-center text-on-primary font-bold text-sm select-none ring-2 ring-primary/30 group-hover:ring-primary/70 transition-all duration-200">
                  {getInitials(user)}
                </span>
                {/* Chevron */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`hidden md:block text-on-surface/40 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-[#1e1208] animate-fade-in">
                  {/* User info header */}
                  <div className="px-4 py-3.5 border-b border-white/10">
                    <p className="text-on-surface text-sm font-semibold truncate">
                      {getDisplayName(user)}
                    </p>
                    <p className="text-on-surface/40 text-xs truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface/70 hover:text-on-surface hover:bg-white/5 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface/70 hover:text-on-surface hover:bg-white/5 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      My Orders
                    </Link>
                    <Link
                      href="/reservations"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface/70 hover:text-on-surface hover:bg-white/5 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Reservations
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-white/10 py-1.5">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest: Sign In + Get Started ── */
            <>
              <Link
                href="/login"
                className="hidden md:block text-on-surface/50 font-body font-medium hover:text-on-surface transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="amber-glow text-on-primary px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider active:scale-95 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-primary cursor-pointer"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
