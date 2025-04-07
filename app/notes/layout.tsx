"use client";

import React, { useEffect, useState } from "react";

import Sidebar from "./Sidebar";

interface Note {
  id: string;
  title: string;
  content: string;
}

function page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen dark:bg-[#191919] bg-[#F5F5F5] dark:text-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

export default page;
