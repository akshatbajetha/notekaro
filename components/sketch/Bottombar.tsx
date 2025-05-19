"use client";
import { Undo2, Redo2, ZoomIn, ZoomOut } from "lucide-react";

const BottomToolbar = ({ undo, redo, onZoom, scale, setScale }: any) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 dark:bg-[#1E1E1E] bg-[#F5F5F5] px-4 py-2 rounded-xl border border-[#333] shadow-lg">
      <button onClick={undo} title="Undo">
        <Undo2 className="w-5 h-5 text-white hover:text-purple-400" />
      </button>
      <button onClick={redo} title="Redo">
        <Redo2 className="w-5 h-5 text-white hover:text-purple-400" />
      </button>
      <button onClick={() => onZoom(-0.1)} title="Zoom Out">
        <ZoomOut className="w-5 h-5 text-white hover:text-purple-400" />
      </button>
      <span
        onClick={() => setScale(1)}
        className="cursor-pointer text-sm text-white font-medium hover:text-purple-400"
      >
        {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
      </span>
      <button onClick={() => onZoom(0.1)} title="Zoom In">
        <ZoomIn className="w-5 h-5 text-white hover:text-purple-400" />
      </button>
    </div>
  );
};

export default BottomToolbar;
