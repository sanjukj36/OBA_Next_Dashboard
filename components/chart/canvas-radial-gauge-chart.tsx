"use client";

import React, { useLayoutEffect, useRef } from "react";
import { RendererClassType } from "@/types/canvas-gauge";
import { CanvasRadialGaugeBlackRenderer } from "./canvas-gauge-class/canvas-radial-gauge-black";
import { CanvasRadialGaugeBlueRenderer } from "./canvas-gauge-class/canvas-radial-gauge-blue";

export type CanvasRadialGaugeType = "radial_black" | "radial_blue";
type CanvasGaugeRendererList = {
  [K in CanvasRadialGaugeType]: RendererClassType;
};

const canvasRendererList: CanvasGaugeRendererList = {
  radial_black: CanvasRadialGaugeBlackRenderer,
  radial_blue: CanvasRadialGaugeBlueRenderer
};

interface RadialGaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  type?: CanvasRadialGaugeType;
}
export const CanvasRadialGaugeChart: React.FC<RadialGaugeChartProps> = ({
  value,
  min = 0,
  max = 120,
  size = 300,
  type = "radial_blue"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GaugeRenderer = canvasRendererList[type];
    const renderer = new GaugeRenderer({
      ctx,
      value,
      min,
      max,
      size
    });
    renderer.render();
  }, [value, min, max, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        background: "transparent"
      }}
    ></canvas>
  );
};
