import {
  createTodoList,
  deleteTodo,
  getTodoLists,
  updateTodo,
} from "@/lib/actions/todo";

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
  const todo = await deleteTodo({ todoId });
  return new Response(JSON.stringify(todo));
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const todoId = body.todoId;
  const title = body.title;
  const completed = body.completed;
  const priority = body.priority;
  const dueDate = body.dueDate ? new Date(body.dueDate) : null;

  const todo = await updateTodo({
    id: todoId,
    title,
    completed,
    priority,
    dueDate,
  });
  return new Response(JSON.stringify(todo));
}
