import { PopoverContentProps } from "@radix-ui/react-popover";
import { twMerge } from "tailwind-merge";
import { TagAssignComponent } from "@/components/tag-assign";
import {
  AmsCard,
  AmsCardContent,
  AmsCardHeader,
  AmsCardValue
} from "@/components/ui/ams-card";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { ErrorComponent } from "./dashboard/overview-black/error-display";
import {
  BoolResponseStatusKeys,
  BoolResponseType
} from "./tag-assign/single-tag-form";
import { Loader2 } from "lucide-react";

export const DataCard = ({
  label,
  title,
  className,
  side = "left"
}: {
  label: string;
  title?: string;
  className?: string;
  side?: PopoverContentProps["side"];
}) => {
  const {
    data: latestData,
    error,
    refetch,
    isLoading,
  } = useLatestDataByLabel<BoolResponseType, BoolResponseStatusKeys>(label);
  const { data } = latestData || {};


  return (
    <AmsCard
      className={twMerge(
        "relative isolate max-h-[224px] w-full lg:w-auto xl:w-full 2xl:w-full 3xl:w-full",
        className
      )}
    >
      {title && <AmsCardHeader label={title} />}
      {isLoading
        ?
        <AmsCardContent className="scrollbar-none max-h-[inherit] overflow-y-auto text-white flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </AmsCardContent>
        : data && data.length > 0 ? (
          <AmsCardContent className="scrollbar-none max-h-[inherit] overflow-y-auto py-0.5">
            {data.map((item, index) => {
              return <AmsCardValue key={index} {...item} />;
            })}
          </AmsCardContent>
        ) : (
          <AmsCardContent className="scrollbar-none max-h-[inherit] overflow-y-auto text-white">
            No data found.
          </AmsCardContent>
        )}
      <TagAssignComponent tag={label} type="multiple" side={side} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </AmsCard>
  );
};
