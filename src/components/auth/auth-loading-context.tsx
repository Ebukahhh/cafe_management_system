'use client'

import { createClient } from '@/lib/supabase/client'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type AuthLoadingPhase = 'idle' | 'signing-in' | 'signing-out' | 'signing-up' | 'connecting'

type AuthLoadingContextValue = {
  phase: AuthLoadingPhase
  /** Show full-screen overlay for the given auth action. */
  start: (phase: Exclude<AuthLoadingPhase, 'idle'>) => void
  /** Hide overlay (e.g. after validation error). Call on failed sign-in/up. */
  stop: () => void
}

const AuthLoadingContext = createContext<AuthLoadingContextValue | null>(null)

const COPY: Record<Exclude<AuthLoadingPhase, 'idle'>, { title: string; subtitle: string }> = {
  'signing-in': {
    title: 'Signing you in',
    subtitle: 'Securing your session and loading your café experience.',
  },
  'signing-out': {
    title: 'Signing you out',
    subtitle: 'Closing your session safely. See you soon.',
  },
  'signing-up': {
    title: 'Creating your account',
    subtitle: 'Setting up your profile and preferences.',
  },
  connecting: {
    title: 'Connecting',
    subtitle: 'Redirecting you to sign in securely.',
  },
}

export function AuthLoadingProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<AuthLoadingPhase>('idle')
  const phaseRef = useRef<AuthLoadingPhase>('idle')
  phaseRef.current = phase

  const start = useCallback((p: Exclude<AuthLoadingPhase, 'idle'>) => {
    setPhase(p)
  }, [])

  const stop = useCallback(() => {
    setPhase('idle')
  }, [])

  /** Clear overlay when session actually changes (covers client navigations where phase would otherwise stick). */
  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      const p = phaseRef.current
      if (event === 'SIGNED_IN' && session) {
        if (p === 'signing-in' || p === 'signing-up' || p === 'connecting') {
          setPhase('idle')
        }
      }
      if (event === 'SIGNED_OUT' && p === 'signing-out') {
        setPhase('idle')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      phase,
      start,
      stop,
    }),
    [phase, start, stop]
  )

  return (
    <AuthLoadingContext.Provider value={value}>
      {children}
      <AuthLoadingOverlay phase={phase} />
    </AuthLoadingContext.Provider>
  )
}

export function useAuthLoading() {
  const ctx = useContext(AuthLoadingContext)
  if (!ctx) {
    throw new Error('useAuthLoading must be used within AuthLoadingProvider')
  }
  return ctx
}

function AuthLoadingOverlay({ phase }: { phase: AuthLoadingPhase }) {
  useEffect(() => {
    if (phase === 'idle') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [phase])

  if (phase === 'idle') return null

  const { title, subtitle } = COPY[phase]

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-labelledby="auth-loading-title"
      aria-describedby="auth-loading-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a0704]/85 backdrop-blur-md"
        aria-hidden
      />

      {/* Warm vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(200,134,74,0.12)_0%,transparent_55%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div
          className="glass-card relative overflow-hidden rounded-2xl border border-white/10 px-8 py-10 text-center shadow-2xl shadow-black/40"
          style={{
            boxShadow: '0 25px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Top amber accent */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-90" />

          {/* Animated rings + center glow */}
          <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-primary/20 [animation-duration:2s]" />
            <span className="absolute h-[85%] w-[85%] animate-pulse rounded-full border-2 border-primary/40" />
            <span className="absolute h-[65%] w-[65%] rounded-full border border-primary/25" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/5 text-3xl shadow-inner shadow-black/20">
              <span aria-hidden>☕</span>
            </span>
          </div>

          <h2
            id="auth-loading-title"
            className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl"
          >
            {title}
            <span className="inline-flex w-8 justify-start">
              <span className="animate-auth-dot-1">.</span>
              <span className="animate-auth-dot-2">.</span>
              <span className="animate-auth-dot-3">.</span>
            </span>
          </h2>
          <p
            id="auth-loading-desc"
            className="mt-3 text-sm leading-relaxed text-on-surface/55"
          >
            {subtitle}
          </p>

          {/* Progress shimmer */}
          <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-on-surface/10">
            <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 shadow-[0_0_12px_rgba(200,134,74,0.5)] animate-auth-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}
