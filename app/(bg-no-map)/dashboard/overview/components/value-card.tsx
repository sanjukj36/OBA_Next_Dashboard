import { TagDataType } from "@/types/tag-assign";
import { useShowTrend } from "@/components/dashboard/trends/trend-context";
import { RingBorder } from "@/components/dashboard/overview-black/ring-border";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { TagAssignComponent } from "@/components/tag-assign";
import { twMerge } from "tailwind-merge";
import { ErrorComponent } from "@/components/dashboard/overview-black/error-display";

export function ValueCard({
  label,
  className
}: {
  label: string;
  className?: string;
}) {
  const { setTrendTagName, setShowTrendModal } = useShowTrend();

  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const {
    value,
    unit,
    description,
    datatype,
    maximum,
    minimum,
    tag_from_vessel
  } = data || {};

  const valueSize = value?.toString().length ?? 2;
  const valueSizeMap = {
    "4": "3xl:text-[30px] xl:text-[18px] lg:text-[9px]",
    "5": "3xl:text-[28px] xl:text-[18px] lg:text-[9px]",
    "6": "3xl:text-[28px] xl:text-[18x] lg:text-[9px]",
    "7": "3xl:text-[24px] xl:text-[18px] lg:text-[9px]",
    "8": "3xl:text-[20px] xl:text-[18px] lg:text-[9px]"
  };
  const textSize =
    valueSize < 4
      ? valueSizeMap["4"]
      : valueSize > 8
        ? valueSizeMap["8"]
        : valueSizeMap[valueSize.toString() as keyof typeof valueSizeMap];

  const handleClick = () => {
    setTrendTagName({ tag1: tag_from_vessel, tag1Label: description });
    setShowTrendModal(true);
  };

  const isAlarm =
    datatype === TagDataType.Float &&
    minimum !== null &&
    maximum !== null &&
    (value < minimum || value > maximum);

  return (
    <RingBorder
      variant={isAlarm ? "value-card-destructive" : "value-card"}
      className={twMerge(
        "relative isolate",
        // Height scaling
        "h-[3px] min-h-[30px]", // Mobile default
        "xs:h-[3px] xs:min-h-[32px]", // ~400px+
        "sm:h-[4px] sm:min-h-[34px]", // 640px+
        "md:h-[4px] md:min-h-[36px]", // 768px+
        "lg:h-[4px] lg:min-h-[38px] lg:w-auto", // 1024px+
        "xl:h-[4px] xl:min-h-[38px]", // 1280px+
        "2xl:h-[4px] 2xl:min-h-[44px]", // 1536px+
        "3xl:h-full 3xl:min-h-[50px] 3xl:w-full", // 1920px+
        className
      )}
      innerClassName={twMerge(
        "flex flex-row items-center justify-center gap-1 p-0 leading-none",
        // Optional responsive inner padding
        "sm:gap-1.5",
        "lg:gap-1",
        "xl:gap-1.5",
        "2xl:gap-1.5"
      )}
    >
      <p
        className={twMerge(
          "font-din font-bold leading-[100%] tracking-[0%]",
          textSize
        )}
        onPointerDown={!error ? handleClick : undefined}
      >
        {value ?? "__"}
      </p>
      <p className="text-secondary lg:text-[6px] 3xl:text-sm">
        {" "}
        {unit ?? "__"}
      </p>
      <TagAssignComponent type="single" tag={label} />
      {error && (
        <ErrorComponent key={label} error={error.message} refetch={refetch} />
      )}
    </RingBorder>
  );
}
