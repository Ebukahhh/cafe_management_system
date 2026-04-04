'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/client'
import { createReservation } from '@/lib/supabase/mutations/create-reservation'
import {
  formatLongDateFromYmd,
  formatTimeSlotDisplay,
  toLocalYmd,
} from '@/lib/format-datetime'
import {
  PERIOD_LABELS,
  PERIOD_ORDER,
  generateTimeSlotsForDate,
  getOpeningHoursSidebarLines,
  groupTimeSlotsByPeriod,
  isWeekendDate,
} from '@/lib/cafe-hours'

/* ── Icons ── */
function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const OPENING_HOURS_LINES = getOpeningHoursSidebarLines()

function startOfToday(): Date {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isPastDay(year: number, month: number, day: number): boolean {
  const candidate = new Date(year, month, day)
  candidate.setHours(0, 0, 0, 0)
  return candidate < startOfToday()
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function ReserveTableClient() {
  const router = useRouter()
  const today = useMemo(() => startOfToday(), [])

  const [viewYear, setViewYear] = useState(() => today.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => today.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(today))
  const [selectedTime, setSelectedTime] = useState(
    () => generateTimeSlotsForDate(new Date(today))[0]?.value ?? '12:00:00'
  )

  const timeSlots = useMemo(() => generateTimeSlotsForDate(selectedDate), [selectedDate])
  const slotsByPeriod = useMemo(() => groupTimeSlotsByPeriod(timeSlots), [timeSlots])

  useEffect(() => {
    if (timeSlots.length === 0) return
    setSelectedTime((prev) =>
      timeSlots.some((s) => s.value === prev) ? prev : timeSlots[0].value
    )
  }, [selectedDate, timeSlots])
  const [partySize, setPartySize] = useState(4)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const calendarCells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate()
    const startPad = first.getDay()
    const cells: ({ day: number } | { pad: true })[] = []
    for (let i = 0; i < startPad; i++) cells.push({ pad: true })
    for (let d = 1; d <= lastDay; d++) cells.push({ day: d })
    return cells
  }, [viewYear, viewMonth])

  function shiftMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const dateYmd = toLocalYmd(selectedDate)
  const summaryDate = formatLongDateFromYmd(dateYmd)
  const summaryTime = formatTimeSlotDisplay(selectedTime)

  async function handleSubmit() {
    setFormError(null)
    setSubmitting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/login?next=${encodeURIComponent('/reserve')}`)
        return
      }

      if (partySize < 1 || partySize > 20) {
        setFormError('Party size must be between 1 and 20 guests.')
        return
      }

      await createReservation({
        userId: user.id,
        date: dateYmd,
        timeSlot: selectedTime,
        partySize,
        note: note.trim() || undefined,
      })

      router.push('/reservations?reserved=1')
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not save your reservation.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          <section className="w-full md:w-[60%] space-y-10 md:space-y-12">
            <header>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline text-on-surface leading-tight tracking-tight">
                Reserve a Table
              </h1>
              <p className="text-on-surface/40 mt-4 text-lg max-w-xl">
                Join us for an exceptional coffee experience. Select your preferred date and time to secure your spot at the bar or a cozy corner.
              </p>
            </header>

            <div className="bg-surface-container-low p-6 md:p-8 rounded-xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-headline text-primary">Select Date</h2>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-on-surface/40 font-label hidden sm:inline">{monthLabel(viewYear, viewMonth)}</span>
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => shiftMonth(-1)}
                    className="p-2 hover:bg-surface-bright rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => shiftMonth(1)}
                    className="p-2 hover:bg-surface-bright rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm font-label">
                {dayHeaders.map((d, i) => (
                  <div key={`h-${i}`} className="text-on-surface/20 py-2">
                    {d}
                  </div>
                ))}
                {calendarCells.map((cell, i) => {
                  if ('pad' in cell) {
                    return <div key={`pad-${i}`} className="py-3" />
                  }
                  const { day } = cell
                  const disabled = isPastDay(viewYear, viewMonth, day)
                  const cellDate = new Date(viewYear, viewMonth, day)
                  const selected = isSameDay(cellDate, selectedDate)
                  const isToday = isSameDay(cellDate, today)

                  return (
                    <button
                      key={`d-${day}`}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedDate(cellDate)}
                      className={`py-3 rounded-lg text-sm transition-colors ${
                        disabled
                          ? 'text-on-surface/10 cursor-not-allowed'
                          : selected
                            ? 'bg-primary text-deep-espresso font-bold cursor-pointer'
                            : isToday
                              ? 'ring-2 ring-primary hover:bg-surface-bright cursor-pointer'
                              : 'hover:bg-surface-bright cursor-pointer'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <h2 className="text-xl font-headline text-primary">Choose Time</h2>
                <p className="text-xs text-on-surface/30 font-label">
                  {isWeekendDate(selectedDate) ? 'Weekend hours' : 'Weekday hours'} ·{' '}
                  {timeSlots.length} slots
                </p>
              </div>
              <div className="max-h-[min(420px,55vh)] overflow-y-auto overscroll-contain pr-1 -mr-1 space-y-8">
                {PERIOD_ORDER.map((period) => {
                  const slots = slotsByPeriod[period]
                  if (slots.length === 0) return null
                  return (
                    <div key={period} className="space-y-3">
                      <h3 className="text-xs font-label uppercase tracking-widest text-on-surface/30">
                        {PERIOD_LABELS[period]}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                        {slots.map((slot) => {
                          const isSelected = selectedTime === slot.value
                          return (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() => setSelectedTime(slot.value)}
                              className={`flex flex-col items-center py-4 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                                isSelected
                                  ? 'bg-primary-container text-deep-espresso ring-2 ring-primary font-bold'
                                  : 'bg-surface-container-high hover:bg-surface-bright'
                              }`}
                            >
                              <span className="text-lg font-bold">{slot.label}</span>
                              <span
                                className={`text-[10px] font-mono uppercase tracking-widest mt-1 ${
                                  isSelected ? 'opacity-80' : 'text-on-surface/20'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Available'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-headline text-primary">Party Size</h2>
                <div className="flex items-center justify-between bg-surface-container-highest p-4 rounded-xl">
                  <button
                    type="button"
                    aria-label="Decrease party size"
                    disabled={partySize <= 1}
                    onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                    className="w-12 h-12 flex items-center justify-center bg-surface-bright hover:bg-primary-container hover:text-deep-espresso rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <MinusIcon />
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-bold font-headline">{partySize}</span>
                    <p className="text-[10px] uppercase tracking-tighter text-on-surface/20 font-label">Guests</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Increase party size"
                    disabled={partySize >= 20}
                    onClick={() => setPartySize((n) => Math.min(20, n + 1))}
                    className="w-12 h-12 flex items-center justify-center bg-surface-bright hover:bg-primary-container hover:text-deep-espresso rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-headline text-primary">Special Requests</h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl h-[84px] p-4 text-sm text-on-surface placeholder:text-on-surface/20 outline-none ring-1 ring-transparent focus:ring-primary/30 transition-all resize-none"
                  placeholder="Allergies, seating preference, or special occasions..."
                  maxLength={2000}
                />
              </div>
            </div>

            {formError ? (
              <p className="text-sm text-red-400 bg-red-900/20 px-4 py-3 rounded-xl" role="alert">
                {formError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full amber-glow text-on-primary font-bold py-5 rounded-xl text-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting ? 'Submitting…' : 'Request Reservation'}
            </button>
            <p className="text-xs text-on-surface/30 text-center">
              You need to be{' '}
              <Link href={`/login?next=${encodeURIComponent('/reserve')}`} className="text-primary underline underline-offset-2">
                signed in
              </Link>{' '}
              to book. We&apos;ll confirm by email or in your account.
            </p>
          </section>

          <aside className="w-full md:w-[40%] md:sticky md:top-28 space-y-6">
            <div className="bg-surface-container-high rounded-xl overflow-hidden">
              <div className="h-48 w-full overflow-hidden relative">
                <Image
                  src="/images/cafe-interior.png"
                  alt="Jennifer's Café interior"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent" />
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-headline text-on-surface">Reservation Summary</h3>
                  <div className="space-y-0">
                    <div
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: '1px solid rgba(82,68,57,0.3)' }}
                    >
                      <span className="text-on-surface/30 text-sm">Date</span>
                      <span className="font-medium text-primary text-right max-w-[60%]">{summaryDate}</span>
                    </div>
                    <div
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: '1px solid rgba(82,68,57,0.3)' }}
                    >
                      <span className="text-on-surface/30 text-sm">Time</span>
                      <span className="font-medium text-primary">{summaryTime}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-on-surface/30 text-sm">Party Size</span>
                      <span className="font-medium text-primary">
                        {partySize} {partySize === 1 ? 'Person' : 'People'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container p-5 md:p-6 rounded-lg space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface/20 flex items-center gap-2">
                    <ClockIcon />
                    Opening Hours
                  </h4>
                  <ul className="text-sm space-y-2 font-label">
                    {OPENING_HOURS_LINES.map((line) => (
                      <li key={line.label} className="flex justify-between gap-4">
                        <span className="text-on-surface/30">{line.label}</span>
                        <span className="tabular-nums">{line.range}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 text-on-surface/20 text-xs italic">
                  <InfoIcon />
                  <p>Tables are held for 15 minutes past reservation time.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-surface-container-low rounded-xl items-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <LocationIcon />
              </div>
              <div>
                <p className="text-sm font-bold">124 Espresso Way</p>
                <p className="text-xs text-on-surface/30">Coffee District, Metropolis</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
