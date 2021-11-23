import * as math from 'mathjs';
import { Arrow, createArrow, drawArrow, getArrowEnd, updateArrows } from './arrows';
import { calculateTransformCoefficients } from './fourier';
import { drawSketch, initUserDrawing } from './userDrawing';

const container = document.getElementById('container') as HTMLDivElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

canvas.width = container.clientWidth;
canvas.height = container.clientWidth;

const context = canvas.getContext('2d')!;

const startButton = document.getElementById('startButton') as HTMLButtonElement;
const resetButton = document.getElementById('resetButton') as HTMLButtonElement;

const originX = canvas.width / 2;
const originY = canvas.height / 2;

export interface Point {
  x: number;
  y: number;
}

const arrows: Arrow[] = [];

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
    context.strokeStyle = '#DE6B48';
    context.lineWidth = 2;
    context.moveTo(shape[0][0], shape[0][1]);
    for (let i = 1; i < shape.length; i++) {
      context.lineTo(shape[i][0], shape[i][1]);
    }
    context.stroke();
  }
  context.restore();
}

const animationFrame: FrameRequestCallback = (time) => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (isArrowsAnimationGoing) {
    if (arrowsAnimationStartTime === null) {
      arrowsAnimationStartTime = time;
    } else {
      const totalTime = time - arrowsAnimationStartTime;
      updateArrows(arrows, totalTime / 1000);
      const lastArrowEnd = getArrowEnd(arrows[arrows.length - 1]);
      shape.push([lastArrowEnd.x, lastArrowEnd.y]);
      // Don't let the shape grow to big. Otherwise with time it will eat all memory.
      // 10K elements should be more than enough. I'm a bit lazy now to calculate the exact amount.
      console.log(shape.length);
      if (shape.length > 10000) {
        shape.shift();
      }
      drawArrowsAndShape();
    }
  } else {
    drawSketch(sketch, context);
  }

  requestAnimationFrame(animationFrame);
};
requestAnimationFrame(animationFrame);

startButton.addEventListener('click', (e) => {
  arrows.length = 0;
  shape.length = 0;
  arrowsAnimationStartTime = null;

  const sketchValuesAsComplex = sketch.map((point) => math.complex(point.x - originX, point.y - originY));

  const coeffIndexFrom = -50;
  const coeffIndexTo = 50;

  const fourierCoefficients = calculateTransformCoefficients(sketchValuesAsComplex, coeffIndexFrom, coeffIndexTo);

  const newArrows = fourierCoefficients.map((c, index) => {
    const length = math.sqrt(c.re * c.re + c.im * c.im);
    const initialAngle = math.atan2(c.im, c.re);
    const frequncy = coeffIndexFrom + index;
    const arrow = createArrow(length, frequncy, initialAngle);
    return arrow;
  });

  arrows.push(...newArrows);

  isArrowsAnimationGoing = true;

  startButton.style.display = 'none';
  resetButton.style.display = 'block';
});

resetButton.addEventListener('click', (e) => {
  isArrowsAnimationGoing = false;

  startButton.style.display = 'block';
  resetButton.style.display = 'none';
});
