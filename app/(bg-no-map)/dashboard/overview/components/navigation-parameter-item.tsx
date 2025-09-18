import { ReactNode } from "react";
import { ErrorComponent } from "@/components/dashboard/overview-black/error-display";
import { TagAssignComponent } from "@/components/tag-assign";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";

export function NavigationParameterItem({
  label,
  icon
}: {
  label: string;
  icon: ReactNode;
}) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description } = data || {};

  return (
    <div className="relative flex h-[40px] w-full rounded-[11px] bg-[linear-gradient(90deg,_#383838_0%,_#8F8F8F_27.4%,_#2E2E2E_55.29%,_#8E8E8E_76.92%,_#484848_100%)] p-[1px]">
      <div className="flex h-full w-full gap-2 rounded-[10px] bg-[#141414] 3xl:p-[3px]">
        <div className="grid h-full w-full grid-cols-[min-content_1.5fr_10px_1fr] items-center gap-3 rounded-[7px] bg-[#010101] px-4 font-russo">
          {icon}
          <p className="lg:text-[11px] xl:text-[10px] 3xl:text-base">
            {description ?? "__"}
          </p>
          <p className="lg:text-[12px] xl:text-[15px] 3xl:text-xl">:</p>
          <p className="ml-2 lg:text-[12px] xl:text-[15px] 3xl:text-xl">
            {value ?? "__"}
          </p>
        </div>
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && (
        <ErrorComponent key={label} error={error.message} refetch={refetch} />
      )}
    </div>
  );
}
