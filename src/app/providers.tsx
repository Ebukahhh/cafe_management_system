'use client'

import { useEffect } from 'react'
import { AuthLoadingProvider } from '@/components/auth/auth-loading-context'
import { useAuthStore } from '@/lib/store/auth'

function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => initialize(), [initialize])

  return <>{children}</>
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthStoreProvider>
      <AuthLoadingProvider>{children}</AuthLoadingProvider>
    </AuthStoreProvider>
  )
}
