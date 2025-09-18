import React, { useState } from "react";
import Image from "next/image";
import AlertBg from "@/assets/ams-dg/dg_alert_bg.png";
import { AlertStatusButton } from "../alert-status-button";

interface CoreDataItem {
  title: string;
  value: boolean;
  measurement?: string;
}

function DgAlertCard() {
  const [coreData] = useState<CoreDataItem[]>([
    { title: "NO 1 DG DE BEARING TEMPERATURE HIGH", value: true },
    { title: "NO 1 DG DE BEARING TEMPERATURE LOW LOW", value: false },
    { title: "NO 1 DG DE BEARING TEMPERATURE LOW", value: true },
    { title: "NO 1 DG DE BEARING TEMPERATURE LOW", value: true },
    { title: "NO 1 DG DE BEARING TEMPERATURE LOW", value: true }
  ]);

  const title = "DG Alert Data";

  return (
    <div className="relative h-[160px] w-[446px] select-none">
      <Image
        src={AlertBg}
        alt={`${title} Background`}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 z-10 ms-5 mt-5 flex flex-col gap-y-1">
        {coreData.map((item, index) => (
          <div key={index} className="flex items-center">
            <AlertStatusButton active={item.value} />
            <div className="ms-2 text-sm">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DgAlertCard;
