import * as React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import ringBgImage from "@/assets/bg-ring_62x62.png";
import {
  BoolResponseStatusKeys,
  BoolResponseStatusValue,
  BoolResponseType
} from "@/components/tag-assign/single-tag-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LatestDataByLabel } from "@/types/latest-data-by-label";
import { TagDataType } from "@/types/tag-assign";
import { Separator } from "./separator";

const AmsAlertStatusButton = ({
  className,
  type
}: {
  className?: string;
  type: BoolResponseStatusValue;
}) => {
  const sizePx = React.useMemo(() => {
    const match = className?.match(/size-\[(\d+)px\]/);
    return match ? parseInt(match[1], 10) : 24;
  }, [className]);

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
    <div
      style={{
        fontSize: `${sizePx * 0.6}px`
      }}
      className={twMerge(
        "relative isolate size-[20px] rounded-full leading-[100%] tracking-[0%] text-black lg:size-[13px] xl:size-[16px] 2xl:size-[16px] 3xl:size-[20px]",
        className
      )}
    >
      <Image
        src={ringBgImage}
        alt="bg ring Image"
        className="pointer-events-none h-full w-full select-none"
      />
      {innerCircle(type)}
    </div>
  );
};
AmsAlertStatusButton.displayName = "AmsAlertStatusButton";

const AmsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-3 rounded-lg p-4 text-card-foreground",
      "border-[1px] border-[#555555]",
      "bg-[linear-gradient(180deg,_#111111_0%,_#000000_100%)]",
      className
    )}
    {...props}
  />
));
AmsCard.displayName = "AmsCard";

const AmsCardHeader = ({
  className,
  label
}: {
  className?: string;
  label: string;
}) => (
  <div
    className={cn(
      "flex flex-col gap-1.5 font-alexandria text-sm font-normal leading-none tracking-tight text-white lg:text-[12px] xl:text-[12px] 2xl:text-[12px] 3xl:text-sm",
      className
    )}
  >
    <AmsCardTitle>{label}</AmsCardTitle>
    <Separator orientation="horizontal" className="bg-muted-foreground" />
  </div>
);
AmsCardHeader.displayName = "AmsCardHeader";

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

const AmsCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid grid-cols-[1fr_auto_auto] gap-y-3", className)}
    {...props}
  />
));
AmsCardContent.displayName = "AmsCardContent";

const AmsCardValue = ({
  className,
  ...props
}: LatestDataByLabel<BoolResponseType, BoolResponseStatusKeys> & {
  className?: string;
}) => {
  const {
    datatype,
    minimum,
    maximum,
    description,
    value,
    unit,
    response_type
  } = props;

  const valueClassNames =
    datatype === TagDataType.Float &&
    minimum !== null &&
    maximum !== null &&
    (Number(value) < minimum || Number(value) > maximum)
      ? "shadow-[0px_0px_4px_1px_#000000] bg-[#AF0000]"
      : "shadow-[0px_0px_2px_1px_#949494] bg-black";
  const alertStatusType = response_type && response_type[value];

  return (
    <div
      className={cn(
        "col-span-3 grid grid-cols-subgrid items-center gap-2 font-alexandria text-sm font-normal leading-[100%] text-white",
        className
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="max-w-max truncate font-light uppercase lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 3xl:text-[15px]">
              {description}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-wrap font-light uppercase">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {datatype === TagDataType.Float && (
        <React.Fragment>
          <div
            className={twMerge(
              "ml-auto min-w-[80px] rounded-[5px] bg-transparent p-0.5 text-center lg:min-w-[56px] lg:p-1 xl:w-[44px] 3xl:w-[80px] 3xl:p-1",
              valueClassNames
            )}
          >
            <p className="leading-[100%] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 3xl:text-[14px]">
              {value}
            </p>
          </div>
          <span className="lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 3xl:text-[14px]">
            {unit}
          </span>
        </React.Fragment>
      )}
      {datatype === TagDataType.Bool && (
        <AmsAlertStatusButton type={alertStatusType} className="col-start-3" />
      )}
    </div>
  );
};
AmsCardValue.displayName = "AmsCardValue";

export {
  AmsCard,
  AmsCardTitle,
  AmsCardValue,
  AmsCardContent,
  AmsCardHeader,
  AmsAlertStatusButton
};
