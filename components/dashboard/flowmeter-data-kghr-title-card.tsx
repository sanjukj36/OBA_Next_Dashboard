import React from "react";
import Image, { StaticImageData } from "next/image";

interface TitleCardProps {
  title: string;
  imageUrl?: StaticImageData | string;
}

function FlowmeterDataTitleCard({ title, imageUrl }: TitleCardProps) {
  return (
    <div className="relative m-2 h-[63px] w-[494.75px] select-none">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={`${title} Background`}
          fill
          className="object-cover"
          priority
        />
      )}

      <div className="absolute inset-0 z-10 items-center justify-center">
        <div className="grid grid-cols-6">
          <div className="col-span-2 ms-[36px] mt-[17px] whitespace-nowrap text-start font-russo text-xl font-medium text-white text-shadow-custom-black">
            {title}
          </div>
          <div className="mt-[17px] whitespace-nowrap font-russo text-xl font-medium text-white text-shadow-custom-black">
            kg/hr
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowmeterDataTitleCard;
