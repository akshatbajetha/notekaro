import { getNoteById, updateNoteById } from "@/lib/actions/notes";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const note = await getNoteById(params.id);

  return new Response(JSON.stringify(note));
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = params.id;

  const { title, content } = await req.json();

  const updatedNote = await updateNoteById({
    noteId,
    title,
    content,
  });
  return new Response(JSON.stringify(updatedNote));
}
