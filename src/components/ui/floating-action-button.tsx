import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps extends ButtonProps {
  isHidden?: boolean;
  render?: (props: { isOpen: boolean; onClose: () => void; layoutId?: string }) => React.ReactNode;
  fabLayoutId?: string;
  containerClassName?: string;
  badge?: number | string;
}

export function FloatingActionButton({
  className,
  containerClassName,
  onClick,
  isHidden: externalIsHidden,
  children,
  badge,
  size = "icon",
  radius = "full",
  variant = "default",
  render,
  fabLayoutId = "fab-drawer-morph",
  ...props
}: FloatingActionButtonProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = internalIsOpen;
  const isHidden = externalIsHidden || isOpen;

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setInternalIsOpen(true);
    onClick?.(e);
  };

  const handleClose = () => {
    setInternalIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isHidden && (
          <motion.div
            layoutId={fabLayoutId}
            className={cn("fixed bottom-6 right-6 z-40", containerClassName)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <Button
              size={size}
              radius={radius}
              variant={variant}
              className={cn("shadow-xl relative", size === "icon" && "h-14 w-14", className)}
              onClick={handleOpen}
              {...props}
            >
              {children || <Plus className="h-6 w-6" />}
              {badge !== undefined && (
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
                  {badge}
                </div>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {render?.({
        isOpen,
        onClose: handleClose,
        layoutId: fabLayoutId,
      })}
    </>
  );
}
