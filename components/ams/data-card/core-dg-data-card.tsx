import React, { useState } from "react";
import Image from "next/image";
import CoreDgDataBg from "@/assets/ams-dg/dg-core-data-bg.png";

interface CoreDataItem {
  title: string;
  value: number;
  measurement: string;
}

function CoreDgDataCard() {
  const [coreData] = useState<CoreDataItem[]>([
    { title: "DG 1 Engine Speed", value: 1799, measurement: "RPM" },
    { title: "DG 1 Desired Engine Speed", value: 1800, measurement: "RPM" },
    { title: "DG 1 Throttle Position", value: 75, measurement: "%" },
    { title: "DG 1 Engine Coolant Temperature", value: 69, measurement: "C" },
    { title: "DG 1 Fuel Temperature", value: 46, measurement: "C" },
    { title: "DG 1 Inlet Air Temperature", value: 51, measurement: "C" },
    { title: "DG 1 Battery Voltage", value: 24, measurement: "Volt" },
    {
      title: "DG 1 Engine OIL Pressure absolute",
      value: 104,
      measurement: "BAR"
    },
    { title: "DG 1 Engine OIL Pressure", value: 4, measurement: "BAR" },
    { title: "DG 1 Fuel Pressure absolute", value: 4, measurement: "BAR" },
    { title: "DG 1 Fuel Pressure", value: 5, measurement: "BAR" },
    { title: "DG 1 Atmospheric Pressure", value: 1, measurement: "BAR" },
    { title: "DG 1 Engine Load Factor", value: 75, measurement: "BAR" },
    { title: "DG 1 Engine Power Derate", value: 20, measurement: "%" }
  ]);

  const title = "Core DG Data";

  return (
    <div className="relative h-[674px] w-[560px] select-none">
      <Image
        src={CoreDgDataBg}
        alt={`${title} Background`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 z-10 ms-[24px] mt-9 flex flex-col gap-[13px]">
        {coreData.map((item, index) => (
          <div key={index} className="flex text-[18px]">
            <div className="w-[60%] text-input">{item.title}</div>
            <div className="w-[60px] rounded-[8px] border border-input text-center shadow-black-overview-card shadow-input/80">
              {item.value}
            </div>
            <div className="ms-6 w-[20%] text-left">{item.measurement}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoreDgDataCard;
