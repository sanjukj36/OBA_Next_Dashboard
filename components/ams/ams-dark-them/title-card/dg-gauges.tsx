import React from "react";
import { CanvasGaugeChart } from "@/components/chart/canvas-gauge";

interface DgGaugesProps {
  title: string;
  value: number;
}

function DgGauges({ title, value }: DgGaugesProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <CanvasGaugeChart
        size={178}
        value={value}
        min={0}
        max={120}
        unit="RPM"
        type="normal_black"
      />
      <div className="relative mt-3 h-[29px] w-[150px] rounded-[10px] border border-neutral-700/80 shadow-[0px_0px_6.300000190734863px_0.5px_rgba(232,232,232,1.00)]">
        <div className="flex justify-center rounded-[25px] bg-black p-1">
          <p className="font-alexandria text-[12px]">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default DgGauges;
