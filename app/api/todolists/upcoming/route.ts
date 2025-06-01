import { getUpcomingTodos } from "@/lib/actions/todo";

export const dynamic = "force-dynamic";

export async function GET() {
  const upcomingTodos = await getUpcomingTodos();
  return new Response(JSON.stringify(upcomingTodos));
}
