import { cn } from "@/lib/utils";

export const RequiredIndicator = ({ className }: { className?: string }) => {
  return <span className={cn("text-red-500 ml-1", className)}>*</span>;
};
