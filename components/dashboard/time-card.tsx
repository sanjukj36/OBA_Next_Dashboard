"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import amsTitleBg from "@/assets/ams/time-card-bg.png";
import { getUTCorLTTime } from "@/lib/utc-or-localtime";
import { DateMode } from "@/types";

function Flap(props: { value: number | string }) {
  const overlayTopRef = useRef<HTMLDivElement | null>(null);
  const overlayBottomRef = useRef<HTMLDivElement | null>(null);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (overlayTopRef.current && overlayBottomRef.current) {
      animate(
        overlayTopRef.current,
        { rotateX: [0, -90, -90] },
        { duration: 0.525, ease: "linear" }
      );
      animate(
        overlayBottomRef.current,
        { rotateX: [90, 90, 0] },
        { duration: 0.525, ease: "linear" }
      );
    }
  }, [props.value, animate]);

  return (
    <div
      style={{
        perspective: "350px"
      }}
      ref={scope}
      className="relative isolate grid h-[40px] w-[40px] place-content-center rounded bg-black text-center font-russo text-xl"
    >
      <div className="__top absolute top-0 h-1/2 w-full overflow-hidden rounded rounded-b-none border-[0.5px] border-b-0 border-[#838383] bg-black leading-[1.91]">
        {props.value}
      </div>
      <div
        ref={overlayTopRef}
        className="__top_overlay absolute top-0 h-1/2 w-full origin-bottom overflow-hidden rounded rounded-b-none border-[0.5px] border-b-0 border-[#838383] bg-black leading-[1.91]"
      >
        {props.value}
      </div>
      <div className="__bottom absolute bottom-0 h-1/2 w-full overflow-hidden rounded rounded-t-none border-[0.5px] border-t-0 border-[#838383] bg-black leading-[0]">
        {props.value}
      </div>
      <div
        ref={overlayBottomRef}
        className="__bottom_overlay absolute bottom-0 h-1/2 w-full origin-top overflow-hidden rounded rounded-t-none border-[0.5px] border-t-0 border-[#838383] bg-black leading-[0]"
      >
        {props.value}
      </div>

      <div className="absolute left-0 right-0 top-1/2 z-20 h-[1px] -translate-y-1/2 bg-[#404040]/40" />
    </div>
  );
}

function TimeCard() {
  const [time, setTime] = useState<Date>(new Date());
  const [mode, setMode] = useState<DateMode>("LT");

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const { date, month, year, hours, minutes, seconds } = getUTCorLTTime(
    time,
    mode
  );

  return (
    <div className="relative h-[104px] w-[468px] py-4 pl-9 pr-6">
      <Image
        src={amsTitleBg}
        alt={`Background`}
        fill
        className="pointer-events-none absolute inset-0 -z-10 select-none object-cover"
        priority
      />
      <div className="flex h-full w-full gap-5">
        {/* Mode Switcher */}
        <div className="flex basis-[100px] flex-col gap-1 font-russo text-xl">
          <button
            onClick={() => setMode("LT")}
            className={twMerge(
              "transition-all duration-300",
              mode === "LT"
                ? "w-full rounded-[8px] bg-black/50 px-2 py-0.5 shadow-[0px_0px_6px_1px_#ffffff33]"
                : "px-2 py-0.5"
            )}
          >
            LOCAL
          </button>
          <button
            onClick={() => setMode("UTC")}
            className={twMerge(
              "transition-all duration-300",
              mode === "UTC"
                ? "w-full rounded-[8px] bg-black/50 px-2 py-0.5 shadow-[0px_0px_6px_1px_#ffffff33]"
                : "px-2 py-0.5"
            )}
          >
            {" "}
            UTC{" "}
          </button>
        </div>

        <div className="pointer-events-none flex flex-1 select-none items-center gap-5">
          <div className="flex items-center gap-2">
            <Flap value={date} />
            <Flap value={month} />
            <Flap value={year} />
          </div>

          {/* Time */}
          <div className="flex items-center gap-0.5">
            <Flap value={hours} />
            <span className="font-russo text-[22px]">:</span>
            <Flap value={minutes} />
            <span className="font-russo text-[22px]">:</span>
            <Flap value={seconds} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeCard;
