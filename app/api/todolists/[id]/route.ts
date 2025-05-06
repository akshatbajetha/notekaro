// Todo List operations

import {
  deleteTodoList,
  getTodoListById,
  updateTodoList,
} from "@/lib/actions/todo";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const todoList = await getTodoListById({ listId: id });

  return new Response(JSON.stringify(todoList));
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const listId = body.todoListId;
  const todoList = await deleteTodoList({ listId: listId });

  return new Response(JSON.stringify(todoList));
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const listId = params.id;
  const title = body.title;

  const todoList = await updateTodoList({ listId, title });

  return new Response(JSON.stringify(todoList));
}
