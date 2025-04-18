"use client";
import React from "react";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { NotebookPen, Pencil, ListTodo } from "lucide-react";
import { NavBar } from "./ui/tubelight-navbar";
import { ToggleTheme } from "./ToggleTheme";
import NoteKaroLogo from "./NoteKaroLogo";

export function TopNavbar() {
  const links = [
    {
      name: "Home",
      url: "/",
      icon: <NoteKaroLogo />,
    },
    {
      name: "Notes",
      url: "/notes",
      icon: (
        <NotebookPen className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      name: "Sketch",
      url: "/sketch",
      icon: (
        <Pencil className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      name: "TODO",
      url: "/todo",
      icon: (
        <ListTodo className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
    },

    {
      name: "Twitter",
      url: "https://x.com/akshatbajetha",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
      newTab: true,
    },
    {
      name: "GitHub",
      url: "https://github.com/akshatbajetha/notekaro",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-700 dark:text-neutral-300" />
      ),
      newTab: true,
    },
    {
      name: "Toggle Theme",
      icon: <ToggleTheme />,
    },
  ];
  return <NavBar items={links} />;
}
