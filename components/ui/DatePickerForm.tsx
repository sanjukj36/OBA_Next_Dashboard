"use client";

import { Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "@/components/icons/calendar-icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // from useForm
  name: string; // field name
  minDate?: Date;
};

export function DatePickerForm({
  control,
  name,
  minDate
}: DatePickerFormProps) {
  if (!control || !name) {
    console.error("DatePickerForm: `control` or `name` prop is missing.");
    return null;
  }

  // Set minimum date to today if not provided
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  const minimumDate = minDate || today;

  return (
    <FormItem className="flex flex-col">
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[270px] border-none bg-transparent pl-3 text-left font-alexandria text-[15px] font-normal hover:bg-transparent hover:text-black",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={date =>
                    // Disable dates before the minimum date
                    date < minimumDate ||
                    // Optional: you might want to disable dates too far in the future
                    date >
                      new Date(new Date().setFullYear(today.getFullYear() + 10))
                  }
                  initialFocus
                  fromDate={minimumDate} // Only show dates from today onwards
                />
              </PopoverContent>
              <FormMessage />
            </Popover>
          );
        }}
      />
    </FormItem>
  );
}
