import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface ButtonCancelProps extends Omit<ButtonProps, "type" | "variant"> {
  label?: string;
}

const ButtonCancel = forwardRef<HTMLButtonElement, ButtonCancelProps>(
  ({ label, children, ...props }, ref) => {
    const { t } = useTranslation("common");

    return (
      <Button ref={ref} type="button" variant="ghost" size="default" {...props}>
        {children || label || t("cancel")}
      </Button>
    );
  },
);

ButtonCancel.displayName = "ButtonCancel";

export { ButtonCancel };
