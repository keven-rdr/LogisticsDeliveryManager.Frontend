import * as React from "react";
import { DATE_PATTERNS, type DatePattern, useFormatDate } from "@/hooks/use-format-date";
import { cn } from "@/lib/utils";

interface DisplayDateProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | Date | null | undefined;
  pattern?: DatePattern;
  fallback?: string;
}

/**
 * DisplayDate - Displays a formatted date value
 *
 * @example
 * ```tsx
 * <DisplayDate value={data.createdAt} pattern="dateTimeAt" />
 * <DisplayDate value={data.updatedAt} pattern="relative" />
 * <DisplayDate value={data.date} pattern="short" />
 * ```
 */
const DisplayDate = React.forwardRef<HTMLSpanElement, DisplayDateProps>(
  ({ value, pattern = "dateTimeAt", fallback, className, ...props }, ref) => {
    const { formatDate } = useFormatDate({ fallback });

    const formattedValue = formatDate(value, pattern);

    return (
      <span ref={ref} className={cn(className)} {...props}>
        {formattedValue}
      </span>
    );
  },
);
DisplayDate.displayName = "DisplayDate";

export { DisplayDate, DATE_PATTERNS };
export type { DisplayDateProps, DatePattern };
