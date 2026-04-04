'use client'

import { createClient } from '@/lib/supabase/client'
import HeroButtons from '@/components/HeroButtons'
import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

function firstNameFromUser(user: User | null): string | null {
  if (!user) return null
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const full =
    (typeof meta?.full_name === 'string' && meta.full_name) ||
    (typeof meta?.name === 'string' && meta.name) ||
    user.email?.split('@')[0] ||
    ''
  const first = full.trim().split(/\s+/)[0]
  return first || null
}

export default function LandingHero() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const firstName = firstNameFromUser(user)
  const personalized = Boolean(user && firstName)

  return (
    <div className="space-y-6 md:space-y-8">
      {personalized ? (
        <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-on-surface leading-[1.05] tracking-tight">
          Welcome back{' '}
          <span className="text-primary italic font-light">{firstName}</span>
        </h1>
      ) : (
        <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-on-surface leading-[0.9] tracking-tight">
          Your café, <br />
          <span className="text-primary italic font-light">reimagined.</span>
        </h1>
      )}

      <p className="text-on-surface/50 text-base md:text-xl lg:text-2xl max-w-lg leading-relaxed font-body">
        Order ahead, book a table, set up your daily coffee — all in one place.
      </p>

      <HeroButtons />
    </div>
  )
}
