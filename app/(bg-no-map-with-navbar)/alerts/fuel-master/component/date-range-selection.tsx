"use client"

import React from "react";
import { ButtonWrapper } from "./tag-selection";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns";
import { useFuelmasterAlertsStore } from "@/store/fulemaster-alerts-store";

export function DateRangeSelection() {
  const { from_date, setFromDate, to_date, setToDate } = useFuelmasterAlertsStore()
  return (
    <div className="flex gap-4">
      <DateSelection date={from_date} setDate={setFromDate} />
      <DateSelection  date={to_date} setDate={setToDate} />
    </div>
  )
}

type DateSelectionProps = {
  date?: Date;
  setDate: (date?: Date) => void
}

function DateSelection({date, setDate}: DateSelectionProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonWrapper as="button" className="flex gap-2 items-center px-4 font-alexandria w-[156px]">
          <CalendarIcon size={16} />
          <span className="tracking-[0%] leading-[100%]">
            {date ? format(date, "dd-MM-yyyy") : "Select date"}
          </span>
        </ButtonWrapper>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(value) => setDate(value)}
        />
      </PopoverContent>
    </Popover>
  )
}
