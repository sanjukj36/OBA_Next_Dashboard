import React from "react";
import Image, { StaticImageData } from "next/image";
import generatorsNumberBg from "@/assets/ams/generators-number-bg.png";

interface TitleCardProps {
  title: string;
  imageUrl?: StaticImageData | string;
}

function GeneratorsNumberTitleCard({ title }: TitleCardProps) {
  return (
    <div className="relative m-2 h-[32px] w-[57px] select-none drop-shadow-lg">
      <Image
        src={generatorsNumberBg}
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

export default GeneratorsNumberTitleCard;
