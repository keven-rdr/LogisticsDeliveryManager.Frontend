import { forwardRef, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tableCellVariants = tv({
  base: "block",
  variants: {
    variant: {
      default: "text-slate-900 dark:text-slate-100",
      primary: "font-medium text-slate-900 dark:text-slate-100",
      secondary: "text-slate-600 dark:text-slate-400",
      muted: "text-slate-500 dark:text-slate-500",
      code: "font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
    maxWidth: {
      sm: "max-w-xs",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    truncate: false,
    maxWidth: "none",
  },
});

export interface TableCellProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tableCellVariants> {
  children: ReactNode;
  emptyText?: string;
}

const TableCell = forwardRef<HTMLSpanElement, TableCellProps>(
  ({ className, variant, size, truncate, maxWidth, children, emptyText = "—", ...props }, ref) => {
    const isEmpty = children === null || children === undefined || children === "";

    return (
      <span
        ref={ref}
        className={tableCellVariants({ variant, size, truncate, maxWidth, className })}
        title={typeof children === "string" ? children : undefined}
        {...props}
      >
        {isEmpty ? emptyText : children}
      </span>
    );
  },
);

TableCell.displayName = "TableCell";

export { TableCell, tableCellVariants };
