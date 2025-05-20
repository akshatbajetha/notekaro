"use client";

import TopToolbar from "./Toolbar";
import BottomToolbar from "./Bottombar";
import TextOverlay from "./TextOverlay";
import { useEffect } from "react";
import {
  Action,
  Tool,
  CanvasRef,
  CanvasSize,
  TextAreaRef,
  Scale,
  ComputedPosition,
} from "@/types/drawing";
import { MouseEvent, WheelEvent } from "react";

interface ToolbarProps {
  undo: () => void;
  redo: () => void;
  onZoom: (delta: number) => void;
  setScale: (scale: Scale) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  color: string;
  setColor: (color: string) => void;
  setTool: (tool: Tool) => void;
}

interface CanvasContainerProps extends ToolbarProps {
  canvasRef: CanvasRef;
  canvasSize: CanvasSize;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent | WheelEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  action: Action;
  computedPosition?: ComputedPosition;
  scale: Scale;
  textAreaRef: TextAreaRef;
  handleBlur: () => void;
  tool: Tool;
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
  ...toolbarProps
}: CanvasContainerProps) => {
  // Function to determine cursor style
  const getCursorStyle = () => {
    if (tool === "grab") {
      if (action === "panning") return "cursor-grabbing";
      if (action === "moving") return "cursor-move";
      return "cursor-grab";
    }
    if (tool === "selection") {
      if (action === "moving") return "cursor-move";
      return "cursor-pointer";
    }
    if (tool === "eraser") return "cursor-cell";
    if (tool === "text") return "cursor-text";
    return "cursor-crosshair";
  };

  useEffect(() => {
    getCursorStyle();
  }, [tool, action]);

  return (
    <div className="relative w-full h-full">
      <TopToolbar {...toolbarProps} tool={tool} />
      <BottomToolbar {...toolbarProps} scale={scale} />

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
        onMouseDown={handleMouseDown as any}
        onMouseMove={handleMouseMove as any}
        onMouseUp={handleMouseUp as any}
      >
        Canvas
      </canvas>
    </div>
  );
};

export default CanvasContainer;
