/**
 * CRON ROUTE - DO NOT USE IN PRODUCTION
 * This route is for sending todo reminders to users at 6 PM every day.
 * It triggers the sendTodoReminders function.
 */

import { NextResponse } from "next/server";
import { sendTodoReminders } from "@/lib/actions/todo";
import { verifyQStashWebhook } from "@/lib/qstash/verify";

export async function POST(request: Request) {
  try {
    // Verify QStash signature for security
    const isValid = await verifyQStashWebhook(request);

    if (!isValid) {
      console.error("Invalid QStash webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Process the todo reminders
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
