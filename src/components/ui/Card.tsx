import { type HTMLAttributes, forwardRef } from "react";

/* ─────────────────────────────────────────────
   Card — Design System Component

   Per design.md §5 "Cards & Lists":
   • 10px radius (DEFAULT), strictly no dividers or borders
   • Depth via tonal background layering, not shadows
   • 32–40px vertical white space to separate content groups
   • Hover lifts surface tier (surface-container → surface-container-high)
   ───────────────────────────────────────────── */

type CardVariant = "default" | "elevated" | "glass";

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  as?: "div" | "article" | "section" | "aside";
}

const variantStyles: Record<CardVariant, string> = {
  default: [
    "bg-surface-container-low",
    "hover:bg-surface-container",
    "transition-colors duration-300",
  ].join(" "),

  elevated: [
    "bg-surface-container",
    "hover:bg-surface-container-high",
    "ambient-shadow",
    "transition-all duration-300",
  ].join(" "),

  glass: [
    "glass-card",
    "transition-all duration-300",
  ].join(" "),
};

const Card = forwardRef<HTMLElement, CardProps>(
  ({ variant = "default", as: Tag = "article", className = "", children, ...props }, ref) => {
    return (
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={`${variantStyles[variant]} rounded-[10px] p-8 text-on-surface ${className}`}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Card.displayName = "Card";

export { Card };
export type { CardProps, CardVariant };
