/**
 * Server Supabase Client — for Server Components & API Routes
 *
 * Use this in Server Components, Server Actions, and Next.js API route handlers.
 * It reads the session from cookies automatically.
 *
 * NOTE: Once the backend provides the Supabase project ID, generate proper
 * Database types with `npx supabase gen types` and add the generic here:
 *   createServerClient<Database>(...)
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll can fail in Server Components (read-only).
            // Safe to ignore — middleware handles session refresh.
          }
        },
      },
    }
  )
}
