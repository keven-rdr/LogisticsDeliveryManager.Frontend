import { ArrowLeft } from "lucide-react";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ButtonBackProps extends Omit<ButtonProps, "type" | "variant"> {
  label?: string;
}

const ButtonBack = forwardRef<HTMLButtonElement, ButtonBackProps>(
  ({ label, children, className, ...props }, ref) => {
    const { t } = useTranslation("common");

    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
          className,
        )}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        {children || label || t("back")}
      </Button>
    );
  },
);

ButtonBack.displayName = "ButtonBack";

export { ButtonBack };
