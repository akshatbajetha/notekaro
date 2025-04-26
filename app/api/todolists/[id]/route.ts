// Todo List operations

import { deleteTodoList } from "@/lib/actions/todo";

export async function DELETE(req: Request) {
  const body = await req.json();
  const listId = body.todoListId;
  const todoList = await deleteTodoList({ listId: listId });

  return new Response(JSON.stringify(todoList));
}
