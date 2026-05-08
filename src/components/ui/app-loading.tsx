import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const iconVariants = tv({
  base: "relative flex items-center justify-center pointer-events-none select-none shrink-0",
  variants: {
    variant: {
      default: "text-zinc-500",
      primary: "text-theme-primary",
      white: "text-white",
      indigo: "text-indigo-600",
      red: "text-red-600",
    },
    size: {
      xs: "w-4 h-4",
      sm: "w-6 h-6",
      base: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-16 h-16",
      xl: "w-24 h-24",
    },
    animation: {
      spinner: "animate-spin",
      pulse: "animate-pulse",
      none: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    animation: "spinner",
  },
});

const labelVariants = tv({
  base: "font-bold whitespace-nowrap",
  variants: {
    size: {
      xs: "text-[10px]",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    variant: {
      default: "text-zinc-500",
      primary: "text-theme-primary",
      secondary: "text-zinc-700 dark:text-zinc-300",
      black: "text-zinc-900 dark:text-zinc-100",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

interface AppLoadingProps {
  className?: string;
  variant?: VariantProps<typeof iconVariants>["variant"];
  size?: VariantProps<typeof iconVariants>["size"];
  type?: VariantProps<typeof iconVariants>["animation"];
  label?: string;
  labelVariant?: VariantProps<typeof labelVariants>["variant"];
  textSize?: VariantProps<typeof labelVariants>["size"];
  fullScreen?: boolean;
  strokeWidth?: number;
  labelClassName?: string;
}

export function AppLoading({
  variant,
  size,
  type = "spinner",
  label,
  labelVariant,
  textSize,
  className,
  fullScreen = false,
  strokeWidth = 3,
  labelClassName,
}: AppLoadingProps) {
  const containerClasses = cn(
    fullScreen &&
      "fixed inset-0 min-h-screen z-[100] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center gap-6",
    !fullScreen && "flex flex-col items-center justify-center gap-3",
    className,
  );

  return (
    <div className={containerClasses}>
      <div className={iconVariants({ variant, size, animation: type })}>
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Carregando"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <circle
            className="opacity-100"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray="62.83185307179586"
            strokeDashoffset="47.12388980384689"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {label && (
        <div className="animate-pulse flex flex-col items-center gap-1.5">
          <p
            className={cn(labelVariants({ size: textSize, variant: labelVariant }), labelClassName)}
          >
            {label}
          </p>
          {!labelClassName && (
            <div className="w-8 h-0.5 bg-theme-primary rounded-full opacity-40" />
          )}
        </div>
      )}
    </div>
  );
}
