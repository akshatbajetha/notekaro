import { deleteNote, getNotesById } from "@/lib/actions/notes";

export async function GET({ params }: { params: { noteId: string } }) {
  const note = await getNotesById(params.noteId);

  return new Response(JSON.stringify(note));
}

export async function DELETE({ params }: { params: { noteId: string } }) {
  const note = await deleteNote(params.noteId);

  return new Response(JSON.stringify(note));
}

export async function PATCH({ params }: { params: { noteId: string } }) {}
