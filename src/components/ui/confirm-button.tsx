import { AlertCircle, AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmButtonProps {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  children: ReactNode;
  variant?: "info" | "warn" | "destructive" | "success";
  confirmText?: string;
  cancelText?: string;
  cancelVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ConfirmButton({
  title,
  message,
  onConfirm,
  onCancel,
  onOpenChange,
  children,
  variant = "info",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  cancelVariant = "ghost",
  open: controlledOpen,
  isLoading: externalLoading,
  disabled,
}: ConfirmButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const isLoading = externalLoading ?? internalLoading;

  const handleOpenChange = (value: boolean) => {
    if (isLoading) return;
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      handleOpenChange(false);
    } catch {
      // Error handling is expected to be done in onConfirm
    } finally {
      setInternalLoading(false);
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warn":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "destructive":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "warn":
        return "bg-amber-600 hover:bg-amber-700 text-white";
      case "destructive":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-full p-2 border",
                variant === "info" &&
                  "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900",
                variant === "warn" &&
                  "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900",
                variant === "destructive" &&
                  "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900",
                variant === "success" &&
                  "bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900",
              )}
            >
              {getIcon()}
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant={cancelVariant} onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            className={cn(getConfirmButtonStyle())}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
