import { getNoteById, updateNoteById } from "@/lib/actions/notes";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const note = await getNoteById(params.id);

    if (!note) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(note));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    const { title, content } = await req.json();

    if (!title && !content) {
      return new Response(
        JSON.stringify({ error: "No data provided to update" }),
        {
          status: 400,
        }
      );
    }

    const updatedNote = await updateNoteById({
      noteId,
      title,
      content,
    });

    if (!updatedNote) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedNote));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
