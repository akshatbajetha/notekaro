"use client";
import {
  Minus,
  Square,
  Circle,
  MousePointerClick,
  Pencil,
  Eraser,
  TextIcon,
  Hand,
  ArrowRight,
} from "lucide-react";
import { Tool } from "@/types/drawing";

interface SideToolBarProps {
  setTool: (tool: Tool) => void;
  brushSize: number;
  setBrushSize: (size: 1 | 2 | 3 | 4 | 5) => void;
  color: string;
  setColor: (color: string) => void;
  tool: Tool;
}

const SideToolBar = ({
  setTool,
  brushSize,
  setBrushSize,
  color,
  setColor,
  tool,
}: SideToolBarProps) => {
  return (
    <div className="absolute md:top-4 md:right-8 top-6 z-20 dark:bg-[#1E1E1E] bg-[#F5F5F5] border border-[#333] rounded-xl shadow-lg px-5 py-2 flex md:flex-col md:items-center md:justify-center gap-3 md:flex-nowrap flex-wrap">
      <button
        onClick={() => setTool("grab")}
        title="Grab"
        className={`p-1 rounded-md transition-colors ${
          tool === "grab" ? "bg-purple-500 text-white" : "hover:text-purple-400"
        }`}
      >
        <Hand className="md:w-5 md:h-5 w-4 h-4 dark:text-white" />
      </button>
      <button
        onClick={() => setTool("selection")}
        title="Select"
        className={`p-1 rounded-md transition-colors ${
          tool === "selection"
            ? "bg-purple-500 text-white"
            : "hover:text-purple-400"
        }`}
      >
        <MousePointerClick className="md:w-5 md:h-5 w-4 h-4 dark:text-white" />
      </button>
      <button
        onClick={() => setTool("line")}
        title="Line"
        className={`p-1 rounded-md transition-colors ${
          tool === "line" ? "bg-purple-500 text-white" : "hover:text-purple-400"
        }`}
      >
        <Minus className="md:w-5 md:h-5 w-4 h-4 dark:text-white rotate-[-45deg]" />
      </button>
      <button
        onClick={() => setTool("arrow")}
        title="Arrow"
        className={`p-1 rounded-md transition-colors ${
          tool === "arrow"
            ? "bg-purple-500 text-white"
            : "hover:text-purple-400"
        }`}
      >
        <ArrowRight className="md:w-5 md:h-5 w-4 h-4 dark:text-white" />
      </button>
      <button
        onClick={() => setTool("rect")}
        title="Rectangle"
        className={`p-1 rounded-md transition-colors ${
          tool === "rect" ? "bg-purple-500 text-white" : "hover:text-purple-400"
        }`}
      >
        <Square className="md:w-5 md:h-5 w-4 h-4 dark:text-white" />
      </button>
      <button
        onClick={() => setTool("circle")}
        title="Circle"
        className={`p-1 rounded-md transition-colors ${
          tool === "circle"
            ? "bg-purple-500 text-white"
            : "hover:text-purple-400"
        }`}
      >
        <Circle className="md:w-5 md:h-5 w-4 h-4 dark:text-white" />
      </button>
      <button
        onClick={() => setTool("diamond")}
        title="Diamond"
        className={`p-1 rounded-md transition-colors ${
          tool === "diamond"
            ? "bg-purple-500 text-white"
            : "hover:text-purple-400"
        }`}
      >
        <Square className="md:w-5 md:h-5 w-4 h-4 dark:text-white rotate-45" />
      </button>

      <button
        onClick={() => setTool("pencil")}
        title="Pencil"
        className={`p-1 rounded-md transition-colors ${
          tool === "pencil"
            ? "bg-purple-500 text-white"
            : "hover:text-purple-400"
        }`}
      >
        <Pencil className="md:w-5 md:h-5 w-4 h-4 dark:text-white" />
      </button>
      <button
        onClick={() => setTool("text")}
        title="Text"
        className={`p-1 rounded-md transition-colors ${
          tool === "text" ? "bg-purple-500 text-white" : "hover:text-purple-400"
        }`}
      >
        <TextIcon className="md:w-5 md:h-5 w-4 h-4 dark:text-white" />
      </button>
      <button
        onClick={() => setTool("eraser")}
        title="Eraser"
        className={`p-1 rounded-md transition-colors ${
          tool === "eraser"
            ? "bg-purple-500 text-white"
            : "hover:text-purple-400"
        }`}
      >
        <Eraser className="md:w-5 md:h-5 w-4 h-4 dark:text-white" />
      </button>
      <input
        type="range"
        min={1}
        max={5}
        value={brushSize}
        onChange={(e) =>
          setBrushSize(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
        }
        className="accent-purple-500"
        title="Brush Size"
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-6 h-6 bg-transparent border-none cursor-pointer"
        title="Color"
      />
    </div>
  );
};

export default SideToolBar;
