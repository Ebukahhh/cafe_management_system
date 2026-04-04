'use client'

import Link from 'next/link'
import { useAuthLoading } from '@/components/auth/auth-loading-context'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/* ─────────────────────────────────────────────
   Admin Sidebar + Top AppBar — Shared Shell
   Fixed 240px sidebar on desktop, hidden mobile.
   Active state: amber left border + bg tint
   ───────────────────────────────────────────── */

const navItems = [
  { icon: 'dashboard',       label: 'Dashboard',     href: '/admin' },
  { icon: 'shopping_bag',    label: 'Orders',        href: '/admin/orders' },
  { icon: 'event',           label: 'Reservations',  href: '/admin/reservations' },
  { icon: 'restaurant_menu', label: 'Menu',          href: '/admin/menu' },
  { icon: 'group',           label: 'Customers',     href: '/admin/customers' },
  { icon: 'loyalty',         label: 'Subscriptions', href: '/admin/subscriptions' },
  { icon: 'campaign',        label: 'Promotions',    href: '/admin/promotions' },
  { icon: 'bar_chart',       label: 'Analytics',     href: '/admin/analytics' },
  { icon: 'settings',        label: 'Settings',      href: '/admin/settings' },
]

function getInitials(user: User): string {
  const meta = user.user_metadata
  const full: string = meta?.full_name || meta?.name || user.email || '?'
  const parts = full.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return full.slice(0, 2).toUpperCase()
}

function getDisplayName(user: User): string {
  const meta = user.user_metadata
  return meta?.full_name || meta?.name || user.email || 'Admin'
}

interface Props {
  user: User
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { start, stop } = useAuthLoading()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  async function handleSignOut() {
    start('signing-out')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    stop()
  }

  const initials = getInitials(user)
  const displayName = getDisplayName(user)

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 w-[240px] bg-[#1A1208]">
      {/* Brand */}
      <div className="p-8">
        <Link href="/admin" className="block">
          <h1 className="font-headline text-xl font-bold text-primary-container">Jennifer&apos;s Café</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface/30 mt-1 font-label">Management System</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                active
                  ? 'text-primary bg-primary/10 border-l-4 border-primary font-bold'
                  : 'text-on-surface/40 hover:text-on-surface/70 hover:bg-surface-container-low'
              }`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer — user info + sign out */}
      <div className="p-4 mt-auto" style={{ borderTop: '1px solid rgba(82,68,57,0.1)' }}>
        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-3 bg-surface-container-low rounded-xl mb-2">
          <div className="w-10 h-10 rounded-full amber-glow flex items-center justify-center text-on-primary font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-on-surface truncate">{displayName}</p>
            <p className="text-[10px] text-on-surface/30 truncate font-label">Administrator</p>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-on-surface/40 hover:text-red-400 hover:bg-red-900/10 transition-all cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>

      {/* Google Material Icons */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    </aside>
  )
}
