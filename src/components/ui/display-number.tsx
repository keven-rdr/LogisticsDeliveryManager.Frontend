import * as React from "react";
import { useFormatCurrency, useFormatNumber } from "@/hooks/use-format-mask";
import { cn } from "@/lib/utils";

interface DisplayCurrencyProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | string | null | undefined;
  currency?: string;
  locale?: string;
  fallback?: string;
}

/**
 * DisplayCurrency - Displays a formatted currency value
 *
 * @example
 * ```tsx
 * <DisplayCurrency value={1234.56} />
 * <DisplayCurrency value={1234.56} currency="USD" locale="en-US" />
 * ```
 */
const DisplayCurrency = React.forwardRef<HTMLSpanElement, DisplayCurrencyProps>(
  ({ value, currency = "BRL", locale = "pt-BR", fallback = "—", className, ...props }, ref) => {
    const { formatCurrency } = useFormatCurrency({ currency, locale });

    const formattedValue = formatCurrency(value);

    return (
      <span ref={ref} className={cn(className)} {...props}>
        {formattedValue === "—" ? fallback : formattedValue}
      </span>
    );
  },
);
DisplayCurrency.displayName = "DisplayCurrency";

interface DisplayNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | string | null | undefined;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  fallback?: string;
}

/**
 * DisplayNumber - Displays a formatted number value
 *
 * @example
 * ```tsx
 * <DisplayNumber value={1234567} />
 * <DisplayNumber value={1234.5678} minimumFractionDigits={2} maximumFractionDigits={2} />
 * ```
 */
const DisplayNumber = React.forwardRef<HTMLSpanElement, DisplayNumberProps>(
  (
    {
      value,
      locale = "pt-BR",
      minimumFractionDigits,
      maximumFractionDigits,
      fallback = "—",
      className,
      ...props
    },
    ref,
  ) => {
    const { formatNumber } = useFormatNumber({
      locale,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    const formattedValue = formatNumber(value);

    return (
      <span ref={ref} className={cn(className)} {...props}>
        {formattedValue === "—" ? fallback : formattedValue}
      </span>
    );
  },
);
DisplayNumber.displayName = "DisplayNumber";

interface DisplayPercentProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | string | null | undefined;
  locale?: string;
  fractionDigits?: number;
  fallback?: string;
}

/**
 * DisplayPercent - Displays a formatted percentage value
 *
 * @example
 * ```tsx
 * <DisplayPercent value={75} /> // 75%
 * <DisplayPercent value={33.33} fractionDigits={2} /> // 33.33%
 * ```
 */
const DisplayPercent = React.forwardRef<HTMLSpanElement, DisplayPercentProps>(
  ({ value, locale = "pt-BR", fractionDigits = 0, fallback = "—", className, ...props }, ref) => {
    const { formatPercent } = useFormatNumber({ locale });

    const formattedValue = formatPercent(value, fractionDigits);

    return (
      <span ref={ref} className={cn(className)} {...props}>
        {formattedValue === "—" ? fallback : formattedValue}
      </span>
    );
  },
);
DisplayPercent.displayName = "DisplayPercent";

export { DisplayCurrency, DisplayNumber, DisplayPercent };
export type { DisplayCurrencyProps, DisplayNumberProps, DisplayPercentProps };
