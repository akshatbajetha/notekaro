"use server";

import { prisma } from "../db";
import { getOrCreateUser } from "../getOrCreateUser";
import { Resend } from "resend";
import { TodoReminderTemplate } from "@/components/email/TodoReminderTemplate";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { startOfDay, endOfDay, addDays } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

interface TodoWithList {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate: Date | null;
  userId: string;
  todoListId: string;
  sectionId?: string | null;
  todoList: {
    id: string;
    title: string;
  };
}

export async function getAuthUser() {
  const user = await getOrCreateUser();
  if (!user) return null;

  // Get the full user data including timezone
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      timezone: true,
    },
  });

  return fullUser;
}

export async function getTodoLists() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todoLists = await prisma.todoList.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return todoLists;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return;
  }
}

export async function getTodoListById({ listId }: { listId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todoList = await prisma.todoList.findUnique({
      where: {
        id: listId,
        userId: user.id,
      },
    });
    return todoList;
  } catch (error) {
    console.log("Error while fetching todo list: ", error);
    return null;
  }
}

export async function getSectionsByListId({ listId }: { listId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const sections = await prisma.section.findMany({
      where: {
        todoListId: listId,
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return sections;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return null;
  }
}

export async function getTodosBySectionId({
  sectionId,
}: {
  sectionId: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todos = await prisma.todo.findMany({
      where: {
        sectionId: sectionId,
        completed: false,
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return todos;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return null;
  }
}

export async function getTodosByListId({ listId }: { listId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todos = await prisma.todo.findMany({
      where: {
        todoListId: listId,
        sectionId: null,
        completed: false,
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return todos;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return null;
  }
}

export async function getCompletedTodos() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const completedTodos = await prisma.todo.findMany({
      where: {
        completed: true,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        completed: true,
        updatedAt: true,
        todoList: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return completedTodos;
  } catch (error) {
    console.error("Error fetching completed todos: ", error);
    throw error;
  }
}

export async function createTodoList({ title }: { title: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todoList = await prisma.todoList.create({
      data: {
        title,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return todoList;
  } catch (error) {
    console.log("Error while creating todo list: ", error);
    return;
  }
}

export async function createTodoInList({
  listId,
  title,
  completed,
  priority,
  dueDate,
}: {
  listId: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        completed,
        priority,
        dueDate,
        user: {
          connect: {
            id: user.id,
          },
        },
        todoList: {
          connect: {
            id: listId,
          },
        },
      },
    });

    return todo;
  } catch (error) {
    console.log("Error while creating todo in list: ", error);
    return;
  }
}

export async function createSectionInList({
  listId,
  title,
}: {
  listId: string;
  title: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const section = await prisma.section.create({
      data: {
        title,
        user: {
          connect: {
            id: user.id,
          },
        },
        todoList: {
          connect: {
            id: listId,
          },
        },
      },
    });
    return section;
  } catch (error) {
    console.log("Error while creating section in list: ", error);
    return;
  }
}

export async function createTodoInSection({
  sectionId,
  title,
  completed,
  priority,
  dueDate,
  todoListId,
}: {
  sectionId: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  todoListId: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        completed,
        priority,
        dueDate,
        user: {
          connect: {
            id: user.id,
          },
        },
        section: {
          connect: {
            id: sectionId,
          },
        },
        todoList: {
          connect: {
            id: todoListId,
          },
        },
      },
    });
    return todo;
  } catch (error) {
    console.log("Error while creating todo in section: ", error);
    return;
  }
}

export async function deleteTodoList({ listId }: { listId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // First delete all todos in the list
    await prisma.todo.deleteMany({
      where: {
        todoListId: listId,
      },
    });

    // Then delete all sections in the list
    await prisma.section.deleteMany({
      where: {
        todoListId: listId,
      },
    });

    // Finally delete the list itself
    const todoList = await prisma.todoList.delete({
      where: {
        id: listId,
      },
    });

    return todoList;
  } catch (error) {
    console.log("Error while deleting todo list: ", error);
    return;
  }
}

export async function deleteSection({ sectionId }: { sectionId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // First delete all todos in the section
    await prisma.todo.deleteMany({
      where: {
        sectionId: sectionId,
      },
    });

    // Then delete the section itself
    const section = await prisma.section.delete({
      where: {
        id: sectionId,
      },
    });

    return section;
  } catch (error) {
    console.log("Error while deleting section in list: ", error);
    return;
  }
}

export async function deleteTodo({ todoId }: { todoId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todo = await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    return todo;
  } catch (error) {
    console.log("Error while deleting todo in section: ", error);
    return;
  }
}

export async function updateTodoList({
  listId,
  title,
}: {
  listId: string;
  title: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todoList = await prisma.todoList.update({
      where: {
        id: listId,
        userId: user.id,
      },
      data: {
        title,
      },
    });

    return todoList;
  } catch (error) {
    console.log("Error while updating todo list: ", error);
    return;
  }
}

export async function updateSection({
  sectionId,
  title,
}: {
  sectionId: string;
  title: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const section = await prisma.section.update({
      where: {
        id: sectionId,
        userId: user.id,
      },
      data: {
        title,
      },
    });

    return section;
  } catch (error) {
    console.log("Error while updating section in list: ", error);
    return;
  }
}

export async function updateTodo({
  id,
  title,
  completed,
  priority,
  dueDate,
}: {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  dueDate?: Date | null;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todo = await prisma.todo.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        title,
        completed,
        priority,
        dueDate,
      },
    });

    return todo;
  } catch (error) {
    console.error("Error while updating todo: ", error);
    throw new Error("Failed to update todo");
  }
}

export async function getTodosDueToday() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // Get the user's timezone
    const userTimezone = user.timezone || "UTC";

    // Get current time in user's timezone
    const now = new Date();
    const userNow = toZonedTime(now, userTimezone);

    // Set to start of today in user's timezone
    const startOfToday = startOfDay(userNow);

    // Set to end of today in user's timezone
    const endOfToday = endOfDay(userNow);

    // Convert to UTC for database query
    const startOfTodayUTC = fromZonedTime(startOfToday, userTimezone);
    const endOfTodayUTC = fromZonedTime(endOfToday, userTimezone);

    // Debug logging
    console.log(`[DEBUG] User timezone: ${userTimezone}`);
    console.log(
      `[DEBUG] Start of today (user TZ): ${startOfToday.toISOString()}`
    );
    console.log(`[DEBUG] End of today (user TZ): ${endOfToday.toISOString()}`);
    console.log(
      `[DEBUG] Start of today (UTC): ${startOfTodayUTC.toISOString()}`
    );
    console.log(`[DEBUG] End of today (UTC): ${endOfTodayUTC.toISOString()}`);

    const todos = (await prisma.todo.findMany({
      where: {
        dueDate: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
        completed: false,
        userId: user.id,
      },
      include: {
        todoList: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        priority: "asc",
      },
    })) as TodoWithList[];

    // Convert dates back to user's timezone for display
    const todosWithLocalDates = todos.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate
        ? new Date(
            todo.dueDate.toLocaleString("en-US", { timeZone: userTimezone })
          )
        : null,
    }));

    return todosWithLocalDates;
  } catch (error) {
    console.log("Error while fetching today's todos: ", error);
    return [];
  }
}

export async function getUpcomingTodos() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // Get the user's timezone
    const userTimezone = user.timezone || "UTC";

    // Get current time in user's timezone
    const now = new Date();
    const userNow = toZonedTime(now, userTimezone);

    // Set to start of today in user's timezone
    const startOfToday = startOfDay(userNow);

    // Convert to UTC for database query
    const startOfTodayUTC = fromZonedTime(startOfToday, userTimezone);

    const todos = (await prisma.todo.findMany({
      where: {
        dueDate: {
          gt: startOfTodayUTC,
        },
        completed: false,
        userId: user.id,
      },
      include: {
        todoList: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    })) as TodoWithList[];

    // Convert dates back to user's timezone for display
    const todosWithLocalDates = todos.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate
        ? new Date(
            todo.dueDate.toLocaleString("en-US", { timeZone: userTimezone })
          )
        : null,
    }));

    return todosWithLocalDates;
  } catch (error) {
    console.log("Error while fetching upcoming todos: ", error);
    return [];
  }
}

// export async function sendTodoReminders() {
//   try {
//     // Get all users
//     const users = await prisma.user.findMany();

//     const results = [];

//     for (const user of users) {
//       try {
//         // Get the user's timezone
//         const userTimezone = user.timezone || "UTC";

//         // Get current time in UTC
//         const nowUTC = new Date();

//         // Get current date in user's timezone
//         const userDateStr = nowUTC.toLocaleDateString("en-CA", {
//           timeZone: userTimezone,
//         }); // YYYY-MM-DD format
//         const [year, month, day] = userDateStr.split("-").map(Number);

//         // Calculate tomorrow's date in user's timezone
//         const tomorrow = new Date(year, month - 1, day + 1); // month is 0-indexed

//         // Create start and end of tomorrow in user's timezone
//         const tomorrowStart = new Date(tomorrow);
//         tomorrowStart.setHours(0, 0, 0, 0);

//         const tomorrowEnd = new Date(tomorrow);
//         tomorrowEnd.setHours(23, 59, 59, 999);

//         // Convert to UTC for database query
//         // We need to create the date in the user's timezone and then convert to UTC
//         const tomorrowStartUTC = new Date(
//           tomorrowStart.toLocaleString("en-US", { timeZone: userTimezone })
//         );
//         const tomorrowEndUTC = new Date(
//           tomorrowEnd.toLocaleString("en-US", { timeZone: userTimezone })
//         );

//         // Find todos due tomorrow in user's timezone
//         const todos = await prisma.todo.findMany({
//           where: {
//             userId: user.id,
//             dueDate: {
//               gte: tomorrowStartUTC,
//               lte: tomorrowEndUTC,
//             },
//             completed: false,
//           },
//           include: {
//             todoList: true,
//             section: true,
//           },
//         });

//         if (todos.length > 0) {
//           // Send email
//           await resend.emails.send({
//             from: "Notekaro <reminders@notekaro.com>",
//             to: user.email,
//             subject: "Your Upcoming Todos for Tomorrow",
//             react: TodoReminderTemplate({
//               todos,
//               userName: user.email.split("@")[0],
//             }),
//           });

//           results.push({
//             userId: user.id,
//             status: "success",
//             todosCount: todos.length,
//           });
//         } else {
//           results.push({
//             userId: user.id,
//             status: "skipped",
//             reason: "no_todos",
//           });
//         }
//       } catch (error) {
//         console.error(`Error processing user ${user.email}:`, error);
//         results.push({
//           userId: user.id,
//           status: "error",
//           error: error instanceof Error ? error.message : "Unknown error",
//         });
//       }
//     }

//     return {
//       success: true,
//       processed: results.length,
//       results,
//     };
//   } catch (error) {
//     console.error("Error sending todo reminders:", error);
//     throw new Error("Failed to send todo reminders");
//   }
// }

export async function sendTodoReminders() {
  try {
    // Get all users with their timezones
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        timezone: true,
      },
    });

    const results = [];

    for (const user of users) {
      try {
        const userTimezone = user.timezone || "UTC";

        // Get current time in user's timezone
        const nowInUserTZ = toZonedTime(new Date(), userTimezone);

        // Get tomorrow in user's timezone
        const tomorrowInUserTZ = addDays(nowInUserTZ, 1);

        // Get start and end of tomorrow in user's timezone
        const tomorrowStartLocal = startOfDay(tomorrowInUserTZ);
        const tomorrowEndLocal = endOfDay(tomorrowInUserTZ);

        // Convert to UTC for database query
        const tomorrowStartUTC = fromZonedTime(
          tomorrowStartLocal,
          userTimezone
        );
        const tomorrowEndUTC = fromZonedTime(tomorrowEndLocal, userTimezone);

        // Find todos due tomorrow
        const todos = await prisma.todo.findMany({
          where: {
            userId: user.id,
            dueDate: {
              gte: tomorrowStartUTC,
              lte: tomorrowEndUTC,
            },
            completed: false,
          },
          include: {
            todoList: {
              select: { title: true },
            },
            section: {
              select: { title: true },
            },
          },
        });

        if (todos.length > 0) {
          // Debug logging
          console.log(
            `[DEBUG] Processing user ${user.email} in timezone ${userTimezone}`
          );
          console.log(
            `[DEBUG] Tomorrow in user TZ: ${tomorrowInUserTZ.toISOString()}`
          );
          console.log(
            `[DEBUG] Tomorrow start UTC: ${tomorrowStartUTC.toISOString()}`
          );
          console.log(
            `[DEBUG] Tomorrow end UTC: ${tomorrowEndUTC.toISOString()}`
          );
          console.log(`[DEBUG] Found ${todos.length} todos for tomorrow`);

          // Send email
          await resend.emails.send({
            from: "Notekaro <reminders@notekaro.com>",
            to: user.email,
            subject: "Your Upcoming Todos for Tomorrow",
            react: TodoReminderTemplate({
              todos,
              userName: user.email.split("@")[0],
              userTimezone: userTimezone,
            }),
          });

          results.push({
            userId: user.id,
            status: "success",
            todosCount: todos.length,
            timezone: userTimezone,
          });
        } else {
          results.push({
            userId: user.id,
            status: "skipped",
            reason: "no_todos",
            timezone: userTimezone,
          });
        }
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
        results.push({
          userId: user.id,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return {
      success: true,
      processed: results.length,
      results,
    };
  } catch (error) {
    console.error("Error sending todo reminders:", error);
    throw new Error("Failed to send todo reminders");
  }
}
