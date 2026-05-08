import { format, isValid, parse, setMonth, setYear, startOfMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MonthPickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
}

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function MonthPicker({
  date,
  setDate,
  disabled,
  placeholder = "MM/AAAA",
  error,
}: MonthPickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [currentViewDate, setCurrentViewDate] = React.useState<Date>(date || new Date());
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (date && isValid(date)) {
      setInputValue(format(date, "MM/yyyy"));
      setCurrentViewDate(date);
    } else {
      // Only clear input if date is essentially explicitly cleared or undefined,
      // but we want to avoid clearing while typing invalid dates.
      // However, since this effect runs on 'date' prop change,
      // implies parent pushed a new date.
      // We'll rely on the parent logic.
      if (!date) setInputValue("");
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Allow digits and slash only
    value = value.replace(/[^0-9/]/g, "");

    // Auto-masking: MM/yyyy
    if (value.length > 2 && !value.includes("/")) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    setInputValue(value);

    // Parse if complete
    if (value.length === 7) {
      const parsed = parse(value, "MM/yyyy", new Date());
      if (isValid(parsed)) {
        setDate(parsed);
        setCurrentViewDate(parsed);
      }
    } else if (value === "") {
      setDate(undefined);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(startOfMonth(currentViewDate), monthIndex);
    setDate(newDate);
    setInputValue(format(newDate, "MM/yyyy"));
    setIsPopoverOpen(false);
  };

  const handlePrevYear = () => {
    setCurrentViewDate(setYear(currentViewDate, currentViewDate.getFullYear() - 1));
  };

  const handleNextYear = () => {
    setCurrentViewDate(setYear(currentViewDate, currentViewDate.getFullYear() + 1));
  };

  const handleClearClick = () => {
    setDate(undefined);
    setInputValue("");
    setIsPopoverOpen(false);
  };

  return (
    <div className="relative flex items-center w-full">
      <Input
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10"
        onChange={handleInputChange}
        maxLength={7}
        aria-invalid={error}
      />

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-0 h-full w-10 hover:bg-transparent",
              error ? "text-destructive" : "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            disabled={disabled}
            onClick={() => setIsPopoverOpen(true)}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="end">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handlePrevYear}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold">{currentViewDate.getFullYear()}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextYear}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const isSelected =
                date &&
                isValid(date) &&
                date.getMonth() === index &&
                date.getFullYear() === currentViewDate.getFullYear();

              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "ghost"}
                  className={cn(
                    "h-9 w-full font-normal",
                    isSelected
                      ? "bg-theme-primary text-white"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  )}
                  onClick={() => handleMonthSelect(index)}
                  type="button"
                >
                  {month}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center justify-end mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearClick}
              className="text-xs h-8 text-zinc-500 hover:text-red-500"
              type="button"
            >
              Limpar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
