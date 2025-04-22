import Image from "next/image";
import BenefitsLight from "@/public/benefits-light.png";
import BenefitsDark from "@/public/benefits-dark.png";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ImageSkeleton from "./ImageSkeleton";

function BenefitsImage() {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ImageSkeleton />;
  }
  return (
    <Image
      src={theme === "dark" ? BenefitsDark : BenefitsLight}
      alt="Benefits"
      width={800}
      height={500}
      className="w-full rounded-xl shadow-lg shadow-black/30 dark:shadow-white/10 "
    />
  );
}
export default BenefitsImage;
