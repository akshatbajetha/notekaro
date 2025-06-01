"use client";

import { Scale, TextAreaRef } from "@/types/drawing";
import { useEffect } from "react";

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
  // Focus and adjust textarea on mount
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.focus();
      // Adjust textarea size based on content
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

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
        minHeight: "24px",
        width: "auto",
        maxWidth: "80vw", // Limit width on mobile
        WebkitTextSizeAdjust: "100%", // Prevent iOS font size adjustment
        WebkitUserSelect: "text", // Enable text selection on iOS
        userSelect: "text",
      }}
      inputMode="text" // Show text keyboard on mobile
      autoCapitalize="none" // Prevent unwanted capitalization
      autoCorrect="off" // Prevent unwanted corrections
      spellCheck="false" // Disable spell check
    />
  );
};

export default TextOverlay;
