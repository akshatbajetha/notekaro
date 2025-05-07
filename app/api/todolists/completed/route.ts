import { getCompletedTodos } from "@/lib/actions/todo";

export async function GET() {
  const completedTodos = await getCompletedTodos();

  return new Response(JSON.stringify(completedTodos));
}
