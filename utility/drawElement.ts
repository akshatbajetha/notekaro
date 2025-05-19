import getStroke from "perfect-freehand";
import getSvgPathFromStroke from "./getSvg";

function drawElement(roughCanvas: any, context: any, element: any) {
  const { options } = element;

  switch (element.type) {
    case "pencil":
      const outlinePoints = getStroke(element.points, {
        size: options.strokeWidth,
      });
      const pathData = getSvgPathFromStroke(outlinePoints);
      const myPath = new Path2D(pathData);

      context.fillStyle = options.stroke;
      context.fill(myPath);
      break;
    case "text":
      context.fillStyle = "#ffffff";
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;
    default:
      roughCanvas.draw(element.roughElement);
      break;
  }
}

export default drawElement;
