import { twMerge } from "tailwind-merge";
import { useLatestDataByTag } from "@/queries/use-latest-data-by-tag";
import { useShowTrend } from "../trends/trend-context";
import { ErrorComponent } from "./error-display";
import { RingBorder } from "./ring-border";

export const NoonCounterFlowmeterDataCard = ({
  className
}: {
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-3 rounded-[15px] bg-[#020202] p-3 shadow-[0px_0px_2px_0px_#FFFFFF]",
        "h-[492px] w-[103%]",
        // Mobile-first sizing (default)
        "mx-0 h-auto w-full",
        // Small tablets (640px+)
        "sm:mx-auto sm:w-[95vw]",
        // Tablets (768px+)
        "md:h-[380px] md:w-[90vw]",
        // Laptops (1024px+)
        "lg:ml-[-18px] lg:h-[437px] lg:w-[293px]",
        // Desktops (1280px+)
        "xl:ml-[-16px] xl:h-[455px] xl:w-[105%]",
        // Large screens (1536px+)
        "2xl:h-[480px] 2xl:w-[102%]",
        // Extra large (1920px+)
        "3xl:ml-0 3xl:h-full 3xl:w-full",
        className
      )}
    >
      <FlowmeterDataCard />
      <CounterDataCard />
    </div>
  );
};

function ValueCard({ tag, className }: { tag: string; className?: string }) {
  const { setTrendTagName, setShowTrendModal } = useShowTrend();
  const { data, error, refetch } = useLatestDataByTag(tag);
  const valueSize = data?.value.toString().length ?? 2;
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
    setTrendTagName({ tag1: tag, tag1Label: tag });
    setShowTrendModal(true);
  };

  return (
    <RingBorder
      variant="value-card"
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
      onPointerDown={!error ? handleClick : undefined}
    >
      <p
        className={twMerge(
          "font-din font-bold leading-[100%] tracking-[0%]",
          textSize
        )}
      >
        {data?.value ?? "__"}
      </p>
      <p className="text-secondary lg:text-[6px] 3xl:text-sm">
        {" "}
        {data?.unit ?? "__"}{" "}
      </p>
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </RingBorder>
  );
}

function FlowmeterDataCard() {
  return (
    <div className="left-0 mt-0 h-[100px] flex-1 space-y-2 sm:left-[-6px] sm:mt-[4px] md:left-[-8px] md:mt-[5px] lg:left-[-12px] lg:mt-[7px] xl:left-[-20px] xl:mt-[10px] 2xl:left-[-16px] 2xl:mt-[12px] 3xl:left-0 3xl:mt-[16px] 3xl:h-full">
      <h3 className="ml-1 font-russo text-[10px] sm:text-[12px] md:text-[14px] lg:text-[12px] xl:text-[18px] 2xl:text-[22px] 3xl:text-[25px]">
        TEMPERATURE AND DENSITY DATA
      </h3>
      <div className="grid grid-cols-[0.75fr_1fr_1fr_1fr] gap-1">
        <div className="col-span-3 col-start-2 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[2px]">
          <div className="xs:text-[11px] col-span-3 grid grid-cols-subgrid place-items-center rounded-[6px] bg-black p-1.5 font-russo text-[10px] leading-[100%] tracking-[0%] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px] 3xl:text-[25px]">
            <div>ME</div>
            <div>AE</div>
            <div>AB</div>
          </div>
        </div>

        <div className="col-span-4 col-start-1 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[1px]">
          {/* HFO */}
          <div className="col-span-4 col-start-1 grid grid-cols-subgrid gap-y-1 rounded-[7px] bg-black p-1 sm:gap-y-1.5 sm:p-1.5 md:p-2 lg:gap-y-1 lg:p-1.5 xl:gap-y-1.5 xl:p-2 2xl:p-2.5 3xl:p-3">
            <div className="xs:text-[11px] grid place-items-center font-russo text-[10px] tracking-normal sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] xl:tracking-normal 2xl:text-[20px] 3xl:text-[25px]">
              HFO
            </div>
            <div className="col-span-3 grid grid-cols-subgrid">
              {/* ME */}
              <div className="grid gap-1">
                <ValueCard tag="ME_HFO_FTS_act_dgC@AVG" /> {/* temp */}
                <ValueCard tag="ME_HFO_FDS_act_kgPm3@AVG" /> {/* density */}
              </div>
              {/* AE */}
              <div className="grid gap-1">
                <ValueCard tag="AE_HFO_FTS_act_dgC@AVG" />
                <ValueCard tag="AE_HFO_FDS_act_kgPm3@AVG" />
              </div>
              {/* AB */}
              <div className="grid gap-1">
                <ValueCard tag="AB_HFO_FTS_act_dgC@AVG" />
                <ValueCard tag="AB_HFO_FDS_act_kgPm3@AVG" />
              </div>
            </div>
          </div>
        </div>

        {/* MDO */}
        <div className="col-span-4 col-start-1 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[1px]">
          <div className="col-span-4 col-start-1 grid grid-cols-subgrid gap-y-1 rounded-[7px] bg-black lg:p-0 xl:p-0 3xl:p-1">
            <div className="xl:tracking-none grid place-items-center font-russo lg:p-0 lg:text-[12px] xl:p-0 xl:text-[14px] 3xl:p-4 3xl:text-[25px]">
              MDO
            </div>
            <div className="col-span-3 grid grid-cols-subgrid">
              {/* ME */}
              <div className="grid gap-1">
                <ValueCard tag="ME_MDO_FTS_act_dgC@AVG" /> {/* temp */}
                <ValueCard tag="ME_MDO_FDS_act_kgPm3@AVG" /> {/* density */}
              </div>
              {/* AE */}
              <div className="grid gap-1">
                <ValueCard tag="AE_MDO_FTS_act_dgC@AVG" />
                <ValueCard tag="AE_MDO_FDS_act_kgPm3@AVG" />
              </div>
              {/* AB */}
              <div className="grid gap-1">
                <ValueCard tag="AB_MDO_FTS_act_dgC@AVG" />
                <ValueCard tag="AB_MDO_FDS_act_kgPm3@AVG" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CounterDataCard() {
  return (
    <div className="flex-1 space-y-2">
      <h3 className="xs:text-[11px] ml-1 font-russo text-[10px] tracking-normal transition-all duration-100 sm:text-[12px] md:text-[13px] lg:mt-[39px] lg:text-[14px] xl:mt-[39px] xl:text-[16px] xl:tracking-normal 2xl:mt-[24px] 2xl:text-[20px] 3xl:mt-[9px] 3xl:text-[25px]">
        COUNTER DATA
      </h3>
      <div className="grid grid-cols-[0.75fr_1fr_1fr_1fr] gap-1">
        <div className="col-span-3 col-start-2 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[2px]">
          <div className="col-span-3 grid grid-cols-subgrid place-items-center rounded-[6px] bg-black p-1.5 font-russo leading-[100%] tracking-[0%] lg:text-[10px] xl:text-[15px] 3xl:text-[25px]">
            <div>ME</div>
            <div>AE</div>
            <div>AB</div>
          </div>
        </div>

        {/* HFO */}
        <div className="col-span-4 col-start-1 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[1px]">
          <div className="col-span-4 col-start-1 grid grid-cols-subgrid gap-y-1 rounded-[7px] bg-black lg:p-0 xl:p-0 3xl:p-1">
            <div className="col-span-4 grid grid-cols-subgrid">
              <div className="xl:tracking-none grid place-items-center font-russo lg:text-[12px] xl:text-[14px] 3xl:text-[25px]">
                HFO
              </div>
              <div className="col-span-3 grid grid-cols-subgrid">
                {/* ME */}
                <ValueCard tag="ME_HFO_FMS_cnt_tot_kg@AVG" />
                {/* AE */}
                <ValueCard tag="AE_HFO_FMS_cnt_tot_kg@AVG" />
                {/* AB */}
                <ValueCard tag="FMS4_cnt_tot_kg@LAST" />
              </div>
            </div>

            <div className="col-span-4 grid grid-cols-subgrid">
              <div className="xl:tracking-none grid place-items-center font-russo lg:text-[12px] xl:text-[14px] 3xl:text-[25px]">
                MDO
              </div>
              <div className="col-span-3 grid grid-cols-subgrid">
                {/* ME */}
                <ValueCard tag="ME_MDO_FMS_cnt_tot_kg@AVG" />
                {/* AE */}
                <ValueCard tag="AE_MDO_FMS_cnt_tot_kg@AVG" />
                {/* AB */}
                <ValueCard tag="FMS5_cnt_tot_kg@LAST" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
