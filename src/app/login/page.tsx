import type { Metadata } from "next";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import SocialLogins from "@/components/SocialLogins";

/* ─────────────────────────────────────────────
   Login Page
   Split-screen: dark branding left, warm form right
   Amber gradient CTA, ghost-border inputs, no solid borders
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Login | Jennifer's Café Management",
  description: "Sign in to your Jennifer's Café account to manage orders, reservations, and subscriptions.",
};

/* Eye icon for password visibility toggle */
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout headline="Welcome back.">
      {/* Header */}
      <div className="space-y-2 mb-10">
        <h2 className="font-headline text-3xl md:text-4xl text-stone-900 font-semibold tracking-tight">
          Good to see you again
        </h2>
        <p className="text-stone-500 font-body">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary-container font-semibold hover:underline underline-offset-4 transition-all"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-label font-medium text-stone-700 tracking-wide block"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="jennifer@cafe.com"
            className="w-full h-12 px-4 bg-stone-100 rounded-lg text-stone-900 placeholder:text-stone-400 font-body outline-none ring-1 ring-transparent focus:ring-primary-container/30 focus:bg-white transition-all"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="text-sm font-label font-medium text-stone-700 tracking-wide block"
            >
              Password
            </label>
            <Link
              href="#"
              className="text-xs font-label text-stone-500 hover:text-primary-container transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full h-12 px-4 pr-12 bg-stone-100 rounded-lg text-stone-900 placeholder:text-stone-400 font-body outline-none ring-1 ring-transparent focus:ring-primary-container/30 focus:bg-white transition-all"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label="Toggle password visibility"
            >
              <EyeIcon />
            </button>
          </div>
        </div>

        {/* Primary CTA — amber gradient */}
        <button
          type="submit"
          className="w-full h-14 amber-glow text-on-primary font-bold rounded-xl shadow-lg shadow-primary-container/20 hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.98] font-body text-lg cursor-pointer"
        >
          Log In
        </button>
      </form>

      <SocialLogins />
    </AuthLayout>
  );
}
