import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const switchCardVariants = tv({
  base: "flex flex-row items-center justify-between p-4 transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-input",
  variants: {
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
    },
  },
  defaultVariants: {
    shadow: "none",
  },
});

export interface SwitchCardProps extends VariantProps<typeof switchCardVariants> {
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const SwitchCard = React.forwardRef<HTMLDivElement, SwitchCardProps>(
  (
    { label, description, checked, onCheckedChange, disabled, shadow, className, id, ...props },
    ref,
  ) => {
    const internalId = React.useId();
    const switchId = id || internalId;

    return (
      <div ref={ref} className={cn(switchCardVariants({ shadow }), className)} {...props}>
        <div className="space-y-0.5 pr-4">
          <label
            htmlFor={switchId}
            className="theme-label font-medium text-slate-900 dark:text-slate-100 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          {description && (
            <p className="theme-label text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
        <Switch
          id={switchId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    );
  },
);

SwitchCard.displayName = "SwitchCard";

export { SwitchCard };
