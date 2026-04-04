import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLayout from "@/components/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import SocialLogins from "@/components/SocialLogins";

export const metadata: Metadata = {
  title: "Sign Up | Jennifer's Café Management System",
  description: "Create your Jennifer's Café account to start ordering specialty coffee, booking tables, and managing subscriptions.",
};

export default function SignupPage() {
  return (
    <AuthLayout headline="Great coffee deserves a great experience.">
      <div className="space-y-2 mb-8">
        <h2 className="font-headline text-3xl md:text-4xl text-stone-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-stone-500 font-body">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary-container font-semibold hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Log in
          </a>
        </p>
      </div>

      <Suspense fallback={<div className="min-h-[320px] rounded-xl bg-stone-50 animate-pulse" aria-hidden />}>
        <SignupForm />
      </Suspense>

      <SocialLogins />
    </AuthLayout>
  );
}
