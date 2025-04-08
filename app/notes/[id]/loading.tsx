import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

function loading() {
  return (
    // Skeleton for Note
    <>
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-4 w-[75%]" />
      </div>
    </>
  );
}
export default loading;
