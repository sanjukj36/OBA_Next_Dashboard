import dialImageAsset from "@/assets/dial.png";
import { CanvasGaugeRenderer } from "@/types/canvas-gauge";

export class CanvasRadialGaugeBlueRenderer extends CanvasGaugeRenderer {
  private theme = {
    c1Grad1: "#00000066",
    c1Grad2: "#4162C7CC",
    c1Grad3: "#4162C7CC",
    c2Grad1: "#3550A1",
    c2Grad2: "#283C78",
    c3FillStyle: "#090C1A",
    c4Grad1: "#161D39",
    c4Grad2: "#101325",
    c5StrokeStyle: "#0085C9",
    c6StrokeStyle: "#0085C9",
    c7StrokeStyle: "#00BBFF",
    fontValueFill: "#FFFFFF",
    fontValueShadow: "#FFFFFF",
    strokeStyle: "#00BBFF",
    strokeStyle50: "#0085C9"
  };
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private value: number;
  private min: number;
  private max: number;
  private r: number;
  private baseUnit: number;

  constructor({
    ctx,
    value,
    min,
    max,
    size
  }: {
    ctx: CanvasRenderingContext2D;
    value: number;
    min: number;
    max: number;
    size: number;
  }) {
    super();
    this.ctx = ctx;
    this.value = value;
    this.width = size;
    this.height = size;
    this.min = min;
    this.max = max;
    this.r = this.width * 0.5;
    this.baseUnit = this.width * 0.01;
  }

  public render() {
    const { ctx, width } = this;
    const cX = width / 2;
    const cY = width / 2;

    const startAngle = Math.PI / 2;
    const endAngle = (Math.PI * 408) / 180;
    const targetAngle = this.computeAngle(startAngle, endAngle);

    ctx.clearRect(0, 0, width, width);

    // Adding layers.
    this.drawBackground();
    this.drawC1Layer(cX, cY);
    this.drawC2Layer(cX, cY);
    this.drawC3Layer(cX, cY);
    this.drawC4Layer(cX, cY);
    this.drawC5LayerWithSroke(
      cX,
      cY,
      startAngle,
      endAngle,
      this.r * 0.798375,
      this.r * 0.625
    );
    this.drawValueArc(
      cX,
      cY,
      startAngle,
      targetAngle,
      this.r * 0.798375,
      this.r * 0.625
    );
    this.drawValueText(cX, cY);
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
    const r = this.r * 0.8473125;
    const grad = this.createRadialGradient(cx, cy, r * 0.1, r, [
      { stop: 0, color: this.theme.c1Grad1 },
      { stop: 0.5, color: this.theme.c1Grad2 },
      { stop: 1, color: this.theme.c1Grad3 }
    ]);
    this.ctx.save();
    this.ctx.shadowColor = this.theme.c1Grad1;
    this.ctx.shadowBlur = this.baseUnit * (32.4 / 2);
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  private drawC2Layer(cx: number, cy: number) {
    const r = this.r * 0.6660625;
    const grad = this.createRadialGradient(cx, cy, r * 0.1, r, [
      { stop: 0, color: this.theme.c2Grad1 },
      { stop: 1, color: this.theme.c2Grad2 }
    ]);
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawC3Layer(cx: number, cy: number) {
    const r_inner = this.r * 0.6;
    const r_outer = this.r * 0.8;
    this.ctx.save();
    this.ctx.filter = `blur(${this.baseUnit * (12 / 2)}px)`;
    this.ctx.shadowColor = this.theme.c3FillStyle;
    this.ctx.shadowBlur = this.baseUnit * (7.5 / 2);
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.fillStyle = this.theme.c3FillStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r_outer, 0, Math.PI * 2);
    this.ctx.arc(cx, cy, r_inner, 0, Math.PI * 2, true); // inner cutout
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  private drawC4Layer(cx: number, cy: number) {
    const r = this.r * 0.546125;
    const grad = this.createRadialGradient(cx, cy, 0, r, [
      { stop: 0, color: this.theme.c4Grad1 },
      { stop: 1, color: this.theme.c4Grad2 }
    ]);
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawC5LayerWithSroke(
    cx: number,
    cy: number,
    start: number,
    end: number,
    outer_r: number,
    inner_r: number
  ) {
    const lw = this.baseUnit * 0.5;

    // Outer ring (C5)
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = this.theme.c5StrokeStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, outer_r, start, end);
    this.ctx.stroke();
    // Inner ring (C6)
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = this.theme.c6StrokeStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, inner_r, start, end);
    this.ctx.stroke();

    [start, end].forEach((angle: number) => {
      const sx = cx + inner_r * Math.cos(angle);
      const sy = cy + inner_r * Math.sin(angle);
      const ex = cx + outer_r * Math.cos(angle);
      const ey = cy + outer_r * Math.sin(angle);
      this.ctx.strokeStyle = this.theme.strokeStyle50;
      this.ctx.beginPath();
      this.ctx.moveTo(sx, sy);
      this.ctx.lineTo(ex, ey);
      this.ctx.stroke();
    });
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
    const lw = this.baseUnit * 5.5;
    this.ctx.beginPath();
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = this.theme.strokeStyle;
    this.ctx.arc(cx, cy, r, start, end);
    this.ctx.stroke();
  }

  private drawValueText(cx: number, cy: number) {
    const valueFontSizeMap = {
      1: 28,
      2: 22,
      3: 20,
      4: 16,
      5: 12,
      6: 11
    } as const;
    const digitCount = Math.floor(this.value).toString().length;
    const fallbackFontSize = 12;
    const mappedFontSize: number =
      valueFontSizeMap[digitCount as keyof typeof valueFontSizeMap] ??
      fallbackFontSize;
    const valueFontSize = Math.floor(this.baseUnit * mappedFontSize);
    this.ctx.font = `700 ${valueFontSize}px dDin`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this.theme.fontValueFill;
    this.ctx.fillText(Math.floor(this.value).toString(), cx, cy);
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = this.theme.fontValueShadow;
  }
}
