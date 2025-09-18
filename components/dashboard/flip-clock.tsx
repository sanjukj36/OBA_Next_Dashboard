"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import valueBoxBgImage from "@/assets/value-box.png";

export const FlipClockComponent = () => {
  const [value, setValue] = useState(0);
  //const [timeLocale, setTimeLocale] = useState<"LT" | "UTC">("LT");

  useEffect(() => {
    const id = setInterval(() => {
      setValue(prev => (prev >= 10 ? 0 : ++prev));
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <section className="grid grid-cols-[1fr_.2fr_1fr_.2fr_1fr] text-[8rem]">
      <div className="flex items-center gap-1">
        {/*
        <FlipChar
          value={timeLocale}
          className="w-[250px] cursor-pointer select-none"
          onClick={() => setTimeLocale(prev => (prev === "LT" ? "UTC" : "LT"))}
        />
        */}
        <FlipChar value={value} />
      </div>
    </section>
  );
};

type FlipCharProps = {
  value: string | number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
function FlipChar(props: FlipCharProps) {
  const topOverlayRef = useRef<HTMLDivElement | null>(null);
  const bottomOverlayRef = useRef<HTMLDivElement | null>(null);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (topOverlayRef.current && bottomOverlayRef.current) {
      animate(
        topOverlayRef.current,
        { rotateX: [0, -90, -90] },
        { duration: 0.525, ease: "linear" }
      );
      animate(
        bottomOverlayRef.current,
        { rotateX: [90, 90, 0] },
        { duration: 0.525, ease: "linear" }
      );
    }
  }, [props.value, animate]);

  return (
    <div
      style={{ perspective: "350px" }}
      className={twMerge(
        "relative h-[150px] w-[100px] rounded text-center leading-[1.13]",
        props.className
      )}
      ref={scope}
      onClick={props.onClick ? props.onClick : () => null}
    >
      <div
        className={twMerge(
          "__top absolute top-0 h-1/2 w-full overflow-hidden rounded"
        )}
      >
        <Image
          src={valueBoxBgImage}
          alt="value box bg"
          className="pointer-events-none absolute inset-0 -z-10 select-none"
        />
        <div className="h-full w-full"> {props.value} </div>
      </div>

      <div className="__bottom absolute bottom-0 h-1/2 w-full overflow-hidden rounded">
        <Image
          src={valueBoxBgImage}
          alt="value box bg"
          className="pointer-events-none absolute inset-0 -z-10 select-none"
        />
        <div className="relative bottom-full h-full w-full">{props.value}</div>
      </div>
      <div
        ref={topOverlayRef}
        className="__top-overlay absolute top-0 h-1/2 w-full origin-bottom overflow-hidden rounded"
      >
        <Image
          src={valueBoxBgImage}
          alt="value box bg"
          className="pointer-events-none absolute inset-0 -z-10 select-none"
        />
        <div className="h-full w-full"> {props.value} </div>
      </div>
      <div
        ref={bottomOverlayRef}
        className="__bottom-overlay absolute bottom-0 h-1/2 w-full origin-top overflow-hidden rounded"
      >
        <Image
          src={valueBoxBgImage}
          alt="value box bg"
          className="pointer-events-none absolute inset-0 -z-10 select-none"
        />
        <div className="relative bottom-full h-full w-full">{props.value}</div>
      </div>
      {/*
      <div
        style={{
          boxShadow: "0px 0px 15px  white"
        }}
        className="-trangray-y-1/2 absolute top-1/2 h-0.5 w-full bg-transparent"
      />
      */}
    </div>
  );
}
