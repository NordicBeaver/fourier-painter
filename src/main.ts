import * as math from 'mathjs';
import { Arrow, createArrow, drawArrow, getArrowEnd, updateArrows } from './arrows';
import { calculateTransformCoefficients } from './fourier';
import { drawSketch, initUserDrawing } from './userDrawing';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

const startButton = document.getElementById('startButton') as HTMLButtonElement;

const canvasWidth = 400;
const canvasHeight = 400;

const originX = canvasWidth / 2;
const originY = canvasHeight / 2;

export interface Point {
  x: number;
  y: number;
}

const arrows: Arrow[] = [createArrow(100, 1), createArrow(50, -0.5), createArrow(20, 8)];

const shape: [number, number][] = [];

let isArrowsAnimationGoing = false;
let arrowsAnimationStartTime: number | null = null;

const sketch = initUserDrawing(canvas);

function drawArrowsAndShape() {
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
}

const animationFrame: FrameRequestCallback = (time) => {
  context.clearRect(0, 0, 400, 400);

  if (isArrowsAnimationGoing) {
    if (arrowsAnimationStartTime === null) {
      arrowsAnimationStartTime = time;
    } else {
      const totalTime = time - arrowsAnimationStartTime;
      updateArrows(arrows, totalTime / 1000);
      const lastArrowEnd = getArrowEnd(arrows[arrows.length - 1]);
      shape.push([lastArrowEnd.x, lastArrowEnd.y]);
      drawArrowsAndShape();
    }
  } else {
    drawSketch(sketch, context);
  }

  requestAnimationFrame(animationFrame);
};
requestAnimationFrame(animationFrame);

startButton.addEventListener('click', (e) => {
  const sketchValuesAsComplex = sketch.map((point) => math.complex(point.x - 200, point.y - 200));
  const fourierCoefficients = calculateTransformCoefficients(sketchValuesAsComplex, -50, 50);

  const newArrows = fourierCoefficients.map((c, index) => {
    const length = math.sqrt(c.re * c.re + c.im * c.im);
    const initialAngle = math.atan2(c.im, c.re);
    const frequncy = index - 50;
    const arrow = createArrow(length, frequncy, initialAngle);
    return arrow;
  });

  arrows.length = 0;
  arrows.push(...newArrows);
  isArrowsAnimationGoing = true;
});
