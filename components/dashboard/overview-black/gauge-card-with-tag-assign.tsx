import { useWindowSize } from "react-use";
import { CanvasGaugeChart } from "@/components/chart/canvas-gauge";
import { TagAssignComponent } from "@/components/tag-assign";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { useShowTrend } from "../trends/trend-context";
import { ErrorComponent } from "./error-display";

type GaugeCardWithTagAssignProps = {
  label: string;
  size?: number;
};

export const GaugeCardWithTagAssign = ({
  label
  // size = 207
}: GaugeCardWithTagAssignProps) => {
  const { data: latestData, error, refetch, isLoading } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { minimum, maximum, value, unit, description, tag_from_vessel } =
    data || {};
  const { width } = useWindowSize();

  const GAUGE_SIZES = {
    DEFAULT: 207, // 2xl and above (1536px+)
    XXL: 176,
    XL: 146, // xl (1280px-1535px)
    // LG: 115.73, // lg (1024px-1279px)
    LG: 115.73, // lg (1024px-1279px)
    MD: 120, // md (768px-1023px)
    SM: 100, // sm (640px-767px)
    XS: 80 // xs (<640px)
  };

  const getGaugeSize = (width: number) => {
    if (!width) return GAUGE_SIZES.DEFAULT; // Fallback if width not available

    if (width >= 1636) return GAUGE_SIZES.DEFAULT;
    if (width >= 1536) return GAUGE_SIZES.XXL;
    if (width >= 1280) return GAUGE_SIZES.XL;
    if (width >= 1024) return GAUGE_SIZES.LG;
    if (width >= 768) return GAUGE_SIZES.MD;
    if (width >= 640) return GAUGE_SIZES.SM;
    return GAUGE_SIZES.XS;
  };
  return (
    <div className="relative isolate flex flex-col items-center gap-2">
      <CanvasGaugeChart
        size={getGaugeSize(width)}
        value={value ?? 0}
        min={minimum ?? 0}
        max={maximum ?? 120}
        unit={unit ?? "__"}
        type="normal_black"
        loading={isLoading}
      />
      <GaugeTitleCard title={description ?? "__"} tag={tag_from_vessel} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      <TagAssignComponent type="single" tag={label} />
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
      onPointerDown={handleClick}
      className="w-full rounded-[25px] bg-linear-black-overview-card p-[1px] shadow-black-overview-card"
    >
      <div className="flex w-full justify-center rounded-[25px] bg-black p-4 lg:p-[9px] xl:p-4 2xl:p-4 3xl:p-4">
        <p className="font-russo text-[20px] font-normal lg:text-[10px] xl:text-[12px] 3xl:text-[20px]">
          {title}
        </p>
      </div>
    </div>
  );
}
