'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import { googleCalendarEventUrlForReservation } from '@/lib/calendar-links'
import {
  formatLongDateFromYmd,
  formatReservationRef,
  formatTimeSlotDisplay,
} from '@/lib/format-datetime'
import { categorizeReservations } from '@/lib/reservations/categorize'
import type { Reservation } from '@/lib/supabase/types/database.types'

const TABS = ['Upcoming', 'Pending', 'Past', 'Cancelled'] as const
type TabId = (typeof TABS)[number]

function CheckCircleSmall() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}
function HourglassIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function PeopleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function CalendarAddIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="12" y1="14" x2="12" y2="18" />
      <line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  )
}
function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function pastRowMonthDay(ymd: string): { month: string; day: string } {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return {
    month: dt.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(dt.getDate()),
  }
}

function pastStatusLabel(r: Reservation): string {
  if (r.status === 'completed') return 'COMPLETED'
  if (r.status === 'declined') return 'DECLINED'
  if (r.status === 'confirmed') return 'COMPLETED'
  return r.status.toUpperCase()
}

type Props = {
  reservations: Reservation[]
  isAuthenticated: boolean
  reservedJustSubmitted?: boolean
}

export default function MyReservationsClient({
  reservations,
  isAuthenticated,
  reservedJustSubmitted,
}: Props) {
  const [tab, setTab] = useState<TabId>('Upcoming')
  const cat = useMemo(() => categorizeReservations(reservations), [reservations])

  useEffect(() => {
    if (reservedJustSubmitted) setTab('Pending')
  }, [reservedJustSubmitted])

  const tabCounts: Record<TabId, number> = {
    Upcoming: cat.upcoming.length,
    Pending: cat.pending.length,
    Past: cat.past.length,
    Cancelled: cat.cancelled.length,
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-16 md:pb-20">
        <div className="mb-8 md:mb-12">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-primary mb-4 tracking-tight">
            My Reservations
          </h1>
          <p className="text-on-surface/40 max-w-xl text-lg">
            Manage your upcoming visits and view your history with us. We look forward to hosting you.
          </p>
        </div>

        {reservedJustSubmitted && isAuthenticated ? (
          <p
            className="mb-8 text-sm text-emerald-400/90 bg-emerald-900/20 border border-emerald-800/30 rounded-xl px-4 py-3"
            role="status"
          >
            Your reservation request was submitted. It will appear under <strong>Pending</strong> until the café confirms it, then move to{' '}
            <strong>Upcoming</strong>.
          </p>
        ) : null}

        {!isAuthenticated ? (
          <div className="rounded-xl bg-surface-container p-8 md:p-10 text-center space-y-4" style={{ border: '1px solid rgba(82,68,57,0.15)' }}>
            <p className="text-on-surface/60">Sign in to see reservations you&apos;ve made and their status.</p>
            <Link
              href="/login?next=/reservations"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl amber-glow text-on-primary font-bold text-sm uppercase tracking-wider"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-4 gap-0.5 sm:gap-1 md:flex md:gap-10 md:overflow-x-visible mb-8 md:mb-12 py-2 sticky top-[72px] bg-deep-espresso/95 backdrop-blur-md z-40 -mx-1 px-1 md:mx-0 md:px-0"
              style={{ borderBottom: '1px solid rgba(61,51,39,0.5)' }}
            >
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-0.5 py-2 md:py-0 md:pb-4 md:flex-row md:gap-2 md:whitespace-nowrap transition-all cursor-pointer rounded-lg md:rounded-none ${
                    tab === t ? 'text-primary font-bold' : 'text-on-surface/20 font-medium hover:text-primary'
                  }`}
                  style={tab === t ? { borderBottom: '2px solid var(--color-primary, #C8864A)' } : undefined}
                >
                  <span className="text-[9px] leading-tight text-center sm:text-[10px] md:text-base md:font-bold">
                    {t === 'Cancelled' ? (
                      <>
                        <span className="md:hidden">Cancel</span>
                        <span className="hidden md:inline">Cancelled</span>
                      </>
                    ) : (
                      t
                    )}
                  </span>
                  <span className="text-[8px] md:text-xs font-mono text-on-surface/30 tabular-nums">
                    ({tabCounts[t]})
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-8 w-full max-w-full space-y-10 md:space-y-12">
                {tab === 'Upcoming' && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-headline text-2xl text-on-surface">Upcoming</h2>
                      <span className="font-mono text-xs text-on-surface/20 bg-surface-container px-3 py-1 rounded-full">
                        {cat.upcoming.length} TOTAL
                      </span>
                    </div>
                    {cat.upcoming.length === 0 ? (
                      <p className="text-on-surface/40 text-sm py-8">
                        No confirmed upcoming reservations. When the café confirms your booking, it will appear here.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-6 md:gap-8 w-full">
                        {cat.upcoming.map((r, idx) => (
                          <div
                            key={r.id}
                            className="relative bg-[#FDFBF7] rounded-xl overflow-hidden flex flex-col lg:flex-row items-stretch w-full hover:-translate-y-1 transition-transform"
                            style={{ borderLeft: '8px solid #C8864A' }}
                          >
                            <div className="w-full lg:w-48 h-44 sm:h-48 lg:h-auto lg:min-h-[12rem] overflow-hidden relative shrink-0">
                              <Image
                                src="/images/cafe-interior.png"
                                alt="Café interior"
                                fill
                                priority={idx === 0}
                                className="object-cover"
                                sizes="(max-width:1024px) 100vw, 192px"
                              />
                            </div>
                            <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-4 min-w-0">
                                  <div className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shrink-0">
                                    <CheckCircleSmall /> Confirmed
                                  </div>
                                  <div className="text-[#1A1208] font-mono text-[11px] sm:text-sm font-bold truncate text-right">
                                    {formatReservationRef(r.id)}
                                  </div>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-headline text-[#1A1208] mb-2 leading-tight">
                                  {formatLongDateFromYmd(r.date)}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-stone-600 mb-6">
                                  <div className="flex items-center gap-1.5 text-sm">
                                    <ClockIcon /> {formatTimeSlotDisplay(r.time_slot)}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-sm">
                                    <PeopleIcon /> {r.party_size} {r.party_size === 1 ? 'Guest' : 'Guests'}
                                  </div>
                                  {r.note ? (
                                    <div className="flex items-center gap-1.5 text-sm">
                                      <MapPinIcon /> {r.note}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div className="flex flex-col md:flex-row gap-3 pt-6" style={{ borderTop: '1px solid #e5e0d8' }}>
                                <a
                                  href={googleCalendarEventUrlForReservation(r)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-3 px-6 rounded-xl amber-glow text-on-primary font-bold text-sm hover:brightness-110 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer text-center"
                                >
                                  <CalendarAddIcon /> Add to Calendar
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {tab === 'Pending' && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-headline text-2xl text-on-surface">Pending</h2>
                    </div>
                    {cat.pending.length === 0 ? (
                      <p className="text-on-surface/40 text-sm py-8">You have no requests waiting for confirmation.</p>
                    ) : (
                      <div className="flex flex-col gap-6 w-full">
                        {cat.pending.map((r) => (
                          <div
                            key={r.id}
                            className="bg-surface-container-low rounded-xl p-5 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full"
                            style={{ borderLeft: '4px solid rgba(200,134,74,0.5)' }}
                          >
                            <div className="flex-1">
                              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-4">
                                <HourglassIcon /> Awaiting Confirmation
                              </div>
                              <p className="text-on-surface/30 font-mono text-xs mb-2">{formatReservationRef(r.id)}</p>
                              <h3 className="text-2xl font-headline text-on-surface mb-2">{formatLongDateFromYmd(r.date)}</h3>
                              <p className="text-on-surface/30 font-mono text-xs mb-4 uppercase tracking-widest">
                                Requested: {formatTimeSlotDisplay(r.time_slot)} • {r.party_size}{' '}
                                {r.party_size === 1 ? 'Guest' : 'Guests'}
                              </p>
                              <p className="text-sm text-on-surface/40 italic">
                                {r.note
                                  ? `“${r.note}”`
                                  : 'Our team will review your request and notify you when it is confirmed.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {tab === 'Past' && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-headline text-2xl text-on-surface">Past</h2>
                    </div>
                    {cat.past.length === 0 ? (
                      <p className="text-on-surface/40 text-sm py-8">No past reservations yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {cat.past.map((r) => {
                          const { month, day } = pastRowMonthDay(r.date)
                          return (
                            <div
                              key={r.id}
                              className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors"
                            >
                              <div className="flex items-center gap-6 min-w-0">
                                <div className="w-12 h-12 shrink-0 rounded-lg bg-surface-container-high flex flex-col items-center justify-center text-on-surface/40">
                                  <span className="text-[10px] font-mono leading-none">{month}</span>
                                  <span className="text-lg font-bold leading-none">{day}</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-headline text-lg truncate">
                                    Table for {r.party_size} • {formatTimeSlotDisplay(r.time_slot)}
                                  </div>
                                  <div className="text-xs text-on-surface/30 font-mono">
                                    {pastStatusLabel(r)} • {formatReservationRef(r.id)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-on-surface/20 shrink-0">
                                <ChevronDownIcon />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </section>
                )}

                {tab === 'Cancelled' && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-headline text-2xl text-on-surface">Cancelled</h2>
                    </div>
                    {cat.cancelled.length === 0 ? (
                      <p className="text-on-surface/40 text-sm py-8">No cancelled reservations.</p>
                    ) : (
                      <div className="space-y-4">
                        {cat.cancelled.map((r) => {
                          const { month, day } = pastRowMonthDay(r.date)
                          return (
                            <div
                              key={r.id}
                              className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between opacity-80"
                            >
                              <div className="flex items-center gap-6 min-w-0">
                                <div className="w-12 h-12 shrink-0 rounded-lg bg-surface-container-high flex flex-col items-center justify-center text-on-surface/40">
                                  <span className="text-[10px] font-mono leading-none">{month}</span>
                                  <span className="text-lg font-bold leading-none">{day}</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-headline text-lg truncate">{formatLongDateFromYmd(r.date)}</div>
                                  <div className="text-xs text-on-surface/30 font-mono">
                                    CANCELLED • {formatReservationRef(r.id)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </section>
                )}
              </div>

              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-surface-container-high rounded-2xl p-8 overflow-hidden relative">
                  <div className="relative z-10">
                    <h4 className="font-headline text-2xl text-primary mb-2">Host an Event?</h4>
                    <p className="text-on-surface/40 text-sm mb-6 leading-relaxed">
                      Planning a birthday or corporate gathering? Our private lounge is available for booking.
                    </p>
                    <button
                      type="button"
                      className="w-full py-4 px-6 rounded-xl amber-glow text-on-primary font-bold text-sm hover:scale-[1.02] transition-transform uppercase tracking-widest cursor-pointer"
                    >
                      Inquire Now
                    </button>
                  </div>
                </div>

                {cat.upcoming.length === 0 && isAuthenticated && (
                  <div
                    className="bg-surface-container-low rounded-2xl p-10 flex flex-col items-center text-center"
                    style={{ border: '2px dashed rgba(82,68,57,0.2)' }}
                  >
                    <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-6 text-on-surface/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <line x1="9" y1="16" x2="15" y2="16" />
                      </svg>
                    </div>
                    <h5 className="font-headline text-xl mb-2">No more upcoming?</h5>
                    <p className="text-on-surface/30 text-sm mb-8">
                      It&apos;s quiet in here. Why not secure your next coffee experience today?
                    </p>
                    <Link
                      href="/reserve"
                      className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Book a Table <ArrowRightIcon />
                    </Link>
                  </div>
                )}

                <div className="p-6 bg-surface-container rounded-xl">
                  <h6 className="text-xs font-mono text-on-surface/20 uppercase tracking-widest mb-4">Reservation Policy</h6>
                  <ul className="space-y-3 text-xs text-on-surface/40 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span> Cancellations must be made 24 hours in advance to avoid a service fee.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span> Tables will be held for a maximum of 15 minutes past reservation time.
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  )
}
