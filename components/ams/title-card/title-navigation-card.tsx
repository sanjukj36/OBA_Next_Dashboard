import React from "react";
import Image, { StaticImageData } from "next/image";
import TitleNavigationCardBg from "@/assets/ams-dg/title-navigation-card-bg.png";

interface TitleCardProps {
  title: string;
  imageUrl?: StaticImageData | string;
  activePageName?: string;
  SetActivePageName?: (pageName: string) => void;
}

function TitleNavigationCard({
  title,
  activePageName,
  SetActivePageName
}: TitleCardProps) {
  return (
    <div
      className={`relative h-[31.6px] w-[183px] select-none transition duration-300 ${
        activePageName === title ? "shadow-[0_0_10px_white]" : ""
      }`}
      onClick={() => {
        if (SetActivePageName) {
          SetActivePageName(title);
        }
      }}
    >
      <Image
        src={TitleNavigationCardBg}
        alt={`${title} Background`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="text-left">
          <h1 className="whitespace-nowrap font-alexandria text-[15px] font-medium text-input">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default TitleNavigationCard;
