import type { Column, Table } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Pin,
  PinOff,
  RotateCcw,
  Settings2,
} from "lucide-react";
import { useThemeConfig } from "@/components/layout/theme-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnMenuProps<TData> {
  table: Table<TData>;
  enableColumnVisibility?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnPinning?: boolean;
  /** Callback to reset column visibility to default state */
  onResetVisibility?: () => void;
  /** Callback to reset column pinning to default state */
  onResetPinning?: () => void;
  /** Callback to reset column order to default state */
  onResetOrder?: () => void;
}

export function DataTableColumnMenu<TData>({
  table,
  enableColumnVisibility = false,
  enableColumnOrdering = false,
  enableColumnPinning = false,
  onResetVisibility,
  onResetPinning,
  onResetOrder,
}: DataTableColumnMenuProps<TData>) {
  const { typography } = useThemeConfig();

  // Don't render if no features are enabled
  if (!enableColumnVisibility && !enableColumnOrdering && !enableColumnPinning) {
    return null;
  }

  const allColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());

  const moveColumn = (columnId: string, direction: "up" | "down") => {
    const currentOrder = table.getState().columnOrder;
    const order =
      currentOrder.length > 0 ? [...currentOrder] : table.getAllColumns().map((col) => col.id);

    const currentIndex = order.indexOf(columnId);
    if (currentIndex === -1) return;

    const newIndex =
      direction === "up"
        ? Math.max(0, currentIndex - 1)
        : Math.min(order.length - 1, currentIndex + 1);

    if (currentIndex === newIndex) return;

    // Swap positions
    [order[currentIndex], order[newIndex]] = [order[newIndex], order[currentIndex]];
    table.setColumnOrder(order);
  };

  const togglePin = (column: Column<TData>, position: "left" | "right" | false) => {
    column.pin(position);
  };

  const handleResetVisibility = () => {
    if (onResetVisibility) {
      onResetVisibility();
    } else {
      table.resetColumnVisibility();
    }
  };

  const handleResetPinning = () => {
    if (onResetPinning) {
      onResetPinning();
    } else {
      table.resetColumnPinning();
    }
  };

  const handleResetOrder = () => {
    if (onResetOrder) {
      onResetOrder();
    } else {
      table.resetColumnOrder();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Settings2 className="h-4 w-4" />
          <span className={typography.button}>Colunas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Configurar Colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {allColumns.map((column) => {
          const isPinned = column.getIsPinned();
          const headerContent = column.columnDef.header;
          const headerText = typeof headerContent === "string" ? headerContent : column.id;

          return (
            <DropdownMenuSub key={column.id}>
              <DropdownMenuSubTrigger className="gap-2">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <span className="flex-1 truncate">{headerText}</span>
                {isPinned && <Pin className="h-3 w-3 text-theme-primary" />}
                {!column.getIsVisible() && <EyeOff className="h-3 w-3 text-muted-foreground" />}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {/* Visibility Toggle */}
                {enableColumnVisibility && (
                  <DropdownMenuItem
                    onClick={() => column.toggleVisibility(!column.getIsVisible())}
                    className="gap-2"
                  >
                    {column.getIsVisible() ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Exibir
                      </>
                    )}
                  </DropdownMenuItem>
                )}

                {/* Ordering Controls */}
                {enableColumnOrdering && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => moveColumn(column.id, "up")} className="gap-2">
                      <ChevronUp className="h-4 w-4" />
                      Mover para cima
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => moveColumn(column.id, "down")}
                      className="gap-2"
                    >
                      <ChevronDown className="h-4 w-4" />
                      Mover para baixo
                    </DropdownMenuItem>
                  </>
                )}

                {/* Pinning Controls */}
                {enableColumnPinning && column.getCanPin() && (
                  <>
                    <DropdownMenuSeparator />
                    {isPinned ? (
                      <DropdownMenuItem onClick={() => togglePin(column, false)} className="gap-2">
                        <PinOff className="h-4 w-4" />
                        Desfixar
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={() => togglePin(column, "left")}
                          className="gap-2"
                        >
                          <Pin className="h-4 w-4 rotate-[-45deg]" />
                          Fixar à esquerda
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => togglePin(column, "right")}
                          className="gap-2"
                        >
                          <Pin className="h-4 w-4 rotate-45" />
                          Fixar à direita
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}

        {/* Quick Actions */}
        <DropdownMenuSeparator />
        {enableColumnVisibility && (
          <>
            <DropdownMenuItem
              onClick={() => table.toggleAllColumnsVisible(true)}
              className="text-xs gap-2"
            >
              <Eye className="h-4 w-4" />
              Exibir todas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetVisibility} className="text-xs gap-2">
              <RotateCcw className="h-4 w-4" />
              Restaurar padrão
            </DropdownMenuItem>
          </>
        )}

        {enableColumnOrdering && (
          <DropdownMenuItem onClick={handleResetOrder} className="text-xs gap-2">
            <RotateCcw className="h-4 w-4" />
            Restaurar ordem
          </DropdownMenuItem>
        )}

        {enableColumnPinning && (
          <DropdownMenuItem onClick={handleResetPinning} className="text-xs gap-2">
            <PinOff className="h-4 w-4" />
            Desfixar todas
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
