import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  active: boolean;
  className?: string;
}

export function StatusBadge({ active, className }: StatusBadgeProps) {
  const { t } = useTranslation("common");

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        active ? "bg-emerald-700 text-white" : "bg-red-800 text-white",
        className,
      )}
    >
      {active ? t("status.active") : t("status.inactive")}
    </span>
  );
}
