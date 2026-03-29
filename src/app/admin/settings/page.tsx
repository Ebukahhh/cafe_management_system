import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Jennifer's Café Admin",
  description: "Manage café details, opening hours, subscription policies, and staff access.",
};

const openingHours = [
  { day: "Monday", on: true, time: "07:00 AM - 08:00 PM" },
  { day: "Tuesday", on: true, time: "07:00 AM - 08:00 PM" },
  { day: "Wednesday", on: true, time: "07:00 AM - 08:00 PM" },
  { day: "Thursday", on: true, time: "07:00 AM - 08:00 PM" },
  { day: "Friday", on: true, time: "07:00 AM - 10:00 PM" },
  { day: "Saturday", on: false, time: "Closed" },
  { day: "Sunday", on: false, time: "Closed" },
];

const staff = [
  { initials: "KW", name: "Kofi Wadie", email: "kofi@jenniferscafe.com", role: "Admin", lastActive: "2 mins ago" },
  { initials: "MA", name: "Mawuli Akotey", email: "mawuli@jenniferscafe.com", role: "Barista", lastActive: "1 hour ago" },
  { initials: "EN", name: "Esi Nkroma", email: "esi@jenniferscafe.com", role: "Inventory", lastActive: "Yesterday" },
];

export default function AdminSettingsPage() {
  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-240px)] h-16 z-40 bg-deep-espresso/80 backdrop-blur-xl flex justify-between items-center px-8" style={{ borderBottom: "1px solid rgba(82,68,57,0.05)" }}>
        <h1 className="font-headline font-bold text-2xl text-primary">Settings</h1>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-on-surface/30 hover:text-on-surface cursor-pointer">notifications</span>
          <span className="material-symbols-outlined text-on-surface/30 hover:text-on-surface cursor-pointer">account_circle</span>
        </div>
      </header>

      {/* Sub-Navigation */}
      <nav className="fixed top-16 left-[240px] w-[200px] h-[calc(100vh-64px)] bg-[#241B11] py-8 flex-col z-30 hidden lg:flex" style={{ borderRight: "1px solid rgba(82,68,57,0.05)" }}>
        <div className="px-6 mb-6"><h3 className="text-[10px] font-bold text-on-surface/30 uppercase tracking-widest">General</h3></div>
        {[{ label: "Café Details", active: true }, { label: "Opening Hours" }, { label: "Notifications" }, { label: "Payment" }].map((item) => (
          <a key={item.label} href="#" className={`px-6 py-3 text-sm font-medium block transition-all ${item.active ? "text-primary bg-primary/5 border-r-2 border-primary" : "text-on-surface/30 hover:text-on-surface/60 hover:bg-on-surface/5"}`}>{item.label}</a>
        ))}
        <div className="px-6 mt-8 mb-6"><h3 className="text-[10px] font-bold text-on-surface/30 uppercase tracking-widest">Operational</h3></div>
        {["Subscription Settings", "Staff Access"].map((label) => (
          <a key={label} href="#" className="px-6 py-3 text-sm font-medium text-on-surface/30 hover:text-on-surface/60 hover:bg-on-surface/5 transition-all block">{label}</a>
        ))}
        <div className="mt-auto px-6 py-4">
          <a href="#" className="flex items-center gap-2 text-sm font-medium text-red-400 opacity-60 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-sm">dangerous</span> Danger Zone
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:ml-[200px] mt-16 lg:h-[calc(100vh-64px)] overflow-y-auto p-8 lg:p-12 pb-32">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <section>
            <h2 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">Café Details</h2>
            <p className="text-on-surface/30 text-lg">Manage your brand identity and contact information.</p>
          </section>

          {/* Core Identity */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="col-span-1">
              <h3 className="font-headline text-xl text-primary mb-2">Core Identity</h3>
              <p className="text-sm text-on-surface/30">How your café appears to customers and in automated communications.</p>
            </div>
            <div className="col-span-2 space-y-8 bg-surface-container rounded-2xl p-8" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
              <div className="flex items-center gap-8 mb-4">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-2xl bg-surface-container-highest ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all overflow-hidden flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface/10">local_cafe</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-symbols-outlined text-white">edit</span></div>
                </div>
                <div>
                  <button className="px-6 py-2.5 bg-primary-container text-on-primary rounded-full text-sm font-bold tracking-wide hover:shadow-xl transition-all active:scale-95 cursor-pointer">Change Logo</button>
                  <p className="text-[10px] text-on-surface/30 mt-2 font-mono uppercase tracking-tighter">JPG, PNG OR SVG. MAX 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface/30 uppercase tracking-widest">Café Name</label>
                  <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary transition-all outline-none" defaultValue="Jennifer's Café Management System — Accra Central" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface/30 uppercase tracking-widest">Address</label>
                  <textarea className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary transition-all h-24 outline-none resize-none" defaultValue="Oxford St, Osu, Accra, Ghana" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface/30 uppercase tracking-widest">Phone</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary transition-all outline-none" defaultValue="+233 24 000 0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface/30 uppercase tracking-widest">Email</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary transition-all outline-none" type="email" defaultValue="hello@jenniferscafe.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface/30 uppercase tracking-widest">Website URL</label>
                  <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary transition-all outline-none" type="url" defaultValue="https://jenniferscafe.com" />
                </div>
              </div>
            </div>
          </section>

          {/* Opening Hours */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="col-span-1">
              <h3 className="font-headline text-xl text-primary mb-2">Opening Hours</h3>
              <p className="text-sm text-on-surface/30">Set your standard weekly availability for walk-ins and bookings.</p>
            </div>
            <div className="col-span-2 overflow-hidden bg-surface-container rounded-2xl" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                  <tr>
                    {["Day", "Status", "Time Range"].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-bold text-on-surface/30 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/5">
                  {openingHours.map((d) => (
                    <tr key={d.day} className={`hover:bg-on-surface/5 transition-colors ${!d.on ? "opacity-50 grayscale" : ""}`}>
                      <td className="px-6 py-4 text-sm font-medium">{d.day}</td>
                      <td className="px-6 py-4">
                        <div className={`w-10 h-5 rounded-full relative ${d.on ? "bg-primary" : "bg-surface-variant"}`}>
                          <div className={`absolute top-1 w-3 h-3 rounded-full ${d.on ? "right-1 bg-white" : "left-1 bg-on-surface/30"}`} />
                        </div>
                      </td>
                      <td className={`px-6 py-4 font-mono text-sm ${d.on ? "text-on-surface" : "text-on-surface/30"}`}>{d.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Subscription Settings */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="col-span-1">
              <h3 className="font-headline text-xl text-primary mb-2">Subscription Policies</h3>
              <p className="text-sm text-on-surface/30">Rules for your recurring customers and bean subscriptions.</p>
            </div>
            <div className="col-span-2 p-8 bg-surface-container rounded-2xl space-y-8" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-on-surface">Enable Subscription Service</h4>
                  <p className="text-xs text-on-surface/30">Allow customers to enroll in monthly coffee plans.</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" /></div>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8" style={{ borderTop: "1px solid rgba(82,68,57,0.1)" }}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface/30 uppercase tracking-widest">Min. Notice (Days)</label>
                  <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary transition-all font-mono outline-none" type="number" defaultValue="30" />
                  <p className="text-[10px] text-on-surface/20 italic">Notice period for cancellation</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface/30 uppercase tracking-widest">Pause Threshold</label>
                  <input className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary transition-all font-mono outline-none" type="number" defaultValue="3" />
                  <p className="text-[10px] text-on-surface/20 italic">Failed payments before pause</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h4 className="font-bold text-on-surface">Allow Skip Cycles</h4>
                  <p className="text-xs text-on-surface/30">Enable customers to skip a month without canceling.</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" /></div>
              </div>
            </div>
          </section>

          {/* Staff Access */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="col-span-1">
              <h3 className="font-headline text-xl text-primary mb-2">Staff Access</h3>
              <p className="text-sm text-on-surface/30">Control who can access this dashboard and their permissions.</p>
            </div>
            <div className="col-span-2 space-y-6">
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-highest text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-on-primary transition-all cursor-pointer" style={{ border: "1px solid rgba(200,134,74,0.2)" }}>
                  <span className="material-symbols-outlined text-sm">person_add</span> Invite Staff Member
                </button>
              </div>
              <div className="overflow-hidden bg-surface-container rounded-2xl" style={{ border: "1px solid rgba(82,68,57,0.1)" }}>
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                    <tr>
                      {["Name", "Role", "Last Active", "Actions"].map((h) => (
                        <th key={h} className={`px-6 py-4 text-xs font-bold text-on-surface/30 uppercase tracking-widest ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-on-surface/5">
                    {staff.map((s) => (
                      <tr key={s.name} className="hover:bg-on-surface/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xs">{s.initials}</div>
                            <div>
                              <p className="text-sm font-bold">{s.name}</p>
                              <p className="text-[10px] text-on-surface/30">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold uppercase rounded-full tracking-wider">{s.role}</span></td>
                        <td className="px-6 py-4 text-xs font-mono text-on-surface/30">{s.lastActive}</td>
                        <td className="px-6 py-4 text-right"><button className="material-symbols-outlined text-on-surface/30 hover:text-on-surface transition-colors cursor-pointer">more_vert</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Fixed Save Bar */}
      <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-440px)] h-20 bg-deep-espresso/90 backdrop-blur-md z-50 flex items-center justify-between px-12" style={{ borderTop: "1px solid rgba(82,68,57,0.1)" }}>
        <p className="text-sm text-on-surface/30 italic">Last saved 12 minutes ago.</p>
        <div className="flex gap-4">
          <button className="px-8 py-3 text-sm font-bold text-on-surface/30 hover:text-on-surface transition-colors cursor-pointer">Discard Changes</button>
          <button className="px-12 py-3 amber-glow text-on-primary font-bold text-sm rounded-xl shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95 cursor-pointer">Save Settings</button>
        </div>
      </div>
    </>
  );
}
