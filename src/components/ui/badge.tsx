import { X } from "lucide-react";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const badgeVariants = tv({
  base: "inline-flex items-center gap-1.5 whitespace-nowrap border px-2.5 py-0.5 text-xs font-semibold data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    variant: {
      solid: "border-transparent text-white shadow-sm hover:opacity-90",
      soft: "border-transparent",
      outline: "bg-transparent shadow-sm",
      ghost: "border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground",
      // Legacy/Semantic mapping
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    },
    color: {
      neutral: "",
      primary: "",
      success: "",
      warning: "",
      error: "",
      info: "",
      violet: "",
      indigo: "",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
      theme: "rounded-[var(--theme-radius-button)]",
    },
    size: {
      sm: "h-5 px-2 text-[10px]",
      md: "h-6 px-2.5 text-xs",
      lg: "h-7 px-3 text-sm",
    },
  },
  compoundVariants: [
    // --- SOLID VARIANTS ---
    { variant: "solid", color: "neutral", class: "bg-slate-500 dark:bg-slate-600" }, // Pending (Gray)
    { variant: "solid", color: "primary", class: "bg-primary text-primary-foreground" },
    { variant: "solid", color: "success", class: "bg-emerald-600 dark:bg-emerald-600" }, // Paid (Green)
    { variant: "solid", color: "error", class: "bg-rose-600 dark:bg-rose-600" }, // Declined (Red)
    { variant: "solid", color: "warning", class: "bg-orange-500 dark:bg-orange-600" }, // Refunded (Orange)
    { variant: "solid", color: "info", class: "bg-blue-600 dark:bg-blue-600" },
    { variant: "solid", color: "violet", class: "bg-violet-600 dark:bg-violet-600" },

    // --- SOFT VARIANTS ---
    {
      variant: "soft",
      color: "neutral",
      class: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200",
    },
    { variant: "soft", color: "primary", class: "bg-primary/10 text-primary hover:bg-primary/20" },
    {
      variant: "soft",
      color: "success",
      class:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-200/50",
    }, // Online
    {
      variant: "soft",
      color: "error",
      class:
        "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 hover:bg-rose-200/50",
    }, // Offline
    {
      variant: "soft",
      color: "warning",
      class:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 hover:bg-amber-200/50",
    },
    {
      variant: "soft",
      color: "info",
      class:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-200/50",
    }, // Web Design
    {
      variant: "soft",
      color: "violet",
      class:
        "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 border-violet-200 dark:border-violet-500/20 hover:bg-violet-200/50",
    },
    {
      variant: "soft",
      color: "indigo",
      class:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-200/50",
    },

    // --- OUTLINE VARIANTS ---
    {
      variant: "outline",
      color: "neutral",
      class: "border-slate-200 text-slate-900 dark:border-slate-700 dark:text-slate-300",
    }, // Countries
    {
      variant: "outline",
      color: "success",
      class: "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400",
    },
    {
      variant: "outline",
      color: "error",
      class: "border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-400",
    },
    {
      variant: "outline",
      color: "info",
      class: "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400",
    },
  ],
  defaultVariants: {
    variant: "solid",
    color: "primary",
    radius: "theme",
    size: "md",
  },
});

export type BadgeProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean;
    onClose?: () => void;
    icon?: React.ReactNode;
  };

function Badge({
  className,
  variant,
  color,
  radius,
  size,
  dot,
  onClose,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, color, radius, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "relative flex h-1.5 w-1.5 rounded-full shrink-0",
            // Dot colors map mostly to background of solid variants or text of soft variants
            color === "success" && "bg-emerald-500",
            color === "error" && "bg-rose-500",
            color === "warning" && "bg-amber-500",
            color === "info" && "bg-blue-500",
            color === "neutral" && "bg-slate-400",
            color === "primary" && "bg-primary-foreground/50", // if solid primary, dot not visible usually? For soft primary, bg-primary
            (variant === "soft" || variant === "outline" || variant === "ghost") &&
              color === "primary" &&
              "bg-primary",
            // Use currentColor fallback
            !color && "bg-current",
          )}
        >
          {/* Optional: Add ping effect if 'live' or needs attention? For now just static per image */}
        </span>
      )}

      {icon && <span className="shrink-0">{icon}</span>}

      <span>{children}</span>

      {onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 shrink-0"
        >
          <X size={10} />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  );
}

// Backward compatibility helper components (preserving old exports)
function StatusBadge({ status }: { status: string }) {
  // Map legacy unique status keys to new system
  const map: Record<string, BadgeProps> = {
    Pending: { variant: "solid", color: "neutral" },
    Live: { variant: "soft", color: "success", dot: true },
    Completed: { variant: "outline", color: "success" },
    Active: { variant: "soft", color: "success" },
    Draft: { variant: "soft", color: "neutral" },
    Easy: { variant: "soft", color: "success" },
    Medium: { variant: "soft", color: "warning" },
    Hard: { variant: "soft", color: "error" },
    Available: { variant: "soft", color: "info" },
    Hired: { variant: "soft", color: "violet" },
    Rejected: { variant: "soft", color: "error" },
    Interviewing: { variant: "soft", color: "warning" },
    Pass: { variant: "soft", color: "success" },
    Fail: { variant: "soft", color: "error" },
  };

  const props = map[status] || { variant: "secondary" };

  return <Badge {...props}>{status}</Badge>;
}

export { Badge, badgeVariants, StatusBadge };
