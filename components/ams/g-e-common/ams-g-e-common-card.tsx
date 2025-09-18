import * as React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import ringBgImage from "@/assets/bg-ring_62x62.png";
import { BoolResponseStatusValue } from "@/components/tag-assign/single-tag-form";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const AmsAlertStatusButton = ({
  description,
  className,
  type
}: {
  type: BoolResponseStatusValue;
  className?: string;
  description?: string;
}) => {
  /*
  const activeClassName =
    "bg-[linear-gradient(221.99deg,_#006E21_-12.23%,_#1CAA00_99.85%)]";
  const inactiveClassName =
    "bg-[linear-gradient(221.99deg,_#5F0000_-12.23%,_#C50000_99.85%)]";
  */

  const innerCircle = (type: BoolResponseStatusValue) => {
    switch (type) {
      case "grey":
        return (
          <div
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(219.81deg,_#6E6E6E_9.33%,_#A6A6A6_98.93%)]"
            )}
          />
        );
      case "green":
        return (
          <div
            style={{ filter: "blur(1px)" }}
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(221.99deg,_#006E21_-12.23%,_#1CAA00_99.85%)]"
            )}
          />
        );
      case "blue":
        return (
          <div
            style={{ filter: "blur(1px)" }}
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(221.99deg,_#004558_-0.91%,_#00AFEA_49.47%,_#00BBFF_99.85%)]"
            )}
          />
        );
      case "red":
        return (
          <div
            style={{ filter: "blur(1px)" }}
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(221.99deg,_#5F0000_-12.23%,_#C50000_99.85%)]"
            )}
          />
        );
      case "yellow":
        return (
          <div
            style={{ filter: "blur(1px)" }}
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(221.99deg,_#B19600_-0%,_#FFEB14.100%)]"
            )}
          />
        );
      default:
        return (
          <div
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full opacity-80",
              "bg-[linear-gradient(219.81deg,_#6E6E6E_9.33%,_#A6A6A6_98.93%)]"
            )}
          ></div>
        );
    }
  };

  return (
    <div className="flex items-center justify-start">
      <div
        className={twMerge(
          "relative isolate size-[20px] rounded-full",
          className
        )}
      >
        <Image
          src={ringBgImage}
          alt=""
          aria-hidden="true"
          className="pointer-events-none h-full w-full select-none"
        />
        {innerCircle(type)}
      </div>
      {/* <AlertStatusTitle
        label={description}
        // label
        className="ms-[4.8px] font-alexandria text-[14px]"
      /> */}
      <span className="ms-[4.8px]">{description}</span>
    </div>
  );
};
AmsAlertStatusButton.displayName = "AmsAlertStatusButton";

const TripConditionStatusButton = ({
  description,
  type
}: {
  type: BoolResponseStatusValue;
  description?: string;
}) => {
  const innerCircle = (type: BoolResponseStatusValue) => {
    switch (type) {
      case "grey":
        return (
          <div
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(219.81deg,_#6E6E6E_9.33%,_#A6A6A6_98.93%)]"
            )}
          />
        );
      case "green":
        return (
          <div
            style={{ filter: "blur(1px)" }}
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(221.99deg,_#006E21_-12.23%,_#1CAA00_99.85%)]"
            )}
          />
        );
      case "blue":
        return (
          <div
            style={{ filter: "blur(1px)" }}
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(221.99deg,_#004558_-0.91%,_#00AFEA_49.47%,_#00BBFF_99.85%)]"
            )}
          />
        );
      case "red":
        return (
          <div
            style={{ filter: "blur(1px)" }}
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(221.99deg,_#5F0000_-12.23%,_#C50000_99.85%)]"
            )}
          />
        );
      case "yellow":
        return (
          <div
            style={{ filter: "blur(1px)" }}
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(221.99deg,_#B19600_-0%,_#FFEB14.100%)]"
            )}
          />
        );
      default:
        return (
          <div
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full opacity-80",
              "bg-[linear-gradient(219.81deg,_#6E6E6E_9.33%,_#A6A6A6_98.93%)]"
            )}
          ></div>
        );
    }
  };

  return (
    <div className="flex">
      <div className={twMerge("relative isolate size-[20px] rounded-full")}>
        <Image
          src={ringBgImage}
          alt=""
          aria-hidden="true"
          className="pointer-events-none h-full w-full select-none"
        />
        {innerCircle(type)}
      </div>
      <span className="ms-[16.58px]">{description}</span>
    </div>
  );
};

TripConditionStatusButton.displayName = "TripConditionStatusButton";

const AmsGECommonCardHeader = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "me-[120px] flex flex-col gap-1.5 font-alexandria text-sm font-normal leading-none tracking-tight text-white",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <AmsCardTitle>ITEMS</AmsCardTitle>
      <div className="flex gap-[73px]">
        <AmsCardTitle>NO 1</AmsCardTitle>
        <AmsCardTitle>NO 2</AmsCardTitle>
        <AmsCardTitle>NO 3</AmsCardTitle>
        <AmsCardTitle>NO 4</AmsCardTitle>
      </div>
    </div>

    <Separator orientation="horizontal" className="bg-muted-foreground" />
  </div>
);
AmsGECommonCardHeader.displayName = "AmsGECommonCardHeader";

const AmsCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-alexandria text-sm font-semibold uppercase leading-none tracking-[0] text-white",
      className
    )}
    {...props}
  />
));
AmsCardTitle.displayName = "AmsCardTitle";

export {
  AmsCardTitle,
  AmsAlertStatusButton,
  AmsGECommonCardHeader,
  TripConditionStatusButton
};
