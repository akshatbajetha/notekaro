import { Editor } from "@/components/note/DynamicEditor";

function page() {
  return (
    <div className="h-screen flex justify-center items-center border-2 border-red-500">
      <Editor />
    </div>
  );
}
export default page;
