import { Point } from './main';

export interface Arrow {
  origin: Point;
  length: number;
  frequency: number;
  initialAngle: number;
  angle: number;
}

export function createArrow(length: number, frequency: number, initialAngle: number = 0) {
  const arrow: Arrow = {
    origin: { x: 0, y: 0 },
    length: length,
    frequency: frequency,
    initialAngle: initialAngle,
    angle: initialAngle,
  };
  return arrow;
}

export function getArrowEnd(arrow: Arrow) {
  const end: Point = {
    x: arrow.origin.x + arrow.length * Math.cos(arrow.angle),
    y: arrow.origin.y + arrow.length * Math.sin(arrow.angle),
  };
  return end;
}

export function updateArrows(arrows: Arrow[], phase: number) {
  for (let i = 0; i < arrows.length; i++) {
    const arrow = arrows[i];
    arrow.angle = arrow.initialAngle + phase * arrow.frequency;
    if (i != 0) {
      const prevEnd = getArrowEnd(arrows[i - 1]);
      arrow.origin = prevEnd;
    }
  }
}

export function drawArrow(context: CanvasRenderingContext2D, arrow: Arrow) {
  const end = getArrowEnd(arrow);

  context.beginPath();
  context.strokeStyle = '#FAFAFF';
  context.moveTo(arrow.origin.x, arrow.origin.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}
