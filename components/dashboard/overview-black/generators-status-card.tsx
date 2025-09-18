import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import ringBgImage from "@/assets/bg-ring_62x62.png";
import { TagAssignComponent } from "@/components/tag-assign";
import {
  BoolResponseStatusKeys,
  BoolResponseStatusValue,
  BoolResponseType
} from "@/components/tag-assign/single-tag-form";
import { cn } from "@/lib/utils";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { ErrorComponent } from "./error-display";
import { RingBorder } from "./ring-border";

export function GSNumberTitleCard({ label }: { label: string }) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  return (
    <div
      className={twMerge(
        "relative flex rounded-[7px] bg-linear-black-overview-card p-0.5 lg:h-[28px] lg:w-[44px] xl:h-[28px] xl:w-[44px] 3xl:h-[34px] 3xl:w-[59px]"
      )}
    >
      <div
        className={twMerge(
          "flex h-full w-full items-center justify-center rounded-[5px] bg-black font-russo lg:text-[15px] xl:text-[18px] 3xl:text-[25px]"
        )}
      >
        {description ?? "__"}
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

export const GSStatusPushButtonComponent = ({ label }: { label: string }) => {
  const {
    data: latestData,
    error,
    refetch
  } = useLatestDataByLabel<BoolResponseType, BoolResponseStatusKeys>(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, response_type } = data || {};

  const alertStatusType = response_type && response_type[value];
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
    <div className="relative isolate rounded-full shadow-md shadow-black lg:size-[32px] xl:size-[40px] 3xl:size-[62px]">
      <Image
        src={ringBgImage}
        alt="bg ring Image"
        className="pointer-events-none h-full w-full select-none"
      />
      {innerCircle(alertStatusType)}
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

export const GSValueBoxComponent = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, unit } = data || {};

  const valueLength = (value?.toString() ?? "__").length;
  const getValueFontSizes = (length: number) => {
    if (length >= 5) return "text-base"; // 12px
    if (length === 4) return "text-lg"; // 14px
    if (length === 3) return "text-2xl"; // 16px
    if (length === 2) return "text-3xl"; // 20px
    return "text-3xl lg:text-[24px]"; // 24px
  };
  const valueFontSize = getValueFontSizes(valueLength);
  return (
    <RingBorder
      variant="dg-value-card"
      className="relative aspect-square lg:h-[60px] lg:w-[59px] xl:h-[59px] xl:w-[60px] 3xl:w-[80px] flex flex-col items-center justify-center"
    >
      <p
        className={cn("font-bold text-shadow-custom-black-rgba tracking-[0%] leading-[100%]", valueFontSize)}
      >
        {value ?? "__"}
      </p>
      {unit && <p className="text-[8px]">{unit}</p>}

      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </RingBorder>
  );
};
