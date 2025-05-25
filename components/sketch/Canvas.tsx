"use client";

import TopToolbar from "./Toolbar";
import BottomToolbar from "./Bottombar";
import TextOverlay from "./TextOverlay";
import { useEffect } from "react";
import {
  CanvasRef,
  CanvasSize,
  TextAreaRef,
  Scale,
  ComputedPosition,
  DrawingElement,
} from "@/types/drawing";

interface CanvasContainerProps {
  tool: DrawingElement["type"] | "selection" | "grab" | "eraser";
  setTool: (
    tool: DrawingElement["type"] | "selection" | "grab" | "eraser"
  ) => void;
  brushSize: 1 | 2 | 3 | 4 | 5;
  setBrushSize: (size: 1 | 2 | 3 | 4 | 5) => void;
  color: string;
  setColor: (color: string) => void;
  scale: Scale;
  setScale: (scale: Scale) => void;
  onZoom: (delta: number) => void;
  undo: () => void;
  redo: () => void;
  canvasRef: CanvasRef;
  textAreaRef: TextAreaRef;
  action: "panning" | "moving" | "writing" | "drawing" | "erasing" | "none";
  handleBlur: () => void;
  computedPosition: ComputedPosition | undefined;
  canvasSize: CanvasSize;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  selectedElement: DrawingElement | null;
  panOffset: { x: number; y: number };
}

const CanvasContainer = ({
  canvasRef,
  canvasSize,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  action,
  computedPosition,
  scale,
  textAreaRef,
  handleBlur,
  tool,
  onZoom,
  undo,
  redo,
  ...toolbarProps
}: CanvasContainerProps) => {
  // Function to determine cursor style
  const getCursorStyle = () => {
    if (tool === "grab") {
      if (action === "panning") {
        return "cursor-grabbing";
      }
      return "cursor-grab";
    }
    if (tool === "selection") {
      if (action === "moving") {
        return "cursor-move";
      }
      return "cursor-default";
    }
    if (tool === "text") {
      return "cursor-text";
    }
    if (tool === "eraser") {
      return "cursor-none";
    }
    return "cursor-crosshair";
  };

  // Handle wheel event for zooming
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      onZoom(delta);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      if (tool === "eraser") {
        canvasRef.current.style.cursor = "none";
        // Create or update the eraser cursor
        let cursor = document.getElementById("eraser-cursor");
        if (!cursor) {
          cursor = document.createElement("div");
          cursor.id = "eraser-cursor";
          cursor.style.position = "fixed";
          cursor.style.width = "8px";
          cursor.style.height = "8px";
          cursor.style.backgroundColor = "black";
          cursor.style.borderRadius = "50%";
          cursor.style.pointerEvents = "none";
          cursor.style.transform = "translate(-50%, -50%)";
          cursor.style.zIndex = "9999";
          document.body.appendChild(cursor);
        }
        // Update cursor position on mouse move
        const updateCursor = (e: MouseEvent) => {
          cursor!.style.left = e.clientX + "px";
          cursor!.style.top = e.clientY + "px";
        };
        document.addEventListener("mousemove", updateCursor);
        return () => {
          document.removeEventListener("mousemove", updateCursor);
          cursor?.remove();
        };
      } else {
        canvasRef.current.style.cursor = getCursorStyle().replace(
          "cursor-",
          ""
        );
        // Remove eraser cursor if it exists
        const cursor = document.getElementById("eraser-cursor");
        cursor?.remove();
      }
    }
  }, [tool, action]);

  return (
    <div className="relative w-full h-full">
      <TopToolbar {...toolbarProps} tool={tool} />
      <BottomToolbar
        {...toolbarProps}
        scale={scale}
        onZoom={onZoom}
        undo={undo}
        redo={redo}
      />

      {action === "writing" && computedPosition && (
        <TextOverlay
          textAreaRef={textAreaRef}
          handleBlur={handleBlur}
          computedTop={computedPosition.top}
          computedLeft={computedPosition.left}
          scale={scale}
        />
      )}

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${getCursorStyle()}`}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        Canvas
      </canvas>
    </div>
  );
};

export default CanvasContainer;
