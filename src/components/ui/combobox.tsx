"use client";

import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface ComboboxProps<T extends ComboboxOption = ComboboxOption>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  options: T[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  modal?: boolean;
  disabled?: boolean;
  renderOption?: (option: T) => React.ReactNode;
  isLoading?: boolean;
  icon?: React.ElementType;
  footer?: React.ReactNode;
}

export function Combobox<T extends ComboboxOption = ComboboxOption>({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  emptyText = "Nenhum resultado encontrado.",
  className,
  modal = false,
  disabled = false,
  renderOption,
  isLoading,
  icon: Icon,
  footer,
  ...props
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = React.useMemo(() => {
    return options.find((option) => option.value === value)?.label;
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="select"
          size="input"
          radius="input"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn(className)}
          {...props}
        >
          <div className="flex-1 flex items-center gap-2 truncate text-left">
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : Icon ? (
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : null}
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {selectedLabel || placeholder}
            </span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto min-w-[--radix-popover-trigger-width] p-0 border-border data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100"
        align="start"
      >
        <Command
          filter={(value, search) => {
            const option = options.find((opt) => opt.value === value);
            if (!option) return 0;
            return option.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {renderOption ? renderOption(option) : option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {footer && (
            <div className="border-t border-slate-100 dark:border-slate-800 p-1">{footer}</div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
