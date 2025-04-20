"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href="/"
            className="text-lg font-medium"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="#features"
            className="text-lg font-medium"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#benefits"
            className="text-lg font-medium"
            onClick={() => setOpen(false)}
          >
            Benefits
          </Link>
          <Link
            href="#how-it-works"
            className="text-lg font-medium"
            onClick={() => setOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-lg font-medium"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#download"
            className="text-lg font-medium"
            onClick={() => setOpen(false)}
          >
            Download
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
