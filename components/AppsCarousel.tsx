"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useTheme } from "next-themes";
import DarkNoteScreenshot from "../public/NotesLandingDark.png";
import LightNoteScreenshot from "../public/NotesLandingLight.png";
import DarkSketchScreenshot from "../public/SketchLandingDark.png";
import LightSketchScreenshot from "../public/SketchLandingLight.png";
import DarkTodoScreenshot from "../public/TodoLandingDark.png";
import LightTodoScreenshot from "../public/TodoLandingLight.png";
import { useEffect, useState } from "react";
import ImageSkeleton from "./ImageSkeleton";

export function AppsCarousel() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  const darkImages = [
    DarkNoteScreenshot,
    DarkSketchScreenshot,
    DarkTodoScreenshot,
  ];

  const lightImages = [
    LightNoteScreenshot,
    LightSketchScreenshot,
    LightTodoScreenshot,
  ];

  if (!mounted) {
    return <ImageSkeleton />;
  }

  return (
    <Carousel
      className="rounded-2xl md:min-h-[500px] md:min-w-[500px] min-h-[300px] min-w-[300px] flex flex-col items-center justify-center"
      setApi={setApi}
    >
      <CarouselContent>
        {(theme === "dark" ? darkImages : lightImages).map((image, index) => (
          <CarouselItem key={index}>
            {/* Image container with frame */}

            <div className="[perspective:1000px]">
              <Image
                src={image}
                alt="App screenshot"
                width={1440}
                height={1080}
                className="[transform:rotateY(-12deg)] scale-100 object-cover rounded-xl  transition-transform duration-500"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
