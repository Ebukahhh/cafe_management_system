/**
 * Auth Store — Zustand store synced with Supabase Auth
 *
 * Tracks the current user and provides auth actions.
 * Should be initialized once in a top-level provider.
 */
'use client'

import { create } from 'zustand'
import { ensureCustomerProfile } from '../supabase/mutations/ensure-customer-profile'
import { createClient } from '../supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '../supabase/types/database.types'

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean

  // Actions
  initialize: () => () => void
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initialize: () => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      set({ user, isLoading: false, isInitialized: true })
      if (user) get().fetchProfile()
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      set({ user, isLoading: false })
      if (user) get().fetchProfile()
      else set({ profile: null })
    })

    // Return cleanup function
    return () => subscription.unsubscribe()
  },

  signInWithEmail: async (email, password) => {
    const supabase = createClient()
    set({ isLoading: true })

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      set({ isLoading: false })
      throw new Error(error.message)
    }
  },

  signUp: async (email, password, fullName) => {
    const supabase = createClient()
    set({ isLoading: true })

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'customer' },
      },
    })

    if (error) {
      set({ isLoading: false })
      throw new Error(error.message)
    }

    set({ isLoading: false })
  },

  signOut: async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw new Error(error.message)

    set({ user: null, profile: null })
  },

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    const supabase = createClient()

    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error && error.code === 'PGRST116') {
      try {
        await ensureCustomerProfile(user)
        const retry = await supabase.from('profiles').select('*').eq('id', user.id).single()
        data = retry.data
        error = retry.error
      } catch (e) {
        console.error('Failed to create missing profile:', e)
        return
      }
    }

    if (error) {
      console.error('Failed to fetch profile:', error.message)
      return
    }

    set({ profile: data as Profile })
  },
}))
