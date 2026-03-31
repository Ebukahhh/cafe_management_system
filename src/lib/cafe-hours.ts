/**
 * Single source of truth for reservation windows and slot generation.
 * Aligns with the Opening Hours card on /reserve — adjust here only.
 */

/** Minutes between each bookable start time (15 or 30 typical for cafés). */
export const SLOT_INTERVAL_MINUTES = 30

/** Mon–Fri (local calendar day). */
export const WEEKDAY_HOURS = { open: '07:00', close: '16:00' } as const

/** Sat–Sun (local calendar day). */
export const WEEKEND_HOURS = { open: '08:00', close: '18:00' } as const

export type TimeSlotOption = {
  /** Postgres `time without time zone`, e.g. "09:30:00" */
  value: string
  /** 12h label for UI */
  label: string
}

function parseHHMM(s: string): { h: number; m: number } {
  const [h, m] = s.split(':').map(Number)
  return { h: Number.isFinite(h) ? h : 0, m: Number.isFinite(m) ? m : 0 }
}

function toMinutes(h: number, m: number): number {
  return h * 60 + m
}

/** Sunday = 0 … Saturday = 6 */
export function isWeekendDate(d: Date): boolean {
  const day = d.getDay()
  return day === 0 || day === 6
}

export function getOpenCloseForDate(d: Date): { openMinutes: number; closeMinutes: number } {
  const cfg = isWeekendDate(d) ? WEEKEND_HOURS : WEEKDAY_HOURS
  const o = parseHHMM(cfg.open)
  const c = parseHHMM(cfg.close)
  return {
    openMinutes: toMinutes(o.h, o.m),
    closeMinutes: toMinutes(c.h, c.m),
  }
}

function formatSlotLabel(h: number, m: number): string {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

/** Every bookable start from open up to (but not including) close. */
export function generateTimeSlotsForDate(d: Date): TimeSlotOption[] {
  const { openMinutes, closeMinutes } = getOpenCloseForDate(d)
  const out: TimeSlotOption[] = []
  for (let t = openMinutes; t < closeMinutes; t += SLOT_INTERVAL_MINUTES) {
    const hh = Math.floor(t / 60)
    const mm = t % 60
    const value = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`
    out.push({ value, label: formatSlotLabel(hh, mm) })
  }
  return out
}

export type DayPeriod = 'morning' | 'afternoon' | 'evening'

export const PERIOD_ORDER: DayPeriod[] = ['morning', 'afternoon', 'evening']

export const PERIOD_LABELS: Record<DayPeriod, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
}

const PERIOD_MORNING_END = 12 * 60
const PERIOD_AFTERNOON_END = 17 * 60

function minutesFromSlotValue(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return toMinutes(h || 0, m || 0)
}

/** Group slots for sectioned UI (by start time). */
export function groupTimeSlotsByPeriod(slots: TimeSlotOption[]): Record<DayPeriod, TimeSlotOption[]> {
  const morning: TimeSlotOption[] = []
  const afternoon: TimeSlotOption[] = []
  const evening: TimeSlotOption[] = []
  for (const s of slots) {
    const mins = minutesFromSlotValue(s.value)
    if (mins < PERIOD_MORNING_END) morning.push(s)
    else if (mins < PERIOD_AFTERNOON_END) afternoon.push(s)
    else evening.push(s)
  }
  return { morning, afternoon, evening }
}

/** Lines for the Opening Hours sidebar (matches WEEKDAY / WEEKEND constants). */
export function getOpeningHoursSidebarLines(): { label: string; range: string }[] {
  return [
    { label: 'Mon — Fri', range: `${WEEKDAY_HOURS.open} — ${WEEKDAY_HOURS.close}` },
    { label: 'Sat — Sun', range: `${WEEKEND_HOURS.open} — ${WEEKEND_HOURS.close}` },
  ]
}
