import { Search, X } from "lucide-react";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface InputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
  ({ className, value, onClear, onChange, ...props }, ref) => {
    const hasValue = !!value && String(value).length > 0;

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClear?.();
    };

    return (
      <div className="relative w-full group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none">
          <Search className="h-4 w-4" />
        </div>
        <Input
          className={cn("pl-10", hasValue && "pr-10", className)}
          value={value}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        {hasValue && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Limpar</TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  },
);

InputSearch.displayName = "InputSearch";

export { InputSearch };
