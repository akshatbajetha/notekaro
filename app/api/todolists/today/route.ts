import { getTodosDueToday } from "@/lib/actions/todo";

export const dynamic = "force-dynamic";

export async function GET() {
  const todayTodos = await getTodosDueToday();
  return new Response(JSON.stringify(todayTodos));
}
