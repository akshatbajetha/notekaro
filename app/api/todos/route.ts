import { createTodoList, deleteTodo, getTodoLists } from "@/lib/actions/todo";

export async function GET() {
  const todoLists = await getTodoLists();

  return new Response(JSON.stringify(todoLists));
}

export async function POST(req: Request) {
  const body = await req.json();
  const title = body.title;

  const todoList = await createTodoList({ title });

  return new Response(JSON.stringify(todoList));
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const todoId = body.todoId;
  const note = await deleteTodo({ todoId });
  return new Response(JSON.stringify(note));
}
