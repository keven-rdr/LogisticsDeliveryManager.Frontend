import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";
import { PatternFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
}

export function DatePicker({
  date,
  setDate,
  disabled,
  placeholder = "DD/MM/AAAA",
  error,
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const isInternalChange = React.useRef(false);

  // Sync input value with date prop
  React.useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    if (date && isValid(date)) {
      setInputValue(format(date, "dd/MM/yyyy"));
    } else if (!date) {
      setInputValue("");
    }
  }, [date]);

  const handleInputChange = (
    values: { formattedValue: string; value: string },
    sourceInfo: { source: string },
  ) => {
    const { formattedValue, value } = values;

    if (sourceInfo.source === "prop") return;

    setInputValue(formattedValue);

    if (value.length === 8) {
      const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        const currentFormatted = date && isValid(date) ? format(date, "dd/MM/yyyy") : "";
        if (formattedValue !== currentFormatted) {
          isInternalChange.current = true;
          setDate(parsedDate);
        }
      }
    } else if (value === "" && date) {
      isInternalChange.current = true;
      setDate(undefined);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.length === 10) {
      const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());
      if (!isValid(parsedDate)) {
        setInputValue(date ? format(date, "dd/MM/yyyy") : "");
      }
    } else if (inputValue.length > 0) {
      setInputValue(date ? format(date, "dd/MM/yyyy") : "");
    }
  };

  const handleCalendarSelect = (newDate?: Date) => {
    setDate(newDate);
    if (newDate) {
      setInputValue(format(newDate, "dd/MM/yyyy"));
      setIsPopoverOpen(false);
    } else {
      setInputValue("");
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setDate(today);
    setInputValue(format(today, "dd/MM/yyyy"));
    setIsPopoverOpen(false);
  };

  const handleClearClick = () => {
    setDate(undefined);
    setInputValue("");
    setIsPopoverOpen(false);
  };

  return (
    <div className="relative flex items-center w-full group">
      <PatternFormat
        format="##/##/####"
        value={inputValue}
        onValueChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        customInput={Input}
        className={cn(
          "pr-10 transition-all",
          error && "border-destructive focus-visible:ring-destructive",
        )}
        aria-invalid={error}
      />

      <div className="absolute right-0 h-full flex items-center pr-1 gap-1">
        {inputValue && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleClearClick();
            }}
          >
            <X size={14} />
          </Button>
        )}

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                error ? "text-destructive" : "text-slate-400 hover:text-primary",
                disabled && "opacity-50 cursor-not-allowed",
              )}
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 shadow-2xl border-slate-200 dark:border-slate-800 rounded-card overflow-hidden"
            align="end"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarSelect}
              initialFocus
              locale={ptBR}
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={2100}
              defaultMonth={date || new Date()}
            />
            <div className="flex items-center justify-between p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearClick}
                className="text-xs h-8 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-button"
              >
                Limpar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTodayClick}
                className="text-xs h-8 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-button"
              >
                Hoje
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
