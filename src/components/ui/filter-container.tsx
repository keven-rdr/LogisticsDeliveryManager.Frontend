import { Check, Filter, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface FilterContainerProps {
  children: ReactNode;
  onApply: () => void;
  onClear: () => void;
  appliedCount: number;
  isDirty?: boolean;
  className?: string;
  mediaQuery?: string;
}

export function FilterContainer({
  children,
  onApply,
  onClear,
  appliedCount,
  isDirty = false,
  className,
  mediaQuery = "(max-width: 1024px)",
}: FilterContainerProps) {
  const { t } = useTranslation("common");
  const isMobile = useMediaQuery(mediaQuery);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onApply();
    setIsOpen(false);
  };

  const handleClear = () => {
    onClear();
  };

  if (isMobile) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="sm"
          className="relative h-9 px-3 gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Filter size={16} className="text-zinc-500" />
          <span>{t("filter.title")}</span>
          {appliedCount > 0 && (
            <Badge
              variant="solid"
              color="primary"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] border-2 border-white dark:border-zinc-900"
            >
              {appliedCount}
            </Badge>
          )}
        </Button>

        {appliedCount > 0 && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleClear}
            className="h-8 w-8 text-zinc-400 hover:text-zinc-600"
          >
            <X size={14} />
          </Button>
        )}

        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={t("filter.title")}
          width="w-[85%] sm:w-[400px]"
          footer={
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={handleClear}>
                {t("filter.clear")}
              </Button>
              <Button className="flex-1 gap-2" onClick={handleApply}>
                <Check size={16} />
                {t("filter.apply")}
              </Button>
            </div>
          }
        >
          <div className="p-6 space-y-6">{children}</div>
        </Drawer>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6 py-4 px-1", className)}>
      <div className="flex flex-1 items-center gap-4 flex-wrap">{children}</div>
      <div className="flex items-center justify-end gap-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-zinc-500 hover:text-zinc-700"
          disabled={appliedCount === 0 && !isDirty}
        >
          {t("filter.clear")}
        </Button>
        <Button size="sm" onClick={handleApply} className="gap-2 px-8" disabled={!isDirty}>
          <Check size={16} />
          {t("filter.apply")}
        </Button>
      </div>
    </div>
  );
}
