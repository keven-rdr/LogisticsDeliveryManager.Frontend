import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronRight, X } from "lucide-react";
import type { ReactNode } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface SettingsNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  description?: string;
}

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: SettingsNavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
  footerActions?: ReactNode;
  isLoading?: boolean;
}

export function SettingsModal({
  open,
  onOpenChange,
  title,
  items,
  activeTab,
  onTabChange,
  children,
  footerActions,
}: SettingsModalProps) {
  const activeItem = items.find((i) => i.id === activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden gap-0 flex flex-col h-[85vh] border-none shadow-2xl rounded-2xl [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-1 overflow-hidden">
          <nav className="w-80 shrink-0 border-r border-slate-100 bg-white p-3 flex flex-col gap-1 overflow-y-auto">
            {items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-slate-800 hover:bg-slate-100 hover:text-slate-900 font-medium",
                  )}
                >
                  <span
                    className={cn("transition-colors", isActive ? "text-white" : "text-slate-800")}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="flex items-center justify-between px-8 pt-6 pb-0">
              <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                <span>{title}</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-slate-900 font-semibold">{activeItem?.label}</span>
              </div>
              <DialogClose className="rounded-full p-1.5 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>

            <ScrollArea className="flex-1 px-8 py-6">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
              </div>
            </ScrollArea>

            {footerActions && (
              <div className="flex justify-end gap-3 px-8 py-4 bg-white">{footerActions}</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsTab({
  value,
  activeValue,
  children,
}: {
  value: string;
  activeValue: string;
  children: ReactNode;
}) {
  if (value !== activeValue) return null;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 h-full">{children}</div>
  );
}
