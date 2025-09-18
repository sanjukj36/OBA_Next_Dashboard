import { twMerge } from "tailwind-merge";
import { TagAssignComponent } from "@/components/tag-assign";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { ErrorComponent } from "./error-display";
import { RingBorder } from "./ring-border";

interface TitleCardProps {
  label: string;
}

export function AMSNavigationCard({ label }: TitleCardProps) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};
  return (
    <RingBorder
      className={twMerge(
        // Mobile-first sizing
        "h-[80px] w-[160px]", // Base mobile size
        "xs:h-[90px] xs:w-[180px]", // ~400px+
        "sm:h-[95px] sm:w-[190px]", // 640px+
        "md:h-[100px] md:w-[200px]", // 768px+
        "lg:h-[74px] lg:w-[120px]", // 1024px+
        "xl:h-[86px] xl:w-[143px]", // 1280px+
        "2xl:h-[95px] 2xl:w-[180px]", // 1536px+
        "3xl:h-[105px] 3xl:w-[200px]", // 1920px+
        "relative"
      )}
      innerClassName="flex justify-center"
    >
      <p
        className={`xs:text-sm flex h-full w-full flex-1 items-center justify-center font-russo text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-[30px]`}
      >
        {description ?? "__"}
      </p>
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      <TagAssignComponent type="single" tag={label} />
    </RingBorder>
  );
}
