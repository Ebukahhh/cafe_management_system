'use client'

import Link from "next/link";
import { useState, useTransition } from "react";
import type { NotificationRow } from "./page";
import { createClient } from "@/lib/supabase/client";

/* ── Icons ── */
function FoodIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>;
}
function UpdateIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}
function CalendarCheckIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><polyline points="9 16 11 18 15 14" /></svg>;
}
function TagIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
}
function ReceiptIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /></svg>;
}
function BellOffIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0" /><path d="M18.63 13A17.89 17.89 0 0 1 18 8" /><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" /><path d="M18 8a6 6 0 0 0-9.33-5" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
}
function CheckAllIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /><polyline points="22 6 12 17" /></svg>;
}

/* ── Helpers ── */
function getIconForType(type: NotificationRow['type']) {
  switch (type) {
    case 'order_update':       return <FoodIcon />;
    case 'reservation_update': return <CalendarCheckIcon />;
    case 'subscription_alert': return <UpdateIcon />;
    case 'promotion':          return <TagIcon />;
    default:                   return <ReceiptIcon />;
  }
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60)  return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1)    return 'Yesterday';
  return `${days} days ago`;
}

type FilterKey = 'All' | 'Orders' | 'Reservations' | 'Subscriptions' | 'Promotions';

const FILTER_MAP: Record<FilterKey, NotificationRow['type'] | null> = {
  All:           null,
  Orders:        'order_update',
  Reservations:  'reservation_update',
  Subscriptions: 'subscription_alert',
  Promotions:    'promotion',
};

const filters = Object.keys(FILTER_MAP) as FilterKey[];

/* ── Main Component ── */
export default function NotificationsClient({
  notifications: initial,
}: {
  notifications: NotificationRow[];
}) {
  const [notifications, setNotifications] = useState(initial);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [isPending, startTransition] = useTransition();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  /* Filter by type */
  const filtered = FILTER_MAP[activeFilter]
    ? notifications.filter(n => n.type === FILTER_MAP[activeFilter])
    : notifications;

  /* Mark all as read */
  async function markAllRead() {
    const supabase = createClient();
    const ids = notifications.filter(n => !n.is_read).map(n => n.id);
    if (!ids.length) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', ids);

    startTransition(() => {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    });
  }

  /* Mark single as read */
  async function markRead(id: string) {
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    startTransition(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    });
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-deep-espresso px-3 py-1 rounded-full text-sm font-bold tabular-nums">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={isPending}
            className="flex items-center gap-1.5 text-primary hover:opacity-70 text-sm font-medium transition-all cursor-pointer self-start sm:self-auto disabled:opacity-40"
          >
            <CheckAllIcon />
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Filter Pills ── */}
      <div className="flex flex-wrap gap-2 mb-8 md:mb-10" role="tablist" aria-label="Notification filters">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={f === activeFilter}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer font-medium ${
              f === activeFilter
                ? 'bg-primary text-deep-espresso shadow-sm'
                : 'bg-surface-container-high text-on-surface/40 hover:text-on-surface/70 hover:bg-surface-container-highest'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Notification List ── */}
      <div className="space-y-3" role="list">
        {filtered.length === 0 ? (
          /* ── Empty State ── */
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 mb-5 flex items-center justify-center bg-surface-container-high rounded-full text-on-surface/20">
              <BellOffIcon />
            </div>
            <p className="font-headline text-xl text-on-surface/60">
              {activeFilter === 'All' ? "You're all caught up." : `No ${activeFilter.toLowerCase()} notifications.`}
            </p>
            <p className="text-sm text-on-surface/30 mt-1">
              Check back later for updates from Jennifer&apos;s Café.
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const isUnread = !n.is_read;
            return (
              <div
                key={n.id}
                role="listitem"
                onClick={() => isUnread && markRead(n.id)}
                className={`rounded-2xl p-4 md:p-5 transition-all duration-200 group ${
                  isUnread
                    ? 'bg-primary/5 hover:bg-primary/8 cursor-pointer'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
                style={isUnread ? { borderLeft: '3px solid var(--color-primary, #C8864A)' } : undefined}
              >
                <div className={`flex gap-4 ${!isUnread ? 'opacity-60' : ''}`}>
                  {/* Icon badge */}
                  <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
                    isUnread ? 'bg-primary/20 text-primary' : 'bg-on-surface/5 text-on-surface/30'
                  }`}>
                    {getIconForType(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-3 mb-1">
                      <h3 className={`text-sm leading-snug ${isUnread ? 'font-bold text-on-surface' : 'font-medium text-on-surface/70'}`}>
                        {n.title}
                        {isUnread && (
                          <span className="ml-2 inline-block w-1.5 h-1.5 bg-primary rounded-full align-middle" />
                        )}
                      </h3>
                      <span className={`text-[11px] font-label uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${
                        isUnread ? 'text-primary' : 'text-on-surface/20'
                      }`}>
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-on-surface/40 text-sm leading-relaxed">{n.body}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Footer note (when has items) ── */}
      {filtered.length > 0 && unreadCount === 0 && (
        <div className="mt-12 flex flex-col items-center text-center opacity-30">
          <div className="w-14 h-14 mb-3 flex items-center justify-center bg-surface-container-high rounded-full">
            <BellOffIcon />
          </div>
          <p className="font-headline text-base">You&apos;re all caught up.</p>
        </div>
      )}
    </>
  );
}
