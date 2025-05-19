function getMouseCoordinates(
  e: any,
  canvasRef: any,
  scale: any,
  panOffset: any
) {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();

  // Get the mouse position relative to the canvas.
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const clientX =
    (x - canvas.width / 2) / scale + canvas.width / 2 - panOffset.x;
  const clientY =
    (y - canvas.height / 2) / scale + canvas.height / 2 - panOffset.y;

  return { clientX, clientY };
}

export default getMouseCoordinates; // Export the function as default
