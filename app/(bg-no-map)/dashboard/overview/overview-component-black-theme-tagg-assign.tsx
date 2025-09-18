import { twMerge } from "tailwind-merge";
import { AlertIndicationBar } from "@/components/dashboard/overview-black/alert-indication-bar";
import { AMSNavigationCard } from "@/components/dashboard/overview-black/ams-navigation-card";
import { CompassComponent } from "@/components/dashboard/overview-black/compass";
import { GaugeCardWithTagAssign } from "@/components/dashboard/overview-black/gauge-card-with-tag-assign";
import { LineChartCardSmallTagAssign } from "@/components/dashboard/overview-black/line-chart-card-small";
import {
  GyroIcon,
  LattitudeIcon,
  LongitudeIcon,
  SpeedIcon,
  WindDirectionIcon,
  WindSpeedIcon
} from "@/components/dashboard/overview-black/navigation-parameters-card";
import { OverviewCard } from "@/components/dashboard/overview-black/overview-card";
import { RadialGaugeCard } from "@/components/dashboard/overview-black/radial-gauge-card";
import { TimeCard } from "@/components/dashboard/overview-black/time-card";
import { TagAssignToggle } from "@/components/layout/header/tag-assign-toggle";
import { useTagAssignStore } from "@/store/tag-assign-form-store";
import { DynamicTextComponent } from "./components/dynamic-text-component";
import {
  CounterDataSection,
  TempAndDencityDataSection
} from "./components/flowmeter-data-section";
import { GeneratorsCardItem } from "./components/generator-card-item";
import { NavigationParameterItem } from "./components/navigation-parameter-item";
import { OVERVIEW as t } from "./overview-taglist";
import { useEffect } from "react";

function OverviewComponentBlackThemeTaggAssign() {
  const { showTagAssign, setShowTagAssign } = useTagAssignStore();

  const switchTagAssign = () => {
    setShowTagAssign(!showTagAssign);
  };

    useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "i") {
        e.preventDefault(); // stop browser default action (like opening dev tools in some cases)
        switchTagAssign();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTagAssign]);

  return (
    <div className="flex w-full flex-1 flex-col gap-[12px] p-[1px] tracking-widest">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_230px_1fr] lg:grid-cols-[1fr_230px_1fr] xl:grid-cols-[1fr_280px_1fr] 2xl:grid-cols-[1fr_320px_1fr] 3xl:grid-cols-[1fr_420px_1fr]">
        <div className="xs:h-[320px] xs:w-[90vw] h-[280px] w-full space-y-3 rounded-[15px] border border-white/50 p-2 sm:h-[360px] sm:w-[85vw] md:h-[400px] md:w-[80vw] lg:h-auto lg:w-auto lg:p-[4px] xl:h-auto xl:w-auto xl:p-2 2xl:h-auto 2xl:w-auto 2xl:p-2 3xl:h-auto 3xl:w-auto 3xl:p-2">
          <div className="flex w-full gap-3">
            {/* <AMSNavigationCard label={t.Tag1} /> */}
            {/* <TagAssignToggle /> */}
            <div className="w-[15%]"></div>
            <TimeCard size="lg" variant="dashboard" />
            <div className="w-[15%]"></div>
          </div>
          <div className="relative isolate flex justify-around p-0">
            <GaugeCardWithTagAssign label={t.Tag2} />
            <GaugeCardWithTagAssign label={t.Tag3} />
            <GaugeCardWithTagAssign label={t.Tag4} />
          </div>
        </div>
        <div className="flex w-full flex-col">
          <CompassComponent label={t.Tag5} />
          {/* <TimeCard size="lg" variant="dashboard" /> */}
        </div>
        <div className="xs:h-[320px] xs:w-[90vw] h-[280px] w-full space-y-3 rounded-[15px] border border-white/50 p-2 sm:h-[360px] sm:w-[85vw] md:h-[400px] md:w-[80vw] lg:h-[275px] lg:w-auto lg:p-[4px] xl:h-auto xl:w-auto xl:p-2 2xl:h-[380px] 2xl:w-auto 2xl:p-2 3xl:h-[420px] 3xl:w-auto 3xl:p-2">
          <AlertIndicationBar />
          <div className="relative isolate flex justify-around p-0">
            <GaugeCardWithTagAssign label={t.Tag6} />
            <GaugeCardWithTagAssign label={t.Tag7} />
            <GaugeCardWithTagAssign label={t.Tag8} />
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 grid-rows-[repeat(auto-fit,min-content)] gap-3 rounded-[15px] border border-[#1919191F] p-3 shadow-[0px_0px_3.6px_0px_#FFFFFF] sm:grid-cols-2 sm:grid-rows-[min-content_min-content] md:grid-cols-[min-content_min-content_min-content] md:grid-rows-1 lg:grid-cols-[min-content_min-content_min-content_auto] lg:grid-rows-1 xl:grid-rows-2 3xl:grid-rows-2">
        <OverviewCard className="relative flex flex-col gap-3 lg:ml-[-5px] lg:mt-[-3px] lg:h-auto lg:w-[271px] xl:ml-0 xl:mt-0 xl:h-[248px] xl:w-[287px] 2xl:w-[379px] 3xl:ml-0 3xl:mt-0 3xl:h-full 3xl:w-[443px]">
          <h1 className="text-center font-russo uppercase text-shadow-custom-black lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[25px]">
            Generators
          </h1>
          <div className="ml-0 flex w-full flex-1 justify-around lg:ml-[-13px] xl:ml-0 2xl:ml-0 3xl:ml-0">
            <GeneratorsCardItem l1={t.Tag9} l2={t.Tag10} l3={t.Tag11} />
            <GeneratorsCardItem l1={t.Tag12} l2={t.Tag13} l3={t.Tag14} />
            <GeneratorsCardItem l1={t.Tag15} l2={t.Tag16} l3={t.Tag17} />
            <GeneratorsCardItem l1={t.Tag18} l2={t.Tag19} l3={t.Tag20} />
          </div>
        </OverviewCard>
        <RadialGaugeCard label={t.Tag21} />
        <LineChartCardSmallTagAssign title="ME LOAD" label={t.Tag22} />
        <div
          className={twMerge(
            "row-span-2 flex flex-col gap-3 rounded-[15px] bg-[#020202] p-3 shadow-[0px_0px_2px_0px_#FFFFFF]",
            "h-[492px] w-[103%]",
            "mx-0 h-auto w-full", // Mobile-first sizing (default)
            "sm:mx-auto sm:w-[95vw]", // Small tablets (640px+)
            "md:h-[380px] md:w-[90vw]", // Tablets (768px+)
            "lg:ml-[-15px] lg:h-auto lg:w-auto", // Laptops (1024px+)
            "xl:ml-[-12px] xl:h-[507px] xl:w-[103%]", // Desktops (1280px+)
            "2xl:h-[503px] 2xl:w-[104%]", // Large screens (1536px+)
            "3xl:ml-0 3xl:h-full 3xl:w-full" // Extra large (1920px+)
          )}
        >
          <div className="mt-0 h-[100px] flex-1 space-y-2 sm:mt-[4px] md:mt-[5px] lg:mt-[7px] xl:mt-[10px] 2xl:mt-[12px] 3xl:mt-[16px] 3xl:h-full">
            <DynamicTextComponent
              label={t.Tag49}
              defaultTitle="TEMPERATURE AND DENSITY DATA"
              className="ml-1 font-russo text-[10px] sm:text-[12px] md:text-[14px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[25px]"
            />
            <div className="grid grid-cols-[0.75fr_1fr_1fr_1fr] gap-1">
              <div className="col-span-3 col-start-2 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[2px]">
                <div className="xs:text-[11px] col-span-3 grid grid-cols-subgrid place-items-center rounded-[6px] bg-black p-1.5 font-russo text-[10px] leading-[100%] tracking-[0%] sm:text-[12px] md:text-[13px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[25px]">
                  <DynamicTextComponent label={t.Tag50} defaultTitle="ME" />
                  <DynamicTextComponent label={t.Tag51} defaultTitle="AE" />
                  <DynamicTextComponent label={t.Tag52} defaultTitle="AB" />
                </div>
              </div>
              <TempAndDencityDataSection
                heading={{ l: t.Tag53, defaultTitle: "HFO" }}
                l1={t.Tag23}
                l2={t.Tag24}
                l3={t.Tag25}
                l4={t.Tag26}
                l5={t.Tag27}
                l6={t.Tag28}
              />
              <TempAndDencityDataSection
                heading={{ l: t.Tag54, defaultTitle: "MDO" }}
                l1={t.Tag29}
                l2={t.Tag30}
                l3={t.Tag31}
                l4={t.Tag32}
                l5={t.Tag33}
                l6={t.Tag34}
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <DynamicTextComponent
              label={t.Tag55}
              defaultTitle="COUNTER DATA"
              className="xs:text-[11px] ml-1 font-russo text-[10px] tracking-normal transition-all duration-100 sm:text-[12px] md:text-[13px] lg:mt-[39px] lg:text-[12px] xl:mt-[39px] xl:text-[15px] xl:tracking-normal 2xl:mt-[73px] 2xl:text-[18px] 3xl:mt-[9px] 3xl:text-[25px]"
            />
            <div className="grid grid-cols-[0.75fr_1fr_1fr_1fr] gap-1">
              <div className="col-span-3 col-start-2 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[2px]">
                <div className="col-span-3 grid grid-cols-subgrid place-items-center rounded-[6px] bg-black p-1.5 font-russo leading-[100%] tracking-[0%] lg:text-[10px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[25px]">
                  <DynamicTextComponent label={t.Tag56} defaultTitle="ME" />
                  <DynamicTextComponent label={t.Tag57} defaultTitle="AE" />
                  <DynamicTextComponent label={t.Tag58} defaultTitle="AB" />
                </div>
              </div>

              <div className="col-span-4 col-start-1 grid grid-cols-subgrid rounded-[8px] bg-[linear-gradient(180deg,_rgba(203,_203,_203,_0.8)_0%,_rgba(85,_85,_85,_0.8)_48.08%,_rgba(205,_205,_205,_0.8)_100%)] p-[1px]">
                <div className="col-span-4 col-start-1 grid grid-cols-subgrid gap-y-1 rounded-[7px] bg-black lg:p-0 xl:p-0 3xl:p-1">
                  <CounterDataSection
                    heading={{ l: t.Tag59, defaultTitle: "HFO" }}
                    l1={t.Tag35}
                    l2={t.Tag36}
                    l3={t.Tag37}
                  />
                  <CounterDataSection
                    heading={{ l: t.Tag60, defaultTitle: "MDO" }}
                    l1={t.Tag38}
                    l2={t.Tag39}
                    l3={t.Tag40}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <OverviewCard className="flex flex-col justify-between gap-1 p-2.5 lg:mt-[-3px] lg:h-[218px] xl:mt-0 xl:h-[248px] xl:w-[286px] 2xl:h-[248px] 2xl:w-auto 3xl:mt-0 3xl:h-[299px] 3xl:w-[443px]">
          <NavigationParameterItem label={t.Tag41} icon={<LattitudeIcon />} />
          <NavigationParameterItem label={t.Tag42} icon={<LongitudeIcon />} />
          <NavigationParameterItem label={t.Tag43} icon={<GyroIcon />} />
          <NavigationParameterItem label={t.Tag44} icon={<SpeedIcon />} />
          <NavigationParameterItem label={t.Tag45} icon={<WindSpeedIcon />} />
          <NavigationParameterItem
            label={t.Tag46}
            icon={<WindDirectionIcon />}
          />
        </OverviewCard>
        <RadialGaugeCard label={t.Tag47} />
        <LineChartCardSmallTagAssign label={t.Tag48} title="DG LOAD" />
      </div>
    </div>
  );
}

export default OverviewComponentBlackThemeTaggAssign;
