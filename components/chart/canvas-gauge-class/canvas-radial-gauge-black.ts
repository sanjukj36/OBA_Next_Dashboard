import { CanvasGaugeRenderer } from "@/types/canvas-gauge";

export class CanvasRadialGaugeBlackRenderer extends CanvasGaugeRenderer {
  private theme = {
    cBFill: "#000000",
    c1StrokeStyle: "#FFFFFF",
    c2StrokeStyle: "#FFFFFF",
    c3FillStyle: "#000000",
    fontValueFill: "#FFFFFF",
    fontValueStroke: "#474747",
    fontValueShadow: "#FFFFFF",
    strokeStyle: "#FFFFFF",
    strokeStyle50: "#FFFFF"
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
    this.drawBackground(cX, cY);
    this.drawC1LayerWithSroke(
      cX,
      cY,
      startAngle,
      endAngle,
      this.r * 0.798375,
      this.r * 0.625
    );
    this.drawC2LayerWithLines(cX, cY, 0, 2 * Math.PI, this.r * 0.625);
    this.drawC3Layer(cX, cY, 0, 2 * Math.PI, this.r * 0.6);
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

  private drawBackground(cx: number, cy: number) {
    const r = this.r * 0.95;
    this.ctx.save();
    this.ctx.shadowColor = this.theme.strokeStyle;
    this.ctx.shadowBlur = this.baseUnit * 2.5;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.fillStyle = this.theme.cBFill;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  private drawC1LayerWithSroke(
    cx: number,
    cy: number,
    start: number,
    end: number,
    outer_r: number,
    inner_r: number
  ) {
    const lw = this.baseUnit * 0.5;
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = this.theme.c1StrokeStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, outer_r, start, end);
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

  private drawC2LayerWithLines(
    cx: number,
    cy: number,
    start: number,
    end: number,
    r: number
  ) {
    const lw = this.baseUnit * 0.5;
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = this.theme.c2StrokeStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, start, end);
    this.ctx.stroke();
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
  }

  private drawC3Layer(
    cx: number,
    cy: number,
    start: number,
    end: number,
    r: number
  ) {
    const blur = this.baseUnit * 1.5;
    this.ctx.save();
    this.ctx.fillStyle = this.theme.c3FillStyle;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, start, end);
    this.ctx.filter = `blur(${blur}px)`;
    this.ctx.fill();
    this.ctx.restore();
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
    this.ctx.strokeStyle = this.theme.strokeStyle;
    this.ctx.arc(cx, cy, r, start, end);
    this.ctx.stroke();
  }

  private drawValueText(cx: number, cy: number) {
    const valueFontSizeMap = {
      1: 32,
      2: 30,
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
    const value = Math.floor(this.value).toString();
    this.ctx.font = `700 ${valueFontSize}px dDin`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.lineWidth = this.baseUnit * 0.3;
    this.ctx.strokeStyle = this.theme.fontValueStroke;
    this.ctx.fillStyle = this.theme.fontValueFill;
    this.ctx.fillText(value, cx, cy);
    this.ctx.strokeText(value, cx, cy);
  }
}
