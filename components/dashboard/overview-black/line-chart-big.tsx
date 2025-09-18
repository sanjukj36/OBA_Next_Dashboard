import * as React from "react";
import { Brush, ComposedChart, Line, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { addOpacity, chartDateFormatter } from "@/lib/utils";
import { ChartDataItem } from "@/types/trend";
import { useLineChartBig } from "./line-chart-big-context";

type LineChartBigProps = {
  data?: ChartDataItem[];
  label1: string;
  label2?: string;
  label3?: string;
  label4?: string;
};
export function LineChartBig({
  data,
  label1,
  label2,
  label3,
  label4
}: LineChartBigProps) {
  const chartConfig = React.useMemo(() => {
    const chartConfig = {
      value1: {
        label: label1 ?? "value1",
        color: "#FFFFFF"
      },
      value2: {
        label: label2 ?? "value2",
        color: "#FF6363"
      },
      value3: {
        label: label3 ?? "value3",
        color: "#00D397"
      },
      value4: {
        label: label4 ?? "value4",
        color: "#00BBFF"
      }
    } satisfies ChartConfig;
    return chartConfig;
  }, [label1, label2, label3, label4]);
  const { range, setRange } = useLineChartBig();

  React.useEffect(() => {
    setRange({ left: 0, right: (data?.length ?? 1) - 1 });
  }, []);

  if (!data) return null;

  return (
    <ChartContainer
      config={chartConfig}
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: "1421/562",
        padding: 8
      }}
    >
      <ComposedChart data={data}>
        <defs>
          <marker
            id="Triangle"
            style={{ overflow: "visible" }}
            refX="0"
            refY="0"
            orient="auto-start-reverse"
            markerWidth="1"
            markerHeight="1"
            viewBox="0 0 1 1"
            preserveAspectRatio="xMidYMid"
          >
            <path
              transform="scale(0.3)"
              style={{
                fill: "context-stroke",
                fillRule: "evenodd",
                stroke: "context-stroke",
                strokeWidth: "1pt"
              }}
              d="M 5.77,0 -2.88,5 V -5 Z"
            />
          </marker>
          <marker
            id="Dot"
            style={{ overflow: "visible" }}
            refX="0"
            refY="0"
            orient="auto"
            markerWidth="1"
            markerHeight="1"
            viewBox="0 0 1 1"
            preserveAspectRatio="xMidYMid"
          >
            <path
              transform="scale(0.45)"
              style={{
                fill: "context-stroke",
                fillRule: "evenodd",
                stroke: "none"
              }}
              d="M 5,0 C 5,2.76 2.76,5 0,5 -2.76,5 -5,2.76 -5,0 c 0,-2.76 2.3,-5 5,-5 2.76,0 5,2.24 5,5 z"
            />
          </marker>
        </defs>
        <Line
          dataKey="value1"
          type="monotone"
          stroke="var(--color-value1)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="value2"
          type="monotone"
          stroke="var(--color-value2)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="value3"
          type="monotone"
          stroke="var(--color-value3)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="value4"
          type="monotone"
          stroke="var(--color-value4)"
          strokeWidth={2}
          dot={false}
        />
        <ChartTooltip
          cursor={false}
          filterNull={false}
          content={
            <ChartTooltipContent
              labelFormatter={chartDateFormatter}
              indicator="dot"
              className="border border-green-400 text-base"
              labelClassName="text-foreground"
            />
          }
          defaultIndex={1}
        />
        <YAxis
          tickLine={false}
          fontSize={14}
          stroke="#FFFFFF"
          strokeWidth={2}
          markerEnd="url(#Dot)"
          markerStart="url(#Triangle)"
          className="!text-white"
          tick={props => {
            const value = String(props.payload.value);
            const translateX =
              props.payload.index === 0 ? props.x + 10 : props.x;
            return (
              <g transform={`translate(${translateX},${props.y + 5})`}>
                <text
                  x={-2}
                  y={0}
                  textAnchor="end"
                  fontSize={20}
                  fontWeight="400"
                  className="!fill-white font-din !text-white"
                >
                  {value}
                </text>
              </g>
            );
          }}
        />
        <XAxis
          dataKey="time"
          tickLine={false}
          stroke="#FFFFFF"
          strokeWidth={2}
          markerStart="url(#Dot)"
          markerEnd="url(#Triangle)"
          height={90}
          tick={<CustomXAxisTick />}
        />
        <Brush
          dataKey="time"
          height={50}
          startIndex={range.left}
          endIndex={range.right}
          onChange={e =>
            setRange({
              left: e.startIndex ?? 0,
              right: e.endIndex ?? data.length - 1
            })
          }
          stroke="#FFFFFF"
          fill={addOpacity("#000000", 5)}
          tickFormatter={value => {
            const date = new Date(value);
            const month = date.toLocaleString("default", { month: "long" }); // "June"
            const day = String(date.getDate()).padStart(2, "0"); // "05"
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const time = `${hours}:${minutes}`;
            return `${month} - ${day}  ${time}`;
          }}
        >
          <ComposedChart>
            {Object.entries(chartConfig).map(([key, config]) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={config.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                opacity={0.5}
              />
            ))}
          </ComposedChart>
        </Brush>
      </ComposedChart>
    </ChartContainer>
  );
}

function CustomXAxisTick(props) {
  const date = new Date(props.payload.value);

  const month = date.toLocaleString("en-US", { timeZone: "UTC", month: "long" })
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  const translateX = props.payload.index === 0 ? props.x + 15 : props.x;
  return (
    <g transform={`translate(${translateX},${props.y + 5})`}>
      <text
        x={0}
        y={15}
        textAnchor="middle"
        fontSize={25}
        fontWeight="bold"
        className="!fill-white font-din !text-white"
      >
        {month}
      </text>
      <text
        x={0}
        y={40}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={20}
        className="!fill-white font-din !text-white"
      >
        {day}
      </text>
      <text
        x={0}
        y={60}
        textAnchor="middle"
        fill="#AAAAAA"
        fontSize={20}
        className="!fill-white font-din !text-white"
      >
        {time}
      </text>
    </g>
  );
}
