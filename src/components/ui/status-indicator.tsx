import { Badge } from "@/components/ui/badge";

export interface StatusIndicatorProps {
  active: boolean;
  activeText?: string;
  inactiveText?: string;
}

export function StatusIndicator({
  active,
  activeText = "Ativo",
  inactiveText = "Inativo",
}: StatusIndicatorProps) {
  return (
    <Badge variant="soft" color={active ? "success" : "neutral"} dot={active}>
      {active ? activeText : inactiveText}
    </Badge>
  );
}
