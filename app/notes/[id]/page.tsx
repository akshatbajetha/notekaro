import { Editor } from "@/components/note/DynamicEditor";
import Sidebar from "../Sidebar";
import { getNoteById } from "@/lib/actions/notes";

async function page({ params }: { params: { id: string } }) {
  const noteId = params.id;

  const note = await getNoteById(noteId);
  return (
    <div className="flex-1 flex items-center justify-center">
      THIS IS A NOTE with ID {note?.id} and TITLE {note?.title} and CONTENT{" "}
      {JSON.stringify(note?.content)}
    </div>
  );
}
export default page;
