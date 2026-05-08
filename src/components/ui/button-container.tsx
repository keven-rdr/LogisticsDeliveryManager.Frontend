import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ButtonContainer = forwardRef<HTMLDivElement, ButtonContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex justify-end gap-3 pt-6", className)} {...props}>
        {children}
      </div>
    );
  },
);

ButtonContainer.displayName = "ButtonContainer";

export { ButtonContainer };
