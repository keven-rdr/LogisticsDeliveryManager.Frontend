import { AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { forwardRef, useState } from "react";
import type { VariantProps } from "tailwind-variants";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, type ButtonProps, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonConfirmProps
  extends Omit<ButtonProps, "onClick">,
    VariantProps<typeof buttonVariants> {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmVariant?: "info" | "warn" | "destructive";
  confirmText?: string;
  cancelText?: string;
  cancelVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full" | "default";
  confirmLoading?: boolean;
}

export const ButtonConfirm = forwardRef<HTMLButtonElement, ButtonConfirmProps>(
  (
    {
      title,
      message,
      onConfirm,
      onCancel,
      confirmVariant = "info",
      confirmText = "Confirmar",
      cancelText = "Cancelar",
      cancelVariant = "outline",
      className,
      variant,
      size,
      radius,
      isLoading,
      tooltip,
      tooltipPosition,
      disabled,
      children,
      confirmLoading: externalConfirmLoading,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [internalLoading, setInternalLoading] = useState(false);

    const confirmLoading = externalConfirmLoading ?? internalLoading;

    const handleOpenChange = (value: boolean) => {
      if (confirmLoading) return;
      setOpen(value);
    };

    const handleConfirm = async () => {
      try {
        setInternalLoading(true);
        await onConfirm();
        setOpen(false);
      } catch {
        // Error handling is expected to be done in onConfirm
      } finally {
        setInternalLoading(false);
      }
    };

    const getIcon = () => {
      switch (confirmVariant) {
        case "info":
          return <Info className="h-5 w-5 text-blue-500" />;
        case "warn":
          return <AlertTriangle className="h-5 w-5 text-amber-500" />;
        case "destructive":
          return <AlertCircle className="h-5 w-5 text-red-500" />;
      }
    };

    const getConfirmButtonStyle = () => {
      switch (confirmVariant) {
        case "info":
          return "bg-blue-600 hover:bg-blue-700 text-white";
        case "warn":
          return "bg-amber-600 hover:bg-amber-700 text-white";
        case "destructive":
          return "bg-red-600 hover:bg-red-700 text-white";
      }
    };

    return (
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button
            ref={ref}
            className={className}
            variant={variant}
            size={size}
            radius={radius}
            isLoading={isLoading}
            tooltip={tooltip}
            tooltipPosition={tooltipPosition}
            disabled={disabled}
            {...props}
          >
            {children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-full p-2 border",
                  confirmVariant === "info" &&
                    "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900",
                  confirmVariant === "warn" &&
                    "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900",
                  confirmVariant === "destructive" &&
                    "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900",
                )}
              >
                {getIcon()}
              </div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant={cancelVariant} onClick={onCancel} disabled={confirmLoading}>
              {cancelText}
            </AlertDialogCancel>
            <Button
              onClick={handleConfirm}
              className={cn(getConfirmButtonStyle())}
              disabled={confirmLoading}
            >
              {confirmLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);
ButtonConfirm.displayName = "ButtonConfirm";
