import React from "react";
import Image, { StaticImageData } from "next/image";

interface TitleCardProps {
  title: string;
  imageUrl?: StaticImageData | string;
}

function TitleCard({ title, imageUrl }: TitleCardProps) {
  return (
    <div className="relative m-2 h-[104px] w-[246px] select-none">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={`${title} Background`}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-center font-russo text-4xl font-bold text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}

export default TitleCard;
