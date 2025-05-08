import { getTodosDueToday } from "@/lib/actions/todo";

export async function GET() {
  const todayTodos = await getTodosDueToday();
  return new Response(JSON.stringify(todayTodos));
}
