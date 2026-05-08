import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useThemeConfig } from "@/components/layout/theme-context";
import { cn } from "@/lib/utils";

export function ThemedToaster() {
  const { config } = useThemeConfig();

  // Dismiss existing toasts when style changes to ensure clean state
  useEffect(() => {
    toast.dismiss();
  }, []);

  // Define styles based on config.toastStyle
  const getToastOptions = () => {
    const baseStyle = { borderRadius: "8px" };

    // Common base classes for title and description
    const commonClassNames = {
      description: "group-[.toast]:text-muted-foreground",
      actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
      cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      closeButton:
        "!left-auto !right-1 !top-1 !transform-none !bg-transparent !text-foreground hover:!bg-foreground/10 !border-none",
    };

    if (config.toastStyle === "solid") {
      return {
        style: {
          ...baseStyle,
          border: "none",
        },
        classNames: {
          ...commonClassNames,
          toast: cn(
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            "data-[type=success]:!bg-emerald-600 data-[type=success]:!text-white data-[type=success]:!border-none",
            "data-[type=error]:!bg-rose-600 data-[type=error]:!text-white data-[type=error]:!border-none",
            "data-[type=info]:!bg-blue-600 data-[type=info]:!text-white data-[type=info]:!border-none",
            "data-[type=warning]:!bg-amber-500 data-[type=warning]:!text-white data-[type=warning]:!border-none",
            "data-[type=success]:[class^='sonner-close-icon'] !text-white",
          ),
          closeButton: cn(
            commonClassNames.closeButton,
            "!text-foreground data-[type=success]:!text-white data-[type=error]:!text-white data-[type=info]:!text-white data-[type=warning]:!text-white hover:!bg-black/10 dark:hover:!bg-white/20",
          ),
        },
      };
    }

    if (config.toastStyle === "glass") {
      return {
        style: baseStyle,
        classNames: {
          ...commonClassNames,
          toast: cn(
            "group toast group-[.toaster]:bg-card/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            "data-[type=success]:!border-emerald-500/50 data-[type=success]:!text-emerald-600 dark:data-[type=success]:!text-emerald-400",
            "data-[type=error]:!border-rose-500/50 data-[type=error]:!text-rose-600 dark:data-[type=error]:!text-rose-400",
            "data-[type=info]:!border-blue-500/50 data-[type=info]:!text-blue-600 dark:data-[type=info]:!text-blue-400",
            "data-[type=warning]:!border-amber-500/50 data-[type=warning]:!text-amber-600 dark:data-[type=warning]:!text-amber-400",
          ),
        },
      };
    }

    // Default
    return {
      style: baseStyle,
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        ...commonClassNames,
      },
    };
  };

  const toastOptions = getToastOptions();

  return (
    <Toaster
      key={`${config.toastStyle}-${config.toastCloseButton}`}
      position="top-right"
      richColors={config.toastStyle === "default"}
      closeButton={config.toastCloseButton}
      toastOptions={toastOptions}
    />
  );
}
