const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

const canvasWidth = 400;
const canvasHeight = 400;

const originX = canvasWidth / 2;
const originY = canvasHeight / 2;

const lineLength = 100;
const shape: [number, number][] = [];

const animate: FrameRequestCallback = (time) => {
  const angle = time / 1000;
  const endPointX = Math.cos(angle) * lineLength;
  const endPointY = Math.sin(angle) * lineLength;

  shape.push([endPointX, endPointY]);

  context.clearRect(0, 0, 400, 400);

  context.save();

  context.translate(originX, originY);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(endPointX, endPointY);
  context.stroke();

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
requestAnimationFrame(animate);
