"use client";

import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import DgImageSm from "@/assets/ams-dg/dg_image_sm.png";
import DgImageXl from "@/assets/ams-dg/dg_image_xl.png";
import DgImage from "@/assets/ams-dg/dg_image.png";
import { ErrorComponent } from "@/components/dashboard/overview-black/error-display";
import { GaugeCardWithTagAssign } from "@/components/dashboard/overview-black/gauge-card-with-tag-assign";
import { DataCard } from "@/components/data-card";
import { TagAssignComponent } from "@/components/tag-assign";
import {
  BoolResponseStatusKeys,
  BoolResponseStatusValue,
  BoolResponseType
} from "@/components/tag-assign/single-tag-form";
import { AmsAlertStatusButton } from "@/components/ui/ams-card";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { TagDataType } from "@/types/tag-assign";
import { DgNavigation } from "./dg-navigation";
import { DGLabelList } from "./dg-taglist";

type DgComponentProps = {
  l: DGLabelList;
};

export default function Dg1Component({ l }: DgComponentProps) {
  return (
    <div className="col-start-1 -col-end-1 row-start-1 -row-end-1 grid grid-cols-subgrid grid-rows-subgrid">
      <div className="col-start-1 col-end-1 row-start-2 row-end-3 flex flex-col gap-[12px] xl:gap-2 3xl:gap-2">
        <DgNavigation />
        <DataCard
          label={l.Tag1}
          className="max-h-[688px] flex-1 font-alexandria text-[10px] xl:text-[10px] 3xl:text-[14px]"
        />
      </div>
      <div className="cols-start-2 col-end-3 row-start-1 row-end-3 grid grid-cols-[194px,_1fr] gap-4 rounded-[8px] border xl:grid-cols-[231px,_1fr] xl:gap-4 3xl:grid-cols-[350px,_1fr] 3xl:gap-4">
        <DataCard
          label={l.Tag2}
          className="max-h-full w-[194px] flex-1 font-alexandria text-[8px] xl:w-[231px] xl:text-[10px] 3xl:w-[350px] 3xl:text-[13px]"
        />
        <div className="flex-1">
          <div className="me-[22px] mt-2 grid gap-[0px] lg:grid-cols-4 xl:gap-[21px] 3xl:me-14 3xl:gap-[48px]">
            <GaugeCardWithTagAssign label={l.Tag3} size={178} />
            <GaugeCardWithTagAssign label={l.Tag4} size={178} />
            <GaugeCardWithTagAssign label={l.Tag5} size={178} />
            <GaugeCardWithTagAssign label={l.Tag6} size={178} />
          </div>
          <div className="mt-[19px] flex w-[505px] select-none xl:w-[673px] 3xl:w-[999px]">
            <DataCard
              label={l.Tag7}
              className="max-h-[60px] w-[153.11px] font-alexandria text-[6px] xl:w-[182px] xl:text-[8px] 2xl:w-[280px] 3xl:w-[290px] 3xl:text-[11px]"
              side="bottom"
            />
            <div className="w-[53px]"></div> 

            <div className="ml-auto flex">
              <div className="mt-auto grid grid-cols-[auto,1fr] grid-rows-3 gap-x-[6px] gap-y-0.5 xl:gap-x-[6px] 3xl:gap-x-[29px]">
                <div className="row-span-3 grid grid-rows-subgrid">
                  <TableCardTitle
                    label={l.Tag8}
                    className="col-start-1 col-end-2 row-start-2 row-end-3 mt-1 font-alexandria text-[6px] xl:text-[8px] 3xl:text-[14px]"
                  />
                  <TableCardTitle
                    label={l.Tag9}
                    className="col-start-1 col-end-2 row-start-3 row-end-4 mt-1 font-alexandria text-[6px] xl:text-[8px] 3xl:text-[14px]"
                  />
                </div>
                <div className="grid grid-cols-6 place-items-center gap-5 rounded-md bg-[#D9D9D933] px-2 text-[7px] xl:text-[10px] 3xl:text-[15px]">
                  <div className="w-[41.08px] rounded-md text-center">NO.1</div>
                  <div className="w-[41.08px] rounded-md text-center">NO.2</div>
                  <div className="w-[41.08px] rounded-md text-center">NO.3</div>
                  <div className="w-[41.08px] rounded-md text-center">NO.4</div>
                  <div className="w-[41.08px] rounded-md text-center">NO.5</div>
                  <div className="w-[41.08px] rounded-md text-center">NO.6</div>
                </div>
                <div className="grid grid-cols-6 place-items-center gap-2 xl:gap-3 3xl:gap-5">
                  <TableCardValue label={l.Tag10} />
                  <TableCardValue label={l.Tag11} />
                  <TableCardValue label={l.Tag12} />
                  <TableCardValue label={l.Tag13} />
                  <TableCardValue label={l.Tag14} />
                  <TableCardValue label={l.Tag15} />
                </div>
                <div className="grid grid-cols-6 place-items-center gap-2 xl:gap-3 3xl:gap-5">
                  <TableCardValue label={l.Tag16} showDesc />
                  <TableCardValue label={l.Tag17} showDesc />
                  <TableCardValue label={l.Tag18} showDesc />
                  <TableCardValue label={l.Tag19} showDesc />
                  <TableCardValue label={l.Tag20} showDesc />
                  <TableCardValue label={l.Tag21} showDesc />
                </div>
              </div>
            </div>
          </div>

          <div className="relative me-1 mt-[4px] h-[194px] w-[546px] select-none overflow-hidden rounded-[10px] shadow-md xl:h-[245px] xl:w-[689.88px] 3xl:me-10 3xl:h-[372px] 3xl:w-[1047px]">
            <div className="hidden 3xl:block">
              <Image
                src={DgImage}
                alt={`Sub2 DG Data Background`}
                fill
                className="select-none object-cover"
                priority
              />
            </div>
            <div className="hidden xl:block 3xl:hidden">
              <Image
                src={DgImageXl}
                alt={`Sub2 DG Data Background`}
                fill
                className="select-none object-cover"
                priority
              />
            </div>

            <div className="block xl:hidden">
              <Image
                src={DgImageSm}
                alt={`Sub2 DG Data Background`}
                fill
                className="select-none object-cover"
                priority
              />
            </div>

            <EngineStatus label={l.Tag22} />

            <div className="absolute inset-0 left-[48px] top-[48px] z-10 flex select-none flex-col xl:left-[60px] xl:top-[60px] 3xl:left-[90px] 3xl:top-[91px]">
              {/* <div className="flex"> */}
              <div className="h-[45px] mt-[-5px] ml-[-19px] 3xl:ml-[-19px] xl:ml-[-19px] lg:ml-[-17px] w-[73px] rounded-md bg-neutral-900 shadow-[2px_2px_4px_0px_rgba(0,0,0,1.00)] 
              lg:w-[123px] lg:h-[53px] xl:h-[67px] xl:w-[153px] 2xl:w-[150px] 2xl:h-[61px] 3xl:h-[100px] 3xl:w-[220px]">
                <div className="flex flex-1 flex-col p-1 text-center">
                  <span className="mb-[3px] text-[6px] text-input xl:mb-1 lg:text-[7px] 2xl:text-[8px] xl:text-[8px] 3xl:text-[13px]">
                    WINDING TEMP [°C]
                  </span>
                  <WindingTempItem label={l.Tag23} />
                  <WindingTempItem label={l.Tag24} />
                  <WindingTempItem label={l.Tag25} />
                </div>
                {/* </div> */}
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 z-20 ms-[55px] xl:bottom-[24px] xl:ms-[66px] 3xl:bottom-[33px] 3xl:ms-[88px]">
              <div className="flex gap-[28px] xl:gap-[35px] 3xl:gap-[107px]">
                <ColorChanginCard label={l.Tag26} />
                <ColorChanginCard label={l.Tag27} />
                <ColorChanginCard label={l.Tag28} />
                <ColorChanginCard label={l.Tag29} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-start-1 col-end-3 flex w-full justify-between gap-0 rounded-[8px] 3xl:gap-2">
        <DataCard
          label={l.Tag30}
          className="h-full max-h-[156px] min-h-[136px] font-alexandria text-[10px] lg:w-[25%] xl:text-[10px] 3xl:text-[15px]"
        />
        <DataCard
          label={l.Tag31}
          className="h-full max-h-[156px] min-h-[136px] font-alexandria text-[10px] lg:w-[25%] xl:text-[10px] 3xl:text-[15px]"
        />
        <DataCard
          label={l.Tag32}
          className="h-full max-h-[156px] min-h-[136px] font-alexandria text-[10px] lg:w-[25%] xl:text-[10px] 3xl:text-[15px]"
        />
        <DataCard
          label={l.Tag33}
          className="h-full max-h-[156px] min-h-[136px] font-alexandria text-[10px] lg:w-[25%] xl:text-[10px] 3xl:text-[15px]"
        />
      </div>
    </div>
  );
}

function TableCardValue({
  label,
  showDesc = false
}: {
  label: string;
  showDesc?: boolean;
}) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { datatype, minimum, maximum, value, description } = data || {};

  const valueClassNames =
    datatype === TagDataType.Float &&
      minimum !== null &&
      maximum !== null &&
      (value < minimum || value > maximum)
      ? "bg-[#AF0000]/60 text-white"
      : "bg-black text-white";
  return (
    <div
      className={twMerge(
        "relative flex h-[15px] w-[24px] items-center justify-center rounded-[5px] border border-neutral-400 bg-black text-[6px] shadow-[0px_0px_2px_1px_rgba(148,148,148,1.00)] xl:w-[32px] xl:text-[8px] 3xl:w-[56px] 3xl:text-[13px]",
        valueClassNames
      )}
    >
      {showDesc ? description : <p className="leading-[100%]">{value}</p>}

      <TagAssignComponent tag={label} type="single" side={"bottom"} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

function TableCardTitle({
  label,
  className
}: {
  label: string;
  className: string;
}) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  return (
    <div className={twMerge("relative", className)}>
      {description ?? "__"}
      <TagAssignComponent tag={label} type="single" side={"bottom"} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

function EngineStatus({ label }: { label: string }) {
  const {
    data: latestData,
    error,
    refetch
  } = useLatestDataByLabel<BoolResponseType, BoolResponseStatusKeys>(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, response_type } = data || {};

  const alertStatusType = response_type && response_type[value];
  return (
    <div className="absolute inset-0 z-10 ms-[20px] mt-7 flex select-none flex-col gap-[8px]">
      <div className="flex">
        <div className="relative mr-auto">
          <AmsAlertStatusButton
            type={alertStatusType}
            className="size-[20px] xl:size-[25px] 3xl:size-[31px]"
          />
          <TagAssignComponent type="single" tag={label} />
          {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
        </div>
      </div>
    </div>
  );
}

const WindingTempItem = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description } = data || {};

  return (
    <div className="relative mt-0 flex justify-evenly space-x-1 px-1 3xl:mt-[1px]">
      <span className="max-w-max truncate text-[6px] text-input xl:text-[7px] 3xl:text-[13px]">
        {description ?? "__"}
      </span>
      <div className="flex h-[10px] items-center justify-center rounded-sm border-[0.2px] border-black/80 bg-[#515151] px-[10px] xl:h-[12px] 3xl:h-[18px]">
        <span className="text-[6px] leading-[100%] text-input xl:text-[7px] 3xl:text-[13px]">
          {value ?? "__"}
        </span>
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

const ColorChanginCard = ({ label }: { label: string }) => {
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
    <div className="pointer-events-auto relative mt-[1px] flex items-center justify-evenly space-x-1">
      <div
        className={twMerge(
          "flex h-[16px] w-[80px] items-center justify-center rounded-[10px] border border-neutral-700 bg-[#404040] shadow-[0px_0px_6.3px_0.5px_rgba(232,232,232,1.00)] xl:h-[17px] xl:w-[100px] 3xl:h-[21px] 3xl:w-[134px]",
          innerSquareColors(activeClassName)
        )}
      >
        <span className="text-center font-alexandria text-[8px] font-medium text-white xl:text-[10px] 3xl:text-[15px]">
          {description ?? "__"}
        </span>
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};
