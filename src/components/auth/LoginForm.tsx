'use client'

import { useAuthLoading } from '@/components/auth/auth-loading-context'
import { ensureCustomerProfile } from '@/lib/supabase/mutations/ensure-customer-profile'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'
  const { start, stop } = useAuthLoading()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    start('signing-in')
    try {
      const supabase = createClient()
      const { data, error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signErr) {
        stop()
        setError(signErr.message)
        return
      }

      if (data.user) {
        try {
          await ensureCustomerProfile(data.user)
        } catch (profileErr) {
          console.error('[login] profile ensure', profileErr)
        }
      }

      router.push(next.startsWith('/') ? next : '/')
      router.refresh()
      stop()
    } catch (err) {
      stop()
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={(e) => void handleSubmit(e)} noValidate>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200" role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium tracking-wide text-stone-700 font-label">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jennifer@cafe.com"
          className="h-12 w-full rounded-lg bg-stone-100 px-4 font-body text-stone-900 outline-none ring-1 ring-transparent transition-all placeholder:text-stone-400 focus:bg-white focus:ring-primary-container/30"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium tracking-wide text-stone-700 font-label">
            Password
          </label>
          <Link href="#" className="text-xs font-label text-stone-500 transition-colors hover:text-primary-container">
            Forgot password?
          </Link>
        </div>
        <div className="group relative">
          <input
            id="password"
            name="password"
            type={showPw ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="h-12 w-full rounded-lg bg-stone-100 px-4 pr-12 font-body text-stone-900 outline-none ring-1 ring-transparent transition-all placeholder:text-stone-400 focus:bg-white focus:ring-primary-container/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-stone-400 transition-colors hover:text-stone-700"
            aria-label={showPw ? 'Hide password' : 'Show password'}
            onClick={() => setShowPw((v) => !v)}
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="amber-glow h-14 w-full cursor-pointer rounded-xl font-body text-lg font-bold text-on-primary shadow-lg shadow-primary-container/20 transition-all hover:scale-[1.01] hover:shadow-xl active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Log In'}
      </button>
    </form>
  )
}
