import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Context for loading state
const DetailsLoadingContext = React.createContext<boolean>(false);

function useDetailsLoading() {
  return React.useContext(DetailsLoadingContext);
}

// Main Details Container
interface DetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  minLoadingDuration?: number; // Minimum time to show skeleton to prevent flash
}

const Details = React.forwardRef<HTMLDivElement, DetailsProps>(
  ({ className, children, isLoading = false, minLoadingDuration = 500, ...props }, ref) => {
    // Smooth Loading State Logic
    const [showLoading, setShowLoading] = React.useState(isLoading);
    const loadingStartTime = React.useRef<number>(0);
    const loadingTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      if (isLoading) {
        // Start Loading
        loadingStartTime.current = Date.now();
        setShowLoading(true);
        if (loadingTimer.current) clearTimeout(loadingTimer.current);
      } else {
        // Stop Loading (with minimum duration check)
        const elapsed = Date.now() - loadingStartTime.current;
        const remaining = minLoadingDuration - elapsed;

        if (remaining > 0 && showLoading) {
          // If loaded too fast, wait remaining time
          loadingTimer.current = setTimeout(() => {
            setShowLoading(false);
          }, remaining);
        } else {
          // Otherwise stop immediately
          setShowLoading(false);
        }
      }

      return () => {
        if (loadingTimer.current) clearTimeout(loadingTimer.current);
      };
    }, [isLoading, minLoadingDuration, showLoading]); // Remove showLoading from dep array to avoid loops

    return (
      <DetailsLoadingContext.Provider value={showLoading}>
        <div ref={ref} className={cn("space-y-6", className)} {...props}>
          {children}
        </div>
      </DetailsLoadingContext.Provider>
    );
  },
);
Details.displayName = "Details";

// Details Card - Container for a group of fields
interface DetailsCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const DetailsCard = React.forwardRef<HTMLDivElement, DetailsCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-slate-900 rounded-card border border-slate-200 dark:border-slate-800 p-6 shadow-sm",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DetailsCard.displayName = "DetailsCard";

// Details Grid - Grid layout for fields
interface DetailsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
}

const DetailsGrid = React.forwardRef<HTMLDivElement, DetailsGridProps>(
  ({ className, cols = 2, children, ...props }, ref) => {
    const colsClass = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
      <div ref={ref} className={cn("grid gap-6", colsClass[cols], className)} {...props}>
        {children}
      </div>
    );
  },
);
DetailsGrid.displayName = "DetailsGrid";

// Details Section - Optional separator with title
interface DetailsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

const DetailsSection = React.forwardRef<HTMLDivElement, DetailsSectionProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {title && (
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            {title}
          </h3>
        )}
        {children}
      </div>
    );
  },
);
DetailsSection.displayName = "DetailsSection";

// Details Divider
const DetailsDivider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-t border-slate-200 dark:border-slate-800 pt-6", className)}
        {...props}
      />
    );
  },
);
DetailsDivider.displayName = "DetailsDivider";

// Details Field - Individual field container
interface DetailsFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | "full";
}

const DetailsField = React.forwardRef<HTMLDivElement, DetailsFieldProps>(
  ({ className, colSpan, children, ...props }, ref) => {
    const spanClass =
      colSpan === "full" ? "md:col-span-full" : colSpan ? `md:col-span-${colSpan}` : "";

    return (
      <div ref={ref} className={cn("space-y-1", spanClass, className)} {...props}>
        {children}
      </div>
    );
  },
);
DetailsField.displayName = "DetailsField";

// Details Label
interface DetailsLabelProps extends React.HTMLAttributes<HTMLSpanElement> {}

const DetailsLabel = React.forwardRef<HTMLSpanElement, DetailsLabelProps>(
  ({ className, children, ...props }, ref) => {
    const isLoading = useDetailsLoading();

    if (isLoading) {
      return <Skeleton className="h-4 w-24 mb-1" />;
    }

    return (
      <span
        ref={ref}
        className={cn("text-sm font-medium text-slate-700 dark:text-slate-400", className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);
DetailsLabel.displayName = "DetailsLabel";

// Details Value - Text value display
interface DetailsValueProps extends React.HTMLAttributes<HTMLParagraphElement> {
  emptyText?: string;
  size?: "sm" | "base" | "lg";
}

const DetailsValue = React.forwardRef<HTMLParagraphElement, DetailsValueProps>(
  ({ className, children, emptyText = "—", size = "base", ...props }, ref) => {
    const isLoading = useDetailsLoading();

    const sizeClass = {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg font-medium",
    };

    if (isLoading) {
      const skeletonHeight = {
        sm: "h-4",
        base: "h-5",
        lg: "h-6",
      };
      return <Skeleton className={cn(skeletonHeight[size], "w-40 mt-1")} />;
    }

    const isEmpty = children === null || children === undefined || children === "";

    return (
      <p
        ref={ref}
        className={cn(
          "mt-1 text-slate-900 dark:text-slate-100",
          sizeClass[size],
          isEmpty && "text-slate-400 dark:text-slate-500 italic",
          className,
        )}
        {...props}
      >
        {isEmpty ? emptyText : children}
      </p>
    );
  },
);
DetailsValue.displayName = "DetailsValue";

// Details Badge - For status or tags
interface DetailsBadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

const DetailsBadge = React.forwardRef<HTMLDivElement, DetailsBadgeProps>(
  ({ className, children, ...props }, ref) => {
    const isLoading = useDetailsLoading();

    if (isLoading) {
      return <Skeleton className="h-6 w-16 mt-1 rounded-full" />;
    }

    return (
      <div ref={ref} className={cn("mt-1", className)} {...props}>
        {children}
      </div>
    );
  },
);
DetailsBadge.displayName = "DetailsBadge";

export {
  Details,
  DetailsCard,
  DetailsGrid,
  DetailsSection,
  DetailsDivider,
  DetailsField,
  DetailsLabel,
  DetailsValue,
  DetailsBadge,
  useDetailsLoading,
};
