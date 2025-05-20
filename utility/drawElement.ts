import getStroke from "perfect-freehand";
import getSvgPathFromStroke from "./getSvg";
import { RoughCanvas } from "roughjs/bin/canvas";
import { DrawingElement } from "@/types/drawing";

function drawElement(
  roughCanvas: RoughCanvas,
  context: CanvasRenderingContext2D,
  element: DrawingElement
): void {
  const { options } = element;

  switch (element.type) {
    case "pencil":
      if (!element.points) return;
      const outlinePoints = getStroke(element.points, {
        size: options.strokeWidth,
      });
      const pathData = getSvgPathFromStroke(
        outlinePoints as [number, number][]
      );
      const myPath = new Path2D(pathData);

      context.fillStyle = options.stroke;
      context.fill(myPath);
      break;

    case "text":
      if (!element.text) return;
      context.fillStyle = "#ffffff";
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;

    default:
      if (!element.roughElement) return;
      roughCanvas.draw(element.roughElement);
      break;
  }
}

export default drawElement;
