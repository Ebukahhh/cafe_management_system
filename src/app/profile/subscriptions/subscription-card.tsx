'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { togglePauseSubscription, cancelSubscription } from './actions'

type SubscriptionCardProps = {
  sub: {
    id: string
    status: string
    frequency: string
    next_run_at: string | null
    created_at: string
    subscription_items: any
  }
}

export default function SubscriptionCard({ sub }: SubscriptionCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isCancelled = sub.status === 'cancelled'
  const isPaused = sub.status === 'paused'
  const isActive = sub.status === 'active'

  const items = Array.isArray(sub.subscription_items) 
    ? sub.subscription_items 
    : [sub.subscription_items].filter(Boolean)
  
  const itemsText = items.length > 0 
    ? items.map((i: any) => `${i.quantity}x ${i.product_name || 'Item'}`).join(', ')
    : 'Unknown Coffee Plan'

  const handleTogglePause = () => {
    setError(null)
    startTransition(async () => {
      try {
        await togglePauseSubscription(sub.id, sub.status)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  const handleCancel = () => {
    if (!window.confirm('Are you sure you want to permanently cancel this subscription?')) {
      return
    }
    setError(null)
    startTransition(async () => {
      try {
        await cancelSubscription(sub.id)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  let statusStyles = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  if (isCancelled) statusStyles = 'text-red-400 border-red-500/30 bg-red-500/10'
  if (isPaused) statusStyles = 'text-amber-400 border-amber-500/30 bg-amber-500/10'

  return (
    <div 
      className="bg-surface-container rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start relative overflow-hidden group border border-white/5 transition-all outline-none" 
      style={{ opacity: isCancelled ? 0.6 : (isPending ? 0.7 : 1) }}
    >
      <div className="space-y-4 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary px-2 py-1 bg-primary/10 rounded border border-primary/20">
            {String(sub.frequency).replace('_', ' ')}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${statusStyles}`}>
            {isPending ? 'UPDATING...' : sub.status}
          </span>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
        
        <div>
          <h3 className="text-lg md:text-xl font-headline font-bold text-on-surface line-clamp-2">{itemsText}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
            <p className="text-sm font-medium text-primary">
              {sub.next_run_at && !isCancelled 
                ? `Next billing: ${new Date(sub.next_run_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}`
                : `Created: ${new Date(sub.created_at).toLocaleDateString()}`
              }
            </p>
            <p className="text-xs text-on-surface/30 font-mono">
              ID: {sub.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {!isCancelled && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0 justify-end flex-shrink-0">
          <Link
            href={`/subscription?edit=${sub.id}`}
            className={`text-sm font-semibold text-primary px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-bright transition-colors ${isPending ? 'pointer-events-none opacity-50' : ''}`}
          >
            Edit
          </Link>
          <button 
            disabled={isPending}
            onClick={handleTogglePause}
            className="text-sm font-semibold text-primary px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-bright transition-colors disabled:opacity-50"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button 
            disabled={isPending}
            onClick={handleCancel}
            className="text-sm font-semibold text-red-400 px-4 py-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-transparent hover:border-red-900/40 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
