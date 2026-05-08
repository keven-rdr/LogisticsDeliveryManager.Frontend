import type { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableRowSelectionHeaderProps<TData> {
  table: Table<TData>;
}

export function DataTableRowSelectionHeader<TData>({
  table,
}: DataTableRowSelectionHeaderProps<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Selecionar todos"
      className="translate-y-[2px]"
    />
  );
}

interface DataTableRowSelectionCellProps<TData> {
  row: Row<TData>;
}

export function DataTableRowSelectionCell<TData>({ row }: DataTableRowSelectionCellProps<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Selecionar linha"
      className="translate-y-[2px]"
    />
  );
}

/**
 * Creates a selection column definition for the DataTable
 */
export function createSelectionColumn<TData>() {
  return {
    id: "select",
    header: ({ table }: { table: Table<TData> }) => <DataTableRowSelectionHeader table={table} />,
    cell: ({ row }: { row: Row<TData> }) => <DataTableRowSelectionCell row={row} />,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
    size: 40,
  };
}

interface DataTableSelectedRowsInfoProps<TData> {
  table: Table<TData>;
}

export function DataTableSelectedRowsInfo<TData>({ table }: DataTableSelectedRowsInfoProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  if (selectedCount === 0) return null;

  return (
    <div className="text-sm text-muted-foreground">
      {selectedCount} de {totalCount} linha(s) selecionada(s)
    </div>
  );
}
