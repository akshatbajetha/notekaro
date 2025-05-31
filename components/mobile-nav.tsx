"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, NotebookPen, Pencil, List, Home } from "lucide-react";
import NoteKaroLogo from "./NoteKaroLogo";
import { Separator } from "./ui/separator";
import { ToggleTheme } from "./ToggleTheme";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden bg-transparent"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col justify-center items-start w-full gap-y-4">
            <NoteKaroLogo />
            <nav className="flex flex-col justify-center items-start w-full gap-y-4 mt-8">
              <Link
                href="/"
                className="text-lg font-medium flex flex-row justify-center items-center gap-x-2"
                onClick={() => setOpen(false)}
              >
                <Home />
                Home
              </Link>
              <Link
                href="/notes"
                className="text-lg font-medium flex flex-row justify-center items-center gap-x-2"
                onClick={() => setOpen(false)}
              >
                <NotebookPen className=" text-blue-600 dark:text-blue-400 " />
                Notes
              </Link>
              <Link
                href="/sketch"
                className="text-lg font-medium flex flex-row justify-center items-center gap-x-2"
                onClick={() => setOpen(false)}
              >
                <Pencil className=" text-purple-600 dark:text-purple-400 " />
                Sketch
              </Link>
              <Link
                href="/todos"
                className="text-lg font-medium flex flex-row justify-center items-center gap-x-2"
                onClick={() => setOpen(false)}
              >
                <List className=" text-green-600 dark:text-green-400 " />
                Todos
              </Link>
            </nav>
            <Separator className="bg-foreground" />
            <div className="flex flex-col justify-center items-start w-full gap-y-4">
              <ToggleTheme />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
