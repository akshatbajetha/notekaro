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
    <Carousel className="w-full max-h-[500px]">
      <CarouselContent>
        {(theme === "dark" ? darkImages : lightImages).map((image, index) => (
          <CarouselItem key={index}>
            {/* Image container with frame */}
            <div className="w-full h-full rounded-xl border-[10px] border-[#CBD5E1] bg-[#F8FAFC] dark:border-[#4B5563] dark:bg-[#1F2937]">
              {/* Image */}
              <Image
                src={image}
                alt="App screenshot"
                width={800}
                height={500}
                className="w-full h-full object-cover rounded-xl"
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

{
  /* <Image
  src={
    theme === "dark"
      ? "/note-dark-screenshot.png"
      : "/note-light-screenshot.png"
  }
  width={800}
  height={500}
  alt="App screenshot"
  className="w-full"
/>; */
}
