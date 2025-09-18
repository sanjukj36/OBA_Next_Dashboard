export interface CanvasGaugeRendererProps {
  ctx: CanvasRenderingContext2D;
  value: number;
  min: number;
  max: number;
  size: number;
  unit?: string;
}

export abstract class CanvasGaugeRenderer {
  abstract render(): void;
}
export type RendererClassType<
  T extends CanvasGaugeRenderer = CanvasGaugeRenderer
> = new (props: CanvasGaugeRendererProps) => T;
