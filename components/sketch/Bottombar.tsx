"use client";
import { Scale } from "@/types/drawing";
import { Undo2, Redo2, Minus, Plus } from "lucide-react";
import { Separator } from "../ui/separator";

interface BottomToolbarProps {
  undo: () => void;
  redo: () => void;
  onZoom: (delta: number) => void;
  scale: Scale;
  setScale: (scale: Scale) => void;
}

const BottomToolbar = ({
  undo,
  redo,
  onZoom,
  scale,
  setScale,
}: BottomToolbarProps) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 dark:bg-[#1E1E1E] bg-[#F5F5F5] px-4 py-2 rounded-xl border border-[#333] h-10 shadow-lg">
      <button onClick={undo} title="Undo">
        <Undo2 className="w-5 h-5 dark:text-white hover:text-purple-400" />
      </button>
      <button onClick={redo} title="Redo">
        <Redo2 className="w-5 h-5 dark:text-white hover:text-purple-400" />
      </button>
      <Separator
        orientation="vertical"
        className=" bg-[#1E1E1E] dark:bg-[#F5F5F5]"
      />
      <button onClick={() => onZoom(-0.1)} title="Zoom Out">
        <Minus className="w-5 h-5 dark:text-white hover:text-purple-400" />
      </button>
      <span
        onClick={() => setScale(1)}
        className="cursor-pointer text-sm dark:text-white font-medium hover:text-purple-400"
      >
        {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
      </span>
      <button onClick={() => onZoom(0.1)} title="Zoom In">
        <Plus className="w-5 h-5 dark:text-white hover:text-purple-400" />
      </button>
    </div>
  );
};

export default BottomToolbar;
