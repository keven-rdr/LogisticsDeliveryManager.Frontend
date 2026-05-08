"use client";

import { Check, ChevronDown, ChevronRight, Minus } from "lucide-react";
import type * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputSearch } from "@/components/ui/input-search";
import { cn } from "@/lib/utils";

interface StyledCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  className?: string;
  onClick?: () => void;
}

function StyledCheckbox({ checked, indeterminate, className, onClick }: StyledCheckboxProps) {
  const isCheckedOrIndeterminate = checked || indeterminate;

  return (
    <div
      onClick={onClick}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Estilos base (borda normal)
        "border-slate-300 dark:border-slate-600",
        // Estilos quando marcado ou indeterminado (fundo colorido)
        isCheckedOrIndeterminate
          ? "bg-theme-primary border-theme-primary text-white"
          : "bg-transparent",
        "cursor-pointer flex items-center justify-center",
        className,
      )}
    >
      {indeterminate ? (
        <Minus className="h-3 w-3 text-current font-bold" />
      ) : checked ? (
        <Check className="h-3 w-3 text-current font-bold" />
      ) : null}

      {/* Input escondido para garantir acessibilidade básica se necessário */}
      <input type="checkbox" className="sr-only" checked={checked} readOnly />
    </div>
  );
}

export interface TreeNode<TParent, TChild> {
  id: string;
  data: TParent;
  children: TChild[];
}

interface ParentRenderState {
  isExpanded: boolean;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  selectedCount: number;
  totalCount: number;
}

export interface TreeSelectionProps<TParent, TChild> {
  nodes: TreeNode<TParent, TChild>[];
  getChildId: (child: TChild) => string;
  value: string[];
  onChange: (value: string[]) => void;
  renderParent: (node: TreeNode<TParent, TChild>, state: ParentRenderState) => React.ReactNode;
  renderChild: (child: TChild, isSelected: boolean) => React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (
    node: TreeNode<TParent, TChild>,
    searchTerm: string,
  ) => TreeNode<TParent, TChild> | null;
  showBulkActions?: boolean;
  selectAllLabel?: string;
  deselectAllLabel?: string;
  noResultsLabel?: string;
  renderSelectedCount?: (count: number) => React.ReactNode;
  className?: string;
  maxHeight?: string;
  readonly?: boolean;
}

export function TreeSelection<TParent, TChild>({
  nodes,
  getChildId,
  value,
  onChange,
  renderParent,
  renderChild,
  searchable = false,
  searchPlaceholder = "Search...",
  searchFilter,
  showBulkActions = false,
  selectAllLabel = "Select All",
  deselectAllLabel = "Deselect All",
  noResultsLabel = "No results found",
  renderSelectedCount,
  className,
  readonly = false,
}: TreeSelectionProps<TParent, TChild>) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const selectedIds = useMemo(() => new Set(value), [value]);

  const filteredNodes = useMemo(() => {
    let result = nodes;

    // In readonly mode, only show features that have selected permissions
    // and only show the selected permissions as children
    if (readonly) {
      result = nodes
        .map((node) => ({
          ...node,
          children: node.children.filter((child) => selectedIds.has(getChildId(child))),
        }))
        .filter((node) => node.children.length > 0);
      return result;
    }

    if (!searchTerm.trim()) return nodes;

    if (searchFilter) {
      return nodes
        .map((node) => searchFilter(node, searchTerm))
        .filter((node): node is TreeNode<TParent, TChild> => node !== null);
    }

    return nodes
      .map((node) => ({
        ...node,
        children: node.children.filter((child) => {
          const id = getChildId(child);
          return id.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      }))
      .filter((node) => node.children.length > 0);
  }, [nodes, searchTerm, searchFilter, getChildId, readonly, selectedIds]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const newIds = filteredNodes.map((n) => n.id);

      setExpandedNodes((prev) => {
        if (prev.size !== newIds.length) {
          return new Set(newIds);
        }

        const hasAll = newIds.every((id) => prev.has(id));
        if (hasAll) {
          return prev;
        }

        return new Set(newIds);
      });
    }
  }, [searchTerm, filteredNodes]);

  const toggleChild = useCallback(
    (childId: string) => {
      const next = new Set(value);
      if (next.has(childId)) {
        next.delete(childId);
      } else {
        next.add(childId);
      }
      onChange(Array.from(next));
    },
    [value, onChange],
  );

  const toggleParent = useCallback(
    (node: TreeNode<TParent, TChild>) => {
      const childIds = node.children.map(getChildId);
      const next = new Set(value);
      const allSelected = childIds.every((id) => next.has(id));

      for (const id of childIds) {
        if (allSelected) next.delete(id);
        else next.add(id);
      }
      onChange(Array.from(next));
    },
    [getChildId, value, onChange],
  );

  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allIds = nodes.flatMap((n) => n.children.map(getChildId));
    onChange(allIds);
  }, [nodes, getChildId, onChange]);

  const deselectAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const getParentState = useCallback(
    (node: TreeNode<TParent, TChild>): ParentRenderState => {
      const childIds = node.children.map(getChildId);
      const selectedCount = childIds.filter((id) => selectedIds.has(id)).length;
      const totalCount = childIds.length;

      return {
        isExpanded: expandedNodes.has(node.id),
        isAllSelected: selectedCount === totalCount && totalCount > 0,
        isPartiallySelected: selectedCount > 0 && selectedCount < totalCount,
        selectedCount,
        totalCount,
      };
    },
    [getChildId, selectedIds, expandedNodes],
  );

  return (
    <div className={cn("space-y-3", className)}>
      {(renderSelectedCount || showBulkActions) && !readonly && (
        <div className="flex items-center justify-between">
          {renderSelectedCount && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {renderSelectedCount(selectedIds.size)}
            </div>
          )}
          {showBulkActions && (
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={selectAll}>
                {selectAllLabel}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={deselectAll}>
                {deselectAllLabel}
              </Button>
            </div>
          )}
        </div>
      )}

      {searchable && !readonly && (
        <InputSearch
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
        />
      )}

      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden overflow-y-auto">
        {filteredNodes.map((node) => {
          const state = getParentState(node);

          return (
            <div
              key={node.id}
              className="border-b border-slate-200 dark:border-slate-800 last:border-b-0"
            >
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 select-none cursor-pointer",
                  "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                  !readonly && state.isAllSelected && "bg-blue-50/50 dark:bg-blue-900/10",
                )}
                onClick={() => toggleExpanded(node.id)}
              >
                {!readonly && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleParent(node);
                    }}
                  >
                    <StyledCheckbox
                      checked={state.isAllSelected}
                      indeterminate={state.isPartiallySelected}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">{renderParent(node, state)}</div>

                {state.isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </div>

              {state.isExpanded && (
                <div className="bg-white dark:bg-slate-900 px-4 py-2 space-y-1">
                  {node.children.map((child) => {
                    const childId = getChildId(child);
                    const isSelected = selectedIds.has(childId);

                    return (
                      <div
                        key={childId}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          !readonly &&
                            "cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
                          !readonly && isSelected && "bg-blue-50 dark:bg-blue-900/20",
                        )}
                        onClick={() => !readonly && toggleChild(childId)}
                      >
                        {!readonly && <StyledCheckbox checked={isSelected} />}
                        <div className="flex-1 min-w-0">{renderChild(child, isSelected)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500">{noResultsLabel}</div>
        )}
      </div>
    </div>
  );
}
