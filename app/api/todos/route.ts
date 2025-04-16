import {
  createTodoList,
  deleteTodoList,
  getTodoLists,
} from "@/lib/actions/todo";

export async function GET() {
  const todoLists = await getTodoLists();

  return new Response(JSON.stringify(todoLists));
}

export async function POST(req: Request) {
  const body = await req.json();

  const todoList = await createTodoList(body.title);

  return new Response(JSON.stringify(todoList));
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const todoListId = body.todoListId;
  const note = await deleteTodoList(todoListId);

  return new Response(JSON.stringify(note));
}
