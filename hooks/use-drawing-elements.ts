import { useLocalStorage } from "./use-local-storage";
import {
  DrawingElement,
  PencilElement,
  TextElement,
  ShapeElement,
} from "@/types/drawing";

export const STORAGE_KEYS = {
  ELEMENTS: "drawing-elements",
  CANVAS_SIZE: "canvas-size",
  ACTION: "drawing-action",
  TOOL: "selected-tool",
  SELECTED_ELEMENT: "selected-element",
  BRUSH_SIZE: "brush-size",
  COLOR: "drawing-color",
  PAN_OFFSET: "pan-offset",
  START_PAN_POSITION: "start-pan-position",
  SCALE: "canvas-scale",
} as const;

export function useDrawingElements(initialElements: DrawingElement[] = []) {
  const [elements, setElements] = useLocalStorage<DrawingElement[]>(
    STORAGE_KEYS.ELEMENTS,
    initialElements
  );

  const addElement = (element: DrawingElement) => {
    setElements((prev) => [...prev, element]);
  };

  const updateElement = (id: string, updates: Partial<DrawingElement>) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          // Ensure we maintain the correct type when updating
          const updatedElement = { ...el, ...updates };
          if (el.type === "pencil") {
            return updatedElement as PencilElement;
          } else if (el.type === "text") {
            return updatedElement as TextElement;
          } else {
            return updatedElement as ShapeElement;
          }
        }
        return el;
      })
    );
  };

  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return {
    elements,
    setElements,
    addElement,
    updateElement,
    deleteElement,
    STORAGE_KEYS,
  };
}
