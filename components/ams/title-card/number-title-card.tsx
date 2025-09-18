import React from "react";
import Image, { StaticImageData } from "next/image";
import NumberCardBg from "@/assets/ams-dg/number-card-bg.png";

interface NumberTitleProps {
  title: number;
  imageUrl?: StaticImageData | string;
  activeDgNumber?: number;
  SetActiveDgNumber?: (number: number) => void;
}

function NumberTitleCard({
  title,
  activeDgNumber,
  SetActiveDgNumber
}: NumberTitleProps) {
  return (
    <div
      className={`relative h-[47px] w-[109.17px] select-none ${
        activeDgNumber === title ? "shadow-[0_0_10px_white]" : ""
      }`}
      onClick={() => {
        if (SetActiveDgNumber) {
          SetActiveDgNumber(title);
        }
      }}
    >
      <Image
        src={NumberCardBg}
        alt={`${title} Background`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="text-left">
          <h1 className="whitespace-nowrap font-russo text-[15px] font-medium text-white">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default NumberTitleCard;
