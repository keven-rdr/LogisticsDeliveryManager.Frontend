import * as React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { cn } from "@/lib/utils";

export interface InputMonetaryProps extends Omit<NumericFormatProps, "onChange" | "onBlur"> {
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  bankingMode?: boolean;
  debounce?: number;
}

const InputMonetary = React.forwardRef<HTMLInputElement, InputMonetaryProps>(
  ({ className, onChange, onBlur, bankingMode, debounce, ...props }, ref) => {
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <NumericFormat
        getInputRef={ref}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        onBlur={onBlur}
        onValueChange={(values) => {
          const getValue = () => {
            if (bankingMode) {
              const digits = values.value.replace(/\D/g, "");
              const cents = parseInt(digits || "0", 10);
              return cents / 100;
            }
            return values.floatValue ?? 0;
          };

          const newValue = getValue();

          if (debounce && debounce > 0) {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
              onChange?.(newValue);
            }, debounce);
          } else {
            onChange?.(newValue);
          }
        }}
        className={cn(
          "flex w-full px-3 py-2 theme-input file:border-0 file:bg-transparent file:font-medium disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          "border border-border bg-input text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "ring-offset-background",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:placeholder:text-destructive aria-[invalid=true]:focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);

InputMonetary.displayName = "InputMonetary";

export { InputMonetary };
