// Todos inside list without section operations
// ListId to be sent

import { createTodoInList, getTodosByListId } from "@/lib/actions/todo";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const todos = await getTodosByListId({ listId: id });
  return new Response(JSON.stringify(todos));
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const todoListId = id;
  const todoTitle = body.title;
  const completed = body.completed || false;
  const priority = body.priority || 4;
  const dueDate = body.dueDate || null;

  const todo = await createTodoInList({
    listId: todoListId,
    title: todoTitle,
    completed: completed,
    priority: priority,
    dueDate: dueDate,
  });

  return new Response(JSON.stringify(todo));
}
