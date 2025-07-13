"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FloatingContactButton() {
  return (
    <Link
      href="/contact"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contact"
    >
      <div className="relative">
        {/* Subtle background glow on hover */}
        <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Main button */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:bg-white dark:group-hover:bg-gray-800">
          <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Contact
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      </div>
    </Link>
  );
}
