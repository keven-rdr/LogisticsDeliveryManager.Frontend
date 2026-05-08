import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeConfig } from "../layout/theme-context";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  showCloseData?: boolean;
  headerAction?: React.ReactNode;
  hideCloseButton?: boolean;
  panelClassName?: string;
  layoutId?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "w-96",
  headerAction,
  hideCloseButton = false,
  extraActions,
  panelClassName,
  layoutId,
}: DrawerProps & { extraActions?: React.ReactNode }) {
  const { typography } = useThemeConfig();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const defaultAnimation = "";

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="drawer-backdrop"
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            key="drawer-panel"
            layoutId={layoutId}
            ref={drawerRef}
            className={cn(
              "fixed right-0 top-0 bottom-0 sm:right-4 sm:top-4 sm:bottom-4 shadow-2xl z-[60] flex flex-col rounded-none sm:rounded-xl",
              "w-full sm:max-w-[calc(100vw-2rem)]",
              width,
              "bg-card border-border border",
              panelClassName || (layoutId ? "" : defaultAnimation),
            )}
            initial={layoutId ? undefined : { x: "100%" }}
            animate={layoutId ? undefined : { x: 0 }}
            exit={layoutId ? undefined : { x: "100%" }}
            transition={layoutId ? undefined : { duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="flex flex-col flex-1 h-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 flex items-start justify-between shrink-0">
                <div className="flex items-start gap-4 flex-1">
                  {headerAction && <div className="mt-1">{headerAction}</div>}
                  <div className="flex-1">
                    <h2 className={cn(typography.h2, "text-foreground")}>{title}</h2>
                    {subtitle && (
                      <p className={cn(typography.small, "text-muted-foreground")}>{subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {extraActions}
                  {!hideCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      radius="full"
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={18} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>

              {footer && <div className="p-6 shrink-0">{footer}</div>}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
