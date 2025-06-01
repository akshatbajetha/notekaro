"use client";

import SideToolBar from "./Toolbar";
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
  // onChange: (e: React.ChangeEvent<HTMLCanvasElement>) => void;
  // onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  // onChange,
  // onTextChange,
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
      <SideToolBar {...toolbarProps} tool={tool} />
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
          // onChange={onTextChange}
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
        onTouchStart={(e) => {
          e.preventDefault();
          if (e.touches.length === 2) {
            // Handle pinch-to-zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const initialDistance = Math.hypot(
              touch2.clientX - touch1.clientX,
              touch2.clientY - touch1.clientY
            );
            const handlePinch = (e: TouchEvent) => {
              if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                  touch2.clientX - touch1.clientX,
                  touch2.clientY - touch1.clientY
                );
                const delta = (currentDistance - initialDistance) * 0.01;
                onZoom(delta);
              }
            };
            const handlePinchEnd = () => {
              document.removeEventListener("touchmove", handlePinch);
              document.removeEventListener("touchend", handlePinchEnd);
            };
            document.addEventListener("touchmove", handlePinch, {
              passive: false,
            });
            document.addEventListener("touchend", handlePinchEnd);
          } else {
            // Handle single touch for drawing/moving/panning/text
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousedown", {
              clientX: touch.clientX,
              clientY: touch.clientY,
              buttons: 1, // Simulate left mouse button
            });

            // If text tool is selected, prevent default touch behavior
            if (tool === "text") {
              e.stopPropagation();
              handleMouseDown(
                mouseEvent as unknown as React.MouseEvent<HTMLCanvasElement>
              );
            } else {
              // If we're not in text mode and there's an active textarea, blur it
              if (action === "writing") {
                handleBlur();
              }
              handleMouseDown(
                mouseEvent as unknown as React.MouseEvent<HTMLCanvasElement>
              );
            }
          }
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousemove", {
              clientX: touch.clientX,
              clientY: touch.clientY,
              buttons: action === "panning" || action === "moving" ? 1 : 0,
            });

            // If text tool is selected, prevent default touch behavior
            if (tool === "text") {
              e.stopPropagation();
            } else {
              // If we're not in text mode and there's an active textarea, blur it
              if (action === "writing") {
                handleBlur();
              }
              handleMouseMove(
                mouseEvent as unknown as React.MouseEvent<HTMLCanvasElement>
              );
            }
          }
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          if (e.touches.length === 0) {
            const touch = e.changedTouches[0];
            const mouseEvent = new MouseEvent("mouseup", {
              clientX: touch.clientX,
              clientY: touch.clientY,
            });

            // If text tool is selected, prevent default touch behavior
            if (tool === "text") {
              e.stopPropagation();
            } else {
              // If we're not in text mode and there's an active textarea, blur it
              if (action === "writing") {
                handleBlur();
              }
              handleMouseUp(
                mouseEvent as unknown as React.MouseEvent<HTMLCanvasElement>
              );
            }
          }
        }}
      >
        Canvas
      </canvas>
    </div>
  );
};

export default CanvasContainer;
