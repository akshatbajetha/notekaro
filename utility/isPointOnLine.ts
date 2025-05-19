import distance from "./distance";

function onLine(x1, y1, x2, y2, x, y) {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };

  const offset = distance(a, b) - (distance(a, c) + distance(b, c));

  return Math.abs(offset) < 5;
}

export default onLine;
