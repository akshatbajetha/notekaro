import { createNote, getNotes } from "@/lib/actions/notes";

export async function GET() {
  const notes = await getNotes();

  return new Response(JSON.stringify(notes));
}

export async function POST(req: Request) {
  const body = await req.json();

  const note = await createNote(body.title, body.content);

  return new Response(JSON.stringify(note));
}
