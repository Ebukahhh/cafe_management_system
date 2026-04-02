'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { StaffPortalProvider, useStaffPortal, type StaffProfile } from './staff-portal-context'

export default function StaffPortalShell({
  profile,
  children,
}: {
  profile: StaffProfile
  children: React.ReactNode
}) {
  return (
    <StaffPortalProvider profile={profile}>
      <div className="flex min-h-dvh flex-col bg-[#0F0D0B] text-on-surface">
        <StaffChrome />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </StaffPortalProvider>
  )
}

function StaffChrome() {
  const router = useRouter()
  const {
    profile,
    activeTab,
    setActiveTab,
    activePipelineCount,
    notificationCount,
  } = useStaffPortal()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-[#1A1208] px-4 py-4 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="font-headline text-lg italic text-primary md:text-xl">
            Jennifer&apos;s Café
          </span>
        </div>

        <div className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-3 md:flex">
          <div className="flex items-center rounded-full border border-outline-variant/20 bg-surface-container px-4 py-2 text-xs">
            <span className="mr-3 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-mono tracking-wide text-on-surface/90">Live — receiving orders</span>
          </div>
          <div className="flex max-w-md items-center gap-3 rounded-full border border-outline-variant/20 bg-surface-container px-4 py-2">
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  profile.avatar_url ??
                  'data:image/svg+xml,' +
                    encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="%23362514" width="32" height="32"/><text x="16" y="21" text-anchor="middle" fill="%23C8864A" font-size="12" font-family="system-ui">☕</text></svg>'
                    )
                }
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <div className="min-w-0 text-left">
              <p className="truncate font-headline text-sm font-bold text-on-surface">
                {profile.full_name?.trim() || 'Staff'}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Barista
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
          <div className="relative">
            <span className="material-symbols-outlined text-2xl text-stone-400">notifications</span>
            {notificationCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-bold text-[#482400]">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="rounded-full border border-primary px-4 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-[#482400]"
          >
            Sign Out
          </button>
        </div>
      </header>

      <nav className="flex shrink-0 gap-1 border-b border-white/5 bg-[#1A1208] px-4 md:px-8">
        <TabButton
          active={activeTab === 'live'}
          onClick={() => setActiveTab('live')}
          label="Live Orders"
          badge={activePipelineCount}
        />
        <TabButton
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          label="Order History"
        />
        <TabButton
          active={activeTab === 'report'}
          onClick={() => setActiveTab('report')}
          label="Daily Report"
          icon="description"
        />
      </nav>
    </>
  )
}

function TabButton({
  active,
  onClick,
  label,
  badge,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  badge?: number
  icon?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors md:px-6 ${
        active
          ? 'border-primary text-on-surface'
          : 'border-transparent text-stone-500 hover:text-stone-300'
      }`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-lg opacity-80">{icon}</span>
      ) : null}
      {label}
      {badge !== undefined && badge > 0 ? (
        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </button>
  )
}
