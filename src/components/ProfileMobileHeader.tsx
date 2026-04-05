'use client'

import Link from "next/link";
import { useState, useEffect } from "react";

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

interface ProfileMobileHeaderProps {
  /** The page title shown in the centre of the bar */
  title?: string;
}

export default function ProfileMobileHeader({ title = "My Account" }: ProfileMobileHeaderProps) {
  // Dispatch a custom event that ProfileSidebar listens to
  function openSidebar() {
    window.dispatchEvent(new CustomEvent("open-profile-sidebar"));
  }

  return (
    <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14 bg-deep-espresso border-b border-white/5">
      {/* Menu trigger */}
      <button
        onClick={openSidebar}
        className="p-2 -ml-1 rounded-xl text-on-surface/60 hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
        aria-label="Open profile menu"
        id="profile-sidebar-trigger"
      >
        <MenuIcon />
      </button>

      {/* Page title */}
      <span className="font-headline text-base text-on-surface/80 tracking-tight">
        {title}
      </span>

      {/* Home shortcut */}
      <Link
        href="/"
        className="p-2 -mr-1 rounded-xl text-on-surface/60 hover:text-primary hover:bg-surface-container-low transition-colors"
        aria-label="Go to home"
      >
        <HomeIcon />
      </Link>
    </header>
  );
}
