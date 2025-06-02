"use client";

import { useLocalStorage } from "./use-local-storage";
import { HistoryState, SetStateAction } from "@/types/drawing";

const useHistory = (initialState: HistoryState) => {
  const [index, setIndex] = useLocalStorage<number>("history-index", 0);
  const [history, setHistory] = useLocalStorage<HistoryState[]>(
    "drawing-history",
    [initialState]
  );

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
