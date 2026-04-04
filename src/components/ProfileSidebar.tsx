'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

function PersonIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function ShieldIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function CreditCardIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
}
function UtensilsIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>;
}
function BellIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function RepeatIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}
function MapPinIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function GearIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}
function LogoutIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
function TrophyIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" /></svg>;
}

export default function ProfileSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
      
      setProfile({
        full_name: data?.full_name || user.user_metadata?.full_name || null,
        avatar_url: data?.avatar_url || null,
        email: user.email || null,
      });
    }
    load();

    const handleAvatarUpdate = (e: any) => {
      setProfile(prev => prev ? { ...prev, avatar_url: e.detail } : null);
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdate);
  }, []);

  const sidebarItems = [
    { icon: <PersonIcon />, label: "Personal Info", href: "/profile" },
    { icon: <ShieldIcon />, label: "Security", href: "/profile/security" },
    { icon: <CreditCardIcon />, label: "Payment Methods", href: "/profile/payment-methods" },
    { icon: <UtensilsIcon />, label: "Dietary Preferences", href: "/profile" },
    { icon: <BellIcon />, label: "Notifications", href: "/notifications" },
    { icon: <RepeatIcon />, label: "Subscriptions", href: "/profile/subscriptions" },
    { icon: <MapPinIcon />, label: "Saved Addresses", href: "/profile/addresses" },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full z-40 w-72 bg-deep-espresso flex-col" style={{ borderRight: "1px solid rgba(82,68,57,0.1)" }}>
      {/* Brand + Profile */}
      <div className="p-8 space-y-6">
        <Link href="/" className="text-2xl font-headline text-primary-container">Jennifer&apos;s Café</Link>
        <div className="space-y-4">
          <div className="relative w-20 h-20 group">
            <div className="w-full h-full rounded-full bg-surface-container-highest overflow-hidden ring-2 ring-primary/30 relative">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface/20">
                  <PersonIcon />
                </div>
              )}
            </div>
            <Link href="/profile" className="absolute bottom-0 right-0 bg-primary-container text-deep-espresso p-1 rounded-full cursor-pointer hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </Link>
          </div>
          <div>
            {profile ? (
              <>
                <h3 className="font-headline text-xl text-on-surface">{profile.full_name || 'Coffee Lover'}</h3>
                <p className="text-xs text-on-surface/30 font-label">{profile.email || 'No email provided'}</p>
              </>
            ) : (
              <div className="animate-pulse space-y-2">
                <div className="h-6 bg-surface-container-highest rounded w-3/4"></div>
                <div className="h-3 bg-surface-container-highest rounded w-1/2"></div>
              </div>
            )}
          </div>
        </div>
        {/* Loyalty Card */}
        <div className="bg-surface-container-low p-4 rounded-2xl space-y-3" style={{ border: "1px solid rgba(200,134,74,0.1)" }}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-label uppercase tracking-widest text-primary">Loyalty Rewards</span>
            <TrophyIcon />
          </div>
          <div className="text-sm font-medium">340 points = $3.40</div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "68%" }} />
          </div>
          <button className="text-[11px] font-bold text-primary uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer">View Loyalty Card</button>
        </div>
      </div>
      {/* Nav Links */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const active = pathname === item.href || (item.label === 'Personal Info' && pathname === '/profile');
          return (
            <Link key={item.label} href={item.href || "#"} className={`flex items-center gap-4 px-4 py-3 transition-colors duration-200 ${active ? "text-primary font-bold bg-surface-container-low" : "text-on-surface/30 hover:text-on-surface/60 hover:bg-surface-container-low"}`} style={active ? { borderRight: "4px solid var(--color-primary, #C8864A)" } : undefined}>
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(82,68,57,0.05)" }}>
        <a href="#" className="flex items-center gap-4 px-4 py-3 text-on-surface/30 hover:text-on-surface/60 hover:bg-surface-container-low transition-colors duration-200">
          <GearIcon /> <span className="text-sm">Settings</span>
        </a>
        <a href="#" className="flex items-center gap-4 px-4 py-3 text-on-surface/30 hover:text-on-surface/60 hover:bg-surface-container-low transition-colors duration-200">
          <LogoutIcon /> <span className="text-sm">Logout</span>
        </a>
      </div>
    </aside>
  );
}
