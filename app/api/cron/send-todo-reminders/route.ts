import { sendTodoReminders } from "@/lib/actions/todo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid or missing authorization token",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const result = await sendTodoReminders();

    return NextResponse.json({
      success: true,
      message: "Todo reminders sent successfully",
      timestamp: new Date().toISOString(),
      result: result,
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send reminders",
        message: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
