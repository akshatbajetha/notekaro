"use client";

const TextOverlay = ({
  textAreaRef,
  handleBlur,
  computedTop,
  computedLeft,
  scale,
}: any) => {
  return (
    <textarea
      ref={textAreaRef}
      onBlur={handleBlur}
      className="dark:bg-[#1E1E1E] bg-[#F5F5F5] text-white border border-[#555] rounded-md p-1 resize-none outline-none z-50"
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
