import React from "react";
import { twMerge } from "tailwind-merge";
import { ErrorComponent } from "@/components/dashboard/overview-black/error-display";
import { DataCard } from "@/components/data-card";
import { TagAssignComponent } from "@/components/tag-assign";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { TagDataType } from "@/types/tag-assign";

interface DgEXHGasMesurmentProps {
  label: string;
}

function TableCardValue({ label }: { label: string }) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { datatype, minimum, maximum, value } = data || {};

  const valueClassNames =
    datatype === TagDataType.Float &&
    minimum !== null &&
    maximum !== null &&
    (value < minimum || value > maximum)
      ? "bg-[#AF0000]/60 text-white"
      : "bg-black text-white";
  return (
    <div
      className={twMerge(
        "relative flex h-[15px] w-[43px] items-center justify-center rounded-[5px] border border-neutral-400 bg-black text-[12px] shadow-[0px_0px_2px_1px_rgba(148,148,148,1.00)]",
        valueClassNames
      )}
    >
      <span>{value}</span>

      <TagAssignComponent tag={label} type="single" side={"bottom"} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

function TableCardTitle({
  label,
  className
}: {
  label: string;
  className: string;
}) {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  return (
    <div className={twMerge("relative", className)}>
      {description ?? "__"}
      <TagAssignComponent tag={label} type="single" side={"bottom"} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}

function DgEXHGasMesurment({ ...props }: DgEXHGasMesurmentProps) {
  return (
    <div className="mt-12 flex w-[911px] select-none">
      <div className="">
        <DataCard
          label="ldkfjdlf"
          className="max-h-[126px] w-[290px]"
          side="bottom"
        />
      </div>

      <div className="ml-auto flex">
        <div className="mt-auto grid grid-cols-[auto,1fr] grid-rows-3 gap-x-3 gap-y-0.5">
          <div className="row-span-3 grid grid-rows-subgrid">
            <TableCardTitle
              label="dlkjfd"
              className="col-start-1 col-end-2 row-start-2 row-end-3 font-alexandria text-[14px]"
            />
            <TableCardTitle
              label="dlkjfd"
              className="col-start-1 col-end-2 row-start-3 row-end-4 font-alexandria text-[14px]"
            />
          </div>
          <div className="grid grid-cols-6 place-items-center gap-5 rounded-md bg-[#D9D9D933] px-2 text-[15px]">
            <div className="w-[41.08px] rounded-md text-center">NO.1</div>
            <div className="w-[41.08px] rounded-md text-center">NO.2</div>
            <div className="w-[41.08px] rounded-md text-center">NO.3</div>
            <div className="w-[41.08px] rounded-md text-center">NO.4</div>
            <div className="w-[41.08px] rounded-md text-center">NO.5</div>
            <div className="w-[41.08px] rounded-md text-center">NO.6</div>
          </div>
          <div className="grid grid-cols-6 place-items-center gap-5">
            <TableCardValue label="dkfj" />
            <TableCardValue label="dkfj" />
            <TableCardValue label="dlkfj" />
            <TableCardValue label="kdfjd" />
            <TableCardValue label="dlkfj" />
            <TableCardValue label="dfdlk" />
          </div>
          <div className="grid grid-cols-6 place-items-center gap-5">
            <TableCardValue label="dkfj" />
            <TableCardValue label="dkfj" />
            <TableCardValue label="dlkfj" />
            <TableCardValue label="kdfjd" />
            <TableCardValue label="dlkfj" />
            <TableCardValue label="dfdlk" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DgEXHGasMesurment;
