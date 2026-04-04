'use client'

/**
 * ProtectedLink — Navigates to `href` if the user is authenticated,
 * otherwise redirects to /signup?next=<href>.
 *
 * Renders as a plain <a>-like element; pass `className` and `children` freely.
 */

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  href: string
  className?: string
  children: React.ReactNode
  /** Render as a <button> instead of a <div>; useful for CTA styling */
  asButton?: boolean
  /** Called after navigation is triggered (e.g. close mobile menu) */
  onNavigate?: () => void
}

export default function ProtectedLink({ href, className, children, asButton, onNavigate }: Props) {
  const router = useRouter()

  async function handleClick() {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()

    if (data.user) {
      router.push(href)
    } else {
      router.push(`/signup?next=${encodeURIComponent(href)}`)
    }
    onNavigate?.()
  }

  if (asButton) {
    return (
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
    )
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a role="button" tabIndex={0} onClick={handleClick} onKeyDown={(e) => e.key === 'Enter' && void handleClick()} className={`cursor-pointer ${className ?? ''}`}>
      {children}
    </a>
  )
}
