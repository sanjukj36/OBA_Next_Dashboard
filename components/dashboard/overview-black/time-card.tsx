"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import { twMerge } from "tailwind-merge";
import { getUTCorLTTime } from "@/lib/utc-or-localtime";
import { cn } from "@/lib/utils";
import { DateMode } from "@/types";
import { RingBorder } from "./ring-border";

type FlapProps = {
  value: number | string;
  size?: "sm" | "lg" | "md";
  variant?: "dashboard" | "page";
};

function Flap(props: FlapProps) {
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
      style={
        {
          perspective: "350px",
          "--size":
            props.size === "lg"
              ? props.variant === "dashboard"
                ? "18px"
                : "16px"
              : "14px",
          "--line": props.size === "lg" ? "1.91" : "1.75"
        } as React.CSSProperties
      }
      ref={scope}
      className={cn(
        "relative isolate grid place-content-center rounded bg-black text-center font-russo",
        {
          // Dashboard variant - Large size
          "h-[18px] w-[18px] text-[10px]":
            props.variant === "dashboard" && props.size === "lg",
          "xs:h-[20px] xs:w-[20px] xs:text-[11px]":
            props.variant === "dashboard" && props.size === "lg",
          "sm:h-[21px] sm:w-[21px] sm:text-[12px]":
            props.variant === "dashboard" && props.size === "lg",
          "md:h-[22px] md:w-[22px] md:text-[12px]":
            props.variant === "dashboard" && props.size === "lg",
          "lg:h-[23px] lg:w-[22px] lg:text-[11px]":
            props.variant === "dashboard" && props.size === "lg",
          "xl:h-[30px] xl:w-[30px] xl:text-[16px]":
            props.variant === "dashboard" && props.size === "lg",
          "2xl:h-[40px] 2xl:w-[40px] 2xl:text-[20px]":
            props.variant === "dashboard" && props.size === "lg",
          "3xl:h-[50px] 3xl:w-[50px] 3xl:text-[25px]":
            props.variant === "dashboard" && props.size === "lg",

          // Page variant - Large size
          "h-[16px] w-[16px] text-[9px]":
            props.variant === "page" && props.size === "lg",
          "xs:h-[18px] xs:w-[18px] xs:text-[10px]":
            props.variant === "page" && props.size === "lg",
          "sm:h-[19px] sm:w-[19px] sm:text-[11px]":
            props.variant === "page" && props.size === "lg",
          "md:h-[20px] md:w-[20px] md:text-[11px]":
            props.variant === "page" && props.size === "lg",
          "lg:h-[21px] lg:w-[21px] lg:text-[10px]":
            props.variant === "page" && props.size === "lg",
          "xl:h-[26px] xl:w-[26px] xl:text-[14px]":
            props.variant === "page" && props.size === "lg",
          "2xl:h-[36px] 2xl:w-[36px] 2xl:text-[18px]":
            props.variant === "page" && props.size === "lg",
          "3xl:h-[45px] 3xl:w-[45px] 3xl:text-[22px]":
            props.variant === "page" && props.size === "lg",

          // Medium size variant (same for both variants)
          "h-[18.95px] w-[18.95px] text-[10px]": props.size === "md",
          "xs:h-[20px] xs:w-[20px] xs:text-[11px]": props.size === "md",
          "sm:h-[21px] sm:w-[21px] sm:text-[12px]": props.size === "md",
          "md:h-[22px] md:w-[22px] md:text-[12px]": props.size === "md",
          "lg:h-[23px] lg:w-[23px] lg:text-[13px]": props.size === "md",

          // Small size variant (same for both variants)
          "h-[24px] w-[24px] text-[13px]": props.size === "sm",
          "xs:h-[25px] xs:w-[25px] xs:text-[14px]": props.size === "sm",
          "sm:h-[26px] sm:w-[26px] sm:text-[15px]": props.size === "sm",
          "md:h-[30px] md:w-[28px] md:text-[16px]": props.size === "sm"
        }
      )}
    >
      <div className="__top absolute top-0 flex h-1/2 w-full justify-center gap-0.5 overflow-hidden rounded rounded-b-none border-[0.5px] border-b-0 border-[#838383] bg-black p-0.5 leading-[var(--line)]">
        <span className="w-[var(--size)]">{props.value.toString()[0]}</span>
        <span className="w-[var(--size)]">{props.value.toString()[1]}</span>
      </div>
      <div
        ref={overlayTopRef}
        className="__top_overlay absolute top-0 flex h-1/2 w-full origin-bottom justify-center gap-0.5 overflow-hidden rounded rounded-b-none border-[0.5px] border-b-0 border-[#838383] bg-black p-0.5 leading-[var(--line)]"
      >
        <span className="w-[var(--size)]">{props.value.toString()[0]}</span>
        <span className="w-[var(--size)]">{props.value.toString()[1]}</span>
      </div>
      <div className="__bottom absolute bottom-0 flex h-1/2 w-full justify-center gap-0.5 overflow-hidden rounded rounded-t-none border-[0.5px] border-t-0 border-[#838383] bg-black p-0.5 leading-[0]">
        <span className="w-[var(--size)]">{props.value.toString()[0]}</span>
        <span className="w-[var(--size)]">{props.value.toString()[1]}</span>
      </div>
      <div
        ref={overlayBottomRef}
        className="__bottom_overlay absolute bottom-0 flex h-1/2 w-full origin-top justify-center gap-0.5 overflow-hidden rounded rounded-t-none border-[0.5px] border-t-0 border-[#838383] bg-black p-0.5 leading-[0]"
      >
        <span className="w-[var(--size)]">{props.value.toString()[0]}</span>
        <span className="w-[var(--size)]">{props.value.toString()[1]}</span>
      </div>

      <div className="absolute left-0 right-0 top-1/2 z-20 h-[1px] -translate-y-1/2 bg-[#404040]/40" />
    </div>
  );
}

type TimeCardProps = {
  className?: string;
  size?: "sm" | "lg" | "md";
  variant?: "dashboard" | "page";
};

export function TimeCard({
  className,
  size = "lg",
  variant = "dashboard"
}: TimeCardProps) {
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
    <RingBorder
      className={cn(
        "relative",
        {
          // Dashboard variant - Large size
          "w-auto flex-1": variant === "dashboard" && size === "lg",
          "xs:h-[65px] h-[60px] sm:h-[68px] md:h-[70px] lg:h-[72px] xl:h-[87px] 2xl:h-[95px] 3xl:h-[104px]":
            variant === "dashboard" && size === "lg",

          // Page variant - Large size
          "w-[242px]": variant === "page" && size === "lg",
          "xs:h-[75px] h-[70px] sm:h-[78px] md:h-[80px] lg:h-[82px] xl:h-[90px] 2xl:h-[95px] 3xl:h-[100px]":
            variant === "page" && size === "lg",

          // Medium size variant (same for both variants)
          "h-[60px] w-auto": size === "md",
          "xs:h-[65px] sm:h-[70px] md:h-[74px] md:w-[242px]": size === "md",
          "lg:w-[242px] xl:w-[242px]": size === "md",

          // Small size variant (same for both variants)
          "h-[50px] w-auto": size === "sm",
          // "xs:h-[55px] sm:h-[60px] md:h-[65px] lg:h-[70px] xl:h-[75px]": size === "sm"
          "h-min": size === "sm"
        },
        className
      )}
      secondClassName={cn({
        "p-1 3xl:p-2 rounded-[16px] 3xl:rounded-[18px]": size === "sm"
      })}
      innerClassName={cn({
        // Large size variant
        "px-1 sm:px-1.5 md:px-1.5 lg:px-1 xl:px-1.5 2xl:px-2 3xl:px-2":
          size === "lg",
        "mt-0 xl:mt-0 2xl:mt-0 3xl:mt-0": size === "lg",

        // Small size variant
        "p-0.5 3xl:px-1 rounded-[12px] 3xl:rounded-[12px]": size === "sm"
      })}
    >
      <div
        className={cn("flex w-full", {
          "gap-2 3xl:gap-5": size === "lg",
          "gap-2": size === "sm"
        })}
      >
        {/* Mode Switcher */}
        <div
          className={cn("flex flex-col justify-center gap-1 px-1 font-russo", {
            "text-xl lg:mt-[-1px] xl:mt-[4px] xl:text-[120px] 3xl:mt-[7px]":
              size === "lg",
            "w-[80px] text-[12px]": size === "sm"
          })}
        >
          <button
            onClick={() => setMode("LT")}
            className={twMerge(
              "mt-1 flex h-[21px] w-[61px] items-center justify-center rounded-[8px] bg-black/50 text-[12px] transition-all duration-300",
              // Base styles
              "lg:h-[20px] lg:w-[50px] lg:text-[10px]",
              "xl:h-[21px] xl:w-[58px] xl:text-[12px]",
              // Size-specific 3xl styles
              size === "sm"
                ? "3xl:h-[21px] 3xl:w-[65px] 3xl:text-[13px]"
                : "3xl:h-[28px] 3xl:w-[91px] 3xl:text-[17px]",
              mode === "LT"
                ? "border-[1px] border-white/50 shadow-[0px_0px_6px_1px_#ffffff]"
                : "shadow-[0px_0px_6px_1px_#ffffff00]"
            )}
          >
            <span>LOCAL</span>
          </button>
          <button
            onClick={() => setMode("UTC")}
            className={twMerge(
              "flex items-center justify-center rounded-[8px] bg-black/50 transition-all duration-300",
              // Base styles
              "lg:h-[20px] lg:w-[50px] lg:text-[10px]",
              "xl:h-[21px] xl:w-[58px] xl:text-[12px]",
              // Size-specific 3xl styles
              size === "sm"
                ? "3xl:h-[21px] 3xl:w-[65px] 3xl:text-[13px]"
                : "3xl:h-[28px] 3xl:w-[91px] 3xl:text-[17px]",
              // Common 3xl styles
              "3xl:rounded-[8px]",
              mode === "UTC"
                ? "border-[1px] border-white/50 shadow-[0px_0px_6px_1px_#ffffff]"
                : "shadow-[0px_0px_6px_1px_#ffffff00]"
            )}
          >
            <span>UTC</span>
          </button>
        </div>

        <div className="pointer-events-none flex flex-1 select-none items-center gap-2 3xl:gap-5">
          <div className="flex items-center gap-2 lg:gap-[1px]">
            <Flap value={date} size={size} variant={variant} />
            <Flap value={month} size={size} variant={variant} />
            <Flap value={year} size={size} variant={variant} />
          </div>

          <div className="flex items-center gap-0.5">
            <Flap value={hours} size={size} variant={variant} />
            <span className="font-russo text-[22px]">:</span>
            <Flap value={minutes} size={size} variant={variant} />
            <span className="font-russo text-[22px]">:</span>
            <Flap value={seconds} size={size} variant={variant} />
          </div>
        </div>
      </div>
    </RingBorder>
  );
}

type NavFlapProps = {
  value: number | string;
};

function NavFlap(props: NavFlapProps) {
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
      style={
        {
          perspective: "350px",
          "--size": "18px",
          "--line": "1.75",
          "--line-sm": "1.47"
        } as React.CSSProperties
      }
      ref={scope}
      className={cn(
        "relative isolate grid place-content-center rounded bg-black text-center font-russo",
        "h-[17px] w-[17px] text-[9px] 3xl:h-[31px] 3xl:w-[31px] 3xl:text-[16px]"
      )}
    >
      <div className="__top absolute top-0 flex h-1/2 w-full justify-center gap-0.5 overflow-hidden rounded rounded-b-none border-[0.5px] border-b-0 border-[#838383] bg-black p-0.5 leading-[var(--line-sm)] 2xl:leading-[var(--line)]">
        <span className="w-[var(--size)]">{props.value.toString()[0]}</span>
        <span className="w-[var(--size)]">{props.value.toString()[1]}</span>
      </div>
      <div
        ref={overlayTopRef}
        className="__top_overlay absolute top-[-6px] flex h-1/2 w-full origin-bottom justify-center gap-0.5 overflow-hidden rounded rounded-b-none border-[0.5px] border-b-0 border-[#838383] bg-black p-0.5 leading-[var(--line-sm)] 2xl:leading-[var(--line)]"
      >
        <span className="w-[var(--size)]">{props.value.toString()[0]}</span>
        <span className="w-[var(--size)]">{props.value.toString()[1]}</span>
      </div>
      <div className="__bottom absolute bottom-0 flex h-1/2 w-full justify-center gap-0.5 overflow-hidden rounded rounded-t-none border-[0.5px] border-t-0 border-[#838383] bg-black p-0.5 leading-[0]">
        <span className="w-[var(--size)]">{props.value.toString()[0]}</span>
        <span className="w-[var(--size)]">{props.value.toString()[1]}</span>
      </div>
      <div
        ref={overlayBottomRef}
        className="__bottom_overlay absolute bottom-0 flex h-1/2 w-full origin-top justify-center gap-0.5 overflow-hidden rounded rounded-t-none border-[0.5px] border-t-0 border-[#838383] bg-black p-0.5 leading-[0]"
      >
        <span className="w-[var(--size)]">{props.value.toString()[0]}</span>
        <span className="w-[var(--size)]">{props.value.toString()[1]}</span>
      </div>

      <div className="absolute left-0 right-0 top-1/2 z-20 h-[1px] -translate-y-1/2 bg-[#404040]/40" />
    </div>
  );
}

type NavTimeCardProps = {
  className?: string;
};
export function NavTimeCard({ className }: NavTimeCardProps) {
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
    <RingBorder
      className={cn(
        "relative h-min rounded-[9px] p-[1px] 3xl:rounded-[20px] 3xl:p-0.5",
        className
      )}
      secondClassName={cn("p-[5px] rounded-[8px] 3xl:rounded-[18px]")}
      innerClassName={cn(
        "py-[4px] px-[8px] rounded-[7px] 3xl:py-[5px] 3xl:px-[16px] 3xl:rounded-[12px] flex gap-[9px] 3xl:gap-[18px]"
      )}
    >
      <div className="flex flex-col gap-0.5 font-russo text-[6px] leading-[100%] tracking-[0%] 3xl:gap-1 3xl:text-[12px]">
        <button
          onClick={() => setMode("LT")}
          className={twMerge(
            "rounded-[4px] border border-transparent px-[4px] py-[2px] 3xl:px-[8px]",
            mode === "LT" && "shadow-[0px_0px_3px_1px_#ffffff]"
          )}
        >
          LOCAL
        </button>
        <button
          onClick={() => setMode("UTC")}
          className={twMerge(
            "rounded-[4px] border border-transparent px-[4px] py-[2px] 3xl:px-[8px]",
            mode === "UTC" && "shadow-[0px_0px_3px_1px_#ffffff]"
          )}
        >
          UTC
        </button>
      </div>
      <div className="pointer-events-none flex flex-1 select-none items-center gap-2 3xl:gap-5">
        <div className="flex items-center gap-0.5">
          <NavFlap value={date} />
          <NavFlap value={month} />
          <NavFlap value={year} />
        </div>

        <div className="flex items-center gap-0.5">
          <NavFlap value={hours} />
          <span className="font-russo text-[11px] 3xl:text-[22px]">:</span>
          <NavFlap value={minutes} />
          <span className="font-russo text-[11px] 3xl:text-[22px]">:</span>
          <NavFlap value={seconds} />
        </div>
      </div>
    </RingBorder>
  );
}

export function NavTimeCardNew({ className }: { className?: string }) {
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
    <div
      className={twMerge(
        "flex gap-[5px] p-1 font-russo text-[8px] leading-[100%] tracking-[0%] xl:gap-[6px] xl:text-[10px] 2xl:gap-[10px] 2xl:text-[15px]",
        className
      )}
    >
      <div className="flex flex-col place-content-around gap-1 xl:gap-1.5 2xl:gap-2">
        <button
          onClick={() => setMode("UTC")}
          className={twMerge(
            "grid place-content-center rounded-[3px] px-1 py-0.5 transition-shadow xl:rounded-[4px] xl:px-1.5 xl:py-1 2xl:rounded-[5px] 2xl:px-2 2xl:py-1",
            mode === "UTC" && "shadow-[0px_0px_3px_1px_#AAAAAA]"
          )}
        >
          UTC
        </button>
        <button
          onClick={() => setMode("LT")}
          className={twMerge(
            "grid place-content-center rounded-[3px] px-1 py-0.5 transition-shadow xl:rounded-[4px] xl:px-1.5 xl:py-1 2xl:rounded-[5px] 2xl:px-2 2xl:py-1",
            mode === "LT" && "shadow-[0px_0px_3px_1px_#AAAAAA]"
          )}
        >
          LOCAL
        </button>
      </div>
      <div className="flex flex-col gap-1 xl:gap-1.5 2xl:gap-2">
        <div className="flex items-center">
          <NavFlapNew>
            <TimeIcon />
          </NavFlapNew>
          <NavFlapNew className="ml-1 xl:ml-1.5 2xl:ml-2">{hours}</NavFlapNew>
          <NavFlapNew className="ml-1 xl:ml-1.5 2xl:ml-2">{minutes}</NavFlapNew>
          <NavFlapNew className="ml-1 xl:ml-1.5 2xl:ml-2">{seconds}</NavFlapNew>
        </div>
        <div className="flex items-center">
          <NavFlapNew>
            <DateIcon />
          </NavFlapNew>
          <NavFlapNew className="ml-1 xl:ml-1.5 2xl:ml-2">{date}</NavFlapNew>
          <NavFlapNew className="ml-1 xl:ml-1.5 2xl:ml-2">{month}</NavFlapNew>
          <NavFlapNew className="ml-1 xl:ml-1.5 2xl:ml-2">{year}</NavFlapNew>
        </div>
      </div>
    </div>
  );
}

function NavFlapNew({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "grid h-[14px] w-[18px] place-content-center rounded-[4px] border-[1px] border-[#595959]/50 p-[5px] xl:h-[18px] xl:w-[23px] 2xl:h-[28px] 2xl:w-[35px]",
        className
      )}
    >
      {children}
    </div>
  );
}

function TimeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge(
        "h-[10px] w-[10px] xl:h-[12px] xl:w-[12px] 2xl:h-[18px] 2xl:w-[18px]",
        className
      )}
    >
      <path
        d="M9 1.5C13.1423 1.5 16.5 4.85775 16.5 9C16.5 13.1423 13.1423 16.5 9 16.5C4.85775 16.5 1.5 13.1423 1.5 9C1.5 4.85775 4.85775 1.5 9 1.5ZM9 3C7.4087 3 5.88258 3.63214 4.75736 4.75736C3.63214 5.88258 3 7.4087 3 9C3 10.5913 3.63214 12.1174 4.75736 13.2426C5.88258 14.3679 7.4087 15 9 15C10.5913 15 12.1174 14.3679 13.2426 13.2426C14.3679 12.1174 15 10.5913 15 9C15 7.4087 14.3679 5.88258 13.2426 4.75736C12.1174 3.63214 10.5913 3 9 3ZM9 4.5C9.1837 4.50002 9.361 4.56747 9.49828 4.68954C9.63556 4.81161 9.72326 4.97981 9.74475 5.16225L9.75 5.25V8.6895L11.7802 10.7198C11.9148 10.8547 11.9929 11.0358 11.9987 11.2263C12.0045 11.4167 11.9376 11.6023 11.8116 11.7452C11.6855 11.8881 11.5098 11.9777 11.3201 11.9958C11.1305 12.0139 10.941 11.9591 10.7902 11.8425L10.7198 11.7802L8.46975 9.53025C8.35318 9.41358 8.27832 9.26175 8.25675 9.09825L8.25 9V5.25C8.25 5.05109 8.32902 4.86032 8.46967 4.71967C8.61032 4.57902 8.80109 4.5 9 4.5Z"
        fill="#929292"
      />
    </svg>
  );
}

function DateIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge(
        "h-[10px] w-[10px] xl:h-[12px] xl:w-[12px] 2xl:h-[18px] 2xl:w-[18px]",
        className
      )}
    >
      <path
        d="M14.25 3H12.75V2.25C12.75 2.05109 12.671 1.86032 12.5303 1.71967C12.3897 1.57902 12.1989 1.5 12 1.5C11.8011 1.5 11.6103 1.57902 11.4697 1.71967C11.329 1.86032 11.25 2.05109 11.25 2.25V3H6.75V2.25C6.75 2.05109 6.67098 1.86032 6.53033 1.71967C6.38968 1.57902 6.19891 1.5 6 1.5C5.80109 1.5 5.61032 1.57902 5.46967 1.71967C5.32902 1.86032 5.25 2.05109 5.25 2.25V3H3.75C3.15326 3 2.58097 3.23705 2.15901 3.65901C1.73705 4.08097 1.5 4.65326 1.5 5.25V14.25C1.5 14.8467 1.73705 15.419 2.15901 15.841C2.58097 16.2629 3.15326 16.5 3.75 16.5H14.25C14.8467 16.5 15.419 16.2629 15.841 15.841C16.2629 15.419 16.5 14.8467 16.5 14.25V5.25C16.5 4.65326 16.2629 4.08097 15.841 3.65901C15.419 3.23705 14.8467 3 14.25 3ZM15 14.25C15 14.4489 14.921 14.6397 14.7803 14.7803C14.6397 14.921 14.4489 15 14.25 15H3.75C3.55109 15 3.36032 14.921 3.21967 14.7803C3.07902 14.6397 3 14.4489 3 14.25V9H15V14.25ZM15 7.5H3V5.25C3 5.05109 3.07902 4.86032 3.21967 4.71967C3.36032 4.57902 3.55109 4.5 3.75 4.5H5.25V5.25C5.25 5.44891 5.32902 5.63968 5.46967 5.78033C5.61032 5.92098 5.80109 6 6 6C6.19891 6 6.38968 5.92098 6.53033 5.78033C6.67098 5.63968 6.75 5.44891 6.75 5.25V4.5H11.25V5.25C11.25 5.44891 11.329 5.63968 11.4697 5.78033C11.6103 5.92098 11.8011 6 12 6C12.1989 6 12.3897 5.92098 12.5303 5.78033C12.671 5.63968 12.75 5.44891 12.75 5.25V4.5H14.25C14.4489 4.5 14.6397 4.57902 14.7803 4.71967C14.921 4.86032 15 5.05109 15 5.25V7.5Z"
        fill="#929292"
      />
    </svg>
  );
}
