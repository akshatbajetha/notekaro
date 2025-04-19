"use client";

import React, { useCallback, useState } from "react";

import Sidebar from "./Sidebar";

function page({ children }: { children: React.ReactNode }) {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);

  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: React.MouseEvent) => {
      if (isResizing) {
        setSidebarWidth(e.clientX);
      }
    },
    [isResizing]
  );
  return (
    <div
      className="flex h-screen dark:bg-[#1E1E1E] bg-[#F5F5F5] dark:text-gray-100 text-gray-900"
      onMouseMove={resize}
      onMouseUp={stopResizing}
      onMouseLeave={stopResizing}
    >
      <Sidebar width={sidebarWidth} />
      <div
        className="w-[2px] bg-gray-500 dark:bg-gray-400 cursor-col-resize  transition-colors"
        onMouseDown={startResizing}
      />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

export default page;
