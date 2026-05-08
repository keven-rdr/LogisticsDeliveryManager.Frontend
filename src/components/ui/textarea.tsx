import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = true, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustHeight = React.useCallback(() => {
      const textarea = internalRef.current;
      if (textarea && autoResize) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [autoResize]);

    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight]);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustHeight();
      onChange?.(e);
    };

    return (
      <textarea
        className={cn(
          // Base styles with density-aware font
          "flex min-h-[80px] w-full px-3 py-2 theme-text-sm disabled:cursor-not-allowed disabled:opacity-50",
          autoResize ? "resize-none overflow-hidden" : "resize-y",
          // Theme-aware styles
          "rounded-input",
          "border border-border bg-input text-foreground",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Focus states
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "ring-offset-background",
          // Validation states
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:placeholder:text-destructive aria-[invalid=true]:focus-visible:ring-destructive",
          className,
        )}
        ref={(element) => {
          (internalRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
          if (typeof ref === "function") ref(element);
          else if (ref)
            (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
        }}
        onChange={handleOnChange}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
