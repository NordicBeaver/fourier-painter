import * as math from 'mathjs';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

const canvasWidth = 400;
const canvasHeight = 400;

const originX = canvasWidth / 2;
const originY = canvasHeight / 2;

interface Point {
  x: number;
  y: number;
}
interface Arrow {
  origin: Point;
  length: number;
  frequency: number;
  angle: number;
}

function createArrow(length: number, frequency: number) {
  const arrow: Arrow = {
    origin: { x: 0, y: 0 },
    length: length,
    frequency: frequency,
    angle: 0,
  };
  return arrow;
}

function getArrowEnd(arrow: Arrow) {
  const end: Point = {
    x: arrow.origin.x + arrow.length * Math.cos(arrow.angle),
    y: arrow.origin.y + arrow.length * Math.sin(arrow.angle),
  };
  return end;
}

function updateArrows(arrows: Arrow[], phase: number) {
  for (let i = 0; i < arrows.length; i++) {
    const arrow = arrows[i];
    arrow.angle = phase * arrow.frequency;
    if (i != 0) {
      const prevEnd = getArrowEnd(arrows[i - 1]);
      arrow.origin = prevEnd;
    }
  }
}

function drawArrow(context: CanvasRenderingContext2D, arrow: Arrow) {
  const end = getArrowEnd(arrow);

  context.beginPath();
  context.moveTo(arrow.origin.x, arrow.origin.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}

const arrows: Arrow[] = [createArrow(100, 1), createArrow(50, -0.5), createArrow(20, 8)];

const shape: [number, number][] = [];

const animate: FrameRequestCallback = (time) => {
  updateArrows(arrows, time / 1000);

  const lastArrowEnd = getArrowEnd(arrows[arrows.length - 1]);
  shape.push([lastArrowEnd.x, lastArrowEnd.y]);

  context.clearRect(0, 0, 400, 400);

  context.save();

  context.translate(originX, originY);

  arrows.forEach((arrow) => {
    drawArrow(context, arrow);
  });

  if (shape.length >= 2) {
    context.beginPath();
    context.moveTo(shape[0][0], shape[0][1]);
    for (let i = 1; i < shape.length; i++) {
      context.lineTo(shape[i][0], shape[i][1]);
    }
    context.stroke();
  }

  context.restore();

  requestAnimationFrame(animate);
};

function startAnimation() {
  requestAnimationFrame(animate);
}

let isDrawing = false;
const sketch: Point[] = [];

function showSketch(sketch: Point[]) {
  context.clearRect(0, 0, 400, 400);

  context.save();

  if (sketch.length >= 2) {
    for (let i = 0; i < sketch.length - 1; i++) {
      context.beginPath();
      context.moveTo(sketch[i].x, sketch[i].y);
      context.lineTo(sketch[i + 1].x, sketch[i + 1].y);
      context.stroke();
    }

    // Close the shape
    context.beginPath();
    context.moveTo(sketch[sketch.length - 1].x, sketch[sketch.length - 1].y);
    context.lineTo(sketch[0].x, sketch[0].y);
    context.stroke();
  }

  context.restore();
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  sketch.length = 0;
  sketch.push({ x: e.offsetX, y: e.offsetY });
  showSketch(sketch);
});

canvas.addEventListener('mouseup', (e) => {
  isDrawing = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    sketch.push({ x: e.offsetX, y: e.offsetY });
    console.log('hi');
    showSketch(sketch);
  }
});
