import { useAuth } from "@/provider/auth-provider";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { DynamicTextComponent } from "./dynamic-text-component";
import { ValueCard } from "./value-card";

type CounterDataSectionProps = {
  heading: { l: string; defaultTitle: string };
  l1: string;
  l2: string;
  l3: string;
}
export function CounterDataSection({ heading, l1, l2, l3 }: CounterDataSectionProps) {
  const { data: latestData, isError } = useLatestDataByLabel(heading.l);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  const { user } = useAuth()

  // if (
  //   !user?.is_superuser &&
  //     (isError || !description)
  // ) {
  //   return null;
  // }

  return (
    <div className="col-span-4 grid grid-cols-subgrid">
      <DynamicTextComponent label={heading.l} defaultTitle={heading.defaultTitle} className="xl:tracking-none grid place-items-center p-0 font-russo lg:p-[5px] lg:text-[12px] xl:p-0 xl:text-[15px] 2xl:p-0 2xl:text-[18px] 3xl:p-0 3xl:text-[25px]" />
      <div className="col-span-3 grid grid-cols-subgrid">
        <ValueCard label={l1} />
        <ValueCard label={l2} />
        <ValueCard label={l3} />
      </div>
    </div>
  )
}

type TempAndDencityDataSectionProps = {
  heading: { l: string; defaultTitle: string };
  l1: string;
  l2: string;
  l3: string;
  l4: string;
  l5: string;
  l6: string;
}
export function TempAndDencityDataSection({ heading, l1, l2, l3, l4, l5, l6 }: TempAndDencityDataSectionProps) {
  const { data: latestData, isError } = useLatestDataByLabel(heading.l);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  const { user } = useAuth()

  // if (
  //   !user?.is_superuser &&
  //   (isError || !description)
  // ) {
  //   return null;
  // }

  return (
    <div className="col-span-4 col-start-1 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[1px]">
      <div className="col-span-4 col-start-1 grid grid-cols-subgrid gap-y-1 rounded-[7px] bg-black p-1 sm:gap-y-1.5 sm:p-1.5 md:p-2 lg:gap-y-1 lg:p-1.5 xl:gap-y-1.5 xl:p-2 2xl:p-2.5 3xl:p-3">
        <DynamicTextComponent label={heading.l} defaultTitle={heading.defaultTitle} className="xs:text-[11px] grid place-items-center font-russo text-[10px] tracking-normal sm:text-[12px] md:text-[13px] lg:px-[5px] lg:text-[12px] xl:text-[15px] xl:tracking-normal 2xl:text-[18px] 3xl:text-[25px]" />
        <div className="col-span-3 grid grid-cols-subgrid">
          <div className="grid gap-1">
            <ValueCard label={l1} />
            <ValueCard label={l2} />
          </div>
          <div className="grid gap-1">
            <ValueCard label={l3} />
            <ValueCard label={l4} />
          </div>
          <div className="grid gap-1">
            <ValueCard label={l5} />
            <ValueCard label={l6} />
          </div>
        </div>
      </div>
    </div>
  )
}
