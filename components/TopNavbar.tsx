"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { NotebookPen, Pencil, ListTodo } from "lucide-react";

export function TopNavbar() {
  const links = [
    {
      title: "Notes",
      icon: (
        <NotebookPen className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
      href: "/notes",
    },
    {
      title: "Sketch",
      icon: (
        <Pencil className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
      href: "/sketch",
    },
    {
      title: "TODO",
      icon: (
        <ListTodo className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
      href: "/todo",
    },

    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
      href: "https://x.com/akshatbajetha",
      newTab: true,
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
      href: "https://github.com/akshatbajetha/notekaro",
      newTab: true,
    },
  ];
  return (
    <div className="flex items-center justify-center h-max w-max fixed top-2 left-1/3 border-2 border-muted-foreground rounded-2xl">
      <FloatingDock items={links} />
    </div>
  );
}
