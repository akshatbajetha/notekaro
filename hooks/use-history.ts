"use client";

import { useState } from "react";

const useHistory = (initialState: any) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action: any, overwrite = false) => {
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

  return [history[index], setState, undo, redo];
};

export default useHistory;
