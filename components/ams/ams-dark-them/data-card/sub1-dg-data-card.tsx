import React, { useState } from "react";
import Image from "next/image";
import SubDataBg from "@/assets/ams-dg/sub1_dg_data_bg.png";

interface Sub1DgDataCardItem {
  title: string;
  value: number;
  measurement: string;
}

function Sub1DgDataCard() {
  const [coreData] = useState<Sub1DgDataCardItem[]>([
    { title: "NO1 DG LOAD FACTOR", value: 1799, measurement: "" },
    { title: "NO1 DG SPEED", value: 1800, measurement: "RPM" },
    { title: "NO1 FUEL RATE", value: 75, measurement: "%" },
    { title: "NO1 DG BATTERY VOLTAGE", value: 69, measurement: "v" },
    { title: "NO1 DG JACKET WATER TEMPERATURE", value: 46, measurement: "C" }
  ]);

  const title = "Sub1 DG Data";

  return (
    <div className="relative h-[228px] w-[334px] select-none overflow-hidden rounded-[10px] shadow-md">
      <Image
        src={SubDataBg}
        alt={`${title} Background`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 z-10 ms-[20px] mt-7 flex flex-col gap-[8px]">
        {coreData.map((item, index) => (
          <div key={index} className="flex">
            <div className="w-[60%] text-input">{item.title}</div>
            <div>
              <div className="ms-1 w-[50px] rounded-[8px] border border-input text-center shadow-black-overview-card shadow-input/80">
                {item.value}
              </div>
            </div>
            <div className="ms-4 w-[20%] text-left">{item.measurement}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sub1DgDataCard;
