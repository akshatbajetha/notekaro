"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import rough from "roughjs";
import useHistory from "@/hooks/use-history";
import { getMouseCoordinates, getElementAtPosition } from "@/utility";
import CanvasContainer from "@/components/sketch/Canvas";
// import ChatDrawer from "@/components/Chatdrawer";
// import { useParams } from "next/navigation";
import getStroke from "perfect-freehand";
import getSvgPathFromStroke from "@/utility/getSvg";
import { useTheme } from "next-themes";

const generator: any = rough.generator();

export default function App(): any {
  // const params = useParams();
  // const userId = params.userId;

  const canvasRef: any = useRef(null);
  const textAreaRef: any = useRef(null);
  const { theme } = useTheme();

  // Canvas states
  const [canvasSize, setCanvasSize] = useState<any>({ width: 0, height: 0 });
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState<any>("none");
  const [tool, setTool] = useState<any>("line");
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [brushSize, setBrushSize] = useState<any>(1);
  const [color, setColor] = useState<any>(
    theme === "dark" ? "#ffffff" : "#000000"
  );
  const [panOffset, setPanOffset] = useState<any>({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState<any>({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState<any>(1);
  const [scaleOffset, setScaleOffset] = useState<any>({ x: 0, y: 0 });
  // Flag to avoid emitting/saving until initial load is complete
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // New: Element counter state to show number of elements

  // Update canvas size on resize
  useEffect(() => {
    const updateCanvasSize = (): any => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight - 64,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Load canvas from DB for this user and mark initial load complete
  // useEffect(() => {
  //   const loadCanvas = async () => {
  //     try {
  //       if (!userId) return;
  //       const res = await fetch(`/api/get-canvas/${userId}`);
  //       const data = await res.json();
  //       if (res.ok && data.elements) {
  //         setElements(data.elements);
  //       }
  //       setInitialLoadComplete(true);
  //     } catch (err) {
  //       console.error("🛑 Failed to load canvas from DB:", err);
  //     }
  //   };

  //   loadCanvas();
  // }, [userId]);

  // Save canvas to DB and broadcast sync via WS after every change
  // useEffect(() => {
  //   const saveAndSync = async () => {
  //     if (!initialLoadComplete || !userId) return;

  //     if (!elements) return;

  //     try {
  //       await fetch(`/api/update-canvas/${userId}`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ elements }),
  //       });
  //     } catch (err) {
  //       console.error("🛑 Error saving canvas to DB:", err);
  //     }
  //   };

  //   saveAndSync();
  // }, [elements, initialLoadComplete, userId]);

  // useEffect(() => {
  //   // Handle tab visibility change
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible") {
  //       location.reload();
  //     }
  //   };

  //   // Reload every 10 seconds
  //   const intervalId = setInterval(() => {
  //     location.reload();
  //   }, 10000);

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     clearInterval(intervalId);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // Render canvas using rough.js
  useLayoutEffect(() => {
    const canvas: any = canvasRef.current;
    const context: any = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas: any = rough.canvas(canvas);
    const scaledWidth: any = canvas.width * scale;
    const scaledHeight: any = canvas.height * scale;
    const scaleOffsetX: any = (canvas.width - scaledWidth) / 2;
    const scaleOffsetY: any = (canvas.height - scaledHeight) / 2;
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(scale, scale);
    context.translate(
      -canvas.width / 2 + panOffset.x,
      -canvas.height / 2 + panOffset.y
    );

    if (elements) {
      elements.forEach((element: any) => {
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
  }, [elements, action, selectedElement, panOffset, scale]);

  // Focus on text area when writing text
  useEffect(() => {
    if (action !== "writing") return;
    const textArea: any = textAreaRef.current;
    const timer: any = setTimeout(() => {
      textArea.focus();
      textArea.value = selectedElement.text;
    }, 0);
    return () => clearTimeout(timer);
  }, [action, selectedElement]);

  // Other event listeners
  useEffect((): any => {
    const panFunction = (e: any): any => {
      setPanOffset((prevOffset: any) => ({
        x: prevOffset.x - e.deltaX,
        y: prevOffset.y - e.deltaY,
      }));
    };
    document.addEventListener("wheel", panFunction);
    return () => document.removeEventListener("wheel", panFunction);
  }, []);

  useEffect(() => {
    const undoRedoFunction = (e: any): any => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) redo();
        else undo();
      }
    };
    document.addEventListener("keydown", undoRedoFunction);
    return () => document.removeEventListener("keydown", undoRedoFunction);
  }, [undo, redo]);

  function updateElement(
    id: any,
    x1: any,
    y1: any,
    x2: any,
    y2: any,
    type: any,
    options: any
  ): any {
    const elementsCopy: any[] = [...elements];
    switch (type) {
      case "pencil":
        elementsCopy[id].points = [...elementsCopy[id].points, [x2, y2]];
        break;
      case "text": {
        const context: any = canvasRef.current.getContext("2d");
        context.font = "24px sans-serif";
        const textWidth: any = context.measureText(options.text).width;
        const textHeight: any = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text,
        };
        break;
      }
      default:
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
    }
    setElements(elementsCopy, true);
  }

  function createElement(
    id: any,
    x1: any,
    y1: any,
    x2: any,
    y2: any,
    type: any,
    options: { strokeWidth: number; stroke: string } = {
      strokeWidth: brushSize,
      stroke: color,
    }
  ): any {
    let roughElement: any;
    switch (type) {
      case "line":
        roughElement = generator.line(x1, y1, x2, y2, options);
        break;
      case "rect":
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, options);
        break;
      case "circle": {
        const radius: any = Math.hypot(x2 - x1, y2 - y1);
        roughElement = generator.circle(x1, y1, radius, options);
        break;
      }
      case "diamond": {
        const minX: any = Math.min(x1, x2);
        const maxX: any = Math.max(x1, x2);
        const minY: any = Math.min(y1, y2);
        const maxY: any = Math.max(y1, y2);
        const centerX: any = (minX + maxX) / 2;
        const centerY: any = (minY + maxY) / 2;
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
      case "text":
        return { id, type, x1, y1, x2, y2, text: "", options };
      default:
        throw new Error("Invalid shape type");
    }
    return { id, x1, y1, x2, y2, type, roughElement };
  }

  function drawElement(roughCanvas: any, context: any, element: any) {
    if (!element) return;

    // console.log("Drawing element:", element);

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
        const newElement = createElement(
          element.id,
          element.x1,
          element.y1,
          element.x2,
          element.y2,
          element.type
        );
        // element.roughElement = newElement.roughElement;
        roughCanvas.draw(element.roughElement);
        break;
    }
  }

  // --- Mouse event handlers --- //
  const handleMouseDown = (e: any): any => {
    if (action === "writing") return;
    const { clientX, clientY } = getMouseCoordinates(
      e,
      canvasRef,
      scale,
      panOffset
    );

    if (tool === "grab") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        // If clicked on an element, select and move it
        if (element.type === "pencil") {
          const xOffSets = element.points.map(
            (point: any) => clientX - point[0]
          );
          const yOffSets = element.points.map(
            (point: any) => clientY - point[1]
          );
          setSelectedElement({ ...element, xOffSets, yOffSets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setAction("moving");
        canvasRef.current.style.cursor = "move";
      } else {
        // If clicked on empty canvas, start panning
        setAction("panning");
        setStartPanMousePosition({ x: clientX, y: clientY });
        canvasRef.current.style.cursor = "grab";
      }
      return;
    }

    if (tool === "eraser") {
      setAction("erasing");
      return;
    }
    if (e.button === 1) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      canvasRef.current.style.cursor = "grab";
      return;
    }
    if (tool === "selection") {
      const element: any = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "pencil") {
          const xOffSets: any = element.points.map(
            (point: any) => clientX - point[0]
          );
          const yOffSets: any = element.points.map(
            (point: any) => clientY - point[1]
          );
          setSelectedElement({ ...element, xOffSets, yOffSets });
        } else {
          const offsetX: any = clientX - element.x1;
          const offsetY: any = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setAction("moving");
        setElements((prevState: any) => prevState);
      }
    } else {
      if (!elements) return;
      const id: any = elements.length;
      const element: any = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setElements((prevElements: any) => [...prevElements, element]);
      setSelectedElement(element);
      if (tool === "text") {
        setAction("writing");
      } else {
        setAction("drawing");
      }
    }
  };

  const handleMouseMove = (e: any): any => {
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
        setPanOffset((prevOffset: any) => ({
          x: prevOffset.x + deltaX,
          y: prevOffset.y + deltaY,
        }));
        setStartPanMousePosition({ x: clientX, y: clientY });
      } else if (action === "moving" && selectedElement) {
        if (selectedElement.type === "pencil") {
          const newPoints = selectedElement.points.map((_: any, index: any) => [
            clientX - selectedElement.xOffSets[index],
            clientY - selectedElement.yOffSets[index],
          ]);
          const elementsCopy = [...elements];
          elementsCopy[selectedElement.id].points = newPoints;
          setElements(elementsCopy, true);
        } else {
          const { id, x1, y1, x2, y2, type, offsetX, offsetY } =
            selectedElement;
          const width = x2 - x1;
          const height = y2 - y1;
          const newX1 = clientX - offsetX;
          const newY1 = clientY - offsetY;
          const options =
            selectedElement.type === "text"
              ? { text: selectedElement.text }
              : null;
          updateElement(
            id,
            newX1,
            newY1,
            newX1 + width,
            newY1 + height,
            type,
            options
          );
        }
      }
      return;
    }

    if (action === "erasing" && tool === "eraser") {
      const element: any = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        setElements((prevElements: any) =>
          prevElements.filter((el: any) => el.id !== element.id)
        );
      }
      return;
    }
    if (action === "panning") {
      const deltaX: any = clientX - startPanMousePosition.x;
      const deltaY: any = clientY - startPanMousePosition.y;
      setPanOffset((prevOffset: any) => ({
        x: prevOffset.x + deltaX,
        y: prevOffset.y + deltaY,
      }));
    }
    if (tool === "selection") {
      const element: any = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        canvasRef.current.style.cursor = "move";
      }
    }
    if (action === "drawing") {
      if (!elements) return;

      const index: any = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool, {});
    } else if (action === "moving") {
      if (selectedElement.type === "pencil") {
        const newPoints: any = selectedElement.points.map(
          (_: any, index: any) => [
            clientX - selectedElement.xOffSets[index],
            clientY - selectedElement.yOffSets[index],
          ]
        );
        const elementsCopy: any = [...elements];
        elementsCopy[selectedElement.id].points = newPoints;
        setElements(elementsCopy, true);
      } else {
        const { id, x1, y1, x2, y2, type, offsetX, offsetY } = selectedElement;
        const width: any = x2 - x1;
        const height: any = y2 - y1;
        const newX1: any = clientX - offsetX;
        const newY1: any = clientY - offsetY;
        const options: any =
          selectedElement.type === "text"
            ? { text: selectedElement.text }
            : null;
        updateElement(
          id,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          options
        );
      }
    }
  };

  const handleMouseUp = (e: any): any => {
    if (tool === "grab") {
      if (action === "panning") {
        setAction("none");
        canvasRef.current.style.cursor = "grab";
      } else if (action === "moving") {
        setAction("none");
        setSelectedElement(null);
        canvasRef.current.style.cursor = "grab";
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
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
    }
    setAction("none");
    setSelectedElement(null);
    canvasRef.current.style.cursor = "default";
  };

  const handleBlur = (): any => {
    const { id, x1, y1, type } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, {
      text: textAreaRef.current.value,
    });
  };

  const onZoom = (delta: any): any => {
    setScale((prevScale: any) => Math.min(Math.max(prevScale + delta, 0.1), 5));
  };

  let computedLeft: any, computedTop: any;
  if (selectedElement && canvasRef.current) {
    computedLeft =
      scale * (selectedElement.x1 - canvasRef.current.width / 2 + panOffset.x) +
      canvasRef.current.width / 2;
    computedTop =
      scale *
        (selectedElement.y1 - canvasRef.current.height / 2 + panOffset.y) +
      canvasRef.current.height / 2 -
      20;
  }

  return (
    <div className="min-h-screen dark:bg-[#1E1E1E] bg-[#F5F5F5] pt-16">
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
          computedTop={computedTop}
          computedLeft={computedLeft}
          canvasSize={canvasSize}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
}
