import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, type Header } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableTableHeaderProps<TData> {
  header: Header<TData, unknown>;
}

export function DraggableTableHeader<TData>({ header }: DraggableTableHeaderProps<TData>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: header.column.id,
  });

  const isSortable = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("inline-flex items-center gap-1", isDragging && "z-10")}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 rounded-sm opacity-50 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground"
        title="Arraste para reordenar"
      >
        <GripVertical className="h-3 w-3" />
      </button>

      {/* Header Content */}
      <div
        className={cn(
          "inline-flex items-center gap-2",
          isSortable &&
            "cursor-pointer select-none py-1 px-2 rounded-md transition-colors hover:bg-secondary",
        )}
        onClick={header.column.getToggleSortingHandler()}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {isSortable && (
          <span className="w-4">
            {sortDirection === "asc" ? (
              <ArrowUp className="h-3 w-3 text-primary" />
            ) : sortDirection === "desc" ? (
              <ArrowDown className="h-3 w-3 text-primary" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-30" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}
