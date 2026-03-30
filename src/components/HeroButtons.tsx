'use client'

import ProtectedLink from '@/components/ProtectedLink'

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export default function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
      <ProtectedLink
        href="/checkout"
        asButton
        className="amber-glow text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer"
      >
        Order Now
        <ArrowRightIcon />
      </ProtectedLink>

      <ProtectedLink
        href="/reserve"
        asButton
        className="bg-surface-container-high text-on-surface px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg active:scale-95 transition-all hover:bg-surface-bright cursor-pointer"
      >
        Reserve a Table
      </ProtectedLink>
    </div>
  )
}
