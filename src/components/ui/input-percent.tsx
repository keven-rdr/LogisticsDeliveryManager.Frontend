import * as React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { cn } from "@/lib/utils";

export interface InputPercentProps extends Omit<NumericFormatProps, "onChange"> {
  onChange?: (value: number | undefined) => void;
}

const InputPercent = React.forwardRef<HTMLInputElement, InputPercentProps>(
  ({ className, onChange, ...props }, ref) => {
    return (
      <NumericFormat
        getInputRef={ref}
        suffix=" %"
        decimalSeparator=","
        thousandSeparator="."
        decimalScale={2}
        allowNegative={false}
        onValueChange={(values) => {
          onChange?.(values.floatValue ?? 0);
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

InputPercent.displayName = "InputPercent";

export { InputPercent };
