"use client";

import AbFlowRateBg from "@/assets/ams/ams-ab-flow-rate-bg.png";
import AeFlowRateBg from "@/assets/ams/ams-ae-flow-rate-bg.png";
import AMSTittleBg from "@/assets/ams/ams-card-bg.png";
import MeFlowRateBg from "@/assets/ams/ams-me-flow-rate-bg.png";
import SpmPowerBg from "@/assets/ams/ams-spm-power-bg.png";
import SpmTorqueBg from "@/assets/ams/ams-spm-torque-bg.png";
import TimeCardBg from "@/assets/ams/ams-time-card-bg.png";
import FlowmeterDataKgHrBg from "@/assets/ams/flowmeter-data-kghr-bg.png";
import GeneratorsNumberBg from "@/assets/ams/generators-number-bg.png";
import LoadPersentageBg from "@/assets/ams/load-persentage-title-bg.png";
import ProgressBar from "@/components/ams/ams-dark-them/pms/progress-bar";
import SwitchOnOff from "@/components/ams/ams-dark-them/pms/switch-on-off";
import AbFlowRateTitleCard from "@/components/dashboard/ab-flow-rate-title-card";
import AeFlowRateTitleCard from "@/components/dashboard/ae-flow-rate-title-card";
import CountersKgTitleCard from "@/components/dashboard/counters-kg-title-card";
import FlowmeterDataTitleCard from "@/components/dashboard/flowmeter-data-kghr-title-card";
import GeneratorsNumberTitleCard from "@/components/dashboard/generators-number-title-card";
import MeFlowRateTitleCard from "@/components/dashboard/me-flow-rate-title-card";
import LoadPersentageTitleCard from "@/components/dashboard/me-load-persentage-title-card";
import SpmPowerTitleCard from "@/components/dashboard/spm-power-title-card";
import SpmRpmTitleCard from "@/components/dashboard/spm-rpm-title-card";
import SpmTorqueTitleCard from "@/components/dashboard/spm-torque-title-card";
import TimeCard from "@/components/dashboard/time-card";
import TitleCard from "@/components/dashboard/title-card";

export default function UiElementssPage() {
  return (
    <div className="relative flex-1">
      <div className="m-11">
        <h1>PMS Components</h1>
        <h2>Progresive Bar</h2>
        <div className="flax gap-3">
          <ProgressBar
            value={110}
            min={0}
            max={110}
            className="h-[20px] w-[150px]"
          />
          <ProgressBar
            value={100}
            min={0}
            max={100}
            className="h-[50px] w-[250px]"
          />
          <ProgressBar
            value={100}
            min={0}
            max={110}
            className="h-[60px] w-[150px]"
          />
          <ProgressBar
            value={9.9}
            min={5}
            max={10}
            className="h-[20px] w-[350px]"
          />
          <ProgressBar
            value={10}
            min={0}
            max={110}
            className="h-[20px] w-[150px]"
          />
          <ProgressBar
            value={10}
            min={0}
            max={110}
            className="h-[20px] w-[150px]"
          />
        </div>
        <h2>Switch</h2>
        <div className="flex items-center gap-3">
          <SwitchOnOff
            className="h-[80px] w-[80px]"
            switchState={true}
            dimensions={"horizontal"}
          />
          <SwitchOnOff
            className="h-[80px] w-[80px]"
            switchState={false}
            dimensions={"horizontal"}
          />
          <SwitchOnOff
            className="h-[80px] w-[80px]"
            switchState={true}
            dimensions={"vertical"}
          />
          <SwitchOnOff
            className="h-[80px] w-[80px]"
            switchState={false}
            dimensions={"vertical"}
          />
          <SwitchOnOff
            className="h-[40px] w-[40px]"
            switchState={true}
            dimensions={"vertical"}
          />
          <SwitchOnOff
            className="h-[40px] w-[40px]"
            switchState={false}
            dimensions={"vertical"}
          />
        </div>
      </div>

      <h1 className="justify-center text-white">Title Cards</h1>
      <div className="flex flex-wrap gap-0">
        <TitleCard title="AMS" imageUrl={AMSTittleBg} />
        <TimeCard imageUrl={TimeCardBg} />
        <SpmRpmTitleCard title="SPM RPM" />
        <SpmPowerTitleCard title="SPM POWER" imageUrl={SpmPowerBg} />
        <SpmTorqueTitleCard title="SPM TORQUE" imageUrl={SpmTorqueBg} />
        <MeFlowRateTitleCard title="ME FLOW RATE" imageUrl={MeFlowRateBg} />
        <AeFlowRateTitleCard title="AE FLOW RATE" imageUrl={AeFlowRateBg} />
        <AbFlowRateTitleCard title="AB FLOW RATE" imageUrl={AbFlowRateBg} />
        {[1, 2, 3, 4].map(number => (
          <GeneratorsNumberTitleCard
            key={number}
            title={number.toString()}
            imageUrl={GeneratorsNumberBg}
          />
        ))}
        {["ME LOAD %", "DG LOAD %"].map((title, index) => (
          <LoadPersentageTitleCard
            key={index}
            title={title}
            imageUrl={LoadPersentageBg}
          />
        ))}
        <div className="flex-1 flex-wrap gap-0">
          {["ME : 1623", "AE : 613", "AB : 123456"].map((title, index) => (
            <FlowmeterDataTitleCard
              key={index}
              title={title}
              imageUrl={FlowmeterDataKgHrBg}
            />
          ))}
        </div>
        <div className="flex-1 flex-wrap gap-0">
          {["ME : 12345678901234567890", "AE : 10000000000", "AB : 1"].map(
            (title, index) => (
              <CountersKgTitleCard
                key={index}
                title={title}
                imageUrl={FlowmeterDataKgHrBg}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
