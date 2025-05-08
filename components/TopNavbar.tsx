"use client";
import React from "react";
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
        <NotebookPen className="h-full w-full text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform duration-150" />
      ),
    },
    {
      name: "Sketch",
      url: "/sketch",
      icon: (
        <Pencil className="h-full w-full text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform duration-150" />
      ),
    },
    {
      name: "TODO",
      url: "/todos",
      icon: (
        <ListTodo className="h-full w-full text-green-600 dark:text-green-400 hover:scale-110 transition-transform duration-150" />
      ),
    },

    {
      name: "Toggle Theme",
      icon: <ToggleTheme />,
    },
  ];
  return <NavBar items={links} />;
}
