import { NextResponse } from "next/server";
import { sendTodoReminders } from "@/lib/actions/todo";

export async function GET() {
  try {
    const result = await sendTodoReminders();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in todo reminders route:", error);
    return NextResponse.json(
      { error: "Failed to send todo reminders" },
      { status: 500 }
    );
  }
}
