import type { ColumnDef, Row } from "@tanstack/react-table";

export type ColumnDefWithMeta<TData> = ColumnDef<TData, unknown> & {
  meta?: { isSystemColumn?: boolean; disableOrdering?: boolean };
};

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// ====================
// Selection Column Helpers
// ====================

interface CreateSelectionColumnOptions {
  mode?: "checkbox" | "radio";
  /** Position indicator for styling purposes */
  position?: "first" | "last";
}

/**
 * Creates a selection column definition for checkbox or radio selection.
 * This column is configured to NOT be reorderable, resizable, or hideable.
 */
export function createSelectionColumn<TData>(
  options: CreateSelectionColumnOptions = {},
): ColumnDef<TData, unknown> {
  const { mode = "checkbox" } = options;

  if (mode === "radio") {
    return {
      id: "_select",
      header: () => null, // No header for radio (single selection)
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <input
            type="radio"
            name="table-row-selection"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className={cn(
              "h-4 w-4 cursor-pointer",
              "text-theme-primary",
              "border-zinc-300 dark:border-zinc-600",
              "focus:ring-theme-primary focus:ring-offset-0",
            )}
            aria-label="Selecionar linha"
          />
        </div>
      ),
      // Prevent modifications
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      size: 48,
      minSize: 48,
      maxSize: 48,
      meta: {
        isSystemColumn: true,
        disableOrdering: true,
        align: "center",
      },
    };
  }

  // Checkbox mode
  return {
    id: "_select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      </div>
    ),
    // Prevent modifications
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    size: 48,
    minSize: 48,
    maxSize: 48,
    meta: {
      isSystemColumn: true,
      disableOrdering: true,
      align: "center",
    },
  };
}

// ====================
// Expand Column Helpers
// ====================

interface CreateExpandColumnOptions<TData> {
  /** Custom render for expand button */
  renderExpandButton?: (props: { row: Row<TData>; isExpanded: boolean }) => React.ReactNode;
}

/**
 * Creates an expand column definition for row expansion.
 * This column is configured to NOT be reorderable, resizable, or hideable.
 */
export function createExpandColumn<TData>(
  options: CreateExpandColumnOptions<TData> = {},
): ColumnDef<TData, unknown> {
  const { renderExpandButton } = options;

  return {
    id: "_expand",
    header: () => null,
    cell: ({ row }) => {
      if (!row.getCanExpand()) return null;

      const isExpanded = row.getIsExpanded();

      if (renderExpandButton) {
        return renderExpandButton({ row, isExpanded });
      }

      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      );
    },
    // Prevent modifications
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    size: 48,
    minSize: 48,
    maxSize: 48,
    meta: {
      isSystemColumn: true,
      disableOrdering: true,
    },
  };
}

// ====================
// Column Helpers
// ====================

/**
 * Checks if a column is a system column (selection, expand) that should not be modified
 */
export function isSystemColumn<TData>(column: ColumnDef<TData>): boolean {
  return (column as ColumnDefWithMeta<TData>).meta?.isSystemColumn === true;
}

/**
 * Checks if a column should be excluded from reordering
 */
export function isOrderingDisabled<TData>(column: ColumnDef<TData>): boolean {
  return (column as ColumnDefWithMeta<TData>).meta?.disableOrdering === true;
}

/**
 * Gets the header text from a column definition
 */
export function getColumnHeaderText<TData>(column: ColumnDef<TData>): string {
  const header = column.header;
  if (typeof header === "string") return header;
  const col = column as ColumnDef<TData> & { accessorKey?: string; id?: string };
  if (col.accessorKey) return String(col.accessorKey);
  if (col.id) return String(col.id);
  return "Column";
}
