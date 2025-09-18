import { useAnalyticStore } from "@/store/analytics-store";
import { AnalyticsForm } from "./analytics-form";
import { AnalyticsLineChart } from "./anlytics-line-chart";

const AnalyticsComponent = () => {
  return (
    <div className="relative isolate m-[6px] grid gap-4 flex-1 grid-cols-4 items-stretch rounded-[12px] p-[10px] shadow-[0px_0px_3.6px_0px_#FFFFFF80]">
      <AnalyticsForm />
      <AnalyticsChart />
    </div>
  );
};

export default AnalyticsComponent;

function AnalyticsChart() {
  const { chartData } = useAnalyticStore()
  return (
    <div className="col-start-2 -col-end-1 relative isolate flex flex-col gap-8 rounded-[15px] p-4 font-alexandria font-[400] leading-[100%] tracking-[0%]">
      <div className="gradient-border-2 absolute inset-0 -z-10 rounded-[15px] opacity-50" />
      <AnalyticsLineChart
        data={chartData}
      />
    </div>
  )
}
