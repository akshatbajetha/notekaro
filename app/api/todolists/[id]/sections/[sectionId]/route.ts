import {
  createTodoInSection,
  deleteTodo,
  getTodosBySectionId,
  updateSection,
} from "@/lib/actions/todo";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: { id: string; sectionId: string };
  }
) {
  const { sectionId } = params;

  const todos = await getTodosBySectionId({ sectionId: sectionId });
  return new Response(JSON.stringify(todos));
}

export async function POST(
  req: Request,
  { params }: { params: { id: string; sectionId: string } }
) {
  const { sectionId, id: todoListId } = params;
  const body = await req.json();
  const title = body.title;
  const completed = body.completed || false;
  const priority = body.priority || 4;
  const dueDate = body.dueDate || null;
  const todo = await createTodoInSection({
    sectionId,
    todoListId,
    title,
    completed,
    priority,
    dueDate,
  });
  return new Response(JSON.stringify(todo));
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const todoId = body.todoId;
  const todo = await deleteTodo({ todoId });
  return new Response(JSON.stringify(todo));
}

export async function PATCH(
  req: Request,
  { params }: { params: { sectionId: string } }
) {
  const body = await req.json();
  const sectionId = params.sectionId;
  const title = body.title;

  const section = await updateSection({
    sectionId,
    title,
  });

  return new Response(JSON.stringify(section));
}
