import { Point } from './main';

export function initUserDrawing(element: HTMLElement) {
  let isDrawing = false;
  const sketch: Point[] = [];

  element.addEventListener('mousedown', (e) => {
    isDrawing = true;
    sketch.length = 0;
    sketch.push({ x: e.offsetX, y: e.offsetY });
  });

  element.addEventListener('mouseup', (e) => {
    isDrawing = false;
  });

  element.addEventListener('mousemove', (e) => {
    if (isDrawing) {
      sketch.push({ x: e.offsetX, y: e.offsetY });
    }
  });

  return sketch;
}

export function drawSketch(sketch: Point[], context: CanvasRenderingContext2D) {
  context.save();

  context.strokeStyle = '#FAFAFF';
  context.lineWidth = 2;
  if (sketch.length >= 2) {
    for (let i = 0; i < sketch.length - 1; i++) {
      context.beginPath();
      context.moveTo(sketch[i].x, sketch[i].y);
      context.lineTo(sketch[i + 1].x, sketch[i + 1].y);
      context.stroke();
    }

    // Close the shape
    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(sketch[sketch.length - 1].x, sketch[sketch.length - 1].y);
    context.lineTo(sketch[0].x, sketch[0].y);
    context.stroke();
  }

  context.restore();
}
