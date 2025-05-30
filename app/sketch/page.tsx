"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import rough from "roughjs";
import useHistory from "@/hooks/use-history";
import { getMouseCoordinates, getElementAtPosition } from "@/utility";
import CanvasContainer from "@/components/sketch/Canvas";
import getStroke from "perfect-freehand";
import getSvgPathFromStroke from "@/utility/getSvg";
import { useTheme } from "next-themes";
import {
  CanvasRef,
  DrawingElement,
  DrawingOptions,
  Point,
  TextAreaRef,
  PencilElement,
  TextElement,
  ShapeElement,
  SelectedElement,
  Scale,
  CanvasSize,
  ComputedPosition,
} from "@/types/drawing";
import { Drawable } from "roughjs/bin/core";
import { RoughCanvas } from "roughjs/bin/canvas";
import { useDebouncedCallback } from "use-debounce";
import { Loader2 } from "lucide-react";
const generator = rough.generator();

// // Add debounce utility
// function debounce<T extends (...args: any[]) => any>(
//   func: T,
//   wait: number
// ): (...args: Parameters<T>) => void {
//   let timeout: NodeJS.Timeout;
//   return (...args: Parameters<T>) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// }

export default function App() {
  const canvasRef: CanvasRef = useRef(null);
  const textAreaRef: TextAreaRef = useRef(null);
  const { theme } = useTheme();
  const isMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  // Canvas states
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 0,
    height: 0,
  });
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState<
    "panning" | "moving" | "writing" | "drawing" | "erasing" | "none"
  >("none");
  const [tool, setTool] = useState<
    | "line"
    | "rect"
    | "circle"
    | "diamond"
    | "pencil"
    | "text"
    | "selection"
    | "grab"
    | "eraser"
    | "arrow"
  >("selection");
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(null);
  const [brushSize, setBrushSize] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [color, setColor] = useState<string>(
    theme === "dark" ? "#ffffff" : "#000000"
  );
  const [panOffset, setPanOffset] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [startPanMousePosition, setStartPanMousePosition] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState<Scale>(1);

  // Initialize canvas size first
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight - 64,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Then load elements after canvas is initialized
  useEffect(() => {
    if (!canvasSize.width || !canvasSize.height) return;
    if (isMounted.current) return; // Skip if already mounted
    isMounted.current = true;

    const fetchElements = async () => {
      try {
        const res = await fetch("/api/sketch");
        const data = await res.json();

        if (!data.elements || !Array.isArray(data.elements)) {
          console.error("Invalid elements data received");
          return;
        }

        // Process elements to ensure they have proper rough.js representations
        const processedElements = data.elements.map(
          (element: {
            id: string;
            type: string;
            x1: number;
            y1: number;
            x2?: number;
            y2?: number;
            text?: string;
            points?: [number, number][];
            options: {
              stroke: string;
              strokeWidth: number;
            };
          }) => {
            // For shape elements, create proper rough.js representation
            if (element.type !== "pencil" && element.type !== "text") {
              return createElement(
                element.id,
                element.x1,
                element.y1,
                element.x2 || element.x1,
                element.y2 || element.y1,
                element.type as DrawingElement["type"],
                element.options
              );
            }

            // For pencil and text elements, just return as is
            return element;
          }
        );

        setElements(processedElements);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching elements:", error);
        setIsLoading(false);
      }
    };
    fetchElements();
  }, [canvasSize]);

  // Effect to invert black and white colors when theme changes
  useEffect(() => {
    if (!elements || elements.length === 0) {
      setColor(theme === "dark" ? "#ffffff" : "#000000");
      return;
    }

    const newColor = theme === "dark" ? "#ffffff" : "#000000";
    const elementsCopy = [...elements];

    elements.forEach((element) => {
      const shouldUpdate =
        (theme === "dark" && element.options.stroke === "#000000") ||
        (theme === "light" && element.options.stroke === "#ffffff");

      if (shouldUpdate) {
        const elementIndex = elementsCopy.findIndex(
          (el) => el.id === element.id
        );
        if (elementIndex === -1) return;

        if (element.type === "pencil") {
          elementsCopy[elementIndex] = {
            ...element,
            options: {
              ...element.options,
              stroke: newColor,
            },
          };
        } else if (element.type === "text") {
          const textElement = element as TextElement;
          elementsCopy[elementIndex] = {
            ...textElement,
            options: {
              ...textElement.options,
              stroke: newColor,
            },
          };
        } else {
          const shapeElement = element as ShapeElement;
          const updatedElement = createElement(
            element.id,
            shapeElement.x1,
            shapeElement.y1,
            shapeElement.x2,
            shapeElement.y2,
            shapeElement.type,
            { ...shapeElement.options, stroke: newColor }
          );
          elementsCopy[elementIndex] = updatedElement;
        }
      }
    });

    setElements(elementsCopy);
    setColor(newColor);
  }, [theme]);

  const onZoom = useCallback((delta: number) => {
    setScale((prevScale: Scale) => {
      const newScale = Math.min(Math.max(prevScale + delta, 0.1), 5);
      return (Math.round(newScale * 10) / 10) as Scale;
    });
  }, []);

  const drawElement = useCallback(
    (
      roughCanvas: RoughCanvas,
      context: CanvasRenderingContext2D,
      element: DrawingElement
    ) => {
      if (!element) return;

      const { options } = element;
      switch (element.type) {
        case "pencil":
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
        // *************************************************
        case "text":
          context.fillStyle = options.stroke;
          context.font = "24px sans-serif";
          context.fillText(element.text, element.x1, element.y1);
          break;
        default:
          roughCanvas.draw(element.roughElement as Drawable);
          break;
      }
    },
    []
  );

  // Render canvas using rough.js
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(scale, scale);
    context.translate(
      -canvas.width / 2 + panOffset.x,
      -canvas.height / 2 + panOffset.y
    );

    if (elements) {
      elements.forEach((element: DrawingElement) => {
        // Skip currently "writing" text element
        if (
          action === "writing" &&
          selectedElement &&
          element.id === selectedElement.id
        )
          return;
        drawElement(roughCanvas, context, element);
      });
    }
    context.restore();
  }, [elements, action, selectedElement, panOffset, scale, drawElement]);

  // Focus on text area when writing text
  useEffect(() => {
    if (action !== "writing") return;
    const textArea = textAreaRef.current;
    if (!textArea) return;
    const timer = setTimeout(() => {
      textArea.focus();
      textArea.value = (selectedElement as TextElement).text || "";
    }, 0);
    return () => clearTimeout(timer);
  }, [action, selectedElement]);

  // Other event listeners
  useEffect(() => {
    const panFunction = (e: WheelEvent) => {
      e.preventDefault();

      // Check if it's a touchpad scroll (deltaMode === 0)
      if (e.deltaMode === 0) {
        // Touchpad scroll - use deltaX and deltaY directly for panning
        setPanOffset((prevOffset: Point) => ({
          x: prevOffset.x - e.deltaX,
          y: prevOffset.y - e.deltaY,
        }));
      } else {
        // Mouse wheel - handle zoom as before
        const delta = -e.deltaY * 0.001;
        onZoom(delta);
      }
    };
    document.addEventListener("wheel", panFunction, { passive: false });
    return () => document.removeEventListener("wheel", panFunction);
  }, [onZoom]);

  useEffect(() => {
    const undoRedoFunction = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) redo();
        else undo();
      }
    };
    document.addEventListener("keydown", undoRedoFunction);
    return () => document.removeEventListener("keydown", undoRedoFunction);
  }, [undo, redo]);

  function createElement(
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: DrawingElement["type"],
    options: DrawingOptions = {
      strokeWidth: brushSize,
      stroke: color,
    }
  ): DrawingElement {
    let roughElement: Drawable;
    switch (type) {
      case "line":
        roughElement = generator.line(x1, y1, x2, y2, options);
        break;
      case "arrow": {
        // Calculate arrow head points
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowLength = 20;
        const arrowAngle = Math.PI / 6; // 30 degrees

        const arrowX1 = x2 - arrowLength * Math.cos(angle - arrowAngle);
        const arrowY1 = y2 - arrowLength * Math.sin(angle - arrowAngle);
        const arrowX2 = x2 - arrowLength * Math.cos(angle + arrowAngle);
        const arrowY2 = y2 - arrowLength * Math.sin(angle + arrowAngle);

        // Create a path that includes both the line and arrow head
        roughElement = generator.path(
          `M ${x1} ${y1} L ${x2} ${y2} M ${x2} ${y2} L ${arrowX1} ${arrowY1} M ${x2} ${y2} L ${arrowX2} ${arrowY2}`,
          options
        );
        break;
      }
      case "rect":
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, options);
        break;
      case "circle": {
        const radius = Math.hypot(x2 - x1, y2 - y1);
        roughElement = generator.circle(x1, y1, radius, options);
        break;
      }
      case "diamond": {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        roughElement = generator.polygon(
          [
            [centerX, minY],
            [minX, centerY],
            [centerX, maxY],
            [maxX, centerY],
          ],
          options
        );
        break;
      }
      case "pencil":
        return { id, type, points: [[x1, y1]], options };
      case "text": {
        const canvas = canvasRef.current;
        if (!canvas)
          return {
            id,
            type,
            x1,
            y1,
            x2: x1 + 100,
            y2: y1 + 24,
            text: "",
            options,
          };
        const context = canvas.getContext("2d");
        if (!context)
          return {
            id,
            type,
            x1,
            y1,
            x2: x1 + 100,
            y2: y1 + 24,
            text: "",
            options,
          };
        context.font = "24px sans-serif";
        const textWidth = context.measureText("").width;
        const textHeight = 24;
        return {
          id,
          type,
          x1,
          y1,
          x2: x1 + Math.max(textWidth, 100),
          y2: y1 + textHeight,
          text: "",
          options,
        };
      }
      default:
        throw new Error("Invalid shape type");
    }
    return { id, x1, y1, x2, y2, type, roughElement, options };
  }

  function updateElement(
    id: string,
    x1: number,
    y1: number,
    x2: number | null,
    y2: number | null,
    type: DrawingElement["type"],
    options: DrawingOptions
  ) {
    const elementsCopy: DrawingElement[] = [...elements];
    const elementIndex = elementsCopy.findIndex((el) => el.id === id);
    if (elementIndex === -1) return;

    switch (type) {
      case "pencil":
        if (x2 !== null && y2 !== null) {
          (elementsCopy[elementIndex] as PencilElement).points = [
            ...((elementsCopy[elementIndex] as PencilElement).points || []),
            [x2, y2],
          ];
        }
        break;
      case "text": {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        const textElement = elementsCopy[elementIndex] as TextElement;
        context.font = "24px sans-serif";
        const textWidth = context.measureText(textElement.text || "").width;
        const textHeight = 24;
        const baseElement = createElement(
          id,
          x1,
          y1,
          x1 + textWidth,
          y1 + textHeight,
          type,
          options
        );
        elementsCopy[elementIndex] = {
          ...baseElement,
          text: textElement.text,
          options: { ...baseElement.options },
        } as TextElement;
        break;
      }
      default:
        if (x2 !== null && y2 !== null) {
          elementsCopy[elementIndex] = createElement(
            id,
            x1,
            y1,
            x2,
            y2,
            type,
            options
          );
        }
        break;
    }
    setElements(elementsCopy, true);
    saveElements();
  }

  // --- Mouse event handlers --- //
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (action === "writing") return;
    const { clientX, clientY } = getMouseCoordinates(
      e,
      canvasRef,
      scale,
      panOffset
    );

    if (tool === "grab") {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      canvasRef.current!.style.cursor = "grab";
      return;
    }

    if (tool === "eraser") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        setElements((prevElements: DrawingElement[]) =>
          prevElements.filter((el: DrawingElement) => el.id !== element.id)
        );
        saveElements();
      }
      setAction("erasing");
      return;
    }

    if (e.button === 1) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      canvasRef.current!.style.cursor = "grab";
      return;
    }

    // Check if we clicked on an element
    const element = getElementAtPosition(clientX, clientY, elements);
    if (element) {
      // If we're in selection mode or the element is already selected
      if (tool === "selection" || selectedElement?.id === element.id) {
        if (element.type === "pencil") {
          const xOffSets = (element as PencilElement).points!.map(
            (point: [number, number]) => clientX - point[0]
          );
          const yOffSets = (element as PencilElement).points!.map(
            (point: [number, number]) => clientY - point[1]
          );
          setSelectedElement({ ...element, xOffSets, yOffSets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setAction("moving");
        return;
      }
    }

    // If no element was clicked or we're not in selection mode, create a new element
    if (tool !== "selection") {
      if (!elements) return;
      const id = crypto.randomUUID();
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
        { stroke: color, strokeWidth: brushSize }
      );
      setElements((prevElements: DrawingElement[]) => [
        ...prevElements,
        element,
      ]);
      saveElements();
      setSelectedElement(element);
      if (tool === "text") {
        setAction("writing");
      } else {
        setAction("drawing");
      }
    } else {
      // If we're in selection mode and clicked on empty space, clear selection
      setSelectedElement(null);
      setAction("none");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(
      e,
      canvasRef,
      scale,
      panOffset
    );

    if (tool === "grab") {
      if (action === "panning") {
        const deltaX = clientX - startPanMousePosition.x;
        const deltaY = clientY - startPanMousePosition.y;
        setPanOffset((prevOffset: Point) => ({
          x: prevOffset.x + deltaX,
          y: prevOffset.y + deltaY,
        }));
      }
      return;
    }

    if (action === "erasing" && tool === "eraser") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        setElements((prevElements: DrawingElement[]) =>
          prevElements.filter((el: DrawingElement) => el.id !== element.id)
        );
      }
      return;
    }

    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset((prevOffset: Point) => ({
        x: prevOffset.x + deltaX,
        y: prevOffset.y + deltaY,
      }));
    }

    // Only update cursor if we're not over a resize handle
    if (tool === "selection" && !action) {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        canvasRef.current!.style.cursor = "move";
      } else {
        canvasRef.current!.style.cursor = "default";
      }
    }

    if (action === "drawing") {
      if (!elements) return;

      const lastElement = elements[elements.length - 1];
      if (!lastElement) return;
      const { x1, y1, type, options } = lastElement as ShapeElement;
      updateElement(lastElement.id, x1, y1, clientX, clientY, type, options);
    } else if (action === "moving") {
      if (selectedElement?.type === "pencil") {
        const pencilElement = selectedElement as PencilElement & {
          xOffSets?: number[];
          yOffSets?: number[];
        };
        const newPoints = pencilElement.points.map(
          (_: [number, number], index: number) => [
            clientX - pencilElement.xOffSets![index],
            clientY - pencilElement.yOffSets![index],
          ]
        );
        const elementsCopy: DrawingElement[] = [...elements];
        const elementIndex = elementsCopy.findIndex(
          (el) => el.id === selectedElement.id
        );
        if (elementIndex !== -1) {
          elementsCopy[elementIndex] = {
            ...selectedElement,
            points: newPoints,
          } as PencilElement;
          setElements(elementsCopy, true);
        }
      } else {
        const elementWithOffset = selectedElement as (
          | TextElement
          | ShapeElement
        ) & { offsetX?: number; offsetY?: number };
        const { id, x1, y1, x2, y2, type, options } = elementWithOffset;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - (elementWithOffset.offsetX ?? 0);
        const newY1 = clientY - (elementWithOffset.offsetY ?? 0);

        // Preserve the original options
        const elementOptions =
          elementWithOffset.type === "text"
            ? {
                ...options,
                text: (elementWithOffset as TextElement).text,
              }
            : options;

        // Update the element and keep it selected
        const updatedElement = {
          ...elementWithOffset,
          x1: newX1,
          y1: newY1,
          x2: newX1 + width,
          y2: newY1 + height,
        };
        setSelectedElement(updatedElement);
        updateElement(
          id,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          elementOptions
        );
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "grab") {
      if (action === "panning") {
        setAction("none");
        canvasRef.current!.style.cursor = "grab";
      }
      return;
    }

    const { clientX, clientY } = getMouseCoordinates(
      e,
      canvasRef,
      scale,
      panOffset
    );

    if (action === "erasing") {
      setAction("none");
      return;
    }

    // Handle text element click for writing
    if (selectedElement?.type === "text") {
      const elementWithOffset = selectedElement as TextElement & {
        offsetX?: number;
        offsetY?: number;
      };
      if (
        clientX - (elementWithOffset.offsetX ?? 0) === elementWithOffset.x1 &&
        clientY - (elementWithOffset.offsetY ?? 0) === elementWithOffset.y1
      ) {
        setAction("writing");
        return;
      }
    }

    // Don't clear selection if we're in selection mode or if we're writing text
    if (tool !== "selection" && action !== "writing") {
      setAction("none");
      setSelectedElement(null);
      canvasRef.current!.style.cursor = "default";
    } else {
      // Just reset the action but keep the selection
      setAction("none");
      // Update cursor based on whether we're hovering over an element
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        canvasRef.current!.style.cursor = "move";
      } else {
        canvasRef.current!.style.cursor = "default";
      }
    }
  };

  const handleBlur = () => {
    if (!selectedElement || !textAreaRef.current) return;

    const textElement = selectedElement as TextElement;
    const text = textAreaRef.current.value;

    // Only update if there's actual text
    if (text.trim()) {
      // Create a copy of the text element with the new text
      const updatedElement = {
        ...textElement,
        text: text,
      };
      // Update the elements array
      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === textElement.id ? updatedElement : el
        )
      );
      saveElements();
      // Keep the element selected
      setSelectedElement(updatedElement);
    } else {
      // Remove empty text elements
      setElements((prevElements) =>
        prevElements.filter((el) => el.id !== textElement.id)
      );
      saveElements();
      setSelectedElement(null);
    }
    setAction("none");
  };

  let computedPosition: ComputedPosition | undefined;
  if (
    selectedElement &&
    canvasRef.current &&
    selectedElement.type !== "pencil"
  ) {
    const element = selectedElement as TextElement | ShapeElement;
    computedPosition = {
      left:
        scale * (element.x1 - canvasRef.current.width / 2 + panOffset.x) +
        canvasRef.current.width / 2,
      top:
        scale * (element.y1 - canvasRef.current.height / 2 + panOffset.y) +
        canvasRef.current.height / 2,
    };
  }

  // Add saveSketch function
  const saveElements = useDebouncedCallback(async () => {
    try {
      const response = await fetch("/api/sketch", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elements,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save sketch");
      }
    } catch (error) {
      console.error("Error saving sketch:", error);
    }
  }, 1000);

  return (
    <div className="min-h-screen dark:bg-[#1E1E1E] bg-[#F5F5F5] pt-16 overflow-hidden">
      {isLoading ? (
        <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[calc(100vh-4rem)]">
          <CanvasContainer
            tool={tool}
            setTool={setTool}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            color={color}
            setColor={setColor}
            scale={scale}
            setScale={setScale}
            onZoom={onZoom}
            undo={undo}
            redo={redo}
            canvasRef={canvasRef}
            textAreaRef={textAreaRef}
            action={action}
            handleBlur={handleBlur}
            computedPosition={computedPosition}
            canvasSize={canvasSize}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            selectedElement={selectedElement}
            panOffset={panOffset}
          />
        </div>
      )}
    </div>
  );
}

// Save to DB
// Save Image
