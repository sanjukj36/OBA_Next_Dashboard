"use client";

import React, { useLayoutEffect, useRef } from "react";
import { RendererClassType } from "@/types/canvas-gauge";
import { CanvasGaugeBlackRenderer } from "./canvas-gauge-class/canvas-gauge-black";
import { CanvasGaugeBlueRenderer } from "./canvas-gauge-class/canvas-gauge-blue";
import { Loader2 } from "lucide-react";

type CanvasGaugeType = "normal_black" | "normal_blue";
type CanvasRendererList = {
  [K in CanvasGaugeType]: RendererClassType;
};
const canvasRendererList: CanvasRendererList = {
  normal_blue: CanvasGaugeBlueRenderer,
  normal_black: CanvasGaugeBlackRenderer
};

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  unit?: string;
  type?: CanvasGaugeType;
  loading?: boolean;
}
export const CanvasGaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 120,
  size = 300,
  unit = "",
  type = "normal_blue",
  loading
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GageRenderer = canvasRendererList[type];

    const renderer = new GageRenderer({ ctx, value, min, max, size, unit });
    renderer.render();
  }, [value, min, max, size, unit]);

  if(loading) {
    return <div style={{ width: size, height: size }} className="flex justify-center items-center rounded-full bg-black/20">
          <Loader2 className="animate-spin" />
    </div>
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ background: "transparent" }}
    />
  );
};
