import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FilterFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FilterField({ label, children, className }: FilterFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 flex-1 min-w-[200px]", className)}>
      <Label
        className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pl-0.5"
        htmlFor={label}
      >
        {label}
      </Label>
      <div className="flex-1">{children}</div>
    </div>
  );
}
