import { getUpcomingTodos } from "@/lib/actions/todo";

export async function GET() {
  const upcomingTodos = await getUpcomingTodos();
  return new Response(JSON.stringify(upcomingTodos));
}
