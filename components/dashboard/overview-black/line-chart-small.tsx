import * as React from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { chartDateFormatter } from "@/lib/utils";
import { ChartDataItem } from "@/types/trend";

/*
const chartData = [
  { time: "10:00", value1: 120, value2: 120, value3: 120, value4: 120 },
  { time: "10:10", value1: 140, value2: 210, value3: 160, value4: 175 },
  { time: "10:20", value1: 130, value2: 190, value3: 170, value4: 165 },
  { time: "10:30", value1: 110, value2: 180, value3: 140, value4: 150 },
  { time: "10:40", value1: 150, value2: 220, value3: 180, value4: 200 },
  { time: "10:50", value1: 135, value2: 205, value3: 175, value4: 190 },
  { time: "11:00", value1: 125, value2: 195, value3: 160, value4: 170 },
  { time: "11:10", value1: 145, value2: 215, value3: 185, value4: 210 },
  { time: "11:20", value1: 138, value2: 208, value3: 178, value4: 188 },
  { time: "11:30", value1: 128, value2: 198, value3: 168, value4: 175 }
];
*/

type LineChartSmallProps = {
  data?: ChartDataItem[];
  label1: string;
  label2?: string;
  label3?: string;
  label4?: string;
};

export function LineChartSmall({
  data,
  label1,
  label2,
  label3,
  label4
}: LineChartSmallProps) {
  const chartConfig = React.useMemo(() => {
    const chartConfig = {
      value1: {
        label: label1 ?? "Label1",
        color: "#FFFFFF"
      },
      value2: {
        label: label2 ?? "Label2",
        color: "#FF50AA"
      },
      value3: {
        label: label3 ?? "Label3",
        color: "#00D397"
      },
      value4: {
        label: label4 ?? "Label4",
        color: "#00BBFF"
      }
    } satisfies ChartConfig;
    return chartConfig;
  }, [label1, label2, label3, label4]);

  if (!data) return null;

  return (
    <ChartContainer
      config={chartConfig}
      style={{
        width: "100%",
        height: "auto",
        padding: 8
      }}
      className="aspect-[553/215]"
    >
      <LineChart data={data}>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Line
          dataKey="value1"
          type="monotone"
          stroke="var(--color-value1)"
          strokeWidth={1}
          dot={false}
        />
        <Line
          dataKey="value2"
          type="monotone"
          stroke="var(--color-value2)"
          strokeWidth={1}
          dot={false}
        />
        <Line
          dataKey="value3"
          type="monotone"
          stroke="var(--color-value3)"
          strokeWidth={1}
          dot={false}
        />
        <Line
          dataKey="value4"
          type="monotone"
          stroke="var(--color-value4)"
          strokeWidth={1}
          dot={false}
        />
        <ChartTooltip
          cursor={false}
          filterNull={false}
          content={
            <ChartTooltipContent
              filterNull={false}
              labelFormatter={chartDateFormatter}
              indicator="line"
              className="text-xxs"
              labelClassName="!text-foreground"
            />
          }
          defaultIndex={1}
        />
        <XAxis dataKey="time" hide />
      </LineChart>
    </ChartContainer>
  );
}
