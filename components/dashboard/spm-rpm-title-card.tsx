import React from "react";
import Image from "next/image";
import spmRpmBgImage from "@/assets/ams/ams-spm-rpm-bg.png";

interface TitleCardProps {
  title?: string;
}

export function SpmRpmTitleCard({ title = "SPM RPM" }: TitleCardProps) {
  return (
    <div className="relative m-2 h-[46.6px] w-[144.99px] select-none">
      <Image
        src={spmRpmBgImage}
        alt={`${title} Background`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="text-left">
          <h1 className="whitespace-nowrap font-russo text-xl font-medium text-white">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default SpmRpmTitleCard;
