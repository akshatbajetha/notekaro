"use client";

import React, { useCallback, useState } from "react";

import Sidebar from "./Sidebar";

function Page({ children }: { children: React.ReactNode }) {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: React.MouseEvent) => {
      if (isResizing) {
        const minWidth = 240;
        const maxWidth = 500;
        const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );
  return (
    <div
      className="flex min-h-screen dark:bg-[#1E1E1E] bg-[#F5F5F5] dark:text-gray-100 text-gray-900"
      onMouseMove={resize}
      onMouseUp={stopResizing}
      onMouseLeave={stopResizing}
    >
      <Sidebar width={sidebarWidth} />
      <div
        className="w-[2px] fixed h-screen z-50 bg-gray-500 dark:bg-gray-400 cursor-col-resize transition-colors"
        style={{ left: sidebarWidth }}
        onMouseDown={startResizing}
      />
      <div
        style={{ marginLeft: sidebarWidth }}
        className="flex-1 overflow-y-auto flex flex-col"
      >
        {children}
      </div>
    </div>
  );
}

export default Page;
