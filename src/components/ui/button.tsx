import { Loader2 } from "lucide-react";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  variants: {
    variant: {
      default: "btn-primary text-white shadow-lg focus-visible:ring-ring",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive shadow-md",
      success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-md",
      violet:
        "bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-500 shadow-lg",
      outline: "btn-secondary hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring",
      ghost:
        "btn-ghost text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
      link: "text-primary underline-offset-4 hover:underline focus-visible:ring-ring",
      select:
        "w-full justify-start text-left font-normal bg-input border border-border text-foreground hover:bg-input hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background active:scale-100 transition-none theme-input px-3 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
      slate:
        "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500 shadow-md dark:bg-slate-800 dark:hover:bg-slate-700",
    },
    size: {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-9 px-3 text-sm",
      xs: "h-8 px-3 text-xs",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10 p-0",
      "icon-sm": "h-9 w-9 p-0",
      "icon-xs": "h-8 w-8 p-0",
      input: "theme-input px-3 h-auto",
    },
    radius: {
      default: "rounded-button",
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
      input: "rounded-input",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    radius: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  tooltip?: string;
  tooltipPosition?: "top" | "right" | "bottom" | "left";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      asChild = false,
      isLoading = false,
      tooltip,
      tooltipPosition = "top",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const buttonElement = (
      <button
        className={cn(buttonVariants({ variant, size, radius, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-label={props["aria-label"] || tooltip}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
          <TooltipContent side={tooltipPosition}>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return buttonElement;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
