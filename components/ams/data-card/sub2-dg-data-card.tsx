import React, { useState } from "react";
import Image from "next/image";
import SubDataBg from "@/assets/ams-dg/sub2_dg_data_bg.png";

interface Sub2DgDataCardItem {
  title: string;
  value: number;
  measurement: string;
}

function Sub2DgDataCard() {
  const [coreData] = useState<Sub2DgDataCardItem[]>([
    { title: "NO1 DG JACKET WATER PRESSUR", value: 0.3, measurement: "BAR" },
    { title: "NO1 DG LUBE OIL PRESSURE", value: 4, measurement: "BAR" },
    { title: "NO1 DG LUBE OIL TEMPERATURE", value: 78, measurement: "C" },
    { title: "NO1 DG FUEL OIL PRESSURE", value: 5, measurement: "BAR" },
    { title: "NO1 DG AFTER COOLENT LEVEL", value: 100, measurement: "%" }
  ]);

  const title = "Sub2 DG Data";

  return (
    <div className="relative my-[14px] h-[271px] w-[334px] select-none overflow-hidden rounded-[10px] shadow-md">
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
              <div className="w-[50px] rounded-[8px] border border-input text-center shadow-black-overview-card shadow-input/80">
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

export default Sub2DgDataCard;
