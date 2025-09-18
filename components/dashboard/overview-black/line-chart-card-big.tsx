import * as React from "react";
import { useEffect, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import borderBg from "@/assets/chart-border-1563 x 767.png";
import { CalendarIcon } from "@/components/icons/calendar-icon";
import { IconShrink } from "@/components/icons/shrink";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTrend } from "@/queries/use-trend";
import { ChartDataItem } from "@/types/trend";
import { useShowTrend } from "../trends/trend-context";
import { ErrorComponent } from "./error-display";
import { LineChartBig } from "./line-chart-big";
import {
  LineChartBigContextProvider,
  useLineChartBig
} from "./line-chart-big-context";

const bigCalander = {
  caption_label: "text-lg font-medium",
  nav_button: cn(
    buttonVariants({ variant: "outline" }),
    "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100"
  ),
  head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[1.2rem]",
  cell: "relative p-0 text-center text-lg focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected])]:rounded-md",
  day: cn(
    buttonVariants({ variant: "ghost" }),
    "h-12 w-12 p-0 font-normal aria-selected:opacity-100 text-lg"
  )
};

type DgButtonVariant = "ALL" | "1" | "2" | "3" | "4";

export function LineChartCardBig() {
  const [activeGraph, setActiveGraph] = useState<DgButtonVariant>("ALL");

  const { trendTagName, to, from } = useShowTrend();

  const from_date = format(from, "dd-MM-yyyy");
  const to_date = format(to, "dd-MM-yyyy");

  const {
    data: responseData,
    error,
    refetch
  } = useTrend({
    tag1: trendTagName?.tag1 ?? "",
    tag2: trendTagName?.tag2 ?? "",
    tag3: trendTagName?.tag3 ?? "",
    tag4: trendTagName?.tag4 ?? "",
    to_date,
    from_date
  });

  const data = React.useMemo(() => {
    const filterdData = responseData?.trend
      .map(item => {
        if (activeGraph === "ALL") {
          return item;
        } else if (activeGraph === "1") {
          return { time: item.time, value1: item.value1 };
        } else if (activeGraph === "2") {
          return { time: item.time, value2: item.value2 };
        } else if (activeGraph === "3") {
          return { time: item.time, value3: item.value3 };
        } else if (activeGraph === "4") {
          return { time: item.time, value4: item.value4 };
        }
      })
      .filter(x => x !== undefined);
    return filterdData ?? [];
  }, [activeGraph, responseData]);

  if (!data) {
    return null;
  }

  return (
    <LineChartBigContextProvider>
      <Card className="relative isolate flex aspect-[1563/767] flex-col overflow-hidden rounded-[60px] bg-black p-[2.5%] lg:w-full xl:w-full 3xl:w-[1560px]">
        <Image
          src={borderBg}
          alt="border image"
          className="pointer-events-none absolute inset-0 z-10 select-none"
        />
        {trendTagName?.tag1 && trendTagName?.tag2 ? (
          <LineChartCardHeaderForMultiple
            activeGraph={activeGraph}
            setActiveGraph={setActiveGraph}
            data={data}
          />
        ) : (
          <LineChartCardHeaderForSingle
            title={trendTagName?.tag1Label ?? trendTagName?.tag1Label ?? ""}
            data={data}
          />
        )}
        <LineChartBgCartesianGrid />
        <CardContent className="relative flex-1 p-0 px-0 py-0">
          <LineChartBig
            data={data}
            label1={trendTagName?.tag1Label ?? trendTagName?.tag1Label ?? ""}
            label2={trendTagName?.tag2Label ?? trendTagName?.tag2Label ?? ""}
            label3={trendTagName?.tag3Label ?? trendTagName?.tag3Label ?? ""}
            label4={trendTagName?.tag4Label ?? trendTagName?.tag4Label ?? ""}
          />
        </CardContent>
        {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      </Card>
    </LineChartBigContextProvider>
  );
}

function LineChartCardHeaderForSingle({
  title,
  data
}: {
  title: string;
  data: ChartDataItem[];
}) {
  const { setShowTrendModal } = useShowTrend();
  const { setRange } = useLineChartBig();

  const reset = React.useCallback(() => {
    setRange({ left: 0, right: (data?.length ?? 1) - 1 });
  }, [data]);

  return (
    <CardHeader className="grid h-auto grid-cols-2 grid-rows-1 items-center p-0 px-4 pt-1 text-white">
      <div className="col-start-1 col-end-3 row-start-1 row-end-2 mx-auto mr-auto flex gap-10">
        <p className="font-russo font-bold lg:text-[27px] xl:text-[30px] 3xl:text-[40px]">
          {title}
        </p>
      </div>
      <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex gap-4 justify-self-end">
        <ResetZoomComponent reset={reset} />
        <SelectDateRange />
        <button
          onClick={() => setShowTrendModal(false)}
          className="rounded-[10px] border border-primary p-1.5 xl:h-[46px] 3xl:h-full"
        >
          <IconShrink className="lg:h-[32px] lg:w-[32px] xl:h-[30px] xl:w-[30px] 3xl:h-9 3xl:w-9" />
        </button>
      </div>
    </CardHeader>
  );
}
function LineChartCardHeaderForMultiple({
  activeGraph,
  setActiveGraph,
  data
}: {
  activeGraph: DgButtonVariant;
  setActiveGraph: React.Dispatch<React.SetStateAction<DgButtonVariant>>;
  data: ChartDataItem[];
}) {
  const { setShowTrendModal } = useShowTrend();
  const { setRange } = useLineChartBig();

  const reset = React.useCallback(() => {
    setRange({ left: 0, right: (data?.length ?? 1) - 1 });
  }, [data]);

  return (
    <CardHeader className="grid h-auto grid-cols-2 grid-rows-1 items-center p-0 px-4 pt-1 text-white">
      <div className="col-start-1 col-end-3 row-start-1 row-end-2 mx-auto mr-auto flex gap-10">
        <DgButton
          active={activeGraph === "ALL"}
          variant="ALL"
          onClick={() => setActiveGraph("ALL")}
        >
          ALL
        </DgButton>
        <DgButton
          active={activeGraph === "1"}
          variant="1"
          onClick={() => setActiveGraph(prev => (prev === "1" ? "ALL" : "1"))}
        >
          1
        </DgButton>
        <DgButton
          active={activeGraph === "2"}
          variant="2"
          onClick={() => setActiveGraph(prev => (prev === "2" ? "ALL" : "2"))}
        >
          2
        </DgButton>
        <DgButton
          active={activeGraph === "3"}
          variant="3"
          onClick={() => setActiveGraph(prev => (prev === "3" ? "ALL" : "3"))}
        >
          3
        </DgButton>
        <DgButton
          active={activeGraph === "4"}
          variant="4"
          onClick={() => setActiveGraph(prev => (prev === "4" ? "ALL" : "4"))}
        >
          4
        </DgButton>
      </div>
      <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex gap-4 justify-self-end">
        <ResetZoomComponent reset={reset} />
        <SelectDateRange />
        <button
          onClick={() => setShowTrendModal(false)}
          className="rounded-[10px] border border-primary p-1.5"
        >
          <IconShrink className="h-9 w-9" />
        </button>
      </div>
    </CardHeader>
  );
}

function ResetZoomComponent({ reset }: { reset: () => void }) {
  return (
    <button
      onClick={() => reset()}
      className="grid min-w-[50px] place-items-center rounded-[10px] border border-primary px-2"
    >
      Reset
    </button>
  );
}

function SelectDateRange() {
  const { from, setFrom, to, setTo } = useShowTrend();
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>(from);
  const [type, setType] = useState<"from" | "to">("from");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        newDate.setHours(
          value === "PM" ? currentHours + 12 : currentHours - 12
        );
      }
      setDate(newDate);
    }
  };

  useEffect(() => {
    if (type === "from" && date) {
      setFrom(date);
    }

    if (type === "to" && date) {
      setTo(date);
    }
  }, [date, type, setTo, setFrom]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogOverlay className="bg-black/50 backdrop-blur-[2px]" />
      <DialogTrigger asChild>
        <button className="flex items-center gap-0.5 rounded-[10px] border border-primary p-1.5">
          <ChevronLeft />
          <CalendarIcon className="lg:h-[32px] lg:w-[32px] xl:h-[30px] xl:w-[30px] 3xl:w-9 [&>path]:fill-white/80" />
          <ChevronRight />
        </button>
      </DialogTrigger>
      <DialogTitle className="sr-only"> Date Selector</DialogTitle>
      <DialogContent className="max-w-auto w-auto p-2" showCloseButton={false}>
        <div className="flex w-full items-center gap-2">
          <Button
            onClick={() => {
              setType("from");
              setDate(from);
            }}
            variant={type === "from" ? "outline" : "ghost"}
            className="flex-1 justify-center text-lg"
          >
            {format(from, "dd/MM/yyyy hh:mm aa")}
          </Button>
          <span>-</span>
          <Button
            onClick={() => {
              setType("to");
              setDate(to);
            }}
            variant={type === "to" ? "outline" : "ghost"}
            className="flex-1 justify-center text-lg"
          >
            {format(to, "dd/MM/yyyy hh:mm aa")}
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            size="icon"
            variant="secondary"
          >
            <ArrowRight />
          </Button>
        </div>
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            classNames={bigCalander}
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="relative flex p-2 sm:flex-col">
                {hours.reverse().map(hour => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square h-12 w-12 shrink-0 text-lg sm:w-full"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="aspect-square h-12 w-12 shrink-0 text-lg sm:w-full"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex p-2 sm:flex-col">
                {["AM", "PM"].map(ampm => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square h-12 w-12 shrink-0 text-lg sm:w-full"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DgButton({
  variant,
  children,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: DgButtonVariant;
  active?: boolean;
}) {
  const buttonStyles: Record<DgButtonVariant, string> = {
    ALL: "text-white",
    "1": "text-white",
    "2": "text-[#D75B5D]",
    "3": "text-[#03B381]",
    "4": "text-[#019FD6]"
  };
  const buttonActiveStyles: Record<DgButtonVariant, string> = {
    ALL: "shadow-[0px_0px_7px_3px_#FFFFFF]",
    "1": "shadow-[0px_0px_7px_3px_#FFFFFF]",
    "2": "shadow-[0px_0px_7px_3px_#D75B5D]",
    "3": "shadow-[0px_0px_7px_3px_#03B381]",
    "4": "shadow-[0px_0px_7px_3px_#019FD6]"
  };

  return (
    <button
      {...props}
      className={twMerge(
        "h-11 rounded-[10px] border-[1px] border-[#FFFFFF] px-[20px] text-center font-russo leading-[100%] transition-all duration-300 lg:text-[18px] xl:text-[20px] 3xl:text-[40px]",
        buttonStyles[variant],
        active && buttonActiveStyles[variant]
      )}
    >
      {children}
    </button>
  );
}

export function LineChartBgCartesianGrid() {
  return (
    <div className="pointer-events-none absolute inset-[10px] z-0 overflow-hidden rounded-lg">
      <svg width="100%" height="100%">
        {[...Array(100)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${i * 16}`}
            y1="0"
            x2={`${i * 16}`}
            y2="100%"
            stroke="white"
            strokeWidth="0.1"
          />
        ))}
        {[...Array(100)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${i * 16}`}
            x2="100%"
            y2={`${i * 16}`}
            stroke="white"
            strokeWidth="0.1"
          />
        ))}
      </svg>
    </div>
  );
}
