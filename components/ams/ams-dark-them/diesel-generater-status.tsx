import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import DgImage from "@/assets/ams-dg/dg_image.png";
import { ErrorComponent } from "@/components/dashboard/overview-black/error-display";
import { TagAssignComponent } from "@/components/tag-assign";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { StatusPushButton } from "./status-push-button";

function EngineStatus({ label }: { label: string }) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value } = data || {};
  return (
    <div className="absolute inset-0 z-10 ms-[20px] mt-7 flex select-none flex-col gap-[8px]">
      <div className="flex">
        <div className="relative mr-auto">
          <StatusPushButton active={!!value} />
          <TagAssignComponent type="single" tag={label} />
          {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
        </div>
      </div>
    </div>
  );
}

interface DieselGeneraterStatus {
  title: string;
  value: number;
  measurement: string;
}

function DieselGeneraterStatus({ label }: { label: string }) {
  const title = "Sub2 DG Data";

  return (
    <div className="relative me-10 mt-[42px] h-[372px] w-[1047px] select-none overflow-hidden rounded-[10px] shadow-md">
      <Image
        src={DgImage}
        alt={`${title} Background`}
        fill
        className="select-none object-cover"
        priority
      />
      <EngineStatus label="sdlkfjd" />

      <div className="absolute inset-0 z-10 ms-[90px] mt-[91px] flex select-none flex-col gap-[8px]">
        <div className="flex">
          <div className="h-[87px] w-[142px] rounded-md bg-neutral-900 shadow-[2px_2px_4px_0px_rgba(0,0,0,1.00)]">
            <div className="flex-1 items-center text-center">
              <span className="ms-2 items-center text-[9px] text-input">
                WINDING TEMP [°C]{" "}
              </span>
              <WindingTempItem label="ldkjf" />
              <WindingTempItem label="ldkjfdflkjd" />
              <WindingTempItem label="ldkjfdlksj" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[33px] left-0 right-0 z-20 ms-[88px]">
        <div className="flex gap-[107px]">
          <ColorChanginCard label="BLOCKING" />
          <ColorChanginCard label="STOP" />
          <ColorChanginCard label="REMOTE" />
          <ColorChanginCard label="T/G ENGAGED" />
        </div>
      </div>
    </div>
  );
}

export default DieselGeneraterStatus;

const WindingTempItem = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description } = data || {};

  return (
    <div className="relative mt-[1px] flex items-center justify-evenly space-x-1">
      <span className="text-[9px] text-input">({description ?? "__"})</span>
      <div className="flex h-[18px] w-[28px] items-center justify-center rounded-sm border-[0.2px] border-black/80 bg-[#515151]">
        <span className="text-[9px] text-input">{value ?? "__"}</span>
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

const ColorChanginCard = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description } = data || {};

  const valueClassNames =
    value !== null && value !== undefined
      ? value
        ? "bg-[#006B00] text-white"
        : "bg-[#B91C1C] text-white"
      : "bg-[#404040] text-black";

  return (
    <div className="pointer-events-auto relative mt-[1px] flex items-center justify-evenly space-x-1">
      <div
        className={twMerge(
          "flex h-[28px] w-[134px] items-center justify-center rounded-[10px] border border-neutral-700 bg-[#404040] shadow-[0px_0px_6.3px_0.5px_rgba(232,232,232,1.00)]",
          valueClassNames
        )}
      >
        <span className="text-center font-alexandria text-[15px] font-medium text-white">
          {description ?? "__"}
        </span>
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};
