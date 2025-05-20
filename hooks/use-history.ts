"use client";

import { useState } from "react";
import { HistoryState, SetStateAction } from "@/types/drawing";
import { Drawable } from "roughjs/bin/core";

// Define the shape of a drawing element
interface DrawingElement {
  id: number;
  type: "line" | "rect" | "circle" | "diamond" | "pencil" | "text";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  points?: [number, number][];
  text?: string;
  options?: {
    strokeWidth: number;
    stroke: string;
  };
  roughElement?: Drawable; // Keeping this as any since it's from rough.js
}

const useHistory = (initialState: HistoryState) => {
  const [index, setIndex] = useState<number>(0);
  const [history, setHistory] = useState<HistoryState[]>([initialState]);

  const setState = (
    action: SetStateAction<HistoryState>,
    overwrite = false
  ) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;

    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedHistory = history.slice(0, index + 1);
      setHistory([...updatedHistory, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => {
    if (index > 0) {
      setIndex((prevState) => prevState - 1);
    }
  };

  const redo = () => {
    if (index < history.length - 1) {
      setIndex((prevState) => prevState + 1);
    }
  };

  return [history[index], setState, undo, redo] as const;
};

export default useHistory;
