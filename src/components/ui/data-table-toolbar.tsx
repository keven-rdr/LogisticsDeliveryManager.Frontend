import type { Column, Table } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Columns3, Eye, Pin, PinOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type ColumnDefWithMeta,
  getColumnHeaderText,
  isSystemColumn,
} from "@/components/ui/data-table-columns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ====================
// Types
// ====================

interface DataTableColumnConfigProps<TData> {
  table: Table<TData>;
  enableColumnVisibility?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnPinning?: boolean;
  onResetVisibility?: () => void;
  onResetPinning?: () => void;
  onResetOrder?: () => void;
}

interface DataTableColumnConfigTriggerProps {
  children?: React.ReactNode;
  className?: string;
  /** Show label text */
  showLabel?: boolean;
}

// ====================
// Main Component
// ====================

export function DataTableColumnConfig<TData>({
  table,
  enableColumnVisibility = true,
  enableColumnOrdering = true,
  enableColumnPinning = true,
  onResetVisibility,
  onResetPinning,
  onResetOrder,
  children,
  className,
  showLabel = true,
}: DataTableColumnConfigProps<TData> & DataTableColumnConfigTriggerProps) {
  // Don't render if no features are enabled
  if (!enableColumnVisibility && !enableColumnOrdering && !enableColumnPinning) {
    return null;
  }

  // Get all configurable columns (exclude system columns)
  const configurableColumns = table.getAllColumns().filter((column) => {
    const colDef = column.columnDef;
    return !isSystemColumn(colDef) && column.getCanHide();
  });

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

    [order[currentIndex], order[newIndex]] = [order[newIndex], order[currentIndex]];
    table.setColumnOrder(order);
  };

  const togglePin = (column: Column<TData, unknown>, position: "left" | "right" | false) => {
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

  const trigger = children || (
    <Button variant="outline" size="sm" className={cn("gap-1.5 h-8 text-sm", className)}>
      <Columns3 className="h-4 w-4" />
      {showLabel && <span>Colunas</span>}
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-auto">
        <DropdownMenuLabel>Configurar Colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Simple visibility toggles */}
        {enableColumnVisibility && (
          <>
            {configurableColumns.map((column) => {
              const headerText = getColumnHeaderText(column.columnDef);

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {headerText}
                </DropdownMenuCheckboxItem>
              );
            })}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Advanced column options (sub-menus) */}
        {(enableColumnOrdering || enableColumnPinning) && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Opções Avançadas
            </DropdownMenuLabel>
            {configurableColumns.map((column) => {
              const isPinned = column.getIsPinned();
              const headerText = getColumnHeaderText(column.columnDef);
              const canOrder = !(column.columnDef as ColumnDefWithMeta<unknown>).meta
                ?.disableOrdering;

              return (
                <DropdownMenuSub key={`adv-${column.id}`}>
                  <DropdownMenuSubTrigger className="gap-2">
                    <span className="flex-1 truncate">{headerText}</span>
                    {isPinned && <Pin className="h-3 w-3 text-theme-primary" />}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {/* Ordering Controls */}
                    {enableColumnOrdering && canOrder && (
                      <>
                        <DropdownMenuItem
                          onClick={() => moveColumn(column.id, "up")}
                          className="gap-2"
                        >
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
                        {enableColumnPinning && <DropdownMenuSeparator />}
                      </>
                    )}

                    {/* Pinning Controls */}
                    {enableColumnPinning &&
                      column.getCanPin() &&
                      (isPinned ? (
                        <DropdownMenuItem
                          onClick={() => togglePin(column, false)}
                          className="gap-2"
                        >
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
                      ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              );
            })}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Quick Actions */}
        {enableColumnVisibility && (
          <>
            <DropdownMenuItem onClick={() => table.toggleAllColumnsVisible(true)} className="gap-2">
              <Eye className="h-4 w-4" />
              Exibir todas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetVisibility} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Restaurar padrão
            </DropdownMenuItem>
          </>
        )}

        {enableColumnOrdering && (
          <DropdownMenuItem onClick={handleResetOrder} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Restaurar ordem
          </DropdownMenuItem>
        )}

        {enableColumnPinning && (
          <DropdownMenuItem onClick={handleResetPinning} className="gap-2">
            <PinOff className="h-4 w-4" />
            Desfixar todas
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ====================
// Selected Rows Info Component
// ====================

interface DataTableSelectionInfoProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function DataTableSelectionInfo<TData>({
  table,
  className,
}: DataTableSelectionInfoProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  if (selectedCount === 0) return null;

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      {selectedCount} de {totalCount} linha(s) selecionada(s)
    </div>
  );
}

// ====================
// Export for backward compatibility
// ====================

export { DataTableColumnConfig as DataTableColumnMenu };
