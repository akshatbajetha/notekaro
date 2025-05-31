"use client";

import React, { useCallback, useState, useEffect } from "react";
import { PanelLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";

function Page({ children }: { children: React.ReactNode }) {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarWidth(0); // Hide sidebar by default on mobile
      } else {
        setSidebarWidth(240); // Show sidebar by default on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const startResizing = useCallback(() => {
    if (!isMobile) {
      setIsResizing(true);
    }
  }, [isMobile]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: React.MouseEvent) => {
      if (isResizing && !isMobile) {
        const minWidth = 240;
        const maxWidth = 500;
        const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
        setSidebarWidth(newWidth);
      }
    },
    [isResizing, isMobile]
  );

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarWidth(sidebarWidth === 0 ? 240 : 0);
    } else {
      setSidebarWidth(sidebarWidth === 0 ? 240 : 0);
    }
  };

  return (
    <div
      className="flex min-h-screen dark:bg-[#1E1E1E] bg-[#F5F5F5] dark:text-gray-100 text-gray-900"
      onMouseMove={resize}
      onMouseUp={stopResizing}
      onMouseLeave={stopResizing}
    >
      {/* Backdrop for mobile */}
      {isMobile && sidebarWidth <= 0 && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setSidebarWidth(0)}
        />
      )}

      <Sidebar
        width={sidebarWidth}
        isMobile={isMobile}
        onClose={() => setSidebarWidth(0)}
      />

      {/* Resizer - only show on non-mobile */}
      {!isMobile && (
        <div
          className="w-[2px] fixed h-screen z-50 bg-gray-500 dark:bg-gray-400 cursor-col-resize"
          style={{
            left: sidebarWidth,
            opacity: sidebarWidth === 0 ? 0 : 1,
            visibility: sidebarWidth === 0 ? "hidden" : "visible",
          }}
          onMouseDown={startResizing}
        />
      )}

      <div
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        className={cn(
          "flex-1 overflow-y-auto flex flex-col",
          isMobile && "w-full"
        )}
      >
        <button
          onClick={toggleSidebar}
          className="fixed top-7  z-50 p-2 hover:bg-foreground/20 dark:hover:bg-foreground/10 rounded-md transition-all duration-300"
          style={{
            left: isMobile ? "16px" : `${sidebarWidth + 16}px`,
          }}
        >
          {isMobile && sidebarWidth > 0 && (
          <PanelLeft className="w-5 h-5 dark:text-gray-400 text-gray-600" />
          )}
        </button>

        {isMobile && (
          <div className="fixed top-5 left-12 p-2 rounded-md transition-all duration-300">
            <MobileNav />
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default Page;
