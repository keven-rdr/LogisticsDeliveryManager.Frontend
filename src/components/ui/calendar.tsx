"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { DayPicker } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-4 relative items-center px-8 h-12",
        caption_label:
          "text-sm font-bold capitalize text-slate-900 dark:text-slate-100 tracking-tight",
        caption_dropdowns: "flex justify-center gap-1",
        nav: "flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-1",
        head_row: "flex px-0.5",
        head_cell:
          "text-slate-400 rounded-md w-9 font-semibold text-[0.7rem] dark:text-slate-500 uppercase tracking-widest",
        row: "flex w-full mt-1",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 transition-all",
          "hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-button",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium aria-selected:opacity-100 rounded-button transition-colors",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary! text-white! hover:bg-primary! hover:text-white! focus:bg-primary! focus:text-white! rounded-full! shadow-md font-bold z-30 scale-95",
        day_today: "bg-orange-500! text-white! font-bold rounded-full! shadow-sm z-20 scale-95",
        day_outside:
          "day-outside text-slate-300 opacity-40 aria-selected:bg-slate-50/50 aria-selected:text-slate-300 aria-selected:opacity-20 dark:text-slate-600",
        day_disabled: "text-slate-300 opacity-50 dark:text-slate-700",
        day_range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
        day_hidden: "invisible",
        vhidden: "sr-only",
        dropdown_month:
          "relative z-20 inline-flex items-center justify-center rounded-button hover:bg-slate-100 hover:text-slate-900 p-1 px-2 mx-0.5 text-sm font-bold cursor-pointer transition-colors",
        dropdown_year:
          "relative z-20 inline-flex items-center justify-center rounded-button hover:bg-slate-100 hover:text-slate-900 p-1 px-2 mx-0.5 text-sm font-bold cursor-pointer transition-colors",
        dropdown:
          "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30 m-0 p-0 border-none appearance-none",
        dropdown_icon: "hidden",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
