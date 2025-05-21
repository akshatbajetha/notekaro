"use client";

import React, { useCallback, useState } from "react";
import { PanelLeft } from "lucide-react";
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
        className="w-[2px] fixed h-screen z-50 bg-gray-500 dark:bg-gray-400 cursor-col-resize"
        style={{
          left: sidebarWidth,
          opacity: sidebarWidth === 0 ? 0 : 1,
          visibility: sidebarWidth === 0 ? "hidden" : "visible",
        }}
        onMouseDown={startResizing}
      />
      <div
        style={{ marginLeft: sidebarWidth }}
        className="flex-1 overflow-y-auto flex flex-col"
      >
        <button
          onClick={() => setSidebarWidth(sidebarWidth === 0 ? 240 : 0)}
          className="fixed top-4 left-4 z-50 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-all duration-300"
          style={{
            left: sidebarWidth === 0 ? "16px" : `${sidebarWidth + 16}px`,
          }}
        >
          <PanelLeft className="w-5 h-5 dark:text-gray-400 text-gray-600" />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Page;
