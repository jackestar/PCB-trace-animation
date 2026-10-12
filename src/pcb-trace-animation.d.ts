export interface PCBTraceOptions {
  color?: string;
  traceColor?: string;
  viaColor?: string;
  autoResize?: boolean;
  speed?: number;
  gridResolution?: number;
  lineSpacing?: number;
  lineWidth?: number;
  lineMargin?: number;
  lineAngleVariation?: number;
  lineEndCoefficient?: number;
  onComplete?: (() => void) | null;
}

export default class PCBTraceAnimation {
  constructor(traceElement: HTMLCanvasElement, options?: PCBTraceOptions);

  initCanvas(): void;

  drawLine(
    posX: number,
    posY: number,
    length: number,
    isHorizontal?: boolean,
    isInverted?: boolean,
  ): void;

  drawVia(x: number, y: number): void;

  start(): void;
  stop(): void;
  restart(): void;
}