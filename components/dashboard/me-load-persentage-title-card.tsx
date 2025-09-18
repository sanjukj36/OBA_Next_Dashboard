import React from "react";
import Image, { StaticImageData } from "next/image";

interface TitleCardProps {
  title: string;
  imageUrl?: StaticImageData | string;
}

function LoadPersentageTitleCard({ title, imageUrl }: TitleCardProps) {
  return (
    <div className="relative m-2 h-[46.6px] w-[144px] select-none">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={`${title} Background`}
          fill
          className="object-cover"
          priority
        />
      )}
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

export default LoadPersentageTitleCard;
