import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SocialLogins from "@/components/SocialLogins";

export const metadata: Metadata = {
  title: "Login | Jennifer's Café Management",
  description: "Sign in to your Jennifer's Café account to manage orders, reservations, and subscriptions.",
};

export default function LoginPage() {
  return (
    <AuthLayout headline="Welcome back.">
      <div className="space-y-2 mb-10">
        <h2 className="font-headline text-3xl md:text-4xl text-stone-900 font-semibold tracking-tight">
          Good to see you again
        </h2>
        <p className="text-stone-500 font-body">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-primary-container font-semibold hover:underline underline-offset-4 transition-all"
          >
            Sign up
          </a>
        </p>
      </div>

      <Suspense fallback={<div className="min-h-[200px] rounded-xl bg-stone-50 animate-pulse" aria-hidden />}>
        <LoginForm />
      </Suspense>

      <SocialLogins />
    </AuthLayout>
  );
}
