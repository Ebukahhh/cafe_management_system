'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import type { Reservation, ReservationStatus } from '@/lib/supabase/types/database.types'
import type { AdminReservationGuest } from '@/lib/supabase/queries/admin-reservations'
import { reviewReservationAction } from './actions'
import {
  formatMediumDateFromYmd,
  formatRelativeSubmitted,
  formatTimeSlotDisplay,
  toLocalYmd,
} from '@/lib/format-datetime'

export type AdminReservationViewRow = Reservation & {
  guest: AdminReservationGuest | null
}

type FilterTab = 'All' | 'Pending' | 'Confirmed' | 'Declined' | 'Completed'

const FILTER_TABS: FilterTab[] = [
  'All',
  'Pending',
  'Confirmed',
  'Declined',
  'Completed',
]

function noteIcon(note: string | null): string {
  if (!note) return 'chat_bubble'
  if (/birthday|bday|celebration/i.test(note)) return 'cake'
  return 'chat_bubble'
}

function matchesFilter(row: Reservation, tab: FilterTab): boolean {
  if (tab === 'All') return true
  const map: Record<Exclude<FilterTab, 'All'>, ReservationStatus> = {
    Pending: 'pending',
    Confirmed: 'confirmed',
    Declined: 'declined',
    Completed: 'completed',
  }
  return row.status === map[tab]
}

export function ReservationManagerClient({
  dateYmd,
  initialRows,
}: {
  dateYmd: string
  initialRows: AdminReservationViewRow[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [filterTab, setFilterTab] = useState<FilterTab>('All')
  const [actionError, setActionError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const rowsForSelectedDay = useMemo(
    () => initialRows.filter((r) => r.date === dateYmd),
    [initialRows, dateYmd]
  )

  const summary = useMemo(() => {
    const rows = rowsForSelectedDay
    return {
      total: rows.length,
      confirmed: rows.filter((r) => r.status === 'confirmed').length,
      pending: rows.filter((r) => r.status === 'pending').length,
      declined: rows.filter((r) => r.status === 'declined').length,
    }
  }, [rowsForSelectedDay])

  const pendingCountAll = useMemo(
    () => initialRows.filter((r) => r.status === 'pending').length,
    [initialRows]
  )

  const sortByDateTime = (a: AdminReservationViewRow, b: AdminReservationViewRow) =>
    a.date.localeCompare(b.date) || a.time_slot.localeCompare(b.time_slot)

  const pendingRows = useMemo(
    () => initialRows.filter((r) => r.status === 'pending').sort(sortByDateTime),
    [initialRows]
  )
  const confirmedRows = useMemo(
    () => initialRows.filter((r) => r.status === 'confirmed').sort(sortByDateTime),
    [initialRows]
  )
  const declinedRows = useMemo(
    () => initialRows.filter((r) => r.status === 'declined').sort(sortByDateTime),
    [initialRows]
  )
  const completedRows = useMemo(
    () => initialRows.filter((r) => r.status === 'completed').sort(sortByDateTime),
    [initialRows]
  )

  const isSelectedToday = dateYmd === toLocalYmd(new Date())
  /** Summary strip reflects the date in the picker; label shows “Today” or that calendar date. */
  const summaryDayLabel = isSelectedToday ? 'Today' : formatMediumDateFromYmd(dateYmd)

  function filtered<T extends Reservation>(rows: T[], tab: FilterTab): T[] {
    return rows.filter((r) => matchesFilter(r, tab))
  }

  async function handleReview(
    reservationId: string,
    status: 'confirmed' | 'declined'
  ) {
    setActionError(null)
    setBusyId(reservationId)
    try {
      await reviewReservationAction(reservationId, status)
      startTransition(() => {
        router.refresh()
      })
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not update reservation.')
    } finally {
      setBusyId(null)
    }
  }

  const showPending =
    (filterTab === 'All' || filterTab === 'Pending') &&
    filtered(pendingRows, filterTab).length > 0
  const showConfirmed =
    (filterTab === 'All' || filterTab === 'Confirmed') &&
    filtered(confirmedRows, filterTab).length > 0
  const showDeclined =
    (filterTab === 'All' || filterTab === 'Declined') &&
    filtered(declinedRows, filterTab).length > 0
  const showCompleted =
    (filterTab === 'All' || filterTab === 'Completed') &&
    filtered(completedRows, filterTab).length > 0

  const slots = [
    { time: '8:00am', covers: 2 },
    { time: '9:00am', covers: 8 },
    { time: '10:00am', covers: 8 },
    { time: '11:00am', covers: 4 },
  ]

  return (
    <>
      <header className="fixed top-0 right-0 left-0 lg:left-[240px] h-16 z-30 bg-deep-espresso/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-8">
        <h2 className="font-headline text-xl font-bold text-on-surface">Reservations</h2>
        <div className="flex items-center gap-4">
          <div
            className="hidden sm:flex items-center bg-surface-container px-3 py-1.5 rounded-full"
            style={{ border: '1px solid rgba(82,68,57,0.1)' }}
          >
            <span className="material-symbols-outlined text-on-surface/30 text-sm mr-2">search</span>
            <input
              className="bg-transparent border-none text-xs focus:ring-0 w-32 md:w-48 text-on-surface outline-none placeholder:text-on-surface/20"
              placeholder="Search guests..."
            />
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-4 pb-4 pt-16 md:px-8 md:pb-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: summaryDayLabel,
                  value: String(summary.total),
                  sub: 'reservations',
                  color: '',
                  highlight: false,
                },
                {
                  label: 'Confirmed',
                  value: String(summary.confirmed),
                  sub: '✓',
                  color: 'text-emerald-500',
                  highlight: false,
                },
                {
                  label: 'Pending',
                  value: String(summary.pending),
                  sub: '⏳',
                  color: 'text-amber-500',
                  highlight: summary.pending > 0,
                },
                {
                  label: 'Declined',
                  value: String(summary.declined),
                  sub: '',
                  color: 'text-on-surface/30',
                  highlight: false,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className={`p-4 rounded-xl flex flex-col ${c.highlight ? 'bg-amber-900/20' : 'bg-surface-container'}`}
                  style={
                    c.highlight
                      ? { border: '1px solid rgba(217,119,6,0.15)' }
                      : { border: '1px solid rgba(82,68,57,0.08)' }
                  }
                >
                  <span
                    className={`text-[10px] font-label uppercase tracking-widest mb-1 ${c.highlight ? 'text-amber-400' : 'text-on-surface/30'}`}
                  >
                    {c.label}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-headline font-bold ${c.color || 'text-on-surface'}`}>
                      {c.value}
                    </span>
                    {c.sub ? <span className="text-xs">{c.sub}</span> : null}
                  </div>
                </div>
              ))}
            </div>

          {actionError ? (
            <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg" role="alert">
              {actionError}
            </p>
          ) : null}

          <div className="flex gap-6 flex-wrap" style={{ borderBottom: '1px solid rgba(82,68,57,0.1)' }}>
            {FILTER_TABS.map((t) => {
              const isActive = filterTab === t
                  const pendingBadge = t === 'Pending' && pendingCountAll > 0
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFilterTab(t)}
                      className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                        isActive ? 'text-amber-500 border-b-2 border-amber-600' : 'text-on-surface/30 hover:text-on-surface'
                      }`}
                    >
                      {t}
                      {pendingBadge ? (
                        <span className="ml-2 bg-amber-900/40 text-[10px] px-1.5 py-0.5 rounded-full">
                          {pendingCountAll}
                        </span>
                      ) : null}
                </button>
              )
            })}
          </div>

          {showPending ? (
            <section className="space-y-4">
              <h3 className="text-xs font-label uppercase tracking-tighter text-on-surface/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Action Required
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered(pendingRows, filterTab).map((p) => (
                  <div
                    key={p.id}
                    className="bg-surface-container rounded-xl p-5 hover:shadow-md transition-shadow"
                    style={{ borderLeft: '4px solid #f59e0b' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[11px] font-label uppercase tracking-wide text-on-surface/40 mb-1">
                          {formatMediumDateFromYmd(p.date)}
                        </p>
                        <p className="text-xl font-mono font-bold text-on-surface">
                          {formatTimeSlotDisplay(p.time_slot)}
                        </p>
                        <p className="text-xs text-on-surface/30 flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-sm">group</span>
                          {p.party_size} Guests
                        </p>
                      </div>
                      <span className="bg-amber-900/30 text-amber-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Pending
                      </span>
                    </div>
                    <div className="space-y-2 mb-6">
                      <h4 className="font-headline text-lg text-on-surface">
                        {p.guest?.full_name?.trim() || 'Guest'}
                      </h4>
                      <p className="text-sm text-on-surface/30 font-mono">
                        {p.guest?.phone?.trim() || '—'}
                      </p>
                      {p.note ? (
                        <div
                          className="bg-surface-container-low p-3 rounded-lg flex items-start gap-2"
                          style={{ border: '1px solid rgba(82,68,57,0.1)' }}
                        >
                          <span className="material-symbols-outlined text-on-surface/30 text-sm mt-0.5">
                            {noteIcon(p.note)}
                          </span>
                          <p className="text-xs italic text-on-surface/60">&ldquo;{p.note}&rdquo;</p>
                        </div>
                      ) : null}
                      <p className="text-[10px] text-on-surface/20 mt-2">
                        Submitted: {formatRelativeSubmitted(p.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busyId === p.id || isPending}
                        onClick={() => handleReview(p.id, 'confirmed')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        disabled={busyId === p.id || isPending}
                        onClick={() => handleReview(p.id, 'declined')}
                        className="flex-1 text-red-400 font-bold py-2 rounded-lg text-xs hover:bg-red-900/10 transition-colors cursor-pointer disabled:opacity-50"
                        style={{ border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {showConfirmed ? (
            <section className="space-y-3">
              <h3 className="text-xs font-label uppercase tracking-tighter text-on-surface/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmed
              </h3>
              <div className="space-y-2">
                {filtered(confirmedRows, filterTab).map((r) => (
                  <div
                    key={r.id}
                    className="bg-surface-container rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    style={{ borderLeft: '4px solid #10b981' }}
                  >
                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
                      <div className="shrink-0 w-full sm:w-36">
                        <p className="text-[10px] text-on-surface/30 font-label uppercase">{formatMediumDateFromYmd(r.date)}</p>
                        <p className="font-mono font-bold text-on-surface">{formatTimeSlotDisplay(r.time_slot)}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{r.guest?.full_name?.trim() || 'Guest'}</p>
                        <p className="text-xs text-on-surface/30">Party of {r.party_size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-900/20 px-2 py-0.5 rounded">
                        <span
                          className="material-symbols-outlined text-[12px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>{' '}
                        Confirmed
                      </span>
                      <button
                        type="button"
                        className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {showDeclined ? (
            <section className="space-y-3">
              <h3 className="text-xs font-label uppercase tracking-tighter text-on-surface/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500/80" /> Declined
              </h3>
              <div className="space-y-2">
                {filtered(declinedRows, filterTab).map((r) => (
                  <div
                    key={r.id}
                    className="bg-surface-container rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    style={{ borderLeft: '4px solid rgba(239,68,68,0.5)' }}
                  >
                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
                      <div className="shrink-0 w-full sm:w-36">
                        <p className="text-[10px] text-on-surface/30 font-label uppercase">{formatMediumDateFromYmd(r.date)}</p>
                        <p className="font-mono font-bold text-on-surface">{formatTimeSlotDisplay(r.time_slot)}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{r.guest?.full_name?.trim() || 'Guest'}</p>
                        <p className="text-xs text-on-surface/30">Party of {r.party_size}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-red-400/90 bg-red-900/20 px-2 py-0.5 rounded shrink-0">
                      Declined
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {showCompleted ? (
            <section className="space-y-3">
              <h3 className="text-xs font-label uppercase tracking-tighter text-on-surface/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-on-surface/40" /> Completed
              </h3>
              <div className="space-y-2">
                {filtered(completedRows, filterTab).map((r) => (
                  <div
                    key={r.id}
                    className="bg-surface-container rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    style={{ borderLeft: '4px solid rgba(148,163,184,0.6)' }}
                  >
                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
                      <div className="shrink-0 w-full sm:w-36">
                        <p className="text-[10px] text-on-surface/30 font-label uppercase">{formatMediumDateFromYmd(r.date)}</p>
                        <p className="font-mono font-bold text-on-surface">{formatTimeSlotDisplay(r.time_slot)}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{r.guest?.full_name?.trim() || 'Guest'}</p>
                        <p className="text-xs text-on-surface/30">Party of {r.party_size}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface/50 bg-surface-container-highest px-2 py-0.5 rounded shrink-0">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {initialRows.length === 0 ? (
            <div className="text-center py-12 space-y-2 max-w-md mx-auto">
              <p className="text-sm text-on-surface/40">No reservations yet.</p>
              <p className="text-xs text-on-surface/25">New requests from guests will appear here.</p>
            </div>
          ) : null}
        </div>

        <aside className="w-full lg:w-[320px] space-y-6">
          <div
            className="bg-surface-container rounded-2xl px-6 pb-6 pt-8"
            style={{ border: '1px solid rgba(82,68,57,0.08)' }}
          >
            <h3 className="font-headline text-lg font-bold text-on-surface mb-6">Slot Capacity Settings</h3>
            <div className="space-y-6">
              {slots.map((s) => (
                <div key={s.time} className="flex items-center justify-between">
                  <span className="font-mono text-sm text-on-surface/40">{s.time}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface/30 hover:bg-surface-container-low cursor-pointer"
                      style={{ border: '1px solid rgba(82,68,57,0.2)' }}
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <span className="font-bold w-4 text-center">{s.covers}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface/30 hover:bg-surface-container-low cursor-pointer"
                      style={{ border: '1px solid rgba(82,68,57,0.2)' }}
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                    <span className="text-[10px] text-on-surface/20 w-10">covers</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="w-full mt-8 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-amber-900/20 cursor-pointer"
            >
              Save Capacity Settings
            </button>
            <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(82,68,57,0.08)' }}>
              <button
                type="button"
                className="text-xs font-bold text-amber-500 flex items-center justify-center gap-2 hover:underline cursor-pointer mx-auto"
              >
                <span className="material-symbols-outlined text-sm">block</span> Block a date or slot
              </button>
            </div>
          </div>

          <div className="amber-glow p-6 rounded-2xl text-on-primary">
            <p className="text-[10px] font-label uppercase tracking-widest opacity-80 mb-1">Peak Hour Today</p>
            <h4 className="font-headline text-2xl font-bold mb-4">9:00am - 10:30am</h4>
            <p className="text-xs opacity-90 leading-relaxed">
              95% capacity reach predicted based on confirmed reservations and historical trends.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
