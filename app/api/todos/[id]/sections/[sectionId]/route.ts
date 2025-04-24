// Todos inside section operations
// SectionId to be sent

import {
  createTodoInSection,
  deleteTodo,
  getTodosBySectionId,
} from "@/lib/actions/todo";

export async function GET({ params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  const todos = await getTodosBySectionId({ sectionId: sectionId });
  return new Response(JSON.stringify(todos));
}

export async function POST(
  req: Request,
  { params }: { params: { sectionId: string } }
) {
  const { sectionId } = params;
  const body = await req.json();
  const title = body.title;
  const completed = body.completed || false;
  const priority = body.priority || 4;
  const todo = await createTodoInSection({
    sectionId,
    title,
    completed,
    priority,
  });
  return new Response(JSON.stringify(todo));
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const todoId = body.todoId;
  const note = await deleteTodo({ todoId });
  return new Response(JSON.stringify(note));
}
