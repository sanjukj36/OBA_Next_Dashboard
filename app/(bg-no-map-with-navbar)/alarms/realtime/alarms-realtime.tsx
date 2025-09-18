import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CalendarIcon } from "@/components/icons/calendar-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, formatLocaltoUtc } from "@/lib/utils";
import { useAcknowledgeRealtimeAlarmMutation } from "@/mutations/use-realtime-acknowledge-mutation";
import { useMLAlarmAnalyticsQuery } from "@/queries/use-get-ml-realtime-alarms-analaytics-query";
import { useAlarmsListQuery } from "@/queries/use-get-realtime-alarms-query";
import { useHistoricAlarmsListQuery } from "@/queries/use-get-realtime-alarms-query copy";
import { useSingleAlarmsDetailsQuery } from "@/queries/use-get-realtime-Single-alarms-details-query";
import { useRealtimeAlarmStore } from "@/store/realtime-alarm-store";
import { TagChartModal } from "./tag-chart-modal";

export type AlarmToggleType = "realtime" | "historic";

function AlarmsRealtime() {
  const {
    from_date: from,
    to_date: to,
    setToDate: setTo,
    setFromDate: setFrom,
    page,
    limit,
    sort
  } = useRealtimeAlarmStore();

  const [selectedSort, setSelectedSort] = useState<SortOption>("Ascending");
  const [selectedAlarm, setSelectedAlarm] =
    useState<AlarmToggleType>("realtime");

  const from_date = format(from, "dd-MM-yyyy");
  const to_date = format(to, "dd-MM-yyyy");

  useEffect(() => { }, [selectedAlarm]);

  const {
    data: alarmData,
    isLoading: alarmIsLoading,
    error: alarmError
  } = useAlarmsListQuery({
    page,
    limit,
    from_date,
    to_date,
    sort,
    enabled: selectedAlarm === "realtime"
  });

  const {
    data: historicData,
    isLoading: historicIsLoading,
    error: historicError
  } = useHistoricAlarmsListQuery({
    page,
    limit,
    from_date,
    to_date,
    sort,
    enabled: selectedAlarm === "historic"
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedId, setSelectedID] = useState<number | null>(null);

  const data = selectedAlarm === "historic" ? historicData : alarmData;
  const error = selectedAlarm === "historic" ? historicError : alarmError;
  const isLoading =
    selectedAlarm === "historic" ? historicIsLoading : alarmIsLoading;

  // Set initial selection once data is available
  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedIndex(0);
      setSelectedID(data[0].id);
    }
  }, [data]);

  // Handle select when selectedIndex changes
  useEffect(() => {
    if (selectedIndex !== null && data && data[selectedIndex]) {
      const alarmId = data[selectedIndex].id;
      setSelectedID(alarmId);
    }
  }, [selectedIndex, data]);

  return (
    <div className="w-full flex-1 rounded-lg border border-gray-700 p-[7px] "
      style={{
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/bgdisco.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          zIndex: -1,
          content: '""'
        }}
      />
      <div className="flex gap-0">
        {/* Left Side - Alarm List */}
        {isLoading ||
          (data && data?.length > 0 && (
            <div className="absolute -z-10 h-[979px] w-[602px] rounded-[10px] border border-stone-400 bg-gradient-to-r from-zinc-900 to-zinc-800" />
          ))}

        <div>
          {/* <div className="flex"> */}
          <div className="flex w-full flex-row items-center justify-between gap-4 py-4 ps-4 pe-10">
            <RealtimeHistoricToggle
              selected={selectedAlarm}
              setSelected={setSelectedAlarm}
            />
            <div className="flex gap-3">
              <SelectDateRange
                from={from}
                to={to}
                setFrom={setFrom}
                setTo={setTo}
              />
              <SortDropdown
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
              />
            </div>
            {/* </div> */}
          </div>

          {isLoading! || error || data?.length === 0 ? null : (
            <div className="scrollbar-none relative h-[897px] space-y-4 overflow-y-auto py-2 ps-2">
              {data &&
                data.length > 0 &&
                data.map((alarm, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <motion.div
                      className="flex"
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {/* <div className="flex h-[193px]" key={index}> */}
                      <div
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`relative w-[589px] cursor-pointer rounded-[20px] transition duration-200 ${isSelected
                          ? "bg-custom-gradient-ok border-2 border-black shadow-[0px_6px_12px_1px_rgba(0,0,0,1.00)]"
                          : "bg-custom-gradient-unselected"
                          }`}
                      >
                        <div className="flex-1 items-center justify-start px-4 py-4 font-alexandria">
                          <div className="flex-1 justify-between">
                            <div className="w-96 items-center font-alexandria text-[20px] text-white">
                              {alarm?.alarm_name || "N/A"}
                            </div>
                          </div>
                        </div>
                        {/* <div className="h-[50px] p-4"> */}
                        <div className="p-4 pt-0">
                          <p className="line-clamp-3 font-alexandria text-[15px]">
                            {alarm?.MlResponse?.possible_reasons || "N/A"}
                          </p>
                        </div>

                        {/* <div className="px-4 pt-8 ml-auto mt-2"> */}
                        <div className="px-4 ml-auto flex flex-col font-alexandria">
                          {/* <div className="absolute bottom-12 w-[96%] outline outline-1 outline-offset-[-0.5px] outline-zinc-500" /> */}
                          <div className="via-33% via-53% via-49% h-px w-full bg-gradient-to-r from-[#6E6E7A] via-[#F2F2FE] to-[#717483] opacity-50"></div>

                          <div className="ml-auto font-['Alexandria'] text-[15px] font-normal text-white">
                            <div className="item-center flex gap-2">
                              {/* <div className="h-2 w-2 shadow-[2px_3px_3.3px_0px_rgba(0,0,0,1.00)] outline outline-2 outline-offset-[-1px] outline-white" > */}
                              <ClockIcon className="mt-[2px]" />
                              <span className="font-alexandria text-[15px]">
                                {/* {formatVesselTime(alarm?.vessel_time) || "N/A"} */}
                                {formatLocaltoUtc(
                                  alarm?.vessel_time,
                                  "dd-MM-yyyy hh-mm"
                                ) || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="-z-10 ms-[4px] mt-[46px]">
                        {selectedId === alarm.id ? (
                          <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="z-10 h-[110px] w-[32px] text-white"
                          >
                            <SelectionArrow />
                          </motion.div>
                        ) : (
                          <div className="h-[110px] w-[32px] text-transparent" />
                        )}
                      </div>
                      {/* </div> */}
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Right Side - Details */}
        {data && data.length > 0 && (
          <div className="relative w-[66.54%] rounded-2xl bg-[#1A1A1A;] isolate">
            <div className="z-10 p-4 text-xl text-white">
              <SingleAlarmContentShow id={selectedId ?? 0} />
            </div>

            <div className="flex flex-col gap-2 px-8">
              <div className="flex justify-between">
                {selectedAlarm == "realtime" && (
                  <AcknowledgeButton id={selectedId ?? 0} />
                )}
              </div>

              <div className="flex justify-between">
                <div className="ml-auto font-alexandria text-base font-light text-white">
                  You are using Qwen 2.5 7B instruct AI model.
                </div>
              </div>
            </div>
          </div>
        )}
        {/* End Right Side - Details */}
      </div>

      {/* NO Data */}
      {data && data.length === 0 && (
        <div className="flex h-[80%] w-full items-center justify-center">
          <div className="bg-custom-gradient-unselected flex flex-col items-center justify-center gap-3 rounded-lg border border-primary/20 px-20 py-10">
            <NoAlarmsIcon />
            <p className="text-center font-alexandria text-[20px] text-white">
              No alarms were found in the selected date range
            </p>
            <p className="text-center font-alexandria text-[20px] text-white">
              From <strong>{from_date}</strong> To <strong>{to_date}</strong>
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex h-[80%] w-full items-center justify-center">
          <div className="bg-custom-gradient-unselected flex flex-col items-center justify-center gap-3 rounded-lg border border-primary/20 px-20 py-10">
            <NoAlarmsIcon />
            <p className="text-center font-alexandria text-[20px] text-white">
              {error.message}
            </p>
          </div>
        </div>
      )}
      {/*End NO Data */}
    </div>
  );
}

export default AlarmsRealtime;

const SingleAlarmContentShow = ({ id }: { id: number }) => {
  const { data, isLoading, error } = useSingleAlarmsDetailsQuery({ id });

  return (
    <div className="relative p-4">
      {/* Blur Overlay */}
      {error && (
        <div className="pointer-events-none absolute inset-0 z-20 rounded-[10px] bg-black/30 backdrop-blur-sm">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-white">
            {/* <AlertTriangle className="h-8 w-8 text-red-500" /> */}
            <p className="font-alexandria text-xl text-red-700">
              Failed to load alarm details.
            </p>
            <p className="text-[15px] text-gray-400">
              {(error as Error)?.message || "Something went wrong."}
            </p>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-20 rounded-[10px] bg-black/30 backdrop-blur-sm" />
      )}

      <div className="relative z-10 h-full w-full">
        <div className="h-full w-full">
          <div className="h-full w-full text-start font-alexandria text-[25px] font-normal text-white">
            <motion.div
              className="inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="mb-[24px] inline-flex items-center gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <AlarmIcon />
                <span>{data?.alarm_name || "Alarm Name Not Available"}</span>
              </motion.div>

              <motion.div
                className="via-33% via-53% via-49% h-px w-full bg-gradient-to-r from-[#6E6E7A] via-[#F2F2FE] to-[#717483] opacity-50"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>
          </div>

          <div className="mt-[30px] h-[725px] overflow-y-auto">
            <div className="my-[18px] flex gap-3 text-start font-alexandria text-2xl font-normal text-white">
              <PossibleReasonsIcon />
              <span>Possible Reason</span>
            </div>
            <div className="bg-custom-gradient-ok h-auto w-full rounded-[10px] p-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="items-center justify-center font-alexandria text-xl font-light text-white">
                  {data?.MlResponse?.possible_reasons ||
                    "Possible reason not available."}
                </span>
              </motion.div>
            </div>
            <div className="my-[18px] flex gap-2 text-start font-alexandria text-2xl font-normal text-white">
              <PossibleReasonsIcon />
              <span>Corrective Actions</span>
            </div>
            <div className="bg-custom-gradient-ok h-auto w-full rounded-[10px] p-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="block font-alexandria text-xl font-light text-white">
                  {data?.MlResponse?.corrective_actions ||
                    "Possible reason not available."}
                </span>
              </motion.div>
            </div>

            <div className="my-[18px] flex gap-2 text-start font-alexandria text-2xl font-normal text-white">
              <PossibleReasonsIcon />
              <span>Suspected Tags</span>
            </div>

            <div className="bg-custom-gradient-ok h-auto w-auto max-w-full rounded-[10px] p-7">
              {data?.suspected_tags && data.suspected_tags.length > 0 ? (
                <div
                  className={`grid gap-3 ${data.suspected_tags.length > 2
                    ? "grid-cols-3"
                    : data.suspected_tags.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-1"
                    }`}
                >
                  {data.suspected_tags.map((tag: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ShowTag
                        tag={tag}
                        id={data?.id}
                        date={data?.vesseldata?.vesselTimeStamp}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <span className="block font-['Alexandria'] text-xl font-light text-white">
                  No suspected tags available.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectionArrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={32}
    height={110}
    viewBox="0 0 32 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M26.832 47.8057C29.3679 52.2639 29.3605 57.7299 26.8115 62.1807L0.5 108.121V1.50977L26.832 47.8057Z"
      fill="url(#paint0_linear_3518_19729)"
      stroke="url(#paint1_linear_3518_19729)"
    />
    <path
      d="M6 37.3508L7.93343 34L18.4643 52.2619C18.6341 52.5545 18.7688 52.9025 18.8607 53.2858C18.9527 53.6691 19 54.0801 19 54.4953C19 54.9104 18.9527 55.3214 18.8607 55.7047C18.7688 56.088 18.6341 56.436 18.4643 56.7286L7.93343 75L6.00182 71.6492L15.8858 54.5L6 37.3508Z"
      fill="white"
    />
    <path d="M0 1.76172L1 3.40234V106.231L0 108V1.76172Z" fill="#262629" />
    <defs>
      <linearGradient
        id="paint0_linear_3518_19729"
        x1={29}
        y1={57}
        x2={1.9962e-7}
        y2={56.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#191919" />
        <stop offset={1} stopColor="#27272A" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3518_19729"
        x1={15.75}
        y1={0}
        x2={15.75}
        y2={110}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#CECECE" />
        <stop offset={0.480769} stopColor="#555555" />
        <stop offset={1} stopColor="#CECECE" />
      </linearGradient>
    </defs>
  </svg>
);

function isValidDate(d: Date): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

export function SelectDateRange({
  from,
  to,
  setFrom,
  setTo
}: {
  from: Date;
  to: Date;
  setFrom: (d: Date) => void;
  setTo: (d: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date(from));
  const [type, setType] = useState<"from" | "to">("from");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (
    field: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (!isValidDate(date)) return;

    const newDate = new Date(date);
    if (field === "hour") {
      const hour = parseInt(value);
      const currentHours = newDate.getHours();
      const isPM = currentHours >= 12;
      newDate.setHours((hour % 12) + (isPM ? 12 : 0));
    } else if (field === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (field === "ampm") {
      const currentHours = newDate.getHours();
      const isCurrentlyPM = currentHours >= 12;
      const shouldBePM = value === "PM";

      if (shouldBePM && !isCurrentlyPM) {
        newDate.setHours(currentHours + 12);
      } else if (!shouldBePM && isCurrentlyPM) {
        newDate.setHours(currentHours - 12);
      }
    }

    setDate(newDate);
  };

  useEffect(() => {
    if (type === "from" && isValidDate(date)) {
      setFrom(date);
    } else if (type === "to" && isValidDate(date)) {
      setTo(date);
    }
  }, [date, type, setFrom, setTo]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogOverlay className="bg-black/50 backdrop-blur-[2px]" />
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-start gap-2 rounded-[10px] border border-[#626262] bg-[linear-gradient(90deg,_#1B1B1B_0%,_#2F2F2F_100%)] p-4 py-1.5 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline-offset-[-0.50px] outline-neutral-400/50">
          {/* // className="flex items-center gap-0.5 rounded-[10px] border border-[#626262] bg-[linear-gradient(90deg,_#1B1B1B_0%,_#2F2F2F_100%)] p-1.5 pe-8 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)]"> */}
          {/* <ChevronLeft /> */}
          {/* <CalendarIcon className="lg:h-[32px] lg:w-[32px] xl:h-[30px] xl:w-[30px] 3xl:w-[19px] [&>path]:fill-white/80" /> */}
          <CalendarIcon className="lg:h-[18px] lg:w-[18px] xl:h-[20px] xl:w-[20px] 3xl:w-[19px] [&>path]:fill-white" />
          {/* <ChevronRight />
          <span className="font-alexandria text-[20px]">Choose Date</span> */}
        </button>
      </DialogTrigger>
      <DialogTitle className="sr-only">Date Selector</DialogTitle>
      <DialogContent className="max-w-auto w-auto p-2" showCloseButton={false}>
        <div className="flex w-full items-center gap-2">
          <Button
            onClick={() => {
              setType("from");
              setDate(new Date(from));
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
              setDate(new Date(to));
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
                {[...hours].reverse().map(hour => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      isValidDate(date) && date.getHours() % 12 === hour % 12
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
                      isValidDate(date) && date.getMinutes() === minute
                        ? "default"
                        : "ghost"
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

            <ScrollArea>
              <div className="flex p-2 sm:flex-col">
                {["AM", "PM"].map(ampm => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      isValidDate(date) &&
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

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 1.5C13.1423 1.5 16.5 4.85775 16.5 9C16.5 13.1423 13.1423 16.5 9 16.5C4.85775 16.5 1.5 13.1423 1.5 9C1.5 4.85775 4.85775 1.5 9 1.5ZM9 3C7.4087 3 5.88258 3.63214 4.75736 4.75736C3.63214 5.88258 3 7.4087 3 9C3 10.5913 3.63214 12.1174 4.75736 13.2426C5.88258 14.3679 7.4087 15 9 15C10.5913 15 12.1174 14.3679 13.2426 13.2426C14.3679 12.1174 15 10.5913 15 9C15 7.4087 14.3679 5.88258 13.2426 4.75736C12.1174 3.63214 10.5913 3 9 3ZM9 4.5C9.1837 4.50002 9.361 4.56747 9.49828 4.68954C9.63556 4.81161 9.72326 4.97981 9.74475 5.16225L9.75 5.25V8.6895L11.7802 10.7198C11.9148 10.8547 11.9929 11.0358 11.9987 11.2263C12.0045 11.4167 11.9376 11.6023 11.8116 11.7452C11.6855 11.8881 11.5098 11.9777 11.3201 11.9958C11.1305 12.0139 10.941 11.9591 10.7902 11.8425L10.7198 11.7802L8.46975 9.53025C8.35318 9.41358 8.27832 9.26175 8.25675 9.09825L8.25 9V5.25C8.25 5.05109 8.32902 4.86032 8.46967 4.71967C8.61032 4.57902 8.80109 4.5 9 4.5Z"
      fill="white"
    />
  </svg>
);

const options = ["Ascending", "Descending"] as const;

type SortOption = (typeof options)[number];

type SortDropdownProps = {
  selectedSort: SortOption;
  setSelectedSort: (option: SortOption) => void;
};

const SortDropdown: React.FC<SortDropdownProps> = ({
  selectedSort,
  setSelectedSort
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { setSort } = useRealtimeAlarmStore();

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleSortChange = (option: SortOption) => {
    setSelectedSort(option);
    setSort(option == "Ascending" ? "asc" : "desc");

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center justify-start gap-2 rounded-[10px] border border-[#626262] bg-[linear-gradient(90deg,_#1B1B1B_0%,_#2F2F2F_100%)] p-4 py-1.5 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline-offset-[-0.50px] outline-neutral-400/50"
      >
        <SortIcon className="lg:h-[18px] lg:w-[18px] xl:h-[20px] xl:w-[20px] 3xl:w-[19px] [&>path]:fill-white" />
        {/* <div className="justify-start font-['Alexandria'] text-xl font-normal text-white [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)]">
          Sort by
        </div> */}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 space-y-2 rounded-md bg-gradient-to-r from-zinc-900 to-zinc-800 p-2 shadow-[3px_5px_9.4px_0px_rgba(0,0,0,1.00)] outline outline-1 outline-zinc-600">
          {options.map(option => (
            <div
              key={option}
              onClick={() => handleSortChange(option)}
              className={`flex cursor-pointer items-center gap-2 px-2 py-[15px] font-['Alexandria'] text-xl ${selectedSort === option
                ? "font-light text-white [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)]"
                : "font-light text-white opacity-50 [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)]"
                }`}
            >
              {option == "Ascending" ? (
                <AscendingSortIcon />
              ) : (
                <DescendingSortIcon />
              )}

              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SortIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={21}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_3590_15534)">
      <path
        d="M14.2902 11.2899L10.0002 15.5899L5.71019 11.2899C5.52188 11.1016 5.26649 10.9958 5.00019 10.9958C4.73388 10.9958 4.47849 11.1016 4.29019 11.2899C4.10188 11.4782 3.99609 11.7336 3.99609 11.9999C3.99609 12.2662 4.10188 12.5216 4.29019 12.7099L9.29019 17.7099C9.38315 17.8037 9.49375 17.8781 9.61561 17.9288C9.73747 17.9796 9.86817 18.0057 10.0002 18.0057C10.1322 18.0057 10.2629 17.9796 10.3848 17.9288C10.5066 17.8781 10.6172 17.8037 10.7102 17.7099L15.7102 12.7099C15.8034 12.6167 15.8774 12.506 15.9278 12.3842C15.9783 12.2624 16.0043 12.1318 16.0043 11.9999C16.0043 11.8681 15.9783 11.7375 15.9278 11.6157C15.8774 11.4939 15.8034 11.3832 15.7102 11.2899C15.6169 11.1967 15.5063 11.1227 15.3844 11.0723C15.2626 11.0218 15.132 10.9958 15.0002 10.9958C14.8683 10.9958 14.7378 11.0218 14.6159 11.0723C14.4941 11.1227 14.3834 11.1967 14.2902 11.2899ZM5.71019 6.70994L10.0002 2.40994L14.2902 6.70994C14.3831 6.80367 14.4937 6.87806 14.6156 6.92883C14.7375 6.9796 14.8682 7.00574 15.0002 7.00574C15.1322 7.00574 15.2629 6.9796 15.3848 6.92883C15.5066 6.87806 15.6172 6.80367 15.7102 6.70994C15.8039 6.61698 15.8783 6.50637 15.9291 6.38452C15.9798 6.26266 16.006 6.13195 16.006 5.99994C16.006 5.86793 15.9798 5.73722 15.9291 5.61536C15.8783 5.4935 15.8039 5.3829 15.7102 5.28994L10.7102 0.289939C10.6172 0.196211 10.5066 0.121816 10.3848 0.0710475C10.2629 0.0202789 10.1322 -0.00585938 10.0002 -0.00585938C9.86817 -0.00585938 9.73747 0.0202789 9.61561 0.0710475C9.49375 0.121816 9.38315 0.196211 9.29019 0.289939L4.29019 5.28994C4.19695 5.38318 4.12299 5.49387 4.07253 5.61569C4.02207 5.73751 3.99609 5.86808 3.99609 5.99994C3.99609 6.26624 4.10188 6.52164 4.29019 6.70994C4.47849 6.89824 4.73388 7.00403 5.00019 7.00403C5.26649 7.00403 5.52188 6.89824 5.71019 6.70994Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_3590_15534"
        x={-0.00390625}
        y={-0.00585938}
        width={20.0117}
        height={26.0117}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3590_15534"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3590_15534"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const NoAlarmsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={53}
    height={53}
    viewBox="0 0 53 53"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.0706 43.6045C12.0706 44.4345 12.7173 45.1051 13.5177 45.1051H39.4743C40.2747 45.1051 40.9214 44.4345 40.9214 43.6045V32.6779C40.9214 24.415 34.4639 17.7184 26.496 17.7184C18.5281 17.7184 12.0706 24.415 12.0706 32.6779V43.6045ZM15.3265 32.6779C15.3265 26.2814 20.3279 21.0948 26.496 21.0948C32.6641 21.0948 37.6655 26.2814 37.6655 32.6779V41.7287H21.6122V33.7096C21.6122 33.4517 21.4087 33.2407 21.16 33.2407H19.1703C18.9216 33.2407 18.7181 33.4517 18.7181 33.7096V41.7287H15.3265V32.6779ZM13.1514 20.8369L14.9421 18.9799C15.0823 18.8345 15.0823 18.5953 14.9421 18.4499L11.8717 15.2658C11.8037 15.196 11.7119 15.1568 11.6162 15.1568C11.5205 15.1568 11.4287 15.196 11.3607 15.2658L9.56994 17.1228C9.50261 17.1933 9.46484 17.2885 9.46484 17.3878C9.46484 17.487 9.50261 17.5822 9.56994 17.6527L12.6404 20.8369C12.7806 20.9823 13.0067 20.9823 13.1514 20.8369ZM43.4311 17.1228L41.6404 15.2658C41.5724 15.196 41.4806 15.1568 41.3849 15.1568C41.2892 15.1568 41.1974 15.196 41.1294 15.2658L38.0589 18.4499C37.9916 18.5205 37.9538 18.6157 37.9538 18.7149C37.9538 18.8141 37.9916 18.9094 38.0589 18.9799L39.8497 20.8369C39.9898 20.9823 40.2205 20.9823 40.3607 20.8369L43.4311 17.6527C43.5713 17.5027 43.5713 17.2682 43.4311 17.1228ZM40.9666 48.1064H12.0254C11.225 48.1064 10.5784 48.777 10.5784 49.6071V50.7325C10.5784 50.9389 10.7412 51.1077 10.9401 51.1077H42.0519C42.2509 51.1077 42.4137 50.9389 42.4137 50.7325V49.6071C42.4137 48.777 41.767 48.1064 40.9666 48.1064ZM25.2298 14.7171H27.7622C27.9612 14.7171 28.124 14.5483 28.124 14.3419V9.84C28.124 9.63367 27.9612 9.46484 27.7622 9.46484H25.2298C25.0309 9.46484 24.8681 9.63367 24.8681 9.84V14.3419C24.8681 14.5483 25.0309 14.7171 25.2298 14.7171Z"
      fill="#FACC15"
    />
  </svg>
);

const AlarmIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={22}
    height={26}
    viewBox="0 0 22 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.28815 21.3275C2.28815 21.8286 2.67859 22.2335 3.16185 22.2335H18.8338C19.317 22.2335 19.7075 21.8286 19.7075 21.3275V14.7303C19.7075 9.74136 15.8086 5.69811 10.9978 5.69811C6.18702 5.69811 2.28815 9.74136 2.28815 14.7303V21.3275ZM4.25397 14.7303C4.25397 10.8683 7.27368 7.73672 10.9978 7.73672C14.7219 7.73672 17.7417 10.8683 17.7417 14.7303V20.1949H8.04909V15.3532C8.04909 15.1975 7.92623 15.0701 7.77606 15.0701H6.57473C6.42456 15.0701 6.3017 15.1975 6.3017 15.3532V20.1949H4.25397V14.7303ZM2.94069 7.581L4.02189 6.45976C4.10653 6.37199 4.10653 6.22759 4.02189 6.13981L2.16802 4.21729C2.12697 4.17513 2.07153 4.15149 2.01376 4.15149C1.95598 4.15149 1.90055 4.17513 1.8595 4.21729L0.778296 5.33852C0.737647 5.3811 0.714844 5.43859 0.714844 5.4985C0.714844 5.55841 0.737647 5.6159 0.778296 5.65847L2.63217 7.581C2.71681 7.66877 2.85332 7.66877 2.94069 7.581ZM21.2228 5.33852L20.1416 4.21729C20.1005 4.17513 20.0451 4.15149 19.9873 4.15149C19.9296 4.15149 19.8741 4.17513 19.8331 4.21729L17.9792 6.13981C17.9385 6.18238 17.9157 6.23987 17.9157 6.29979C17.9157 6.3597 17.9385 6.41719 17.9792 6.45976L19.0604 7.581C19.145 7.66877 19.2843 7.66877 19.3689 7.581L21.2228 5.65847C21.3074 5.56787 21.3074 5.4263 21.2228 5.33852ZM19.7348 24.0456H2.26085C1.77759 24.0456 1.38715 24.4505 1.38715 24.9517V25.6312C1.38715 25.7558 1.48544 25.8577 1.60558 25.8577H20.3901C20.5102 25.8577 20.6085 25.7558 20.6085 25.6312V24.9517C20.6085 24.4505 20.218 24.0456 19.7348 24.0456ZM10.2333 3.88601H11.7623C11.8824 3.88601 11.9807 3.78408 11.9807 3.6595V0.941356C11.9807 0.816774 11.8824 0.714844 11.7623 0.714844H10.2333C10.1132 0.714844 10.0149 0.816774 10.0149 0.941356V3.6595C10.0149 3.78408 10.1132 3.88601 10.2333 3.88601Z"
      fill="white"
    />
  </svg>
);

const PossibleReasonsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={29}
    height={29}
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.21318 16.916C5.30651 15.4312 4.82849 13.7245 4.83205 11.9848C4.83205 6.69956 9.1603 2.41602 14.4987 2.41602C19.8371 2.41602 24.1654 6.69956 24.1654 11.9848C24.1689 13.7245 23.6909 15.4312 22.7843 16.916M18.1237 22.9577L17.9666 23.7395C17.7975 24.5938 17.7117 25.0203 17.5196 25.3586C17.2235 25.8801 16.7442 26.2729 16.1747 26.4606C15.8061 26.5827 15.3687 26.5827 14.4987 26.5827C13.6287 26.5827 13.1913 26.5827 12.8228 26.4618C12.2531 26.2738 11.7737 25.8806 11.4779 25.3586C11.2858 25.0203 11.2 24.5938 11.0308 23.7395L10.8737 22.9577M8.91984 20.6594C8.80868 20.3259 8.75309 20.158 8.75913 20.0226C8.76597 19.8827 8.8132 19.7478 8.89512 19.6341C8.97704 19.5204 9.09013 19.433 9.22072 19.3822C9.34638 19.3327 9.5228 19.3327 9.87322 19.3327H19.1242C19.4758 19.3327 19.651 19.3327 19.7767 19.381C19.9075 19.4318 20.0207 19.5195 20.1026 19.6334C20.1846 19.7473 20.2317 19.8825 20.2383 20.0226C20.2443 20.158 20.1888 20.3247 20.0776 20.6594C19.8722 21.2769 19.7695 21.5862 19.6112 21.8363C19.2801 22.3591 18.7611 22.7349 18.1612 22.8864C17.8736 22.9577 17.5498 22.9577 16.9009 22.9577H12.0966C11.4477 22.9577 11.1226 22.9577 10.8363 22.8852C10.2365 22.734 9.71757 22.3586 9.38626 21.8363C9.22797 21.5862 9.12526 21.2769 8.91984 20.6594Z"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.8696 14.4989L13.1042 9.036C13.0431 8.86381 12.9293 8.71524 12.779 8.61135C12.6287 8.50746 12.4495 8.45353 12.2668 8.45721C12.0841 8.45353 11.9049 8.50746 11.7546 8.61135C11.6043 8.71524 11.4906 8.86381 11.4294 9.036L9.66406 14.4989M18.1224 8.45721V14.4989M10.3141 12.6864H14.2183"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={50}
    height={48}
    viewBox="0 0 50 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_3620_15597)">
      <rect
        x={8}
        y={6}
        width={28}
        height={26}
        rx={6}
        fill="url(#paint0_linear_3620_15597)"
      />
      <rect x={7.5} y={5.5} width={29} height={27} rx={6.5} stroke="#626262" />
    </g>
    <path
      d="M15.8346 12.334V24.334H28.5846V25.6673H14.418V12.334H15.8346ZM24.3346 15.0007H28.5846V19.0007H27.168V17.2827L26.0495 18.3327L24.1271 20.138L23.6263 20.6093L20.793 17.9427L17.2513 21.276L16.2497 20.334L20.793 16.0573L23.6263 18.724L25.0493 17.3887L26.1721 16.334H24.3346V15.0007Z"
      fill="white"
    />
    <defs>
      <filter
        id="filter0_d_3620_15597"
        x={0.6}
        y={0.6}
        width={48.8}
        height={46.8}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={3} dy={5} />
        <feGaussianBlur stdDeviation={4.7} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3620_15597"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3620_15597"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_3620_15597"
        x1={8}
        y1={19}
        x2={36}
        y2={19}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2C2C2C" />
        <stop offset={1} stopColor="#2F2F2F" />
      </linearGradient>
    </defs>
  </svg>
);

const AscendingSortIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={21}
    height={21}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_3633_15404)">
      <path
        d="M13.2704 14C13.1745 13.9996 13.0794 14.0153 12.9908 14.0462C12.9022 14.077 12.8218 14.1224 12.7544 14.1797L7.42871 18.6472L2.10302 14.1797C1.96459 14.0715 1.78151 14.0126 1.59233 14.0154C1.40316 14.0182 1.22266 14.0825 1.08887 14.1947C0.955087 14.3069 0.878452 14.4583 0.875114 14.617C0.871776 14.7757 0.941996 14.9293 1.07098 15.0454L6.9127 19.9459C7.04961 20.0606 7.23521 20.125 7.42871 20.125C7.62222 20.125 7.80782 20.0606 7.94473 19.9459L13.7864 15.0454C13.9232 14.9306 14 14.7749 14 14.6126C14 14.4502 13.9232 14.2945 13.7864 14.1797C13.719 14.1224 13.6387 14.077 13.55 14.0462C13.4614 14.0153 13.3664 13.9996 13.2704 14Z"
        fill="white"
      />
      <path
        d="M7.4375 0.875C7.32194 0.878216 7.21153 0.977385 7.12981 1.15137C7.04809 1.32536 7.00151 1.56042 7 1.80645V19.1935C7 19.4406 7.04609 19.6775 7.12814 19.8522C7.21019 20.0269 7.32147 20.125 7.4375 20.125C7.55353 20.125 7.66481 20.0269 7.74686 19.8522C7.82891 19.6775 7.875 19.4406 7.875 19.1935V1.80645C7.87349 1.56042 7.82691 1.32536 7.74519 1.15137C7.66347 0.977385 7.55306 0.878216 7.4375 0.875Z"
        fill="white"
      />
      <g filter="url(#filter0_d_3633_15404)">
        <path
          d="M19.6875 1.75H18.8125V1.3125C18.8125 1.19647 18.7664 1.08519 18.6844 1.00314C18.6023 0.921094 18.491 0.875 18.375 0.875C18.259 0.875 18.1477 0.921094 18.0656 1.00314C17.9836 1.08519 17.9375 1.19647 17.9375 1.3125V1.75H15.3125V1.3125C15.3125 1.19647 15.2664 1.08519 15.1844 1.00314C15.1023 0.921094 14.991 0.875 14.875 0.875C14.759 0.875 14.6477 0.921094 14.5656 1.00314C14.4836 1.08519 14.4375 1.19647 14.4375 1.3125V1.75H13.5625C13.2144 1.75 12.8806 1.88828 12.6344 2.13442C12.3883 2.38056 12.25 2.7144 12.25 3.0625V8.3125C12.25 8.6606 12.3883 8.99444 12.6344 9.24058C12.8806 9.48672 13.2144 9.625 13.5625 9.625H19.6875C20.0356 9.625 20.3694 9.48672 20.6156 9.24058C20.8617 8.99444 21 8.6606 21 8.3125V3.0625C21 2.7144 20.8617 2.38056 20.6156 2.13442C20.3694 1.88828 20.0356 1.75 19.6875 1.75ZM20.125 8.3125C20.125 8.42853 20.0789 8.53981 19.9969 8.62186C19.9148 8.70391 19.8035 8.75 19.6875 8.75H13.5625C13.4465 8.75 13.3352 8.70391 13.2531 8.62186C13.1711 8.53981 13.125 8.42853 13.125 8.3125V5.25H20.125V8.3125ZM20.125 4.375H13.125V3.0625C13.125 2.94647 13.1711 2.83519 13.2531 2.75314C13.3352 2.67109 13.4465 2.625 13.5625 2.625H14.4375V3.0625C14.4375 3.17853 14.4836 3.28981 14.5656 3.37186C14.6477 3.45391 14.759 3.5 14.875 3.5C14.991 3.5 15.1023 3.45391 15.1844 3.37186C15.2664 3.28981 15.3125 3.17853 15.3125 3.0625V2.625H17.9375V3.0625C17.9375 3.17853 17.9836 3.28981 18.0656 3.37186C18.1477 3.45391 18.259 3.5 18.375 3.5C18.491 3.5 18.6023 3.45391 18.6844 3.37186C18.7664 3.28981 18.8125 3.17853 18.8125 3.0625V2.625H19.6875C19.8035 2.625 19.9148 2.67109 19.9969 2.75314C20.0789 2.83519 20.125 2.94647 20.125 3.0625V4.375Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_3633_15404"
        x={8.25}
        y={0.875}
        width={16.75}
        height={16.75}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3633_15404"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3633_15404"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_3633_15404">
        <rect width={21} height={21} fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const DescendingSortIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={21}
    height={18}
    viewBox="0 0 21 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.2704 6.62499C13.1745 6.62537 13.0794 6.60968 12.9908 6.57882C12.9022 6.54797 12.8218 6.50257 12.7544 6.44531L7.42871 1.97776L2.10302 6.44531C1.96459 6.55351 1.78151 6.61242 1.59233 6.60962C1.40316 6.60682 1.22266 6.54253 1.08887 6.4303C0.955087 6.31807 0.878452 6.16666 0.875114 6.00797C0.871776 5.84927 0.941996 5.69569 1.07098 5.57957L6.9127 0.679143C7.04961 0.564432 7.23521 0.5 7.42871 0.5C7.62222 0.5 7.80782 0.564432 7.94473 0.679143L13.7864 5.57957C13.9232 5.69442 14 5.85011 14 6.01244C14 6.17477 13.9232 6.33046 13.7864 6.44531C13.719 6.50257 13.6387 6.54797 13.55 6.57882C13.4614 6.60968 13.3664 6.62537 13.2704 6.62499Z"
      fill="white"
    />
    <path
      d="M7.4375 19.75C7.32194 19.7468 7.21153 19.6476 7.12981 19.4736C7.04809 19.2996 7.00151 19.0646 7 18.8185V1.43145C7 1.18442 7.04609 0.947497 7.12814 0.772816C7.21019 0.598135 7.32147 0.5 7.4375 0.5C7.55353 0.5 7.66481 0.598135 7.74686 0.772816C7.82891 0.947497 7.875 1.18442 7.875 1.43145V18.8185C7.87349 19.0646 7.82691 19.2996 7.74519 19.4736C7.66347 19.6476 7.55306 19.7468 7.4375 19.75Z"
      fill="white"
    />
    <g filter="url(#filter0_d_1354_260)">
      <path
        d="M19.6875 10.125H18.8125V9.6875C18.8125 9.57147 18.7664 9.46019 18.6844 9.37814C18.6023 9.29609 18.491 9.25 18.375 9.25C18.259 9.25 18.1477 9.29609 18.0656 9.37814C17.9836 9.46019 17.9375 9.57147 17.9375 9.6875V10.125H15.3125V9.6875C15.3125 9.57147 15.2664 9.46019 15.1844 9.37814C15.1023 9.29609 14.991 9.25 14.875 9.25C14.759 9.25 14.6477 9.29609 14.5656 9.37814C14.4836 9.46019 14.4375 9.57147 14.4375 9.6875V10.125H13.5625C13.2144 10.125 12.8806 10.2633 12.6344 10.5094C12.3883 10.7556 12.25 11.0894 12.25 11.4375V16.6875C12.25 17.0356 12.3883 17.3694 12.6344 17.6156C12.8806 17.8617 13.2144 18 13.5625 18H19.6875C20.0356 18 20.3694 17.8617 20.6156 17.6156C20.8617 17.3694 21 17.0356 21 16.6875V11.4375C21 11.0894 20.8617 10.7556 20.6156 10.5094C20.3694 10.2633 20.0356 10.125 19.6875 10.125ZM20.125 16.6875C20.125 16.8035 20.0789 16.9148 19.9969 16.9969C19.9148 17.0789 19.8035 17.125 19.6875 17.125H13.5625C13.4465 17.125 13.3352 17.0789 13.2531 16.9969C13.1711 16.9148 13.125 16.8035 13.125 16.6875V13.625H20.125V16.6875ZM20.125 12.75H13.125V11.4375C13.125 11.3215 13.1711 11.2102 13.2531 11.1281C13.3352 11.0461 13.4465 11 13.5625 11H14.4375V11.4375C14.4375 11.5535 14.4836 11.6648 14.5656 11.7469C14.6477 11.8289 14.759 11.875 14.875 11.875C14.991 11.875 15.1023 11.8289 15.1844 11.7469C15.2664 11.6648 15.3125 11.5535 15.3125 11.4375V11H17.9375V11.4375C17.9375 11.5535 17.9836 11.6648 18.0656 11.7469C18.1477 11.8289 18.259 11.875 18.375 11.875C18.491 11.875 18.6023 11.8289 18.6844 11.7469C18.7664 11.6648 18.8125 11.5535 18.8125 11.4375V11H19.6875C19.8035 11 19.9148 11.0461 19.9969 11.1281C20.0789 11.2102 20.125 11.3215 20.125 11.4375V12.75Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1354_260"
        x={8.25}
        y={9.25}
        width={16.75}
        height={16.75}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1354_260"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1354_260"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

type AcknowledgeButtonProps = {
  id: number;
};

const AcknowledgeButton: React.FC<AcknowledgeButtonProps> = ({
  id
}: {
  id: number | null;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    // mutateAsync: acknowledgeAlarm,
    mutate: acknowledgeAlarm
  } = useAcknowledgeRealtimeAlarmMutation();

  const handleConfirm = async () => {
    if (id === null) return;
    try {
      await acknowledgeAlarm({ id }); // ✅ properly defined now
      // setIsAcknowledged(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Acknowledge failed", err);
    }
  };

  return (
    <>
      {/* Acknowledge Button */}
      <div
        onClick={() => {
          setIsModalOpen(true);
        }}
        className={`bg-custom-gradient-ok hover:bg-custom-gradient flex h-11 cursor-pointer items-center justify-center gap-3 rounded-[10px] p-5 shadow-md transition-all font-alexandria`}
      >
        <span className="font-alexandria text-[20px] text-white">
          Acknowledge
        </span>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogOverlay className="bg-black/50 backdrop-blur-[2px]" />
        <DialogTitle />
        <DialogContent
          className="w-full font-alexandria max-w-md rounded-[12px]  border border-[#626262] bg-[linear-gradient(90deg,_#1B1B1B_0%,_#2F2F2F_100%)] p-6 shadow-md"
          showCloseButton={false}
        >
          {/* Centered Text */}
          <div className="mt-[29px] flex items-center justify-center text-center ">
            <p className="text-[25px] text-white text-left ml-10 mt-[-24px] font-light">
              Are you sure you want to acknowledge this?{" "}
            </p>
          </div>

          <div className="mb-3 mt-6 flex justify-center gap-28 font-alexandria text-[18px]">
            <Button
              variant="secondary"
              onClick={handleConfirm}
              className="h-[34px] w-[76px] border border-[#626262] bg-black text-[18px]"
            >
              Yes
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="h-[34px] w-[76px] border border-[#626262] bg-black text-[18px]"
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ShowTagProps {
  tag: string;
  id: number;
  date: string;
}

const ShowTag: React.FC<ShowTagProps> = ({ tag, id, date }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // const { from_date, to_date } = useRealtimeAlarmStore();
  // from_date: format(from_date, "dd-MM-yyyy"),
  // to_date: format(to_date, "dd-MM-yyyy")

  const { data, isLoading, error } = useMLAlarmAnalyticsQuery({
    id,
    tag,
    date
    // from_date:date,
    // to_date: date, // convert back to ISO string
  });

  return (
    <>
      <div className="flex items-center justify-between rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-700 px-3 py-2 ps-5 shadow-md transition-all duration-200 hover:shadow-lg">
        <span className="truncate font-alexandria text-[13px] text-white">
          {tag}
        </span>
        <div
          className="flex cursor-pointer items-center justify-center"
          onClick={() => setModalOpen(true)}
        >
          <ChartIcon />
        </div>
      </div>
      {modalOpen && (
        <TagChartModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          tag={tag}
          data={data}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
};

const RealtimeHistoricToggle = ({
  selected,
  setSelected
}: {
  selected: AlarmToggleType;
  setSelected: Dispatch<SetStateAction<AlarmToggleType>>;
}) => {

  return (
    <div className="relative flex w-[335px] items-center rounded-[10px] border border-[#626262] bg-gradient-to-r from-[#1B1B1B] to-[#2F2F2F] p-1">
      <button
        className="relative flex h-[32px] w-[50%] items-center justify-center gap-2 font-alexandria text-[20px] font-medium text-white/50 transition-colors"
        onClick={() => setSelected("realtime")}
      >
        Realtime
      </button>
      <button
        className="relative flex h-[32px] w-[50%] items-center justify-center gap-2 font-alexandria text-[20px] font-medium text-white/50 transition-colors"
        onClick={() => setSelected("historic")}
      >
        Historic
      </button>

      <motion.div
        layout
        transition={{ damping: 20, stiffness: 300 }}
        className="absolute z-0 h-[32px] w-[50%] rounded-[7px] border border-[#626262] bg-[linear-gradient(rgb(7,7,7)_0%,rgb(16,16,16)_100%)]"
        style={{
          left: selected === "realtime" ? "4px" : "calc(100% - 170px)",
          top: "4px"
        }}
      >
        <div className="flex w-full items-center justify-center">
          <span className=" font-alexandria text-[20px] text-white">
            {selected === "historic" ? "Historic" : "Realtime"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
