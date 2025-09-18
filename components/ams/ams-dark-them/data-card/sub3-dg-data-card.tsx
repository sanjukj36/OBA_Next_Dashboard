import React, { useState } from "react";
import Image from "next/image";
import SubDataBg from "@/assets/ams-dg/sub3_dg_data_bg.png";

interface Sub3DgDataCardItem {
  title: string;
  value: number;
  measurement: string;
}

function Sub3DgDataCard() {
  const [coreData] = useState<Sub3DgDataCardItem[]>([
    { title: "NO1 DG WATER SEPERATOR LEVEL", value: 0.3, measurement: "BAR" },
    { title: "NO1 DG EXHAUST TEMP", value: 4, measurement: "BAR" },
    { title: "DG1 POWER", value: 78, measurement: "C" },
    { title: "DG1 VOLTAGE", value: 5, measurement: "BAR" }
  ]);

  const title = "Sub2 DG Data";

  return (
    <div className="relative h-[194px] w-[334px] select-none overflow-hidden rounded-[10px] shadow-md">
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

export default Sub3DgDataCard;
