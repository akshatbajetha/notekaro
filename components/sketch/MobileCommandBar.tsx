"use client";

import type React from "react";

import { Plus, Minus } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";

interface MobileCommandBarProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

export function MobileCommandBar({ scale, setScale }: MobileCommandBarProps) {
  return (
    <>
      <footer className="Appbar_Bottom Mobile_Appbar fixed bottom-0 left-0 right-0 z-50 md:hidden w-full max-w-full min-w-full ">
        <div className="mx-auto w-full max-w-full min-w-full px-4 pb-4">
          <div className="flex items-center justify-between rounded-[8px] p-2">
            <ScaleWidget scale={scale} setScale={setScale} />
          </div>
        </div>
      </footer>
    </>
  );
}

function ScaleWidget({
  scale,
  setScale,
}: {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}) {
  const zoomIn = () => {
    setScale((prevScale: number) => Math.min(prevScale + 0.05, 5));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.05, 0.2));
  };

  const resetScale = () => {
    setScale(1);
  };
  return (
    <>
      <div className="rounded-lg flex items-center bg-white dark:bg-w-bg surface-box-shadow">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomOut}
                className="w-9 h-9 rounded-l-lg rounded-r-none bg-light-btn-bg text-text-primary-color dark:bg-w-bg dark:hover:bg-d-btn-hover-bg dark:text-w-text select-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark:bg-w-bg dark:text-white">
              Zoom Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetScale}
                className="w-14 px-3 h-9 rounded-none bg-light-btn-bg text-text-primary-color dark:bg-w-bg dark:hover:bg-d-btn-hover-bg dark:text-w-text select-none"
              >
                {Math.round(scale * 100)}%
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark:bg-w-bg dark:text-white">
              Reset Scale
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomIn}
                className="w-9 h-9 rounded-r-lg rounded-l-none bg-light-btn-bg text-text-primary-color dark:bg-w-bg dark:hover:bg-d-btn-hover-bg dark:text-w-text select-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark:bg-w-bg dark:text-white">
              Zoom In
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}

// TODO: Add shapes options for mobile
