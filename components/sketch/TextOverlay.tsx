"use client";

import { Scale, TextAreaRef } from "@/types/drawing";

interface TextOverlayProps {
  textAreaRef: TextAreaRef;
  handleBlur: () => void;
  computedTop: number;
  computedLeft: number;
  scale: Scale;
  // onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextOverlay = ({
  // onChange,
  textAreaRef,
  handleBlur,
  computedTop,
  computedLeft,
  scale,
}: TextOverlayProps) => {
  return (
    <textarea
      ref={textAreaRef}
      // onChange={onChange}
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
