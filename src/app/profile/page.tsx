import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

/* ─────────────────────────────────────────────
   Profile / Account Settings
   Desktop: sidebar nav (fixed) + content area
   Mobile: stacked sections
   Sections: Personal Info form, Photo upload,
   Dietary preferences, Loyalty card, Danger zone
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Profile & Settings | Jennifer's Café",
  description: "Manage your personal details, payment methods, and preferences.",
};

/* ── Icons ── */
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
function CameraIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
}
function TrophyIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" /></svg>;
}
function PlusCircleIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
}

const sidebarItems = [
  { icon: <PersonIcon />, label: "Personal Info", active: true, href: "/profile" },
  { icon: <ShieldIcon />, label: "Security", href: "#" },
  { icon: <CreditCardIcon />, label: "Payment Methods", href: "#" },
  { icon: <UtensilsIcon />, label: "Dietary Preferences", href: "#" },
  { icon: <BellIcon />, label: "Notifications", href: "/notifications" },
  { icon: <RepeatIcon />, label: "Subscriptions", href: "/subscription" },
  { icon: <MapPinIcon />, label: "Saved Addresses", href: "#" },
];

const dietaryOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Nut-Free", "Lactose-Free", "Halal"];

export default function ProfilePage() {
  return (
    <>
      {/* Mobile-only top bar */}
      <div className="md:hidden">
        <Navbar />
      </div>

      <div className="flex min-h-screen">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden md:flex fixed left-0 top-0 h-full z-40 w-72 bg-deep-espresso flex-col" style={{ borderRight: "1px solid rgba(82,68,57,0.1)" }}>
          {/* Brand + Profile */}
          <div className="p-8 space-y-6">
            <Link href="/" className="text-2xl font-headline text-primary-container">Jennifer&apos;s Café</Link>
            <div className="space-y-4">
              <div className="relative w-20 h-20 group">
                <div className="w-full h-full rounded-full bg-surface-container-highest overflow-hidden ring-2 ring-primary/30">
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface/20">
                    <PersonIcon />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-primary-container text-deep-espresso p-1 rounded-full cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </div>
              </div>
              <div>
                <h3 className="font-headline text-xl text-on-surface">Jennifer Smith</h3>
                <p className="text-xs text-on-surface/30 font-label">jennifer@specialtycoffee.com</p>
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
            {sidebarItems.map((item) => (
              <Link key={item.label} href={item.href || "#"} className={`flex items-center gap-4 px-4 py-3 transition-colors duration-200 ${item.active ? "text-primary font-bold bg-surface-container-low" : "text-on-surface/30 hover:text-on-surface/60 hover:bg-surface-container-low"}`} style={item.active ? { borderRight: "4px solid var(--color-primary, #C8864A)" } : undefined}>
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
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

        {/* ── Main Content ── */}
        <main className="flex-1 md:ml-72 bg-deep-espresso min-h-screen">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-40 md:py-16">
            <div className="mb-10 md:mb-12">
              <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Personal Info</h1>
              <p className="text-on-surface/40 max-w-lg">Manage your personal details and how we can reach you to provide the best café experience.</p>
            </div>

            <div className="space-y-10 md:space-y-12">
              {/* Profile Section */}
              <section className="bg-surface-container rounded-2xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Photo Upload */}
                  <div className="flex items-center gap-6 md:col-span-2 pb-6" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-highest relative group cursor-pointer">
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface/20">
                        <PersonIcon />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <CameraIcon />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-on-surface mb-1">Profile Photo</h4>
                      <p className="text-xs text-on-surface/30 mb-3">JPG, GIF or PNG. Max size of 2MB.</p>
                      <button className="text-sm text-primary font-semibold hover:underline cursor-pointer">Update Photo</button>
                    </div>
                  </div>
                  {/* Form Fields */}
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">First Name</label>
                    <input className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" type="text" defaultValue="Jennifer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Last Name</label>
                    <input className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" type="text" defaultValue="Smith" />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Email Address</label>
                    <div className="relative">
                      <input className="w-full bg-surface-container-highest rounded-lg p-3 pr-24 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" type="email" defaultValue="jennifer@specialtycoffee.com" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-900/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ border: "1px solid rgba(52,211,153,0.2)" }}>VERIFIED</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Phone Number</label>
                    <button className="w-full text-left bg-surface-container-highest rounded-lg p-3 text-primary flex items-center gap-2 hover:bg-surface-bright transition-colors cursor-pointer" style={{ border: "1px dashed rgba(82,68,57,0.3)" }}>
                      <PlusCircleIcon /> <span className="text-sm font-medium">Add phone number</span>
                    </button>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Date of Birth</label>
                    <input className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" type="date" defaultValue="1992-04-15" />
                  </div>
                </div>
              </section>

              {/* Dietary Preferences */}
              <section className="space-y-6">
                <div>
                  <h2 className="font-headline text-2xl text-on-surface">Dietary Preferences</h2>
                  <p className="text-sm text-on-surface/30">We&apos;ll use these to suggest menu items and tailor our daily specials.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {dietaryOptions.map((opt) => (
                    <button key={opt} className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${opt === "Vegan" ? "amber-glow text-on-primary" : "bg-surface-container-highest text-on-surface/40 hover:bg-surface-bright"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </section>

              {/* Save */}
              <div className="pt-4" style={{ borderTop: "1px solid rgba(82,68,57,0.1)" }}>
                <button className="px-8 py-3 rounded-2xl amber-glow text-on-primary font-bold hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">Save Changes</button>
              </div>

              {/* Danger Zone */}
              <section className="mt-16 md:mt-24 p-8 rounded-2xl space-y-4" style={{ background: "rgba(147,0,10,0.05)", border: "1px solid rgba(147,0,10,0.1)" }}>
                <div>
                  <h3 className="font-headline text-xl text-red-400 mb-1">Danger Zone</h3>
                  <p className="text-sm text-on-surface/30">Deleting your account is permanent and will remove all your points and history.</p>
                </div>
                <button className="px-6 py-2 rounded-xl font-bold text-sm text-red-400 hover:bg-red-900/10 transition-colors cursor-pointer" style={{ border: "2px solid rgba(239,68,68,0.5)" }}>Delete Account</button>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav activeTab="home" />
        <div className="h-24" />
      </div>
    </>
  );
}
