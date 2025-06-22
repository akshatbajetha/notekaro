import { NextResponse } from "next/server";
import { scheduleTodoReminders, listSchedules } from "@/lib/qstash/scheduler";

export async function POST() {
  try {
    // Check if a schedule already exists
    const existingSchedules = await listSchedules();

    // Look for existing todo reminder schedules
    const existingTodoSchedule = existingSchedules.find((schedule) =>
      schedule.destination?.includes("send-todo-reminders")
    );

    if (existingTodoSchedule) {
      return NextResponse.json({
        message: "Todo reminder schedule already exists",
        schedule: existingTodoSchedule,
      });
    }

    // Create new schedule
    const schedule = await scheduleTodoReminders();

    return NextResponse.json({
      message: "Todo reminder schedule created successfully",
      schedule,
    });
  } catch (error) {
    console.error("Error setting up QStash schedule:", error);
    return NextResponse.json(
      { error: "Failed to setup QStash schedule" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const schedules = await listSchedules();
    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("Error listing QStash schedules:", error);
    return NextResponse.json(
      { error: "Failed to list QStash schedules" },
      { status: 500 }
    );
  }
}
