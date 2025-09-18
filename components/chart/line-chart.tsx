import * as React from "react";
import { SVGProps } from "react";
import Image from "next/image";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import chartBorderImage from "@/assets/chart-border-553x274duplic.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const chartData = [
  { time: "10:00", dg1: 120, dg2: 120, dg3: 120, dg4: 120 },
  { time: "10:10", dg1: 140, dg2: 210, dg3: 160, dg4: 175 },
  { time: "10:20", dg1: 130, dg2: 190, dg3: 170, dg4: 165 },
  { time: "10:30", dg1: 110, dg2: 180, dg3: 140, dg4: 150 },
  { time: "10:40", dg1: 150, dg2: 220, dg3: 180, dg4: 200 },
  { time: "10:50", dg1: 135, dg2: 205, dg3: 175, dg4: 190 },
  { time: "11:00", dg1: 125, dg2: 195, dg3: 160, dg4: 170 },
  { time: "11:10", dg1: 145, dg2: 215, dg3: 185, dg4: 210 },
  { time: "11:20", dg1: 138, dg2: 208, dg3: 178, dg4: 188 },
  { time: "11:30", dg1: 128, dg2: 198, dg3: 168, dg4: 175 }
];

const chartConfig = {
  dg1: {
    label: "DG1",
    color: "#FFFFFF"
  },
  dg2: {
    label: "DG2",
    color: "#FF50AA"
  },
  dg3: {
    label: "DG3",
    color: "#00D397"
  },
  dg4: {
    label: "DG4",
    color: "#00BBFF"
  }
} satisfies ChartConfig;

export function LineChartDgSmall() {
  return (
    <Card className="relative isolate w-[553px] rounded-[40px] border-none bg-black">
      <Image
        src={chartBorderImage}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none"
        alt="chart-border"
      />
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
        <h3 className="font-russo text-xl font-normal uppercase text-foreground">
          ME Load
        </h3>
        <button className="rounded border border-primary p-1">
          <IconShrink className="h-5 w-5" />
        </button>
      </CardHeader>
      <LineChartBgCartesianGrid />
      <CardContent className="relative p-[10px] pt-0">
        <ChartContainer
          config={chartConfig}
          style={{
            width: "100%",
            height: "auto",
            padding: 8
          }}
          className="aspect-[553/215]"
        >
          <LineChart data={chartData}>
            <defs>
              <filter
                id="glow-dg1"
                x="0.835938"
                y="0.5"
                width="200%"
                height="200%"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="20" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_857_7592"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_857_7592"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="0.85"
                  result="effect2_foregroundBlur_857_7592"
                />
              </filter>
              <filter
                id="glow-dg2"
                x="0.5"
                y="0.514648"
                width="200%"
                height="200%"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="20" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1 0 0 0 0 0.313726 0 0 0 0 0.666667 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_857_7590"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_857_7590"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="0.85"
                  result="effect2_foregroundBlur_857_7590"
                />
              </filter>
              <filter
                id="glow-dg3"
                x="0.953125"
                y="0.5"
                width="200%"
                height="200%"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="20" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  // values="0 0 0 0 0 0 0 0 0 0.827451 0 0 0 0 0.592157 0 0 0 1 0"
                  values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_857_7591"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_857_7591"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="0.85"
                  result="effect2_foregroundBlur_857_7591"
                />
              </filter>
              <filter
                id="glow-dg4"
                x="0.59375"
                y="0.5"
                width="200%"
                height="200%"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="20" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_857_7744"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_857_7744"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="0.85"
                  result="effect2_foregroundBlur_857_7744"
                />
              </filter>
            </defs>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Line
              dataKey="dg1"
              type="monotone"
              stroke="var(--color-dg1)"
              strokeWidth={1}
              dot={false}
              filter="url(#glow-dg1)"
            />
            <Line
              dataKey="dg2"
              type="monotone"
              stroke="var(--color-dg2)"
              strokeWidth={1}
              dot={false}
              filter="url(#glow-dg2)"
            />
            <Line
              dataKey="dg3"
              type="monotone"
              stroke="var(--color-dg3)"
              strokeWidth={1}
              dot={false}
              filter="url(#glow-dg3)"
            />
            <Line
              dataKey="dg4"
              type="monotone"
              stroke="var(--color-dg4)"
              strokeWidth={1}
              dot={false}
              filter="url(#glow-dg4)"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="text-xxs"
                  labelClassName="text-foreground"
                />
              }
              defaultIndex={1}
            />
            <XAxis dataKey="time" hide />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function LineChartBgCartesianGrid() {
  return (
    <div className="pointer-events-none absolute inset-[10px] z-0">
      <svg width="100%" height="100%">
        {[...Array(100)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${i * 8}`}
            y1="0"
            x2={`${i * 8}`}
            y2="100%"
            stroke="white"
            strokeWidth="0.1"
          />
        ))}
        {[...Array(100)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${i * 8}`}
            x2="100%"
            y2={`${i * 8}`}
            stroke="white"
            strokeWidth="0.1"
          />
        ))}
      </svg>
    </div>
  );
}

const IconShrink = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 21.6L3.6 23L9.52941 17.7294V20.6118H11.8824V14.3529H4.63529V16.3294H8.02353L2 21.6Z"
      fill="white"
    />
    <path
      d="M24.2354 3.40001L22.6354 2.00001L16.7059 7.27059V4.38824H14.353V10.6471H21.6001V8.67059H18.2118L24.2354 3.40001Z"
      fill="white"
    />
  </svg>
);
