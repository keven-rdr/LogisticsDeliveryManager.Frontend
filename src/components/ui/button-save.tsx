import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface ButtonSaveProps extends Omit<ButtonProps, "type"> {
  label?: string;
  isLoading?: boolean;
}

const ButtonSave = forwardRef<HTMLButtonElement, ButtonSaveProps>(
  ({ label, isLoading = false, children, disabled, ...props }, ref) => {
    const { t } = useTranslation("common");

    return (
      <Button ref={ref} type="submit" size="default" disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children || label || t("save")}
      </Button>
    );
  },
);

ButtonSave.displayName = "ButtonSave";

export { ButtonSave };
