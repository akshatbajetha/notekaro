import { Editor } from "@/components/note/DynamicEditor";
import NoteTitleEditor from "@/components/note/NoteTitleEditor";
import { Separator } from "@/components/ui/separator";
import { getNoteById } from "@/lib/actions/notes";
import { redirect } from "next/navigation";
import { toast } from "@/hooks/use-toast";

async function page({ params }: { params: { id: string } }) {
  const noteId = params.id;

  try {
    const note = await getNoteById(noteId);

    if (!note) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this note",
        variant: "destructive",
      });
      return redirect("/notes");
    }

    return (
      <div className="flex-1 dark:bg-[#1E1E1E] bg-[#F5F5F5] flex items-start justify-start flex-col mt-24 pt-14 pl-4 mb-4 ml-24">
        <NoteTitleEditor initialTitle={note.title} noteId={noteId} />
        <Separator className="mb-4" />
        <Editor noteId={noteId} noteContent={note.content} />
      </div>
    );
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load the note",
      variant: "destructive",
    });
    console.log(error);
    return redirect("/notes");
  }
}

export default page;
