import { deleteNote, getNoteById } from "@/lib/actions/notes";

export async function GET({ params }: { params: { noteId: string } }) {
  const note = await getNoteById(params.noteId);

  return new Response(JSON.stringify(note));
}

export async function DELETE({ params }: { params: { noteId: string } }) {
  const note = await deleteNote(params.noteId);

  return new Response(JSON.stringify(note));
}

export async function PATCH({ params }: { params: { noteId: string } }) {}
