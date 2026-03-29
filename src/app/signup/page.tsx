import type { Metadata } from "next";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import SocialLogins from "@/components/SocialLogins";

/* ─────────────────────────────────────────────
   Signup Page
   Split-screen: dark branding left, warm form right
   More fields: first/last name, email, phone, password, confirm, terms
   Amber gradient CTA, ghost-border inputs
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Sign Up | Jennifer's Café Management System",
  description: "Create your Jennifer's Café account to start ordering specialty coffee, booking tables, and managing subscriptions.",
};

/* Eye-off icon for password visibility toggle */
function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* Shared input class string */
const inputClass =
  "w-full bg-stone-100 rounded-lg px-4 py-3 text-stone-900 font-body outline-none ring-1 ring-transparent focus:ring-primary-container/30 focus:bg-white transition-all placeholder:text-stone-400";

const labelClass =
  "font-label text-[10px] uppercase tracking-widest text-stone-500 font-bold block px-1";

export default function SignupPage() {
  return (
    <AuthLayout headline="Great coffee deserves a great experience.">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <h2 className="font-headline text-3xl md:text-4xl text-stone-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-stone-500 font-body">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary-container font-semibold hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="first-name" className={labelClass}>
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="Jennifer"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="last-name" className={labelClass}>
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="Smith"
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className={labelClass}>
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="jennifer@specialtycoffee.com"
            className={inputClass}
          />
        </div>

        {/* Phone (optional) */}
        <div className="space-y-1.5">
          <div className="flex justify-between px-1">
            <label htmlFor="phone" className={labelClass}>
              Phone number
            </label>
            <span className="font-mono text-[10px] text-stone-400">OPTIONAL</span>
          </div>
          <input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label="Toggle password visibility"
            >
              <EyeOffIcon />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className={labelClass}>
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3 py-2 px-1">
          <div className="relative flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-primary-container rounded focus:ring-primary-container/40 bg-stone-100 cursor-pointer"
            />
          </div>
          <label htmlFor="terms" className="text-xs text-stone-500 leading-tight">
            I agree to the{" "}
            <Link href="#" className="underline hover:text-primary-container transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-primary-container transition-colors">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Primary CTA — amber gradient */}
        <button
          type="submit"
          className="amber-glow w-full py-4 rounded-xl text-on-primary font-bold shadow-lg shadow-primary-container/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          Create Account
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>

      <SocialLogins />
    </AuthLayout>
  );
}
