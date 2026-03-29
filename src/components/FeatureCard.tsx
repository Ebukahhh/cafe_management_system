/* ─────────────────────────────────────────────
   FeatureCard — Inline component for Features Strip
   Fraunces headline, DM Sans description.
   Icon in tonal circle. No borders.
   ───────────────────────────────────────────── */

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-primary text-3xl">
        {icon}
      </div>
      <h3 className="font-headline text-2xl md:text-3xl font-bold">{title}</h3>
      <p className="text-surface-variant leading-relaxed text-lg font-body">{description}</p>
    </div>
  );
}
