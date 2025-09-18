import { useLatestDataByTag } from "@/queries/use-latest-data-by-tag";
import { ErrorComponent } from "./error-display";
import { GeneratorsNumberTitleCard } from "./generators-number-title-card";
import { OverviewCard } from "./overview-card";
import { StatusPushButtonComponent } from "./status-push-button";
import { ValueBoxComponent } from "./value-box";

type TagType = {
  title: string;
  tag: string;
  statusTag: string;
};

type GeneratorsStatusCardListProps = {
  data1: TagType;
  data2: TagType;
  data3: TagType;
  data4: TagType;
};

export const GeneratorsStatusCardList = ({
  data1,
  data2,
  data3,
  data4
}: GeneratorsStatusCardListProps) => {
  return (
    <OverviewCard className="relative flex flex-col gap-3 lg:ml-[-5px] lg:mt-[-3px] lg:h-[208px] lg:w-[260px] xl:ml-0 xl:mt-0 xl:h-[221px] xl:w-[287px] 3xl:ml-0 3xl:mt-0 3xl:h-full 3xl:w-[443px]">
      <h1 className="text-center font-russo uppercase text-shadow-custom-black lg:text-[12px] xl:text-[18px] 3xl:text-[25px]">
        Generators
      </h1>
      <div className="flex w-full flex-1 justify-around">
        <StatusCard tag={data1.tag} no={1} statusTag={data1.statusTag} />
        <StatusCard tag={data2.tag} no={2} statusTag={data2.statusTag} />
        <StatusCard tag={data3.tag} no={3} statusTag={data3.statusTag} />
        <StatusCard tag={data4.tag} no={4} statusTag={data4.statusTag} />
      </div>
    </OverviewCard>
  );
};

type StatusCardProps = {
  tag: TagType["tag"];
  no: number;
  statusTag: string;
};

function StatusCard({ tag, no, statusTag }: StatusCardProps) {
  const { data, error, refetch } = useLatestDataByTag(tag);

  return (
    <div className="relative isolate flex h-full flex-col items-center justify-between">
      <StatusPushButtonComponent tag={statusTag} />
      <GeneratorsNumberTitleCard value={no} />
      <ValueBoxComponent value={data?.value ?? 0} unit={data?.unit ?? "__"} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
}
