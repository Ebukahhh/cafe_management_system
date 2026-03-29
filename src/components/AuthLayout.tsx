import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────
   AuthLayout — Shared layout for Login & Signup
   Split-screen: dark branding left, warm form right
   Design rules: No borders, glassmorphism testimonial,
   Fraunces headlines, tonal layering
   ───────────────────────────────────────────── */

/* Icon components */
function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Headline for the left branding panel */
  headline?: string;
}

export default function AuthLayout({
  children,
  headline = "Welcome back.",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full">
      {/* ── LEFT PANEL: Dark branding ── */}
      <section className="hidden lg:flex lg:w-1/2 bg-deep-espresso items-center justify-center relative overflow-hidden">
        {/* Ambient color blobs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-container/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-surface-variant/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          {/* Decorative coffee image — grayscale with hover reveal */}
          <div className="w-full aspect-square mb-12 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/20 to-transparent rounded-full blur-2xl" />
            <div className="w-80 h-80 rounded-full overflow-hidden relative">
              <Image
                src="/images/coffee-steam.png"
                alt="Coffee steam artistry"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="320px"
              />
            </div>
          </div>

          <h1 className="font-headline text-5xl xl:text-6xl text-on-surface mb-6 tracking-tight leading-tight">
            {headline}
          </h1>
          <p className="font-body text-on-surface/50 text-lg leading-relaxed max-w-sm">
            Refining the art of the brew with digital precision and artisanal soul.
          </p>
        </div>

        {/* Testimonial glass card */}
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <div className="glass-card p-6 rounded-xl max-w-sm">
            {/* Stars */}
            <div className="flex gap-1 mb-3 text-primary">
              <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
            </div>
            <p className="text-on-surface/70 italic mb-4 text-sm leading-relaxed font-body">
              &ldquo;The most seamless ordering experience I&apos;ve ever used.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                <Image
                  src="/images/testimonial-portrait.png"
                  alt="Sarah J."
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="font-label text-xs uppercase tracking-widest text-primary">
                Sarah J.
              </span>
            </div>
          </div>
        </div>

        {/* Version label — editorial detail */}
        <div className="absolute bottom-12 right-12 font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface/20 flex items-center gap-2">
          <span className="w-8 h-[1px] bg-on-surface/10" />
          Specialty Management v.2.4
        </div>
      </section>

      {/* ── RIGHT PANEL: Warm off-white form area ── */}
      <section className="w-full lg:w-1/2 bg-[#FFFDF9] flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto">
        {/* Mobile brand header */}
        <div className="lg:hidden mb-8 self-start">
          <Link href="/" className="font-headline text-3xl text-primary-container font-bold italic">
            Jennifer&apos;s Café
          </Link>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Footer links */}
        <footer className="mt-auto pt-8 flex gap-6">
          <Link href="#" className="font-label text-[10px] uppercase tracking-widest text-stone-400 hover:text-primary-container transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="font-label text-[10px] uppercase tracking-widest text-stone-400 hover:text-primary-container transition-colors">
            Terms of Service
          </Link>
        </footer>
      </section>
    </div>
  );
}
