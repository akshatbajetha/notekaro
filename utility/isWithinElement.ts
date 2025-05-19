import distance from "./distance";
import onLine from "./isPointOnLine";

function isWithinElement(x: any, y: any, element: any) {
  const { type, x1, y1, x2, y2 } = element;

  if (type === "line") {
    return onLine(x1, y1, x2, y2, x, y);
  } else if (type === "rect") {
    const xMin = Math.min(x1, x2);
    const xMax = Math.max(x1, x2);
    const yMin = Math.min(y1, y2);
    const yMax = Math.max(y1, y2);
    return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
  } else if (type === "circle") {
    // find the distance between the  center and the point
    // if the distance is less than the radius, then the point is inside the circle
    const center = { x: x1, y: y1 };
    const clickedPoint = { x, y };

    const distanceFromCenter = distance(center, clickedPoint);

    return distanceFromCenter < Math.abs(x2 - x1);
  } else if (type === "diamond") {
    // find the distance between the center and the point
    // if the distance is less than the radius, then the point is inside the diamond
    const center = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    const clickedPoint = { x, y };

    const distanceFromCenter = distance(center, clickedPoint);

    return distanceFromCenter < Math.abs(x2 - x1);
  } else if (type === "pencil") {
    // const threshold = 5 + (brushSize < 10 ? 5 : 10);
    const threshold = 10;

    // Handle case with no points
    if (element.points.length === 0) return false;

    // Check distance to each line segment
    for (let i = 0; i < element.points.length - 1; i++) {
      const [x1, y1] = element.points[i];
      const [x2, y2] = element.points[i + 1];

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
    if (element.points.length === 1) {
      const [px, py] = element.points[0];
      const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      return distance <= threshold;
    }

    return false; // No segment or point was close enough
  } else if (type === "text") {
    return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
  } else {
    return false;
  }
}

export default isWithinElement;
