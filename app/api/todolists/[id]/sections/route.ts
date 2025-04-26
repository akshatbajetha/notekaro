// Section operations
// ListId to be sent

import {
  createSectionInList,
  deleteSection,
  getSectionsByListId,
} from "@/lib/actions/todo";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const sections = await getSectionsByListId({ listId: id });
  return new Response(JSON.stringify(sections));
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const listId = id;
  const title = body.title;

  const section = await createSectionInList({ listId, title });
  return new Response(JSON.stringify(section));
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const sectionId = body.sectionId;
  const section = await deleteSection({ sectionId: sectionId });
  return new Response(JSON.stringify(section));
}
