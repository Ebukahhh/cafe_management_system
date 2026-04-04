'use client'

import { AuthLoadingProvider } from '@/components/auth/auth-loading-context'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AuthLoadingProvider>{children}</AuthLoadingProvider>
}
