import dialImageAsset from "@/assets/dial-half-221x221.png";
import { addOpacity } from "@/lib/utils";
import {
  CanvasGaugeRenderer,
  CanvasGaugeRendererProps
} from "@/types/canvas-gauge";

const NUM_OF_OUTLINE = 11;
const TICK_LABEL_DIGITT_HRESHOLD = 3;

export class CanvasGaugeBlackRenderer extends CanvasGaugeRenderer {
  private theme = {
    c1FillStyle: "#000000",
    c2StrokeStyle: "#FFFFFF",
    c3StrokeStyle: "#FFFFFF",
    c4FillStyle: "#000000",
    cValueStrokeStyle: "#FFFFFF",
    fontLabelFill: addOpacity("#FFFFFF", 70),
    fontTickLabelScaleFill: addOpacity("#FFFFFF", 65),
    fontLabelShadow: "#5C5C5C",
    fontUnitFill: addOpacity("#FFFFFF", 90),
    fontUnitShadow: "#5C5C5C",
    fontValueFill: "#FFFFFF",
    fontValueShadow: "#5C5C5C",
    fontValueSroke: "#212121",
    strokeStyle: "#FFFFFF",
    strokeStyle50: "#FFFFFF"
  };
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private value: number;
  private min: number;
  private max: number;
  private r: number;
  private baseUnit: number;
  private unit: string;
  private tickLableScaleFactor: number = 1;
  private tickLableScaleText: string = "";

  constructor({ ctx, value, min, max, size, unit }: CanvasGaugeRendererProps) {
    super();
    this.ctx = ctx;
    this.value = value;
    this.unit = unit ?? "";
    this.width = size;
    this.height = size;
    this.min = min;
    this.max = max;
    this.r = this.width * 0.5;
    this.baseUnit = this.width * 0.01;
    const maxLength = Math.max(
      this.max.toFixed(0).length,
      this.min.toFixed(0).length
    );
    if (maxLength >= TICK_LABEL_DIGITT_HRESHOLD) {
      const power = maxLength - (TICK_LABEL_DIGITT_HRESHOLD - 1);
      this.tickLableScaleFactor = Math.pow(10, power - 1);
      this.tickLableScaleText = `x${this.tickLableScaleFactor}`;
    }
  }

  public render() {
    const { ctx, width } = this;
    const cX = width / 2;
    const cY = width / 2;

    const start = (Math.PI * 132) / 180;
    const end = (Math.PI * 408) / 180;
    const target = this.computeAngle(start, end);

    ctx.clearRect(0, 0, width, width);
    this.drawBackground(); // draw background.

    // Circle Layers Add.
    this.drawC1Layer(cX, cY);
    this.drawC2LayerWithLines(cX, cY, start, end, this.r * 0.55);
    this.drawC3LayerWithLines(
      cX,
      cY,
      start,
      end,
      this.r * 0.4214,
      this.r * 0.55
    );
    this.drawC4Layer(cX, cY, 0, Math.PI * 2, this.r * 0.4);
    this.drawLabels(cX, cY, start, end, this.r * 0.55);
    this.drawValueText(cX, cY);
    this.drawUnitText(cX, cY + this.baseUnit * 12);
    this.drawTickLabelScaleText(cX, cY + this.baseUnit * 30);
    this.drawValueArc(cY, cY, start, target, this.r * 0.55, this.r * 0.4214);
  }

  private computeAngle(start: number, end: number): number {
    if (this.value <= this.min) return start;
    if (this.value >= this.max) return end;
    return (
      ((this.value - this.min) / (this.max - this.min)) * (end - start) + start
    );
  }

  private drawBackground() {
    const img = new Image();
    img.src = dialImageAsset.src;
    img.onload = () => this.ctx.drawImage(img, 0, 0, this.width, this.height);
  }

  private createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    r1: number,
    stops: Array<{ stop: number; color: string }>
  ) {
    const grad = this.ctx.createRadialGradient(x0, y0, r0, x0, y0, r1);
    stops.forEach(({ stop, color }) => grad.addColorStop(stop, color));
    return grad;
  }

  private drawC1Layer(cx: number, cy: number) {
    const r = this.r * 0.93;
    this.ctx.fillStyle = this.theme.c1FillStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawC2LayerWithLines(
    cx: number,
    cy: number,
    start: number,
    end: number,
    r: number
  ) {
    const lw = this.baseUnit * 0.4;
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = this.theme.c2StrokeStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, start, end);
    this.ctx.stroke();
    // Draw radial lines
    const outerNumLines = NUM_OF_OUTLINE;
    const outerlineLength = this.baseUnit * 2.3;
    for (let i = 0; i < outerNumLines; i++) {
      const angle = start + (i / (outerNumLines - 1)) * (end - start);
      const startX = cx + r * Math.cos(angle);
      const startY = cy + r * Math.sin(angle);
      const endX = startX + outerlineLength * Math.cos(angle);
      const endY = startY + outerlineLength * Math.sin(angle);
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = this.theme.strokeStyle;
      this.ctx.lineWidth = lw;
      this.ctx.stroke();
    }
  }

  private drawC3LayerWithLines(
    cx: number,
    cy: number,
    start: number,
    end: number,
    r: number,
    r2: number
  ) {
    const lw = this.baseUnit * 0.4;
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = this.theme.c3StrokeStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    this.ctx.stroke();
    // Draw sun-like lines
    const numLines = 30;
    const lineLength = this.baseUnit * 5.7;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const startX = cx + r * Math.cos(angle);
      const startY = cy + r * Math.sin(angle);
      const endX = cx + (r - lineLength) * Math.cos(angle);
      const endY = cy + (r - lineLength) * Math.sin(angle);
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = this.theme.strokeStyle50;
      this.ctx.lineWidth = lw;
      this.ctx.stroke();
    }
    [start, end].forEach(angle => {
      const sx = cx + r2 * Math.cos(angle);
      const sy = cy + r2 * Math.sin(angle);
      const ex = cx + r * Math.cos(angle);
      const ey = cy + r * Math.sin(angle);
      this.ctx.beginPath();
      this.ctx.moveTo(sx, sy);
      this.ctx.lineTo(ex, ey);
      this.ctx.strokeStyle = this.theme.strokeStyle50;
      this.ctx.lineWidth = lw;
      this.ctx.stroke();
    });
  }

  private drawC4Layer(
    cx: number,
    cy: number,
    start: number,
    end: number,
    r: number
  ) {
    const blur = this.baseUnit * 1.5;
    this.ctx.save();
    this.ctx.fillStyle = this.theme.c4FillStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, start, end);
    this.ctx.filter = `blur(${blur}px)`;
    this.ctx.fill();
    this.ctx.restore();
  }

  private drawLabels(
    cx: number,
    cy: number,
    start: number,
    end: number,
    r: number
  ) {
    // Draw text labels widh adjusted positioning.
    const numLabels = NUM_OF_OUTLINE;
    for (let i = 0; i < numLabels; i++) {
      const fontSize = this.baseUnit * 5.7; // Reduced from 4.7
      const valueLabel =
        this.min + (i * (this.max - this.min)) / (numLabels - 1);
      const displayScaleDownedValueLabel =
        valueLabel / this.tickLableScaleFactor;
      const labelAngle = start + (i / (numLabels - 1)) * (end - start);
      const labelRadius = r + this.baseUnit * 4; // Reduced from 5 to bring numbers closer
      const textX = cx + labelRadius * Math.cos(labelAngle);
      const textY = cy + labelRadius * Math.sin(labelAngle);
      if (i < numLabels / 3) {
        this.ctx.textAlign = "end";
        this.ctx.textBaseline = "middle";
      } else if (i < (2 * numLabels) / 3 - 1) {
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "bottom";
      } else {
        this.ctx.textAlign = "start";
        this.ctx.textBaseline = "middle";
      }
      this.ctx.save();
      this.ctx.shadowBlur = this.baseUnit * 2.2;
      this.ctx.shadowColor = this.theme.fontLabelShadow;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      this.ctx.font = `400 ${fontSize}px dDin`;
      this.ctx.fillStyle = this.theme.fontLabelFill;
      this.ctx.fillText(displayScaleDownedValueLabel.toFixed(0), textX, textY);
      this.ctx.restore();
    }
  }

  private drawValueArc(
    cx: number,
    cy: number,
    start: number,
    end: number,
    outer_r: number,
    inner_r: number
  ) {
    const r = (outer_r + inner_r) / 2;
    const lw = this.baseUnit * 4;
    this.ctx.beginPath();
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = this.theme.cValueStrokeStyle;
    this.ctx.arc(cx, cy, r, start, end);
    this.ctx.stroke();
  }

  private drawValueText(cx: number, cy: number) {
    const valueFontSizeMap = {
      1: 22,
      2: 18,
      3: 14,
      4: 13,
      5: 12,
      6: 11
    } as const;
    const digitCount = Math.floor(this.value).toString().length;
    const fallbackFontSize = 12;
    const mappedFontSize: number =
      valueFontSizeMap[digitCount as keyof typeof valueFontSizeMap] ??
      fallbackFontSize;
    const valueFontSize = Math.floor(this.baseUnit * mappedFontSize);
    const value = Math.floor(this.value).toString();
    this.ctx.save();
    this.ctx.font = `700 ${valueFontSize}px dDin`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.lineWidth = this.baseUnit * 0.3;
    this.ctx.strokeStyle = this.theme.fontValueSroke;
    this.ctx.fillStyle = this.theme.fontValueFill;
    this.ctx.fillText(value, cx, cy);
    this.ctx.strokeText(value, cx, cy);
    this.ctx.restore();
  }

  private drawUnitText(cx: number, cy: number) {
    if (!this.unit) return;
    const unitFontSize = Math.floor(this.baseUnit * 5);
    this.ctx.save();
    this.ctx.shadowColor = this.theme.fontUnitShadow;
    this.ctx.shadowBlur = this.baseUnit * 2.97;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.font = `400 ${unitFontSize}px dDin`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this.theme.fontUnitFill;
    this.ctx.fillText(this.unit, cx, cy);
    this.ctx.restore();
  }

  private drawTickLabelScaleText(cx: number, cy: number) {
    if (!this.tickLableScaleText || this.tickLableScaleFactor <= 1) return;
    const tickLabelScaleTextFontSize = this.baseUnit * 5.7;
    this.ctx.save();
    this.ctx.shadowColor = this.theme.fontUnitShadow;
    this.ctx.shadowBlur = this.baseUnit * 2.97;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.font = `400 ${tickLabelScaleTextFontSize}px dDin`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this.theme.fontTickLabelScaleFill;
    this.ctx.fillText(this.tickLableScaleText, cx, cy);
    this.ctx.restore();
  }
}
