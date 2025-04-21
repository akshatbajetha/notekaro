import { Editor } from "@/components/note/DynamicEditor";
import NoteTitleEditor from "@/components/note/NoteTitleEditor";
import { Separator } from "@/components/ui/separator";
import { getNoteById, updateNoteById } from "@/lib/actions/notes";
import { redirect } from "next/navigation";

async function page({ params }: { params: { id: string } }) {
  const noteId = params.id;

  const note = await getNoteById(noteId);

  return note ? (
    <div className="flex-1 dark:bg-[#1E1E1E] bg-[#F5F5F5] flex items-start justify-start flex-col mt-24 pt-14 pl-4 mb-4">
      <NoteTitleEditor initialTitle={note.title} noteId={noteId} />
      <Separator className="mb-4" />

      <Editor noteId={noteId} noteContent={note.content} />
    </div>
  ) : (
    redirect("/notes")
  );
}
export default page;
