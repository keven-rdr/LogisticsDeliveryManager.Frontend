"use client";

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
  type Cell,
  type ColumnDef,
  flexRender,
  type Header,
  type Row,
  type Table,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
} from "lucide-react";
import { Fragment, memo, type ReactNode, useCallback, useMemo } from "react";
import { type Typography, useThemeConfig } from "@/components/layout/theme-context";
import { AppLoading } from "@/components/ui/app-loading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ExtendedColumnMeta {
  align?: "left" | "center" | "right";
  disableOrdering?: boolean;
}

export type SelectionMode = "checkbox" | "radio" | "row" | "row-multiple";

export interface DataTableProps<TData> {
  table: Table<TData>;
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnPinning?: boolean;
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
  enableRowClick?: boolean;
  selectionMode?: SelectionMode;
  onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
  gridLines?: boolean;
  stripedRows?: boolean;
  toolbar?: ReactNode;
  toolbarLeft?: ReactNode;
  toolbarRight?: ReactNode;
  enablePagination?: boolean;
  emptyMessage?: string;
  emptyContent?: ReactNode;
  className?: string;
}

const ResizeHandle = memo(function ResizeHandle({
  onMouseDown,
  onTouchStart,
  isResizing,
}: {
  onMouseDown: React.MouseEventHandler;
  onTouchStart: React.TouchEventHandler;
  isResizing: boolean;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className={cn(
        "absolute right-0 top-0 h-full w-5 cursor-col-resize select-none touch-none z-20",
        "flex items-center justify-center group/handle outline-none",
      )}
    >
      <div
        className={cn(
          "h-full w-[1px] transition-all duration-200 bg-transparent group-hover/header:bg-border group-hover/handle:bg-primary",
          isResizing && "!bg-primary w-[2px]",
        )}
      />
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-3 h-6 rounded-[2px] bg-card border border-border shadow-sm text-muted-foreground opacity-0 scale-90 transition-all duration-200 group-hover/header:opacity-100 group-hover/header:scale-100 group-hover/handle:border-primary group-hover/handle:text-primary",
          isResizing && "!opacity-100 !scale-100 !bg-primary !border-primary !text-white",
        )}
      >
        <GripVertical size={10} />
      </div>
    </div>
  );
});

const SortIndicator = memo(({ direction }: { direction: false | "asc" | "desc" }) => {
  if (direction === "asc") return <ArrowUp className="h-3 w-3 text-primary shrink-0" />;
  if (direction === "desc") return <ArrowDown className="h-3 w-3 text-primary shrink-0" />;
  return <ArrowUpDown className="h-3 w-3 opacity-30 shrink-0" />;
});

function StaticHeaderComponent<TData>({
  header,
  enableColumnResizing,
  gridLines,
  pinnedStyle,
  pinnedClass,
  typography,
}: {
  header: Header<TData, unknown>;
  enableColumnResizing: boolean;
  gridLines: boolean;
  pinnedStyle: React.CSSProperties;
  pinnedClass: string;
  typography: Typography;
}) {
  const isSortable = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();
  const canResize = header.column.getCanResize();
  const isResizing = header.column.getIsResizing();
  const align = (header.column.columnDef.meta as ExtendedColumnMeta)?.align || "left";

  const style = useMemo(
    () => ({
      ...pinnedStyle,
      minWidth: enableColumnResizing ? header.getSize() : undefined,
      width: enableColumnResizing ? header.getSize() : undefined,
    }),
    [pinnedStyle, enableColumnResizing, header.getSize],
  );

  return (
    <TableHead
      className={cn(
        typography.tableHeader,
        "text-foreground px-6 py-4 relative group/header",
        pinnedClass,
        gridLines && "border-r border-border last:border-r-0",
      )}
      style={style}
    >
      {!header.isPlaceholder && (
        <div
          className={cn(
            "inline-flex items-center gap-2 w-full",
            align === "center"
              ? "justify-center"
              : align === "right"
                ? "justify-end"
                : "justify-start",
            isSortable &&
              "cursor-pointer select-none py-1 px-2 -ml-2 rounded-md transition-colors hover:bg-secondary",
          )}
          onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {isSortable && <SortIndicator direction={sortDirection} />}
        </div>
      )}
      {enableColumnResizing && canResize && (
        <ResizeHandle
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          isResizing={isResizing}
        />
      )}
    </TableHead>
  );
}

const StaticHeader = memo(StaticHeaderComponent) as typeof StaticHeaderComponent;

function DraggableHeaderComponent<TData>({
  header,
  enableColumnOrdering,
  enableColumnResizing,
  gridLines,
  pinnedStyle,
  pinnedClass,
  typography,
}: {
  header: Header<TData, unknown>;
  enableColumnOrdering: boolean;
  enableColumnResizing: boolean;
  gridLines: boolean;
  pinnedStyle: React.CSSProperties;
  pinnedClass: string;
  typography: Typography;
}) {
  const isSortable = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();
  const isPinned = header.column.getIsPinned();
  const canResize = header.column.getCanResize();
  const isResizing = header.column.getIsResizing();
  const align = (header.column.columnDef.meta as ExtendedColumnMeta)?.align || "left";

  const canOrder =
    enableColumnOrdering &&
    !(header.column.columnDef.meta as ExtendedColumnMeta)?.disableOrdering &&
    !isPinned;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: header.column.id,
    disabled: !canOrder,
  });

  const style = useMemo(
    (): React.CSSProperties => ({
      ...pinnedStyle,
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.8 : 1,
      zIndex: isDragging ? 2 : isPinned ? 1 : 0,
      minWidth: enableColumnResizing ? header.getSize() : undefined,
      width: enableColumnResizing ? header.getSize() : undefined,
      position: "relative",
    }),
    [
      pinnedStyle,
      transform,
      transition,
      isDragging,
      isPinned,
      enableColumnResizing,
      header.getSize,
    ],
  );

  return (
    <TableHead
      ref={setNodeRef}
      className={cn(
        typography.tableHeader,
        "text-foreground px-4 py-2 group/header",
        pinnedClass,
        isDragging && "bg-secondary",
        gridLines && "border-r border-border last:border-r-0",
      )}
      style={style}
    >
      {!header.isPlaceholder && (
        <div
          className={cn(
            "flex items-center gap-1 w-full",
            align === "center"
              ? "justify-center text-center"
              : align === "right"
                ? "justify-end text-right"
                : "justify-start text-left",
          )}
        >
          {canOrder && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 rounded-sm opacity-40 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none text-muted-foreground"
            >
              <GripVertical className="h-3 w-3" />
            </button>
          )}
          <div
            className={cn(
              "inline-flex items-center gap-2 w-full",
              isSortable &&
                "cursor-pointer select-none py-1 px-2 rounded-md transition-colors hover:bg-secondary",
            )}
            onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {isSortable && <SortIndicator direction={sortDirection} />}
          </div>
        </div>
      )}
      {enableColumnResizing && canResize && (
        <ResizeHandle
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          isResizing={isResizing}
        />
      )}
    </TableHead>
  );
}

const DraggableHeader = memo(DraggableHeaderComponent) as typeof DraggableHeaderComponent;

function MemoizedCellComponent<TData>({
  cell,
  enableColumnResizing,
  gridLines,
  pinnedStyle,
  pinnedClass,
  textClass,
  typography,
}: {
  cell: Cell<TData, unknown>;
  enableColumnResizing: boolean;
  gridLines: boolean;
  pinnedStyle: React.CSSProperties;
  pinnedClass: string;
  textClass: string;
  typography: Typography;
}) {
  const align = (cell.column.columnDef.meta as ExtendedColumnMeta)?.align || "left";

  const style = useMemo(
    () => ({
      ...pinnedStyle,
      minWidth: enableColumnResizing ? cell.column.getSize() : undefined,
      width: enableColumnResizing ? cell.column.getSize() : undefined,
    }),
    [pinnedStyle, enableColumnResizing, cell.column.getSize],
  );

  return (
    <TableCell
      className={cn(
        "px-6 py-3",
        typography.tableRow,
        "text-foreground",
        textClass,
        pinnedClass,
        gridLines && "border-r border-border last:border-r-0",
        align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left",
      )}
      style={style}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}

const MemoizedCell = memo(MemoizedCellComponent) as typeof MemoizedCellComponent;

function Pagination<TData>({
  table,
  isLoading,
  typography,
}: {
  table: Table<TData>;
  isLoading: boolean;
  typography: Typography;
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalPages = table.getPageCount();

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border">
      <div className={cn("flex items-center gap-2", typography.body, "text-muted-foreground")}>
        <span>Mostrar</span>
        <Select value={String(pageSize)} onValueChange={(v) => table.setPageSize(Number(v))}>
          <SelectTrigger className="h-6 w-[64px] px-2 py-0 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 50, 100].map((v) => (
              <SelectItem key={v} value={String(v)}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>por página</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <ChevronsLeft className="h-4 w-4 shrink-0" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
        </Button>
        <div className={cn("min-w-[100px] text-center", typography.body, "text-muted-foreground")}>
          Página {pageIndex + 1} de {totalPages}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!table.getCanNextPage() || isLoading}
        >
          <ChevronsRight className="h-4 w-4 shrink-0" />
        </Button>
      </div>
    </div>
  );
}

export function DataTable<TData>({
  table,
  isLoading = false,
  enableColumnResizing = false,
  enableColumnOrdering = false,
  enableColumnPinning = false,
  renderExpandedRow,
  enableRowClick = false,
  selectionMode = "checkbox",
  onRowClick,
  gridLines = false,
  stripedRows = false,
  toolbar,
  toolbarLeft,
  toolbarRight,
  enablePagination = true,
  emptyMessage = "Nenhum resultado encontrado.",
  emptyContent,
  className,
}: DataTableProps<TData>) {
  const { typography } = useThemeConfig();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const currentOrder =
          table.getState().columnOrder.length > 0
            ? table.getState().columnOrder
            : table.getAllColumns().map((c) => c.id);
        const oldIndex = currentOrder.indexOf(active.id as string);
        const newIndex = currentOrder.indexOf(over.id as string);
        if (oldIndex !== -1 && newIndex !== -1)
          table.setColumnOrder(arrayMove(currentOrder, oldIndex, newIndex));
      }
    },
    [table],
  );

  const columnIds = useMemo(() => table.getVisibleLeafColumns().map((c) => c.id), [table]);

  const getPinnedStyle = useCallback(
    (columnId: string, isPinned: false | "left" | "right"): React.CSSProperties => {
      if (!isPinned || !enableColumnPinning) return {};
      const column = table.getColumn(columnId);
      if (!column) return {};
      const isLeft = isPinned === "left";
      return {
        position: "sticky",
        [isLeft ? "left" : "right"]: isLeft ? column.getStart("left") : column.getAfter("right"),
        zIndex: 1,
      };
    },
    [table, enableColumnPinning],
  );

  const getPinnedClass = useCallback(
    (columnId: string, isPinned: false | "left" | "right") => {
      if (!isPinned || !enableColumnPinning) return "";
      const column = table.getColumn(columnId);
      if (!column) return "";
      return cn(
        "bg-card",
        isPinned === "left" &&
          column.getIsLastColumn("left") &&
          "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
        isPinned === "right" &&
          column.getIsFirstColumn("right") &&
          "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]",
      );
    },
    [enableColumnPinning, table.getColumn],
  );

  const handleRowClickInternal = useCallback(
    (row: Row<TData>, event: React.MouseEvent) => {
      if (!enableRowClick) return;
      if (onRowClick) return onRowClick(row, event);
      if (selectionMode === "row" || selectionMode === "radio") {
        table.resetRowSelection();
        row.toggleSelected(true);
      } else if (selectionMode === "row-multiple") {
        if (event.ctrlKey || event.metaKey) {
          row.toggleSelected();
        } else {
          table.resetRowSelection();
          row.toggleSelected(true);
        }
      }
    },
    [enableRowClick, onRowClick, selectionMode, table],
  );

  const tableElement = (
    <UITable className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id} className="hover:bg-transparent border-b border-border">
            {enableColumnOrdering ? (
              <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                {hg.headers.map((h) => (
                  <DraggableHeader
                    key={h.id}
                    header={h}
                    enableColumnOrdering={enableColumnOrdering}
                    enableColumnResizing={enableColumnResizing}
                    gridLines={gridLines}
                    pinnedStyle={getPinnedStyle(h.column.id, h.column.getIsPinned())}
                    pinnedClass={getPinnedClass(h.column.id, h.column.getIsPinned())}
                    typography={typography}
                  />
                ))}
              </SortableContext>
            ) : (
              hg.headers.map((h) => (
                <StaticHeader
                  key={h.id}
                  header={h}
                  enableColumnResizing={enableColumnResizing}
                  gridLines={gridLines}
                  pinnedStyle={getPinnedStyle(h.column.id, h.column.getIsPinned())}
                  pinnedClass={getPinnedClass(h.column.id, h.column.getIsPinned())}
                  typography={typography}
                />
              ))
            )}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading && !table.getRowModel().rows.length ? (
          <TableRow>
            <TableCell colSpan={columnIds.length} className="h-48 text-center p-0">
              <AppLoading label="Buscando informações..." />
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow
                data-state={row.getIsSelected() && "selected"}
                onClick={(e) => handleRowClickInternal(row, e)}
                className={cn(
                  "group transition-colors border-b border-border",
                  enableRowClick && "cursor-pointer",
                  stripedRows && "odd:bg-muted/30",
                  "hover:bg-secondary",
                  row.getIsSelected() && "!bg-primary/5",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <MemoizedCell
                    key={cell.id}
                    cell={cell}
                    enableColumnResizing={enableColumnResizing}
                    gridLines={gridLines}
                    pinnedStyle={getPinnedStyle(cell.column.id, cell.column.getIsPinned())}
                    pinnedClass={getPinnedClass(cell.column.id, cell.column.getIsPinned())}
                    textClass={cn(row.getIsSelected() && "font-medium text-primary")}
                    typography={typography}
                  />
                ))}
              </TableRow>
              <AnimatePresence initial={false}>
                {renderExpandedRow && row.getIsExpanded() && (
                  <TableRow
                    key={`${row.id}-expanded`}
                    className="bg-muted/30 border-b border-border overflow-hidden"
                  >
                    <TableCell colSpan={columnIds.length} className="p-0 border-none">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        {renderExpandedRow(row)}
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columnIds.length}
              className={cn("h-48 text-center p-0", typography.body, "text-muted-foreground")}
            >
              {emptyContent || emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </UITable>
  );

  return (
    <div
      className={cn(
        "rounded-card border border-border shadow-sm overflow-hidden bg-card",
        className,
      )}
    >
      {(toolbar || toolbarLeft || toolbarRight) && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-2">{toolbarLeft}</div>
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
          <div className="flex items-center gap-2">{toolbarRight}</div>
        </div>
      )}
      <div className={cn("overflow-x-auto custom-scrollbar", enableColumnPinning && "relative")}>
        {enableColumnOrdering ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis]}
          >
            {tableElement}
          </DndContext>
        ) : (
          tableElement
        )}
      </div>
      {enablePagination && (
        <Pagination table={table} isLoading={isLoading} typography={typography} />
      )}
    </div>
  );
}
