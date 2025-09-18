"use client";

import { useState } from "react";
import ProgressBar from "@/components/ams/ams-dark-them/pms/progress-bar";
import SwitchOnOff from "@/components/ams/ams-dark-them/pms/switch-on-off";
import { CanvasGaugeChart } from "@/components/chart/canvas-gauge";
import {
  CanvasRadialGaugeChart,
  CanvasRadialGaugeType
} from "@/components/chart/canvas-radial-gauge-chart";
import { LineChartDgSmall } from "@/components/chart/line-chart";
import { AlarmMonitoringTable } from "@/components/dashboard/alarm-monitoring-system/alarm-monitoring-table";
import { AlertStatusPushButtonComponent } from "@/components/dashboard/alert-status-push-button";
import { AlertsListTable } from "@/components/dashboard/alerts-list/alerts-list-table";
import { CompassComponent } from "@/components/dashboard/compass";
import { FlipClockComponent } from "@/components/dashboard/flip-clock";
import { LineChartCardBig } from "@/components/dashboard/overview-black/line-chart-card-big";
import { StatusPushButtonComponent } from "@/components/dashboard/status-push-button";
import { ValueBoxComponent } from "@/components/dashboard/value-box";
import { Button } from "@/components/ui/button";

export default function UiElementsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      {/* <ProgressiveBardAndSwitch /> */}
      {/* <LineChartCardBig /> */}
      <Gauges />
      {/* <AlertsListTable /> */}
      {/* <AlarmMonitoringTable /> */}
      {/* <CompassComponent /> */}
      {/* <FlipClockComponent /> */}
      {/* <AlertStatusPushButtonList /> */}
      {/* <StatusPushButtonList /> */}
      {/* <ValueBoxes /> */}
      {/* <LineCharts /> */}
    </div>
  );
}

function ProgressiveBardAndSwitch() {
  return (
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
  );
}

function AlertStatusPushButtonList() {
  return (
    <div className="flex gap-4 p-6">
      <AlertStatusPushButtonComponent alertsCount={10} status="critical" />
      <AlertStatusPushButtonComponent alertsCount={19} status="important" />
      <AlertStatusPushButtonComponent alertsCount={50} status="normal" />
    </div>
  );
}

function StatusPushButtonList() {
  return (
    <div className="flex gap-4 p-6">
      <StatusPushButtonComponent active={true} />
      <StatusPushButtonComponent />
    </div>
  );
}

function ValueBoxes() {
  return (
    <div className="flex gap-4 p-6">
      <ValueBoxComponent value={8} unit="kW" />
      <ValueBoxComponent value={88} unit="kW" />
      <ValueBoxComponent value={888} unit="Unit" />
      <ValueBoxComponent value={8888} unit="Unit" />
      <ValueBoxComponent value={88888} unit="Unit" />
      <ValueBoxComponent value={0.8} unit="Unit" />
      <ValueBoxComponent value={0.88} unit="Unit" />
      <ValueBoxComponent value={0.888} unit="Unit" />
      <ValueBoxComponent value={0.8888} unit="Unit" />
    </div>
  );
}

function LineCharts() {
  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <LineChartDgSmall />
      <LineChartDgSmall />
      <LineChartDgSmall />
    </div>
  );
}

function Gauges({
  normal = true,
  radial = true
}: {
  normal?: boolean;
  radial?: boolean;
}) {
  const [x, setX] = useState(220);
  const dummyData = [
    { value: 1, type: "radial" },
    { value: 1, type: "normal", unit: "°C" },
    { value: 50, type: "radial" },
    { value: 50, type: "normal", unit: "RPM" },
    { value: 0, min: -100, max: 100, type: "radial" },
    { value: 0, min: -100, max: 100, type: "normal", unit: "%" },
    { value: 5000, min: 0, max: 10000, type: "radial" },
    { value: 5000, min: 0, max: 10000, type: "normal", unit: "kPa" },
    { value: 50, min: 10000, max: 20000, type: "radial" },
    { value: 50, min: 10000, max: 20000, type: "normal", unit: "Hz" },
    { value: 30000, min: 10000, max: 20000, type: "radial" },
    { value: 30000, min: 10000, max: 20000, type: "normal", unit: "W" },
    { value: 123456, min: 100000, max: 200000, type: "radial" },
    { value: 123456, min: 100000, max: 200000, type: "normal", unit: "mAh" },
    { value: 123456, min: 0, max: 200000, type: "normal", unit: "mAh" },
    { value: -123456, min: -1200000, max: 0, type: "normal", unit: "mAh" }
  ];

  return (
    <div className="relative flex-1 p-2">
      <div className="sticky top-0 mb-10">
        <Button
          onClick={() =>
            setX(y => {
              if (y === 790) {
                return 220;
              }
              return 790;
            })
          }
        >
          SwapSize
        </Button>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {dummyData.map((item, key) => {
          return item.type === "radial" && radial ? (
            <CanvasRadialGaugeChart key={key} value={item.value} size={x} />
          ) : item.type === "normal" && normal ? (
            <CanvasGaugeChart
              min={item.min}
              max={item.max}
              value={item.value}
              unit={item.unit}
              size={x}
              key={key}
              type="normal_black"
            />
          ) : null;
        })}
      </div>
    </div>
  );
}
