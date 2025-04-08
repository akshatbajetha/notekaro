import { getNoteById, updateNoteById } from "@/lib/actions/notes";

export async function GET({ params }: { params: { noteId: string } }) {
  const note = await getNoteById(params.noteId);

  return new Response(JSON.stringify(note));
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { title } = await req.json();

  const updatedNote = await updateNoteById(params.id, title);

  return new Response(JSON.stringify(updatedNote));
}
