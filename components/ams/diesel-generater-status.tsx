import React from "react";
import Image from "next/image";
import DgImage from "@/assets/ams-dg/dg_image.png";
import { StatusPushButton } from "./status-push-button";

interface DieselGeneraterStatus {
  title: string;
  value: number;
  measurement: string;
}

function DieselGeneraterStatus() {
  const title = "Sub2 DG Data";
  const active = true;

  return (
    <div className="relative me-10 mt-[42px] h-[300px] w-[844px] select-none overflow-hidden rounded-[10px] shadow-md">
      <Image
        src={DgImage}
        alt={`${title} Background`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 z-10 ms-[20px] mt-7 flex flex-col gap-[8px]">
        <div className="flex">
          <StatusPushButton active={active} />
        </div>
      </div>
      <div className="absolute inset-0 z-10 ms-[72px] mt-[73px] flex flex-col gap-[8px]">
        <div className="flex">
          <div className="h-[71px] w-[115px] rounded-md bg-[#2F2F2F]">
            <div className="flex-1">
              <span className="ms-2 items-center text-[9px] text-input">
                WINDING TEMP [°C]
              </span>
              <WindingTempItem phase="V" value={63} />
              <WindingTempItem phase="U" value={63} />
              <WindingTempItem phase="W" value={63} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DieselGeneraterStatus;

const WindingTempItem = ({
  phase,
  value
}: {
  phase: string;
  value: number;
}) => (
  <div className="mt-[1px] flex justify-evenly">
    <span className="text-[9px] text-input">({phase})</span>
    <span className="h-[14px] w-[24px] rounded-sm border-[0.2px] border-black/80 bg-[#515151] text-center text-[9px] text-input">
      {value}
    </span>
  </div>
);
