// import { cn } from "@/src/lib/cn";
// import { ButtonHTMLAttributes, forwardRef } from "react";
// type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "pro";
// type ButtonSize = "sm" | "md" | "lg";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: ButtonVariant;
//   size?: ButtonSize;
//   fullWidth?: boolean;
//   loading?: boolean;
// }

// const variantStyles: Record<ButtonVariant, string> = {
//   primary:
//     "bg-[var(--color-brand)] text-white shadow-[0_4px_16px_rgba(27,63,160,0.30)] hover:opacity-90 active:scale-[0.98]",

//   secondary:
//     "bg-[var(--color-bg-tint)] text-[var(--color-brand)] border border-[var(--color-sky)]/30 hover:bg-[var(--color-sky)]/10 active:scale-[0.98]",

//   ghost:
//     "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-border)] active:scale-[0.98]",

//   danger:
//     "bg-[var(--color-live)] text-white shadow-[0_4px_12px_rgba(255,59,48,0.25)] hover:opacity-90 active:scale-[0.98]",

//   pro: "bg-[var(--color-violet)] text-white shadow-[0_4px_16px_rgba(124,58,237,0.30)] hover:opacity-90 active:scale-[0.98]",
// };

// const sizeStyles: Record<ButtonSize, string> = {
//   sm: "px-4 py-2 text-sm tracking-[0.06em]",
//   md: "px-5 py-3 text-base tracking-[0.06em]",
//   lg: "px-6 py-4 text-lg tracking-[0.06em]",
// };

// /**
//  * YuvaCrix Button
//  *
//  * Uses Barlow Condensed uppercase for all variants (the CTA typography rule).
//  *
//  * @example
//  * <Button variant="primary" size="lg" fullWidth>START SCORING</Button>
//  * <Button variant="danger">RECORD WICKET</Button>
//  * <Button variant="pro">UPGRADE TO PRO</Button>
//  */
// export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     {
//       variant = "primary",
//       size = "md",
//       fullWidth = false,
//       loading = false,
//       className,
//       children,
//       disabled,
//       ...props
//     },
//     ref,
//   ) => {
//     return (
//       <button
//         type={props.type ?? "button"}
//         ref={ref}
//         disabled={disabled || loading}
//         className={cn(
//           // Base styles — Barlow Condensed uppercase (non-negotiable rule)
//           "font-[family-name:var(--font-display)] font-bold uppercase",
//           "rounded-xl transition-all duration-150",
//           "flex items-center justify-center gap-2",
//           "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none",
//           // Variant & size
//           variantStyles[variant],
//           sizeStyles[size],
//           fullWidth && "w-full",
//           className,
//         )}
//         {...props}
//       >
//         {loading ? (
//           <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//         ) : (
//           children
//         )}
//       </button>
//     );
//   },
// );

// Button.displayName = "Button";

import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "pro"
  | "outline";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-brand)] text-white",
    "shadow-[0_4px_16px_rgba(27,63,160,0.30)]",
    "hover:bg-[#2449b8] hover:shadow-[0_6px_20px_rgba(27,63,160,0.40)]",
    "active:scale-[0.97] active:shadow-none",
  ].join(" "),

  secondary: [
    "bg-[var(--color-bg-tint)] text-[var(--color-brand)]",
    "border border-[var(--color-sky)]/30",
    "hover:bg-[var(--color-sky)]/15 hover:border-[var(--color-sky)]/50",
    "active:scale-[0.97]",
  ].join(" "),

  ghost: [
    "bg-transparent text-[var(--color-text-secondary)]",
    "hover:bg-[var(--color-bg-border)] hover:text-[var(--color-text-primary)]",
    "active:scale-[0.97]",
  ].join(" "),

  danger: [
    "bg-[var(--color-live)] text-white",
    "shadow-[0_4px_12px_rgba(255,59,48,0.25)]",
    "hover:bg-[#e02d23] hover:shadow-[0_6px_16px_rgba(255,59,48,0.35)]",
    "active:scale-[0.97] active:shadow-none",
  ].join(" "),

  pro: [
    "bg-[var(--color-violet)] text-white",
    "shadow-[0_4px_16px_rgba(124,58,237,0.30)]",
    "hover:bg-[#6d31d4] hover:shadow-[0_6px_20px_rgba(124,58,237,0.40)]",
    "active:scale-[0.97] active:shadow-none",
  ].join(" "),

  outline: [
    "bg-transparent text-[var(--color-navy)]",
    "border border-[var(--color-bg-border)]",
    "hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-bg-tint)]",
    "active:scale-[0.97]",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  sm: "px-4 py-2 text-sm gap-1.5 rounded-xl",
  md: "px-5 py-3 text-base gap-2 rounded-xl",
  lg: "px-7 py-4 text-lg gap-2.5 rounded-xl",
};

const spinnerSizes: Record<ButtonSize, string> = {
  xs: "w-3 h-3 border",
  sm: "w-3.5 h-3.5 border",
  md: "w-4 h-4 border-2",
  lg: "w-5 h-5 border-2",
};

/**
 * YuvaCrix Button — v2
 *
 * Design rules enforced:
 * - Barlow Condensed uppercase on all variants
 * - Consistent tracking [0.06em]
 * - Smooth hover + active micro-interactions
 * - Loading spinner inherits button color
 *
 * @example
 * <Button variant="primary" size="lg" fullWidth leftIcon={<Zap />}>START SCORING</Button>
 * <Button variant="danger" loading>RECORDING...</Button>
 * <Button variant="pro" size="sm">UPGRADE TO PRO</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        type={props.type ?? "button"}
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base — Barlow Condensed uppercase (non-negotiable CTA rule)
          "font-family-name:(--font-display) font-bold uppercase tracking-[0.06em]",
          "inline-flex items-center justify-center",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sky)] focus-visible:ring-offset-2",
          "select-none",
          // Disabled
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:!transform-none disabled:!shadow-none",
          // Variant, size
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <span
              className={cn(
                "inline-block rounded-full border-current border-t-transparent animate-spin",
                spinnerSizes[size],
              )}
            />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
