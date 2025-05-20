"use client";
import { RefObject } from "react";
import { Scale } from "@/types/drawing";

interface TextOverlayProps {
  textAreaRef: RefObject<HTMLTextAreaElement>;
  handleBlur: () => void;
  computedTop: number;
  computedLeft: number;
  scale: Scale;
}

const TextOverlay = ({
  textAreaRef,
  handleBlur,
  computedTop,
  computedLeft,
  scale,
}: TextOverlayProps) => {
  return (
    <textarea
      ref={textAreaRef}
      onBlur={handleBlur}
      className="dark:bg-[#1E1E1E] bg-[#F5F5F5] dark:text-white border border-[#555] rounded-md p-1 resize-none outline-none z-50"
      style={{
        position: "fixed",
        top: computedTop,
        left: computedLeft,
        font: `${24 * scale}px sans-serif`,
        margin: 0,
        overflow: "hidden",
      }}
    />
  );
};

export default TextOverlay;
