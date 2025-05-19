"use client";

import TopToolbar from "./Toolbar";
import BottomToolbar from "./Bottombar";
import TextOverlay from "./TextOverlay";
import { useEffect } from "react";

const CanvasContainer = ({
  canvasRef,
  canvasSize,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  action,
  computedTop,
  computedLeft,
  scale,
  textAreaRef,
  handleBlur,
  tool,
  ...toolbarProps
}: any) => {
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

      {action === "writing" && (
        <TextOverlay
          textAreaRef={textAreaRef}
          handleBlur={handleBlur}
          computedTop={computedTop}
          computedLeft={computedLeft}
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
      >
        Canvas
      </canvas>
    </div>
  );
};

export default CanvasContainer;
