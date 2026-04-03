import Link from 'next/link'

export default function UnauthorisedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-deep-espresso px-6 text-center text-on-surface">
      <h1 className="font-headline text-2xl font-bold">Access denied</h1>
      <p className="max-w-md text-sm text-on-surface/70">
        You don&apos;t have permission to view this page. If you believe this is a mistake, contact an administrator.
      </p>
      <Link
        href="/"
        className="rounded-full border border-primary px-6 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-[#482400]"
      >
        Back home
      </Link>
    </div>
  )
}
