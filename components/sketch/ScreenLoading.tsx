import Image from "next/image";

export default function ScreenLoading() {
  return (
    <div className="Loading h-screen w-full flex items-center justify-center bg-background text-loading-text-color text-xl tracking-wide">
      <Image
        src="/loading.gif"
        alt="Loading"
        width={100}
        height={100}
        className="w-10 h-10 md:w-20 md:h-20 invert dark:invert-0"
      />
    </div>
  );
}
