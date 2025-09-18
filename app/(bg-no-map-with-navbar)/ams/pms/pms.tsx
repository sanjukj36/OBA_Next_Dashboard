import React, { useMemo } from "react";
import { PopoverContentProps } from "@radix-ui/react-popover";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import ringBgImage from "@/assets/bg-ring_62x62.png";
import pmsImage1 from "@/assets/pms-dg-1.png";
import pmsImage2 from "@/assets/pms-dg-2.png";
import ProgressBar from "@/components/ams/ams-dark-them/pms/progress-bar";
import SwitchOnOff from "@/components/ams/ams-dark-them/pms/switch-on-off";
import { ErrorComponent } from "@/components/dashboard/overview-black/error-display";
import { RingBorder } from "@/components/dashboard/overview-black/ring-border";
import { TagAssignComponent } from "@/components/tag-assign";
import {
  DgStatusKeys,
  DgStatusResponseType,
  DgStatusValue
} from "@/components/tag-assign/single-tag-dg-status-form";
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
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { LatestDataByLabel } from "@/types/latest-data-by-label";
import { TagDataType } from "@/types/tag-assign";
import { PMS as p } from "./pms-taglist";

export default function PMSComponent() {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-[12px] bg-black p-3 shadow-[0px_0px_4px_0px_#FFFFFF80] 3xl:gap-6 3xl:p-4">
      <div className="relative mx-auto flex w-[90%] justify-between">
        <div className="grid grid-cols-[repeat(2,auto)] gap-x-5 gap-y-1 3xl:gap-x-10 3xl:gap-y-2">
          <TitleWithValueCard label={p.Tag1} />
          <TitleWithValueCard label={p.Tag2} showDescription={false} />
          <TitleWithValueCard label={p.Tag3} />
          <TitleWithValueCard label={p.Tag4} showDescription={false} />
        </div>
        <div className="absolute left-[49%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-14 3xl:gap-24">
          <TitleWithLableStatus label={p.Tag5} />
          <TitleWithLableStatus label={p.Tag6} />
        </div>
        <div className="flex gap-11">
          <TitleWithValueCard label={p.Tag7} showDescription={false} />
          <TitleWithValueCard label={p.Tag8} showDescription={false} />
        </div>
      </div>
      <div className="mx-auto flex w-[95%] flex-1 flex-col">
        <div className="relative mx-auto h-[6px] w-[95%] rounded-[3px] bg-[#A5A5A5] 3xl:h-[10px]">
          <SwitchStatus
            label={p.Tag9}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            dimensions="horizontal"
          />
        </div>
        <div className="grid flex-1 grid-cols-4 gap-[24px] 3xl:gap-10">
          {/* 1st col */}
          <div className="flex flex-col items-center">
            <div className="lg:-h[50] relative h-[43px] w-[5px] bg-[#A6A6A6] 3xl:h-[70px]">
              <SwitchStatus
                label={p.Tag10}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                switchClassName="h-[17px] w-[17px] lg:h-[19px] lg:w-[19px] 3xl:h-[35px] 3xl:w-[35px]"
                dimensions="vertical"
              />
            </div>
            <div className="flex w-full flex-1 flex-col rounded-[4px] border border-[#939393] bg-[linear-gradient(180deg,_#000000_0%,_#111111_100%)]">
              <div className="mt-1 flex flex-col items-start p-1 lg:mt-2 lg:p-2 3xl:mt-4 3xl:p-3">
                <div className="flex w-full justify-between p-0.5 gap-[5px] lg:px-1 3xl:px-2">
                  <LightIndicationStatus label={p.Tag11} />
                  <LightIndicationStatus label={p.Tag12} />
                  <LightIndicationStatus label={p.Tag13} />
                </div>
                <div className="mt-[25px] flex w-full gap-[24px] 3xl:mt-[30px] 3xl:gap-5 3xl:px-2">
                  <div className="flex flex-col items-center gap-2.5 3xl:gap-3">
                    <div className="w-[68px] lg:w-[85px] 3xl:w-[128px]">
                      <Image src={pmsImage1} alt="dg-1" className="w-full" />
                    </div>
                    <AlertStatusButton label={p.Tag14} />
                  </div>
                  <List
                    label={p.Tag15}
                    className="flex-1 px-0.5 py-0.5 lg:gap-1"
                    insideUnit
                  />
                </div>
                <div className="mt-[27px] flex w-full gap-[4px] justify-between px-2">
                  <LightIndicationStatus label={p.Tag16} />
                  <LightIndicationStatus label={p.Tag17} />
                  <LightIndicationStatus label={p.Tag18} />
                </div>
                <div className="mt-[19px] flex w-full justify-between px-0.5 3xl:mt-[24px] 3xl:px-2">
                  <ProgressStatus label={p.Tag19} />
                  <ProgressStatus label={p.Tag20} />
                </div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-white/50 3xl:my-[24px] 3xl:bg-white" />
              <List label={p.Tag21} className="max-h-max gap-y-1" />
            </div>
          </div>

          {/* 2nd col */}
          <div className="flex flex-col items-center">
            <div className="lg:-h[50] relative h-[43px] w-[5px] bg-[#A6A6A6] 3xl:h-[70px]">
              <SwitchStatus
                label={p.Tag22}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                switchClassName="h-[17px] w-[17px] lg:h-[19px] lg:w-[19px] 3xl:h-[35px] 3xl:w-[35px]"
                dimensions="vertical"
              />
            </div>
            <div className="flex w-full flex-1 flex-col rounded-[4px] border border-[#939393] bg-[linear-gradient(180deg,_#000000_0%,_#111111_100%)]">
              <div className="mt-1 flex flex-col items-start p-1 lg:mt-2 lg:p-2 3xl:mt-4 3xl:p-3">
                <div className="flex w-full justify-between p-0.5 gap-[5px] lg:px-1 3xl:px-2">
                  <LightIndicationStatus label={p.Tag23} />
                  <LightIndicationStatus label={p.Tag24} />
                  <LightIndicationStatus label={p.Tag25} />
                </div>
                <div className="mt-[25px] flex w-full gap-[24px] 3xl:mt-[30px] 3xl:gap-5 3xl:px-2">
                  <div className="flex flex-col items-center gap-2.5 3xl:gap-3">
                    <div className="w-[68px] lg:w-[85px] 3xl:w-[128px]">
                      <Image src={pmsImage1} alt="dg-1" className="w-full" />
                    </div>
                    <AlertStatusButton label={p.Tag26} />
                  </div>
                  <List
                    label={p.Tag27}
                    className="flex-1 px-0.5 py-0.5 lg:gap-1"
                    insideUnit
                  />
                </div>
                <div className="mt-[27px] gap-[4px] flex w-full justify-between px-2">
                  <LightIndicationStatus label={p.Tag28} />
                  <LightIndicationStatus label={p.Tag29} />
                  <LightIndicationStatus label={p.Tag30} />
                </div>
                <div className="mt-[19px] flex w-full justify-between px-0.5 3xl:mt-[24px] 3xl:px-2">
                  <ProgressStatus label={p.Tag31} />
                  <ProgressStatus label={p.Tag32} />
                </div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-white/50 3xl:my-[24px] 3xl:bg-white" />
              <List label={p.Tag33} className="max-h-max gap-y-1" />
            </div>
          </div>

          {/* 3nd col */}
          <div className="flex flex-col items-center">
            <div className="lg:-h[50] relative h-[43px] w-[5px] bg-[#A6A6A6] 3xl:h-[70px]">
              <SwitchStatus
                label={p.Tag34}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                switchClassName="h-[17px] w-[17px] lg:h-[19px] lg:w-[19px] 3xl:h-[35px] 3xl:w-[35px]"
                dimensions="vertical"
              />
            </div>
            <div className="flex w-full flex-1 flex-col rounded-[4px] border border-[#939393] bg-[linear-gradient(180deg,_#000000_0%,_#111111_100%)]">
              <div className="mt-1 flex flex-col items-start p-1 lg:mt-2 lg:p-2 3xl:mt-4 3xl:p-3">
                <div className="flex w-full justify-between p-0.5 gap-[5px] lg:px-1 3xl:px-2">
                  <LightIndicationStatus label={p.Tag35} />
                  <LightIndicationStatus label={p.Tag36} />
                  <LightIndicationStatus label={p.Tag37} />
                </div>
                <div className="mt-[25px] flex w-full gap-[24px] 3xl:mt-[30px] 3xl:gap-5 3xl:px-2">
                  <div className="flex flex-col items-center gap-2.5 3xl:gap-3">
                    <div className="w-[68px] lg:w-[85px] 3xl:w-[128px]">
                      <Image src={pmsImage2} alt="dg-1" className="w-full" />
                    </div>
                    <AlertStatusButton label={p.Tag38} />
                  </div>
                  <List
                    label={p.Tag39}
                    className="flex-1 px-0.5 py-0.5 lg:gap-1"
                    insideUnit
                  />
                </div>
                <div className="mt-[27px] flex w-full gap-[4px] justify-between px-2">
                  <LightIndicationStatus label={p.Tag40} />
                  <LightIndicationStatus label={p.Tag41} />
                  <LightIndicationStatus label={p.Tag42} />
                </div>
                <div className="mt-[19px] flex w-full justify-between px-0.5 3xl:mt-[24px] 3xl:px-2">
                  <ProgressStatus label={p.Tag43} />
                  <ProgressStatus label={p.Tag44} />
                </div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-white/50 3xl:my-[24px] 3xl:bg-white" />
              <List label={p.Tag45} className="max-h-max gap-y-1" />
            </div>
          </div>
          {/* 4nd col */}
          <div className="flex flex-col items-center">
            <div className="lg:-h[50] relative h-[43px] w-[5px] bg-[#A6A6A6] 3xl:h-[70px]">
              <SwitchStatus
                label={p.Tag46}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                switchClassName="h-[17px] w-[17px] lg:h-[19px] lg:w-[19px] 3xl:h-[35px] 3xl:w-[35px]"
                dimensions="vertical"
              />
            </div>
            <div className="flex w-full flex-1 flex-col rounded-[4px] border border-[#939393] bg-[linear-gradient(180deg,_#000000_0%,_#111111_100%)]">
              <div className="mt-1 flex flex-col items-start p-1 lg:mt-2 lg:p-2 3xl:mt-4 3xl:p-3">
                <div className="flex w-full justify-between p-0.5 gap-[5px] lg:px-1 3xl:px-2">
                  <LightIndicationStatus label={p.Tag47} />
                  <LightIndicationStatus label={p.Tag48} />
                  <LightIndicationStatus label={p.Tag49} />
                </div>
                <div className="mt-[25px] flex w-full gap-[24px] 3xl:mt-[30px] 3xl:gap-5 3xl:px-2">
                  <div className="flex flex-col items-center gap-2.5 3xl:gap-3">
                    <div className="w-[68px] lg:w-[85px] 3xl:w-[128px]">
                      <Image src={pmsImage2} alt="dg-1" className="w-full" />
                    </div>
                    <AlertStatusButton label={p.Tag50} />
                  </div>
                  <List
                    label={p.Tag51}
                    className="flex-1 px-0.5 py-0.5 lg:gap-1"
                    insideUnit
                  />
                </div>
                <div className="mt-[27px] flex w-full gap-[5px] justify-between px-2">
                  <LightIndicationStatus label={p.Tag52} />
                  <LightIndicationStatus label={p.Tag53} />
                  <LightIndicationStatus label={p.Tag54} />
                </div>
                <div className="mt-[19px] flex w-full justify-between px-0.5 3xl:mt-[24px] 3xl:px-2">
                  <ProgressStatus label={p.Tag55} />
                  <ProgressStatus label={p.Tag56} />
                </div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-white/50 3xl:my-[24px] 3xl:bg-white" />
              <List label={p.Tag57} className="max-h-max gap-y-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressStatus({ label }: { label: string }) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { datatype, minimum, maximum, value, unit } = data || {};

  const valueClassNames =
    datatype === TagDataType.Float &&
      minimum !== null &&
      maximum !== null &&
      (value < minimum || value > maximum)
      ? "bg-[#AF0000] text-white"
      : "bg-black text-white";
  return (
    <div className="relative flex flex-col gap-1.5 px-2">
      <ProgressBar
        min={minimum ?? 0}
        max={maximum ?? 100}
        value={value ?? 0}
        className="h-[10px] w-[73px] xl:h-[12px] xl:w-[93px] 2xl:h-[15px] 2xl:w-[140px]"
      />
      <div className="flex items-center gap-3">
        <p className="font-alexandria text-[7px] leading-[100%] tracking-[0%] xl:text-[9px] 3xl:text-xs">
          {unit ?? "__"}
        </p>
        <div
          className={twMerge(
            "min-h-[10px] min-w-[44px] rounded-[5px] border border-[#FFFFFF]/50 py-0.5 text-center font-alexandria text-[7px] leading-[100%] tracking-[0%] shadow-[0px_0px_2px_1px_#949494] 3xl:min-w-20 3xl:text-xs",
            valueClassNames
          )}
        >
          {value ?? "__"}
        </div>
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

const AlertStatusButton = ({
  className,
  label
}: {
  label: string;
  className?: string;
}) => {
  const {
    data: latestData,
    error,
    refetch
  } = useLatestDataByLabel<DgStatusResponseType, DgStatusKeys>(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, response_type } = data || {};

  const alertStatusType = response_type && response_type[value];

  return (
    <div className={twMerge("relative isolate", className)}>
      <DgAlertStatus
        className="size-[13px] lg:size-[18px] 3xl:size-[26px]"
        type={alertStatusType}
      />
      <TagAssignComponent type="single-dg-status" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

export function AlertStatus({
  className,
  type
}: {
  className?: string;
  type: BoolResponseStatusValue;
}) {
  const sizePx = useMemo(() => {
    const match = className?.match(/size-\[(\d+)px\]/);
    return match ? parseInt(match[1], 10) : 100; // fallback to 100px
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
    <div
      style={{
        fontSize: `${sizePx * 0.6}px`
      }}
      className={twMerge(
        "relative isolate size-[26px] rounded-full leading-[100%] tracking-[0%] text-black",
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
}
export function DgAlertStatus({
  className,
  type
}: {
  className?: string;
  type: DgStatusValue;
}) {
  const sizePx = useMemo(() => {
    const match = className?.match(/size-\[(\d+)px\]/);
    return match ? parseInt(match[1], 10) : 100; // fallback to 100px
  }, [className]);

  const innerCircle = (type: DgStatusValue) => {
    switch (type) {
      case "grey-1":
        return (
          <div
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(219.81deg,_#6E6E6E_9.33%,_#A6A6A6_98.93%)]"
            )}
          >
            1
          </div>
        );
      case "grey-2":
        return (
          <div
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(219.81deg,_#6E6E6E_9.33%,_#A6A6A6_98.93%)]"
            )}
          >
            2
          </div>
        );
      case "grey-3":
        return (
          <div
            className={cn(
              "absolute inset-[8%] -z-10 grid place-items-center rounded-full",
              "bg-[linear-gradient(219.81deg,_#6E6E6E_9.33%,_#A6A6A6_98.93%)]"
            )}
          >
            3
          </div>
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
        "relative isolate size-[26px] rounded-full leading-[100%] tracking-[0%] text-black",
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
}

function LightIndicationStatus({
  className,
  label
}: {
  label: string;
  className?: string;
}) {
  const {
    data: latestData,
    error,
    refetch
  } = useLatestDataByLabel<BoolResponseType, BoolResponseStatusKeys>(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description, response_type } = data || {};

  const innerSquareColors = (type: BoolResponseStatusValue) => {
    switch (type) {
      case "grey":
        return "bg-[#404040] text-white";
      case "green":
        return "bg-[#006B00] text-white";
      case "blue":
        return "bg-[#01AFEA] text-white";
      case "red":
        return "bg-[#920101] text-white";
      case "yellow":
        return "bg-[#DFB300] text-white";
      default:
        return "bg-[#404040] text-white";
    }
  };

  const activeClassName = response_type && response_type[value];

  return (
    <div
      className={cn(
        "relative flex max-h-[17px] min-h-[9px] min-w-[36px] items-center justify-center rounded-[4px] px-1 font-alexandria text-[7px] uppercase leading-[18px] tracking-[0%] shadow-[0px_0px_4px_1px_#000000] text-shadow-custom-black lg:min-h-[49px] xl:min-h-[40px] 3xl:min-h-[45px] lg:min-w-[58px] lg:text-[7px] 3xl:min-w-[68px] 3xl:px-2 3xl:text-[13px]",
        className,
        innerSquareColors(activeClassName)
      )}
    >
      {description ?? "__"}
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

function List({
  label,
  side,
  className,
  insideUnit = false
}: {
  label: string;
  side?: PopoverContentProps["side"];
  className?: string;
  insideUnit?: boolean;
}) {
  const {
    data: latestData,
    error,
    refetch
  } = useLatestDataByLabel<BoolResponseType, BoolResponseStatusKeys>(label);
  const { data } = latestData || {};
  return (
    <div
      className={twMerge(
        "relative grid max-h-[90px] flex-1 auto-rows-min grid-cols-[auto_auto_1fr] gap-y-0.5 overflow-y-auto px-[12px] pb-4 pt-0.5 3xl:max-h-[375px] 3xl:gap-y-1.5 3xl:px-[35px] 3xl:pt-2",
        className
      )}
    >
      {data ? (
        data.map((item, index) => {
          return <AmsCardValue key={index} {...item} insideUnit={insideUnit} />;
        })
      ) : (
        <p className="col-span-3">No data found.</p>
      )}
      <TagAssignComponent tag={label} type="multiple" side={side} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

const AmsCardValue = ({
  className,
  insideUnit,
  ...props
}: LatestDataByLabel<BoolResponseType, BoolResponseStatusKeys> & {
  className?: string;
  insideUnit: boolean;
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
        "col-span-3 grid grid-cols-subgrid items-center gap-0.5 font-alexandria text-[7px] font-normal leading-[100%] text-white 3xl:gap-1 3xl:text-[12px]",
        className
      )}
    >
      {datatype === TagDataType.Float && (
        <React.Fragment>
          <div
            className={twMerge(
              "min-w-[40px] rounded-[5px] bg-transparent p-0.5 text-center 3xl:min-w-[80px]",
              valueClassNames
            )}
          >
            <p className="leading-[100%]">
              {value}
              {insideUnit && <span>{unit}</span>}
            </p>
          </div>
          {!insideUnit && <span>{unit}</span>}
        </React.Fragment>
      )}
      {datatype === TagDataType.Bool && (
        <div className="col-span-2 flex justify-center">
          <AlertStatus
            className="size-[10px] 3xl:size-[20px]"
            type={alertStatusType}
          />
        </div>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="ml-1 truncate font-[7px] uppercase leading-[100%] tracking-[0%] 3xl:ml-2 3xl:font-[12px]">
              {description}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-[7px] uppercase leading-[100%] tracking-[0%] 3xl:font-[12px]">
              {description}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

function SwitchStatus({
  className,
  dimensions,
  switchClassName,
  label
}: {
  className?: string;
  label: string;
  dimensions?: "horizontal" | "vertical";
  switchClassName?: string;
}) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value } = data || {};
  return (
    <div className={twMerge("relative", className)}>
      <SwitchOnOff
        className={twMerge(
          "h-[24px] w-[24px] xl:h-[31px] xl:w-[31px] 3xl:h-[47px] 3xl:w-[47px]",
          switchClassName
        )}
        switchState={!!value}
        dimensions={dimensions}
      />
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

function TitleWithLableStatus({
  label,
  className
}: {
  className?: string;
  label: string;
}) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description } = data || {};

  if (value) {
    return (
      <div
        className={twMerge(
          "jusitfy-center relative flex min-h-4 min-w-[100px] items-center justify-center rounded-[10px] bg-[#006B00] p-1.5 px-2 text-[7px] uppercase leading-[100%] tracking-[0%] shadow-[0px_0px_4px_1px_#000000] 3xl:min-h-[32px] 3xl:text-[15px]",
          className
        )}
      >
        {description}
        <TagAssignComponent type="single" tag={label} />
        {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      </div>
    );
  } else {
    return (
      <RingBorder
        variant="outline-sm"
        className={twMerge("relative h-[32px] min-w-[110px]", className)}
      >
        {description}
        <TagAssignComponent type="single" tag={label} />
        {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      </RingBorder>
    );
  }
}

function TitleWithValueCard({
  label,
  showUnit = true,
  showDescription = true,
  className
}: {
  label: string;
  className?: string;
  showUnit?: boolean;
  showDescription?: boolean;
}) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { datatype, minimum, maximum, value, unit, description } = data || {};

  const valueClassNames =
    datatype === TagDataType.Float &&
      minimum !== null &&
      maximum !== null &&
      (value < minimum || value > maximum)
      ? "bg-[#AF0000] text-white"
      : "bg-black text-white";

  return (
    <div
      className={twMerge(
        "relative flex items-center gap-1.5 font-alexandria text-xxs leading-[100%] tracking-[0%] lg:text-[9px] 3xl:gap-2.5 3xl:text-xs",
        className
      )}
    >
      {showDescription && <p className="ml-auto">{description ?? "__"}</p>}
      <div
        className={twMerge(
          "min-h-2 min-w-10 rounded-[5px] border border-[#FFFFFF]/50 py-0.5 text-center font-alexandria shadow-[0px_0px_2px_1px_#949494] 3xl:min-h-5 3xl:min-w-20",
          valueClassNames
        )}
      >
        {value ?? "__"}
      </div>
      {showUnit && <p className="">{unit ?? "__"}</p>}
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}
