import React from "react";
import Image from "next/image";
import amsTitleBg from "@/assets/ams/ams-card-bg.png";

interface TitleCardProps {
  title?: string;
}

export function AMSNavigationCard({ title = "AMS" }: TitleCardProps) {
  return (
    <a
      href="https://ams.memphis-marine.com"
      target="_blank"
      className="relative h-[104px] w-[246px] cursor-pointer"
    >
      <Image
        src={amsTitleBg}
        alt={`${title} Background`}
        fill
        className="pointer-events-none select-none object-cover"
        priority
      />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-center font-russo text-4xl font-bold text-white">
          {title}
        </h1>
      </div>
    </a>
  );
}
