import { CanvasGaugeChart } from "../chart/canvas-gauge";
import SpmRpmTitleCard from "./spm-rpm-title-card";

export const GaugeCard = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <CanvasGaugeChart size={207} value={54} min={0} max={120} unit="RPM" />
      <SpmRpmTitleCard />
    </div>
  );
};
