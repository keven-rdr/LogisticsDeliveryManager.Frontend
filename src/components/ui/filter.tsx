"use client";

import { Check, Filter as FilterIcon, X } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RSQLBuilder, type RSQLOperator, type RSQLValue } from "@/lib/rsql-builder";
import { cn } from "@/lib/utils";
import { ButtonContainer } from "./button-container";

export type FilterOperation = "AND" | "OR";
export type FilterSize = "sm" | "md" | "lg" | "xl" | "full";

export interface FilterDef<TValue = RSQLValue, TAllValues = Record<string, RSQLValue>> {
  id: string;
  field: string | string[];
  label: string;
  operator: RSQLOperator;
  size?: FilterSize;
  className?: string;
  defaultValue?: TValue;
  render: (props: {
    value: TValue;
    onChange: (value: TValue) => void;
    placeholder?: string;
    allValues: TAllValues;
  }) => ReactNode;
  transformValue?: (value: TValue, allValues: TAllValues) => RSQLValue;
  shouldFilter?: (value: TValue, allValues: TAllValues) => boolean;
}

export interface FilterProps {
  filterDefs: FilterDef<RSQLValue, Record<string, RSQLValue>>[];
  onSearch?: (rsql: string) => void;
  onFilterChange?: (values: Record<string, RSQLValue>, filter: string) => void;
  values?: Record<string, RSQLValue>;
  onClear?: () => void;
  operation?: FilterOperation;
  showLabels?: boolean;
  className?: string;
  autoApply?: boolean;
  showActions?: boolean;
  debounceMs?: number;
  mediaQuery?: string;
}

const sizeClasses: Record<FilterSize, string> = {
  sm: "col-span-12 sm:col-span-6 md:col-span-2",
  md: "col-span-12 sm:col-span-6 md:col-span-3",
  lg: "col-span-12 md:col-span-4",
  xl: "col-span-12 md:col-span-6",
  full: "col-span-12",
};

function getDefaultValues(
  filterDefs: FilterDef<RSQLValue, Record<string, RSQLValue>>[],
): Record<string, RSQLValue> {
  const result: Record<string, RSQLValue> = {};
  for (const def of filterDefs) {
    result[def.id] = def.defaultValue ?? "";
  }
  return result;
}

function shouldIncludeFilter(
  def: FilterDef<RSQLValue, Record<string, RSQLValue>>,
  value: RSQLValue,
  allValues: Record<string, RSQLValue>,
): boolean {
  if (def.shouldFilter) {
    return def.shouldFilter(value, allValues);
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== "" && value !== null && value !== undefined;
}

function buildRSQLQuery(
  filterDefs: FilterDef<RSQLValue, Record<string, RSQLValue>>[],
  values: Record<string, RSQLValue>,
  operation: FilterOperation,
): string {
  const builder = RSQLBuilder.create();
  let isFirst = true;

  filterDefs.forEach((def) => {
    const value = values[def.id];

    if (!shouldIncludeFilter(def, value, values)) {
      return;
    }

    const transformedValue = def.transformValue ? def.transformValue(value, values) : value;

    let condition: string;
    if (Array.isArray(def.field)) {
      const groupBuilder = RSQLBuilder.create();
      def.field.forEach((f, idx) => {
        if (idx === 0) groupBuilder.and(f, def.operator, transformedValue);
        else groupBuilder.or(f, def.operator, transformedValue);
      });
      condition = `(${groupBuilder.build()})`;
    } else {
      const singleBuilder = RSQLBuilder.create().and(def.field, def.operator, transformedValue);
      condition = singleBuilder.build();
    }

    if (isFirst) {
      builder.and(condition);
      isFirst = false;
    } else if (operation === "AND") {
      builder.and(condition);
    } else {
      builder.or(condition);
    }
  });

  return builder.build();
}

export function useFilterHelper<TAllValues = Record<string, RSQLValue>>() {
  return useMemo(
    () => ({
      item: <TValue = RSQLValue>(def: FilterDef<TValue, TAllValues>) =>
        def as unknown as FilterDef<RSQLValue, Record<string, RSQLValue>>,
    }),
    [],
  );
}

export function Filter({
  filterDefs,
  onSearch,
  onFilterChange,
  values,
  onClear,
  operation = "AND",
  showLabels = true,
  className,
  autoApply = false,
  showActions = true,
  debounceMs = 300,
  mediaQuery = "(max-width: 1024px)",
}: FilterProps) {
  const { t } = useTranslation("common");
  const isMobile = useMediaQuery(mediaQuery);
  const [isOpen, setIsOpen] = useState(false);
  const lastAppliedJson = useRef<string>("");

  const defaultValues = useMemo(() => getDefaultValues(filterDefs), [filterDefs]);
  const initialValues = useMemo(() => values || defaultValues, [values, defaultValues]);

  const form = useForm<Record<string, RSQLValue>>({
    defaultValues: initialValues,
    values: values,
  });

  const { control, handleSubmit, reset, watch } = form;
  const currentValues = watch();

  const [appliedValues, setAppliedValues] = useState<Record<string, RSQLValue>>(initialValues);

  const appliedCount = useMemo(() => {
    return filterDefs.filter((def) =>
      shouldIncludeFilter(def, appliedValues[def.id], appliedValues),
    ).length;
  }, [filterDefs, appliedValues]);

  const isDirty = useMemo(() => {
    return filterDefs.some((def) => {
      const current = currentValues[def.id];
      const applied = appliedValues[def.id];
      if (Array.isArray(current) && Array.isArray(applied)) {
        return JSON.stringify(current) !== JSON.stringify(applied);
      }
      return current !== applied;
    });
  }, [filterDefs, currentValues, appliedValues]);

  const handleApply = useCallback(
    (data: Record<string, RSQLValue>) => {
      const currentJson = JSON.stringify(data);
      if (currentJson === lastAppliedJson.current) return;

      lastAppliedJson.current = currentJson;
      setAppliedValues(data);
      const rsql = buildRSQLQuery(filterDefs, data, operation);

      if (onFilterChange) onFilterChange(data, rsql);
      if (onSearch) onSearch(rsql);

      setIsOpen(false);
    },
    [filterDefs, operation, onSearch, onFilterChange],
  );

  const handleClear = useCallback(() => {
    const defaults = getDefaultValues(filterDefs);
    lastAppliedJson.current = JSON.stringify(defaults);
    reset(defaults);
    setAppliedValues(defaults);

    if (onFilterChange) onFilterChange(defaults, "");
    if (onSearch) onSearch("");

    onClear?.();
  }, [filterDefs, reset, onSearch, onFilterChange, onClear]);

  useEffect(() => {
    if (!autoApply || isMobile) return;

    const timeoutId = setTimeout(() => {
      handleApply(currentValues);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [autoApply, currentValues, debounceMs, handleApply, isMobile]);

  const renderFields = (forceStacked = false) => (
    <div className="grid grid-cols-12 gap-4 w-full">
      {filterDefs.map((def) => (
        <FormField
          key={def.id}
          control={control}
          name={def.id}
          render={({ field }) => (
            <FormItem
              className={cn(
                forceStacked ? "col-span-12" : def.className || sizeClasses[def.size ?? "md"],
              )}
            >
              {showLabels && (
                <FormLabel className="font-medium text-slate-900 dark:text-slate-100 pl-0.5">
                  {def.label}
                </FormLabel>
              )}
              <FormControl>
                {
                  def.render({
                    value: field.value,
                    onChange: field.onChange,
                    allValues: currentValues,
                  }) as React.ReactElement
                }
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Form {...form}>
        <div className={cn("flex items-center gap-2", className)}>
          <Button
            variant="outline"
            size="sm"
            className="relative h-9 px-3 gap-2"
            onClick={() => setIsOpen(true)}
          >
            <FilterIcon size={16} className="text-slate-500" />
            <span>{t("filter.title")}</span>
            {appliedCount > 0 && (
              <Badge
                variant="solid"
                color="primary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] border-2 border-white dark:border-slate-900"
              >
                {appliedCount}
              </Badge>
            )}
          </Button>

          {appliedCount > 0 && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleClear}
              className="h-8 w-8 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </Button>
          )}

          <Drawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={t("filter.title")}
            width="w-[75%] sm:w-[400px]"
            footer={
              <ButtonContainer>
                <Button variant="ghost" onClick={handleClear}>
                  {t("filter.clear")}
                </Button>
                <Button onClick={handleSubmit(handleApply)}>
                  <Check size={16} />
                  {t("filter.apply")}
                </Button>
              </ButtonContainer>
            }
          >
            <div className="p-6">{renderFields(true)}</div>
          </Drawer>
        </div>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <div className={cn("flex flex-col px-1", className)}>
        {renderFields(false)}
        {showActions && (
          <ButtonContainer className="pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-700"
              disabled={appliedCount === 0 && !isDirty}
            >
              {t("filter.clear")}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit(handleApply)}
              className="gap-2"
              disabled={!isDirty}
            >
              <Check size={16} />
              {t("filter.apply")}
            </Button>
          </ButtonContainer>
        )}
      </div>
    </Form>
  );
}
