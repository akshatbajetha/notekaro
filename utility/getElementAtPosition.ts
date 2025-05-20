import isWithinElement from "./isWithinElement";
import { DrawingElement } from "@/types/drawing";

function getElementAtPosition(
  x: number,
  y: number,
  elements: DrawingElement[]
) {
  if (!elements) return null;

  const element = elements.find((element: DrawingElement) =>
    isWithinElement(x, y, element)
  );

  return element;
}

export default getElementAtPosition;
