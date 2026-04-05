import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Order Confirmed | Jennifer\'s Caf\u00e9',
  description: 'Your order has been placed. Track your brew in real-time.',
}

type PageProps = {
  searchParams: Promise<{ payment?: string }>
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function formatCurrency(amount: number | null | undefined, currency = 'USD') {
  const safeAmount = Number(amount ?? 0)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(safeAmount)
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/order-confirmation')
  }

  const params = await searchParams
  const paymentId = params.payment ?? null
  const serviceSupabase = createServiceRoleClient()

  const paymentQuery = paymentId && serviceSupabase
    ? serviceSupabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .eq('user_id', user.id)
        .maybeSingle()
    : paymentId
    ? supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .eq('user_id', user.id)
        .maybeSingle()
    : Promise.resolve({ data: null, error: null })

  const [paymentResult] = await Promise.all([paymentQuery])
  const payment = paymentResult.data

  const orderResult = payment && serviceSupabase
    ? await serviceSupabase
        .from('orders')
        .select(`
          id,
          status,
          order_type,
          total,
          created_at,
          scheduled_for,
          order_items (
            id,
            product_name,
            quantity,
            line_total
          )
        `)
        .eq('payment_id', payment.id)
        .maybeSingle()
    : payment
    ? await supabase
        .from('orders')
        .select(`
          id,
          status,
          order_type,
          total,
          created_at,
          scheduled_for,
          order_items (
            id,
            product_name,
            quantity,
            line_total
          )
        `)
        .eq('payment_id', payment.id)
        .maybeSingle()
    : { data: null, error: null }

  const order = orderResult.data
  const paymentMetadata = (payment?.metadata ?? {}) as {
    card?: {
      brand: string
      last4: string
    }
  }

  const isSucceeded = payment?.status === 'succeeded' && !!order
  const isProcessing = !payment || payment.status === 'pending' || !order

  return (
    <>
      <Navbar />
      <main className="max-w-[720px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24 flex flex-col items-center">
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
            <span className="text-primary relative">
              {isSucceeded ? <CheckCircleIcon /> : <ClockIcon />}
            </span>
          </div>
          <h1 className="font-headline text-4xl mb-3 text-on-surface tracking-tight">
            {isSucceeded ? 'Order placed!' : 'Payment is processing'}
          </h1>
          <p className="text-on-surface/50 text-lg max-w-xl">
            {isSucceeded
              ? 'Your payment was confirmed and your order is now in the cafe queue.'
              : 'We are still waiting for payment confirmation. If you just completed 3D Secure or a redirect flow, refresh this page in a few seconds.'}
          </p>
        </div>

        <div className="w-full bg-[#F5EDE5] rounded-xl p-6 md:p-8 mb-8 text-[#1A1208] overflow-hidden relative">
          <div className="flex justify-between items-start mb-8 pb-6" style={{ borderBottom: '1px solid rgba(26,18,8,0.08)' }}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#1A1208]/40 mb-1">Payment</p>
              <p className="font-mono text-xl font-bold">{payment ? payment.id.slice(0, 8).toUpperCase() : 'Pending'}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#1A1208]/40 mb-1">Status</p>
              <p className="font-body font-semibold capitalize">{payment?.status ?? 'pending'}</p>
            </div>
          </div>

          {order ? (
            <>
              <div className="space-y-4 mb-8">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold">{item.quantity}x {item.product_name}</span>
                    </div>
                    <span className="font-mono text-[#1A1208]/60">{formatCurrency(Number(item.line_total))}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(26,18,8,0.12)' }}>
                <div className="flex justify-between items-center text-[#1A1208]/60">
                  <span className="text-sm">Order Status</span>
                  <span className="font-mono text-sm uppercase">{order.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-headline text-xl">Total paid</span>
                  <span className="font-mono text-xl font-bold">{formatCurrency(Number(order.total), payment?.currency ?? 'USD')}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-[#1A1208]/5 p-5 text-sm text-[#1A1208]/70">
              Your order row has not been created yet. This usually means Stripe has not finished confirming the payment, or the webhook has not reached the app yet.
            </div>
          )}

          {paymentMetadata.card ? (
            <div className="mt-8 flex items-center gap-3 bg-[#1A1208]/5 p-4 rounded-lg">
              <span className="text-sm text-[#1A1208]/60 capitalize">
                {paymentMetadata.card.brand} ending in {paymentMetadata.card.last4}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Link href="/orders" className="flex-1 amber-glow text-on-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all">
            View Orders
          </Link>
          <Link href="/menu" className="flex-1 bg-surface-container-high text-on-surface py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-surface-bright active:scale-[0.98] transition-all">
            Back to Menu
          </Link>
        </div>

        {isProcessing ? (
          <p className="mt-6 text-sm text-on-surface/40 text-center">
            If this page stays in processing state after a successful test payment, the Stripe webhook is the next thing to check.
          </p>
        ) : null}
      </main>
    </>
  )
}
