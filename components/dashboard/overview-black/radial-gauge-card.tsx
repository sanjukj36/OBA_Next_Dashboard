import React from "react";
import { CanvasRadialGaugeChart } from "@/components/chart/canvas-radial-gauge-chart";
import { TagAssignComponent } from "@/components/tag-assign";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { useShowTrend } from "../trends/trend-context";
import { ErrorComponent } from "./error-display";
import { OverviewCard } from "./overview-card";

export const RadialGaugeCard = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { minimum, maximum, value, description, tag_from_vessel } = data || {};
  return (
    <OverviewCard className="relative isolate flex h-auto w-full flex-col items-center justify-between gap-4 px-3 pb-7 sm:h-[180px] sm:w-[90px] md:h-[190px] md:w-[95px] lg:left-[-7px] lg:top-[8px] lg:mt-[-10px] lg:h-full lg:w-[108px] xl:left-[-7px] xl:top-[1px] xl:mt-[-2px] xl:h-auto xl:w-[129px] xl:pt-8 2xl:left-[-7px] 2xl:top-[1px] 2xl:mt-[-2px] 2xl:h-[250px] 2xl:w-[160px] 2xl:pt-8 3xl:left-0 3xl:h-full 3xl:w-[195px] 3xl:pt-4">
      {/* 3XL Size */}
      <div className="hidden 3xl:block">
        <CanvasRadialGaugeChart
          value={value ?? 0}
          min={minimum ?? 0}
          max={maximum ?? 0}
          size={170}
          type="radial_black"
        />
      </div>

      {/* XL Size */}
      <div className="hidden xl:block 3xl:hidden">
        <CanvasRadialGaugeChart
          value={value ?? 0}
          min={minimum ?? 0}
          max={maximum ?? 0}
          size={110.32}
          type="radial_black"
        />
      </div>

      {/* Default Size */}
      <div className="block xl:hidden">
        <CanvasRadialGaugeChart
          value={value ?? 0}
          min={minimum ?? 0}
          max={maximum ?? 0}
          size={100} // Your default size
          type="radial_black"
        />
      </div>
      <LoadPersentageTitleCard title={description} tag={tag_from_vessel} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      <TagAssignComponent type="single" tag={label} />
    </OverviewCard>
  );
};

function LoadPersentageTitleCard({
  title,
  tag
}: {
  title: string;
  tag: string;
}) {
  const { setTrendTagName, setShowTrendModal } = useShowTrend();
  const handleClick = () => {
    setTrendTagName({ tag1: tag, tag1Label: title });
    setShowTrendModal(true);
  };
  return (
    <div
      onPointerDown={handleClick}
      className="xs:w-[90px] xs:h-[36px] xs:px-3 xs:py-2 flex h-[44px] w-full items-center justify-center rounded-[10px] border border-[#AFAFAF]/50 px-4 py-3 md:h-[30px] md:w-[94px] md:px-3 md:py-1.5 lg:h-[28.52px] lg:w-[96px] lg:px-3 lg:py-1.5 xl:h-[31.79px] xl:w-[107px] xl:px-3.5 xl:py-2 2xl:h-[36px] 2xl:w-[120px] 2xl:px-4 2xl:py-2.5 3xl:h-[40px] 3xl:w-full 3xl:px-6 3xl:py-3"
    >
      <h1 className="xs:text-[11px] whitespace-nowrap font-russo text-[10px] font-medium text-white sm:text-[12px] md:text-[13px] lg:text-[11px] xl:text-[13px] 2xl:text-[14px] 3xl:text-[20px]">
        {title}
      </h1>
    </div>
  );
}
