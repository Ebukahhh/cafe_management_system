import { type ButtonHTMLAttributes, forwardRef } from "react";

/* ─────────────────────────────────────────────
   Button — Design System Component

   Variants per design.md §5 "Buttons & Interaction":
   • primary  — Amber gradient (primary → primary-container), 24px radius, on-primary text
   • secondary — secondary-container bg, 24px radius, no border
   • ghost    — No container, primary text, 2px underline on hover only
   ───────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "amber-glow text-on-primary",
    "font-bold uppercase tracking-wider",
    "active:scale-95",
    "transition-all duration-200",
  ].join(" "),

  secondary: [
    "bg-secondary-container text-on-surface",
    "font-bold",
    "hover:bg-surface-bright",
    "active:scale-95",
    "transition-all duration-200",
  ].join(" "),

  ghost: [
    "bg-transparent text-primary",
    "font-medium",
    "underline-offset-4 decoration-2 decoration-transparent",
    "hover:decoration-primary",
    "transition-all duration-200",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "px-6 py-2.5 text-sm rounded-xl",
  lg: "px-10 py-5 text-lg rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "default", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${variantStyles[variant]} ${sizeStyles[size]} inline-flex items-center justify-center gap-2 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
