import * as React from "react";
import { ComposedChart, Line, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { chartDateFormatter } from "@/lib/utils";
import { ChartDataItem } from "@/types/trend";

type AnalyticsChartProps = {
  data?: ChartDataItem[];
};
const COLORS = [
  "#FFFFFF", // white
  "#FF6363", // red
  "#00D397", // green
  "#00BBFF", // blue
  "#FFD700", // gold
  "#FF00FF", // magenta
  "#00FFFF", // cyan
  "#FFA500", // orange
  "#A9A9A9", // gray
  "#8A2BE2"  // purple
];

export function AnalyticsLineChart({
  data,
}: AnalyticsChartProps) {

  const chartKeys = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // extract all keys except `time`
    return Object.keys(data[0]).filter(key => key !== "time");
  }, [data]);

  const chartConfig = React.useMemo(() => {
    const config = {} as Record<string, { label: string; color: string }>;

    chartKeys.forEach((key, index) => {
      config[key] = {
        label: key,
        color: COLORS[index % COLORS.length]
      };
    });

    return config;
  }, [chartKeys]);

  if (!data || chartKeys.length === 0) return null;

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
        {chartKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={chartConfig[key].color}
            strokeWidth={2}
            dot={false}
          />
        ))}
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
