import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  type Header,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { Fragment, type ReactNode, useMemo, useState } from "react";
import { type Typography, useThemeConfig } from "@/components/layout/theme-context";
import { AppLoading } from "@/components/ui/app-loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnMenu } from "@/components/ui/data-table-column-menu";
import { DataTableSelectedRowsInfo } from "@/components/ui/data-table-row-selection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  // Pagination
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Sorting
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;

  // Loading
  isLoading?: boolean;

  // Row Selection
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  getRowId?: (row: TData) => string;

  // Column Visibility
  enableColumnVisibility?: boolean;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  // Column Ordering
  enableColumnOrdering?: boolean;
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;

  // Column Pinning
  enableColumnPinning?: boolean;
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;

  // Column Resizing
  enableColumnResizing?: boolean;
  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>;

  // Row Expanding
  enableRowExpanding?: boolean;
  expanded?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  renderExpandedRow?: (row: Row<TData>) => ReactNode;

  // Reset callbacks
  onResetVisibility?: () => void;
  onResetPinning?: () => void;
  onResetOrder?: () => void;
}

// Resize Handle Component
function ResizeHandle<TData>({
  header,
  isResizing,
}: {
  header: Header<TData, unknown>;
  isResizing: boolean;
}) {
  return (
    <div
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={cn(
        "absolute right-0 top-0 h-full w-4 cursor-col-resize select-none touch-none group/resize",
        "flex items-center justify-center",
      )}
    >
      <div
        className={cn(
          "h-full w-[3px] rounded-full transition-colors",
          "group-hover/resize:bg-primary/60",
          isResizing ? "bg-primary" : "bg-transparent",
        )}
      />
    </div>
  );
}

// Draggable Header Cell Component
function DraggableHeader<TData>({
  header,
  typography,
  enableColumnOrdering,
  enableColumnResizing,
  getPinnedStyles,
  getPinnedClasses,
}: {
  header: Header<TData, unknown>;
  typography: Typography;
  enableColumnOrdering: boolean;
  enableColumnResizing: boolean;
  getPinnedStyles: (columnId: string, isPinned: false | "left" | "right") => React.CSSProperties;
  getPinnedClasses: (columnId: string, isPinned: false | "left" | "right") => string;
}) {
  const isSortable = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();
  const isPinned = header.column.getIsPinned();
  const canResize = header.column.getCanResize();
  const isResizing = header.column.getIsResizing();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: header.column.id,
  });

  const style: React.CSSProperties = {
    ...getPinnedStyles(header.column.id, isPinned),
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 2 : isPinned ? 1 : 0,
    minWidth: enableColumnResizing ? header.getSize() : undefined,
    width: enableColumnResizing ? header.getSize() : undefined,
    position: "relative",
  };

  return (
    <TableHead
      ref={setNodeRef}
      className={cn(
        typography.tableHeader,
        "text-foreground px-6 py-4",
        getPinnedClasses(header.column.id, isPinned),
        isDragging && "bg-secondary",
      )}
      style={style}
    >
      {header.isPlaceholder ? null : (
        <div className="inline-flex items-center gap-1">
          {/* Drag Handle */}
          {enableColumnOrdering && !isPinned && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 rounded-sm opacity-40 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none text-muted-foreground"
              title="Arraste para reordenar"
            >
              <GripVertical className="h-3 w-3 shrink-0" />
            </button>
          )}

          {/* Header Content */}
          <div
            className={cn(
              "inline-flex items-center gap-2",
              isSortable &&
                "cursor-pointer select-none py-1 px-2 rounded-md transition-colors hover:bg-secondary",
            )}
            onClick={header.column.getToggleSortingHandler()}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {isSortable && (
              <span className="w-4 flex items-center justify-center shrink-0">
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-3 w-3 text-primary shrink-0" />
                ) : sortDirection === "desc" ? (
                  <ArrowDown className="h-3 w-3 text-primary shrink-0" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30 shrink-0" />
                )}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Resize Handle */}
      {enableColumnResizing && canResize && (
        <ResizeHandle header={header} isResizing={isResizing} />
      )}
    </TableHead>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 1,
  pageIndex = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortingChange,
  isLoading = false,
  // Row Selection
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  // Column Visibility
  enableColumnVisibility = false,
  columnVisibility,
  onColumnVisibilityChange,
  // Column Ordering
  enableColumnOrdering = false,
  columnOrder: externalColumnOrder,
  onColumnOrderChange,
  // Column Pinning
  enableColumnPinning = false,
  columnPinning,
  onColumnPinningChange,
  // Column Resizing
  enableColumnResizing = false,
  columnSizing,
  onColumnSizingChange,
  // Row Expanding
  enableRowExpanding = false,
  expanded,
  onExpandedChange,
  renderExpandedRow,
  // Reset callbacks
  onResetVisibility,
  onResetPinning,
  onResetOrder,
}: DataTableProps<TData, TValue>) {
  const { typography } = useThemeConfig();

  // Internal expanded state if not controlled
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});
  const expandedState = expanded ?? internalExpanded;
  const setExpandedState = onExpandedChange ?? setInternalExpanded;

  // Add special columns if enabled
  const tableColumns = useMemo(() => {
    let cols = [...columns];

    // Add expand column at the beginning if enabled
    if (enableRowExpanding && renderExpandedRow) {
      const expandColumn: ColumnDef<TData, TValue> = {
        id: "expand",
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getIsExpanded() ? (
                <ChevronUp className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0" />
              )}
            </Button>
          ) : null,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 40,
      };
      cols = [expandColumn, ...cols];
    }

    // Add selection column if enabled
    if (enableRowSelection) {
      const selectionColumn: ColumnDef<TData, TValue> = {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Selecionar todos"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 40,
      };
      cols = [selectionColumn, ...cols];
    }

    return cols;
  }, [columns, enableRowSelection, enableRowExpanding, renderExpandedRow]);

  // Default column order based on columns
  const defaultColumnOrder = useMemo(
    () =>
      tableColumns
        .map((col) => {
          const c = col as { id?: string; accessorKey?: string };
          return c.id ?? c.accessorKey;
        })
        .filter((x): x is string => x != null),
    [tableColumns],
  );

  // Internal column order state (used if not controlled)
  const [internalColumnOrder, setInternalColumnOrder] =
    useState<ColumnOrderState>(defaultColumnOrder);

  // Use external or internal column order
  const columnOrder = externalColumnOrder ?? internalColumnOrder;
  const setColumnOrder = onColumnOrderChange ?? setInternalColumnOrder;

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: enableRowExpanding ? getExpandedRowModel() : undefined,
    manualPagination: true,
    pageCount: pageCount,
    manualSorting: true,
    enableRowSelection: enableRowSelection,
    enableColumnPinning: enableColumnPinning,
    enableColumnResizing: enableColumnResizing,
    columnResizeMode: "onChange",
    getRowId: getRowId,
    getRowCanExpand: enableRowExpanding ? () => true : undefined,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting: sorting,
      columnOrder: columnOrder,
      expanded: expandedState,
      ...(enableRowSelection && rowSelection !== undefined && { rowSelection }),
      ...(enableColumnVisibility && columnVisibility !== undefined && { columnVisibility }),
      ...(enableColumnPinning && columnPinning !== undefined && { columnPinning }),
      ...(enableColumnResizing && columnSizing !== undefined && { columnSizing }),
    },
    onSortingChange: onSortingChange,
    onRowSelectionChange: onRowSelectionChange,
    onColumnVisibilityChange: onColumnVisibilityChange,
    onColumnOrderChange: setColumnOrder as OnChangeFn<ColumnOrderState>,
    onColumnPinningChange: onColumnPinningChange,
    onColumnSizingChange: onColumnSizingChange,
    onExpandedChange: setExpandedState,
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);

      const newColumnOrder = arrayMove(columnOrder, oldIndex, newIndex);
      setColumnOrder(newColumnOrder);
    }
  };

  const hasToolbar =
    enableColumnVisibility || enableColumnOrdering || enableColumnPinning || enableRowSelection;

  // Column IDs for sortable context
  const columnIds = useMemo(
    () => table.getVisibleLeafColumns().map((col) => col.id),
    [table.getVisibleLeafColumns],
  );

  // Helper to get pinned column styles
  const getPinnedStyles = (
    columnId: string,
    isPinned: false | "left" | "right",
  ): React.CSSProperties => {
    if (!isPinned || !enableColumnPinning) return {};

    const column = table.getColumn(columnId);
    if (!column) return {};

    const isLeft = isPinned === "left";
    const position = isLeft ? column.getStart("left") : column.getAfter("right");

    return {
      position: "sticky",
      [isLeft ? "left" : "right"]: position,
      zIndex: 1,
    };
  };

  const getPinnedClasses = (columnId: string, isPinned: false | "left" | "right") => {
    if (!isPinned || !enableColumnPinning) return "";

    const column = table.getColumn(columnId);
    if (!column) return "";

    const isLastLeft = isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRight = isPinned === "right" && column.getIsFirstColumn("right");

    return cn(
      "bg-card",
      isLastLeft && "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
      isFirstRight && "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]",
    );
  };

  // Render header without DnD
  const renderStaticHeader = (header: Header<TData, unknown>) => {
    const isSortable = header.column.getCanSort();
    const sortDirection = header.column.getIsSorted();
    const isPinned = header.column.getIsPinned();
    const canResize = header.column.getCanResize();
    const isResizing = header.column.getIsResizing();

    return (
      <TableHead
        key={header.id}
        className={cn(
          typography.tableHeader,
          "text-foreground px-6 py-4 relative",
          getPinnedClasses(header.column.id, isPinned),
        )}
        style={{
          ...getPinnedStyles(header.column.id, isPinned),
          minWidth: enableColumnResizing ? header.getSize() : undefined,
          width: enableColumnResizing ? header.getSize() : undefined,
        }}
      >
        {header.isPlaceholder ? null : (
          <div
            className={cn(
              "inline-flex items-center gap-2",
              isSortable &&
                "cursor-pointer select-none py-1 px-2 -ml-2 rounded-md transition-colors hover:bg-secondary",
            )}
            onClick={header.column.getToggleSortingHandler()}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {isSortable && (
              <span className="w-4 flex items-center justify-center shrink-0">
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-3 w-3 text-primary shrink-0" />
                ) : sortDirection === "desc" ? (
                  <ArrowDown className="h-3 w-3 text-primary shrink-0" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30 shrink-0" />
                )}
              </span>
            )}
          </div>
        )}

        {/* Resize Handle */}
        {enableColumnResizing && canResize && (
          <ResizeHandle header={header} isResizing={isResizing} />
        )}
      </TableHead>
    );
  };

  // Table content wrapped with DnD if ordering is enabled
  const tableContent = (
    <Table className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
            {enableColumnOrdering ? (
              <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                {headerGroup.headers.map((header) => (
                  <DraggableHeader
                    key={header.id}
                    header={header}
                    typography={typography}
                    enableColumnOrdering={enableColumnOrdering}
                    enableColumnResizing={enableColumnResizing}
                    getPinnedStyles={getPinnedStyles}
                    getPinnedClasses={getPinnedClasses}
                  />
                ))}
              </SortableContext>
            ) : (
              headerGroup.headers.map(renderStaticHeader)
            )}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="divide-y divide-border">
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={tableColumns.length} className="h-48 text-center p-0">
              <AppLoading
                variant="primary"
                size="base"
                textSize="xs"
                labelVariant="black"
                strokeWidth={2}
                label="Carregando Dados..."
                labelClassName="font-medium"
              />
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "group transition-colors border-b border-border hover:bg-secondary",
                  row.getIsSelected() && "bg-primary/5",
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const isPinned = cell.column.getIsPinned();

                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-6 py-4",
                        typography.tableRow,
                        "text-foreground",
                        getPinnedClasses(cell.column.id, isPinned),
                      )}
                      style={{
                        ...getPinnedStyles(cell.column.id, isPinned),
                        minWidth: enableColumnResizing ? cell.column.getSize() : undefined,
                        width: enableColumnResizing ? cell.column.getSize() : undefined,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Expanded Row Content */}
              {enableRowExpanding && row.getIsExpanded() && renderExpandedRow && (
                <TableRow className="bg-muted/30 border-b border-border">
                  <TableCell colSpan={row.getVisibleCells().length} className="px-6 py-4 p-0">
                    {renderExpandedRow(row)}
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={tableColumns.length}
              className={cn("h-48 text-center p-0", typography.body, "text-muted-foreground")}
            >
              Nenhum resultado encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card shadow-sm overflow-hidden transition-colors",
      )}
    >
      {/* Toolbar */}
      {hasToolbar && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-border text-foreground">
          <div className="flex items-center gap-2">
            {enableRowSelection && <DataTableSelectedRowsInfo table={table} />}
          </div>
          <div className="flex items-center gap-2">
            <DataTableColumnMenu
              table={table}
              enableColumnVisibility={enableColumnVisibility}
              enableColumnOrdering={enableColumnOrdering}
              enableColumnPinning={enableColumnPinning}
              onResetVisibility={onResetVisibility}
              onResetPinning={onResetPinning}
              onResetOrder={onResetOrder ?? (() => setColumnOrder(defaultColumnOrder))}
            />
          </div>
        </div>
      )}

      {/* Table with horizontal scroll for pinned columns */}
      <div className={cn("overflow-x-auto custom-scrollbar", enableColumnPinning && "relative")}>
        {enableColumnOrdering ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis]}
          >
            {tableContent}
          </DndContext>
        ) : (
          tableContent
        )}
      </div>

      {/* Pagination Controls */}
      {pageCount > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className={cn("flex items-center gap-2", typography.body, "text-muted-foreground")}>
            <span>Mostrar</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger className="h-6 w-[64px] px-2 py-0 text-xs">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>por página</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange?.(0)}
              disabled={pageIndex <= 0 || isLoading}
            >
              <ChevronsLeft className="h-4 w-4 shrink-0" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange?.(pageIndex - 1)}
              disabled={pageIndex <= 0 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
            </Button>
            <div
              className={cn("min-w-[100px] text-center", typography.body, "text-muted-foreground")}
            >
              Página {pageIndex + 1} de {pageCount}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange?.(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1 || isLoading}
            >
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange?.(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1 || isLoading}
            >
              <ChevronsRight className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
