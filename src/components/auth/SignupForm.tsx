'use client'

import { useAuthLoading } from '@/components/auth/auth-loading-context'
import { ensureCustomerProfile } from '@/lib/supabase/mutations/ensure-customer-profile'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const inputClass =
  'w-full bg-stone-100 rounded-lg px-4 py-3 text-stone-900 font-body outline-none ring-1 ring-transparent focus:ring-primary-container/30 focus:bg-white transition-all placeholder:text-stone-400'

const labelClass =
  'font-label text-[10px] uppercase tracking-widest text-stone-500 font-bold block px-1'

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'
  const { start, stop } = useAuthLoading()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    if (!fullName) {
      setError('Please enter your first and last name.')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!terms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)
    start('signing-up')
    try {
      const supabase = createClient()
      const { data, error: signErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone.trim() || null,
            role: 'customer',
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      })

      if (signErr) {
        stop()
        setError(signErr.message)
        return
      }

      if (data.user && data.session) {
        try {
          await ensureCustomerProfile(data.user, {
            fullName,
            phone: phone.trim() || null,
          })
        } catch (profileErr) {
          console.error(profileErr)
          stop()
          setError('Account was created but your profile could not be saved. Try signing in, or contact support.')
          return
        }
        router.push(next.startsWith('/') ? next : '/')
        router.refresh()
        stop()
        return
      }

      if (data.user && !data.session) {
        stop()
        setInfo(
          'Account created. Check your email for a confirmation link before signing in. If you do not see it, check spam.'
        )
        return
      }

      stop()
      setError('Unexpected response from server. Please try again.')
    } catch (err) {
      stop()
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)} noValidate>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200" role="alert">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-200" role="status">
          {info}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="first-name" className={labelClass}>
            First Name
          </label>
          <input
            id="first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            placeholder="Jennifer"
            className={inputClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="last-name" className={labelClass}>
            Last Name
          </label>
          <input
            id="last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Smith"
            className={inputClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-email" className={labelClass}>
          Email address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jennifer@specialtycoffee.com"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between px-1">
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <span className="font-mono text-[10px] text-stone-400">OPTIONAL</span>
        </div>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (555) 000-0000"
          className={inputClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            name="password"
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="••••••••"
            className={`${inputClass} pr-12`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-stone-400 transition-colors hover:text-stone-700"
            aria-label={showPw ? 'Hide password' : 'Show password'}
            onClick={() => setShowPw((v) => !v)}
          >
            <EyeOffIcon />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className={labelClass}>
          Confirm password
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className={inputClass}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="flex items-start gap-3 px-1 py-2">
        <div className="relative flex h-5 items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 cursor-pointer rounded bg-stone-100 text-primary-container focus:ring-primary-container/40"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
          />
        </div>
        <label htmlFor="terms" className="text-xs leading-tight text-stone-500">
          I agree to the{' '}
          <Link href="#" className="underline transition-colors hover:text-primary-container">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline transition-colors hover:text-primary-container">
            Privacy Policy
          </Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="amber-glow mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-4 font-bold text-on-primary shadow-lg shadow-primary-container/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? 'Creating account…' : 'Create Account'}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </form>
  )
}
