"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useTheme } from "next-themes";
import DarkNoteScreenshot from "../public/note-dark-screenshot.png";
import LightNoteScreenshot from "../public/note-light-screenshot.png";
import { useEffect, useState } from "react";
import ImageSkeleton from "./ImageSkeleton";

export function AppsCarousel() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const darkImages = [
    DarkNoteScreenshot,
    DarkNoteScreenshot,
    DarkNoteScreenshot,
  ];

  const lightImages = [
    LightNoteScreenshot,
    LightNoteScreenshot,
    LightNoteScreenshot,
  ];

  if (!mounted) {
    return <ImageSkeleton />;
  }

  return (
    <Carousel className=" rounded-2xl shadow-lg shadow-black/30 dark:shadow-white/10">
      <CarouselContent>
        {(theme === "dark" ? darkImages : lightImages).map((image, index) => (
          <CarouselItem key={index}>
            {/* Image container with frame */}
            <div className="rounded-2xl border-[10px] border-[#3c3e41] bg-[#a1a4a6] dark:border-[#a1a4a6] dark:bg-[#1e1f21]">
              {/* Image */}
              <Image
                src={image}
                alt="App screenshot"
                width={800}
                height={500}
                className="object-cover rounded-xl"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  );
}
