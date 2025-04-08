import { Editor } from "@/components/note/DynamicEditor";
import TitleEditor from "@/components/TitleEditor";
import { Separator } from "@/components/ui/separator";
import { getNoteById } from "@/lib/actions/notes";
import { redirect } from "next/navigation";

async function page({ params }: { params: { id: string } }) {
  const noteId = params.id;

  const note = await getNoteById(noteId);

  return note ? (
    <div className="flex-1 flex items-start justify-start flex-col border-2 border-red-500 pt-4 pl-4">
      {/* <textarea
        className="w-full h-max text-2xl bg-transparent pt-2 outline-none"
        defaultValue={note ? note.title : "Untitled"}
      /> */}
      <TitleEditor initialTitle={note.title} noteId={noteId} />
      <Separator className="mb-4" />

      <Editor />
    </div>
  ) : (
    redirect("/notes")
  );
}
export default page;
