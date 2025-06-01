import Image from "next/image";

function loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image
        src="/loading.gif"
        alt="loading"
        className="w-16 h-16 md:w-24 md:h-24 invert dark:invert-0"
        width={100}
        height={100}
      />
    </div>
  );
}
export default loading;
