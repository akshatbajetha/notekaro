import { Editor } from "@/components/note/DynamicEditor";

function page() {
  return (
    <div className="min-h-screen w-[75vw] right-1/2 flex justify-center items-center border-2 border-red-500">
      <Editor />
    </div>
  );
}
export default page;
