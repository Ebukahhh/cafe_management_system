import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware-client'

/**
 * Middleware — runs on the Edge before every matched request.
 *
 * /admin/* is protected:
 *  - No session        → redirect to /login?next=<url>
 *  - Session, no role  → redirect to /?error=unauthorized
 *  - Session + admin   → allow through, refresh session cookies
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createMiddlewareClient(request, response)

  // getUser() makes a server-side JWT verification round-trip.
  // Never use getSession() here — it can be spoofed.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    // 1. Not logged in at all
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 2. Logged in but not an admin
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      const homeUrl = new URL('/', request.url)
      homeUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(homeUrl)
    }
  }

  // Allow the request through and return the response
  // (which carries any refreshed session cookies set above)
  return response
}

export const config = {
  matcher: [
    /*
     * Match /admin and all sub-paths.
     * Exclude Next.js internals and static assets to avoid unnecessary runs.
     */
    '/admin/:path*',
  ],
}
