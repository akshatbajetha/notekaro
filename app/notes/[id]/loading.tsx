import { Skeleton } from "@/components/ui/skeleton";

function loading() {
  return (
    <div className="h-screen w-full flex justify-start gap-y-14 flex-col pb-4 pt-12">
      <Skeleton className="h-4 w-[40%] mx-4 mt-14" />
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-4 w-[65%] mx-4" />
        <Skeleton className="h-4 w-[75%] mx-4" />
      </div>
    </div>
  );
}
export default loading;
