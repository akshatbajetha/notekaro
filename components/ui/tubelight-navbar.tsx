"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  url?: string;
  icon: React.ReactNode;
  newTab?: boolean;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);
  console.log(isMobile);
  const currentPage = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    switch (currentPage) {
      case "/":
        setActiveTab(items[0].name);
        break;
      case "/notes":
        setActiveTab(items[1].name);
        break;
      case "/sketch":
        setActiveTab(items[2].name);
        break;
      case "/todo":
        setActiveTab(items[3].name);
        break;
      default:
        setActiveTab(items[0].name);
    }
  }, [currentPage]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className
      )}
    >
      <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return item.url ? (
            <Link
              key={item.name}
              href={item.url}
              title={item.name}
              target={item.newTab ? "_blank" : "_self"}
              onClick={() => (!item.newTab ? setActiveTab(item.name) : null)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary"
              )}
            >
              {/* <span className="hidden md:inline">{item.name}</span> */}
              <span>{Icon}</span>
              {isActive && !item.newTab && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          ) : (
            <div key={item.name}>{item.icon}</div>
          );
        })}
      </div>
    </div>
  );
}
