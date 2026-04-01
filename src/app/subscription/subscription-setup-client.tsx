'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition, type ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import { formatUsd } from '@/lib/customer-display'
import type { ProductWithOptions } from '@/lib/supabase/types/app.types'
import type { SubscriptionFrequency } from '@/lib/supabase/types/database.types'
import { createSubscriptionAction } from './actions'
import { toPreferredTimeSql } from '@/lib/subscription-next-run'

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4z" />
    </svg>
  )
}
function EditCalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M14 14l2 2-4 1 1-4z" />
    </svg>
  )
}
function RepeatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}
function CheckSmallIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function ChevronUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}
function ChevronDnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
function ArrowFwdIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

const MINUTE_STEPS = [0, 15, 30, 45] as const
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

const FREQUENCIES: {
  id: SubscriptionFrequency
  label: string
  desc: string
  icon: ReactNode
}[] = [
  { id: 'daily', label: 'Every day', desc: 'Consistency for the daily grinder.', icon: <CalendarIcon /> },
  { id: 'weekdays', label: 'Weekdays only', desc: 'Monday through Friday fuel.', icon: <BriefcaseIcon /> },
  { id: 'specific_days', label: 'Specific days', desc: 'You choose your rhythm.', icon: <EditCalIcon /> },
  { id: 'weekly', label: 'Every week', desc: 'A weekly treat to look forward to.', icon: <RepeatIcon /> },
]

type Props = {
  products: ProductWithOptions[]
  showSuccess?: boolean
  /** After creating a subscription, show confirmation only (no duplicate signup). */
  lockSetup?: boolean
}

function categoryLabel(p: ProductWithOptions): string {
  const c = p.categories
  if (!c) return 'Menu'
  if (Array.isArray(c)) return (c[0] as { name?: string })?.name ?? 'Menu'
  return c.name ?? 'Menu'
}

export default function SubscriptionSetupClient({ products, showSuccess, lockSetup }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('weekdays')
  const [specificDays, setSpecificDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [weeklyDay, setWeeklyDay] = useState(1)

  const [hour12, setHour12] = useState(7)
  const [minute, setMinute] = useState(30)
  const [isPm, setIsPm] = useState(false)

  const [alertsOn, setAlertsOn] = useState(true)
  const [endMode, setEndMode] = useState<'never' | 'date'>('never')
  const [endDateYmd, setEndDateYmd] = useState('')

  const selectedLines = useMemo(() => {
    const lines: { product: ProductWithOptions; qty: number }[] = []
    for (const p of products) {
      const q = quantities[p.id] ?? 0
      if (q > 0) lines.push({ product: p, qty: q })
    }
    return lines
  }, [products, quantities])

  const perDeliveryTotal = useMemo(() => {
    return selectedLines.reduce((sum, { product, qty }) => sum + product.price * qty, 0)
  }, [selectedLines])

  function toggleProduct(productId: string) {
    setQuantities((prev) => {
      const q = prev[productId] ?? 0
      if (q > 0) {
        const next = { ...prev }
        delete next[productId]
        return next
      }
      return { ...prev, [productId]: 1 }
    })
  }

  function setQty(productId: string, qty: number) {
    if (qty < 1) {
      setQuantities((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })
      return
    }
    setQuantities((prev) => ({ ...prev, [productId]: qty }))
  }

  function bumpHour(delta: number) {
    setHour12((h) => {
      let n = h + delta
      if (n < 1) n = 12
      if (n > 12) n = 1
      return n
    })
  }

  function bumpMinute(delta: number) {
    setMinute((m) => {
      let idx = MINUTE_STEPS.indexOf(m as (typeof MINUTE_STEPS)[number])
      if (idx === -1) {
        const higher = MINUTE_STEPS.findIndex((step) => step >= m)
        idx = higher === -1 ? MINUTE_STEPS.length - 1 : higher
      }
      let next = idx + delta
      if (next < 0) next = MINUTE_STEPS.length - 1
      else if (next >= MINUTE_STEPS.length) next = 0
      return MINUTE_STEPS[next]
    })
  }

  function toggleSpecificDay(d: number) {
    setSpecificDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)))
  }

  function submit() {
    setError(null)
    if (selectedLines.length === 0) {
      setError('Select at least one product.')
      return
    }
    if (frequency === 'specific_days' && specificDays.length === 0) {
      setError('Choose at least one day.')
      return
    }
    if (endMode === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(endDateYmd)) {
      setError('Pick a valid end date.')
      return
    }

    const preferredTime = toPreferredTimeSql(hour12, minute, isPm)

    startTransition(async () => {
      try {
        await createSubscriptionAction({
          frequency,
          specificDays: frequency === 'specific_days' ? specificDays : [],
          weeklyDay: frequency === 'weekly' ? weeklyDay : 1,
          preferredTime,
          endDateYmd: endMode === 'never' ? null : endDateYmd,
          paymentMethod: 'Visa •••• 4747',
          items: selectedLines.map(({ product, qty }) => ({
            productId: product.id,
            productName: product.name,
            quantity: qty,
            unitPrice: product.price,
          })),
        })
        router.push('/subscription?success=1')
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.')
      }
    })
  }

  return (
    <>
      <Navbar />
      <main className="max-w-[760px] mx-auto px-4 md:px-6 py-8 md:py-12 pb-40 md:pb-20 space-y-10">
        {showSuccess && (
          <p className="text-sm text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded-xl px-4 py-3">
            Your subscription is active. We&apos;ll use your schedule for upcoming deliveries.
          </p>
        )}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight">
            {lockSetup ? 'Subscription active' : 'Set up your subscription'}
          </h1>
          <p className="text-on-surface/40">
            {lockSetup
              ? 'Your recurring order is on file.'
              : 'Craft your perfect daily ritual at Jennifer&apos;s Café.'}
          </p>
        </div>

        {lockSetup && (
          <div className="rounded-xl bg-surface-container-low p-8 text-center space-y-4">
            <p className="text-on-surface/80">You already have an active subscription.</p>
            <Link href="/profile" className="inline-flex items-center justify-center amber-glow text-on-primary font-bold px-8 py-3 rounded-full">
              Go to profile
            </Link>
          </div>
        )}

        {!lockSetup && (
          <>
        {/* Summary */}
        <section className="bg-[#F5EDE5] rounded-xl p-6 md:p-8 flex flex-col gap-4">
          <div className="flex gap-6 items-start">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-stone-300">
              {selectedLines[0]?.product.image_url ? (
                <Image
                  src={selectedLines[0].product.image_url}
                  alt={selectedLines[0].product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full bg-[#1A1208]/10" />
              )}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-sm font-label uppercase tracking-widest text-[#1A1208]/40">You&apos;re subscribing to:</p>
              {selectedLines.length === 0 ? (
                <p className="text-lg font-headline font-bold text-[#1A1208]/50">Select one or more items below</p>
              ) : (
                <ul className="space-y-1">
                  {selectedLines.map(({ product, qty }) => (
                    <li key={product.id} className="text-base font-headline font-bold text-[#1A1208] leading-snug">
                      {qty}× {product.name}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-4 flex-wrap pt-1">
                <span className="text-lg font-bold text-[#1A1208]">
                  {formatUsd(perDeliveryTotal)}{' '}
                  <span className="text-sm font-normal opacity-60">/ per delivery</span>
                </span>
                <span className="text-sm text-[#1A1208]/50">Edit items in the section below</span>
              </div>
            </div>
          </div>
        </section>

        {/* 01 Products */}
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">01</span>
            <h2 className="text-2xl font-headline font-bold">Choose your items</h2>
          </div>
          {products.length === 0 ? (
            <p className="text-sm text-on-surface/40">No products are available right now. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => {
                const q = quantities[p.id] ?? 0
                const selected = q > 0
                return (
                  <div
                    key={p.id}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      selected ? 'bg-surface-container-high ring-2 ring-primary' : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                    onClick={() => toggleProduct(p.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleProduct(p.id)
                      }
                    }}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="64px" />
                        ) : null}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          selected ? 'bg-primary text-deep-espresso' : 'border border-on-surface/20'
                        }`}
                      >
                        {selected && <CheckSmallIcon />}
                      </div>
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface/30 mt-3">{categoryLabel(p)}</p>
                    <h4 className={`mt-1 font-bold text-lg ${selected ? 'text-primary' : ''}`}>{p.name}</h4>
                    <p className="text-sm text-on-surface/30 mt-1 line-clamp-2">{p.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="font-mono text-primary font-bold">{formatUsd(p.price)}</span>
                      {selected && (
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-surface-container-highest text-sm font-bold hover:bg-surface-container-high"
                            onClick={() => setQty(p.id, q - 1)}
                          >
                            −
                          </button>
                          <span className="font-mono text-sm w-6 text-center">{q}</span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-surface-container-highest text-sm font-bold hover:bg-surface-container-high"
                            onClick={() => setQty(p.id, q + 1)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 02 Frequency */}
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">02</span>
            <h2 className="text-2xl font-headline font-bold">How often?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FREQUENCIES.map((f) => {
              const sel = frequency === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrequency(f.id)}
                  className={`text-left p-6 rounded-xl cursor-pointer transition-all ${
                    sel ? 'bg-surface-container-high ring-2 ring-primary' : 'bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={sel ? 'text-primary' : 'text-on-surface/30'}>{f.icon}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        sel ? 'bg-primary text-deep-espresso' : 'border border-on-surface/20'
                      }`}
                    >
                      {sel && <CheckSmallIcon />}
                    </div>
                  </div>
                  <h4 className={`mt-4 font-bold text-lg ${sel ? 'text-primary' : ''}`}>{f.label}</h4>
                  <p className="text-sm text-on-surface/30 mt-1">{f.desc}</p>
                </button>
              )
            })}
          </div>

          {frequency === 'specific_days' && (
            <div className="flex flex-wrap gap-2 pt-2">
              {DAY_LABELS.map((label, dow) => (
                <button
                  key={dow}
                  type="button"
                  onClick={() => toggleSpecificDay(dow)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    specificDays.includes(dow)
                      ? 'bg-primary text-deep-espresso'
                      : 'bg-surface-container-highest text-on-surface/40 hover:bg-surface-container-high'
                  }`}
                  aria-pressed={specificDays.includes(dow)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {frequency === 'weekly' && (
            <div className="flex flex-wrap gap-2 items-center pt-2">
              <span className="text-sm text-on-surface/40 mr-2">Delivery day</span>
              {DAY_LABELS.map((label, dow) => (
                <button
                  key={dow}
                  type="button"
                  onClick={() => setWeeklyDay(dow)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    weeklyDay === dow
                      ? 'bg-primary text-deep-espresso'
                      : 'bg-surface-container-highest text-on-surface/40 hover:bg-surface-container-high'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 03 Time + 04 Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">03</span>
              <h2 className="text-2xl font-headline font-bold">What time?</h2>
            </div>
            <div className="bg-surface-container-highest rounded-xl p-4 flex items-center justify-between gap-2">
              <span className="text-3xl font-headline font-bold px-2 tabular-nums">
                {hour12}:{String(minute).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-1 pr-2">
                <button
                  type="button"
                  onClick={() => setIsPm(false)}
                  className={`text-sm font-bold uppercase ${!isPm ? 'text-primary' : 'text-on-surface/20'}`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setIsPm(true)}
                  className={`text-xs uppercase ${isPm ? 'text-primary font-bold' : 'text-on-surface/20'}`}
                >
                  PM
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <button type="button" className="p-1 hover:bg-surface-bright rounded cursor-pointer" onClick={() => bumpHour(1)}>
                  <ChevronUpIcon />
                </button>
                <button type="button" className="p-1 hover:bg-surface-bright rounded cursor-pointer" onClick={() => bumpHour(-1)}>
                  <ChevronDnIcon />
                </button>
              </div>
              <div className="flex flex-col gap-2 border-l border-white/5 pl-3">
                <button type="button" className="p-1 hover:bg-surface-bright rounded cursor-pointer" onClick={() => bumpMinute(1)}>
                  <ChevronUpIcon />
                </button>
                <button type="button" className="p-1 hover:bg-surface-bright rounded cursor-pointer" onClick={() => bumpMinute(-1)}>
                  <ChevronDnIcon />
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">04</span>
              <h2 className="text-2xl font-headline font-bold">Alerts</h2>
            </div>
            <div className="bg-surface-container rounded-xl p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold">Advance notice</p>
                <p className="text-sm text-on-surface/30">Notify me 30 minutes before</p>
              </div>
              <button
                type="button"
                onClick={() => setAlertsOn((v) => !v)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                  alertsOn ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
                style={{ boxShadow: alertsOn ? '0 0 8px rgba(200,134,74,0.2)' : undefined }}
                aria-pressed={alertsOn}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-deep-espresso rounded-full transition-all ${
                    alertsOn ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 05 End date */}
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">05</span>
            <h2 className="text-2xl font-headline font-bold">End date</h2>
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setEndMode('never')}
              className={`w-full flex items-center gap-4 p-5 rounded-xl cursor-pointer text-left transition-colors ${
                endMode === 'never' ? 'bg-surface-container-high ring-2 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  endMode === 'never' ? 'border-primary' : 'border-on-surface/20'
                }`}
              >
                {endMode === 'never' && <div className="w-3 h-3 bg-primary rounded-full" />}
              </div>
              <span className="font-medium text-lg">Keep going until I cancel</span>
            </button>
            <button
              type="button"
              onClick={() => setEndMode('date')}
              className={`w-full flex items-center gap-4 p-5 rounded-xl cursor-pointer text-left transition-colors ${
                endMode === 'date' ? 'bg-surface-container-high ring-2 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  endMode === 'date' ? 'border-primary' : 'border-on-surface/20'
                }`}
              >
                {endMode === 'date' && <div className="w-3 h-3 bg-primary rounded-full" />}
              </div>
              <span className={`font-medium text-lg ${endMode === 'date' ? '' : 'text-on-surface/30'}`}>End on a date</span>
            </button>
            {endMode === 'date' && (
              <input
                type="date"
                value={endDateYmd}
                onChange={(e) => setEndDateYmd(e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl px-4 py-3 text-on-surface border border-white/5"
              />
            )}
          </div>
        </div>

        {/* 06 Payment */}
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-label text-primary uppercase tracking-[0.2em]">06</span>
            <h2 className="text-2xl font-headline font-bold">Payment method</h2>
          </div>
          <div className="bg-surface-container-highest rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-deep-espresso rounded flex items-center justify-center text-blue-400 font-bold italic text-[10px]">
                VISA
              </div>
              <div>
                <p className="font-bold">Visa ending in 4747</p>
                <p className="text-sm text-on-surface/30">Expires 12/26</p>
              </div>
            </div>
            <span className="text-sm font-label text-on-surface/30">Saved on file</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3" role="alert">
            {error}
          </p>
        )}

        <div className="pt-8 space-y-4">
          <button
            type="button"
            disabled={pending}
            onClick={submit}
            className="w-full h-16 amber-glow rounded-full text-on-primary font-bold text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-60 disabled:pointer-events-none"
            style={{ boxShadow: '0 10px 30px rgba(200,134,74,0.3)' }}
          >
            {pending ? 'Starting…' : 'Start Subscription'}
            {!pending && (
              <span className="group-hover:translate-x-1 transition-transform">
                <ArrowFwdIcon />
              </span>
            )}
          </button>
          <p className="text-center text-sm text-on-surface/20 max-w-md mx-auto">
            By starting your subscription, you agree to our Terms of Service. You can pause or cancel anytime from your profile.
          </p>
          <p className="text-center text-xs text-on-surface/25">
            Need help? <Link href="/profile" className="text-primary hover:underline">Profile</Link>
          </p>
        </div>
          </>
        )}
      </main>
      <BottomNav activeTab="home" />
      <div className="h-24 md:hidden" />
    </>
  )
}
