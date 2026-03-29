__JenniferΓÇÖs Caf├⌐__

FrontendΓÇôBackend Integration Guide

Naming conventions, query patterns, auth flow, Realtime, and rules for the frontend developer  ┬╖  v1\.0  ┬╖  March 2025

*This document is the single source of truth for how the frontend application communicates with the Supabase backend\. Every developer working on this project must read and follow everything in this guide before writing a single database query\.*

__1\. Naming Conventions__

Everything in the database follows snake\_case\. Everything in the frontend follows camelCase\. Supabase\-js handles the bridge automatically ΓÇö you query using the database name and TypeScript gives you the right type\.

## __1\.1 Database Naming Rules \(Backend\)__

__What__

__Convention & Example__

__Table names__

__Plural snake\_case ΓÇö orders, order\_items, loyalty\_points__

__Column names__

__snake\_case ΓÇö user\_id, created\_at, is\_available, full\_name__

__Primary keys__

__Always named id ΓÇö never user\_id or order\_id as PK__

__Foreign keys__

__Referenced table singular \+ \_id ΓÇö user\_id, product\_id, order\_id__

__Boolean columns__

__Prefixed with is\_ or has\_ ΓÇö is\_available, is\_read, is\_featured__

__Timestamp columns__

__Suffixed with \_at ΓÇö created\_at, updated\_at, reviewed\_at__

__Date columns__

__Suffixed with \_date or plain noun ΓÇö end\_date, date__

__Status columns__

__Always named status, always an enum type__

__JSONB columns__

__Descriptive plural ΓÇö dietary\_flags, selected\_options, choices__

__Function names__

__Verb \+ noun snake\_case ΓÇö get\_loyalty\_balance, check\_slot\_availability__

## __1\.2 Frontend Naming Rules \(Next\.js / TypeScript\)__

__What__

__Convention & Example__

__Variables & functions__

__camelCase ΓÇö userId, createdAt, isAvailable, fullName__

__React components__

__PascalCase ΓÇö OrderCard, MenuGrid, ReservationForm__

__TypeScript interfaces__

__PascalCase ΓÇö Order, OrderItem, UserProfile, Reservation__

__Supabase query files__

__kebab\-case ΓÇö get\-orders\.ts, create\-reservation\.ts__

__API route folders__

__kebab\-case ΓÇö app/api/create\-order/route\.ts__

__Custom hooks__

__Prefixed with use ΓÇö useOrders\(\), useProfile\(\), useCart\(\)__

__Constants__

__SCREAMING\_SNAKE\_CASE ΓÇö ORDER\_STATUS, MAX\_PARTY\_SIZE__

__Environment variables__

__SCREAMING\_SNAKE\_CASE ΓÇö NEXT\_PUBLIC\_SUPABASE\_URL__

*The database uses snake\_case and the frontend uses camelCase\. When you do supabase\.from\('order\_items'\)\.select\('unit\_price'\), TypeScript will give you unit\_price\. You do NOT need to rename it manually ΓÇö use it as\-is in your component or map it to camelCase in a dedicated data layer function\. Pick one approach and be consistent across the whole project\.*

__2\. Recommended File Structure__

All database interaction must live in one place ΓÇö the /lib/supabase/ folder\. No component should ever import the Supabase client directly and write a query inline\. This makes queries reusable, testable, and easy to update when the schema changes\.

// Recommended project structure for database interaction

lib/

  supabase/

    client\.ts          // Browser Supabase client \(Client Components\)

    server\.ts          // Server Supabase client \(Server Components, API routes\)

    queries/

      products\.ts      // All product\-related queries

      orders\.ts        // All order\-related queries

      reservations\.ts  // All reservation queries

      subscriptions\.ts // All subscription queries

      profile\.ts       // User profile queries

      loyalty\.ts       // Loyalty points queries

      promotions\.ts    // Promo code queries

    mutations/

      create\-order\.ts  // Create order \+ items \(multi\-step\)

      update\-order\-status\.ts

      create\-reservation\.ts

      create\-subscription\.ts

    types/

      database\.types\.ts  // Auto\-generated from Supabase CLI

      app\.types\.ts       // App\-level types built on top of DB types

__3\. Environment Variables__

Create a file called \.env\.local in the root of the Next\.js project\. This file must NEVER be committed to Git\. Add it to \.gitignore immediately\.

\# \.env\.local ΓÇö Jennifer's Caf├⌐ Management System

\# DO NOT commit this file to Git ever

\# ΓöÇΓöÇ Supabase ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

NEXT\_PUBLIC\_SUPABASE\_URL=https://xxxxxxxxxxxx\.supabase\.co

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=eyJhbGciOiJIUzI1NiIsInR5c\.\.\.

\# Server\-only ΓÇö never use NEXT\_PUBLIC\_ prefix for these

SUPABASE\_SERVICE\_ROLE\_KEY=eyJhbGciOiJIUzI1NiIsInR5c\.\.\.

\# ΓöÇΓöÇ Stripe ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

NEXT\_PUBLIC\_STRIPE\_PUBLISHABLE\_KEY=pk\_test\_\.\.\.

STRIPE\_SECRET\_KEY=sk\_test\_\.\.\.

STRIPE\_WEBHOOK\_SECRET=whsec\_\.\.\.

__Variable__

__Used Where__

__Safe to expose?__

NEXT\_PUBLIC\_SUPABASE\_URL

__Client \+ Server components__

Yes ΓÇö public

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY

__Client \+ Server components__

Yes ΓÇö RLS protects it

SUPABASE\_SERVICE\_ROLE\_KEY

__Server only ΓÇö API routes, Edge Functions__

NO ΓÇö bypasses RLS

NEXT\_PUBLIC\_STRIPE\_PUBLISHABLE\_KEY

__Client components \(Stripe Elements\)__

Yes ΓÇö public

STRIPE\_SECRET\_KEY

__Server only ΓÇö API routes__

NO ΓÇö server only

STRIPE\_WEBHOOK\_SECRET

__Server only ΓÇö webhook handler__

NO ΓÇö server only

__4\. Supabase Client Setup__

There are two Supabase clients\. Use the right one depending on where your code runs\. Using the wrong one will cause authentication bugs that are hard to debug\.

## __4\.1 Browser Client ΓÇö for Client Components__

Use this in any component with 'use client' at the top, or in custom hooks\.

// lib/supabase/client\.ts

import \{ createBrowserClient \} from '@supabase/ssr'

import type \{ Database \} from '\./types/database\.types'

export function createClient\(\) \{

  return createBrowserClient<Database>\(

    process\.env\.NEXT\_PUBLIC\_SUPABASE\_URL\!,

    process\.env\.NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY\!

  \)

\}

// Usage in a Client Component:

// const supabase = createClient\(\)

// const \{ data \} = await supabase\.from\('products'\)\.select\('\*'\)

## __4\.2 Server Client ΓÇö for Server Components & API Routes__

Use this in Server Components, Server Actions, and Next\.js API route handlers\. It reads the session from cookies automatically\.

// lib/supabase/server\.ts

import \{ createServerClient \} from '@supabase/ssr'

import \{ cookies \} from 'next/headers'

import type \{ Database \} from '\./types/database\.types'

export async function createClient\(\) \{

  const cookieStore = await cookies\(\)

  return createServerClient<Database>\(

    process\.env\.NEXT\_PUBLIC\_SUPABASE\_URL\!,

    process\.env\.NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY\!,

    \{

      cookies: \{

        getAll\(\) \{ return cookieStore\.getAll\(\) \},

        setAll\(cookiesToSet\) \{

          cookiesToSet\.forEach\(\(\{ name, value, options \}\) =>

            cookieStore\.set\(name, value, options\)\)

        \}

      \}

    \}

  \)

\}

## __4\.3 Generate TypeScript Types__

Run this command once after the schema is set up, and again any time the schema changes\. This gives the frontend developer full autocomplete for every table, column, and enum\.

\# Install Supabase CLI first

npm install supabase \-\-save\-dev

\# Generate types from your live database

npx supabase gen types typescript \\

  \-\-project\-id YOUR\_PROJECT\_ID \\

  \-\-schema public \\

  > lib/supabase/types/database\.types\.ts

\# Your project ID is the part of your Supabase URL before \.supabase\.co

\# e\.g\. https://abcdefghijk\.supabase\.co  ΓåÆ  project\-id = abcdefghijk

__5\. Standard Query Patterns__

All queries follow the same pattern\. Study these examples ΓÇö every database interaction in the app should be written this way\.

## __5\.1 Fetching Data \(SELECT\)__

// Simple fetch ΓÇö all available products in a category

const \{ data: products, error \} = await supabase

  \.from\('products'\)

  \.select\('\*, product\_options\(\*\), categories\(name\)'\)

  \.eq\('category\_id', categoryId\)

  \.eq\('is\_available', true\)

  \.order\('sort\_order', \{ ascending: true \}\)

if \(error\) throw new Error\(error\.message\)

// Fetch a user's orders with their items

const \{ data: orders, error \} = await supabase

  \.from\('orders'\)

  \.select\('\*, order\_items\(\*, products\(name, image\_url\)\)'\)

  \.eq\('user\_id', userId\)

  \.order\('created\_at', \{ ascending: false \}\)

  \.limit\(20\)

// Fetch a single row by ID

const \{ data: order, error \} = await supabase

  \.from\('orders'\)

  \.select\('\*'\)

  \.eq\('id', orderId\)

  \.single\(\)  // throws if 0 or 2\+ rows found

## __5\.2 Creating Data \(INSERT\)__

// Insert a single row

const \{ data: reservation, error \} = await supabase

  \.from\('reservations'\)

  \.insert\(\{

    user\_id: userId,

    date: '2025\-04\-08',

    time\_slot: '11:00',

    party\_size: 4,

    note: 'Window seat if possible'

  \}\)

  \.select\(\)   // returns the created row

  \.single\(\)

if \(error\) throw new Error\(error\.message\)

// Insert multiple rows at once \(e\.g\. order items\)

const \{ error \} = await supabase

  \.from\('order\_items'\)

  \.insert\(\[

    \{ order\_id: orderId, product\_id: 'abc\.\.\.', product\_name: 'Pour Over',

      quantity: 2, unit\_price: 5\.50, line\_total: 11\.00 \},

    \{ order\_id: orderId, product\_id: 'def\.\.\.', product\_name: 'Croissant',

      quantity: 1, unit\_price: 3\.50, line\_total: 3\.50 \},

  \]\)

## __5\.3 Updating Data \(UPDATE\)__

// Update order status

const \{ error \} = await supabase

  \.from\('orders'\)

  \.update\(\{ status: 'confirmed' \}\)

  \.eq\('id', orderId\)

// Mark all notifications as read for a user

const \{ error \} = await supabase

  \.from\('notifications'\)

  \.update\(\{ is\_read: true \}\)

  \.eq\('user\_id', userId\)

  \.eq\('is\_read', false\)

// Update profile

const \{ error \} = await supabase

  \.from\('profiles'\)

  \.update\(\{ full\_name: 'Abena Mensah', phone: '\+233201234567' \}\)

  \.eq\('id', userId\)

## __5\.4 Calling Helper Functions \(RPC\)__

// Get a user's loyalty balance

const \{ data: balance, error \} = await supabase

  \.rpc\('get\_loyalty\_balance', \{ p\_user\_id: userId \}\)

// Check if a reservation slot has availability

const \{ data: isAvailable, error \} = await supabase

  \.rpc\('check\_slot\_availability', \{

    p\_date: '2025\-04\-08',

    p\_time\_slot: '11:00',

    p\_party\_size: 4

  \}\)

// isAvailable will be true or false

if \(\!isAvailable\) \{

  throw new Error\('This slot is fully booked'\)

\}

## __5\.5 Always Handle Errors__

*Every single Supabase query returns \{ data, error \}\. Never ignore the error\. If you skip error handling and the query fails silently, the user sees broken UI with no explanation\. Always check error before using data\.*

// WRONG ΓÇö never do this

const \{ data \} = await supabase\.from\('orders'\)\.select\('\*'\)

console\.log\(data\) // could be null if query failed

// CORRECT ΓÇö always do this

const \{ data, error \} = await supabase\.from\('orders'\)\.select\('\*'\)

if \(error\) \{

  console\.error\('Failed to fetch orders:', error\.message\)

  // Show user\-friendly error in the UI

  throw new Error\(error\.message\)

\}

// Now safe to use data

console\.log\(data\)

__6\. Authentication Flow__

Supabase Auth handles all authentication\. The frontend developer does not write any password hashing or session management code\. Here is every auth action they need to implement\.

## __6\.1 Sign Up__

const \{ data, error \} = await supabase\.auth\.signUp\(\{

  email: 'abena@example\.com',

  password: 'securepassword123',

  options: \{

    data: \{

      full\_name: 'Abena Mensah',  // stored in raw\_user\_meta\_data

    \}

  \}

\}\)

// This automatically triggers the handle\_new\_user\(\) database trigger

// which creates a row in the profiles table immediately\.

// The user receives a confirmation email before they can sign in\.

## __6\.2 Sign In__

// Email \+ password sign in

const \{ data, error \} = await supabase\.auth\.signInWithPassword\(\{

  email: 'abena@example\.com',

  password: 'securepassword123'

\}\)

// Google OAuth sign in

const \{ error \} = await supabase\.auth\.signInWithOAuth\(\{

  provider: 'google',

  options: \{

    redirectTo: \`$\{window\.location\.origin\}/auth/callback\`

  \}

\}\)

## __6\.3 Get the Current User__

// In a Server Component ΓÇö most secure, use this for protected pages

const supabase = await createClient\(\)  // server client

const \{ data: \{ user \} \} = await supabase\.auth\.getUser\(\)

if \(\!user\) \{

  redirect\('/login'\)  // from next/navigation

\}

// In a Client Component

const supabase = createClient\(\)  // browser client

const \{ data: \{ user \} \} = await supabase\.auth\.getUser\(\)

## __6\.4 Sign Out__

const \{ error \} = await supabase\.auth\.signOut\(\)

// Then redirect to /login

## __6\.5 OAuth Callback Route__

For Google sign in to work, create this file exactly:

// app/auth/callback/route\.ts

import \{ createClient \} from '@/lib/supabase/server'

import \{ NextResponse \} from 'next/server'

export async function GET\(request: Request\) \{

  const \{ searchParams, origin \} = new URL\(request\.url\)

  const code = searchParams\.get\('code'\)

  if \(code\) \{

    const supabase = await createClient\(\)

    await supabase\.auth\.exchangeCodeForSession\(code\)

  \}

  return NextResponse\.redirect\(\`$\{origin\}/menu\`\)

\}

## __6\.6 Protecting Pages \(Middleware\)__

Create this middleware file to protect all routes that require login\. Without this, a user could navigate directly to /orders or /profile without being logged in\.

// middleware\.ts  \(at the root of the Next\.js project, not inside app/\)

import \{ createServerClient \} from '@supabase/ssr'

import \{ NextResponse, type NextRequest \} from 'next/server'

export async function middleware\(request: NextRequest\) \{

  let response = NextResponse\.next\(\{ request \}\)

  const supabase = createServerClient\(

    process\.env\.NEXT\_PUBLIC\_SUPABASE\_URL\!,

    process\.env\.NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY\!,

    \{ cookies: \{ /\* cookie handlers \*/ \} \}

  \)

  const \{ data: \{ user \} \} = await supabase\.auth\.getUser\(\)

  // Redirect unauthenticated users away from protected routes

  const protectedRoutes = \['/orders', '/profile', '/reservations',

    '/subscriptions', '/notifications', '/checkout'\]

  const isProtected = protectedRoutes\.some\(r =>

    request\.nextUrl\.pathname\.startsWith\(r\)\)

  if \(isProtected && \!user\) \{

    return NextResponse\.redirect\(new URL\('/login', request\.url\)\)

  \}

  // Redirect admins only ΓÇö check role from profiles table

  if \(request\.nextUrl\.pathname\.startsWith\('/admin'\) && \!user\) \{

    return NextResponse\.redirect\(new URL\('/login', request\.url\)\)

  \}

  return response

\}

export const config = \{

  matcher: \['/\(\(?\!\_next/static|\_next/image|favicon\.ico\)\.\*\)'\],

\}

__7\. Realtime Subscriptions__

Realtime is how the frontend receives live updates from the database without refreshing the page\. It powers the live order tracking, notification badge, and admin order queue\. The tables already enabled for Realtime are: orders, notifications, reservations, subscription\_runs\.

## __7\.1 Subscribe to Order Status Changes__

// Use inside a useEffect in the order tracking page

useEffect\(\(\) => \{

  const channel = supabase

    \.channel\(\`order\-$\{orderId\}\`\)  // unique channel name per order

    \.on\(

      'postgres\_changes',

      \{

        event: 'UPDATE',

        schema: 'public',

        table: 'orders',

        filter: \`id=eq\.$\{orderId\}\`  // only this specific order

      \},

      \(payload\) => \{

        // payload\.new contains the updated row

        setOrderStatus\(payload\.new\.status\)

      \}

    \)

    \.subscribe\(\)

  // IMPORTANT: Always unsubscribe when the component unmounts

  return \(\) => \{ supabase\.removeChannel\(channel\) \}

\}, \[orderId\]\)

## __7\.2 Subscribe to New Notifications__

// Subscribe to new notifications for the current user

const channel = supabase

  \.channel\('notifications'\)

  \.on\(

    'postgres\_changes',

    \{

      event: 'INSERT',  // only new notifications

      schema: 'public',

      table: 'notifications',

      filter: \`user\_id=eq\.$\{userId\}\`

    \},

    \(payload\) => \{

      // Increment unread badge count

      setUnreadCount\(prev => prev \+ 1\)

      // Optionally show a toast notification

      toast\(payload\.new\.title\)

    \}

  \)

  \.subscribe\(\)

## __7\.3 Admin ΓÇö Subscribe to All New Orders__

// On the admin orders panel ΓÇö listen for any new order

const channel = supabase

  \.channel\('admin\-orders'\)

  \.on\(

    'postgres\_changes',

    \{ event: 'INSERT', schema: 'public', table: 'orders' \},

    \(payload\) => \{

      // Add the new order to the top of the pending column

      setOrders\(prev => \[payload\.new, \.\.\.prev\]\)

    \}

  \)

  \.on\(

    'postgres\_changes',

    \{ event: 'UPDATE', schema: 'public', table: 'orders' \},

    \(payload\) => \{

      // Update the order in the correct column when status changes

      setOrders\(prev => prev\.map\(o =>

        o\.id === payload\.new\.id ? payload\.new : o

      \)\)

    \}

  \)

  \.subscribe\(\)

__8\. Complete Table & Column Reference__

Quick reference for every table name and its most important columns\. Use these exact names in all Supabase queries\.

### __Customer\-Facing Tables__

__Table name__

__Key columns to query__

profiles

__id, full\_name, avatar\_url, phone, role, dietary\_flags__

categories

__id, name, slug, sort\_order, is\_active__

products

__id, category\_id, name, description, price, image\_url, is\_available, is\_featured, stock\_count__

product\_options

__id, product\_id, label, type, choices, is\_required__

orders

__id, user\_id, payment\_id, status, order\_type, subtotal, total, created\_at__

order\_items

__id, order\_id, product\_id, product\_name, quantity, unit\_price, selected\_options, line\_total__

payments

__id, user\_id, provider\_ref, status, amount, method__

loyalty\_points

__id, user\_id, order\_id, points, type, description__

promotions

__id, code, type, value, min\_order, is\_active, expires\_at__

reviews

__id, user\_id, product\_id, order\_id, rating, comment__

notifications

__id, user\_id, type, title, body, action\_url, is\_read__

### __Reservation Tables__

__Table name__

__Key columns to query__

reservations

__id, user\_id, date, time\_slot, party\_size, status, note, created\_at__

slot\_capacity

__id, time\_slot, max\_covers__

blocked\_slots

__id, date, time\_slot, reason__

### __Subscription Tables__

__Table name__

__Key columns to query__

subscriptions

__id, user\_id, frequency, days\_of\_week, preferred\_time, status, next\_run\_at, end\_date__

subscription\_items

__id, subscription\_id, product\_id, product\_name, quantity, unit\_price, selected\_options__

subscription\_runs

__id, subscription\_id, order\_id, status, error\_message, run\_at__

### __Enum Values ΓÇö Status Fields__

These are the only valid values for status fields\. Use these exact strings in your code ΓÇö the database will reject anything else\.

__Column__

__Valid values__

orders\.status

__pending ΓÇó confirmed ΓÇó preparing ΓÇó ready ΓÇó delivered ΓÇó cancelled__

orders\.order\_type

__pickup ΓÇó delivery ΓÇó dine\_in__

payments\.status

__pending ΓÇó succeeded ΓÇó failed ΓÇó refunded__

reservations\.status

__pending ΓÇó confirmed ΓÇó declined ΓÇó cancelled ΓÇó completed__

subscriptions\.status

__active ΓÇó paused ΓÇó cancelled ΓÇó completed__

subscriptions\.frequency

__daily ΓÇó weekdays ΓÇó specific\_days ΓÇó weekly__

subscription\_runs\.status

__success ΓÇó failed ΓÇó skipped__

loyalty\_points\.type

__earn ΓÇó redeem__

promotions\.type

__percent ΓÇó flat__

profiles\.role

__customer ΓÇó admin ΓÇó barista__

notifications\.type

__order\_update ΓÇó reservation\_update ΓÇó subscription\_alert ΓÇó promotion ΓÇó system__

__9\. Hard Rules ΓÇö Never Break These__

- __RULE 1: __Never write a Supabase query directly inside a React component\. All queries go in lib/supabase/queries/ or lib/supabase/mutations/\.
- __RULE 2: __Never use the service\_role key in frontend code\. It belongs only in API routes and Server Actions\.
- __RULE 3: __Never hard\-code a user ID\. Always get it from supabase\.auth\.getUser\(\) ΓÇö never from localStorage or a prop\.
- __RULE 4: __Never reference products\.price in order history\. Always display order\_items\.unit\_price ΓÇö the snapshotted price at purchase time\.
- __RULE 5: __Always unsubscribe from Realtime channels when a component unmounts\. Return the cleanup in useEffect\.
- __RULE 6: __Never delete products or users\. Set is\_available = false for products\. Supabase Auth handles user deletion\.
- __RULE 7: __Always check for errors before using data from any Supabase query\. Never assume a query succeeded\.
- __RULE 8: __Always re\-generate database\.types\.ts after any schema change using the Supabase CLI command\.
- __RULE 9: __Never use \.eq\('user\_id', userId\) for admin queries that need all users' data\. Use the service role client in a Server Action instead\.
- __RULE 10: __Never commit \.env\.local to Git\. If it gets committed accidentally, rotate your Supabase keys immediately\.

*Document prepared by: Teniola John Ogunyemi ΓÇö Backend Engineer*

*JenniferΓÇÖs Caf├⌐ Management System  ┬╖  v1\.0  ┬╖  March 2025  ┬╖  Share only with the assigned frontend developer*

