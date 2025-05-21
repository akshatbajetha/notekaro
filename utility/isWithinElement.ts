import {
  DrawingElement,
  TextElement,
  ShapeElement,
  PencilElement,
} from "@/types/drawing";
import distance from "./distance";
import onLine from "./isPointOnLine";

function isWithinElement(x: number, y: number, element: DrawingElement) {
  const { type } = element;

  if (
    type === "line" ||
    type === "rect" ||
    type === "circle" ||
    type === "diamond"
  ) {
    const shapeElement = element as ShapeElement;
    const { x1, y1, x2, y2 } = shapeElement;

    if (type === "line") {
      return onLine(x1, y1, x2, y2, x, y);
    } else if (type === "rect") {
      const xMin = Math.min(x1, x2);
      const xMax = Math.max(x1, x2);
      const yMin = Math.min(y1, y2);
      const yMax = Math.max(y1, y2);
      return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
    } else if (type === "circle") {
      const center = { x: x1, y: y1 };
      const clickedPoint = { x, y };
      const distanceFromCenter = distance(center, clickedPoint);
      return distanceFromCenter < Math.abs(x2 - x1);
    } else if (type === "diamond") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      // Calculate the distance from the point to each edge of the diamond
      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);
      const halfWidth = (maxX - minX) / 2;
      const halfHeight = (maxY - minY) / 2;

      // Check if the point is inside the diamond using the diamond equation
      return dx / halfWidth + dy / halfHeight <= 1;
    }
  } else if (type === "pencil") {
    const pencilElement = element as PencilElement;
    const threshold = 10;

    // Handle case with no points
    if (pencilElement.points.length === 0) return false;

    // Check distance to each line segment
    for (let i = 0; i < pencilElement.points.length - 1; i++) {
      const [x1, y1] = pencilElement.points[i];
      const [x2, y2] = pencilElement.points[i + 1];

      // Calculate distance from point to line segment
      const dx = x2 - x1;
      const dy = y2 - y1;
      const segmentLengthSquared = dx * dx + dy * dy;

      let t = ((x - x1) * dx + (y - y1) * dy) / segmentLengthSquared;
      t = Math.max(0, Math.min(1, t)); // Clamp t to [0,1]

      const nearestX = x1 + t * dx;
      const nearestY = y1 + t * dy;

      const distance = Math.sqrt((x - nearestX) ** 2 + (y - nearestY) ** 2);

      if (distance <= threshold) {
        return true;
      }
    }

    // Handle single point case
    if (pencilElement.points.length === 1) {
      const [px, py] = pencilElement.points[0];
      const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      return distance <= threshold;
    }

    return false; // No segment or point was close enough
  } else if (type === "text") {
    const textElement = element as TextElement;
    const { x1, y1, x2, y2 } = textElement;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
  }

  return false;
}

export default isWithinElement;
