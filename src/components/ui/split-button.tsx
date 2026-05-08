import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SplitButtonProps extends ButtonProps {
  onMainAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  menuContent: React.ReactNode;
  menuAlign?: "start" | "end" | "center";
}

export function SplitButton({
  children,
  onMainAction,
  menuContent,
  className,
  menuAlign = "end",
  variant = "outline",
  size = "default",
  disabled,
  ...props
}: SplitButtonProps) {
  return (
    <DropdownMenu>
      <div
        className={cn(
          buttonVariants({ variant, size, className }),
          "p-0 gap-0",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        <button
          className={cn(
            "flex items-center justify-center h-full px-3 rounded-l-md hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Adjust padding based on size if needed, but px-3 is generally safe for default/sm
          )}
          onClick={onMainAction}
          disabled={disabled}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>

        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center h-full px-2 rounded-r-md hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={disabled}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align={menuAlign}>{menuContent}</DropdownMenuContent>
    </DropdownMenu>
  );
}
