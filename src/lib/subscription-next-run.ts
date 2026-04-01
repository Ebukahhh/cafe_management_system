import type { SubscriptionFrequency } from '@/lib/supabase/types/database.types'

/**
 * Next scheduled run for a subscription, using local wall-clock time
 * (same behavior as the rest of the app when CAFE_TIMEZONE is not modeled in JS).
 */
export function computeNextRunAtIso(params: {
  frequency: SubscriptionFrequency
  daysOfWeek: number[] | null
  preferredTime: string
}): string {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(params.preferredTime.trim())
  if (!match) throw new Error('Invalid preferred time')
  const hh = parseInt(match[1], 10)
  const mm = parseInt(match[2], 10)
  const ss = match[3] ? parseInt(match[3], 10) : 0

  const now = new Date()
  const set = params.daysOfWeek ?? []

  const matchesFrequency = (dow: number): boolean => {
    switch (params.frequency) {
      case 'daily':
        return true
      case 'weekdays':
        return dow >= 1 && dow <= 5
      case 'specific_days':
        return set.length > 0 && set.includes(dow)
      case 'weekly':
        return set.length > 0 && set.includes(dow)
      default:
        return true
    }
  }

  for (let addDays = 0; addDays < 366; addDays++) {
    const d = new Date(now)
    d.setDate(d.getDate() + addDays)
    d.setHours(hh, mm, ss, 0)
    if (d.getTime() <= now.getTime()) continue
    if (!matchesFrequency(d.getDay())) continue
    return d.toISOString()
  }

  return new Date(now.getTime() + 86400000).toISOString()
}

export function toPreferredTimeSql(hour12: number, minute: number, isPm: boolean): string {
  let h: number
  if (isPm) {
    h = hour12 === 12 ? 12 : hour12 + 12
  } else {
    h = hour12 === 12 ? 0 : hour12
  }
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
}

/** Build `days_of_week` JSON for the DB from UI state (0 = Sunday … 6 = Saturday). */
export function buildDaysOfWeekForDb(
  frequency: SubscriptionFrequency,
  specificDays: number[],
  weeklyDay: number
): number[] | null {
  if (frequency === 'daily') return []
  if (frequency === 'weekdays') return [1, 2, 3, 4, 5]
  if (frequency === 'specific_days') return specificDays
  if (frequency === 'weekly') return [weeklyDay]
  return []
}
