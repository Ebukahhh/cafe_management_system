import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────
   Notification Inbox
   Centered single-column layout:
   Header + filter pills → unread items (amber left border) →
   read items (muted) → empty state footer
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Notifications | Jennifer's Café",
  description: "Stay up to date with your orders, reservations, and promotions.",
};

/* ── Icon Components ── */
function FoodIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>;
}
function UpdateIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}
function CalendarCheckIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><polyline points="9 16 11 18 15 14" /></svg>;
}
function TagIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
}
function ReceiptIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /></svg>;
}
function BellOffIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0" /><path d="M18.63 13A17.89 17.89 0 0 1 18 8" /><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" /><path d="M18 8a6 6 0 0 0-9.33-5" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
}

const filters = ["All", "Orders", "Reservations", "Subscriptions", "Promotions"];

const notifications = [
  {
    unread: true,
    icon: <FoodIcon />,
    title: "Your order is ready for pickup!",
    time: "Just now",
    body: "Order #0047 is freshly prepared and waiting for you at the counter.",
    action: { label: "Track Order", href: "/order-tracking", variant: "primary" as const },
  },
  {
    unread: true,
    icon: <UpdateIcon />,
    title: "Subscription order in 30 minutes",
    time: "24m ago",
    body: "Your Weekday Morning Order is scheduled for preparation soon.",
    action: { label: "Skip This Order", href: "#", variant: "link" as const },
  },
  {
    unread: true,
    icon: <CalendarCheckIcon />,
    title: "Reservation confirmed!",
    time: "2h ago",
    body: "Sat 5 April, 11:00am. We've saved a cozy window seat for you.",
    action: { label: "View Reservation", href: "/reservations", variant: "secondary" as const },
  },
  {
    unread: false,
    icon: <TagIcon />,
    title: "20% off this weekend only",
    time: "Yesterday",
    body: "Enjoy a weekend treat on us. Use Code: WEEKEND20 at checkout.",
  },
  {
    unread: false,
    icon: <ReceiptIcon />,
    title: "Order #0045 Delivered",
    time: "2 days ago",
    body: "Your order has been delivered. How did we do? Leave a review!",
    action: { label: "Rate Your Order", href: "#", variant: "link" as const },
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <Navbar />
      <main className="max-w-[720px] mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight">Notifications</h1>
            <span className="bg-primary-container text-deep-espresso px-3 py-1 rounded-full text-sm font-bold">{unreadCount} unread</span>
          </div>
          <button className="text-primary hover:underline text-sm font-medium transition-all cursor-pointer text-left">Mark all as read</button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
          {filters.map((f) => (
            <button
              key={f}
              className={`px-5 py-2 rounded-full text-sm transition-all cursor-pointer ${
                f === "All"
                  ? "bg-primary text-deep-espresso font-medium"
                  : "bg-surface-container-high text-on-surface/40 hover:bg-surface-bright"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((n, i) => (
            <div
              key={i}
              className={`rounded-xl p-5 transition-all ${
                n.unread
                  ? "bg-primary/5 hover:bg-primary/10"
                  : "bg-surface-container-low hover:bg-surface-container"
              }`}
              style={n.unread ? { borderLeft: "4px solid var(--color-primary, #C8864A)" } : undefined}
            >
              <div className={`flex gap-4 ${!n.unread ? "opacity-70" : ""}`}>
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  n.unread ? "bg-primary/20 text-primary" : "bg-on-surface/5 text-on-surface/30"
                }`}>
                  {n.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`${n.unread ? "font-bold" : "font-medium"} text-on-surface`}>{n.title}</h3>
                    <span className={`text-[11px] font-label uppercase tracking-widest whitespace-nowrap ml-4 ${
                      n.unread ? "text-primary" : "text-on-surface/20"
                    }`}>{n.time}</span>
                  </div>
                  <p className="text-on-surface/40 text-sm mb-4">{n.body}</p>
                  {n.action && (
                    n.action.variant === "primary" ? (
                      <Link href={n.action.href} className="inline-flex items-center gap-2 bg-primary text-deep-espresso px-4 py-2 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all">
                        {n.action.label}
                      </Link>
                    ) : n.action.variant === "secondary" ? (
                      <Link href={n.action.href} className="inline-flex items-center gap-2 bg-surface-variant text-on-surface px-4 py-2 rounded-xl text-xs font-bold hover:bg-surface-bright transition-all">
                        {n.action.label}
                      </Link>
                    ) : (
                      <button className="text-primary text-xs font-bold underline-offset-4 hover:underline cursor-pointer">
                        {n.action.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Footer */}
        <div className="mt-16 md:mt-20 flex flex-col items-center text-center opacity-40">
          <div className="w-20 h-20 mb-4 flex items-center justify-center bg-surface-container-high rounded-full">
            <BellOffIcon />
          </div>
          <p className="font-headline text-xl">You&apos;re all caught up.</p>
          <p className="text-sm">Check back later for more updates from Jennifer&apos;s Café.</p>
        </div>
      </main>
    </>
  );
}
