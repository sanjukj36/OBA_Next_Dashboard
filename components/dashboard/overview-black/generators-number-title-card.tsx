import React from "react";
import { twMerge } from "tailwind-merge";

export function GeneratorsNumberTitleCard({
  value
}: {
  value: string | number;
}) {
  return (
    <div
      className={twMerge(
        "flex rounded-[7px] bg-linear-black-overview-card p-0.5 lg:h-[28px] lg:w-[44px] xl:h-[28px] xl:w-[44px] 3xl:h-[34px] 3xl:w-[59px]"
      )}
    >
      <div
        className={twMerge(
          "flex h-full w-full items-center justify-center rounded-[5px] bg-black font-russo lg:text-[15px] xl:text-[18px] 3xl:text-[25px]"
        )}
      >
        {value}
      </div>
    </div>
  );
}
