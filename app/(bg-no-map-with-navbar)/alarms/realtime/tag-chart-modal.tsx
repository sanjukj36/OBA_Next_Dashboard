import React, { Dispatch, SetStateAction } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { X } from "lucide-react";
import Image from "next/image";
import {
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import borderBg from "@/assets/chart-border-1563 x 767.png";
import { formatLocaltoUtc } from "@/lib/utils";

// import { SimpleLineChart } from "./simple-line-chart";

interface TagChartModalProps {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  tag: string;
  data?: any[];
  isLoading?: boolean;
  error?: Error | null;
}

export const TagChartModal: React.FC<TagChartModalProps> = ({
  open,
  onClose,
  tag,
  data,
  isLoading,
  error
}) => {
  const chartData = data?.chart || [];

  const sortedData = [...chartData].sort(
    (a, b) =>
      new Date(a.payload_time).getTime() - new Date(b.payload_time).getTime()
  );
  const from = sortedData[0]
    ? formatLocaltoUtc(sortedData[0].payload_time, "dd-MM-yyyy hh-mm")
    : "N/A";
  const to = sortedData[sortedData.length - 1]
    ? formatLocaltoUtc(sortedData[sortedData.length - 1].payload_time, "dd-MM-yyyy hh-mm")
    : "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div
        onClick={() => onClose(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-6xl overflow-hidden rounded-[24px] border border-white/20 bg-black/80 shadow-2xl"
        >
          {/* Background image layer */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <Image
              src={borderBg}
              alt="Chart Border"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-neutral-900 via-black to-neutral-900 px-6 py-4">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white">
              {tag}
            </h2>
            <div className="flex items-center gap-3 text-white">
              <span className="font-alexandria text-xl text-neutral-400">
                From
              </span>
              <span className="rounded bg-white/10 px-3 py-1 text-xl font-medium text-white shadow">
                {from}
              </span>
              <span className="font-alexandria text-xl text-neutral-400">
                To
              </span>
              <span className="rounded bg-white/10 px-3 py-1 text-xl font-medium text-white shadow">
                {to}
              </span>
            </div>

            <button
              onClick={() => onClose(false)}
              className="rounded-full p-2 transition hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Chart Area */}
          <div className="min-h-[420px] rounded-b-[24px] bg-black/60 p-6 backdrop-blur-lg">
            {isLoading ? (
              <p className="text-center text-white">Loading chart...</p>
            ) : error ? (
              <p className="text-center text-red-400">Failed to load data.</p>
            ) : (
              <div className="h-[360px]">
                <SimpleLineChart data={data?.chart || []} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

interface SimpleLineChartProps {
  data: { payload_time: string; value: number }[];
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        {/* Grid */}
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

        {/* Axes */}
        <XAxis
          dataKey="payload_time"
          tickLine={false}
          stroke="#FFFFFF"
          strokeWidth={2}
          height={90}
          tick={<CustomXAxisTick />}
          domain={["auto", "auto"]}
        />
        <YAxis stroke="#FFFFFF" />

        {/* Line */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />

        {/* Tooltip */}
        {/* <Tooltip/> */}
        <Tooltip content={CustomTooltip} />
        <Tooltip content={CustomTooltip} />

        {/* Brush with preview chart */}
        <Brush
          dataKey="payload_time"
          height={50}
          stroke="#FFFFFF"
          travellerWidth={10}
          fill="rgba(0,0,0,0.5)"
          tickFormatter={value => {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "";
            const m = date.toLocaleString("default", { month: "short", timeZone: "UTC" });
            const d = date.getUTCDate().toString().padStart(2, "0");
            const h = date.getUTCHours().toString().padStart(2, "0");
            const min = date.getUTCMinutes().toString().padStart(2, "0");
            return `${m} ${d} ${h}:${min}`;
          }}
        >
          <ComposedChart>
            <Line
              dataKey="value"
              type="monotone"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              opacity={0.5}
            />
          </ComposedChart>
        </Brush>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const date = new Date(payload.value);

  if (isNaN(date.getTime())) return null;

  const month = date.toLocaleString("default", { month: "long", timeZone: "UTC" });
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  return (
    <g transform={`translate(${x},${y + 5})`}>
      <text
        x={0}
        y={15}
        textAnchor="middle"
        fontSize={25}
        fontWeight="bold"
        className="fill-white font-din"
      >
        {month}
      </text>
      <text
        x={0}
        y={40}
        textAnchor="middle"
        fontSize={20}
        className="fill-white font-din"
      >
        {day}
      </text>
      <text
        x={0}
        y={60}
        textAnchor="middle"
        fontSize={20}
        className="fill-gray-400 font-din"
      >
        {time}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const { value, payload_time } = payload[0].payload;
    const date = new Date(payload_time);

    const formattedDate = date.toLocaleDateString("default", {
      timeZone: "UTC",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit"
    });

    const formattedTime = date.toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC"
    });

    return (
      <div className="rounded-lg border border-gray-700 bg-black/90 p-3 text-white shadow-lg">
        <p className="text-sm font-semibold">{formattedDate}</p>
        <p className="text-xs text-gray-300">{formattedTime}</p>
        <p className="mt-2 text-lg font-bold text-blue-400">
          Value: {value.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};
