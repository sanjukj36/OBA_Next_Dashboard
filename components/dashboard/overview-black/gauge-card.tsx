import { useWindowSize } from "react-use";
import { CanvasGaugeChart } from "@/components/chart/canvas-gauge";
import { useLatestDataByTag } from "@/queries/use-latest-data-by-tag";
import { useShowTrend } from "../trends/trend-context";
import { ErrorComponent } from "./error-display";

const GAUGE_SIZES = {
  DEFAULT: 207, // 2xl and above (1536px+)
  XL: 146, // xl (1280px-1535px)
  LG: 115.73, // lg (1024px-1279px)
  MD: 120, // md (768px-1023px)
  SM: 100, // sm (640px-767px)
  XS: 80 // xs (<640px)
};

const getGaugeSize = (width: number) => {
  if (!width) return GAUGE_SIZES.DEFAULT; // Fallback if width not available

  if (width >= 1536) return GAUGE_SIZES.DEFAULT;
  if (width >= 1280) return GAUGE_SIZES.XL;
  if (width >= 1024) return GAUGE_SIZES.LG;
  if (width >= 768) return GAUGE_SIZES.MD;
  if (width >= 640) return GAUGE_SIZES.SM;
  return GAUGE_SIZES.XS;
};
export const GaugeCard = ({ title, tag }: { title: string; tag: string }) => {
  const { data, error, refetch } = useLatestDataByTag(tag);
  const { width} = useWindowSize();
  return (
    <div className="relative isolate flex flex-col items-center gap-2">
      <CanvasGaugeChart
        size={getGaugeSize(width)}
        value={data?.value ?? 0}
        min={data?.min ?? 0}
        max={data?.max ?? 120}
        unit={data?.unit ?? "__"}
        type="normal_black"
      />
      <GaugeTitleCard title={title} tag={tag} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

function GaugeTitleCard({ title, tag }: { title: string; tag: string }) {
  const { setTrendTagName, setShowTrendModal } = useShowTrend();
  const handleClick = () => {
    setTrendTagName({ tag1: tag, tag1Label: title });
    setShowTrendModal(true);
  };
  return (
    <div
      className="w-full cursor-pointer rounded-[25px] bg-linear-black-overview-card p-[1px] shadow-black-overview-card lg:w-full lg:rounded-[25px] xl:w-[131px] xl:rounded-[25px] 2xl:w-[131px] 3xl:h-full 3xl:w-full 3xl:rounded-[25px]"
      onPointerDown={handleClick}
    >
      <div className="flex w-full justify-center rounded-[25px] bg-black lg:p-3 xl:p-3 2xl:p-3 3xl:p-4">
        <p className="font-russo text-[14px] font-normal lg:text-[9px] xl:text-[11px] 2xl:text-[14px] 3xl:text-[20px]">
          {title}
        </p>
      </div>
    </div>
  );
}
