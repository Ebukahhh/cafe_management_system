import { type InputHTMLAttributes, forwardRef, useId } from "react";

/* ─────────────────────────────────────────────
   Input — Design System Component

   Per design.md §5 "Inputs & Fields":
   • 8px radius (md), surface-container-highest background
   • Focus: no thick glowing ring — subtle outline shift
     with 1px "Ghost Border" at 40% opacity
   • Accessible label via <label> element
   ───────────────────────────────────────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error = false, className = "", id: externalId, ...props }, ref) => {
    const autoId = useId();
    const inputId = externalId ?? autoId;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="font-label text-sm text-on-surface/70 tracking-wide"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-describedby={hintId}
          aria-invalid={error || undefined}
          className={[
            /* Base */
            "w-full rounded-md bg-surface-container-highest",
            "px-4 py-3 text-on-surface font-body text-base",
            "placeholder:text-on-surface/40",

            /* Focus — ghost border, no glow ring */
            "outline-none",
            "ring-1 ring-transparent",
            "focus:ring-outline-variant/40",
            "transition-all duration-200",

            /* Error state */
            error ? "ring-red-500/60" : "",

            className,
          ].join(" ")}
          {...props}
        />

        {hint && (
          <p
            id={hintId}
            className={`text-xs font-label ${error ? "text-red-400" : "text-on-surface/50"}`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
