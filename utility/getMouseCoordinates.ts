import { CanvasRef, Point } from "@/types/drawing";

function getMouseCoordinates(
  e: React.MouseEvent<HTMLCanvasElement>,
  canvasRef: CanvasRef,
  scale: number,
  panOffset: Point
): { clientX: number; clientY: number } {
  const canvas = canvasRef.current;
  if (!canvas) {
    throw new Error("Canvas reference is null");
  }

  const rect = canvas.getBoundingClientRect();

  // Get the mouse position relative to the canvas
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Calculate the coordinates with scale and pan offset
  const clientX =
    (x - canvas.width / 2) / scale + canvas.width / 2 - panOffset.x;
  const clientY =
    (y - canvas.height / 2) / scale + canvas.height / 2 - panOffset.y;

  return { clientX, clientY };
}

export default getMouseCoordinates;
