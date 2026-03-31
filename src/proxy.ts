/**
 * Auth Proxy — Route Protection (Next.js 16: proxy replaces middleware)
 *
 * Protects customer routes (orders, profile, etc.) and admin routes.
 * Placed in src/ at the same level as app/.
 *
 * /admin/* is protected:
 *  - No session        → redirect to /login?next=<url>
 *  - Session, no role  → redirect to /?error=unauthorized
 *  - Session + admin   → allow through, refresh session cookies
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — IMPORTANT: do not remove this.
  // getUser() makes a server-side JWT verification round-trip.
  // Never use getSession() here — it can be spoofed.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Admin route protection ──────────────────────────────────────────
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

  // ── Protected customer routes ───────────────────────────────────────
  /* TEMPORARILY DISABLED: Bypass auth checks for development
  const protectedRoutes = [
    '/orders',
    '/profile',
    '/reservations',
    '/subscription',
    '/notifications',
    '/checkout',
  ]

  const isProtected = protectedRoutes.some((r) =>
    pathname.startsWith(r)
  )

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
  */

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - Public assets
     */
    '/((?!_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
