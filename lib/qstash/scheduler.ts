import { qstash } from "./client";

export async function scheduleTodoReminders() {
  try {
    // Schedule the cron job to run at 3 PM UTC every day
    const schedule = await qstash.schedules.create({
      cron: "0 15 * * *", // 3 PM UTC every day
      destination: `${process.env.NEXT_PUBLIC_APP_URL}/api/cron/send-todo-reminders`,
      retries: 1, // Only 1 retry as specified
    });

    console.log("Todo reminders scheduled successfully:", schedule);
    return schedule;
  } catch (error) {
    console.error("Failed to schedule todo reminders:", error);
    throw error;
  }
}

export async function listSchedules() {
  try {
    const schedules = await qstash.schedules.list();
    return schedules;
  } catch (error) {
    console.error("Failed to list schedules:", error);
    throw error;
  }
}

export async function deleteSchedule(scheduleId: string) {
  try {
    await qstash.schedules.delete(scheduleId);
    console.log(`Schedule ${scheduleId} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete schedule ${scheduleId}:`, error);
    throw error;
  }
}
